import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PathwayResources } from "@/components/PathwayResources";
import { GeneralResources } from "@/components/GeneralResources";
import { getPathwayDefinition } from "@/lib/pathways";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ScreeningProfile, ScreeningState } from "@/lib/screening-types";
import type { PathwayDefinition } from "@/lib/types";
import {
  User,
  ClipboardCheck,
  Printer,
  Download,
  ArrowRight,
  Calendar,
  Activity,
  Brain,
  Scale,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  LogIn,
  LogOut,
  Edit2,
  Save,
  X,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Target,
  FileText,
  Eye,
  Lightbulb,
  Footprints,
} from "lucide-react";

const PATHWAY_COLORS: Record<string, string> = {
  A_insomnia: "from-violet-500 to-purple-600",
  B_obesity: "from-amber-500 to-orange-600",
  C_nasal: "from-cyan-500 to-blue-600",
  D_mandible: "from-emerald-500 to-green-600",
  E_multilevel: "from-rose-500 to-red-600",
  F_physiology: "from-indigo-500 to-blue-700",
  G_low_risk: "from-teal-500 to-emerald-600",
  H_complex: "from-slate-500 to-gray-600",
};

const PATHWAY_LETTERS: Record<string, string> = {
  A_insomnia: "A",
  B_obesity: "B",
  C_nasal: "C",
  D_mandible: "D",
  E_multilevel: "E",
  F_physiology: "F",
  G_low_risk: "G",
  H_complex: "H",
};

