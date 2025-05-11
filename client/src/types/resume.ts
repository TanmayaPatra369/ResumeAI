// Define all types related to the resume builder

export type Template = 'professional' | 'creative' | 'academic';

export interface PersonalDetails {
  name: string;
  jobTitle: string;
  summary: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  website?: string;
  location: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface SkillMatch {
  percentage: number;
  matched: string[];
  missing: string[];
}

export interface ExperienceMatch {
  requirement: string;
  context: string;
  met: boolean;
  resumeYears: string;
}

export interface JobAnalysis {
  skillsMatch: SkillMatch;
  experienceMatch: ExperienceMatch[];
}

export interface ResumeScore {
  score: number;
  improvements: string[];
  grammarIssues: string[];
}

export interface Resume {
  id?: number;
  userId?: number;
  title: string;
  personalDetails: PersonalDetails;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  template: Template;
  score?: ResumeScore;
}

export interface JobDescriptionData {
  jobTitle: string;
  company: string;
  description: string;
  analysis?: JobAnalysis;
}
