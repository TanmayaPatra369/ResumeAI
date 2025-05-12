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
        title: 'Senior Data Scientist',
        company: 'Tech Innovations India Pvt. Ltd.',
        location: 'Bengaluru, Karnataka',
        startDate: '2019-06',
        endDate: '2023-01',
        current: false,
        description: '• **Led a team of 5 analysts** to develop ML models that increased customer retention by 32%\n• **Implemented** machine learning pipelines using Python, TensorFlow and scikit-learn for predictive analytics\n• **Collaborated** with cross-functional teams across Bengaluru and Hyderabad offices to optimize data infrastructure\n• **Reduced** processing time by 40% through optimization of ETL pipelines'
      },
      {
        id: uuidv4(),
        title: 'Data Analyst',
        company: 'Infosys',
        location: 'Pune, Maharashtra',
        startDate: '2017-08',
        endDate: '2019-05',
        current: false,
        description: '• **Analyzed** customer data for a major telecom client and identified trends that increased ARPU by 18%\n• **Built** complex SQL queries to extract and transform data from multiple enterprise sources\n• **Created** weekly dashboards for executive leadership using Power BI and Tableau\n• **Mentored** 3 junior analysts, conducting regular knowledge-sharing sessions'
      }
    ];
    
    // Add example education
    defaultResume.education = [
      {
        id: uuidv4(),
        degree: 'M.Tech in Computer Science (Data Science Specialization)',
        institution: 'Indian Institute of Technology, Bombay',
        location: 'Mumbai, Maharashtra',
        startDate: '2015-07',
        endDate: '2017-05',
        current: false,
        description: 'Thesis: "Deep Learning Applications for Indian Language Processing"\nCGPA: 9.2/10, Merit Scholarship Recipient\nCourses: Advanced Machine Learning, Big Data Analytics, Cloud Computing'
      },
      {
        id: uuidv4(),
        degree: 'B.Tech in Computer Science and Engineering',
        institution: 'Vellore Institute of Technology',
        location: 'Vellore, Tamil Nadu',
        startDate: '2011-08',
        endDate: '2015-05',
        current: false,
        description: 'CGPA: 8.7/10\nTechnical Secretary of Computer Science Association\nWinner, National Coding Hackathon 2014'
      }
    ];
    
    // Add example skills
    defaultResume.skills = [
      'Python', 'Machine Learning', 'SQL', 'PySpark', 'TensorFlow', 'AWS', 'Power BI', 'Java', 'Natural Language Processing', 'Computer Vision'
    ];
    
    // Add example project
    defaultResume.projects = [
      {
        id: uuidv4(),
        name: 'Multi-lingual Chatbot for Banking',
        link: 'https://github.com/arjunpatel/nlp-banking-bot',
        description: '• **Developed** a customer service chatbot supporting Hindi, English, and Tamil for a major Indian private bank\n• **Implemented** NLP techniques to understand and process Indian language queries with 92% accuracy\n• **Integrated** with bank\'s core banking system and reduced customer service load by 35%\n• **Technologies used**: Python, TensorFlow, NLTK, FastAPI, AWS, Docker'
      },
      {
        id: uuidv4(),
        name: 'Supply Chain Optimization for E-commerce',
        link: 'https://github.com/arjunpatel/supply-chain-ml',
        description: '• **Built** an ML model to optimize inventory and logistics for an e-commerce platform operating in 25+ Indian cities\n• **Reduced** delivery time by 28% and warehouse costs by 15% through intelligent demand forecasting\n• **Presented** findings at National Data Science Conference 2022 in Hyderabad\n• **Technologies used**: Python, scikit-learn, Pandas, PostgreSQL, Tableau'
      }
    ];
    
    // Add example personal details
    defaultResume.personalDetails = {
      name: 'Arjun Patel',
      jobTitle: 'Senior Data Scientist',
      summary: 'Results-driven Data Scientist with 6+ years of experience in machine learning, statistical analysis, and data engineering in the Indian tech industry. Specialized in developing AI solutions for financial services and e-commerce sectors with expertise in multilingual NLP for Indian languages. Proven track record of delivering data-driven solutions that improve operational efficiency and business outcomes.',
      email: 'arjun.patel@email.com',
      phone: '+91 98765 43210',
      linkedin: 'linkedin.com/in/arjunpatel',
      location: 'Bengaluru, Karnataka'
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
