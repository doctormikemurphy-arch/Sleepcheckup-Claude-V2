import { Layout } from "@/components/layout/Layout";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Medical Disclaimer
              </h1>
            </div>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="p-6 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 mb-8">
                <p className="text-amber-800 dark:text-amber-200 font-medium m-0">
                  The Murphy Method™ Sleep Pathways Assessment is for educational purposes only 
                  and does not constitute medical advice, diagnosis, or treatment.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/40 border border-border mb-8">
                <p className="text-sm text-muted-foreground m-0">
                  This website and its services are operated by Sleep Check Up, Inc.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Not Medical Advice</h2>
              <p className="text-muted-foreground">
                The information, assessments, pathways, and recommendations provided by the 
                Murphy Method™ are intended for general educational and informational purposes 
                only. They are not intended to be, and should not be interpreted as, medical 
                advice or a substitute for professional medical consultation, diagnosis, or treatment.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Not a Diagnostic Tool</h2>
              <p className="text-muted-foreground">
                This assessment cannot and does not diagnose sleep apnea, insomnia, or any other 
                medical condition. Only a qualified healthcare provider can diagnose medical 
                conditions through appropriate clinical evaluation, which may include sleep studies, 
                physical examinations, and review of medical history.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Consult Healthcare Providers</h2>
              <p className="text-muted-foreground">
                Always consult with a qualified healthcare provider before making any decisions 
                about your health or treatment options. If you have symptoms of sleep-disordered 
                breathing, excessive daytime sleepiness, or other sleep problems, seek evaluation 
                from a sleep medicine specialist or your primary care physician.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Emergency Situations</h2>
              <p className="text-muted-foreground">
                If you experience a medical emergency, call your local emergency services 
                immediately. Do not rely on this website or any online resource for emergency 
                medical care.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">No Warranties</h2>
              <p className="text-muted-foreground">
                While we strive to provide accurate and up-to-date information, we make no 
                warranties or representations regarding the accuracy, completeness, or reliability 
                of any information provided. The assessment results and pathway assignments are 
                based on your self-reported responses and may not reflect your actual medical status.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Murphy Method™ and its creators, affiliates, and partners shall not be liable 
                for any damages, injuries, or adverse outcomes resulting from the use of this 
                assessment or reliance on its results. You assume full responsibility for any 
                decisions you make based on the information provided.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Use at Your Own Risk</h2>
              <p className="text-muted-foreground">
                By using the Murphy Method™ assessment, you acknowledge that you understand and 
                accept this disclaimer. You agree to use this tool as one educational resource 
                among many, and to consult qualified healthcare professionals for medical concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
