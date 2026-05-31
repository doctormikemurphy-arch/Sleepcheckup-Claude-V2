import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  // In dev: generate the snapshot file on startup if it doesn't exist yet.
  // This bootstraps data/pathway-resources.json from the dev database so
  // it's ready to ship with the first Publish.
  if (process.env.NODE_ENV !== "production") {
    try {
      const { existsSync } = await import("fs");
      const { join } = await import("path");
      const snapshotPath = join(process.cwd(), "data", "pathway-resources.json");
      if (!existsSync(snapshotPath)) {
        const { writeContentSnapshot } = await import("./content-snapshot");
        await writeContentSnapshot();
      }
    } catch (e) {
      log(`Dev snapshot init error (non-fatal): ${e}`);
    }
  }

  // Sync pathway content into production on every startup.
  // In dev, the admin panel writes all changes to data/pathway-resources.json.
  // That file ships with the code on every Publish. Production reads it here
  // and does a full upsert+delete sync so content always matches what was
  // last saved in the dev admin panel.
  if (process.env.NODE_ENV === "production") {
    try {
      const { existsSync, readFileSync } = await import("fs");
      const { join } = await import("path");
      const { storage } = await import("./storage");

      const snapshotPath = join(process.cwd(), "data", "pathway-resources.json");

      let rows: any[];
      if (existsSync(snapshotPath)) {
        rows = JSON.parse(readFileSync(snapshotPath, "utf-8"));
        log(`Syncing ${rows.length} pathway resources from data/pathway-resources.json`);
      } else {
        const { PATHWAY_CONTENT_SEED } = await import("./pathway-content-seed");
        rows = PATHWAY_CONTENT_SEED as any[];
        log(`No snapshot file found — falling back to seed data (${rows.length} records)`);
      }

      const result = await storage.syncContentFromSnapshot(rows);
      log(`Pathway content sync complete: ${result.upserted} upserted, ${result.deleted} deleted`);
    } catch (e) {
      log(`Content sync error (non-fatal): ${e}`);
    }
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
