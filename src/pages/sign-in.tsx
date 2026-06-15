import { SignIn } from "@clerk/clerk-react";
import { useSearch } from "wouter";

export default function SignInPage() {
  const search = useSearch();
  const redirectUrl = new URLSearchParams(search).get("redirect_url") ?? "/portal";

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)", padding: "24px" }}
    >
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl={redirectUrl} />
    </div>
  );
}
