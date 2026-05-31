import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft } from "lucide-react";
import drMurphyPhoto from "@assets/Murphy-14_1765142967232.jpg";

const posts: Record<string, {
  title: string;
  tag: string;
  date: string;
  content: string;
}> = {
  "apple-watch-sleep-apnea": {
    title: "Your Apple Watch Just Detected Sleep Apnea — Here's Exactly What To Do",
    tag: "Apple Watch",
    date: "March 2025",
    content: "This article is being prepared by Dr. Murphy and will be published soon.",
  },
  "8-types-sleep-apnea-treatment": {
    title: "The 8 Types of Sleep Apnea and How to Know Which One Is Yours",
    tag: "Treatment",
    date: "February 2025",
    content: "This article is being prepared by Dr. Murphy and will be published soon.",
  },
  "cpap-not-working": {
    title: "Why Your CPAP Isn't Working — And What To Do About It",
    tag: "CPAP",
    date: "January 2025",
    content: "This article is being prepared by Dr. Murphy and will be published soon.",
  },
  "sleep-apnea-heart-disease": {
    title: "Sleep Apnea and Heart Disease: What You Need to Know",
    tag: "Health Risk",
    date: "December 2024",
    content: "This article is being prepared by Dr. Murphy and will be published soon.",
  },
};

function SidebarCTA() {
  return (
    <div
      className="sticky"
      style={{ top: "84px", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px" }}
    >
      <h3 className="font-bold mb-2" style={{ color: "#0F172A", fontSize: "16px" }}>
        Know Your Pathway
      </h3>
      <p className="mb-4 text-[13px]" style={{ color: "#6B7280", lineHeight: 1.6 }}>
        Take the free 3-minute screener to get your risk score and see which airway zones may be involved.
      </p>
      <Link href="/screener">
        <button
          className="w-full text-white font-semibold cursor-pointer border-0 py-3"
          style={{ backgroundColor: "#2563EB", borderRadius: "8px", fontSize: "14px" }}
          data-testid="button-blog-sidebar-cta"
        >
          Start Free Screening →
        </button>
      </Link>
      <p className="text-center mt-2 text-[11px]" style={{ color: "#9CA3AF" }}>
        No account required
      </p>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const post = posts[params.slug ?? ""];

  if (!post) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>Article not found</h1>
          <Link href="/blog">
            <button
              className="cursor-pointer border font-medium py-2 px-4 rounded"
              style={{ borderColor: "#E5E7EB", color: "#374151", backgroundColor: "white" }}
            >
              ← Back to Blog
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-12 mx-auto" style={{ maxWidth: "1040px" }}>
          {/* Main content */}
          <article style={{ maxWidth: "720px", flex: 1 }}>
            {/* Back link */}
            <Link href="/blog">
              <button
                className="flex items-center gap-1.5 text-[14px] cursor-pointer border-0 bg-transparent mb-8 p-0"
                style={{ color: "#6B7280" }}
              >
                <ArrowLeft className="w-4 h-4" />
                All Articles
              </button>
            </Link>

            {/* Header */}
            <span
              className="inline-block text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full mb-4"
              style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}
            >
              {post.tag}
            </span>
            <h1 className="font-bold mb-5 leading-tight" style={{ color: "#0F172A", fontSize: "36px" }}>
              {post.title}
            </h1>

            {/* Byline */}
            <div className="flex items-center gap-3 mb-5 pb-6 border-b" style={{ borderColor: "#E5E7EB" }}>
              <img
                src={drMurphyPhoto}
                alt="Dr. Michael Murphy"
                className="rounded-full object-cover"
                style={{ width: "36px", height: "36px" }}
              />
              <div>
                <p className="font-semibold text-[14px]" style={{ color: "#0F172A" }}>
                  Dr. Michael Murphy, MD, MPH
                </p>
                <p className="text-[12px]" style={{ color: "#6B7280" }}>
                  Stanford Medicine · {post.date}
                </p>
              </div>
            </div>

            {/* Feature image placeholder */}
            <div
              className="rounded-lg mb-8 flex items-center justify-center"
              style={{ height: "280px", backgroundColor: "#F0F7FF", border: "1px solid #DBEAFE" }}
            >
              <p className="text-[13px] italic" style={{ color: "#93C5FD" }}>
                Feature image coming soon
              </p>
            </div>

            {/* Article body */}
            <div style={{ color: "#374151", fontSize: "17px", lineHeight: 1.75 }}>
              <p className="italic" style={{ color: "#6B7280" }}>{post.content}</p>
            </div>

            {/* Final CTA */}
            <div
              className="mt-14 rounded-lg text-center"
              style={{ backgroundColor: "#0F172A", padding: "48px 32px" }}
            >
              <h3 className="font-bold text-white mb-3" style={{ fontSize: "24px" }}>
                Your sleep is affecting everything. Find out why.
              </h3>
              <p className="mb-6 text-[15px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                Take the free 3-minute screener. No account. No commitment.
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
                  data-testid="button-blog-post-cta"
                >
                  Start Free Screening — It's Free
                </button>
              </Link>
            </div>
          </article>

          {/* Sidebar (desktop only) */}
          <aside className="hidden md:block flex-shrink-0" style={{ width: "240px" }}>
            <SidebarCTA />
          </aside>
        </div>
      </div>
    </Layout>
  );
}
