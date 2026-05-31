import { useState } from "react";
import { Link, useSearch } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Heart, Activity, Moon, ArrowDown, Check, CheckCircle2, ExternalLink, Target, Send, Star, Smartphone } from "lucide-react";
import snoringHeroImg from "@/assets/images/hero-snoring-couple.png";
import drMurphyPhoto from "@assets/Murphy-14_1765142967232.jpg";
import { HOME, DR_MURPHY } from "@/content";

const { faqs, testimonials, stats, problem, pathways, steps, pricing, hero, philosophicalStatement, transformation } = HOME;

function AirwayDiagram() {
  const zones = [
    { label: "Nose", color: "#2563EB" },
    { label: "Palate & Tonsils", color: "#2563EB" },
    { label: "Tongue Base", color: "#2563EB" },
    { label: "Lower Throat", color: "#2563EB" },
  ];

  return (
    <div className="flex flex-col items-center gap-0">
      {zones.map((zone, i) => (
        <div key={zone.label} className="flex flex-col items-center w-full max-w-xs">
          <div
            className="w-full py-4 px-6 text-center font-semibold text-white rounded-lg"
            style={{ backgroundColor: zone.color, opacity: 0.7 + i * 0.075 }}
          >
            {zone.label}
          </div>
          {i < zones.length - 1 && (
            <div className="py-2">
              <ArrowDown className="w-5 h-5" style={{ color: "#2563EB" }} />
            </div>
          )}
        </div>
      ))}
      <p className="text-center text-sm mt-4" style={{ color: "#6B7280" }}>
        The Murphy Method™ evaluates all 4 airway zones — not just one.
      </p>
    </div>
  );
}

