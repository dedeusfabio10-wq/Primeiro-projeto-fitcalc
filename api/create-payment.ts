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
    const { title, price, name, email, success, failure, pending } = req.body;

    // Create the preference object with item details, payer info, and callback URLs.
    const preference = {
      items: [
        {
          title: title,
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(price),
        },
      ],
      payer: {
          name: name,
          email: email,
      },
      back_urls: {
        success: success,
        failure: failure,
        pending: pending,
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    // Return the preference ID and the init_point URL for checkout redirection.
    // The init_point is crucial for the frontend to work correctly.
    return res.status(200).json({ id: response.body.id, init_point: response.body.init_point });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar preferência" });
  }
}
