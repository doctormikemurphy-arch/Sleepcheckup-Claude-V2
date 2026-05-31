import { assessmentResults, pathwayContent, communityPosts, communityReplies, communityLikes, emailSubscribers, testimonials, userProfiles, savedReports, type InsertAssessmentResult, type SelectAssessmentResult, type AssessmentResult, type InsertPathwayContent, type SelectPathwayContent, type InsertCommunityPost, type SelectCommunityPost, type InsertCommunityReply, type SelectCommunityReply, type InsertEmailSubscriber, type SelectEmailSubscriber, type InsertTestimonial, type SelectTestimonial, type InsertUserProfile, type SelectUserProfile, type SelectSavedReport } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  getUserProfile(userId: string): Promise<SelectUserProfile | undefined>;
  upsertUserProfile(data: InsertUserProfile): Promise<SelectUserProfile>;
  saveAssessmentForUser(userId: string, data: AssessmentResult): Promise<SelectAssessmentResult>;
  getLatestAssessmentForUser(userId: string): Promise<SelectAssessmentResult | undefined>;
  getAllAssessmentsForUser(userId: string): Promise<SelectAssessmentResult[]>;
  getContentForPathway(pathwayId: string): Promise<SelectPathwayContent[]>;
  getContentByType(pathwayId: string, contentType: string): Promise<SelectPathwayContent[]>;
  createContent(data: InsertPathwayContent): Promise<SelectPathwayContent>;
  listAllContent(pathwayId?: string): Promise<SelectPathwayContent[]>;
  updateContent(id: string, data: Partial<InsertPathwayContent>): Promise<SelectPathwayContent | undefined>;
  deleteContent(id: string): Promise<boolean>;
  swapContentOrder(id1: string, id2: string): Promise<boolean>;
  bulkSeedContent(rows: SelectPathwayContent[]): Promise<number>;
  syncContentFromSnapshot(rows: SelectPathwayContent[]): Promise<{ upserted: number; deleted: number }>;
  getCommunityPosts(category?: string): Promise<SelectCommunityPost[]>;
  getCommunityPost(id: string): Promise<SelectCommunityPost | undefined>;
  createCommunityPost(data: InsertCommunityPost): Promise<SelectCommunityPost>;
  deleteCommunityPost(id: string): Promise<boolean>;
  getRepliesForPost(postId: string): Promise<SelectCommunityReply[]>;
  getCommunityReply(id: string): Promise<SelectCommunityReply | undefined>;
  createCommunityReply(data: InsertCommunityReply): Promise<SelectCommunityReply>;
  deleteCommunityReply(id: string): Promise<boolean>;
  toggleLike(userId: string, postId?: string, replyId?: string): Promise<boolean>;
  getUserLikes(userId: string): Promise<{ postIds: string[]; replyIds: string[] }>;
  subscribeEmail(data: InsertEmailSubscriber): Promise<SelectEmailSubscriber>;
  getSubscribers(): Promise<SelectEmailSubscriber[]>;
  deleteSubscriber(id: string): Promise<boolean>;
  getTestimonials(activeOnly?: boolean): Promise<SelectTestimonial[]>;
  createTestimonial(data: InsertTestimonial): Promise<SelectTestimonial>;
  updateTestimonial(id: string, data: Partial<InsertTestimonial>): Promise<SelectTestimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  getAnalytics(): Promise<{ totalAssessments: number; pathwayDistribution: Record<string, number>; totalSubscribers: number; totalPosts: number; subscribersBySource: Record<string, number> }>;
  saveReport(reportToken: string, email: string, pathwayName: string, reportData: Record<string, any>): Promise<SelectSavedReport>;
  getReportByToken(token: string): Promise<SelectSavedReport | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUserProfile(userId: string): Promise<SelectUserProfile | undefined> {
    const [result] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
    return result;
  }

  async upsertUserProfile(data: InsertUserProfile): Promise<SelectUserProfile> {
    const [result] = await db
      .insert(userProfiles)
      .values({ ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          heightInches: data.heightInches,
          weightLbs: data.weightLbs,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async saveAssessmentForUser(userId: string, data: AssessmentResult): Promise<SelectAssessmentResult> {
    const serializedData = JSON.parse(JSON.stringify(data));
    
    const [result] = await db
      .insert(assessmentResults)
      .values({
        userId,
        data: serializedData,
        assignedPathway: data.assignedPathway,
        completedAt: new Date(),
      })
      .returning();
    return result;
  }

  async getLatestAssessmentForUser(userId: string): Promise<SelectAssessmentResult | undefined> {
    const [result] = await db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.userId, userId))
      .orderBy(desc(assessmentResults.completedAt))
      .limit(1);
    return result;
  }

  async getAllAssessmentsForUser(userId: string): Promise<SelectAssessmentResult[]> {
    return db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.userId, userId))
      .orderBy(desc(assessmentResults.completedAt));
  }

  async getContentForPathway(pathwayId: string): Promise<SelectPathwayContent[]> {
    return db
      .select()
      .from(pathwayContent)
      .where(eq(pathwayContent.pathwayId, pathwayId))
      .orderBy(asc(pathwayContent.displayOrder));
  }

  async getContentByType(pathwayId: string, contentType: string): Promise<SelectPathwayContent[]> {
    return db
      .select()
      .from(pathwayContent)
      .where(and(eq(pathwayContent.pathwayId, pathwayId), eq(pathwayContent.contentType, contentType)))
      .orderBy(asc(pathwayContent.displayOrder));
  }

  async createContent(data: InsertPathwayContent): Promise<SelectPathwayContent> {
    const [result] = await db
      .insert(pathwayContent)
      .values(data)
      .returning();
    return result;
  }

  async listAllContent(pathwayId?: string): Promise<SelectPathwayContent[]> {
    if (pathwayId) {
      return db
        .select()
        .from(pathwayContent)
        .where(eq(pathwayContent.pathwayId, pathwayId))
        .orderBy(asc(pathwayContent.displayOrder));
    }
    return db
      .select()
      .from(pathwayContent)
      .orderBy(asc(pathwayContent.pathwayId), asc(pathwayContent.displayOrder));
  }

  async updateContent(id: string, data: Partial<InsertPathwayContent>): Promise<SelectPathwayContent | undefined> {
    const [result] = await db
      .update(pathwayContent)
      .set(data)
      .where(eq(pathwayContent.id, id))
      .returning();
    return result;
  }

  async swapContentOrder(id1: string, id2: string): Promise<boolean> {
    const [item1] = await db.select().from(pathwayContent).where(eq(pathwayContent.id, id1));
    const [item2] = await db.select().from(pathwayContent).where(eq(pathwayContent.id, id2));
    if (!item1 || !item2) return false;
    if (item1.pathwayId !== item2.pathwayId || item1.contentType !== item2.contentType) return false;

    const siblings = await db
      .select()
      .from(pathwayContent)
      .where(and(eq(pathwayContent.pathwayId, item1.pathwayId), eq(pathwayContent.contentType, item1.contentType)))
      .orderBy(asc(pathwayContent.displayOrder));

    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i].displayOrder !== i) {
        await db.update(pathwayContent).set({ displayOrder: i }).where(eq(pathwayContent.id, siblings[i].id));
      }
    }

    const normalizedSiblings = await db
      .select()
      .from(pathwayContent)
      .where(and(eq(pathwayContent.pathwayId, item1.pathwayId), eq(pathwayContent.contentType, item1.contentType)))
      .orderBy(asc(pathwayContent.displayOrder));

    const idx1 = normalizedSiblings.findIndex(s => s.id === id1);
    const idx2 = normalizedSiblings.findIndex(s => s.id === id2);
    if (idx1 === -1 || idx2 === -1) return false;

    const order1 = normalizedSiblings[idx1].displayOrder!;
    const order2 = normalizedSiblings[idx2].displayOrder!;
    await db.update(pathwayContent).set({ displayOrder: order2 }).where(eq(pathwayContent.id, id1));
    await db.update(pathwayContent).set({ displayOrder: order1 }).where(eq(pathwayContent.id, id2));
    return true;
  }

  async deleteContent(id: string): Promise<boolean> {
    const [result] = await db
      .delete(pathwayContent)
      .where(eq(pathwayContent.id, id))
      .returning();
    return !!result;
  }

  async bulkSeedContent(rows: SelectPathwayContent[]): Promise<number> {
    if (rows.length === 0) return 0;
    const existing = await db.select({ id: pathwayContent.id }).from(pathwayContent);
    const existingIds = new Set(existing.map(r => r.id));
    const toInsert = rows.filter(r => r.id && !existingIds.has(r.id));
    if (toInsert.length === 0) return 0;
    await db.insert(pathwayContent).values(toInsert);
    return toInsert.length;
  }

  async syncContentFromSnapshot(rows: SelectPathwayContent[]): Promise<{ upserted: number; deleted: number }> {
    if (rows.length === 0) return { upserted: 0, deleted: 0 };

    for (const row of rows) {
      await db
        .insert(pathwayContent)
        .values(row)
        .onConflictDoUpdate({
          target: pathwayContent.id,
          set: {
            pathwayId: row.pathwayId,
            contentType: row.contentType,
            title: row.title,
            description: row.description,
            url: row.url,
            imageUrl: row.imageUrl,
            label: row.label,
            displayOrder: row.displayOrder,
            isActive: row.isActive,
          },
        });
    }

    const snapshotIds = new Set(rows.map(r => r.id));
    const existing = await db.select({ id: pathwayContent.id }).from(pathwayContent);
    const toDelete = existing.filter(r => !snapshotIds.has(r.id));
    for (const row of toDelete) {
      await db.delete(pathwayContent).where(eq(pathwayContent.id, row.id));
    }

    return { upserted: rows.length, deleted: toDelete.length };
  }

  async getCommunityPosts(category?: string): Promise<SelectCommunityPost[]> {
    if (category) {
      return db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.category, category))
        .orderBy(desc(communityPosts.pinned), desc(communityPosts.createdAt));
    }
    return db
      .select()
      .from(communityPosts)
      .orderBy(desc(communityPosts.pinned), desc(communityPosts.createdAt));
  }

  async getCommunityPost(id: string): Promise<SelectCommunityPost | undefined> {
    const [result] = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, id));
    return result;
  }

  async createCommunityPost(data: InsertCommunityPost): Promise<SelectCommunityPost> {
    const [result] = await db
      .insert(communityPosts)
      .values(data)
      .returning();
    return result;
  }

  async deleteCommunityPost(id: string): Promise<boolean> {
    await db.delete(communityReplies).where(eq(communityReplies.postId, id));
    await db.delete(communityLikes).where(eq(communityLikes.postId, id));
    const [result] = await db
      .delete(communityPosts)
      .where(eq(communityPosts.id, id))
      .returning();
    return !!result;
  }

  async getRepliesForPost(postId: string): Promise<SelectCommunityReply[]> {
    return db
      .select()
      .from(communityReplies)
      .where(eq(communityReplies.postId, postId))
      .orderBy(asc(communityReplies.createdAt));
  }

  async getCommunityReply(id: string): Promise<SelectCommunityReply | undefined> {
    const [result] = await db
      .select()
      .from(communityReplies)
      .where(eq(communityReplies.id, id));
    return result;
  }

  async createCommunityReply(data: InsertCommunityReply): Promise<SelectCommunityReply> {
    const [result] = await db
      .insert(communityReplies)
      .values(data)
      .returning();
    await db
      .update(communityPosts)
      .set({ repliesCount: sql`${communityPosts.repliesCount} + 1` })
      .where(eq(communityPosts.id, data.postId));
    return result;
  }

  async deleteCommunityReply(id: string): Promise<boolean> {
    const [reply] = await db.select().from(communityReplies).where(eq(communityReplies.id, id));
    if (!reply) return false;
    await db.delete(communityLikes).where(eq(communityLikes.replyId, id));
    const [result] = await db
      .delete(communityReplies)
      .where(eq(communityReplies.id, id))
      .returning();
    if (result) {
      await db
        .update(communityPosts)
        .set({ repliesCount: sql`GREATEST(${communityPosts.repliesCount} - 1, 0)` })
        .where(eq(communityPosts.id, reply.postId));
    }
    return !!result;
  }

  async toggleLike(userId: string, postId?: string, replyId?: string): Promise<boolean> {
    const conditions = [eq(communityLikes.userId, userId)];
    if (postId) conditions.push(eq(communityLikes.postId, postId));
    if (replyId) conditions.push(eq(communityLikes.replyId, replyId));

    const [existing] = await db
      .select()
      .from(communityLikes)
      .where(and(...conditions));

    if (existing) {
      await db.delete(communityLikes).where(eq(communityLikes.id, existing.id));
      if (postId) {
        await db.update(communityPosts).set({ likesCount: sql`GREATEST(${communityPosts.likesCount} - 1, 0)` }).where(eq(communityPosts.id, postId));
      }
      if (replyId) {
        await db.update(communityReplies).set({ likesCount: sql`GREATEST(${communityReplies.likesCount} - 1, 0)` }).where(eq(communityReplies.id, replyId));
      }
      return false;
    } else {
      await db.insert(communityLikes).values({ userId, postId: postId || null, replyId: replyId || null });
      if (postId) {
        await db.update(communityPosts).set({ likesCount: sql`${communityPosts.likesCount} + 1` }).where(eq(communityPosts.id, postId));
      }
      if (replyId) {
        await db.update(communityReplies).set({ likesCount: sql`${communityReplies.likesCount} + 1` }).where(eq(communityReplies.id, replyId));
      }
      return true;
    }
  }

  async getUserLikes(userId: string): Promise<{ postIds: string[]; replyIds: string[] }> {
    const likes = await db
      .select()
      .from(communityLikes)
      .where(eq(communityLikes.userId, userId));
    return {
      postIds: likes.filter(l => l.postId).map(l => l.postId!),
      replyIds: likes.filter(l => l.replyId).map(l => l.replyId!),
    };
  }

  async subscribeEmail(data: InsertEmailSubscriber): Promise<SelectEmailSubscriber> {
    const [existing] = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, data.email));
    if (existing) {
      const [updated] = await db.update(emailSubscribers).set({ isActive: true, source: data.source, name: data.name ?? existing.name, notes: data.notes ?? existing.notes }).where(eq(emailSubscribers.id, existing.id)).returning();
      return updated;
    }
    const [result] = await db.insert(emailSubscribers).values(data).returning();
    return result;
  }

  async getSubscribers(): Promise<SelectEmailSubscriber[]> {
    return db.select().from(emailSubscribers).orderBy(desc(emailSubscribers.subscribedAt));
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    const [result] = await db.delete(emailSubscribers).where(eq(emailSubscribers.id, id)).returning();
    return !!result;
  }

  async getTestimonials(activeOnly = true): Promise<SelectTestimonial[]> {
    if (activeOnly) {
      return db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt));
    }
    return db.select().from(testimonials).orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt));
  }

  async createTestimonial(data: InsertTestimonial): Promise<SelectTestimonial> {
    const [result] = await db.insert(testimonials).values(data).returning();
    return result;
  }

  async updateTestimonial(id: string, data: Partial<InsertTestimonial>): Promise<SelectTestimonial | undefined> {
    const [result] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
    return result;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const [result] = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return !!result;
  }

  async getAnalytics(): Promise<{ totalAssessments: number; pathwayDistribution: Record<string, number>; totalSubscribers: number; totalPosts: number; subscribersBySource: Record<string, number> }> {
    const [assessmentCount] = await db.select({ count: count() }).from(assessmentResults);
    const [subscriberCount] = await db.select({ count: count() }).from(emailSubscribers).where(eq(emailSubscribers.isActive, true));
    const [postCount] = await db.select({ count: count() }).from(communityPosts);

    const allAssessments = await db.select({ assignedPathway: assessmentResults.assignedPathway }).from(assessmentResults);
    const pathwayDistribution: Record<string, number> = {};
    for (const a of allAssessments) {
      pathwayDistribution[a.assignedPathway] = (pathwayDistribution[a.assignedPathway] || 0) + 1;
    }

    const allSubscribers = await db.select({ source: emailSubscribers.source }).from(emailSubscribers).where(eq(emailSubscribers.isActive, true));
    const subscribersBySource: Record<string, number> = {};
    for (const s of allSubscribers) {
      subscribersBySource[s.source] = (subscribersBySource[s.source] || 0) + 1;
    }

    return {
      totalAssessments: assessmentCount.count,
      pathwayDistribution,
      totalSubscribers: subscriberCount.count,
      totalPosts: postCount.count,
      subscribersBySource,
    };
  }
  async saveReport(reportToken: string, email: string, pathwayName: string, reportData: Record<string, any>): Promise<SelectSavedReport> {
    const [result] = await db
      .insert(savedReports)
      .values({ reportToken, email, pathwayName, reportData })
      .returning();
    return result;
  }

  async getReportByToken(token: string): Promise<SelectSavedReport | undefined> {
    const [result] = await db
      .select()
      .from(savedReports)
      .where(eq(savedReports.reportToken, token))
      .limit(1);
    return result;
  }
}

export const storage = new DatabaseStorage();
