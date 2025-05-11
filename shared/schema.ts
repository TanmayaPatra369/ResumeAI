import { pgTable, text, serial, integer, boolean, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Resume schema
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  template: text("template").notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumes)
  .omit({ id: true, createdAt: true, updatedAt: true });

// Job Description Analysis schema
export const jobAnalyses = pgTable("job_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  resumeId: integer("resume_id").references(() => resumes.id),
  jobDescription: text("job_description").notNull(),
  analysis: jsonb("analysis").notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
});

export const insertJobAnalysisSchema = createInsertSchema(jobAnalyses)
  .omit({ id: true, createdAt: true });

// Skill suggestion schema
export const skillSuggestions = pgTable("skill_suggestions", {
  id: serial("id").primaryKey(),
  industry: text("industry").notNull(),
  jobTitle: text("job_title").notNull(),
  skills: jsonb("skills").notNull(),
});

export const insertSkillSuggestionSchema = createInsertSchema(skillSuggestions)
  .omit({ id: true });

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;

export type JobAnalysis = typeof jobAnalyses.$inferSelect;
export type InsertJobAnalysis = z.infer<typeof insertJobAnalysisSchema>;

export type SkillSuggestion = typeof skillSuggestions.$inferSelect;
export type InsertSkillSuggestion = z.infer<typeof insertSkillSuggestionSchema>;
