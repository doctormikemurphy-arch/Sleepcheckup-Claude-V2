import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  const sessionId = req.query.session_id as string;
  if (!sessionId) {
    return res.status(400).json({ error: "session_id required" });
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return res.json({
        paid: true,
        email: session.customer_email ?? session.customer_details?.email ?? null,
        sessionId,
      });
    }

    return res.json({ paid: false, sessionId });
  } catch (err: any) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
}
