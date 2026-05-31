import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquarePlus, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SelectTestimonial } from "@shared/schema";

function StarRating({ rating, interactive, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRate?.(i + 1)}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useQuery<SelectTestimonial[]>({
    queryKey: ["/api/testimonials"],
  });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/testimonials", { name, email: email.trim() || null, content, rating });
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your testimonial has been submitted for review.",
      });
      setShowForm(false);
      setName("");
      setEmail("");
      setContent("");
      setRating(5);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    submitMutation.mutate();
  };

  if (isLoading || testimonials.length === 0) return null;

  return (
    <section className="py-16" data-testid="testimonials-section">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3 text-foreground">
            What people are saying
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Real experiences from people who have used the Murphy Method™
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.id} data-testid={`card-testimonial-${t.id}`}>
                <CardContent className="p-6">
                  <StarRating rating={t.rating ?? 5} />
                  <blockquote className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    {t.role && (
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center">
            {!showForm ? (
              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="gap-2"
                data-testid="button-share-experience"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Share Your Experience
              </Button>
            ) : (
              <Card className="w-full max-w-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <h3 className="font-semibold text-foreground">Share Your Experience</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowForm(false)}
                      data-testid="button-close-testimonial-form"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="testimonial-name">Your Name</Label>
                      <Input
                        id="testimonial-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="First name or initials"
                        required
                        data-testid="input-testimonial-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="testimonial-email">Email (optional)</Label>
                      <Input
                        id="testimonial-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        data-testid="input-testimonial-email"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Only used to follow up with you if needed. Never published.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="testimonial-content">Your Experience</Label>
                      <Textarea
                        id="testimonial-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell us about your experience with the Murphy Method™..."
                        required
                        rows={4}
                        data-testid="input-testimonial-content"
                      />
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <div className="mt-1">
                        <StarRating rating={rating} interactive onRate={setRating} />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending || !name.trim() || !content.trim()}
                      className="w-full gap-2"
                      data-testid="button-submit-testimonial"
                    >
                      <Send className="w-4 h-4" />
                      {submitMutation.isPending ? "Submitting..." : "Submit Testimonial"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Your testimonial will be reviewed before being published.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
