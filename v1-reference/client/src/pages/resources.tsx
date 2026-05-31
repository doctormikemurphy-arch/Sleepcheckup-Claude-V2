import { Layout } from "@/components/layout/Layout";
import { GeneralResources } from "@/components/GeneralResources";

export default function ResourcesPage() {
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="text-resources-title">
                Sleep Breathing Resources
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Educational content curated by Dr. Murphy to help you learn more about sleep breathing, snoring, and sleep apnea.
              </p>
            </div>
            <GeneralResources />
          </div>
        </div>
      </section>
    </Layout>
  );
}
