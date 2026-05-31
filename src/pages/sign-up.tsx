import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)", padding: "24px" }}
    >
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
