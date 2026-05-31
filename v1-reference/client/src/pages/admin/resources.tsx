import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Shield,
  Video,
  BookOpen,
  ShoppingBag,
  BookMarked,
  Stethoscope,
  ExternalLink,
  Lock,
  Upload,
  Users,
  BarChart3,
  Star,
  Mail,
  Quote,
  ToggleLeft,
  ToggleRight,
  FileText,
  Loader2,
  ArrowUp,
  ArrowDown,
  FlaskConical,
  Rocket,
  CheckSquare2,
  Square,
  Target,
  TrendingUp,
  Lightbulb,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import type { SelectPathwayContent, SelectTestimonial, SelectEmailSubscriber } from "@shared/schema";

const PATHWAY_OPTIONS = [
  { value: "general", label: "General Resources (Free Screening)" },
  { value: "A_insomnia", label: "Pathway A: Sleep Apnea with Insomnia (COMISA)" },
  { value: "B_obesity", label: "Pathway B: Sleep Apnea with Obesity" },
  { value: "C_nasal", label: "Pathway C: Nasal Obstruction" },
  { value: "D_mandible", label: "Pathway D: Mandible & Tongue" },
  { value: "E_multilevel", label: "Pathway E: Multi-Level Obstruction" },
  { value: "F_physiology", label: "Pathway F: Physiology-Focused" },
  { value: "G_low_risk", label: "Pathway G: Low Risk" },
  { value: "H_complex", label: "Pathway H: Complex / Multi-Factorial" },
];

const CONTENT_TYPES = [
  { value: "video", label: "Video Course", icon: Video },
  { value: "article", label: "Written Content", icon: BookOpen },
  { value: "product", label: "Recommended Product", icon: ShoppingBag },
  { value: "book", label: "Recommended Reading", icon: BookMarked },
  { value: "specialist", label: "Find a Specialist", icon: Stethoscope },
];

function getContentTypeIcon(type: string) {
  const ct = CONTENT_TYPES.find((c) => c.value === type);
  if (ct) {
    const Icon = ct.icon;
    return <Icon className="w-4 h-4" />;
  }
  return null;
}

function getContentTypeLabel(type: string) {
  return CONTENT_TYPES.find((c) => c.value === type)?.label || type;
}

interface ResourceFormData {
  pathwayId: string;
  contentType: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  displayOrder: number;
  label: string;
}

const emptyForm: ResourceFormData = {
  pathwayId: "",
  contentType: "video",
  title: "",
  description: "",
  url: "",
  imageUrl: "",
  displayOrder: 0,
  label: "",
};