function getRiskLabel(risk: string) {
  if (risk === "high") return { text: "High Risk", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" };
  if (risk === "intermediate") return { text: "Intermediate Risk", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };
  return { text: "Low Risk", className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" };
}

function getSeverityLabel(sev: string) {
  if (sev === "severe") return { text: "Severe", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" };
  if (sev === "moderate") return { text: "Moderate", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };
  if (sev === "subthreshold") return { text: "Subthreshold", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" };
  return { text: "None/Mild", className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" };
}

function getScreeningFromLocalStorage(): { profile: ScreeningProfile; date: string | null } | null {
  try {
    const saved = localStorage.getItem("murphy_method_screening");
    if (!saved) return null;
    const parsed: ScreeningState = JSON.parse(saved);
    if (!parsed.profile || parsed.currentStep < 5) return null;
    const date = localStorage.getItem("mm_screening_date");
    return { profile: parsed.profile, date };
  } catch {
    return null;
  }
}

function NotLoggedInState() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <User className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-my-pathway-title">
        My Portal
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your personal sleep health portal. Take the Murphy Method™ screening, track your results, and access personalized resources.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/screening">
          <Button size="lg" data-testid="button-start-screening-portal">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Start Free Screening
          </Button>
        </Link>
        <a href="/api/login">
          <Button variant="outline" size="lg" data-testid="button-login-portal">
            <LogIn className="w-4 h-4 mr-2" />
            Log In
          </Button>
        </a>
        <p className="text-xs text-muted-foreground mt-2">
          By logging in, you agree to the <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link> of Sleep Check Up, Inc.
        </p>
      </div>
    </div>
  );
}

interface ProfileSectionProps {
  user: any;
  profile: any;
  onSave: (data: any) => void;
  isSaving: boolean;
}

function ProfileSection({ user, profile, onSave, isSaving }: ProfileSectionProps) {
  const { logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: profile?.firstName || user?.firstName || "",
    lastName: profile?.lastName || user?.lastName || "",
    dateOfBirth: profile?.dateOfBirth || "",
    gender: profile?.gender || "",
  });

  const handleSave = () => {
    onSave(form);
    setEditing(false);
  };

  const displayName = [form.firstName, form.lastName].filter(Boolean).join(" ") || user?.email || "User";
  const initials = (form.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

  if (!editing) {
    return (
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-border" data-testid="img-profile-avatar">
              <AvatarImage src={user?.profileImageUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-foreground truncate" data-testid="text-profile-name">{displayName}</p>
              {user?.email && (
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              )}
              {form.dateOfBirth && (
                <p className="text-xs text-muted-foreground mt-0.5">Born {form.dateOfBirth}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)} data-testid="button-edit-profile">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => logout()} data-testid="button-logout" title="Sign out">
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4" />
          Edit Profile
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setEditing(false)} data-testid="button-cancel-profile">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} data-testid="input-first-name" />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} data-testid="input-last-name" />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} data-testid="input-dob" />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
              <SelectTrigger data-testid="select-gender">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="mt-4" onClick={handleSave} disabled={isSaving} data-testid="button-save-profile">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}

function ScreeningDashboard({ screeningData }: { screeningData: { profile: ScreeningProfile; date: string | null } }) {
  const { profile, date } = screeningData;
  const osaRisk = getRiskLabel(profile.osaRisk);
  const screeningDate = date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;

  const flaggedZones = [
    profile.anatomy.noseIsPositive,
    profile.anatomy.palateIsPositive,
    profile.anatomy.mandibleIsPositive,
    profile.anatomy.neckIsPositive,
  ].filter(Boolean).length;

  const hookLine = profile.osaRisk === "high"
    ? "I scored high-risk on a sleep apnea screening and I'd like to discuss next steps."
    : profile.osaRisk === "intermediate"
    ? "I scored intermediate-risk on a sleep apnea screening and want to know if I need a sleep study."
    : "I took a sleep apnea screening and scored low-risk, but I still have concerns about my sleep.";

  return (
    <div className="space-y-6">
      <div className="relative rounded-lg bg-gradient-to-r from-primary/80 to-primary p-6 md:p-8 text-primary-foreground overflow-hidden">
        <div className="absolute top-3 right-4 opacity-10">
          <Wind className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <Badge className="bg-white/20 text-primary-foreground border-white/30 mb-3">Screening Complete</Badge>
          <h2 className="text-xl md:text-2xl font-bold mb-2" data-testid="text-screening-headline">
            {profile.osaRisk === "high" ? "Your Results Need Attention" : profile.osaRisk === "intermediate" ? "Some Areas Worth Exploring" : "Good News on Your Initial Screen"}
          </h2>
          <p className="text-primary-foreground/90 text-sm md:text-base max-w-2xl italic" data-testid="text-doctor-hook">
            "{hookLine}"
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Screening Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">STOP-BANG Score</span>
              </div>
              <p className="text-3xl font-bold" data-testid="text-screening-stopbang">{profile.stopBangScore}/8</p>
              <Badge className={`mt-2 ${osaRisk.className}`}>{osaRisk.text}</Badge>
            </div>

            <div className="p-4 rounded-md bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Airway Zones Flagged</span>
              </div>
              <p className="text-3xl font-bold" data-testid="text-screening-zones">{flaggedZones}/4</p>
              <Badge className={`mt-2 ${flaggedZones >= 2 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"}`}>
                {flaggedZones >= 2 ? "Multiple areas" : flaggedZones === 1 ? "One area" : "None flagged"}
              </Badge>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "nose", label: "Nose", score: profile.anatomy.noseScore, max: 5, positive: profile.anatomy.noseIsPositive },
              { key: "palate", label: "Palate", score: profile.anatomy.palateScore, max: 3, positive: profile.anatomy.palateIsPositive },
              { key: "mandible", label: "Jaw/Tongue", score: profile.anatomy.mandibleScore, max: 3, positive: profile.anatomy.mandibleIsPositive },
              { key: "neck", label: "Neck", score: profile.anatomy.neckScore, max: 3, positive: profile.anatomy.neckIsPositive },
            ].map((zone) => (
              <div key={zone.key} className="text-center p-3 rounded-md border border-border">
                <p className="text-xs text-muted-foreground mb-1">{zone.label}</p>
                <p className={`text-lg font-bold ${zone.positive ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
                  {zone.score}/{zone.max}
                </p>
                {zone.positive && (
                  <AlertTriangle className="w-3 h-3 text-amber-500 mx-auto mt-1" />
                )}
              </div>
            ))}
          </div>

          {screeningDate && (
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Completed {screeningDate}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 dark:bg-primary/10">
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1" data-testid="text-upgrade-heading">
                Unlock Your Personalized Pathway
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your screening shows the big picture. The full assessment goes deeper — using 5 additional validated tools to determine exactly which of the 8 Murphy Method™ pathways fits your situation, with tailored resources and a doctor discussion guide.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Medical history review</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> BMI analysis</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> PLATO-11 profile</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> PALM classification</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Pathway assignment</span>
              </div>
              <Link href="/assessment/info">
                <Button data-testid="button-take-full-assessment">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Take Full Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          General Resources
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Educational content for understanding sleep breathing. Take the full assessment to unlock pathway-specific resources tailored to your situation.
        </p>
        <GeneralResources />
      </div>
    </div>
  );
}

function PathwayResultsSummary({ pathwayDef }: { pathwayDef: PathwayDefinition }) {
  const raw = pathwayDef.educationalSummary || "";
  const paragraphs = raw.split("\n\n").map((p) => p.trim()).filter(Boolean);

  const keyConceptPara = paragraphs.find((p) => p.startsWith("Key Concept:"));
  const nextStepPara = paragraphs.find((p) => p.startsWith("Your Next Step:"));
  const mainParagraphs = paragraphs.filter(
    (p) => !p.startsWith("Key Concept:") && !p.startsWith("Your Next Step:")
  );

  const stripPrefix = (text: string, prefix: string) =>
    text.startsWith(prefix) ? text.slice(prefix.length).trim() : text;

  return (
    <Card data-testid="card-pathway-results-summary">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Your Results Summary
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {pathwayDef.shortDescription}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mainParagraphs.map((para, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
            {para}
          </p>
        ))}

        {keyConceptPara && (
          <div className="rounded-md bg-primary/5 border border-primary/20 p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Key Concept</p>
              <p className="text-sm text-foreground leading-relaxed">
                {stripPrefix(keyConceptPara, "Key Concept:")}
              </p>
            </div>
          </div>
        )}

        {nextStepPara && (
          <div className="rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-md bg-green-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Footprints className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">Your Next Step</p>
              <p className="text-sm text-foreground leading-relaxed">
                {stripPrefix(nextStepPara, "Your Next Step:")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AssessmentDashboardProps {
  assessment: any;
  allAssessments: any[];
}

function AssessmentDashboard({ assessment, allAssessments }: AssessmentDashboardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const data = assessment.data as any;
  const pathwayId = assessment.assignedPathway;
  const pathwayDef = getPathwayDefinition(pathwayId);
  const letter = PATHWAY_LETTERS[pathwayId] || "?";
  const gradient = PATHWAY_COLORS[pathwayId] || "from-slate-500 to-gray-600";
  const completedDate = assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Unknown";

  const retakeDate = assessment.completedAt
    ? new Date(new Date(assessment.completedAt).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const osaRisk = getRiskLabel(data?.osaRisk || "low");
  const insomniaSev = getSeverityLabel(data?.insomniaSeverity || "none_mild");

  const hookLine = pathwayDef.shortDescription;

  const handlePrint = () => window.print();

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify({ assessment: data, pathway: pathwayId, completedAt: assessment.completedAt }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sleep-assessment-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className={`relative rounded-lg bg-gradient-to-r ${gradient} p-6 md:p-8 text-white overflow-hidden`}>
        <div className="absolute top-4 right-4 text-white/10 text-[120px] font-black leading-none select-none">
          {letter}
        </div>
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white border-white/30 mb-3">Your Pathway</Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-pathway-identity">
            Pathway {letter}: {pathwayDef.title.replace(`Pathway ${letter}: `, "")}
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-2xl italic">
            "{hookLine}"
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link href={`/pathways/${letter.toLowerCase()}`}>
              <Button variant="outline" className="bg-white/10 border-white/30 text-white" data-testid="link-view-full-pathway">
                View Full Pathway Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handlePrint} data-testid="button-print-results">
          <Printer className="w-4 h-4 mr-2" />
          Print Results
        </Button>
        <Button variant="outline" onClick={handleExportJSON} data-testid="button-export-results">
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">STOP-BANG</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-stopbang-score">{data?.stopBangScore ?? "—"}/8</p>
            <Badge className={`mt-1 ${osaRisk.className}`}>{osaRisk.text}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Insomnia (ISI)</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-isi-score">{data?.isiScore ?? "—"}/28</p>
            <Badge className={`mt-1 ${insomniaSev.className}`}>{insomniaSev.text}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">BMI</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-bmi-value">
              {data?.bmiValue ? data.bmiValue.toFixed(1) : "—"}
            </p>
            {data?.bmiValue && (
              <Badge className={`mt-1 ${data.bmiValue >= 30 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"}`}>
                {data.bmiValue >= 30 ? "Elevated" : "Normal Range"}
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Zone Highlights</span>
            </div>
            <div className="space-y-1 text-sm">
              {data?.zoneScores && Object.entries(data.zoneScores as Record<string, number>).map(([zone, score]) => (
                <div key={zone} className="flex items-center justify-between">
                  <span className="capitalize text-muted-foreground">{zone}</span>
                  <span className={`font-medium ${(score as number) >= 2 ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
                    {score as number}/3
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <PathwayResultsSummary pathwayDef={pathwayDef} />

      {false ? (
        <Card className="border-primary/20 bg-primary/5" data-testid="card-resources-demo-gate">
          <CardContent className="py-8">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Pathway Resources — Portal Members Only
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Curated videos, articles, recommended products, and specialist guides for your pathway are available after completing the full Murphy Method™ assessment. Log in or take the assessment to unlock your personalized resources.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="/api/login">
                    <Button size="sm" data-testid="button-login-resources">
                      <LogIn className="w-4 h-4 mr-2" />
                      Log In
                    </Button>
                  </a>
                  <Link href="/assessment/info">
                    <Button variant="outline" size="sm" data-testid="button-assessment-resources">
                      Take Full Assessment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Your Pathway Resources
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Curated content for your pathway — updated in real time as new resources are added.
          </p>
          <PathwayResources pathwayId={pathwayId} />
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Assessment Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Completed</span>
              <p className="font-medium">{completedDate}</p>
            </div>
            {retakeDate && (
              <div>
                <span className="text-muted-foreground">Suggested Retake</span>
                <p className="font-medium">{retakeDate}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Total Assessments</span>
              <p className="font-medium">{allAssessments.length}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/assessment/info">
              <Button variant="outline" size="sm" data-testid="button-retake-assessment">
                Retake Assessment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {allAssessments.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <Button variant="ghost" className="w-full flex items-center justify-between p-0" onClick={() => setShowHistory(!showHistory)} data-testid="button-toggle-history">
              <CardTitle className="text-base">Assessment History ({allAssessments.length})</CardTitle>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardHeader>
          {showHistory && (
            <CardContent>
              <div className="space-y-3">
                {allAssessments.map((a: any, i: number) => {
                  const aData = a.data as any;
                  const aPathway = getPathwayDefinition(a.assignedPathway);
                  const aLetter = PATHWAY_LETTERS[a.assignedPathway] || "?";
                  const aDate = a.completedAt ? new Date(a.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown";
                  return (
                    <div key={a.id} className={`flex items-center gap-4 p-3 rounded-md ${i === 0 ? "bg-primary/5 border border-primary/20" : "bg-muted/30"}`} data-testid={`history-item-${i}`}>
                      <span className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                        {aLetter}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{aPathway.title}</p>
                        <p className="text-xs text-muted-foreground">{aDate} &middot; STOP-BANG: {aData?.stopBangScore ?? "?"}/8 &middot; ISI: {aData?.isiScore ?? "?"}/28</p>
                      </div>
                      {i === 0 && <Badge className="bg-primary/10 text-primary">Latest</Badge>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}

const DEMO_PATHWAY_IDS: string[] = ["A_insomnia", "B_obesity", "C_nasal", "D_mandible", "E_multilevel", "F_physiology", "G_low_risk", "H_complex"];

const DEMO_PRESETS: Record<string, { stopBangScore: number; isiScore: number; bmiValue: number; zones: Record<string, number> }> = {
  A_insomnia:   { stopBangScore: 5, isiScore: 22, bmiValue: 27.3, zones: { nose: 1, palate: 1, mandible: 0, neck: 1 } },
  B_obesity:    { stopBangScore: 6, isiScore: 10, bmiValue: 34.8, zones: { nose: 0, palate: 1, mandible: 1, neck: 2 } },
  C_nasal:      { stopBangScore: 4, isiScore: 9,  bmiValue: 26.1, zones: { nose: 3, palate: 0, mandible: 0, neck: 0 } },
  D_mandible:   { stopBangScore: 5, isiScore: 8,  bmiValue: 25.4, zones: { nose: 0, palate: 1, mandible: 3, neck: 1 } },
  E_multilevel: { stopBangScore: 6, isiScore: 12, bmiValue: 28.9, zones: { nose: 2, palate: 2, mandible: 2, neck: 2 } },
  F_physiology: { stopBangScore: 4, isiScore: 14, bmiValue: 24.5, zones: { nose: 0, palate: 0, mandible: 0, neck: 0 } },
  G_low_risk:   { stopBangScore: 2, isiScore: 5,  bmiValue: 23.1, zones: { nose: 0, palate: 0, mandible: 0, neck: 0 } },
  H_complex:    { stopBangScore: 7, isiScore: 20, bmiValue: 32.6, zones: { nose: 2, palate: 2, mandible: 1, neck: 2 } },
};

function getDemoData() {
  const pathwayId = DEMO_PATHWAY_IDS[Math.floor(Math.random() * DEMO_PATHWAY_IDS.length)];
  const preset = DEMO_PRESETS[pathwayId];

  const demoUser = {
    id: "demo",
    email: "jane.doe@email.com",
    firstName: "Jane",
    lastName: "Doe",
    profileImageUrl: null,
  };

  const demoProfile = {
    firstName: "Jane",
    lastName: "Doe",
    dateOfBirth: "1978-06-15",
    gender: "female",
  };

  const demoAssessment = {
    id: "demo-1",
    assignedPathway: pathwayId,
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      stopBangScore: preset.stopBangScore,
      osaRisk: preset.stopBangScore >= 5 ? "high" : preset.stopBangScore >= 3 ? "intermediate" : "low",
      isiScore: preset.isiScore,
      insomniaSeverity: preset.isiScore >= 22 ? "severe" : preset.isiScore >= 15 ? "moderate" : preset.isiScore >= 8 ? "subthreshold" : "none_mild",
      bmiValue: preset.bmiValue,
      zoneScores: preset.zones,
    },
  };

  return { demoUser, demoProfile, demoAssessment };
}

function NoAssessmentState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <ClipboardCheck className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        No Screening Results Yet
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Take the free Murphy Method™ screening to discover your sleep breathing risk profile. It only takes 3 minutes.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/screening">
          <Button size="lg" data-testid="button-start-screening-empty">
            Start Free Screening (3 min)
          </Button>
        </Link>
        <Link href="/assessment/info">
          <Button variant="outline" size="lg" data-testid="button-full-assessment-empty">
            Full Assessment (15-20 min)
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function MyPathwayPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  const { data: assessmentData, isLoading: assessmentLoading } = useQuery({
    queryKey: ["/api/assessments/me"],
    enabled: isAuthenticated,
  });

  const { data: allAssessments } = useQuery<any[]>({
    queryKey: ["/api/assessments/history"],
    enabled: isAuthenticated,
  });

  const profileMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", "/api/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });

  const [screeningData, setScreeningData] = useState<{ profile: ScreeningProfile; date: string | null } | null>(null);

  useEffect(() => {
    setScreeningData(getScreeningFromLocalStorage());
  }, []);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-48" />
              <div className="h-32 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">My Portal</h1>
            <p className="text-muted-foreground mb-8">
              Sign in to access your Murphy Method™ assessment results, pathway resources, and visit prep materials.
            </p>
            <a href="/api/login" data-testid="button-portal-login">
              <Button size="lg" className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to My Portal
              </Button>
            </a>
            <p className="text-xs text-muted-foreground mt-6">
              Portal access is provided to customers who have completed the full Murphy Method™ assessment.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const activeUser = user;
  const activeProfile = profile;
  const activeAssessment = assessmentData && (assessmentData as any).hasResult ? (assessmentData as any).result : null;
  const activeAllAssessments = allAssessments || (activeAssessment ? [activeAssessment] : []);
  const isLoading = profileLoading || assessmentLoading;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-my-pathway-heading">
                My Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back{(activeProfile as any)?.firstName ? `, ${(activeProfile as any).firstName}` : ""}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          ) : (
            <div className="space-y-6">
              <ProfileSection
                user={activeUser}
                profile={activeProfile}
                onSave={(data) => profileMutation.mutate(data)}
                isSaving={profileMutation.isPending}
              />

              {activeAssessment ? (
                <AssessmentDashboard
                  assessment={activeAssessment}
                  allAssessments={activeAllAssessments}
                />
              ) : screeningData ? (
                <ScreeningDashboard screeningData={screeningData} />
              ) : (
                <NoAssessmentState />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
