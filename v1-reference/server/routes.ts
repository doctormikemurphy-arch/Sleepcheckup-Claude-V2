import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import multer from "multer";
import { readSiteCopy, writeSiteCopy } from "./site-copy-store";
import { writeContentSnapshot } from "./content-snapshot";
import { storage } from "./storage";
import { assessmentResultSchema, insertPathwayContentSchema, insertCommunityPostSchema, insertCommunityReplySchema, insertEmailSubscriberSchema, insertTestimonialSchema, insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { sendFreeResultsEmail, sendReportEmail } from "./email";
import crypto from "crypto";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripe-client";

// Price in cents — $1 for Lean Startup test, change to 7900 for full launch
const ASSESSMENT_PRICE_CENTS = 100;
const ASSESSMENT_PRICE_LABEL = "$1.00";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set([
  ".doc", ".docx", ".pdf", ".xls", ".xlsx", ".ppt", ".pptx",
  ".txt", ".rtf", ".csv", ".zip", ".png", ".jpg", ".jpeg", ".gif", ".webp",
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      cb(null, `${base}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      cb(new Error(`File type ${ext} not allowed`));
      return;
    }
    cb(null, true);
  },
});

const ADMIN_USER_ID = "50344991";
const DEV_MODE = process.env.NODE_ENV === "development";

const isAdmin: RequestHandler = (req: any, res, next) => {
  if (DEV_MODE) { next(); return; }
  const userId = req.user?.claims?.sub;
  if (userId !== ADMIN_USER_ID) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
};

const isAuthenticatedOrDev: RequestHandler = (req: any, res, next) => {
  if (DEV_MODE) { next(); return; }
  return (isAuthenticated as RequestHandler)(req, res, next);
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.use("/uploads", isAuthenticatedOrDev, (req: any, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    const downloadTypes = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".zip", ".rar"];
    if (downloadTypes.includes(ext)) {
      const filename = path.basename(req.path);
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    }
    next();
  });
  app.use("/uploads", (await import("express")).default.static(uploadsDir));

  app.post("/api/admin/upload", isAuthenticatedOrDev, isAdmin, (req: any, res, next) => {
    upload.single("file")(req, res, (err: any) => {
      if (err) {
        res.status(400).json({ error: err.message || "Upload failed" });
        return;
      }
      next();
    });
  }, (req: any, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });

  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
      const profile = await storage.getUserProfile(userId);
      res.json(profile || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
      const data = { ...req.body, userId };
      const profile = await storage.upsertUserProfile(data);
      res.json(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(400).json({ error: "Failed to save profile" });
    }
  });

  app.post("/api/assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const result = assessmentResultSchema.parse(req.body);
      const saved = await storage.saveAssessmentForUser(userId, result);
      res.json({ id: saved.id, completedAt: saved.completedAt });
    } catch (error) {
      console.error("Error saving assessment:", error);
      res.status(400).json({ error: "Invalid assessment data" });
    }
  });

  app.get("/api/assessments/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const assessment = await storage.getLatestAssessmentForUser(userId);
      if (!assessment) {
        res.json({ hasResult: false, result: null });
        return;
      }
      res.json({ hasResult: true, result: assessment });
    } catch (error) {
      console.error("Error retrieving assessment:", error);
      res.status(500).json({ error: "Failed to retrieve assessment" });
    }
  });

  app.get("/api/assessments/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const assessments = await storage.getAllAssessmentsForUser(userId);
      res.json(assessments);
    } catch (error) {
      console.error("Error retrieving assessments:", error);
      res.status(500).json({ error: "Failed to retrieve assessments" });
    }
  });

  app.get("/api/general-content", async (_req: any, res) => {
    try {
      const content = await storage.getContentForPathway("general");
      res.json(content);
    } catch (error) {
      console.error("Error fetching general content:", error);
      res.status(500).json({ error: "Failed to fetch general content" });
    }
  });

  // PAYMENT GATE: When ready to charge, restore isAuthenticated + assessment check (see git history)
  app.get("/api/pathway-content/:pathwayId", async (req: any, res) => {
    try {
      const { pathwayId } = req.params;
      const content = await storage.getContentForPathway(pathwayId);
      res.json(content);
    } catch (error) {
      console.error("Error fetching pathway content:", error);
      res.status(500).json({ error: "Failed to fetch pathway content" });
    }
  });

  app.get("/api/admin/pathway-content", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const pathwayId = req.query.pathwayId as string | undefined;
      const content = await storage.listAllContent(pathwayId);
      res.json(content);
    } catch (error) {
      console.error("Error listing content:", error);
      res.status(500).json({ error: "Failed to list content" });
    }
  });

  app.post("/api/admin/pathway-content", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const data = insertPathwayContentSchema.parse(req.body);
      const created = await storage.createContent(data);
      writeContentSnapshot().catch(() => {});
      res.json(created);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  app.patch("/api/admin/pathway-content/:id", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const data = insertPathwayContentSchema.partial().parse(req.body);
      const updated = await storage.updateContent(id, data);
      if (!updated) {
        res.status(404).json({ error: "Content not found" });
        return;
      }
      writeContentSnapshot().catch(() => {});
      res.json(updated);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  app.post("/api/admin/pathway-content/reorder", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const { id1, id2 } = req.body;
      if (!id1 || !id2) {
        res.status(400).json({ error: "Both id1 and id2 are required" });
        return;
      }
      const swapped = await storage.swapContentOrder(id1, id2);
      if (!swapped) {
        res.status(404).json({ error: "One or both items not found" });
        return;
      }
      writeContentSnapshot().catch(() => {});
      res.json({ success: true });
    } catch (error) {
      console.error("Error reordering content:", error);
      res.status(500).json({ error: "Failed to reorder content" });
    }
  });

  app.delete("/api/admin/pathway-content/:id", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteContent(id);
      if (!deleted) {
        res.status(404).json({ error: "Content not found" });
        return;
      }
      writeContentSnapshot().catch(() => {});
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  app.post("/api/admin/save-content-snapshot", isAuthenticatedOrDev, isAdmin, async (_req, res) => {
    try {
      const allContent = await storage.listAllContent();
      await writeContentSnapshot();
      res.json({ success: true, count: allContent.length });
    } catch (error) {
      console.error("Error saving content snapshot:", error);
      res.status(500).json({ error: "Failed to save snapshot" });
    }
  });

  app.post("/api/admin/seed-pathway-content", isAuthenticatedOrDev, isAdmin, async (_req, res) => {
    try {
      const { PATHWAY_CONTENT_SEED } = await import("./pathway-content-seed");
      const count = await storage.bulkSeedContent(PATHWAY_CONTENT_SEED);
      res.json({ success: true, inserted: count });
    } catch (error) {
      console.error("Error seeding pathway content:", error);
      res.status(500).json({ error: "Failed to seed pathway content" });
    }
  });

  app.get("/api/admin/check", isAuthenticatedOrDev, isAdmin, (_req, res) => {
    res.json({ isAdmin: true });
  });

  app.get("/api/community/posts", async (req: any, res) => {
    try {
      const category = req.query.category as string | undefined;
      const posts = await storage.getCommunityPosts(category);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/community/posts/:id", async (req: any, res) => {
    try {
      const post = await storage.getCommunityPost(req.params.id);
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      const replies = await storage.getRepliesForPost(req.params.id);
      res.json({ post, replies });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/community/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const data = insertCommunityPostSchema.parse({
        ...req.body,
        userId,
        userName: req.body.userName || "Anonymous",
      });
      const post = await storage.createCommunityPost(data);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ error: "Invalid post data" });
    }
  });

  app.delete("/api/community/posts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const post = await storage.getCommunityPost(req.params.id);
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      if (post.userId !== userId && userId !== ADMIN_USER_ID) {
        res.status(403).json({ error: "Not authorized to delete this post" });
        return;
      }
      await storage.deleteCommunityPost(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  app.post("/api/community/posts/:id/replies", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const data = insertCommunityReplySchema.parse({
        ...req.body,
        postId: req.params.id,
        userId,
        userName: req.body.userName || "Anonymous",
      });
      const reply = await storage.createCommunityReply(data);
      res.json(reply);
    } catch (error) {
      console.error("Error creating reply:", error);
      res.status(400).json({ error: "Invalid reply data" });
    }
  });

  app.delete("/api/community/replies/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const reply = await storage.getCommunityReply(req.params.id);
      if (!reply) {
        res.status(404).json({ error: "Reply not found" });
        return;
      }
      if (reply.userId !== userId && userId !== ADMIN_USER_ID) {
        res.status(403).json({ error: "Not authorized to delete this reply" });
        return;
      }
      await storage.deleteCommunityReply(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting reply:", error);
      res.status(500).json({ error: "Failed to delete reply" });
    }
  });

  app.post("/api/community/like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const { postId, replyId } = req.body;
      if (!postId && !replyId) {
        res.status(400).json({ error: "postId or replyId required" });
        return;
      }
      const liked = await storage.toggleLike(userId, postId, replyId);
      res.json({ liked });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ error: "Failed to toggle like" });
    }
  });

  app.get("/api/community/likes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const likes = await storage.getUserLikes(userId);
      res.json(likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ error: "Failed to fetch likes" });
    }
  });

  app.post("/api/subscribe", async (req: any, res) => {
    try {
      const data = insertEmailSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeEmail(data);
      res.json({ success: true, id: subscriber.id });
    } catch (error) {
      console.error("Error subscribing:", error);
      res.status(400).json({ error: "Invalid subscription data" });
    }
  });

  // Return Stripe publishable key to frontend
  app.get("/api/stripe-config", async (_req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey, priceLabel: ASSESSMENT_PRICE_LABEL });
    } catch (error) {
      console.error("Error getting Stripe config:", error);
      res.status(500).json({ error: "Stripe not configured" });
    }
  });

  // Create Stripe Checkout session
  app.post("/api/create-checkout-session", async (req: any, res) => {
    try {
      const schema = z.object({
        email: z.string().email().optional(),
      });
      const { email } = schema.parse(req.body);

      const origin = `${req.protocol}://${req.get("host")}`;
      const stripe = await getUncachableStripeClient();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: email || undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: ASSESSMENT_PRICE_CENTS,
              product_data: {
                name: "Murphy Method™ Full Assessment Report",
                description: "Personalized sleep apnea pathway report — Sleep Check Up, Inc. | Clinical content by Michael Murphy, MD, MPH — Stanford Medicine. Emailed as PDF instantly on completion.",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/assessment?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/screener/results`,
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });

  // Verify a completed Stripe payment session
  app.get("/api/verify-payment", async (req: any, res) => {
    try {
      const sessionId = req.query.session_id as string;
      if (!sessionId) {
        res.status(400).json({ error: "session_id required" });
        return;
      }

      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        res.json({
          paid: true,
          email: session.customer_email || session.customer_details?.email || null,
          sessionId,
        });
      } else {
        res.json({ paid: false, sessionId });
      }
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // Screener email capture + send free results email
  app.post("/api/screener/submit", async (req: any, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        stopBangScore: z.number().int().min(0).max(8),
        osaRisk: z.enum(["low", "intermediate", "high"]),
        flaggedZones: z.array(z.string()).default([]),
      });
      const { email, stopBangScore, osaRisk, flaggedZones } = schema.parse(req.body);

      // Save email subscriber
      try {
        await storage.subscribeEmail({ email, source: "screener" });
      } catch (_) {
        // Ignore duplicate email errors — subscriber may already exist
      }

      // Send free results email (non-blocking)
      sendFreeResultsEmail({ email, stopBangScore, osaRisk, flaggedZones }).catch((err) =>
        console.error("Free results email failed:", err)
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing screener submission:", error);
      res.status(400).json({ error: "Invalid screener data" });
    }
  });

  // Full assessment submission + send report email (no auth required — post-payment flow)
  app.post("/api/assessments/submit", async (req: any, res) => {
    try {
      const zoneSchema = z.object({ label: z.string(), score: z.number(), max: z.number(), isPositive: z.boolean(), answers: z.array(z.string()) });
      const palmSchema = z.object({ letter: z.string(), name: z.string(), score: z.number(), isPositive: z.boolean(), questions: z.array(z.string()) });
      const schema = z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
        pathwayName: z.string(),
        pathwayLetter: z.string().optional(),
        pathwayDescription: z.string(),
        stopBangScore: z.number().int().min(0).max(8),
        osaRisk: z.enum(["low", "intermediate", "high"]),
        isiScore: z.number().optional(),
        insomniaSeverity: z.string().optional(),
        bmiValue: z.number().nullable().optional(),
        bmiLabel: z.string().optional(),
        assessmentDate: z.string().optional(),
        anatomyTotal: z.number().optional(),
        anatomyZones: z.array(zoneSchema).optional(),
        palmResults: z.array(palmSchema).optional(),
        medicalHistoryScore: z.number().optional(),
        medicalHistoryConditions: z.array(z.string()).optional(),
        platoTotal: z.number().optional(),
        platoSleepQuality: z.number().optional(),
        platoSectionA: z.number().optional(),
        platoSectionB: z.number().optional(),
        platoSectionC: z.number().optional(),
        educationalSummary: z.string().optional(),
        whatResultsSuggest: z.array(z.string()).optional(),
        whyItMattersIntro: z.string().optional(),
        whyItMattersPts: z.array(z.string()).optional(),
        whatWorksBestIntro: z.string().optional(),
        whatWorksBestOpts: z.array(z.string()).optional(),
        nextStepsIntro: z.string().optional(),
        nextStepsSteps: z.array(z.string()).optional(),
        assessmentData: z.any().optional(),
      });
      const parsed = schema.parse(req.body);

      // Generate unique token and save report to DB (synchronous — guarantees recovery link exists)
      const reportToken = crypto.randomUUID();
      try {
        await storage.saveReport(reportToken, parsed.email, parsed.pathwayName, parsed as Record<string, any>);
      } catch (dbErr) {
        console.error("Failed to save report to DB:", dbErr);
        // Non-fatal — continue so email still sends
      }

      // Send report email (non-blocking — DB save already happened)
      sendReportEmail({ ...parsed, reportToken }).catch((err) =>
        console.error("Report email failed:", err)
      );

      res.json({ success: true, reportToken });
    } catch (error) {
      console.error("Error processing assessment submission:", error);
      res.status(400).json({ error: "Invalid assessment data" });
    }
  });

  // Public report access by token — no auth required
  app.get("/api/report/:token", async (req, res) => {
    try {
      const report = await storage.getReportByToken(req.params.token);
      if (!report) return res.status(404).json({ error: "Report not found" });
      res.json(report);
    } catch (error) {
      console.error("Error fetching report by token:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.get("/api/testimonials", async (_req, res) => {
    try {
      const items = await storage.getTestimonials(true);
      res.json(items);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const { name, email, content, rating } = req.body;
      if (!name || !content || !email) {
        return res.status(400).json({ error: "Name, email, and testimonial content are required" });
      }
      const testimonial = await storage.createTestimonial({
        name,
        email,
        content,
        rating: rating ?? 5,
        role: null,
        isActive: false,
        displayOrder: 999,
      });
      res.status(201).json({ message: "Thank you! Your testimonial has been submitted for review." });
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      res.status(500).json({ error: "Failed to submit testimonial" });
    }
  });

  app.get("/api/admin/analytics", isAuthenticatedOrDev, isAdmin, async (_req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/subscribers", isAuthenticatedOrDev, isAdmin, async (_req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  app.delete("/api/admin/subscribers/:id", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const deleted = await storage.deleteSubscriber(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Subscriber not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  });

  app.get("/api/admin/testimonials", isAuthenticatedOrDev, isAdmin, async (_req, res) => {
    try {
      const items = await storage.getTestimonials(false);
      res.json(items);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const data = insertTestimonialSchema.parse(req.body);
      const created = await storage.createTestimonial(data);
      res.json(created);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ error: "Invalid testimonial data" });
    }
  });

  app.patch("/api/admin/testimonials/:id", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const data = insertTestimonialSchema.partial().parse(req.body);
      const updated = await storage.updateTestimonial(req.params.id, data);
      if (!updated) {
        res.status(404).json({ error: "Testimonial not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(400).json({ error: "Invalid testimonial data" });
    }
  });

  app.delete("/api/admin/testimonials/:id", isAuthenticatedOrDev, isAdmin, async (req: any, res) => {
    try {
      const deleted = await storage.deleteTestimonial(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Testimonial not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  app.get("/api/site-copy", (_req, res) => {
    try {
      res.json(readSiteCopy());
    } catch (error) {
      console.error("Error reading site copy:", error);
      res.status(500).json({ error: "Failed to read site copy" });
    }
  });

  app.get("/api/admin/site-copy", isAuthenticatedOrDev, isAdmin, (_req, res) => {
    try {
      res.json(readSiteCopy());
    } catch (error) {
      console.error("Error reading site copy:", error);
      res.status(500).json({ error: "Failed to read site copy" });
    }
  });

  app.put("/api/admin/site-copy", isAuthenticatedOrDev, isAdmin, (req, res) => {
    try {
      const updated = writeSiteCopy(req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error writing site copy:", error);
      res.status(500).json({ error: "Failed to save site copy" });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
