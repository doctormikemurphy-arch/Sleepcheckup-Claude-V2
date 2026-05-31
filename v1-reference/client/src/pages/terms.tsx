import { Layout } from "@/components/layout/Layout";

export default function TermsPage() {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">
              Terms of Use
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

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using the Murphy Method™ Sleep Pathways Assessment ("Service"), 
                you accept and agree to be bound by these Terms of Use. If you do not agree to 
                these terms, please do not use the Service.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Educational Purpose</h2>
              <p className="text-muted-foreground">
                The Murphy Method™ assessment is provided for educational and informational 
                purposes only. It is designed to help you learn about sleep breathing patterns 
                and prepare for conversations with healthcare professionals. The Service does 
                not provide medical advice, diagnosis, or treatment.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">No Medical Advice</h2>
              <p className="text-muted-foreground">
                The information provided by this Service is not a substitute for professional 
                medical advice, diagnosis, or treatment. Always seek the advice of your physician 
                or other qualified health provider with any questions you may have regarding a 
                medical condition. Never disregard professional medical advice or delay in seeking 
                it because of something you have read or received from this Service.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Use of the Service</h2>
              <p className="text-muted-foreground">
                You agree to use the Service only for lawful purposes and in accordance with 
                these Terms. You agree not to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use the Service in any way that violates applicable laws or regulations</li>
                <li>Attempt to interfere with or disrupt the Service</li>
                <li>Use the Service to impersonate any person or entity</li>
                <li>Reproduce, distribute, or create derivative works from the Service</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Murphy Method™ name, logo, assessment content, and related materials are 
                proprietary and protected by intellectual property laws. You may not use, copy, 
                or distribute these materials without our express written permission.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, Murphy Method™ shall not be liable for 
                any indirect, incidental, special, consequential, or punitive damages arising 
                out of or related to your use of the Service. Our total liability shall not 
                exceed the amount you paid, if any, for access to the Service.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users 
                of any material changes by posting the updated Terms on this page. Your continued 
                use of the Service after changes constitutes acceptance of the modified Terms.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Contact</h2>
              <p className="text-muted-foreground">
                If you have questions about these Terms, please contact us at legal@murphymethod.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
