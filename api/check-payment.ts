
import { MercadoPagoConfig, Payment } from 'mercadopago';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const { id } = req.query;

  if (!accessToken) {
    return res.status(500).json({ error: "Configuração de pagamento ausente." });
  }

  if (!id) {
    return res.status(400).json({ error: "ID do pagamento é obrigatório." });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);

    const paymentInfo = await payment.get({ id: id });

    return res.status(200).json({ 
        status: paymentInfo.status,
        status_detail: paymentInfo.status_detail 
    });

  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return res.status(500).json({ error: 'Erro ao verificar pagamento.' });
  }
}
