import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeJobDescription, generateSummary, suggestSkills, improveDescription } from "./nlp";
import { scoreResumeWithAI } from "./openai";
import { z } from "zod";
import { insertResumeSchema, insertJobAnalysisSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";
  
  // Resume routes
  app.get(`${apiPrefix}/resumes`, async (req: Request, res: Response) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const resumes = await storage.getResumes(userId);
    res.json(resumes);
  });

  app.get(`${apiPrefix}/resumes/:id`, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid resume ID" });
    }
    
    const resume = await storage.getResume(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    
    res.json(resume);
  });

  app.post(`${apiPrefix}/resumes`, async (req: Request, res: Response) => {
    try {
      const resumeData = insertResumeSchema.parse(req.body);
      const resume = await storage.createResume(resumeData);
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating resume" });
    }
  });

  app.put(`${apiPrefix}/resumes/:id`, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid resume ID" });
    }
    
    try {
      const resumeData = insertResumeSchema.partial().parse(req.body);
      const resume = await storage.updateResume(id, resumeData);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating resume" });
    }
  });

  app.delete(`${apiPrefix}/resumes/:id`, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid resume ID" });
    }
    
    const success = await storage.deleteResume(id);
    if (!success) {
      return res.status(404).json({ message: "Resume not found" });
    }
    
    res.status(204).end();
  });

  // Job Analysis routes
  app.get(`${apiPrefix}/job-analyses`, async (req: Request, res: Response) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const analyses = await storage.getJobAnalyses(userId);
    res.json(analyses);
  });

  app.post(`${apiPrefix}/job-analyses`, async (req: Request, res: Response) => {
    try {
      const analysisData = insertJobAnalysisSchema.parse(req.body);
      const analysis = await storage.createJobAnalysis(analysisData);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job analysis data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating job analysis" });
    }
  });

  // ML routes
  app.post(`${apiPrefix}/analyze-job`, async (req: Request, res: Response) => {
    const { jobDescription, resumeContent } = req.body;
    
    if (!jobDescription || !resumeContent) {
      return res.status(400).json({ message: "Job description and resume content are required" });
    }
    
    try {
      const analysis = await analyzeJobDescription(jobDescription, resumeContent);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Error analyzing job description" });
    }
  });

  app.post(`${apiPrefix}/generate-summary`, async (req: Request, res: Response) => {
    const { resumeContent } = req.body;
    
    if (!resumeContent) {
      return res.status(400).json({ message: "Resume content is required" });
    }
    
    try {
      const summary = await generateSummary(resumeContent);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ message: "Error generating summary" });
    }
  });

  app.post(`${apiPrefix}/suggest-skills`, async (req: Request, res: Response) => {
    const { jobTitle, industry, currentSkills } = req.body;
    
    if (!jobTitle) {
      return res.status(400).json({ message: "Job title is required" });
    }
    
    try {
      const skills = await suggestSkills(jobTitle, industry, currentSkills);
      res.json({ skills });
    } catch (error) {
      res.status(500).json({ message: "Error suggesting skills" });
    }
  });

  app.post(`${apiPrefix}/improve-description`, async (req: Request, res: Response) => {
    const { description, type } = req.body;
    
    if (!description || !type) {
      return res.status(400).json({ 
        message: "Description and type (experience, project, or summary) are required" 
      });
    }
    
    try {
      const improved = await improveDescription(description, type);
      res.json({ improved });
    } catch (error) {
      res.status(500).json({ message: "Error improving description" });
    }
  });
  
  // Score a resume using AI
  app.post(`${apiPrefix}/score-resume`, async (req: Request, res: Response) => {
    const { resume } = req.body;
    
    if (!resume) {
      return res.status(400).json({ message: "Resume data is required" });
    }
    
    try {
      const scoreResult = await scoreResumeWithAI(resume);
      res.json(scoreResult);
    } catch (error) {
      console.error("Error scoring resume:", error);
      res.status(500).json({ message: "Error scoring resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