function ReportMockup() {
  return (
    <div className="relative mx-auto" style={{ maxWidth: "540px" }}>
      <div className="flex gap-3 shadow-2xl">

        {/* ── Cover page ── */}
        <div className="flex-1 rounded-lg overflow-hidden bg-white border border-gray-200" style={{ minHeight: "360px" }}>
          <div className="p-5 flex flex-col items-center text-center h-full">
            {/* Title */}
            <p className="font-extrabold leading-tight mb-4" style={{ color: "#0F172A", fontSize: "11px" }}>
              Murphy Method™<br />Assessment Report
            </p>
            {/* Pathway box */}
            <div className="w-full rounded-lg px-3 py-3 mb-4" style={{ backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE" }}>
              <p className="text-[7px] font-bold uppercase tracking-widest mb-1" style={{ color: "#4F46E5" }}>
                Your Assigned Pathway
              </p>
              <div className="h-3 rounded mx-auto mb-1" style={{ backgroundColor: "#C7D2FE", width: "85%", filter: "blur(2px)" }} />
              <div className="h-2 rounded mx-auto" style={{ backgroundColor: "#C7D2FE", width: "65%", filter: "blur(2px)" }} />
            </div>
            {/* Patient info */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-1.5 justify-center">
                <span className="text-[8px]" style={{ color: "#64748B" }}>Prepared for:</span>
                <div className="h-2 w-16 rounded" style={{ backgroundColor: "#E2E8F0", filter: "blur(2px)" }} />
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                <span className="text-[8px]" style={{ color: "#64748B" }}>Assessment Date:</span>
                <div className="h-2 w-12 rounded" style={{ backgroundColor: "#E2E8F0", filter: "blur(2px)" }} />
              </div>
            </div>
            {/* Website */}
            <p className="text-[8px] font-semibold mt-auto" style={{ color: "#2563EB" }}>sleepcheckup.com</p>
          </div>
        </div>

        {/* ── Interior page ── */}
        <div className="flex-1 rounded-lg overflow-hidden bg-white border border-gray-200" style={{ minHeight: "360px" }}>
          {/* Page header bar */}
          <div className="px-3 py-1.5 flex justify-between items-center" style={{ backgroundColor: "#0F172A" }}>
            <p className="text-[7px] font-bold uppercase tracking-wider text-white">Your Results</p>
            <p className="text-[7px]" style={{ color: "#94A3B8" }}>sleepcheckup.com</p>
          </div>
          <div className="p-3 space-y-3">

            {/* Section 1: Your Results — blue box matching actual report */}
            <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <p className="font-bold uppercase tracking-wide" style={{ color: "#0F172A", fontSize: "8px" }}>Your Results</p>
              <p style={{ color: "#2563EB", fontSize: "7px" }}>Based on your Murphy Method™ assessment answers</p>
              <div className="mt-2 space-y-1.5">
                {/* Medical History */}
                <div className="rounded p-1.5" style={{ backgroundColor: "#fff", border: "1px solid #BFDBFE" }}>
                  <p className="font-semibold uppercase" style={{ color: "#2563EB", fontSize: "6px" }}>Medical History</p>
                  <div className="h-2 rounded mt-1" style={{ backgroundColor: "#BFDBFE", width: "70%", filter: "blur(1.5px)" }} />
                </div>
                {/* BMI · STOP-BANG · ISI row */}
                <div className="grid grid-cols-3 gap-1">
                  {["Body Mass Index", "STOP-BANG", "Insomnia Index"].map((label) => (
                    <div key={label} className="rounded p-1 text-center" style={{ backgroundColor: "#fff", border: "1px solid #BFDBFE" }}>
                      <div className="w-4 h-4 rounded-full mx-auto mb-0.5" style={{ backgroundColor: "#BFDBFE", filter: "blur(1.5px)" }} />
                      <p style={{ color: "#2563EB", fontSize: "5.5px" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Your Murphy Method Assigned Pathway */}
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wide mb-1.5" style={{ color: "#0F172A" }}>Your Murphy Method Assigned Pathway</p>
              <div className="rounded p-2" style={{ backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE", filter: "blur(2px)" }}>
                <div className="h-2.5 rounded mb-1.5" style={{ backgroundColor: "#A5B4FC", width: "90%" }} />
                <div className="h-2 rounded mb-1" style={{ backgroundColor: "#C7D2FE", width: "75%" }} />
                <div className="h-2 rounded" style={{ backgroundColor: "#C7D2FE", width: "60%" }} />
              </div>
            </div>

            {/* Section 3: Your Personalized Guide */}
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wide mb-1.5" style={{ color: "#0F172A" }}>Your Personalized Guide</p>
              <div className="rounded p-2" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", filter: "blur(2px)" }}>
                <div className="h-2 rounded mb-1" style={{ backgroundColor: "#86EFAC", width: "95%" }} />
                <div className="h-2 rounded mb-1" style={{ backgroundColor: "#BBF7D0", width: "80%" }} />
                <div className="h-2 rounded" style={{ backgroundColor: "#BBF7D0", width: "65%" }} />
              </div>
            </div>

          </div>
          {/* Page footer */}
          <div className="px-3 py-1 flex justify-between" style={{ borderTop: "1px solid #F1F5F9" }}>
            <p className="text-[6px]" style={{ color: "#94A3B8" }}>sleepcheckup.com</p>
            <p className="text-[6px]" style={{ color: "#94A3B8" }}>Page 2</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function HomePage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const src = params.get("src");

  const queryClientInstance = useQueryClient();
  const { data: dbTestimonials } = useQuery<Array<{ id: string; name: string; role: string | null; content: string; rating: number }>>({
    queryKey: ["/api/testimonials"],
    staleTime: 1000 * 60 * 5,
  });

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialEmail, setTestimonialEmail] = useState("");
  const [testimonialContent, setTestimonialContent] = useState("");
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialHoverRating, setTestimonialHoverRating] = useState(0);
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);

  const submitTestimonial = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: testimonialName.trim(),
          email: testimonialEmail.trim() || undefined,
          content: testimonialContent.trim(),
          rating: testimonialRating,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      setTestimonialSubmitted(true);
      queryClientInstance.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
  });

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialName.trim() || !testimonialContent.trim() || !testimonialEmail.trim()) return;
    submitTestimonial.mutate();
  };

  const handleTestimonialClose = () => {
    setShowTestimonialModal(false);
    setTestimonialName("");
    setTestimonialEmail("");
    setTestimonialContent("");
    setTestimonialRating(5);
    setTestimonialHoverRating(0);
    setTestimonialSubmitted(false);
  };

  let headline = hero.headline;
  let subheadline = hero.subheadline;

  if (src === "watch") {
    headline = hero.variants.watch.headline;
    subheadline = hero.variants.watch.subheadline;
  } else if (src === "snoring") {
    headline = hero.variants.snoring.headline;
    subheadline = hero.variants.snoring.subheadline;
  }

  return (
    <Layout>
      {/* ── SECTION 1: HERO ── */}
      <section
        className="relative flex items-center justify-center"
        style={{ minHeight: "92vh" }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={snoringHeroImg}
            alt="Person struggling with sleep"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.38)" }} />
        </div>
        <div className="relative z-10 text-center px-4" style={{ maxWidth: "780px" }}>
          <h1
            className="text-white font-bold"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.15,
              maxWidth: "780px",
            }}
            data-testid="text-hero-headline"
          >
            {headline}
          </h1>

          <p
            className="text-white mt-5 mx-auto"
            style={{ opacity: 1, fontSize: "24px", lineHeight: 1.5, maxWidth: "660px", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.45)" }}
          >
            {hero.subtitle}
          </p>

          <p
            className="text-white mt-3 mx-auto"
            style={{ opacity: 1, fontSize: "17px", fontWeight: 500, letterSpacing: "0.01em", maxWidth: "580px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            {subheadline}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/screener">
              <button
                className="text-white font-semibold cursor-pointer border-0 transition-all"
                style={{
                  backgroundColor: "#2563EB",
                  fontSize: "16px",
                  padding: "14px 32px",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1D4ED8";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2563EB";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
                data-testid="button-start-screening-hero"
              >
                {hero.ctaButton}
              </button>
            </Link>
            <Link href="/assessment/info">
              <button
                className="font-semibold cursor-pointer transition-all"
                style={{
                  backgroundColor: "#2563EB",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "15px",
                  padding: "13px 26px",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1D4ED8";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2563EB";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
                data-testid="button-view-full-report-hero"
              >
                Full Assessment — $1
              </button>
            </Link>
          </div>

          <p className="mt-4 text-[13px] text-white" style={{ opacity: 0.7 }}>
            {hero.trustLine}
          </p>
        </div>
      </section>

      {/* ── SECTION 2: DOCTOR CREDENTIAL STRIP ── */}
      <section className="bg-white border-t border-b" style={{ borderColor: "#E5E7EB", padding: "18px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 text-center md:text-left">
            {/* Name + title */}
            <div className="flex items-center gap-3 md:pr-6 md:border-r" style={{ borderColor: "#E5E7EB" }}>
              <img src={drMurphyPhoto} alt="Michael Murphy, MD" className="rounded-full object-cover flex-shrink-0" style={{ width: "36px", height: "36px" }} />
              <div>
                <p className="font-semibold text-[14px]" style={{ color: "#0F172A" }}>Michael Murphy, MD, MPH</p>
                <p className="text-[12px]" style={{ color: "#6B7280" }}>Stanford Medicine</p>
              </div>
            </div>
            {/* Credentials */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0">
              {[
                { stat: "4.9/5", label: "Patient Rating (303 Reviews)" },
                { stat: "20+", label: "Years Treating Snoring and Sleep Apnea Patients" },
                { stat: "2×", label: "Board-Certified Specialties" },
              ].map(({ stat, label }) => (
                <div key={stat} className="flex items-center gap-2 md:px-6 md:border-r last:border-r-0" style={{ borderColor: "#E5E7EB" }}>
                  <span className="font-bold text-[18px]" style={{ color: "#0F172A" }}>{stat}</span>
                  <span className="text-[12px]" style={{ color: "#6B7280" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2B: WHY WE'RE DIFFERENT ── */}
      <section className="bg-white" style={{ padding: "72px 0" }}>
        <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: "880px" }}>
          <div className="text-center mb-10">
            <h2 className="font-bold mb-3" style={{ color: "#0F172A", fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.2 }}>
              Different From Every Sleep Tool Online
            </h2>
            <p className="font-semibold mb-3 mx-auto" style={{ color: "#2563EB", fontSize: "17px", maxWidth: "560px", lineHeight: 1.5 }}>
              {philosophicalStatement}
            </p>
            <p style={{ color: "#4B5563", fontSize: "16px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              Every other sleep quiz gives you a number and tells you to see a doctor. Here is what the Murphy Method™ gives you instead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column: Standard Quiz */}
            <div className="rounded-lg p-6" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E5E7EB" }}>
                  <span className="font-bold text-sm" style={{ color: "#6B7280" }}>✗</span>
                </div>
                <p className="font-bold text-[15px]" style={{ color: "#6B7280" }}>Standard Sleep Quiz (STOP-BANG, Ubie, etc.)</p>
              </div>
              <ul className="space-y-3">
                {[
                  ["Output", "A risk score from 0 to 8"],
                  ["Next step", '"See a doctor"'],
                  ["Depth", "4–8 generic questions"],
                  ["Anatomy", "Not assessed"],
                  ["Physiology", "Not assessed"],
                  ["Specialist match", "None — you figure it out"],
                  ["What it explains", "Nothing about why or how"],
                ].map(([label, value]) => (
                  <li key={label} className="flex gap-3">
                    <span className="text-[13px] font-semibold w-28 flex-shrink-0 mt-0.5" style={{ color: "#9CA3AF" }}>{label}</span>
                    <span className="text-[14px]" style={{ color: "#6B7280" }}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column: SleepCheckup */}
            <div className="rounded-lg p-6" style={{ backgroundColor: "#EFF6FF", border: "2px solid #2563EB" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2563EB" }}>
                  <span className="font-bold text-sm text-white">✓</span>
                </div>
                <p className="font-bold text-[15px]" style={{ color: "#0F172A" }}>SleepCheckup — Murphy Method™</p>
              </div>
              <ul className="space-y-3">
                {[
                  ["Output", "Named clinical pathway — your mechanism, not just a score"],
                  ["Next step", "Which specialist to see, what to ask, and why"],
                  ["Depth", "64 validated clinical questions"],
                  ["Anatomy", "4-zone airway map (Nose → Palate → Jaw → Neck)"],
                  ["Physiology", "PALM phenotyping — the first patient-facing tool of its kind"],
                  ["Specialist match", "Filtered to the right type for your pathway"],
                  ["What it explains", "The mechanism, the anatomy, and what works for both"],
                ].map(([label, value]) => (
                  <li key={label} className="flex gap-3">
                    <span className="text-[13px] font-semibold w-28 flex-shrink-0 mt-0.5" style={{ color: "#2563EB" }}>{label}</span>
                    <span className="text-[14px]" style={{ color: "#1E3A5F" }}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: MURPHY METHOD 3-STEP GRAPHIC ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "72px 0" }}>
        <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: "1050px" }}>
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="font-bold mb-3" style={{ color: "#0F172A", fontSize: "clamp(26px, 3.5vw, 36px)", lineHeight: 1.2 }}>
              The Murphy Method™
            </h2>
            <p style={{ color: "#4B5563", fontSize: "17px", lineHeight: 1.6, maxWidth: "680px", margin: "0 auto" }}>
              A simple way to understand snoring, sleep apnea, where the airway may be narrowing, and what kinds of treatment may help.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* STEP 1 */}
            <div className="bg-white rounded-lg p-6 md:p-8" style={{ border: "1px solid #BFDBFE" }}>
              <h3 className="font-bold mb-1" style={{ color: "#2563EB", fontSize: "20px" }}>
                Step 1 — How is the breathing at night?
              </h3>
              <p className="mb-6" style={{ color: "#4B5563", fontSize: "15px" }}>
                Breathing can move from normal, to snoring, to sleep apnea.
              </p>

              {/* Spectrum pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <span className="px-4 py-2 rounded-full font-bold text-[15px]" style={{ background: "#e8f5e9", color: "#2e7d32" }}>Normal</span>
                <span className="font-bold text-[20px]" style={{ color: "#2563EB" }}>→</span>
                <span className="px-4 py-2 rounded-full font-bold text-[15px]" style={{ background: "#fff8e1", color: "#b7791f" }}>Snoring</span>
                <span className="font-bold text-[20px]" style={{ color: "#2563EB" }}>→</span>
                <span className="px-4 py-2 rounded-full font-bold text-[15px]" style={{ background: "#ffebee", color: "#c62828" }}>Sleep Apnea</span>
              </div>

              {/* Three columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg p-4" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                  <p className="font-bold mb-2" style={{ color: "#2e7d32" }}>Normal</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>Air moves easily</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>Quiet breathing</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>Healthy sleep</p>
                </div>
                <div className="rounded-lg p-4" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                  <p className="font-bold mb-2" style={{ color: "#b7791f" }}>Snoring</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>Air becomes noisy</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>Airflow gets rough</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>Snoring may happen</p>
                </div>
                <div className="rounded-lg p-4" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                  <p className="font-bold mb-2" style={{ color: "#c62828" }}>Sleep Apnea</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>Airflow gets blocked</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>Breathing can pause</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>This is more serious</p>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="bg-white rounded-lg p-6 md:p-8" style={{ border: "1px solid #BBF7D0" }}>
              <h3 className="font-bold mb-1" style={{ color: "#16a34a", fontSize: "20px" }}>
                Step 2 — Where can the airway narrow?
              </h3>
              <p className="mb-6" style={{ color: "#4B5563", fontSize: "15px" }}>
                The Murphy Method looks from top to bottom through the airway.
              </p>
              <div className="flex flex-col items-center gap-0" style={{ maxWidth: "440px", margin: "0 auto" }}>
                {[
                  { label: "Nose", color: "#6aa84f" },
                  { label: "Palate & Tonsils", color: "#c62828" },
                  { label: "Mandible & Tongue", color: "#2563EB" },
                  { label: "Neck", color: "#b7791f" },
                ].map((item, i) => (
                  <div key={item.label} className="w-full flex flex-col items-center">
                    <div
                      className="w-full py-3 px-6 rounded-lg text-center font-bold text-[15px]"
                      style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: item.color }}
                    >
                      {item.label}
                    </div>
                    {i < 3 && (
                      <div className="py-1.5">
                        <ArrowDown className="w-5 h-5" style={{ color: "#16a34a" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 3 */}
            <div className="bg-white rounded-lg p-6 md:p-8" style={{ border: "1px solid #FECACA" }}>
              <h3 className="font-bold mb-1" style={{ color: "#dc2626", fontSize: "20px" }}>
                Step 3 — What can help?
              </h3>
              <p className="mb-6" style={{ color: "#4B5563", fontSize: "15px" }}>
                Treatment depends on where the blockage is and how serious the problem is.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg p-5" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                  <p className="font-bold mb-3" style={{ color: "#2563EB", fontSize: "16px" }}>Non-Surgery Options</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8 }}>• CPAP</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8 }}>• Oral appliance</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8 }}>• Other treatments</p>
                </div>
                <div className="rounded-lg p-5" style={{ background: "#FFF1F2", border: "1px solid #FECDD3" }}>
                  <p className="font-bold mb-3" style={{ color: "#c62828", fontSize: "16px" }}>Procedure Options</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8 }}>• Nose procedures</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8 }}>• Palate / tonsil procedures</p>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.8 }}>• Jaw / tongue procedures</p>
                </div>
              </div>
              <div className="rounded-lg p-4 text-center" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <p style={{ color: "#374151", fontSize: "15px", lineHeight: 1.6 }}>
                  <strong style={{ color: "#0F172A" }}>Simple idea:</strong> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3B: WHO THIS IS FOR ── */}
      <section className="bg-white" style={{ padding: "72px 0" }}>
        <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: "960px" }}>
          <div className="text-center mb-4">
            <div
              className="inline-block text-white text-[13px] font-semibold px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: "#DC2626" }}
            >
              80% of people with sleep apnea are undiagnosed
            </div>
            <h2 className="font-bold mb-3" style={{ color: "#0F172A", fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.2 }}>
              Who This Assessment Is For
            </h2>
            <p style={{ color: "#4B5563", fontSize: "16px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
              Sleep apnea does not always look the way you imagine. Most people who have it do not know they have it.
            </p>
            <p className="mt-4 mx-auto" style={{ color: "#6B7280", fontSize: "15px", maxWidth: "580px", lineHeight: 1.7 }}>
              {problem.internalProblem}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {/* Card 1 */}
            <div className="rounded-lg p-6" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#EFF6FF" }}
              >
                <Moon className="w-5 h-5" style={{ color: "#2563EB" }} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: "#0F172A", fontSize: "17px" }}>
                "I just snore — it's probably nothing."
              </h3>
              <p className="mb-4" style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.7 }}>
                Snoring is the single most common symptom of sleep apnea. Many people who think they "just snore" have had undiagnosed OSA for years. The screener takes 3 minutes to tell you if it's worth looking into.
              </p>
              <p className="font-semibold text-[13px]" style={{ color: "#2563EB" }}>
                This is for you too.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg p-6" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#FFF7ED" }}
              >
                <Activity className="w-5 h-5" style={{ color: "#EA580C" }} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: "#0F172A", fontSize: "17px" }}>
                "I'm always tired no matter how much I sleep."
              </h3>
              <p className="mb-4" style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.7 }}>
                Unexplained fatigue, morning headaches, difficulty concentrating, and irritability are all classic signs — even without obvious snoring. Not every sleep apnea patient snores loudly or stops breathing noticeably.
              </p>
              <p className="font-semibold text-[13px]" style={{ color: "#EA580C" }}>
                This is for you too.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg p-6" style={{ border: "2px solid #2563EB", backgroundColor: "#EFF6FF" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#2563EB" }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-2" style={{ color: "#0F172A", fontSize: "17px" }}>
                "Someone told me I stop breathing at night."
              </h3>
              <p className="mb-4" style={{ color: "#1E3A5F", fontSize: "14px", lineHeight: 1.7 }}>
                You already know something is wrong. The question is: what kind, how serious, and what type of doctor can actually help you? The Murphy Method™ answers all three — so your first appointment isn't wasted.
              </p>
              <p className="font-semibold text-[13px]" style={{ color: "#2563EB" }}>
                This was built for you.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-lg p-6" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#F5F3FF" }}
              >
                <Smartphone className="w-5 h-5" style={{ color: "#7C3AED" }} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: "#0F172A", fontSize: "17px" }}>
                "My watch or wearable device has alerted me to possible sleep apnea."
              </h3>
              <p className="mb-4" style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.7 }}>
                Apple Watch and Samsung Galaxy can now detect irregular breathing events during sleep. But a notification is not a diagnosis — and it does not tell you what type, how serious, or which doctor to see. The Murphy Method™ turns that alert into a clear next step.
              </p>
              <p className="font-semibold text-[13px]" style={{ color: "#7C3AED" }}>
                Your watch flagged it. Here's what to do next.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/screener">
              <button
                className="text-white font-semibold cursor-pointer border-0 transition-all"
                style={{ backgroundColor: "#2563EB", fontSize: "15px", padding: "13px 32px", borderRadius: "8px" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1D4ED8";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2563EB";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
                data-testid="button-who-its-for-cta"
              >
                Find Out Where You Stand — Free
              </button>
            </Link>
            <p className="mt-3 text-[13px]" style={{ color: "#9CA3AF" }}>
              3 minutes. No account. No obligation.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: MURPHY METHOD APPROACH / YOUR SITUATION IS UNIQUE ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mx-auto mb-10" style={{ maxWidth: "720px" }}>
            <h2 className="font-bold mb-4" style={{ color: "#0F172A", fontSize: "36px", lineHeight: 1.15 }}>
              {pathways.headline}
            </h2>
            <p style={{ color: "#4B5563", fontSize: "17px", lineHeight: 1.7 }}>
              {pathways.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mx-auto mb-8" style={{ maxWidth: "920px" }}>
            {/* Card 1 */}
            <div
              className="bg-white rounded-lg p-7"
              style={{ border: "1px solid #E5E7EB", borderRadius: "10px" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: "40px", height: "40px", backgroundColor: "#EEF2FF", flexShrink: 0 }}
                >
                  <Target className="w-5 h-5" style={{ color: "#4F46E5" }} />
                </div>
                <h3 className="font-semibold" style={{ color: "#0F172A", fontSize: "16px" }}>
                  {pathways.card1.title}
                </h3>
              </div>
              <p className="mb-4" style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.7 }}>
                {pathways.card1.intro}
              </p>
              <ul className="space-y-2.5">
                {pathways.card1.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#4F46E5" }} />
                    <span style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2 */}
            <div
              className="bg-white rounded-lg p-7"
              style={{ border: "1px solid #E5E7EB", borderRadius: "10px" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: "40px", height: "40px", backgroundColor: "#ECFDF5", flexShrink: 0 }}
                >
                  <Target className="w-5 h-5" style={{ color: "#059669" }} />
                </div>
                <h3 className="font-semibold" style={{ color: "#0F172A", fontSize: "16px" }}>
                  {pathways.card2.title}
                </h3>
              </div>
              <p className="mb-4" style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.7 }}>
                {pathways.card2.intro}
              </p>
              <ul className="space-y-2.5">
                {pathways.card2.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#059669" }} />
                    <span style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mx-auto" style={{ maxWidth: "640px" }}>
            <p className="mb-6" style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6 }}>
              {pathways.footerText}
            </p>
            <Link href="/assessment/info">
              <button
                className="text-white font-semibold cursor-pointer border-0 transition-all"
                style={{
                  backgroundColor: "#2563EB",
                  fontSize: "15px",
                  padding: "12px 28px",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1D4ED8";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2563EB";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
                data-testid="button-discover-pathway"
              >
                {pathways.ctaButton}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 4B: HOW IT FITS IN YOUR CARE JOURNEY ── */}
      <section style={{ backgroundColor: "#0F172A", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: "960px" }}>
          <div className="text-center mb-12">
            <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.2 }}>
              How It Fits In Your Care Journey
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "16px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
              Most patients wait months for an appointment and arrive with nothing. You arrive with a clinical roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                num: "1",
                title: "Take the Free Screener",
                body: "3 minutes. No account. Instant risk summary and first look at which airway zones may be involved.",
                color: "#2563EB",
              },
              {
                num: "2",
                title: "Get Your Pathway Report",
                body: "$1 one-time. The full Murphy Method™ assessment — anatomy, physiology, pathway assignment, treatment roadmap.",
                color: "#2563EB",
              },
              {
                num: "3",
                title: "Book the Right Specialist",
                body: "The report tells you exactly which type of specialist fits your pathway — not just any sleep doctor.",
                color: "#2563EB",
              },
              {
                num: "4",
                title: "Arrive Prepared",
                body: "Show up with scores, findings, and specific questions. Your doctor sees you as the best-prepared patient they've had.",
                color: "#16A34A",
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[16px] mb-4 flex-shrink-0"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-white mb-2" style={{ fontSize: "15px" }}>{step.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.6 }}>{step.body}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-lg p-5 mt-10 text-center mx-auto"
            style={{ backgroundColor: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)", maxWidth: "680px" }}
          >
            <p className="italic" style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", lineHeight: 1.6 }}>
              {DR_MURPHY.reportQuote}
            </p>
            <p className="mt-2 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>— Michael Murphy, MD, MPH — Stanford Medicine</p>
          </div>

        </div>
      </section>

      {/* ── SECTION 5: HOW IT WORKS ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-center font-bold mb-12" style={{ color: "#0F172A", fontSize: "36px" }}>
            {steps.headline}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-16" style={{ maxWidth: "960px", margin: "0 auto 64px auto" }}>
            {steps.items.map(({ num, title, sub, body }, idx) => {
              const numBg = idx === 1 ? "#2563EB" : "#0F172A";
              return (
              <div
                key={num}
                className="bg-white flex flex-col items-center text-center"
                style={{
                  borderRadius: "12px",
                  padding: "32px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: numBg,
                  }}
                >
                  {num}
                </div>
                <h3 className="font-semibold mt-4 mb-1" style={{ color: "#0F172A", fontSize: "20px" }}>
                  {title}
                </h3>
                <p className="text-[13px] mb-3" style={{ color: "#2563EB" }}>{sub}</p>
                <p className="text-[14px]" style={{ color: "#6B7280", lineHeight: 1.6 }}>{body}</p>
              </div>
              );
            })}
          </div>

          {/* Report preview */}
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <h3 className="text-center font-semibold mb-6" style={{ fontSize: "20px", color: "#0F172A" }}>
              What Your Report Looks Like
            </h3>
            <ReportMockup />
            <p className="text-center italic mt-4" style={{ color: "#6B7280", fontSize: "13px" }}>
              {steps.reportCaption}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: PRICING ── */}
      <section className="bg-white" style={{ padding: "80px 0" }} data-testid="section-pricing">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-center font-bold mb-3" style={{ color: "#0F172A", fontSize: "36px" }}>
            {pricing.headline}
          </h2>
          <p className="text-center mb-12" style={{ color: "#6B7280", fontSize: "17px" }}>
            {pricing.subheadline}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mx-auto" style={{ maxWidth: "800px" }}>
            {/* Free card */}
            <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "36px", backgroundColor: "white" }}>
              <p className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280" }}>
                {pricing.free.label}
              </p>
              <p className="font-bold" style={{ color: "#0F172A", fontSize: "48px", lineHeight: 1 }}>{pricing.free.price}</p>
              <p className="text-[14px] mt-1 mb-5" style={{ color: "#6B7280" }}>{pricing.free.duration}</p>
              <hr style={{ borderColor: "#E5E7EB", marginBottom: "20px" }} />
              <ul className="space-y-3 mb-8">
                {pricing.free.features.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px]" style={{ color: "#374151" }}>
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#6B7280" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/screener">
                <button
                  className="w-full py-3 font-semibold text-[15px] cursor-pointer transition-colors"
                  style={{
                    border: "1px solid #0F172A",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    color: "#0F172A",
                  }}
                  data-testid="button-free-pricing"
                >
                  {pricing.free.ctaButton}
                </button>
              </Link>
            </div>

            {/* Paid card */}
            <div className="relative" style={{ border: "2px solid #2563EB", borderRadius: "12px", padding: "36px", backgroundColor: "#F0F7FF" }}>
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span
                  className="text-white text-[11px] font-semibold px-4 py-1.5 rounded-full"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  {pricing.paid.badge}
                </span>
              </div>
              <p className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: "#2563EB" }}>
                {pricing.paid.label}
              </p>
              <p className="font-bold" style={{ color: "#0F172A", fontSize: "48px", lineHeight: 1 }}>{pricing.paid.price}</p>
              <p className="text-[14px] mt-1 mb-3" style={{ color: "#6B7280" }}>{pricing.paid.duration}</p>
              <div className="rounded-md px-3 py-2 mb-3" style={{ backgroundColor: "#DBEAFE", border: "1px solid #BFDBFE" }}>
                <p className="text-[12px]" style={{ color: "#1D4ED8", lineHeight: 1.5 }}>
                  A specialist consultation averages <strong>$250–$500</strong> and still won't give you this level of pre-appointment clarity. One-time payment. No subscription. Emailed instantly.
                </p>
              </div>
              <hr style={{ borderColor: "#BFDBFE", marginBottom: "20px" }} />
              <ul className="space-y-3 mb-8">
                {pricing.paid.features.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px]" style={{ color: "#374151" }}>
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#2563EB" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/assessment/info">
                <button
                  className="w-full py-3 font-semibold text-[15px] text-white cursor-pointer transition-colors"
                  style={{ backgroundColor: "#2563EB", borderRadius: "8px", border: "none" }}
                  data-testid="button-paid-pricing"
                >
                  {pricing.paid.ctaButton}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6B: TRANSFORMATION / SUCCESS SCENE ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: "960px" }}>
          <div className="text-center mb-10">
            <h2 className="font-bold mb-4" style={{ color: "#0F172A", fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.2 }}>
              {transformation.headline}
            </h2>
            <p style={{ color: "#4B5563", fontSize: "16px", maxWidth: "620px", margin: "0 auto", lineHeight: 1.7 }}>
              {transformation.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {transformation.outcomes.map((outcome, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6"
                style={{ border: "1px solid #E5E7EB" }}
                data-testid={`transformation-outcome-${i}`}
              >
                <p className="text-[12px] font-semibold uppercase tracking-wide mb-3" style={{ color: "#9CA3AF" }}>
                  {outcome.before}
                </p>
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                    style={{ width: "22px", height: "22px", backgroundColor: "#DCFCE7", minWidth: "22px" }}
                  >
                    <Check className="w-3 h-3" style={{ color: "#16A34A" }} />
                  </div>
                  <p className="font-medium" style={{ color: "#0F172A", fontSize: "15px", lineHeight: 1.6 }}>
                    {outcome.after}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 7: DR. MURPHY ── */}
      <section style={{ backgroundColor: "#0F172A", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div
            className="flex flex-col md:flex-row gap-10 items-start mx-auto"
            style={{ maxWidth: "960px" }}
          >
            {/* Photo */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div
                className="overflow-hidden"
                style={{
                  width: "240px",
                  height: "240px",
                  borderRadius: "50%",
                  border: "3px solid #2563EB",
                  flexShrink: 0,
                }}
              >
                <img
                  src={drMurphyPhoto}
                  alt="Dr. Michael Murphy"
                  className="w-full h-full object-cover"
                  data-testid="img-dr-murphy-home"
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p
                className="text-[12px] font-semibold uppercase tracking-[0.12em] mb-2"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Created By
              </p>
              <h2 className="font-bold text-white mb-1" style={{ fontSize: "32px" }}>
                {DR_MURPHY.name}
              </h2>
              <p className="mb-5 text-[15px]" style={{ color: "#60A5FA" }}>
                {DR_MURPHY.tagline}
              </p>
              <p className="mb-6 text-[16px]" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                {DR_MURPHY.shortBio}
              </p>

              <blockquote
                className="mb-6"
                style={{ borderLeft: "3px solid #2563EB", paddingLeft: "20px" }}
              >
                <p className="text-white italic text-[18px]" style={{ lineHeight: 1.6 }}>
                  "{DR_MURPHY.quote}"
                </p>
                <p className="mt-2 text-[14px]" style={{ color: "#9CA3AF" }}>{DR_MURPHY.quoteAttribution}</p>
              </blockquote>

              <div className="flex flex-wrap gap-2 mb-5">
                {DR_MURPHY.credentialPills.filter((_, i) => i < 5).map((cred) => (
                  <span
                    key={cred}
                    className="text-white text-[12px] px-3 py-1 rounded-full"
                    style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    {cred}
                  </span>
                ))}
              </div>

              <a
                href={DR_MURPHY.stanfordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[14px] no-underline"
                style={{ color: "#60A5FA" }}
                data-testid="link-stanford-profile-home"
              >
                {DR_MURPHY.stanfordLinkText}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: FAQ ── */}
      <section className="bg-white" style={{ padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto" style={{ maxWidth: "680px" }}>
            <h2 className="text-center font-bold mb-10" style={{ color: "#0F172A", fontSize: "32px" }}>
              Common Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b"
                  style={{ borderColor: "#E5E7EB" }}
                  data-testid={`faq-item-${i}`}
                >
                  <AccordionTrigger
                    className="text-left py-5 hover:no-underline font-medium"
                    style={{ color: "#0F172A", fontSize: "16px" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent
                    className="pb-5"
                    style={{ color: "#4B5563", fontSize: "15px", lineHeight: 1.7 }}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: TESTIMONIALS ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-center font-bold mb-2" style={{ color: "#0F172A", fontSize: "32px" }}>
            What People Are Saying
          </h2>
          <p className="text-center mb-10" style={{ color: "#6B7280", fontSize: "15px" }}>
            Real experiences from people who have used the Murphy Method™
          </p>
          <div className="grid sm:grid-cols-2 gap-5 mx-auto" style={{ maxWidth: "860px" }}>
            {(dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials.map((t, i) => ({
              key: t.id,
              quote: t.content,
              byline: t.name + (t.role ? ` · ${t.role}` : ""),
              stars: t.rating,
              testId: `testimonial-card-db-${i}`,
            })) : testimonials.map((t, i) => ({
              key: String(i),
              quote: t.quote,
              byline: t.date ? `Murphy Method™ User · ${t.date}` : "Murphy Method™ User",
              stars: 5,
              testId: `testimonial-card-${i}`,
            }))).map((t) => (
              <div
                key={t.key}
                className="bg-white"
                style={{ borderRadius: "12px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
                data-testid={t.testId}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} style={{ color: "#F59E0B", fontSize: "16px" }}>★</span>
                  ))}
                </div>
                <blockquote className="italic mb-4" style={{ color: "#374151", fontSize: "15px", lineHeight: 1.6 }}>
                  "{t.quote}"
                </blockquote>
                <p style={{ color: "#6B7280", fontSize: "13px" }}>{t.byline}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => setShowTestimonialModal(true)}
              className="font-semibold cursor-pointer transition-colors"
              style={{
                backgroundColor: "white",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                padding: "10px 24px",
                color: "#374151",
                fontSize: "14px",
              }}
              data-testid="button-share-experience"
            >
              Share Your Experience
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL MODAL ── */}
      <Dialog open={showTestimonialModal} onOpenChange={(open) => { if (!open) handleTestimonialClose(); }}>
        <DialogContent className="max-w-lg" data-testid="modal-share-experience">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Share Your Experience</DialogTitle>
          </DialogHeader>
          {testimonialSubmitted ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <p className="font-semibold text-foreground text-lg">Thank you!</p>
              <p className="text-muted-foreground text-sm">Your testimonial has been submitted and will be reviewed before being published.</p>
              <Button onClick={handleTestimonialClose} className="mt-2" data-testid="button-close-testimonial-success">Done</Button>
            </div>
          ) : (
            <form onSubmit={handleTestimonialSubmit} className="space-y-5 pt-1">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="testimonial-name">Your Name</label>
                <Input
                  id="testimonial-name"
                  placeholder="First name or initials"
                  value={testimonialName}
                  onChange={(e) => setTestimonialName(e.target.value)}
                  required
                  data-testid="input-testimonial-name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="testimonial-email">Email</label>
                <Input
                  id="testimonial-email"
                  type="email"
                  placeholder="your@email.com"
                  value={testimonialEmail}
                  onChange={(e) => setTestimonialEmail(e.target.value)}
                  required
                  data-testid="input-testimonial-email"
                />
                <p className="text-xs text-muted-foreground">Only used to follow up with you if needed. Never published.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="testimonial-content">Your Experience</label>
                <Textarea
                  id="testimonial-content"
                  placeholder="Tell us about your experience with the Murphy Method™..."
                  value={testimonialContent}
                  onChange={(e) => setTestimonialContent(e.target.value)}
                  required
                  rows={4}
                  data-testid="input-testimonial-content"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialRating(star)}
                      onMouseEnter={() => setTestimonialHoverRating(star)}
                      onMouseLeave={() => setTestimonialHoverRating(0)}
                      data-testid={`button-star-${star}`}
                    >
                      <Star
                        className="w-7 h-7"
                        style={{
                          fill: star <= (testimonialHoverRating || testimonialRating) ? "#F59E0B" : "none",
                          color: star <= (testimonialHoverRating || testimonialRating) ? "#F59E0B" : "#D1D5DB",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {submitTestimonial.isError && (
                <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
              )}
              <div className="space-y-2 pt-1">
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={submitTestimonial.isPending || !testimonialName.trim() || !testimonialContent.trim() || !testimonialEmail.trim()}
                  data-testid="button-submit-testimonial"
                >
                  <Send className="w-4 h-4" />
                  {submitTestimonial.isPending ? "Submitting…" : "Submit Testimonial"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">Your testimonial will be reviewed before being published.</p>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </Layout>
  );
}
