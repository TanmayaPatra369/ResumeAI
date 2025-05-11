import { 
  User, InsertUser, 
  Resume, InsertResume, 
  JobAnalysis, InsertJobAnalysis,
  SkillSuggestion, InsertSkillSuggestion
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Resume operations
  getResumes(userId: number): Promise<Resume[]>;
  getResume(id: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: Partial<Resume>): Promise<Resume | undefined>;
  deleteResume(id: number): Promise<boolean>;

  // Job Analysis operations
  getJobAnalyses(userId: number): Promise<JobAnalysis[]>;
  getJobAnalysis(id: number): Promise<JobAnalysis | undefined>;
  createJobAnalysis(analysis: InsertJobAnalysis): Promise<JobAnalysis>;
  deleteJobAnalysis(id: number): Promise<boolean>;

  // Skill Suggestions operations
  getSkillSuggestions(jobTitle: string, industry?: string): Promise<SkillSuggestion[]>;
  createSkillSuggestion(suggestion: InsertSkillSuggestion): Promise<SkillSuggestion>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private jobAnalyses: Map<number, JobAnalysis>;
  private skillSuggestions: Map<number, SkillSuggestion>;
  
  private userId: number;
  private resumeId: number;
  private jobAnalysisId: number;
  private skillSuggestionId: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.jobAnalyses = new Map();
    this.skillSuggestions = new Map();
    
    this.userId = 1;
    this.resumeId = 1;
    this.jobAnalysisId = 1;
    this.skillSuggestionId = 1;

    // Initialize with some skill suggestions
    this.initializeSkillSuggestions();
  }

  private initializeSkillSuggestions() {
    const dataScienceSkills = {
      id: this.skillSuggestionId++,
      industry: "Technology",
      jobTitle: "Data Scientist",
      skills: [
        "Python", "R", "SQL", "Machine Learning", "TensorFlow", "PyTorch", 
        "Data Visualization", "Statistical Analysis", "NLP", "Deep Learning",
        "Pandas", "NumPy", "scikit-learn", "Tableau", "Power BI", "Big Data",
        "Data Mining", "A/B Testing", "Data Modeling", "ETL"
      ]
    };

    const softwareEngineerSkills = {
      id: this.skillSuggestionId++,
      industry: "Technology",
      jobTitle: "Software Engineer",
      skills: [
        "JavaScript", "Python", "Java", "C++", "TypeScript", "React", 
        "Node.js", "Docker", "Kubernetes", "AWS", "CI/CD", "Git",
        "Databases", "SQL", "NoSQL", "RESTful APIs", "Microservices",
        "Testing", "Agile", "System Design"
      ]
    };

    this.skillSuggestions.set(dataScienceSkills.id, dataScienceSkills);
    this.skillSuggestions.set(softwareEngineerSkills.id, softwareEngineerSkills);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resume operations
  async getResumes(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }

  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.resumeId++;
    const now = new Date();
    const resume: Resume = { 
      ...insertResume, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, updates: Partial<Resume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;

    const updatedResume: Resume = { 
      ...resume, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async deleteResume(id: number): Promise<boolean> {
    return this.resumes.delete(id);
  }

  // Job Analysis operations
  async getJobAnalyses(userId: number): Promise<JobAnalysis[]> {
    return Array.from(this.jobAnalyses.values()).filter(
      (analysis) => analysis.userId === userId
    );
  }

  async getJobAnalysis(id: number): Promise<JobAnalysis | undefined> {
    return this.jobAnalyses.get(id);
  }

  async createJobAnalysis(insertAnalysis: InsertJobAnalysis): Promise<JobAnalysis> {
    const id = this.jobAnalysisId++;
    const now = new Date();
    const analysis: JobAnalysis = { 
      ...insertAnalysis, 
      id, 
      createdAt: now
    };
    this.jobAnalyses.set(id, analysis);
    return analysis;
  }

  async deleteJobAnalysis(id: number): Promise<boolean> {
    return this.jobAnalyses.delete(id);
  }

  // Skill Suggestions operations
  async getSkillSuggestions(jobTitle: string, industry?: string): Promise<SkillSuggestion[]> {
    const suggestions = Array.from(this.skillSuggestions.values());
    const filteredByTitle = suggestions.filter(
      suggestion => suggestion.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())
    );

    if (industry) {
      return filteredByTitle.filter(
        suggestion => suggestion.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }

    return filteredByTitle;
  }

  async createSkillSuggestion(insertSuggestion: InsertSkillSuggestion): Promise<SkillSuggestion> {
    const id = this.skillSuggestionId++;
    const suggestion: SkillSuggestion = { ...insertSuggestion, id };
    this.skillSuggestions.set(id, suggestion);
    return suggestion;
  }
}

export const storage = new MemStorage();
