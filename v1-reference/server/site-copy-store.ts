import fs from "fs";
import path from "path";
import { HOME, HOW_IT_WORKS } from "../client/src/content";

const DATA_FILE = path.join(process.cwd(), "data", "site-copy.json");

export interface Faq {
  q: string;
  a: string;
}

export interface PathwayCard {
  title: string;
  intro: string;
  bullets: string[];
}

export interface SiteCopyData {
  homeFaqs: Faq[];
  howItWorksFaqs: Faq[];
  pathwayCards: {
    card1: PathwayCard;
    card2: PathwayCard;
  };
}

function defaults(): SiteCopyData {
  return {
    homeFaqs: HOME.faqs,
    howItWorksFaqs: HOW_IT_WORKS.faqs,
    pathwayCards: {
      card1: HOME.pathways.card1,
      card2: HOME.pathways.card2,
    },
  };
}

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function readSiteCopy(): SiteCopyData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      const def = defaults();
      return {
        homeFaqs: parsed.homeFaqs ?? def.homeFaqs,
        howItWorksFaqs: parsed.howItWorksFaqs ?? def.howItWorksFaqs,
        pathwayCards: parsed.pathwayCards ?? def.pathwayCards,
      };
    }
  } catch (_) {}
  return defaults();
}

export function writeSiteCopy(data: Partial<SiteCopyData>): SiteCopyData {
  ensureDataDir();
  const current = readSiteCopy();
  const updated: SiteCopyData = { ...current, ...data };
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}
