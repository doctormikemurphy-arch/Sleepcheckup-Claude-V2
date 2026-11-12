import { useEffect, useState } from "react";

export type AdminAuthState = "loading" | "authed" | "denied" | "unauthenticated";

/**
 * Admin access check shared by the admin panel and the Pathway Preview.
 * Dev builds are always allowed. Other builds ask /api/admin/check
 * (that endpoint does not exist yet, so admin is effectively closed outside dev).
 */
export function useAdminAuth(): AdminAuthState {
  const DEV = import.meta.env.DEV;
  const [authState, setAuthState] = useState<AdminAuthState>(DEV ? "authed" : "loading");

  useEffect(() => {
    if (DEV) return;
    fetch("/api/admin/check", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => setAuthState(data?.isAdmin ? "authed" : "denied"))
      .catch(() => setAuthState("unauthenticated"));
  }, [DEV]);

  return authState;
}
