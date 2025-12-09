import Stripe from "stripe";

export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: "Due Payment" },
            unit_amount: Number(amount) * 100
          },
          quantity: 1
        }
      ],
      success_url: `${req.headers.get("origin")}/success.html`,
      cancel_url: `${req.headers.get("origin")}/dashboard.html`
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
