import mercadopago from "mercadopago";

export async function POST(req) {
  const body = await req.json();

  mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });

  try {
    const preference = {
      items: [
        {
          title: body.title,
          quantity: 1,
          currency_id: "BRL",
          unit_price: body.price,
        },
      ],
      back_urls: {
        success: body.success,
        failure: body.failure,
        pending: body.pending,
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    return new Response(JSON.stringify({ id: response.body.id }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Erro ao criar preferência", { status: 500 });
  }
}
