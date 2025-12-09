// DO NOT use import/require - Vercel handles Stripe automatically
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Validate Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is missing");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const { amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    console.log(`Creating session for amount: ${amount}`);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Due Payment",
              description: "Payment processing"
            },
            unit_amount: Math.round(Number(amount) * 100), // Convert to pence
          },
          quantity: 1,
        }
      ],
      success_url: `${req.headers.origin || req.headers.referer || 'http://localhost:3000'}/success.html`,
      cancel_url: `${req.headers.origin || req.headers.referer || 'http://localhost:3000'}/dashboard.html`,
    });

    console.log("Session created successfully:", session.id);
    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
