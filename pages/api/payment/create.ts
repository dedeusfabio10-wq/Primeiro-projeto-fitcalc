import mercadopago from "mercadopago";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Configure Mercado Pago with the access token from environment variables.
  mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });

  try {
    const body = req.body;

    // Create the preference object with item details, payer info, and callback URLs.
    const preference = {
      items: [
        {
          title: body.title,
          quantity: 1,
          currency_id: "BRL",
          unit_price: body.price,
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
    };

    const response = await mercadopago.preferences.create(preference);

    // Return the preference ID and the init_point URL for checkout redirection.
    return res.status(200).json({ id: response.body.id, init_point: response.body.init_point });
  } catch (error) {
    console.error("ERRO MERCADO PAGO:", error);
    return res.status(500).json({ error: "Erro ao criar preferência" });
  }
}
