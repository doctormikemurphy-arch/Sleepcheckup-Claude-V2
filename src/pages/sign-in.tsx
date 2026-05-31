import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)", padding: "24px" }}
    >
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
