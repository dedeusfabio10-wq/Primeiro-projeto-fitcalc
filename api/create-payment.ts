
import { MercadoPagoConfig, Payment } from 'mercadopago';
import crypto from 'crypto';

export default async function handler(req, res) {
  // 1. Permite apenas requisições POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Limpeza e validação do Token
  let accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    console.error("Erro: MERCADOPAGO_ACCESS_TOKEN não configurado.");
    return res.status(500).json({ error: "Erro de configuração no servidor (Token ausente). Faça um Redeploy na Vercel." });
  }

  // Remove espaços em branco nas pontas
  accessToken = accessToken.trim();
  // Remove aspas extras se houver (erro comum ao copiar/colar)
  if ((accessToken.startsWith('"') && accessToken.endsWith('"')) || (accessToken.startsWith("'") && accessToken.endsWith("'"))) {
      accessToken = accessToken.slice(1, -1);
  }

  try {
    const { title, price, name, email } = req.body;

    // 3. Valida dados básicos
    if (!price || !email) {
      return res.status(400).json({ error: 'Dados incompletos: email ou preço faltando.' });
    }

    const client = new MercadoPagoConfig({ 
        accessToken,
        options: { timeout: 10000 }
    });
    
    const payment = new Payment(client);

    // Tratamento do Nome (Mercado Pago prefere first_name e last_name separados)
    const nameParts = name ? name.trim().split(' ') : ['Cliente'];
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Premium';

    const paymentData = {
      transaction_amount: Number(parseFloat(price).toFixed(2)),
      description: title || 'FitCalc Premium',
      payment_method_id: 'pix',
      payer: {
        email: email,
        first_name: firstName,
        last_name: lastName,
      },
    };

    // Gera uma chave de idempotência única para evitar pagamentos duplicados se o usuário clicar várias vezes
    const idempotencyKey = crypto.randomUUID();

    console.log(`Iniciando pagamento PIX para ${email} (Token prefix: ${accessToken.substring(0, 5)}...)`);

    // 4. Cria o pagamento
    const paymentResponse = await payment.create({ 
        body: paymentData,
        requestOptions: { idempotencyKey: idempotencyKey }
    });

    // 5. Verifica e retorna o QR Code
    if (paymentResponse && paymentResponse.point_of_interaction) {
        const transactionData = paymentResponse.point_of_interaction.transaction_data;
        
        if (transactionData) {
            return res.status(200).json({ 
                success: true,
                paymentId: paymentResponse.id,
                qrCodeBase64: transactionData.qr_code_base64,
                qrCodeCopyPaste: transactionData.qr_code
            });
        }
    }

    console.error('Resposta inesperada do Mercado Pago:', paymentResponse);
    return res.status(500).json({ error: 'O Mercado Pago não retornou o QR Code.', details: JSON.stringify(paymentResponse) });

  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error);
    
    // Mensagem de erro amigável
    const errorMessage = error.message || 'Erro desconhecido';
    let userFriendlyError = 'Falha ao processar pagamento PIX.';
    
    // Identifica erro de autorização especificamente
    if (errorMessage.includes('UNAUTHORIZED') || (error.status === 401)) {
        userFriendlyError = 'Erro de Autenticação com o Mercado Pago. A chave de API (Access Token) parece estar inválida, expirada ou bloqueada.';
    }

    const errorDetails = error.cause ? JSON.stringify(error.cause) : (error.stack || '');
    
    return res.status(500).json({ 
        error: userFriendlyError, 
        details: errorMessage,
        raw: errorDetails 
    });
  }
}
