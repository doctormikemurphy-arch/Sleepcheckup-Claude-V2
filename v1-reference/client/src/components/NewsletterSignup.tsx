import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail } from "lucide-react";

interface NewsletterSignupProps {
  source?: string;
  variant?: "default" | "compact" | "inline";
  title?: string;
  description?: string;
}

export function NewsletterSignup({
  source = "newsletter",
  variant = "default",
  title = "Stay informed about sleep health",
  description = "Get practical sleep insights, updates, and educational resources delivered to your inbox. No spam, ever.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await apiRequest("POST", "/api/subscribe", { email, name: name || undefined, source });
      setSubmitted(true);
      toast({
        title: "You're subscribed!",
        description: "Thank you — you'll hear from us soon.",
      });
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("409") || msg.toLowerCase().includes("unique")) {
        toast({
          title: "Already subscribed",
          description: "This email address is already on our list.",
        });
        setSubmitted(true);
      } else {
        toast({
          title: "Subscription failed",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground" data-testid="newsletter-success">
        <Mail className="w-4 h-4 text-primary flex-shrink-0" />
        <span>You&apos;re subscribed — thank you!</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap" data-testid="form-newsletter-inline">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 min-w-48"
          data-testid="input-newsletter-email"
        />
        <Button type="submit" disabled={loading} size="default" data-testid="button-newsletter-subscribe">
          {loading ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-2" data-testid="newsletter-compact">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 min-w-40 text-sm"
            data-testid="input-newsletter-email-compact"
          />
          <Button type="submit" disabled={loading} size="default" data-testid="button-newsletter-subscribe-compact">
            {loading ? "…" : "Subscribe"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <section className="py-16 bg-muted/30" data-testid="newsletter-section">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">{title}</h2>
          <p className="text-muted-foreground mb-8">{description}</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input
              type="text"
              placeholder="Your first name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sm:w-40 flex-shrink-0"
              data-testid="input-newsletter-name"
            />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              data-testid="input-newsletter-email-default"
            />
            <Button type="submit" disabled={loading} size="default" className="flex-shrink-0" data-testid="button-newsletter-subscribe-default">
              {loading ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
