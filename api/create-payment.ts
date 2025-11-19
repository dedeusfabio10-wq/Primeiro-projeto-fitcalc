
import { MercadoPagoConfig, Payment } from 'mercadopago';

export default async function handler(req, res) {
  // 1. Permite apenas requisições POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  // 2. Valida se a chave de acesso do Mercado Pago está configurada no servidor
  if (!accessToken) {
    console.error("Erro: MERCADOPAGO_ACCESS_TOKEN não configurado.");
    return res.status(500).json({ error: "Erro de configuração no servidor (Token ausente). Faça um Redeploy na Vercel." });
  }

  try {
    const { title, price, name, email } = req.body;

    // 3. Valida dados básicos
    if (!price || !email) {
      return res.status(400).json({ error: 'Dados incompletos: email ou preço faltando.' });
    }

    const client = new MercadoPagoConfig({ accessToken });
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

    console.log("Iniciando pagamento PIX...", JSON.stringify(paymentData));

    // 4. Cria o pagamento
    const paymentResponse = await payment.create({ body: paymentData });

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
    // Retorna a mensagem real do erro para o frontend ajudar no debug
    const errorMessage = error.message || 'Erro desconhecido';
    const errorDetails = error.cause ? JSON.stringify(error.cause) : (error.stack || '');
    
    return res.status(500).json({ 
        error: 'Falha ao processar pagamento PIX.', 
        details: errorMessage,
        raw: errorDetails 
    });
  }
}
