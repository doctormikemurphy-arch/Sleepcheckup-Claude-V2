import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { storage } from "./storage";
import { log } from "./index";

export async function writeContentSnapshot(): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  try {
    const allContent = await storage.listAllContent();
    const dataDir = join(process.cwd(), "data");
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(
      join(dataDir, "pathway-resources.json"),
      JSON.stringify(allContent, null, 2),
      "utf-8"
    );
    log(`Content snapshot updated — ${allContent.length} resources written to data/pathway-resources.json`);
  } catch (e) {
    console.error("Failed to write content snapshot:", e);
  }
}
