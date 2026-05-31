import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SelectPathwayContent } from "@shared/schema";
import {
  Video,
  BookOpen,
  ShoppingBag,
  ExternalLink,
  Stethoscope,
  FileText,
} from "lucide-react";

interface PathwayResourcesProps {
  pathwayId: string;
}

const CONTENT_TYPE_CONFIG: Record<string, {
  label: string;
  icon: typeof Video;
  badgeClass: string;
  sectionTitle: string;
  sectionDescription: string;
}> = {
  video: {
    label: "Video",
    icon: Video,
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    sectionTitle: "Video Courses",
    sectionDescription: "Educational videos specific to your pathway",
  },
  article: {
    label: "Article",
    icon: FileText,
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    sectionTitle: "Written Content",
    sectionDescription: "Articles and guides for your situation",
  },
  product: {
    label: "Product",
    icon: ShoppingBag,
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    sectionTitle: "Recommended Products",
    sectionDescription: "Curated products relevant to your pathway",
  },
  book: {
    label: "Book",
    icon: BookOpen,
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    sectionTitle: "Recommended Reading",
    sectionDescription: "Books to deepen your understanding",
  },
  specialist: {
    label: "Specialist",
    icon: Stethoscope,
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    sectionTitle: "Find a Specialist",
    sectionDescription: "Connect with the right healthcare providers",
  },
};

const CONTENT_TYPE_ORDER = ["video", "article", "book", "product", "specialist"];

function ContentCard({ item }: { item: SelectPathwayContent }) {
  const config = CONTENT_TYPE_CONFIG[item.contentType] || CONTENT_TYPE_CONFIG.article;
  const Icon = config.icon;

  return (
    <Card
      className="hover-elevate overflow-visible"
      data-testid={`card-content-${item.id}`}
    >
      {item.imageUrl && (
        <div className={`w-full overflow-hidden rounded-t-lg bg-muted flex items-center justify-center ${item.contentType === "book" ? "aspect-[3/4]" : item.contentType === "specialist" ? "aspect-[3/2] p-4" : "aspect-video"}`}>
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`${item.contentType === "book" || item.contentType === "specialist" ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover"}`}
            data-testid={`img-content-${item.id}`}
          />
        </div>
      )}
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
              <Badge variant="secondary" className={`text-xs ${config.badgeClass} no-default-hover-elevate no-default-active-elevate`}>
                {item.label || config.label}
              </Badge>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
            )}
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2" data-testid={`button-content-link-${item.id}`}>
                  {item.contentType === "video" ? "Watch Now" :
                   item.contentType === "product" ? "View Product" :
                   item.contentType === "book" ? "View Book" :
                   item.contentType === "specialist" ? "Find Providers" :
                   "Read More"}
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContentSection({ type, items }: { type: string; items: SelectPathwayContent[] }) {
  if (items.length === 0) return null;
  const config = CONTENT_TYPE_CONFIG[type] || CONTENT_TYPE_CONFIG.article;
  const Icon = config.icon;

  return (
    <div className="space-y-3" data-testid={`section-content-${type}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{config.sectionTitle}</h3>
          <p className="text-xs text-muted-foreground">{config.sectionDescription}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function PathwayResources({ pathwayId }: PathwayResourcesProps) {
  const { data: content, isLoading } = useQuery<SelectPathwayContent[]>({
    queryKey: ["/api/pathway-content", pathwayId],
  });

  if (isLoading) {
    return (
      <Card className="mb-8" data-testid="card-pathway-resources-loading">
        <CardHeader>
          <CardTitle>Your Pathway Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content || content.length === 0) {
    return null;
  }

  const groupedContent: Record<string, SelectPathwayContent[]> = {};
  for (const item of content) {
    const groupKey = item.contentType;
    if (!groupedContent[groupKey]) {
      groupedContent[groupKey] = [];
    }
    groupedContent[groupKey].push(item);
  }

  return (
    <Card className="mb-8" data-testid="card-pathway-resources">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Your Pathway Resources</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Curated content specific to your situation
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {CONTENT_TYPE_ORDER.map((type) =>
            groupedContent[type] ? (
              <ContentSection key={type} type={type} items={groupedContent[type]} />
            ) : null
          )}
        </div>
      </CardContent>
    </Card>
  );
}
