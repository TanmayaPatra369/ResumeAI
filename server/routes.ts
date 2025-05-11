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
    } catch (error: any) {
      console.error("Error suggesting skills:", error);
      
      // Default fallback skills by category
      const fallbackSkills = {
        "Data Science": ["Python", "R", "TensorFlow", "SQL", "Tableau", "Machine Learning"],
        "Software Engineering": ["JavaScript", "React", "Node.js", "Java", "Git", "CI/CD"],
        "Marketing": ["SEO", "Content Marketing", "Social Media", "Analytics", "Copywriting"],
        "Finance": ["Financial Analysis", "Excel", "Financial Modeling", "Accounting", "Forecasting"],
        "Design": ["UI/UX", "Adobe Creative Suite", "Figma", "Typography", "Wireframing"]
      };
      
      // Select an appropriate category or default to Software Engineering
      const category = jobTitle.toLowerCase().includes("data") ? "Data Science" :
                      jobTitle.toLowerCase().includes("engineer") ? "Software Engineering" :
                      jobTitle.toLowerCase().includes("market") ? "Marketing" :
                      jobTitle.toLowerCase().includes("financ") ? "Finance" :
                      jobTitle.toLowerCase().includes("design") ? "Design" :
                      "Software Engineering";
      
      // Return fallback skills and note that they're fallback
      res.status(200).json({ 
        skills: fallbackSkills[category],
        fallback: true,
        message: "Using basic skill suggestions due to API limitations."
      });
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
    } catch (error: any) {
      console.error("Error improving description:", error);
      
      // Basic improvements for different types of content
      const prefixes = {
        'experience': '• Led a team of developers to successfully deliver the project on time and within budget.\n• Improved system performance by 30% through code optimization.\n• Collaborated with cross-functional teams to implement new features.',
        'project': '• Built a responsive web application using React and Node.js.\n• Implemented user authentication and authorization features.\n• Designed and optimized database schema for improved performance.',
        'summary': 'Dedicated professional with experience in developing scalable applications. Skilled in problem-solving and collaborating with cross-functional teams to deliver high-quality solutions.'
      };
      
      // Return basic improvement with the original text if type doesn't match
      const fallbackImprovement = prefixes[type] || description;
      
      res.status(200).json({ 
        improved: fallbackImprovement,
        fallback: true,
        message: "Using basic content enhancement due to API limitations."
      });
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
    } catch (error: any) {
      console.error("Error scoring resume:", error);
      
      // Check for various types of OpenAI API errors
      const errorMessage = error?.message || "";
      const isQuotaError = errorMessage.includes("quota") || 
                          errorMessage.includes("rate limit") || 
                          (error?.code === "insufficient_quota");
      
      if (isQuotaError) {
        // Return a clear error that the client can handle
        return res.status(429).json({ 
          score: 0,
          improvements: [
            "Add more details to your work experiences",
            "Quantify your achievements with numbers", 
            "Include relevant skills for your industry"
          ],
          grammarIssues: [],
          fallback: true,
          error: "API quota exceeded",
          message: "Using basic analysis mode due to API limitations."
        });
      }
      
      // Return usable fallback results for any error
      res.status(200).json({
        score: 0,
        improvements: [
          "Add more details to your work experiences",
          "Quantify your achievements with numbers", 
          "Include relevant skills for your industry"
        ],
        grammarIssues: [],
        fallback: true
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
