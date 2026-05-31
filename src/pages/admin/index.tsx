import { useState, useEffect, useRef, useCallback } from "react";
import { PATHWAY_CONTENT_SEED } from "@/lib/admin-seed-data";
import {
  Plus, Pencil, Trash2, Shield, Video, BookOpen, ShoppingBag,
  BookMarked, Stethoscope, ExternalLink, Lock, Upload, Users,
  BarChart3, Star, Mail, Quote, ToggleLeft, ToggleRight,
  FileText, Loader2, ArrowUp, ArrowDown, FlaskConical,
  Rocket, Target, TrendingUp, Lightbulb, ChevronRight, Home,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// ── Types ────────────────────────────────────────────────────────────────────

interface PathwayContent {
  id: string; pathwayId: string; contentType: string; title: string;
  description: string | null; url: string | null; imageUrl: string | null;
  displayOrder: number; label: string | null;
}
interface Testimonial {
  id: string; name: string; email?: string | null; role?: string | null;
  content: string; rating: number; isActive: boolean; displayOrder: number;
}
interface Subscriber {
  id: string; email: string; name?: string | null; source: string;
  isActive: boolean; subscribedAt?: string | null; notes?: string | null;
}
interface Analytics {
  totalAssessments: number; pathwayDistribution: Record<string, number>;
  totalSubscribers: number; totalPosts: number; subscribersBySource: Record<string, number>;
}
interface Faq { q: string; a: string; }
interface PathwayCard { title: string; intro: string; bullets: string[]; }
interface SiteCopyData {
  homeFaqs: Faq[]; howItWorksFaqs: Faq[];
  pathwayCards: { card1: PathwayCard; card2: PathwayCard };
}

// ── Constants ────────────────────────────────────────────────────────────────

const PATHWAY_OPTIONS = [
  { value: "general", label: "General Resources (Free Screening)" },
  { value: "A_insomnia", label: "Pathway A: Sleep Apnea with Insomnia" },
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

const TABS = [
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "subscribers", label: "Subscribers", icon: Mail },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "sitecopy", label: "Site Copy", icon: Pencil },
  { id: "leanstartup", label: "Lean Startup", icon: Rocket },
] as const;

type TabId = typeof TABS[number]["id"];

