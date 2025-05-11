import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Resume, 
  PersonalDetails, 
  Experience, 
  Education, 
  Project, 
  Template, 
  JobDescriptionData 
} from '../types/resume';

interface ResumeState {
  currentResume: Resume;
  jobDescription: JobDescriptionData | null;
  isAnalyzing: boolean;
  isGeneratingSummary: boolean;
  showJobDescriptionModal: boolean;
  initialized: boolean;
  
  // Resume actions
  setTemplate: (template: Template) => void;
  setPersonalDetails: (details: Partial<PersonalDetails>) => void;
  
  // Experience actions
  addExperience: () => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Education actions
  addEducation: () => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Skills actions
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  
  // Projects actions
  addProject: () => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  // Job description actions
  setJobDescription: (data: JobDescriptionData) => void;
  clearJobDescription: () => void;
  setJobAnalysis: (analysis: any) => void;
  
  // UI actions
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setIsGeneratingSummary: (isGenerating: boolean) => void;
  toggleJobDescriptionModal: () => void;
  
  // Full resume actions
  resetResume: () => void;
  loadResume: (resume: Resume) => void;
  
  // Initialize with defaults
  initialize: () => void;
}

// Create default empty resume
const createDefaultResume = (): Resume => ({
  title: 'My Resume',
  personalDetails: {
    name: '',
    jobTitle: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'professional',
});

// Create empty experience item
const createEmptyExperience = (): Experience => ({
  id: uuidv4(),
  title: '',
  company: '',
  startDate: '',
  current: false,
  description: '',
});

// Create empty education item
const createEmptyEducation = (): Education => ({
  id: uuidv4(),
  degree: '',
  institution: '',
  startDate: '',
  current: false,
  description: '',
});

// Create empty project item
const createEmptyProject = (): Project => ({
  id: uuidv4(),
  name: '',
  description: '',
});

// Create the store
export const useResumeStore = create<ResumeState>((set) => ({
  currentResume: createDefaultResume(),
  jobDescription: null,
  isAnalyzing: false,
  isGeneratingSummary: false,
  showJobDescriptionModal: false,
  initialized: false,
  
  // Initialize with defaults and example content
  initialize: () => set((state) => {
    if (state.initialized) return state;
    
    const defaultResume = createDefaultResume();
    
    // Add example experience
    defaultResume.experience = [
      {
        id: uuidv4(),
        title: 'Data Scientist',
        company: 'TechCorp Inc.',
        location: 'Seattle, WA',
        startDate: '2019-06',
        endDate: '2023-01',
        current: false,
        description: '• Led a team of 3 data analysts to develop predictive models that increased user retention by 27%\n• Implemented machine learning pipelines using Python, TensorFlow and scikit-learn\n• Created interactive dashboards with Tableau that enabled stakeholders to make data-driven decisions'
      },
      {
        id: uuidv4(),
        title: 'Data Analyst',
        company: 'DataFlow Analytics',
        location: 'Portland, OR',
        startDate: '2017-08',
        endDate: '2019-05',
        current: false,
        description: '• Analyzed customer data and identified trends that increased sales by 15%\n• Built SQL queries to extract and transform data from multiple sources\n• Created weekly reports for executive leadership team'
      }
    ];
    
    // Add example education
    defaultResume.education = [
      {
        id: uuidv4(),
        degree: 'MS in Data Science',
        institution: 'University of Washington',
        location: 'Seattle, WA',
        startDate: '2015-09',
        endDate: '2017-06',
        current: false,
        description: 'Thesis: "Predictive Modeling for Customer Behavior Analysis in E-commerce Platforms"\nGPA: 3.85/4.0, Dean\'s List'
      }
    ];
    
    // Add example skills
    defaultResume.skills = [
      'Python', 'Machine Learning', 'SQL', 'Pandas', 'scikit-learn', 'R', 'Tableau', 'Statistical Analysis'
    ];
    
    // Add example project
    defaultResume.projects = [
      {
        id: uuidv4(),
        name: 'Customer Churn Prediction Model',
        link: 'https://github.com/alexjohnson/churn-prediction',
        description: 'Developed a machine learning model to predict customer churn for a telecom company. Achieved 87% accuracy using ensemble methods and created an interactive dashboard for visualizing results.'
      }
    ];
    
    // Add example personal details
    defaultResume.personalDetails = {
      name: 'Alex Johnson',
      jobTitle: 'Data Scientist',
      summary: 'Data scientist with 4+ years of experience in machine learning, statistical analysis, and data visualization. Skilled in Python, R, and SQL with a proven track record of delivering insights that drive business decisions.',
      email: 'alex.johnson@email.com',
      phone: '(555) 123-4567',
      linkedin: 'linkedin.com/in/alexjohnson',
      location: 'Seattle, WA'
    };
    
    return {
      currentResume: defaultResume,
      initialized: true
    };
  }),
  
  // Resume actions
  setTemplate: (template) => set((state) => ({
    currentResume: { ...state.currentResume, template }
  })),
  
  setPersonalDetails: (details) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      personalDetails: {
        ...state.currentResume.personalDetails,
        ...details
      }
    }
  })),
  
  // Experience actions
  addExperience: () => set((state) => ({
    currentResume: {
      ...state.currentResume,
      experience: [...state.currentResume.experience, createEmptyExperience()]
    }
  })),
  
  updateExperience: (id, updatedExperience) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      experience: state.currentResume.experience.map(exp => 
        exp.id === id ? { ...exp, ...updatedExperience } : exp
      )
    }
  })),
  
  removeExperience: (id) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      experience: state.currentResume.experience.filter(exp => exp.id !== id)
    }
  })),
  
  // Education actions
  addEducation: () => set((state) => ({
    currentResume: {
      ...state.currentResume,
      education: [...state.currentResume.education, createEmptyEducation()]
    }
  })),
  
  updateEducation: (id, updatedEducation) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      education: state.currentResume.education.map(edu => 
        edu.id === id ? { ...edu, ...updatedEducation } : edu
      )
    }
  })),
  
  removeEducation: (id) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      education: state.currentResume.education.filter(edu => edu.id !== id)
    }
  })),
  
  // Skills actions
  addSkill: (skill) => set((state) => {
    // Don't add duplicate skills
    if (state.currentResume.skills.includes(skill)) {
      return state;
    }
    
    return {
      currentResume: {
        ...state.currentResume,
        skills: [...state.currentResume.skills, skill]
      }
    };
  }),
  
  removeSkill: (skill) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      skills: state.currentResume.skills.filter(s => s !== skill)
    }
  })),
  
  // Projects actions
  addProject: () => set((state) => ({
    currentResume: {
      ...state.currentResume,
      projects: [...state.currentResume.projects, createEmptyProject()]
    }
  })),
  
  updateProject: (id, updatedProject) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      projects: state.currentResume.projects.map(proj => 
        proj.id === id ? { ...proj, ...updatedProject } : proj
      )
    }
  })),
  
  removeProject: (id) => set((state) => ({
    currentResume: {
      ...state.currentResume,
      projects: state.currentResume.projects.filter(proj => proj.id !== id)
    }
  })),
  
  // Job description actions
  setJobDescription: (data) => set(() => ({
    jobDescription: data
  })),
  
  clearJobDescription: () => set(() => ({
    jobDescription: null
  })),
  
  setJobAnalysis: (analysis) => set((state) => {
    if (!state.jobDescription) return state;
    
    return {
      jobDescription: {
        ...state.jobDescription,
        analysis
      }
    };
  }),
  
  // UI actions
  setIsAnalyzing: (isAnalyzing) => set(() => ({
    isAnalyzing
  })),
  
  setIsGeneratingSummary: (isGeneratingSummary) => set(() => ({
    isGeneratingSummary
  })),
  
  toggleJobDescriptionModal: () => set((state) => ({
    showJobDescriptionModal: !state.showJobDescriptionModal
  })),
  
  // Full resume actions
  resetResume: () => set(() => ({
    currentResume: createDefaultResume()
  })),
  
  loadResume: (resume) => set(() => ({
    currentResume: resume
  }))
}));
