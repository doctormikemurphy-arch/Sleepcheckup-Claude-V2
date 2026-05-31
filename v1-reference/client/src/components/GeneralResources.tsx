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
  Library,
} from "lucide-react";

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
    sectionDescription: "Educational videos about sleep breathing",
  },
  article: {
    label: "Article",
    icon: FileText,
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    sectionTitle: "Articles & Guides",
    sectionDescription: "Evidence-based articles and guides on sleep health",
  },
  product: {
    label: "Product",
    icon: ShoppingBag,
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    sectionTitle: "Vetted Product Recommendations",
    sectionDescription: "Products that may help with sleep breathing",
  },
  book: {
    label: "Book",
    icon: BookOpen,
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    sectionTitle: "Recommended Reading",
    sectionDescription: "Books to learn more about sleep and breathing",
  },
  specialist: {
    label: "Specialist",
    icon: Stethoscope,
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    sectionTitle: "Find the Right Specialist",
    sectionDescription: "Connect with qualified healthcare providers",
  },
};

const CONTENT_TYPE_ORDER = ["article", "book", "product", "specialist", "video"];

const STATIC_FALLBACK: SelectPathwayContent[] = [
  { id: "s1", pathwayId: "general", contentType: "article", displayOrder: 1, title: "What Is Obstructive Sleep Apnea?", description: "A clear overview of OSA — what causes it, how it's diagnosed, and why treatment matters.", url: "https://www.sleepfoundation.org/sleep-apnea/obstructive-sleep-apnea", imageUrl: null, label: "Sleep Foundation" },
  { id: "s2", pathwayId: "general", contentType: "article", displayOrder: 2, title: "Snoring: Causes, Risks, and When to Worry", description: "Learn the difference between primary snoring and snoring that signals a breathing disorder.", url: "https://www.sleepfoundation.org/snoring", imageUrl: null, label: "Sleep Foundation" },
  { id: "s3", pathwayId: "general", contentType: "book", displayOrder: 1, title: "Why We Sleep — Matthew Walker, PhD", description: "A landmark book on the science of sleep and why it's critical for health.", url: "https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316", imageUrl: "https://m.media-amazon.com/images/I/814sf-LvR0L._SY522_.jpg", label: "Matthew Walker" },
  { id: "s4", pathwayId: "general", contentType: "book", displayOrder: 2, title: "Breath — James Nestor", description: "How modern humans developed structural airway problems and how breathing correctly can reverse them.", url: "https://www.amazon.com/Breath-New-Science-Lost-Art/dp/0735213615", imageUrl: "https://covers.openlibrary.org/b/isbn/9780735213616-L.jpg", label: "James Nestor" },
  { id: "s5", pathwayId: "general", contentType: "specialist", displayOrder: 1, title: "Find a Sleep Medicine Specialist", description: "AASM directory of accredited sleep centers and board-certified sleep physicians.", url: "https://sleepeducation.org/sleep-center-locator/", imageUrl: null, label: "AASM" },
  { id: "s6", pathwayId: "general", contentType: "specialist", displayOrder: 2, title: "Find an ENT Specialist", description: "Search for Ear, Nose & Throat specialists by location and area of expertise.", url: "https://www.entnet.org/find-an-ent/", imageUrl: null, label: "AAO-HNS" },
];

function ContentCard({ item }: { item: SelectPathwayContent }) {
  const config = CONTENT_TYPE_CONFIG[item.contentType] || CONTENT_TYPE_CONFIG.article;
  const Icon = config.icon;

  return (
    <Card
      className="hover-elevate overflow-visible"
      data-testid={`card-general-content-${item.id}`}
    >
      {item.imageUrl && (
        <div className={`w-full overflow-hidden rounded-t-lg bg-muted ${
          item.contentType === "book" ? "aspect-[3/4]" :
          item.contentType === "specialist" ? "aspect-[3/2]" : "aspect-video"
        }`}>
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`w-full h-full ${
              item.contentType === "book" ? "object-contain p-4" :
              item.contentType === "specialist" ? "object-contain p-4" : "object-cover"
            }`}
            data-testid={`img-general-content-${item.id}`}
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
                <Button variant="outline" size="sm" className="gap-2" data-testid={`button-general-content-link-${item.id}`}>
                  {item.contentType === "video" ? "Watch Now" :
                   item.contentType === "product" ? "View Resource" :
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
    <div className="space-y-3" data-testid={`section-general-content-${type}`}>
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

export function GeneralResources() {
  const { data: dbContent, isLoading } = useQuery<SelectPathwayContent[]>({
    queryKey: ["/api/general-content"],
  });

  if (isLoading) {
    return (
      <Card className="mb-6 print:hidden" data-testid="card-general-resources-loading">
        <CardHeader>
          <CardTitle>Helpful Resources</CardTitle>
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

  const content = (dbContent && dbContent.length > 0) ? dbContent : STATIC_FALLBACK;

  const groupedContent: Record<string, SelectPathwayContent[]> = {};
  for (const item of content) {
    const groupKey = item.contentType;
    if (!groupedContent[groupKey]) {
      groupedContent[groupKey] = [];
    }
    groupedContent[groupKey].push(item);
  }

  return (
    <Card className="mb-6 print:hidden" data-testid="card-general-resources">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Library className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Helpful Resources</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Educational content curated by Dr. Murphy to help you learn more about sleep breathing
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
        <p className="text-xs text-muted-foreground text-center mt-8 pt-4 border-t border-border">
          These resources are curated for educational purposes and are not a substitute for professional medical evaluation.<br />
          A service of Sleep Check Up, Inc. | Clinical content by Michael Murphy, MD, MPH.
        </p>
      </CardContent>
    </Card>
  );
}
