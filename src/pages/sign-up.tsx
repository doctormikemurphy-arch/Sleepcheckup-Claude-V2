import { SignUp } from "@clerk/clerk-react";
import { useSearch } from "wouter";

export default function SignUpPage() {
  const search = useSearch();
  const redirectUrl = new URLSearchParams(search).get("redirect_url") ?? "/portal";

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)", padding: "24px" }}
    >
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl={redirectUrl} />
    </div>
  );
}
