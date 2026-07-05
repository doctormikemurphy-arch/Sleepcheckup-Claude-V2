import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  const { stripeSessionId, acknowledgedAt, method } = req.body ?? {};
  if (!stripeSessionId || typeof stripeSessionId !== "string") {
    return res.status(400).json({ error: "stripeSessionId required" });
  }
  if (method !== "checkbox" && method !== "download") {
    return res.status(400).json({ error: "method must be 'checkbox' or 'download'" });
  }

  try {
    const stripe = new Stripe(secretKey);
    await stripe.checkout.sessions.update(stripeSessionId, {
      metadata: {
        report_acknowledged_at: typeof acknowledgedAt === "string" ? acknowledgedAt : new Date().toISOString(),
        report_acknowledged_method: method,
      },
    });
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("Log acknowledgment error:", err);
    return res.status(500).json({ error: "Failed to log acknowledgment" });
  }
}