export default function AdminResourcesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPathway, setSelectedPathway] = useState<string>("general");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SelectPathwayContent | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const DEV = import.meta.env.DEV;

  const { data: adminCheck, isLoading: adminLoading } = useQuery<{ isAdmin: boolean } | null>({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      if (res.status === 401 || res.status === 403) return null;
      if (!res.ok) throw new Error("Failed to check admin status");
      return res.json();
    },
    enabled: DEV || isAuthenticated,
    retry: false,
  });

  const { data: content = [], isLoading: contentLoading } = useQuery<SelectPathwayContent[]>({
    queryKey: ["/api/admin/pathway-content", selectedPathway],
    queryFn: async () => {
      const res = await fetch(`/api/admin/pathway-content?pathwayId=${selectedPathway}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: DEV || (isAuthenticated && !!adminCheck?.isAdmin),
  });

  const createMutation = useMutation({
    mutationFn: async (data: ResourceFormData) => {
      const res = await apiRequest("POST", "/api/admin/pathway-content", {
        ...data,
        description: data.description || null,
        url: data.url || null,
        imageUrl: data.imageUrl || null,
        label: data.label || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pathway-content", selectedPathway] });
      queryClient.invalidateQueries({ queryKey: ["/api/pathway-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/general-content"] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ResourceFormData }) => {
      const res = await apiRequest("PATCH", `/api/admin/pathway-content/${id}`, {
        ...data,
        description: data.description || null,
        url: data.url || null,
        imageUrl: data.imageUrl || null,
        label: data.label || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pathway-content", selectedPathway] });
      queryClient.invalidateQueries({ queryKey: ["/api/pathway-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/general-content"] });
      closeForm();
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id1, id2 }: { id1: string; id2: string }) => {
      await apiRequest("POST", "/api/admin/pathway-content/reorder", { id1, id2 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pathway-content", selectedPathway] });
      queryClient.invalidateQueries({ queryKey: ["/api/pathway-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/general-content"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/pathway-content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pathway-content", selectedPathway] });
      queryClient.invalidateQueries({ queryKey: ["/api/pathway-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/general-content"] });
      setDeleteId(null);
    },
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/seed-pathway-content", {});
      return res.json() as Promise<{ success: boolean; inserted: number }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pathway-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pathway-content"] });
      toast({
        title: data.inserted > 0 ? `Seeded ${data.inserted} resources` : "Already up to date",
        description: data.inserted > 0
          ? `${data.inserted} pathway resource records inserted into this database.`
          : "All seed records already exist — nothing was inserted.",
      });
    },
    onError: () => {
      toast({ title: "Seed failed", description: "Could not seed pathway content.", variant: "destructive" });
    },
  });

  const saveForPublishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/save-content-snapshot", {});
      return res.json() as Promise<{ success: boolean; count: number }>;
    },
    onSuccess: (data) => {
      toast({
        title: "Saved for Publish",
        description: `${data.count} resources saved to publish file. When you republish on Replit, these changes will appear on sleepcheckup.com.`,
      });
    },
    onError: () => {
      toast({ title: "Save failed", description: "Could not save publish file.", variant: "destructive" });
    },
  });

  const { data: analytics } = useQuery<{
    totalAssessments: number;
    pathwayDistribution: Record<string, number>;
    totalSubscribers: number;
    totalPosts: number;
    subscribersBySource: Record<string, number>;
  }>({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    enabled: DEV || (isAuthenticated && !!adminCheck?.isAdmin),
  });

  const { data: subscribers = [] } = useQuery<SelectEmailSubscriber[]>({
    queryKey: ["/api/admin/subscribers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/subscribers", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch subscribers");
      return res.json();
    },
    enabled: DEV || (isAuthenticated && !!adminCheck?.isAdmin),
  });

  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/subscribers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({ title: "Subscriber removed" });
    },
  });

  const { data: adminTestimonials = [], isLoading: testimonialsLoading } = useQuery<SelectTestimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/admin/testimonials", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json();
    },
    enabled: DEV || (isAuthenticated && !!adminCheck?.isAdmin),
  });

  const [testimonialForm, setTestimonialForm] = useState({ name: "", role: "", content: "", rating: 5, isActive: true, displayOrder: 0 });
  const [testimonialOpen, setTestimonialOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<SelectTestimonial | null>(null);

  const createTestimonialMutation = useMutation({
    mutationFn: async (data: typeof testimonialForm) => {
      const res = await apiRequest("POST", "/api/admin/testimonials", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setTestimonialOpen(false);
      setEditingTestimonial(null);
      setTestimonialForm({ name: "", role: "", content: "", rating: 5, isActive: true, displayOrder: 0 });
      toast({ title: "Testimonial added" });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof testimonialForm }) => {
      const res = await apiRequest("PATCH", `/api/admin/testimonials/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setTestimonialOpen(false);
      setEditingTestimonial(null);
      toast({ title: "Testimonial updated" });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial deleted" });
    },
  });

  const toggleTestimonialActive = (t: SelectTestimonial) => {
    updateTestimonialMutation.mutate({ id: t.id, data: { name: t.name, role: t.role || "", content: t.content, rating: t.rating ?? 5, isActive: !t.isActive, displayOrder: t.displayOrder ?? 0 } });
  };

  const openEditTestimonial = (t: SelectTestimonial) => {
    setEditingTestimonial(t);
    setTestimonialForm({ name: t.name, role: t.role || "", content: t.content, rating: t.rating ?? 5, isActive: t.isActive ?? true, displayOrder: t.displayOrder ?? 0 });
    setTestimonialOpen(true);
  };

  type Faq = { q: string; a: string };
  type PathwayCard = { title: string; intro: string; bullets: string[] };
  interface SiteCopyData {
    homeFaqs: Faq[];
    howItWorksFaqs: Faq[];
    pathwayCards: { card1: PathwayCard; card2: PathwayCard };
  }

  const { data: siteCopy, isLoading: siteCopyLoading } = useQuery<SiteCopyData>({
    queryKey: ["/api/admin/site-copy"],
    queryFn: async () => {
      const res = await fetch("/api/admin/site-copy", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch site copy");
      return res.json();
    },
    enabled: DEV || (isAuthenticated && !!adminCheck?.isAdmin),
  });

  const [siteCopyDraft, setSiteCopyDraft] = useState<SiteCopyData | null>(null);

  const [leanExps, setLeanExps] = useState<Record<string, "done" | "active" | "pending">>(() => {
    const defaults: Record<string, "done" | "active" | "pending"> = {
      "p1-e1": "done",
      "p1-e2": "done",
    };
    try {
      const saved = JSON.parse(localStorage.getItem("lean-startup-status") || "null");
      return { ...defaults, ...(saved || {}) };
    } catch { return defaults; }
  });
  const setExpStatus = (key: string, status: "done" | "active" | "pending") => {
    const updated = { ...leanExps, [key]: status };
    setLeanExps(updated);
    localStorage.setItem("lean-startup-status", JSON.stringify(updated));
  };
  const activeSiteCopy = siteCopyDraft ?? siteCopy ?? null;

  const saveSiteCopyMutation = useMutation({
    mutationFn: async (data: SiteCopyData) => {
      const res = await apiRequest("PUT", "/api/admin/site-copy", data);
      return res.json();
    },
    onSuccess: (saved: SiteCopyData) => {
      queryClient.setQueryData(["/api/admin/site-copy"], saved);
      queryClient.invalidateQueries({ queryKey: ["/api/site-copy"] });
      setSiteCopyDraft(null);
      toast({ title: "Site copy saved" });
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  function withBase(updater: (base: SiteCopyData) => SiteCopyData) {
    setSiteCopyDraft(prev => {
      const base = prev ?? (siteCopy ? JSON.parse(JSON.stringify(siteCopy)) : null);
      if (!base) return prev;
      return updater(base);
    });
  }

  function updateHomeFaq(index: number, field: "q" | "a", value: string) {
    withBase(base => {
      const faqs = [...base.homeFaqs];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...base, homeFaqs: faqs };
    });
  }

  function addHomeFaq() {
    withBase(base => ({ ...base, homeFaqs: [...base.homeFaqs, { q: "", a: "" }] }));
  }

  function removeHomeFaq(index: number) {
    withBase(base => ({ ...base, homeFaqs: base.homeFaqs.filter((_, i) => i !== index) }));
  }

  function updateHowItWorksFaq(index: number, field: "q" | "a", value: string) {
    withBase(base => {
      const faqs = [...base.howItWorksFaqs];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...base, howItWorksFaqs: faqs };
    });
  }

  function addHowItWorksFaq() {
    withBase(base => ({ ...base, howItWorksFaqs: [...base.howItWorksFaqs, { q: "", a: "" }] }));
  }

  function removeHowItWorksFaq(index: number) {
    withBase(base => ({ ...base, howItWorksFaqs: base.howItWorksFaqs.filter((_, i) => i !== index) }));
  }

  function updatePathwayCard(card: "card1" | "card2", field: "title" | "intro", value: string) {
    withBase(base => ({ ...base, pathwayCards: { ...base.pathwayCards, [card]: { ...base.pathwayCards[card], [field]: value } } }));
  }

  function updatePathwayCardBullet(card: "card1" | "card2", index: number, value: string) {
    withBase(base => {
      const bullets = [...base.pathwayCards[card].bullets];
      bullets[index] = value;
      return { ...base, pathwayCards: { ...base.pathwayCards, [card]: { ...base.pathwayCards[card], bullets } } };
    });
  }

  function addPathwayCardBullet(card: "card1" | "card2") {
    withBase(base => {
      const bullets = [...base.pathwayCards[card].bullets, ""];
      return { ...base, pathwayCards: { ...base.pathwayCards, [card]: { ...base.pathwayCards[card], bullets } } };
    });
  }

  function removePathwayCardBullet(card: "card1" | "card2", index: number) {
    withBase(base => {
      const bullets = base.pathwayCards[card].bullets.filter((_, i) => i !== index);
      return { ...base, pathwayCards: { ...base.pathwayCards, [card]: { ...base.pathwayCards[card], bullets } } };
    });
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadedFileName(null);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formDataUpload,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(err.error || "Upload failed");
      }
      const result = await res.json();
      setFormData((prev) => ({ ...prev, url: result.url }));
      setUploadedFileName(result.originalName);
      toast({ title: "File uploaded", description: result.originalName });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message || "Could not upload file", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingItem(null);
    setFormData(emptyForm);
    setUploadedFileName(null);
  };

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({ ...emptyForm, pathwayId: selectedPathway });
    setUploadedFileName(null);
    setFormOpen(true);
  };

  const openEditForm = (item: SelectPathwayContent) => {
    setEditingItem(item);
    setUploadedFileName(null);
    setFormData({
      pathwayId: item.pathwayId,
      contentType: item.contentType,
      title: item.title,
      description: item.description || "",
      url: item.url || "",
      imageUrl: item.imageUrl || "",
      displayOrder: item.displayOrder || 0,
      label: item.label || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = authLoading || adminLoading;
  const isAdmin = adminCheck?.isAdmin;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!DEV && !isAuthenticated) {
    return (
      <Layout>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3" data-testid="text-admin-signin">
                Admin Sign In
              </h1>
              <p className="text-muted-foreground mb-8">
                Sign in with your Replit account to access the admin panel.
              </p>
              <a href="/api/login" data-testid="button-admin-login">
                <Button size="lg" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Sign In with Replit
                </Button>
              </a>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!DEV && !isAdmin) {
    return (
      <Layout>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="text-admin-denied">
                Admin Access Required
              </h1>
              <p className="text-muted-foreground">
                This account does not have admin access.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const groupedContent: Record<string, SelectPathwayContent[]> = {};
  for (const item of content) {
    if (!groupedContent[item.contentType]) {
      groupedContent[item.contentType] = [];
    }
    groupedContent[item.contentType].push(item);
  }
  for (const key of Object.keys(groupedContent)) {
    groupedContent[key].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  const pathwayLabel = PATHWAY_OPTIONS.find((p) => p.value === selectedPathway)?.label || selectedPathway;

  return (
    <Layout>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="text-admin-title">
                  Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage pathway resources, testimonials, subscribers, and view analytics.
                </p>
              </div>
            </div>

            <Tabs defaultValue="resources">
              <TabsList className="mb-6 flex-wrap h-auto gap-1" data-testid="admin-tabs">
                <TabsTrigger value="resources" className="gap-2" data-testid="tab-resources">
                  <BookOpen className="w-4 h-4" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="gap-2" data-testid="tab-testimonials">
                  <Quote className="w-4 h-4" />
                  Testimonials
                </TabsTrigger>
                <TabsTrigger value="subscribers" className="gap-2" data-testid="tab-subscribers">
                  <Mail className="w-4 h-4" />
                  Subscribers
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2" data-testid="tab-analytics">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="sitecopy" className="gap-2" data-testid="tab-sitecopy">
                  <Pencil className="w-4 h-4" />
                  Site Copy
                </TabsTrigger>
                <TabsTrigger value="leanstartup" className="gap-2" data-testid="tab-leanstartup">
                  <Rocket className="w-4 h-4" />
                  Lean Startup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="resources">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="w-full sm:w-80">
                <Select value={selectedPathway} onValueChange={setSelectedPathway}>
                  <SelectTrigger data-testid="select-pathway">
                    <SelectValue placeholder="Select a pathway" />
                  </SelectTrigger>
                  <SelectContent>
                    {PATHWAY_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value} data-testid={`option-pathway-${p.value}`}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => saveForPublishMutation.mutate()}
                  disabled={saveForPublishMutation.isPending}
                  className="gap-2"
                  data-testid="button-save-for-publish"
                >
                  {saveForPublishMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Save for Publish
                </Button>
                <Button onClick={openAddForm} className="gap-2" data-testid="button-add-resource">
                  <Plus className="w-4 h-4" />
                  Add Resource
                </Button>
              </div>
            </div>

            {contentLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : content.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4" data-testid="text-no-resources">
                      No resources yet for {pathwayLabel}.
                    </p>
                    <Button onClick={openAddForm} variant="outline" className="gap-2" data-testid="button-add-first-resource">
                      <Plus className="w-4 h-4" />
                      Add First Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {CONTENT_TYPES.map((ct) => {
                  const items = groupedContent[ct.value];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={ct.value}>
                      <div className="flex items-center gap-2 mb-3">
                        <ct.icon className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          {ct.label} ({items.length})
                        </h2>
                      </div>
                      <div className="space-y-2">
                        {items.map((item, idx) => (
                          <Card key={item.id} data-testid={`card-resource-${item.id}`}>
                            <CardContent className="py-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col items-center gap-1 pt-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    disabled={idx === 0 || reorderMutation.isPending}
                                    onClick={() => reorderMutation.mutate({ id1: item.id, id2: items[idx - 1].id })}
                                    data-testid={`button-move-up-${item.id}`}
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    disabled={idx === items.length - 1 || reorderMutation.isPending}
                                    onClick={() => reorderMutation.mutate({ id1: item.id, id2: items[idx + 1].id })}
                                    data-testid={`button-move-down-${item.id}`}
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h3 className="font-medium text-foreground" data-testid={`text-resource-title-${item.id}`}>
                                      {item.title}
                                    </h3>
                                    {item.contentType === "article" && item.label && (
                                      <Badge variant="outline" className="text-xs">
                                        {item.label}
                                      </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      Order: {item.displayOrder}
                                    </Badge>
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mb-1">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.url && (
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary flex items-center gap-1"
                                      data-testid={`link-resource-url-${item.id}`}
                                    >
                                      {item.url.startsWith("/uploads/") ? (
                                        <>
                                          <FileText className="w-3 h-3" />
                                          Uploaded file
                                        </>
                                      ) : (
                                        <>
                                          <ExternalLink className="w-3 h-3" />
                                          {item.url.length > 60 ? item.url.slice(0, 60) + "..." : item.url}
                                        </>
                                      )}
                                    </a>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => openEditForm(item)}
                                    data-testid={`button-edit-${item.id}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setDeleteId(item.id)}
                                    data-testid={`button-delete-${item.id}`}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
              </TabsContent>

              <TabsContent value="testimonials">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <p className="text-sm text-muted-foreground">Manage testimonials shown on the home page.</p>
                  <Button className="gap-2" onClick={() => { setEditingTestimonial(null); setTestimonialForm({ name: "", role: "", content: "", rating: 5, isActive: true, displayOrder: 0 }); setTestimonialOpen(true); }} data-testid="button-add-testimonial">
                    <Plus className="w-4 h-4" /> Add Testimonial
                  </Button>
                </div>
                {testimonialsLoading ? (
                  <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}</div>
                ) : adminTestimonials.length === 0 ? (
                  <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No testimonials yet. Add the first one above.</p></CardContent></Card>
                ) : (
                  <div className="space-y-3">
                    {adminTestimonials.map((t) => (
                      <Card key={t.id} data-testid={`card-testimonial-admin-${t.id}`}>
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-medium text-foreground">{t.name}</span>
                                {t.email && <span className="text-xs text-muted-foreground">({t.email})</span>}
                                {t.role && <span className="text-sm text-muted-foreground">— {t.role}</span>}
                                <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} className={`w-3 h-3 ${i<(t.rating??5)?"text-amber-400 fill-amber-400":"text-muted-foreground/30"}`}/>)}</div>
                                <Badge variant={t.isActive ? "default" : "outline"} className="text-xs">{t.isActive ? "Visible" : "Hidden"}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{t.content}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button size="icon" variant="ghost" onClick={() => toggleTestimonialActive(t)} title={t.isActive ? "Hide" : "Show"} data-testid={`button-toggle-testimonial-${t.id}`}>
                                {t.isActive ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4" />}
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => openEditTestimonial(t)} data-testid={`button-edit-testimonial-${t.id}`}><Pencil className="w-4 h-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => deleteTestimonialMutation.mutate(t.id)} data-testid={`button-delete-testimonial-${t.id}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="subscribers">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">{subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""} total.</p>
                </div>
                {subscribers.length === 0 ? (
                  <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No subscribers yet.</p></CardContent></Card>
                ) : (
                  <div className="space-y-2">
                    {subscribers.map((s) => (
                      <Card key={s.id} data-testid={`card-subscriber-${s.id}`}>
                        <CardContent className="py-3">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium text-foreground text-sm">{s.email}</span>
                                {s.name && <span className="text-sm text-muted-foreground">({s.name})</span>}
                                <Badge variant="outline" className="text-xs">{s.source}</Badge>
                                {!s.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                                {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                                {s.notes && ` · ${s.notes}`}
                              </p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => deleteSubscriberMutation.mutate(s.id)} data-testid={`button-delete-subscriber-${s.id}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics">
                {!analytics ? (
                  <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-24 bg-muted rounded-lg animate-pulse"/>)}</div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Total Assessments", value: analytics.totalAssessments, icon: FlaskConical },
                        { label: "Email Subscribers", value: analytics.totalSubscribers, icon: Mail },
                        { label: "Community Posts", value: analytics.totalPosts, icon: BookOpen },
                        { label: "Unique Pathways", value: Object.keys(analytics.pathwayDistribution).length, icon: BarChart3 },
                      ].map(({ label, value, icon: Icon }) => (
                        <Card key={label}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-foreground">{value}</p>
                                <p className="text-xs text-muted-foreground">{label}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader><CardTitle className="text-base">Pathway Distribution</CardTitle></CardHeader>
                        <CardContent>
                          {Object.keys(analytics.pathwayDistribution).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No assessments yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {Object.entries(analytics.pathwayDistribution).sort(([,a],[,b])=>b-a).map(([pathway, count]) => {
                                const pct = analytics.totalAssessments > 0 ? Math.round((count / analytics.totalAssessments) * 100) : 0;
                                return (
                                  <div key={pathway}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm text-foreground">{pathway}</span>
                                      <span className="text-sm text-muted-foreground">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="text-base">Subscribers by Source</CardTitle></CardHeader>
                        <CardContent>
                          {Object.keys(analytics.subscribersBySource).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No subscribers yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {Object.entries(analytics.subscribersBySource).sort(([,a],[,b])=>b-a).map(([source, count]) => (
                                <div key={source} className="flex items-center justify-between">
                                  <span className="text-sm text-foreground capitalize">{source.replace(/_/g," ")}</span>
                                  <Badge variant="secondary">{count}</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sitecopy">
                {siteCopyLoading || !activeSiteCopy ? (
                  <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-20 bg-muted rounded-lg animate-pulse"/>)}</div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <p className="text-sm text-muted-foreground">Edit FAQs and pathway card copy shown on the public site.</p>
                      <div className="flex items-center gap-2">
                        {siteCopyDraft && (
                          <Badge variant="outline" className="text-xs">Unsaved changes</Badge>
                        )}
                        <Button
                          onClick={() => activeSiteCopy && saveSiteCopyMutation.mutate(activeSiteCopy)}
                          disabled={!siteCopyDraft || saveSiteCopyMutation.isPending}
                          data-testid="button-save-site-copy"
                        >
                          {saveSiteCopyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Save All Changes
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-foreground">Home Page FAQs</h2>
                        <Button size="sm" variant="outline" onClick={addHomeFaq} className="gap-1" data-testid="button-add-home-faq">
                          <Plus className="w-3 h-3" /> Add FAQ
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {activeSiteCopy.homeFaqs.map((faq, i) => (
                          <Card key={i} data-testid={`card-home-faq-${i}`}>
                            <CardContent className="pt-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-medium text-muted-foreground mt-1">FAQ {i + 1}</span>
                                <Button size="icon" variant="ghost" onClick={() => removeHomeFaq(i)} data-testid={`button-delete-home-faq-${i}`}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Question</Label>
                                <Input value={faq.q} onChange={e => updateHomeFaq(i, "q", e.target.value)} placeholder="Question text" data-testid={`input-home-faq-q-${i}`} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Answer</Label>
                                <Textarea value={faq.a} onChange={e => updateHomeFaq(i, "a", e.target.value)} placeholder="Answer text" rows={3} data-testid={`input-home-faq-a-${i}`} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-foreground">How It Works Page FAQs</h2>
                        <Button size="sm" variant="outline" onClick={addHowItWorksFaq} className="gap-1" data-testid="button-add-hiw-faq">
                          <Plus className="w-3 h-3" /> Add FAQ
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {activeSiteCopy.howItWorksFaqs.map((faq, i) => (
                          <Card key={i} data-testid={`card-hiw-faq-${i}`}>
                            <CardContent className="pt-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-medium text-muted-foreground mt-1">FAQ {i + 1}</span>
                                <Button size="icon" variant="ghost" onClick={() => removeHowItWorksFaq(i)} data-testid={`button-delete-hiw-faq-${i}`}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Question</Label>
                                <Input value={faq.q} onChange={e => updateHowItWorksFaq(i, "q", e.target.value)} placeholder="Question text" data-testid={`input-hiw-faq-q-${i}`} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Answer</Label>
                                <Textarea value={faq.a} onChange={e => updateHowItWorksFaq(i, "a", e.target.value)} placeholder="Answer text" rows={3} data-testid={`input-hiw-faq-a-${i}`} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="font-semibold text-foreground mb-3">Pathway Example Cards</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(["card1", "card2"] as const).map(cardKey => {
                          const card = activeSiteCopy.pathwayCards[cardKey];
                          return (
                            <Card key={cardKey} data-testid={`card-pathway-${cardKey}`}>
                              <CardHeader><CardTitle className="text-sm">{cardKey === "card1" ? "Card 1" : "Card 2"}</CardTitle></CardHeader>
                              <CardContent className="space-y-3">
                                <div className="space-y-1">
                                  <Label className="text-xs">Title</Label>
                                  <Input value={card.title} onChange={e => updatePathwayCard(cardKey, "title", e.target.value)} placeholder="Card title" data-testid={`input-${cardKey}-title`} />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Intro</Label>
                                  <Textarea value={card.intro} onChange={e => updatePathwayCard(cardKey, "intro", e.target.value)} placeholder="Intro text" rows={2} data-testid={`input-${cardKey}-intro`} />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-xs">Bullets</Label>
                                    <Button size="sm" variant="ghost" onClick={() => addPathwayCardBullet(cardKey)} className="gap-1 text-xs h-7" data-testid={`button-add-bullet-${cardKey}`}>
                                      <Plus className="w-3 h-3" /> Add
                                    </Button>
                                  </div>
                                  {card.bullets.map((b, bi) => (
                                    <div key={bi} className="flex gap-2 items-center">
                                      <Input value={b} onChange={e => updatePathwayCardBullet(cardKey, bi, e.target.value)} placeholder={`Bullet ${bi + 1}`} data-testid={`input-${cardKey}-bullet-${bi}`} />
                                      <Button size="icon" variant="ghost" onClick={() => removePathwayCardBullet(cardKey, bi)} data-testid={`button-remove-bullet-${cardKey}-${bi}`}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* ── LEAN STARTUP TAB ── */}
              <TabsContent value="leanstartup">
                {(() => {
                  const phases = [
                    {
                      id: "p1",
                      phase: "Phase 1",
                      title: "Validate the Offer",
                      subtitle: "Problem–Solution Fit",
                      color: "#2563EB",
                      bg: "#EFF6FF",
                      border: "#BFDBFE",
                      question: "Will people pay $79 for a clinical pathway report they can't get anywhere else?",
                      decision: "Move to Phase 2 when: 10 paying customers reached AND at least one says the report was worth more than they paid.",
                      experiments: [
                        { key: "p1-e1", label: "Build the free screener + paid report (the MVP)", note: "Completed — the product exists." },
                        { key: "p1-e2", label: "Confirm Blue Ocean positioning vs. all competitors", note: "Completed — STOP-BANG, Ubie, home tests all lack PALM + pathway." },
                        { key: "p1-e3", label: "Get first 10 paying customers without running any paid ads", note: "Share directly: personal network, sleep communities, Reddit r/SleepApnea, partner clinics." },
                        { key: "p1-e4", label: "Survey each of the first 10 customers: 'What almost stopped you from buying?'", note: "Use this to find and eliminate the #1 objection on the site." },
                        { key: "p1-e5", label: "Measure: % of screener completers who click 'Get Full Report'", note: "Target: >40%. Below that means the screener isn't creating enough desire." },
                        { key: "p1-e6", label: "Measure: % of 'Get Full Report' clickers who complete payment", note: "Target: >20%. Below that means price, trust, or friction is the blocker." },
                      ],
                    },
                    {
                      id: "p2",
                      phase: "Phase 2",
                      title: "Validate the Price",
                      subtitle: "Willingness to Pay",
                      color: "#16A34A",
                      bg: "#F0FDF4",
                      border: "#BBF7D0",
                      question: "Is $79 the optimal price — or should it be $59 or $99?",
                      decision: "Set price at whichever point maximizes revenue per visitor (not just units sold). If $99 converts at 80% the rate of $79, $99 wins.",
                      experiments: [
                        { key: "p2-e1", label: "Run 2-week A/B test: $79 vs $99 (50 visitors each)", note: "Use a simple URL parameter or date-based split. Measure revenue per visitor, not just conversion rate." },
                        { key: "p2-e2", label: "Add one survey question at the payment screen: 'Is $XX a fair price for this?'", note: "Yes / A little high / Too high. If >20% say 'too high' at $79, reconsider. If <5% at $99, raise it." },
                        { key: "p2-e3", label: "Offer 5 users a 'pay after you read it' trial — does seeing the report first improve conversion?", note: "If yes, add a 'preview first page free' feature. If no, the offer alone is strong enough." },
                        { key: "p2-e4", label: "Test adding a $129 'Consultation Bundle' option (report + 30-min Zoom with Dr. Murphy)", note: "Even if nobody buys it, it makes $79 feel like the obvious value choice." },
                      ],
                    },
                    {
                      id: "p3",
                      phase: "Phase 3",
                      title: "Validate the Channel",
                      subtitle: "Customer Acquisition",
                      color: "#EA580C",
                      bg: "#FFF7ED",
                      border: "#FED7AA",
                      question: "Which channel brings paying customers at a cost well under $79?",
                      decision: "If any channel achieves cost per acquisition < $30, invest more. If none does after $300 total spend, focus on organic and referral only.",
                      experiments: [
                        { key: "p3-e1", label: "Run $100 Facebook/Instagram ad to 'snoring partner' audience — measure cost per screener completion", note: "Target audience: spouses of snorers, 35–65. Creative: 'Your partner stops breathing at night. Here's what that means.'" },
                        { key: "p3-e2", label: "Run $100 Google Search ad for 'sleep apnea test online' and 'do I have sleep apnea'", note: "High intent. Measure cost per purchase (not just screener completion)." },
                        { key: "p3-e3", label: "Compare ?src=watch vs ?src=snoring vs default homepage — which variant converts screener completers to buyers at the highest rate?", note: "Already built into the site. Drive 30 visitors to each and compare purchase rates." },
                        { key: "p3-e4", label: "Reach out to 3 sleep specialist clinics — offer to refer their patients to SleepCheckup as pre-appointment prep", note: "Pitch: 'Your patients arrive 10x more prepared. No cost to you.' Ask for a 2-week trial." },
                        { key: "p3-e5", label: "Post in r/SleepApnea and r/CPAP with a helpful post (not an ad) — mention the free screener", note: "Measure: screener completions from Reddit source in analytics. Do not spam; provide genuine value." },
                      ],
                    },
                    {
                      id: "p4",
                      phase: "Phase 4",
                      title: "Validate Word of Mouth",
                      subtitle: "Referral & Retention",
                      color: "#7C3AED",
                      bg: "#FAF5FF",
                      border: "#DDD6FE",
                      question: "Do people who buy the report tell others about it — and will they?",
                      decision: "If NPS > 50 and referral rate > 10%, invest in a formal referral program. If NPS < 30, fix the report before scaling anything.",
                      experiments: [
                        { key: "p4-e1", label: "Add NPS survey to the post-purchase confirmation email: 'How likely are you to recommend this to a friend? (0–10)'", note: "NPS > 50 = product is strong enough to scale. NPS < 30 = fix the product first." },
                        { key: "p4-e2", label: "Add 'Share with a friend who snores' button at the end of the report", note: "Pre-fill a message: 'I just got my sleep apnea pathway report — you should check yours too.'" },
                        { key: "p4-e3", label: "Email first 10 customers at 48 hours asking for a testimonial in exchange for a $10 Amazon gift card", note: "Testimonials with real names and specific outcomes convert far better than generic praise." },
                        { key: "p4-e4", label: "Send a 30-day follow-up email: 'What happened after your report? Did you see a doctor?'", note: "This creates outcome data — the most powerful social proof you can have." },
                        { key: "p4-e5", label: "Create a 'Refer a Friend' page: $10 credit (or discount code) for every friend who buys a report", note: "Only launch this after NPS > 50. Scaling a broken experience accelerates failure." },
                      ],
                    },
                  ];

                  const statusColor = {
                    done: { bg: "#DCFCE7", text: "#15803D", label: "Done" },
                    active: { bg: "#FEF9C3", text: "#A16207", label: "In Progress" },
                    pending: { bg: "#F3F4F6", text: "#6B7280", label: "Not Started" },
                  };

                  return (
                    <div className="space-y-6">
                      {/* Intro */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EFF6FF" }}>
                              <Lightbulb className="w-5 h-5" style={{ color: "#2563EB" }} />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg mb-1">Lean Startup Roadmap — SleepCheckup.com</h3>
                              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                The Lean Startup method says: don't build more until you've validated what you have. Run the smallest possible experiment, measure the result honestly, and decide whether to <strong>persevere</strong> (double down) or <strong>pivot</strong> (change direction). This roadmap applies that framework specifically to SleepCheckup.
                              </p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                Work through the phases in order. Mark each experiment as <strong>Done</strong>, <strong>In Progress</strong>, or <strong>Not Started</strong>. Your progress is saved automatically.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Phase cards */}
                      {phases.map((phase) => {
                        const doneCount = phase.experiments.filter(e => leanExps[e.key] === "done").length;
                        const activeCount = phase.experiments.filter(e => leanExps[e.key] === "active").length;
                        const total = phase.experiments.length;
                        const pctDone = Math.round((doneCount / total) * 100);

                        return (
                          <Card key={phase.id} style={{ border: `1px solid ${phase.border}` }}>
                            <CardHeader className="pb-3">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: phase.color }}>
                                    {phase.id === "p1" ? "1" : phase.id === "p2" ? "2" : phase.id === "p3" ? "3" : "4"}
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: phase.color }}>{phase.phase} — {phase.subtitle}</p>
                                    <CardTitle className="text-base">{phase.title}</CardTitle>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">{doneCount}/{total} done</span>
                                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${pctDone}%`, backgroundColor: phase.color }} />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 rounded-md px-3 py-2 text-sm" style={{ backgroundColor: phase.bg, color: phase.color }}>
                                <strong>Core hypothesis:</strong> {phase.question}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {phase.experiments.map((exp) => {
                                const status = leanExps[exp.key] ?? "pending";
                                const colors = statusColor[status];
                                return (
                                  <div key={exp.key} className="rounded-md p-4" style={{ backgroundColor: colors.bg, border: `1px solid ${status === "done" ? "#BBF7D0" : status === "active" ? "#FEF08A" : "#E5E7EB"}` }}>
                                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                                      <p className="text-sm font-semibold flex-1" style={{ color: colors.text }}>{exp.label}</p>
                                      {/* Status buttons */}
                                      <div className="flex gap-1 flex-shrink-0">
                                        {(["pending", "active", "done"] as const).map((s) => {
                                          const isSelected = status === s;
                                          const btnLabel = s === "pending" ? "Not Started" : s === "active" ? "In Progress" : "Done";
                                          const selectedStyle = s === "done"
                                            ? { backgroundColor: "#15803D", color: "#fff", borderColor: "#15803D" }
                                            : s === "active"
                                            ? { backgroundColor: "#A16207", color: "#fff", borderColor: "#A16207" }
                                            : { backgroundColor: "#6B7280", color: "#fff", borderColor: "#6B7280" };
                                          const unselectedStyle = { backgroundColor: "transparent", color: "#9CA3AF", borderColor: "#D1D5DB" };
                                          return (
                                            <button
                                              key={s}
                                              onClick={() => setExpStatus(exp.key, s)}
                                              className="text-[11px] font-semibold px-2 py-1 rounded cursor-pointer transition-all"
                                              style={{ border: "1px solid", ...(isSelected ? selectedStyle : unselectedStyle) }}
                                              data-testid={`lean-exp-${s}-${exp.key}`}
                                            >
                                              {btnLabel}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{exp.note}</p>
                                  </div>
                                );
                              })}

                              {/* Decision gate */}
                              <div className="flex gap-2 items-start mt-4 pt-4 border-t">
                                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: phase.color }} />
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: phase.color }}>Pivot or Persevere Decision Gate</p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{phase.decision}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {/* Key Metrics */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" style={{ color: "#2563EB" }} />
                            <CardTitle className="text-base">Key Metrics to Track (Your North Stars)</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { metric: "Screener completion rate", target: ">70% of starters finish", tab: "Analytics tab" },
                              { metric: "Screener → 'Get Report' click rate", target: ">40% of completers", tab: "Analytics tab" },
                              { metric: "Click → Purchase conversion rate", target: ">20% of clickers", tab: "Analytics tab" },
                              { metric: "Net Promoter Score (NPS)", target: ">50 to scale", tab: "Post-purchase email survey" },
                              { metric: "Cost per acquisition (CPA)", target: "<$30 per paying customer", tab: "Ad platform dashboards" },
                              { metric: "Refund rate", target: "<5%", tab: "Stripe dashboard (Phase 2)" },
                            ].map(({ metric, target, tab }) => (
                              <div key={metric} className="rounded-md p-3" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                                <p className="text-sm font-semibold text-foreground mb-0.5">{metric}</p>
                                <p className="text-xs text-muted-foreground mb-1">Target: <span className="font-medium">{target}</span></p>
                                <p className="text-[11px]" style={{ color: "#9CA3AF" }}>Where to find it: {tab}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Pivot or Persevere Framework */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Target className="w-5 h-5" style={{ color: "#DC2626" }} />
                            <CardTitle className="text-base">When to Pivot vs. Persevere</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-md p-4" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA" }}>
                              <p className="text-sm font-bold mb-3" style={{ color: "#EA580C" }}>Signs to Consider Pivoting</p>
                              <ul className="space-y-2">
                                {[
                                  "90 days pass with fewer than 10 paying customers at any price",
                                  "Screener completion rate stays below 40% despite copy changes",
                                  "NPS comes back below 20 from your first 10 customers",
                                  "Every channel has CPA > $79 (you're losing money on every customer)",
                                  "Customers say 'I don't know what to do with this' after reading the report",
                                ].map((item) => (
                                  <li key={item} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                                    <span className="font-bold mt-0.5" style={{ color: "#EA580C" }}>→</span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-md p-4" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                              <p className="text-sm font-bold mb-3" style={{ color: "#16A34A" }}>Signs to Persevere and Scale</p>
                              <ul className="space-y-2">
                                {[
                                  "First 10 customers reached within 60 days without paid ads",
                                  "At least 2 customers say 'this was worth more than I paid'",
                                  "Screener → Report click rate above 40%",
                                  "NPS above 50 from first survey batch",
                                  "Any channel achieves CPA under $30",
                                ].map((item) => (
                                  <li key={item} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                                    <span className="font-bold mt-0.5" style={{ color: "#16A34A" }}>✓</span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4 rounded-md p-3" style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                            <p className="text-xs leading-relaxed" style={{ color: "#1D4ED8" }}>
                              <strong>The fundamental question</strong> this entire roadmap answers: "Will people pay for clinical insight about their sleep health, or do they only want a free score?" Everything you learn in Phase 1 answers this. Do not scale spending until you know the answer.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })()}
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </section>

      <Dialog open={testimonialOpen} onOpenChange={(open) => { if (!open) { setTestimonialOpen(false); setEditingTestimonial(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            <DialogDescription>Fill in the testimonial details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={testimonialForm.name} onChange={e => setTestimonialForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Sarah M." data-testid="input-testimonial-name" />
            </div>
            <div className="space-y-2">
              <Label>Role / Description (optional)</Label>
              <Input value={testimonialForm.role} onChange={e => setTestimonialForm(p=>({...p,role:e.target.value}))} placeholder="e.g. CPAP user, 3 years" data-testid="input-testimonial-role" />
            </div>
            <div className="space-y-2">
              <Label>Testimonial *</Label>
              <Textarea value={testimonialForm.content} onChange={e => setTestimonialForm(p=>({...p,content:e.target.value}))} placeholder="What did they say?" rows={4} data-testid="input-testimonial-content" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating (1–5)</Label>
                <Select value={String(testimonialForm.rating)} onValueChange={v => setTestimonialForm(p=>({...p,rating:Number(v)}))}>
                  <SelectTrigger data-testid="select-testimonial-rating"><SelectValue /></SelectTrigger>
                  <SelectContent>{[5,4,3,2,1].map(r=><SelectItem key={r} value={String(r)}>{r} stars</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={testimonialForm.displayOrder} onChange={e => setTestimonialForm(p=>({...p,displayOrder:Number(e.target.value)}))} data-testid="input-testimonial-order" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setTestimonialOpen(false); setEditingTestimonial(null); }}>Cancel</Button>
            <Button
              disabled={!testimonialForm.name.trim() || !testimonialForm.content.trim() || createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
              onClick={() => editingTestimonial ? updateTestimonialMutation.mutate({ id: editingTestimonial.id, data: testimonialForm }) : createTestimonialMutation.mutate(testimonialForm)}
              data-testid="button-save-testimonial"
            >
              {createTestimonialMutation.isPending || updateTestimonialMutation.isPending ? "Saving..." : editingTestimonial ? "Save Changes" : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={(open) => { if (!open) closeForm(); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle data-testid="text-form-title">
              {editingItem ? "Edit Resource" : "Add Resource"}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the resource details below." : "Fill in the details to add a new resource."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Type</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, contentType: v }))}
                >
                  <SelectTrigger data-testid="select-content-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((ct) => (
                      <SelectItem key={ct.value} value={ct.value}>
                        {ct.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  data-testid="input-display-order"
                />
              </div>
            </div>
            {formData.contentType === "article" && (
              <div className="space-y-2">
                <Label htmlFor="label">Badge Label</Label>
                <Select
                  value={formData.label || "Article"}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, label: v }))}
                >
                  <SelectTrigger data-testid="select-label">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="Guide">Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {formData.contentType === "book" && (
              <div className="space-y-2">
                <Label htmlFor="label">Badge Label</Label>
                <Select
                  value={formData.label || "Book"}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, label: v }))}
                >
                  <SelectTrigger data-testid="select-label-book">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Book">Book</SelectItem>
                    <SelectItem value="Medical Study">Medical Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Resource title"
                data-testid="input-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description (optional)"
                rows={3}
                data-testid="input-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL or File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => { setFormData((prev) => ({ ...prev, url: e.target.value })); setUploadedFileName(null); }}
                  placeholder="https://... or upload a file"
                  className="flex-1"
                  data-testid="input-url"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.csv,.zip,.png,.jpg,.jpeg,.gif,.webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  data-testid="input-file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-file"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              </div>
              {uploadedFileName && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Uploaded: {uploadedFileName}
                </p>
              )}
              {formData.url && formData.url.startsWith("/uploads/") && !uploadedFileName && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  File attached
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
                data-testid="input-image-url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm} data-testid="button-cancel-form">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title.trim() || createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-resource"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingItem ? "Save Changes" : "Add Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