const LEAN_PHASES = [
  {
    id: "p1", phase: "Phase 1", title: "Validate the Offer", subtitle: "Problem–Solution Fit",
    color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE",
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
    id: "p2", phase: "Phase 2", title: "Validate the Price", subtitle: "Willingness to Pay",
    color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0",
    question: "Is $79 the optimal price — or should it be $59 or $99?",
    decision: "Set price at whichever point maximizes revenue per visitor. If $99 converts at 80% the rate of $79, $99 wins.",
    experiments: [
      { key: "p2-e1", label: "Run 2-week A/B test: $79 vs $99 (50 visitors each)", note: "Use a simple URL parameter or date-based split. Measure revenue per visitor, not just conversion rate." },
      { key: "p2-e2", label: "Add one survey question at the payment screen: 'Is $XX a fair price for this?'", note: "Yes / A little high / Too high. If >20% say 'too high' at $79, reconsider. If <5% at $99, raise it." },
      { key: "p2-e3", label: "Offer 5 users a 'pay after you read it' trial — does seeing the report first improve conversion?", note: "If yes, add a 'preview first page free' feature. If no, the offer alone is strong enough." },
      { key: "p2-e4", label: "Test adding a $129 'Consultation Bundle' option (report + 30-min Zoom with Dr. Murphy)", note: "Even if nobody buys it, it makes $79 feel like the obvious value choice." },
    ],
  },
  {
    id: "p3", phase: "Phase 3", title: "Validate the Channel", subtitle: "Customer Acquisition",
    color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA",
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
    id: "p4", phase: "Phase 4", title: "Validate Word of Mouth", subtitle: "Referral & Retention",
    color: "#7C3AED", bg: "#FAF5FF", border: "#DDD6FE",
    question: "Do people who buy the report tell others about it — and will they?",
    decision: "If NPS > 50 and referral rate > 10%, invest in a formal referral program. If NPS < 30, fix the report before scaling anything.",
    experiments: [
      { key: "p4-e1", label: "Add NPS survey to the post-purchase confirmation email: 'How likely are you to recommend this to a friend? (0–10)'", note: "NPS > 50 = product is strong enough to scale. NPS < 30 = fix the product first." },
      { key: "p4-e2", label: "Add 'Share with a friend who snores' button at the end of the report", note: "Pre-fill a message: 'I just got my sleep apnea pathway report — you should check yours too.'" },
      { key: "p4-e3", label: "Email first 10 customers at 48 hours asking for a testimonial in exchange for a $10 Amazon gift card", note: "Testimonials with real names and specific outcomes convert far better than generic praise." },
      { key: "p4-e4", label: "Send a 30-day follow-up email: 'What happened after your report? Did you see a doctor?'", note: "This creates outcome data — the most powerful social proof you can have." },
      { key: "p4-e5", label: "Create a 'Refer a Friend' page: $10 credit for every friend who buys a report", note: "Only launch this after NPS > 50. Scaling a broken experience accelerates failure." },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch(method: string, path: string, body?: unknown) {
  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json().catch(() => null);
}

function NativeSelect({ value, onChange, children, className = "" }: {
  value: string; onChange: (v: string) => void;
  children: React.ReactNode; className?: string;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      style={{ height: "40px" }}
    >
      {children}
    </select>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

function ConfirmDialog({ open, title, description, onConfirm, onCancel, loading }: {
  open: boolean; title: string; description: string;
  onConfirm: () => void; onCancel: () => void; loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onCancel(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { toast } = useToast();
  const DEV = import.meta.env.DEV;

  // Auth
  const [authState, setAuthState] = useState<"loading" | "authed" | "denied" | "unauthenticated">(
    DEV ? "authed" : "loading"
  );

  useEffect(() => {
    if (DEV) return;
    fetch("/api/admin/check", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => setAuthState(data?.isAdmin ? "authed" : "denied"))
      .catch(() => setAuthState("unauthenticated"));
  }, [DEV]);

  // Active tab
  const [tab, setTab] = useState<TabId>("resources");

  // ── Tab 1: Resources ────────────────────────────────────────────────────
  const [selectedPathway, setSelectedPathway] = useState("A_insomnia");
  const [resources, setResources] = useState<PathwayContent[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resFormOpen, setResFormOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<PathwayContent | null>(null);
  const [deleteResId, setDeleteResId] = useState<string | null>(null);
  const [deletingRes, setDeletingRes] = useState(false);
  const [reorderingRes, setReorderingRes] = useState(false);
  const [savingPublish, setSavingPublish] = useState(false);
  const [usingSeeds, setUsingSeeds] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emptyResForm = { pathwayId: selectedPathway, contentType: "video", title: "", description: "", url: "", imageUrl: "", displayOrder: 0, label: "" };
  const [resForm, setResForm] = useState(emptyResForm);

  const fetchResources = useCallback(async (pathway: string) => {
    setResourcesLoading(true);
    try {
      const data = await apiFetch("GET", `/api/admin/pathway-content?pathwayId=${pathway}`);
      const rows = data ?? [];
      if (rows.length > 0) {
        setResources(rows);
        setUsingSeeds(false);
      } else {
        const seed = PATHWAY_CONTENT_SEED.filter(r => r.pathwayId === pathway);
        setResources(seed);
        setUsingSeeds(seed.length > 0);
      }
    } catch {
      const seed = PATHWAY_CONTENT_SEED.filter(r => r.pathwayId === pathway);
      setResources(seed);
      setUsingSeeds(seed.length > 0);
    } finally { setResourcesLoading(false); }
  }, []);

  useEffect(() => {
    if (authState === "authed" && tab === "resources") fetchResources(selectedPathway);
  }, [authState, tab, selectedPathway, fetchResources]);

  const groupedResources: Record<string, PathwayContent[]> = {};
  for (const item of resources) {
    if (!groupedResources[item.contentType]) groupedResources[item.contentType] = [];
    groupedResources[item.contentType].push(item);
  }
  for (const key of Object.keys(groupedResources)) {
    groupedResources[key].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", credentials: "include", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      setResForm(prev => ({ ...prev, url: result.url }));
      setUploadedFileName(result.originalName);
      toast({ title: "File uploaded", description: result.originalName });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploading(false); e.target.value = ""; }
  };

  const openAddRes = () => { setEditingRes(null); setResForm({ ...emptyResForm, pathwayId: selectedPathway }); setUploadedFileName(null); setResFormOpen(true); };
  const openEditRes = (item: PathwayContent) => {
    setEditingRes(item);
    setResForm({ pathwayId: item.pathwayId, contentType: item.contentType, title: item.title, description: item.description ?? "", url: item.url ?? "", imageUrl: item.imageUrl ?? "", displayOrder: item.displayOrder ?? 0, label: item.label ?? "" });
    setUploadedFileName(null);
    setResFormOpen(true);
  };
  const closeResForm = () => { setResFormOpen(false); setEditingRes(null); setResForm(emptyResForm); setUploadedFileName(null); };

  const handleResSubmit = async () => {
    if (!resForm.title.trim()) return;
    try {
      const body = { ...resForm, description: resForm.description || null, url: resForm.url || null, imageUrl: resForm.imageUrl || null, label: resForm.label || null };
      if (editingRes) await apiFetch("PATCH", `/api/admin/pathway-content/${editingRes.id}`, body);
      else await apiFetch("POST", "/api/admin/pathway-content", body);
      closeResForm();
      fetchResources(selectedPathway);
      toast({ title: editingRes ? "Resource updated" : "Resource added" });
    } catch (err: any) { toast({ title: "Save failed", description: err.message, variant: "destructive" }); }
  };

  const handleReorder = async (id1: string, id2: string) => {
    setReorderingRes(true);
    try { await apiFetch("POST", "/api/admin/pathway-content/reorder", { id1, id2 }); fetchResources(selectedPathway); }
    catch (err: any) { toast({ title: "Reorder failed", description: err.message, variant: "destructive" }); }
    finally { setReorderingRes(false); }
  };

  const handleDeleteRes = async () => {
    if (!deleteResId) return;
    setDeletingRes(true);
    try { await apiFetch("DELETE", `/api/admin/pathway-content/${deleteResId}`); setDeleteResId(null); fetchResources(selectedPathway); toast({ title: "Deleted" }); }
    catch (err: any) { toast({ title: "Delete failed", description: err.message, variant: "destructive" }); }
    finally { setDeletingRes(false); }
  };

  const handleSaveForPublish = async () => {
    setSavingPublish(true);
    try {
      const data = await apiFetch("POST", "/api/admin/save-content-snapshot", {});
      toast({ title: "Saved for publish", description: `${data?.count ?? 0} resources saved.` });
    } catch (err: any) { toast({ title: "Save failed", description: err.message, variant: "destructive" }); }
    finally { setSavingPublish(false); }
  };

  // ── Tab 2: Testimonials ─────────────────────────────────────────────────
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testFormOpen, setTestFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Testimonial | null>(null);
  const [deleteTestId, setDeleteTestId] = useState<string | null>(null);
  const [deletingTest, setDeletingTest] = useState(false);
  const emptyTestForm = { name: "", role: "", content: "", rating: 5, isActive: true, displayOrder: 0 };
  const [testForm, setTestForm] = useState(emptyTestForm);

  const fetchTestimonials = useCallback(async () => {
    setTestimonialsLoading(true);
    try { setTestimonials(await apiFetch("GET", "/api/admin/testimonials") ?? []); }
    catch { setTestimonials([]); } finally { setTestimonialsLoading(false); }
  }, []);

  useEffect(() => { if (authState === "authed" && tab === "testimonials") fetchTestimonials(); }, [authState, tab, fetchTestimonials]);

  const openAddTest = () => { setEditingTest(null); setTestForm(emptyTestForm); setTestFormOpen(true); };
  const openEditTest = (t: Testimonial) => { setEditingTest(t); setTestForm({ name: t.name, role: t.role ?? "", content: t.content, rating: t.rating, isActive: t.isActive, displayOrder: t.displayOrder }); setTestFormOpen(true); };

  const handleTestSubmit = async () => {
    if (!testForm.name.trim() || !testForm.content.trim()) return;
    try {
      if (editingTest) await apiFetch("PATCH", `/api/admin/testimonials/${editingTest.id}`, testForm);
      else await apiFetch("POST", "/api/admin/testimonials", testForm);
      setTestFormOpen(false); setEditingTest(null); fetchTestimonials();
      toast({ title: editingTest ? "Testimonial updated" : "Testimonial added" });
    } catch (err: any) { toast({ title: "Save failed", description: err.message, variant: "destructive" }); }
  };

  const handleToggleTest = async (t: Testimonial) => {
    try {
      await apiFetch("PATCH", `/api/admin/testimonials/${t.id}`, { ...t, role: t.role ?? "", isActive: !t.isActive });
      fetchTestimonials();
    } catch (err: any) { toast({ title: "Update failed", description: err.message, variant: "destructive" }); }
  };

  const handleDeleteTest = async () => {
    if (!deleteTestId) return;
    setDeletingTest(true);
    try { await apiFetch("DELETE", `/api/admin/testimonials/${deleteTestId}`); setDeleteTestId(null); fetchTestimonials(); toast({ title: "Deleted" }); }
    catch (err: any) { toast({ title: "Delete failed", description: err.message, variant: "destructive" }); }
    finally { setDeletingTest(false); }
  };

  // ── Tab 3: Subscribers ──────────────────────────────────────────────────
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [deleteSubId, setDeleteSubId] = useState<string | null>(null);
  const [deletingSub, setDeletingSub] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    setSubsLoading(true);
    try { setSubscribers(await apiFetch("GET", "/api/admin/subscribers") ?? []); }
    catch { setSubscribers([]); } finally { setSubsLoading(false); }
  }, []);

  useEffect(() => { if (authState === "authed" && tab === "subscribers") fetchSubscribers(); }, [authState, tab, fetchSubscribers]);

  const handleDeleteSub = async () => {
    if (!deleteSubId) return;
    setDeletingSub(true);
    try { await apiFetch("DELETE", `/api/admin/subscribers/${deleteSubId}`); setDeleteSubId(null); fetchSubscribers(); toast({ title: "Subscriber removed" }); }
    catch (err: any) { toast({ title: "Delete failed", description: err.message, variant: "destructive" }); }
    finally { setDeletingSub(false); }
  };

  // ── Tab 4: Analytics ────────────────────────────────────────────────────
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try { setAnalytics(await apiFetch("GET", "/api/admin/analytics")); }
    catch { setAnalytics(null); } finally { setAnalyticsLoading(false); }
  }, []);

  useEffect(() => { if (authState === "authed" && tab === "analytics") fetchAnalytics(); }, [authState, tab, fetchAnalytics]);

  // ── Tab 5: Site Copy ────────────────────────────────────────────────────
  const [siteCopy, setSiteCopy] = useState<SiteCopyData | null>(null);
  const [siteCopyDraft, setSiteCopyDraft] = useState<SiteCopyData | null>(null);
  const [siteCopyLoading, setSiteCopyLoading] = useState(false);
  const [savingSiteCopy, setSavingSiteCopy] = useState(false);
  const activeSiteCopy = siteCopyDraft ?? siteCopy;

  const fetchSiteCopy = useCallback(async () => {
    setSiteCopyLoading(true);
    try { setSiteCopy(await apiFetch("GET", "/api/admin/site-copy")); }
    catch { setSiteCopy(null); } finally { setSiteCopyLoading(false); }
  }, []);

  useEffect(() => { if (authState === "authed" && tab === "sitecopy") fetchSiteCopy(); }, [authState, tab, fetchSiteCopy]);

  function withBase(updater: (base: SiteCopyData) => SiteCopyData) {
    setSiteCopyDraft(prev => {
      const base = prev ?? (siteCopy ? JSON.parse(JSON.stringify(siteCopy)) : null);
      if (!base) return prev;
      return updater(base);
    });
  }

  const handleSaveSiteCopy = async () => {
    if (!activeSiteCopy) return;
    setSavingSiteCopy(true);
    try {
      const saved = await apiFetch("PUT", "/api/admin/site-copy", activeSiteCopy);
      setSiteCopy(saved); setSiteCopyDraft(null);
      toast({ title: "Site copy saved" });
    } catch (err: any) { toast({ title: "Save failed", description: err.message, variant: "destructive" }); }
    finally { setSavingSiteCopy(false); }
  };

  // ── Tab 6: Lean Startup ─────────────────────────────────────────────────
  const [leanExps, setLeanExps] = useState<Record<string, "done" | "active" | "pending">>(() => {
    const defaults: Record<string, "done" | "active" | "pending"> = { "p1-e1": "done", "p1-e2": "done" };
    try { return { ...defaults, ...(JSON.parse(localStorage.getItem("lean-startup-status") || "null") ?? {}) }; }
    catch { return defaults; }
  });

  const setExpStatus = (key: string, status: "done" | "active" | "pending") => {
    const updated = { ...leanExps, [key]: status };
    setLeanExps(updated);
    localStorage.setItem("lean-startup-status", JSON.stringify(updated));
  };

  // ── Auth gates ───────────────────────────────────────────────────────────

  if (authState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-sans)" }}>Admin Sign In</h1>
          <p className="text-gray-500 mb-8" style={{ fontFamily: "var(--font-sans)" }}>Sign in with your Replit account to access the admin panel.</p>
          <a href="/api/login">
            <Button size="lg" className="gap-2">
              <Shield className="w-4 h-4" /> Sign In with Replit
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (authState === "denied") {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-sans)" }}>Admin Access Required</h1>
          <p className="text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>This account does not have admin access.</p>
        </div>
      </div>
    );
  }

  // ── Admin panel ──────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)", fontFamily: "var(--font-sans)" }}>
        <div className="mx-auto px-4 md:px-8 py-8" style={{ maxWidth: "1100px" }}>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--blue-soft)" }}>
              <Shield className="w-5 h-5" style={{ color: "var(--blue)" }} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-ink)" }}>Admin Panel</h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Manage pathway resources, testimonials, subscribers, and analytics.</p>
            </div>
            <Link href="/" className="no-underline flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--text-muted)", border: "1px solid var(--border-soft)", backgroundColor: "var(--bg-card)" }}>
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>

          {/* Tab nav */}
          <div className="flex flex-wrap gap-1 mb-8 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: active ? "var(--blue)" : "transparent",
                    color: active ? "#fff" : "var(--text-muted)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── TAB 1: Resources ── */}
          {tab === "resources" && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="w-full sm:w-80">
                  <NativeSelect value={selectedPathway} onChange={setSelectedPathway}>
                    {PATHWAY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </NativeSelect>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" onClick={handleSaveForPublish} disabled={savingPublish} className="gap-2">
                    {savingPublish ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    Save for Publish
                  </Button>
                  <Button onClick={openAddRes} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Resource
                  </Button>
                </div>
              </div>

              {usingSeeds && !resourcesLoading && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg mb-4 text-sm" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA", color: "#92400E" }}>
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Showing v1 seed data</strong> — no live API connected. Add/edit/delete will require a backend.</span>
                </div>
              )}

              {resourcesLoading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)}</div>
              ) : resources.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                      No resources yet for {PATHWAY_OPTIONS.find(p => p.value === selectedPathway)?.label}.
                    </p>
                    <Button onClick={openAddRes} variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" /> Add First Resource
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {CONTENT_TYPES.map(ct => {
                    const items = groupedResources[ct.value];
                    if (!items?.length) return null;
                    return (
                      <div key={ct.value}>
                        <div className="flex items-center gap-2 mb-3">
                          <ct.icon className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                            {ct.label} ({items.length})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <Card key={item.id}>
                              <CardContent className="py-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex flex-col items-center gap-1 pt-1">
                                    <Button size="icon" variant="ghost" disabled={idx === 0 || reorderingRes}
                                      onClick={() => handleReorder(item.id, items[idx - 1].id)}>
                                      <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" disabled={idx === items.length - 1 || reorderingRes}
                                      onClick={() => handleReorder(item.id, items[idx + 1].id)}>
                                      <ArrowDown className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className="font-medium text-sm" style={{ color: "var(--text-ink)" }}>{item.title}</span>
                                      {item.label && <Badge variant="outline" className="text-xs">{item.label}</Badge>}
                                      <Badge variant="secondary" className="text-xs">Order: {item.displayOrder}</Badge>
                                    </div>
                                    {item.description && <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{item.description}</p>}
                                    {item.url && (
                                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                                        className="text-xs flex items-center gap-1" style={{ color: "var(--blue)" }}>
                                        {item.url.startsWith("/uploads/")
                                          ? <><FileText className="w-3 h-3" /> Uploaded file</>
                                          : <><ExternalLink className="w-3 h-3" />{item.url.length > 60 ? item.url.slice(0, 60) + "…" : item.url}</>}
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Button size="icon" variant="ghost" onClick={() => openEditRes(item)}><Pencil className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" onClick={() => setDeleteResId(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
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
            </div>
          )}

          {/* ── TAB 2: Testimonials ── */}
          {tab === "testimonials" && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Manage testimonials shown on the home page.</p>
                <Button className="gap-2" onClick={openAddTest}><Plus className="w-4 h-4" /> Add Testimonial</Button>
              </div>
              {testimonialsLoading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)}</div>
              ) : testimonials.length === 0 ? (
                <Card><CardContent className="py-12 text-center"><p className="text-sm" style={{ color: "var(--text-muted)" }}>No testimonials yet.</p></CardContent></Card>
              ) : (
                <div className="space-y-3">
                  {testimonials.map(t => (
                    <Card key={t.id}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-medium text-sm" style={{ color: "var(--text-ink)" }}>{t.name}</span>
                              {t.email && <span className="text-xs" style={{ color: "var(--text-muted)" }}>({t.email})</span>}
                              {t.role && <span className="text-sm" style={{ color: "var(--text-muted)" }}>— {t.role}</span>}
                              <StarRow rating={t.rating} />
                              <Badge variant={t.isActive ? "default" : "outline"} className="text-xs">{t.isActive ? "Visible" : "Hidden"}</Badge>
                            </div>
                            <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{t.content}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button size="icon" variant="ghost" onClick={() => handleToggleTest(t)} title={t.isActive ? "Hide" : "Show"}>
                              {t.isActive ? <ToggleRight className="w-4 h-4" style={{ color: "var(--blue)" }} /> : <ToggleLeft className="w-4 h-4" />}
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openEditTest(t)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => setDeleteTestId(t.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: Subscribers ── */}
          {tab === "subscribers" && (
            <div>
              <div className="mb-6">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""} total.
                </p>
              </div>
              {subsLoading ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}</div>
              ) : subscribers.length === 0 ? (
                <Card><CardContent className="py-12 text-center"><p className="text-sm" style={{ color: "var(--text-muted)" }}>No subscribers yet.</p></CardContent></Card>
              ) : (
                <div className="space-y-2">
                  {subscribers.map(s => (
                    <Card key={s.id}>
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                              <span className="font-medium text-sm" style={{ color: "var(--text-ink)" }}>{s.email}</span>
                              {s.name && <span className="text-sm" style={{ color: "var(--text-muted)" }}>({s.name})</span>}
                              <Badge variant="outline" className="text-xs">{s.source}</Badge>
                              {!s.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                            </div>
                            <p className="text-xs mt-0.5 ml-6" style={{ color: "var(--text-muted)" }}>
                              {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                              {s.notes && ` · ${s.notes}`}
                            </p>
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => setDeleteSubId(s.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: Analytics ── */}
          {tab === "analytics" && (
            <div>
              {analyticsLoading || !analytics ? (
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />)}</div>
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
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--blue-soft)" }}>
                              <Icon className="w-4 h-4" style={{ color: "var(--blue)" }} />
                            </div>
                            <div>
                              <p className="text-2xl font-bold" style={{ color: "var(--text-ink)" }}>{value}</p>
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
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
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No assessments yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {Object.entries(analytics.pathwayDistribution).sort(([, a], [, b]) => b - a).map(([pathway, count]) => {
                              const pct = analytics.totalAssessments > 0 ? Math.round((count / analytics.totalAssessments) * 100) : 0;
                              return (
                                <div key={pathway}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm" style={{ color: "var(--text-ink)" }}>{pathway}</span>
                                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{count} ({pct}%)</span>
                                  </div>
                                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-soft)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--blue)" }} />
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
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No subscribers yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(analytics.subscribersBySource).sort(([, a], [, b]) => b - a).map(([source, count]) => (
                              <div key={source} className="flex items-center justify-between">
                                <span className="text-sm capitalize" style={{ color: "var(--text-ink)" }}>{source.replace(/_/g, " ")}</span>
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
            </div>
          )}

          {/* ── TAB 5: Site Copy ── */}
          {tab === "sitecopy" && (
            <div>
              {siteCopyLoading || !activeSiteCopy ? (
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)}</div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>Edit FAQs and pathway card copy shown on the public site.</p>
                    <div className="flex items-center gap-2">
                      {siteCopyDraft && <Badge variant="outline" className="text-xs">Unsaved changes</Badge>}
                      <Button onClick={handleSaveSiteCopy} disabled={!siteCopyDraft || savingSiteCopy}>
                        {savingSiteCopy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save All Changes
                      </Button>
                    </div>
                  </div>

                  {/* Home FAQs */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-semibold" style={{ color: "var(--text-ink)" }}>Home Page FAQs</h2>
                      <Button size="sm" variant="outline" className="gap-1"
                        onClick={() => withBase(b => ({ ...b, homeFaqs: [...b.homeFaqs, { q: "", a: "" }] }))}>
                        <Plus className="w-3 h-3" /> Add FAQ
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {activeSiteCopy.homeFaqs.map((faq, i) => (
                        <Card key={i}>
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-medium mt-1" style={{ color: "var(--text-muted)" }}>FAQ {i + 1}</span>
                              <Button size="icon" variant="ghost"
                                onClick={() => withBase(b => ({ ...b, homeFaqs: b.homeFaqs.filter((_, j) => j !== i) }))}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Question</Label>
                              <Input value={faq.q} onChange={e => withBase(b => { const f = [...b.homeFaqs]; f[i] = { ...f[i], q: e.target.value }; return { ...b, homeFaqs: f }; })} placeholder="Question text" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Answer</Label>
                              <Textarea value={faq.a} onChange={e => withBase(b => { const f = [...b.homeFaqs]; f[i] = { ...f[i], a: e.target.value }; return { ...b, homeFaqs: f }; })} rows={3} placeholder="Answer text" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* How It Works FAQs */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-semibold" style={{ color: "var(--text-ink)" }}>How It Works Page FAQs</h2>
                      <Button size="sm" variant="outline" className="gap-1"
                        onClick={() => withBase(b => ({ ...b, howItWorksFaqs: [...b.howItWorksFaqs, { q: "", a: "" }] }))}>
                        <Plus className="w-3 h-3" /> Add FAQ
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {activeSiteCopy.howItWorksFaqs.map((faq, i) => (
                        <Card key={i}>
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-medium mt-1" style={{ color: "var(--text-muted)" }}>FAQ {i + 1}</span>
                              <Button size="icon" variant="ghost"
                                onClick={() => withBase(b => ({ ...b, howItWorksFaqs: b.howItWorksFaqs.filter((_, j) => j !== i) }))}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Question</Label>
                              <Input value={faq.q} onChange={e => withBase(b => { const f = [...b.howItWorksFaqs]; f[i] = { ...f[i], q: e.target.value }; return { ...b, howItWorksFaqs: f }; })} placeholder="Question text" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Answer</Label>
                              <Textarea value={faq.a} onChange={e => withBase(b => { const f = [...b.howItWorksFaqs]; f[i] = { ...f[i], a: e.target.value }; return { ...b, howItWorksFaqs: f }; })} rows={3} placeholder="Answer text" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Pathway Cards */}
                  <div>
                    <h2 className="font-semibold mb-3" style={{ color: "var(--text-ink)" }}>Pathway Example Cards</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {(["card1", "card2"] as const).map(cardKey => {
                        const card = activeSiteCopy.pathwayCards[cardKey];
                        return (
                          <Card key={cardKey}>
                            <CardHeader><CardTitle className="text-sm">{cardKey === "card1" ? "Card 1" : "Card 2"}</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Title</Label>
                                <Input value={card.title} onChange={e => withBase(b => ({ ...b, pathwayCards: { ...b.pathwayCards, [cardKey]: { ...b.pathwayCards[cardKey], title: e.target.value } } }))} placeholder="Card title" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Intro</Label>
                                <Textarea value={card.intro} onChange={e => withBase(b => ({ ...b, pathwayCards: { ...b.pathwayCards, [cardKey]: { ...b.pathwayCards[cardKey], intro: e.target.value } } }))} rows={2} placeholder="Intro text" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs">Bullets</Label>
                                  <Button size="sm" variant="ghost" className="gap-1 text-xs h-7"
                                    onClick={() => withBase(b => ({ ...b, pathwayCards: { ...b.pathwayCards, [cardKey]: { ...b.pathwayCards[cardKey], bullets: [...b.pathwayCards[cardKey].bullets, ""] } } }))}>
                                    <Plus className="w-3 h-3" /> Add
                                  </Button>
                                </div>
                                {card.bullets.map((bullet, bi) => (
                                  <div key={bi} className="flex gap-2 items-center">
                                    <Input value={bullet} onChange={e => withBase(b => { const bullets = [...b.pathwayCards[cardKey].bullets]; bullets[bi] = e.target.value; return { ...b, pathwayCards: { ...b.pathwayCards, [cardKey]: { ...b.pathwayCards[cardKey], bullets } } }; })} placeholder={`Bullet ${bi + 1}`} />
                                    <Button size="icon" variant="ghost"
                                      onClick={() => withBase(b => ({ ...b, pathwayCards: { ...b.pathwayCards, [cardKey]: { ...b.pathwayCards[cardKey], bullets: b.pathwayCards[cardKey].bullets.filter((_, j) => j !== bi) } } }))}>
                                      <Trash2 className="w-4 h-4 text-red-500" />
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
            </div>
          )}

          {/* ── TAB 6: Lean Startup ── */}
          {tab === "leanstartup" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EFF6FF" }}>
                      <Lightbulb className="w-5 h-5" style={{ color: "#2563EB" }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-ink)" }}>Lean Startup Roadmap — SleepCheckup.com</h3>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
                        The Lean Startup method says: don't build more until you've validated what you have. Run the smallest possible experiment, measure the result honestly, and decide whether to <strong>persevere</strong> (double down) or <strong>pivot</strong> (change direction).
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Work through the phases in order. Mark each experiment as <strong>Done</strong>, <strong>In Progress</strong>, or <strong>Not Started</strong>. Your progress is saved automatically.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {LEAN_PHASES.map(phase => {
                const doneCount = phase.experiments.filter(e => leanExps[e.key] === "done").length;
                const total = phase.experiments.length;
                const pct = Math.round((doneCount / total) * 100);
                return (
                  <Card key={phase.id} style={{ border: `1px solid ${phase.border}` }}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: phase.color }}>
                            {phase.id.slice(1)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: phase.color }}>{phase.phase} — {phase.subtitle}</p>
                            <CardTitle className="text-base">{phase.title}</CardTitle>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{doneCount}/{total} done</span>
                          <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-soft)" }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: phase.color }} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 rounded-md px-3 py-2 text-sm" style={{ backgroundColor: phase.bg, color: phase.color }}>
                        <strong>Core hypothesis:</strong> {phase.question}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {phase.experiments.map(exp => {
                        const status = leanExps[exp.key] ?? "pending";
                        const statusColors = {
                          done: { bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0" },
                          active: { bg: "#FEF9C3", text: "#A16207", border: "#FEF08A" },
                          pending: { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
                        };
                        const sc = statusColors[status];
                        return (
                          <div key={exp.key} className="rounded-md p-4" style={{ backgroundColor: sc.bg, border: `1px solid ${sc.border}` }}>
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                              <p className="text-sm font-semibold flex-1" style={{ color: sc.text }}>{exp.label}</p>
                              <div className="flex gap-1 flex-shrink-0">
                                {(["pending", "active", "done"] as const).map(s => {
                                  const selected = status === s;
                                  const btnLabel = s === "pending" ? "Not Started" : s === "active" ? "In Progress" : "Done";
                                  const selStyle = s === "done"
                                    ? { backgroundColor: "#15803D", color: "#fff", borderColor: "#15803D" }
                                    : s === "active"
                                    ? { backgroundColor: "#A16207", color: "#fff", borderColor: "#A16207" }
                                    : { backgroundColor: "#6B7280", color: "#fff", borderColor: "#6B7280" };
                                  return (
                                    <button
                                      key={s}
                                      onClick={() => setExpStatus(exp.key, s)}
                                      className="text-[11px] font-semibold px-2 py-1 rounded cursor-pointer transition-all"
                                      style={{ border: "1px solid", ...(selected ? selStyle : { backgroundColor: "transparent", color: "#9CA3AF", borderColor: "#D1D5DB" }) }}
                                    >
                                      {btnLabel}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{exp.note}</p>
                          </div>
                        );
                      })}
                      <div className="flex gap-2 items-start mt-4 pt-4" style={{ borderTop: "1px solid var(--border-soft)" }}>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: phase.color }} />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: phase.color }}>Pivot or Persevere Decision Gate</p>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{phase.decision}</p>
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
                    <CardTitle className="text-base">Key Metrics to Track</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { metric: "Screener completion rate", target: ">70% of starters finish" },
                      { metric: "Screener → 'Get Report' click rate", target: ">40% of completers" },
                      { metric: "Click → Purchase conversion rate", target: ">20% of clickers" },
                      { metric: "Net Promoter Score (NPS)", target: ">50 to scale" },
                      { metric: "Cost per acquisition (CPA)", target: "<$30 per paying customer" },
                      { metric: "Refund rate", target: "<5%" },
                    ].map(({ metric, target }) => (
                      <div key={metric} className="rounded-md p-3" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                        <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-ink)" }}>{metric}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Target: <span className="font-medium">{target}</span></p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pivot vs Persevere */}
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
                        {["90 days pass with fewer than 10 paying customers at any price", "Screener completion rate stays below 40% despite copy changes", "NPS comes back below 20 from your first 10 customers", "Every channel has CPA > $79 (losing money on every customer)", "Customers say 'I don't know what to do with this' after reading the report"].map(item => (
                          <li key={item} className="flex gap-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            <span className="font-bold mt-0.5" style={{ color: "#EA580C" }}>→</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md p-4" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                      <p className="text-sm font-bold mb-3" style={{ color: "#16A34A" }}>Signs to Persevere and Scale</p>
                      <ul className="space-y-2">
                        {["First 10 customers reached within 60 days without paid ads", "At least 2 customers say 'this was worth more than I paid'", "Screener → Report click rate above 40%", "NPS above 50 from first survey batch", "Any channel achieves CPA under $30"].map(item => (
                          <li key={item} className="flex gap-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            <span className="font-bold mt-0.5" style={{ color: "#16A34A" }}>✓</span>{item}
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
          )}

        </div>
      </div>

      {/* ── Dialogs ── */}

      {/* Resource form */}
      <Dialog open={resFormOpen} onOpenChange={o => { if (!o) closeResForm(); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingRes ? "Edit Resource" : "Add Resource"}</DialogTitle>
            <DialogDescription>{editingRes ? "Update the resource details below." : "Fill in the details to add a new resource."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <NativeSelect value={resForm.contentType} onChange={v => setResForm(p => ({ ...p, contentType: v }))}>
                  {CONTENT_TYPES.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
                </NativeSelect>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={resForm.displayOrder} onChange={e => setResForm(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            {(resForm.contentType === "article" || resForm.contentType === "book") && (
              <div className="space-y-2">
                <Label>Badge Label</Label>
                <NativeSelect value={resForm.label || (resForm.contentType === "article" ? "Article" : "Book")} onChange={v => setResForm(p => ({ ...p, label: v }))}>
                  {resForm.contentType === "article"
                    ? [<option key="Article" value="Article">Article</option>, <option key="Guide" value="Guide">Guide</option>]
                    : [<option key="Book" value="Book">Book</option>, <option key="Medical Study" value="Medical Study">Medical Study</option>]}
                </NativeSelect>
              </div>
            )}
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={resForm.title} onChange={e => setResForm(p => ({ ...p, title: e.target.value }))} placeholder="Resource title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={resForm.description} onChange={e => setResForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Brief description (optional)" />
            </div>
            <div className="space-y-2">
              <Label>URL or File</Label>
              <div className="flex items-center gap-2">
                <Input value={resForm.url} onChange={e => { setResForm(p => ({ ...p, url: e.target.value })); setUploadedFileName(null); }} placeholder="https://... or upload a file" className="flex-1" />
                <input ref={fileInputRef} type="file" className="hidden" accept=".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.png,.jpg,.jpeg,.gif,.webp" onChange={handleFileUpload} disabled={uploading} />
                <Button type="button" variant="outline" size="icon" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              </div>
              {uploadedFileName && <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}><FileText className="w-3 h-3" /> Uploaded: {uploadedFileName}</p>}
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input value={resForm.imageUrl} onChange={e => setResForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeResForm}>Cancel</Button>
            <Button onClick={handleResSubmit} disabled={!resForm.title.trim()}>
              {editingRes ? "Save Changes" : "Add Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial form */}
      <Dialog open={testFormOpen} onOpenChange={o => { if (!o) { setTestFormOpen(false); setEditingTest(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTest ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            <DialogDescription>Fill in the testimonial details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={testForm.name} onChange={e => setTestForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah M." />
            </div>
            <div className="space-y-2">
              <Label>Role / Description (optional)</Label>
              <Input value={testForm.role} onChange={e => setTestForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. CPAP user, 3 years" />
            </div>
            <div className="space-y-2">
              <Label>Testimonial *</Label>
              <Textarea value={testForm.content} onChange={e => setTestForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="What did they say?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating (1–5)</Label>
                <NativeSelect value={String(testForm.rating)} onChange={v => setTestForm(p => ({ ...p, rating: Number(v) }))}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} stars</option>)}
                </NativeSelect>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={testForm.displayOrder} onChange={e => setTestForm(p => ({ ...p, displayOrder: Number(e.target.value) }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setTestFormOpen(false); setEditingTest(null); }}>Cancel</Button>
            <Button disabled={!testForm.name.trim() || !testForm.content.trim()} onClick={handleTestSubmit}>
              {editingTest ? "Save Changes" : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmations */}
      <ConfirmDialog open={!!deleteResId} title="Delete Resource" description="Are you sure you want to delete this resource? This cannot be undone."
        onConfirm={handleDeleteRes} onCancel={() => setDeleteResId(null)} loading={deletingRes} />
      <ConfirmDialog open={!!deleteTestId} title="Delete Testimonial" description="Are you sure you want to delete this testimonial? This cannot be undone."
        onConfirm={handleDeleteTest} onCancel={() => setDeleteTestId(null)} loading={deletingTest} />
      <ConfirmDialog open={!!deleteSubId} title="Remove Subscriber" description="Are you sure you want to remove this subscriber? This cannot be undone."
        onConfirm={handleDeleteSub} onCancel={() => setDeleteSubId(null)} loading={deletingSub} />

      <Toaster />
    </>
  );
}
