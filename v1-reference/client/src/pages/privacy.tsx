import { Layout } from "@/components/layout/Layout";

export default function PrivacyPage() {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              <div className="p-4 rounded-lg bg-muted/40 border border-border mb-8">
                <p className="text-sm text-muted-foreground m-0">
                  This website and its services are operated by Sleep Check Up, Inc.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Overview</h2>
              <p className="text-muted-foreground">
                Murphy Method™ ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information 
                when you use our sleep breathing assessment tool.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Information We Collect</h2>
              <p className="text-muted-foreground">
                <strong>Assessment Data:</strong> When you complete the Murphy Method™ assessment, 
                your responses are stored locally on your device using your browser's localStorage. 
                This data remains on your device and is not transmitted to our servers unless you 
                explicitly choose to save your results by creating an account.
              </p>
              <p className="text-muted-foreground">
                <strong>Account Information:</strong> If you choose to create an account to save 
                your results, we collect your email address and store your assigned pathway and 
                completion timestamp. We do not store your detailed assessment responses on our servers.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide and maintain the assessment service</li>
                <li>Allow you to save and access your pathway results</li>
                <li>Send you relevant communications if you opt in</li>
                <li>Improve our services and user experience</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Data Storage and Security</h2>
              <p className="text-muted-foreground">
                Assessment data stored in your browser's localStorage is controlled entirely by you. 
                Clearing your browser data will remove this information. For registered users, we 
                store minimal data securely and implement appropriate security measures to protect 
                your information.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access and export your data</li>
                <li>Delete your account and associated data</li>
                <li>Clear your locally stored assessment data at any time</li>
                <li>Opt out of communications</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our data practices, please 
                contact us at privacy@murphymethod.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
