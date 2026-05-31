import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";

const posts = [
  {
    slug: "apple-watch-sleep-apnea",
    title: "Your Apple Watch Just Detected Sleep Apnea — Here's Exactly What To Do",
    excerpt: "An Apple Watch notification about irregular breathing can be alarming. Here's what it means and the specific steps to take next — from a Stanford sleep physician.",
    tag: "Apple Watch",
    date: "March 2025",
  },
  {
    slug: "8-types-sleep-apnea-treatment",
    title: "The 8 Types of Sleep Apnea and How to Know Which One Is Yours",
    excerpt: "Not all sleep apnea is the same. The anatomy, the severity, the contributing conditions vary enormously. Here's how to figure out which type fits your situation.",
    tag: "Treatment",
    date: "February 2025",
  },
  {
    slug: "cpap-not-working",
    title: "Why Your CPAP Isn't Working — And What To Do About It",
    excerpt: "CPAP works well for some patients and poorly for others. If you're struggling with adherence or it just isn't helping enough, this explains why — and what else to consider.",
    tag: "CPAP",
    date: "January 2025",
  },
  {
    slug: "sleep-apnea-heart-disease",
    title: "Sleep Apnea and Heart Disease: What You Need to Know",
    excerpt: "Obstructive sleep apnea is one of the most underrecognized risk factors for cardiovascular disease. Here's what to tell your cardiologist — and what to ask.",
    tag: "Health Risk",
    date: "December 2024",
  },
];

export default function BlogPage() {
  return (
    <Layout>
      <section style={{ backgroundColor: "#F9FAFB", padding: "60px 0 40px" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mx-auto" style={{ maxWidth: "680px" }}>
            <h1 className="font-bold mb-3" style={{ color: "#0F172A", fontSize: "36px" }}>
              Sleep Apnea Guides & Resources
            </h1>
            <p style={{ color: "#6B7280", fontSize: "16px" }}>
              Written with clinical input from Michael Murphy, MD, MPH — Stanford Medicine
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white" style={{ padding: "48px 0 80px" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto" style={{ maxWidth: "1040px" }}>
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block no-underline" data-testid={`card-post-${post.slug}`}>
                <div
                  className="h-full flex flex-col bg-white hover:shadow-md transition-shadow"
                  style={{ border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}
                >
                  {/* Placeholder feature image */}
                  <div
                    className="flex-shrink-0"
                    style={{ height: "140px", backgroundColor: "#F0F7FF" }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "#2563EB" }}
                      >
                        {post.tag}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <span
                      className="inline-block text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full mb-3 self-start"
                      style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}
                    >
                      {post.tag}
                    </span>
                    <h2 className="font-semibold mb-2 leading-snug" style={{ color: "#0F172A", fontSize: "16px" }}>
                      {post.title}
                    </h2>
                    <p className="text-[13px] mb-4 flex-1" style={{ color: "#6B7280", lineHeight: 1.6 }}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-[12px]" style={{ color: "#9CA3AF" }}>
                      <span>{post.date}</span>
                      <span style={{ color: "#2563EB" }}>Read More →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="mb-5" style={{ color: "#6B7280", fontSize: "16px" }}>
              Ready to go from reading to results?
            </p>
            <Link href="/screener">
              <button
                className="text-white font-semibold cursor-pointer border-0"
                style={{
                  backgroundColor: "#2563EB",
                  fontSize: "15px",
                  padding: "12px 28px",
                  borderRadius: "8px",
                }}
                data-testid="button-blog-cta"
              >
                Start Free Screening — 3 Minutes →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
