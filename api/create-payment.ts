
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
    console.error("Erro de configuração do servidor: MERCADOPAGO_ACCESS_TOKEN não está definido.");
    return res.status(500).json({ error: "O gateway de pagamento não está configurado." });
  }

  try {
    const { title, price, name, email } = req.body;

    // 3. Valida se todos os dados necessários foram recebidos na requisição
    if (!price || !email) {
      return res.status(400).json({ error: 'Faltam detalhes obrigatórios (preço ou email).' });
    }

    // 4. Inicializa o cliente do Mercado Pago
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);

    // 5. Cria o pagamento PIX Específico
    const paymentResponse = await payment.create({
      body: {
        transaction_amount: Number(price),
        description: title || 'FitCalc Premium',
        payment_method_id: 'pix',
        payer: {
          email: email,
          first_name: name || 'Cliente',
        },
      },
    });

    // 6. Extrai os dados do QR Code da resposta
    const pointOfInteraction = paymentResponse.point_of_interaction;
    
    if (pointOfInteraction && pointOfInteraction.transaction_data) {
        const qrCodeBase64 = pointOfInteraction.transaction_data.qr_code_base64;
        const qrCodeCopyPaste = pointOfInteraction.transaction_data.qr_code;
        const paymentId = paymentResponse.id;

        return res.status(200).json({ 
            success: true,
            paymentId: paymentId,
            qrCodeBase64: qrCodeBase64,
            qrCodeCopyPaste: qrCodeCopyPaste
        });
    } else {
        console.error('Dados do PIX não encontrados na resposta:', paymentResponse);
        return res.status(500).json({ error: 'Falha ao gerar QR Code do PIX.' });
    }

  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    return res.status(500).json({ error: 'Falha ao processar pagamento PIX.' });
  }
}
