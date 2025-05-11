import { apiRequest } from './queryClient';
import type { Resume, JobAnalysis } from '../types/resume';

// Function to analyze job description against a resume
export const analyzeJobDescription = async (
  jobDescription: string,
  resume: Resume
): Promise<JobAnalysis> => {
  try {
    const res = await apiRequest('POST', '/api/analyze-job', {
      jobDescription,
      resumeContent: resume
    });
    
    return await res.json();
  } catch (error) {
    console.error('Error analyzing job description:', error);
    throw new Error('Failed to analyze job description. Please try again.');
  }
};

// Function to generate a summary from resume content
export const generateSummary = async (resume: Resume): Promise<string> => {
  try {
    const res = await apiRequest('POST', '/api/generate-summary', {
      resumeContent: resume
    });
    
    const data = await res.json();
    return data.summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
};

// Function to suggest skills based on job title and industry
export const suggestSkills = async (
  jobTitle: string,
  industry?: string,
  currentSkills?: string[]
): Promise<string[]> => {
  try {
    const res = await apiRequest('POST', '/api/suggest-skills', {
      jobTitle,
      industry,
      currentSkills
    });
    
    const data = await res.json();
    return data.skills;
  } catch (error) {
    console.error('Error suggesting skills:', error);
    throw new Error('Failed to suggest skills. Please try again.');
  }
};

// Function to improve description (experience, project, summary)
export const improveDescription = async (
  description: string,
  type: 'experience' | 'project' | 'summary'
): Promise<string> => {
  try {
    const res = await apiRequest('POST', '/api/improve-description', {
      description,
      type
    });
    
    const data = await res.json();
    return data.improved;
  } catch (error) {
    console.error('Error improving description:', error);
    throw new Error('Failed to improve description. Please try again.');
  }
};

// Function to analyze a resume and generate improvement suggestions
export const analyzeResume = async (resume: Resume) => {
  // This is a client-side analysis since we don't have a full ML model
  // In a real application, this would call a backend API with proper models
  
  const score = { score: 0, improvements: [], grammarIssues: [] };
  
  // Check personal details
  if (!resume.personalDetails.summary || resume.personalDetails.summary.length < 50) {
    score.improvements.push('Add a more detailed professional summary (aim for 75-150 words)');
    score.score -= 5;
  }
  
  // Check experience descriptions
  const experienceIssues = resume.experience.filter(exp => 
    !exp.description || exp.description.split('\n').length < 3
  );
  
  if (experienceIssues.length > 0) {
    score.improvements.push('Add more bullet points to your work experience (aim for 3-5 per job)');
    score.score -= experienceIssues.length * 3;
  }
  
  // Check for quantifiable achievements
  const hasQuantifiableAchievements = resume.experience.some(exp => 
    exp.description && /\d+%|\d+x|\$\d+|\d+ [a-z]+/.test(exp.description)
  );
  
  if (!hasQuantifiableAchievements) {
    score.improvements.push('Add quantifiable achievements to your experience (e.g., "increased sales by 20%")');
    score.score -= 10;
  }
  
  // Check skills count
  if (!resume.skills.length || resume.skills.length < 5) {
    score.improvements.push('Add more skills relevant to your field (aim for 8-12 key skills)');
    score.score -= 8;
  }
  
  // Check for projects
  if (!resume.projects.length) {
    score.improvements.push('Add at least one project that showcases your skills');
    score.score -= 7;
  }
  
  // Calculate final score (start with 100 and subtract penalties)
  score.score = Math.max(0, 100 - Math.abs(score.score));
  
  return score;
};
