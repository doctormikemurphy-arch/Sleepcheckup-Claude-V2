// Stripe client — uses live env vars in production, Replit connector in development
import Stripe from "stripe";

async function getCredentials(): Promise<{ publishableKey: string; secretKey: string }> {
  // In production deployment, use the live keys stored as secrets
  const liveSecret = process.env.STRIPE_LIVE_SECRET_KEY;
  const livePublishable = process.env.STRIPE_LIVE_PUBLISHABLE_KEY;

  if (liveSecret && livePublishable) {
    return { publishableKey: livePublishable, secretKey: liveSecret };
  }

  // Development fallback: use Replit connector (test keys)
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error("Stripe keys not configured. Please set STRIPE_LIVE_SECRET_KEY and STRIPE_LIVE_PUBLISHABLE_KEY.");
  }

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", "stripe");
  url.searchParams.set("environment", "development");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "X-Replit-Token": xReplitToken,
    },
  });

  const data = await response.json();
  const conn = data.items?.[0];

  if (!conn?.settings?.publishable || !conn?.settings?.secret) {
    throw new Error("Stripe development connection not found in Replit connector.");
  }

  return {
    publishableKey: conn.settings.publishable,
    secretKey: conn.settings.secret,
  };
}

// WARNING: Never cache this client — always call fresh per request.
export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, { apiVersion: "2025-08-27.basil" as any });
}

export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}
