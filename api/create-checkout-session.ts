import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const PRICE_CENTS = 7900; // $79

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  try {
    const { email } = (req.body ?? {}) as { email?: string };
    const stripe = new Stripe(secretKey);
    const origin = req.headers.origin ?? `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "Murphy Method™ Full Assessment Report",
              description:
                "Personalized sleep apnea pathway report — emailed instantly on completion. Sleep Check Up, Inc. | Michael Murphy, MD, MPH — Stanford Medicine.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/assessment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/assessment/checkout`,
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout session error:", err);
    return res.status(500).json({ error: err.message ?? "Failed to create checkout session" });
  }
}
