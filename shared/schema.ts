import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const referencePaperSchema = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string(),
  fileSize: z.number().optional(),
});

export const insertReferencePaperSchema = referencePaperSchema.omit({ id: true });

export type ReferencePaper = z.infer<typeof referencePaperSchema>;
export type InsertReferencePaper = z.infer<typeof insertReferencePaperSchema>;

export const chatMessageSchema = z.object({
  id: z.string(),
  type: z.enum(['system', 'user', 'llm']),
  content: z.string(),
});

export const insertChatMessageSchema = chatMessageSchema.omit({ id: true });

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export const feedbackItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  content: z.string(),
  section: z.string(),
});

export const insertFeedbackItemSchema = feedbackItemSchema.omit({ id: true });

export type FeedbackItem = z.infer<typeof feedbackItemSchema>;
export type InsertFeedbackItem = z.infer<typeof insertFeedbackItemSchema>;

export const qualityScoreSchema = z.object({
  helpfulness: z.number(),
  correctness: z.number(),
  coherence: z.number(),
  complexity: z.number(),
  verbosity: z.number(),
});

export type QualityScore = z.infer<typeof qualityScoreSchema>;

export const sectionContentSchema = z.object({
  section: z.string(),
  content: z.string(),
});

export type SectionContent = z.infer<typeof sectionContentSchema>;
