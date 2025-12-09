import Stripe from "stripe";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    // Verify Stripe key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not configured");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // Specify API version for consistency
    });

    // Edge runtime requires manual JSON parsing
    const { amount } = await req.json();

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount provided");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: "Due Payment" },
            unit_amount: Math.round(Number(amount) * 100), // Ensure integer
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/success.html`,
      cancel_url: `${req.headers.get("origin")}/dashboard.html`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Stripe error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
