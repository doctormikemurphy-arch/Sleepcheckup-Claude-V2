import type { PatientProfile } from "./types";
import { assignMurphyPathway, getPathwayDefinition } from "./pathways";
import { getOsaRiskLabel, getInsomniaSeverityLabel } from "./scoring";

export interface ExportData {
  assessmentDate: string;
  stopBang: {
    score: number;
    riskLevel: string;
  };
  insomnia: {
    score: number;
    severity: string;
  };
  plato: {
    sectionAScore: number;
    sectionBScore: number;
    sectionCScore: number;
    totalScore: number;
    sleepQualityRaw: number;
  };
  airwayZones: {
    nose: number;
    palate: number;
    mandible: number;
    neck: number;
  };
  pathway: {
    id: string;
    title: string;
    description: string;
  };
}

export function generateExportData(profile: PatientProfile): ExportData {
  const pathwayId = assignMurphyPathway(profile);
  const pathway = getPathwayDefinition(pathwayId);

  return {
    assessmentDate: new Date().toISOString(),
    stopBang: {
      score: profile.stopBangScore,
      riskLevel: getOsaRiskLabel(profile.osaRisk),
    },
    insomnia: {
      score: profile.isiScore,
      severity: getInsomniaSeverityLabel(profile.insomniaSeverity),
    },
    plato: {
      sectionAScore: profile.plato.sectionAScore,
      sectionBScore: profile.plato.sectionBScore,
      sectionCScore: profile.plato.sectionCScore,
      totalScore: profile.plato.totalScore,
      sleepQualityRaw: profile.plato.sleepQualityRaw,
    },
    airwayZones: {
      nose: profile.zones.nose,
      palate: profile.zones.palate,
      mandible: profile.zones.mandible,
      neck: profile.zones.neck,
    },
    pathway: {
      id: pathwayId,
      title: pathway.title,
      description: pathway.shortDescription,
    },
  };
}

export function exportToJSON(profile: PatientProfile): void {
  const data = generateExportData(profile);
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `murphy-method-results-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(profile: PatientProfile): void {
  const data = generateExportData(profile);
  
  const rows = [
    ["Murphy Method Sleep Breathing Assessment Results"],
    [""],
    ["Assessment Date", data.assessmentDate],
    [""],
    ["STOP-BANG SCREENING"],
    ["Score", data.stopBang.score.toString()],
    ["Risk Level", data.stopBang.riskLevel],
    [""],
    ["INSOMNIA SEVERITY INDEX"],
    ["Score", data.insomnia.score.toString()],
    ["Severity", data.insomnia.severity],
    [""],
    ["PLATO-11 QUESTIONNAIRE"],
    ["Section A Score (Daytime)", data.plato.sectionAScore.toString() + "/32"],
    ["Section B Score (Nighttime)", data.plato.sectionBScore.toString() + "/8"],
    ["Section C Score (Sleep Quality)", data.plato.sectionCScore.toString() + "/4"],
    ["Total Score", data.plato.totalScore.toString() + "/44"],
    ["Sleep Quality Rating (Raw)", data.plato.sleepQualityRaw.toString() + "/10"],
    [""],
    ["AIRWAY ZONE SCORES (0-3)"],
    ["Nose", data.airwayZones.nose.toString()],
    ["Palate & Tonsils", data.airwayZones.palate.toString()],
    ["Mandible & Tongue", data.airwayZones.mandible.toString()],
    ["Neck", data.airwayZones.neck.toString()],
    [""],
    ["ASSIGNED PATHWAY"],
    ["Pathway ID", data.pathway.id],
    ["Title", data.pathway.title],
    ["Description", data.pathway.description],
  ];

  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `murphy-method-results-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
