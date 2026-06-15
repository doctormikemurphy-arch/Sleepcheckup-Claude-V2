import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClerkClient, verifyToken } from "@clerk/backend";

interface SavedAssessment {
  completedAt: string;
  pathway: string;
  pathwayLetter: string;
  pathwayName: string;
  stripeSessionId: string;
  stopBangScore: number;
  osaRisk: string;
  isiScore: number;
  insomniaSeverity: string;
  bmiValue: number | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: "Clerk not configured" });
  }

  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: "Authorization required" });
  }

  try {
    const clerk = createClerkClient({ secretKey });

    // Verify the Clerk session JWT — never trust the client's claimed user ID
    const payload = await verifyToken(token, { secretKey });
    const userId = payload.sub;

    const body = (req.body ?? {}) as Partial<SavedAssessment>;
    if (!body.pathway || !body.pathwayLetter) {
      return res.status(400).json({ error: "pathway and pathwayLetter are required" });
    }

    // Load existing saved assessments from the verified user's publicMetadata
    const user = await clerk.users.getUser(userId);
    const existing: SavedAssessment[] = Array.isArray(
      (user.publicMetadata as Record<string, unknown>).assessments
    )
      ? ((user.publicMetadata as Record<string, unknown>).assessments as SavedAssessment[])
      : [];

    // Deduplicate by Stripe session ID — safe to call multiple times
    if (body.stripeSessionId && existing.some((a) => a.stripeSessionId === body.stripeSessionId)) {
      return res.json({ success: true, skipped: true });
    }

    const newAssessment: SavedAssessment = {
      completedAt: body.completedAt ?? new Date().toISOString(),
      pathway: body.pathway,
      pathwayLetter: body.pathwayLetter,
      pathwayName: body.pathwayName ?? "",
      stripeSessionId: body.stripeSessionId ?? "",
      stopBangScore: body.stopBangScore ?? 0,
      osaRisk: body.osaRisk ?? "low",
      isiScore: body.isiScore ?? 0,
      insomniaSeverity: body.insomniaSeverity ?? "none",
      bmiValue: body.bmiValue ?? null,
    };

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        assessments: [...existing, newAssessment],
      },
    });

    return res.json({ success: true });
  } catch (err: any) {
    console.error("save-result error:", err);
    return res.status(500).json({ error: err.message ?? "Failed to save result" });
  }
}
