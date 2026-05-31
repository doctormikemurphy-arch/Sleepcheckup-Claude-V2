import { z } from "zod";
import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, jsonb, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export * from "./models/auth";

export const platoProfileSchema = z.object({
  readiness: z.enum(["ready", "uncertain", "resistant"]).default("uncertain"),
  preference: z.enum(["pap", "oral_appliance", "non_device", "none"]).default("none"),
  papBarriers: z.array(z.string()).default([]),
  facilitators: z.array(z.string()).default([]),
  adherenceRisk: z.enum(["low", "medium", "high"]).default("medium"),
});

export const zoneScoresSchema = z.object({
  nose: z.number().min(0).max(3).default(0),
  palate: z.number().min(0).max(3).default(0),
  mandible: z.number().min(0).max(3).default(0),
  neck: z.number().min(0).max(3).default(0),
});

export const assessmentResultSchema = z.object({
  stopBangScore: z.number().min(0).max(8),
  osaRisk: z.enum(["low", "intermediate", "high"]),
  isiScore: z.number().min(0).max(28).default(0),
  insomniaSeverity: z.enum(["none_mild", "subthreshold", "moderate", "severe"]).default("none_mild"),
  bmiValue: z.number().optional(),
  platoProfile: platoProfileSchema,
  zoneScores: zoneScoresSchema,
  assignedPathway: z.string(),
  comorbidities: z.array(z.string()).optional().default([]),
  mainComplaint: z.string().optional().default(""),
  completedAt: z.string().datetime().optional(),
});

export type PlatoProfile = z.infer<typeof platoProfileSchema>;
export type ZoneScores = z.infer<typeof zoneScoresSchema>;
export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  dateOfBirth: varchar("date_of_birth"),
  gender: varchar("gender"),
  heightInches: integer("height_inches"),
  weightLbs: integer("weight_lbs"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, updatedAt: true });
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type SelectUserProfile = typeof userProfiles.$inferSelect;

export const assessmentResults = pgTable("assessment_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  data: jsonb("data").notNull(),
  assignedPathway: text("assigned_pathway").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export type InsertAssessmentResult = typeof assessmentResults.$inferInsert;
export type SelectAssessmentResult = typeof assessmentResults.$inferSelect;

export const pathwayContent = pgTable("pathway_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pathwayId: varchar("pathway_id").notNull(),
  contentType: varchar("content_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  url: varchar("url"),
  imageUrl: varchar("image_url"),
  displayOrder: integer("display_order").default(0),
  label: varchar("label"),
});

export const insertPathwayContentSchema = createInsertSchema(pathwayContent).omit({ id: true });
export type InsertPathwayContent = z.infer<typeof insertPathwayContentSchema>;
export type SelectPathwayContent = typeof pathwayContent.$inferSelect;

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userName: varchar("user_name").notNull(),
  userAvatar: varchar("user_avatar"),
  category: varchar("category").notNull(),
  title: varchar("title").notNull(),
  body: text("body").notNull(),
  likesCount: integer("likes_count").default(0),
  repliesCount: integer("replies_count").default(0),
  pinned: boolean("pinned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ id: true, likesCount: true, repliesCount: true, pinned: true, createdAt: true });
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type SelectCommunityPost = typeof communityPosts.$inferSelect;

export const communityReplies = pgTable("community_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: varchar("user_name").notNull(),
  userAvatar: varchar("user_avatar"),
  body: text("body").notNull(),
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommunityReplySchema = createInsertSchema(communityReplies).omit({ id: true, likesCount: true, createdAt: true });
export type InsertCommunityReply = z.infer<typeof insertCommunityReplySchema>;
export type SelectCommunityReply = typeof communityReplies.$inferSelect;

export const communityLikes = pgTable("community_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  postId: varchar("post_id"),
  replyId: varchar("reply_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emailSubscribers = pgTable("email_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  name: varchar("name"),
  source: varchar("source").notNull().default("newsletter"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).omit({ id: true, subscribedAt: true });
export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;
export type SelectEmailSubscriber = typeof emailSubscribers.$inferSelect;

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email"),
  role: varchar("role"),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true });
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type SelectTestimonial = typeof testimonials.$inferSelect;

export const savedReports = pgTable("saved_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportToken: varchar("report_token").notNull().unique(),
  email: varchar("email").notNull(),
  pathwayName: varchar("pathway_name").notNull(),
  reportData: jsonb("report_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSavedReportSchema = createInsertSchema(savedReports).omit({ id: true, createdAt: true });
export type InsertSavedReport = z.infer<typeof insertSavedReportSchema>;
export type SelectSavedReport = typeof savedReports.$inferSelect;
