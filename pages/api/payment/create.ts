import { MercadoPagoConfig, Preference } from "mercadopago";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const body = req.body;

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            title: body.title,
            quantity: 1,
            currency_id: "BRL",
            unit_price: Number(body.price),
          },
        ],
        payer: {
            name: body.name,
            email: body.email,
        },
        back_urls: {
          success: body.success,
          failure: body.failure,
          pending: body.pending,
        },
        auto_return: "approved",
      },
    });

    return res.status(200).json({ id: response.id, init_point: response.init_point });
  } catch (error) {
    console.error("ERRO MERCADO PAGO:", error);
    return res.status(500).json({ error: "Erro ao criar preferência" });
  }
}
