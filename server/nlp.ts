import natural from 'natural';
import { storage } from './storage';

// Tokenizer for breaking text into words
const tokenizer = new natural.WordTokenizer();

// TF-IDF for finding important words in job descriptions and resumes
const TfIdf = natural.TfIdf;

// Porter stemmer for word stemming
const stemmer = natural.PorterStemmer;

// Function to analyze job description and compare with resume
export async function analyzeJobDescription(jobDescription: string, resumeContent: any) {
  try {
    // Extract skills from job description
    const jobSkills = extractSkills(jobDescription);
    
    // Extract skills from resume
    const resumeSkills = extractSkillsFromResume(resumeContent);
    
    // Find missing skills
    const missingSkills = findMissingSkills(jobSkills, resumeSkills);
    
    // Calculate skills match percentage
    const matchPercentage = calculateSkillsMatch(jobSkills, resumeSkills);
    
    // Extract experience requirements
    const experienceRequirements = extractExperienceRequirements(jobDescription);
    
    // Compare with resume experience
    const experienceComparison = compareExperience(experienceRequirements, resumeContent);
    
    return {
      skillsMatch: {
        percentage: matchPercentage,
        matched: resumeSkills,
        missing: missingSkills
      },
      experienceMatch: experienceComparison
    };
  } catch (error) {
    console.error('Error analyzing job description:', error);
    throw new Error('Failed to analyze job description');
  }
}

// Function to generate summary based on resume content
export async function generateSummary(resumeContent: any) {
  try {
    // Extract key information from resume
    const { personalDetails, experience, skills } = resumeContent;
    
    // Find most recent job title and company
    const latestExperience = experience && experience.length > 0 
      ? experience.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]
      : null;
    
    const jobTitle = personalDetails?.jobTitle || (latestExperience?.title || 'professional');
    
    // Count years of experience
    const totalExperience = experience && experience.length > 0 
      ? calculateTotalExperience(experience) 
      : '';
    
    // Get top skills (first 3-5)
    const topSkills = skills && skills.length > 0 
      ? skills.slice(0, Math.min(5, skills.length)).join(', ') 
      : '';
    
    // Generate summary
    let summary = `${jobTitle} with ${totalExperience} of experience `;
    
    if (topSkills) {
      summary += `specializing in ${topSkills}. `;
    }
    
    if (latestExperience) {
      summary += `Most recently worked at ${latestExperience.company} where `;
      
      // Extract first achievement if available
      if (latestExperience.description) {
        const achievements = latestExperience.description.split('\n');
        if (achievements.length > 0) {
          const firstAchievement = achievements[0].replace(/^•\s*/, '');
          summary += `I ${firstAchievement.toLowerCase()}.`;
        } else {
          summary += `I gained valuable industry experience.`;
        }
      } else {
        summary += `I gained valuable industry experience.`;
      }
    }
    
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}

// Function to suggest skills based on job title and industry
export async function suggestSkills(jobTitle: string, industry?: string, currentSkills?: string[]) {
  try {
    // Get skill suggestions from storage
    const suggestions = await storage.getSkillSuggestions(jobTitle, industry);
    
    if (suggestions.length === 0) {
      // If no suggestions in storage, use hardcoded fallback
      return getFallbackSkillSuggestions(jobTitle, currentSkills);
    }
    
    // Combine skills from all matching suggestions
    let allSkills: string[] = [];
    for (const suggestion of suggestions) {
      allSkills = [...allSkills, ...suggestion.skills];
    }
    
    // Remove duplicates
    allSkills = [...new Set(allSkills)];
    
    // Remove skills the user already has
    if (currentSkills && currentSkills.length > 0) {
      allSkills = allSkills.filter(skill => 
        !currentSkills.some(current => current.toLowerCase() === skill.toLowerCase())
      );
    }
    
    // Return top 10 skills
    return allSkills.slice(0, 10);
  } catch (error) {
    console.error('Error suggesting skills:', error);
    throw new Error('Failed to suggest skills');
  }
}

// Function to improve description
export async function improveDescription(description: string, type: string) {
  try {
    // Check if description is empty
    if (!description.trim()) {
      return getDescriptionTemplate(type);
    }
    
    // Split description into bullets if it's not already
    const bullets = description.split('\n').map(line => line.trim());
    const improvedBullets = [];
    
    for (const bullet of bullets) {
      // Remove bullet point if it exists
      let cleanBullet = bullet.replace(/^[•\-*]\s*/, '');
      
      if (!cleanBullet) continue;
      
      // Add action verb if missing
      if (!startsWithActionVerb(cleanBullet)) {
        cleanBullet = addActionVerb(cleanBullet, type);
      }
      
      // Add quantification if missing
      if (!containsQuantification(cleanBullet)) {
        cleanBullet = suggestQuantification(cleanBullet, type);
      }
      
      improvedBullets.push(`• ${cleanBullet}`);
    }
    
    return improvedBullets.join('\n');
  } catch (error) {
    console.error('Error improving description:', error);
    throw new Error('Failed to improve description');
  }
}

// Helper functions
function extractSkills(text: string) {
  const skills = new Set<string>();
  const tfidf = new TfIdf();
  
  // Split text into sentences
  const sentences = text.split(/[.!?]+/);
  
  // Add each sentence as a document
  sentences.forEach(sentence => tfidf.addDocument(sentence));
  
  // Process each sentence to extract skills
  sentences.forEach((sentence, index) => {
    // Tokenize sentence
    const tokens = tokenizer.tokenize(sentence.toLowerCase());
    
    if (!tokens) return;
    
    // Find technical skills and technologies
    const technicalTerms = [
      'python', 'java', 'javascript', 'typescript', 'react', 'node', 'sql', 
      'database', 'aws', 'azure', 'docker', 'kubernetes', 'ml', 'ai', 
      'machine learning', 'data science', 'tensorflow', 'pytorch',
      'tableau', 'power bi', 'excel', 'statistical analysis'
    ];
    
    for (const term of technicalTerms) {
      if (sentence.toLowerCase().includes(term)) {
        skills.add(term);
      }
    }
    
    // Look for skill keywords (like "proficiency in X" or "experience with Y")
    const skillIndicators = ['skill', 'proficient', 'knowledge', 'experience', 'familiarity'];
    
    for (const indicator of skillIndicators) {
      if (sentence.toLowerCase().includes(indicator)) {
        // Find words after the indicator
        const matches = sentence.toLowerCase().match(new RegExp(`${indicator}\\s+(?:in|with|of)?\\s+([\\w\\s]+)`, 'i'));
        if (matches && matches[1]) {
          skills.add(matches[1].trim());
        }
      }
    }
  });
  
  return Array.from(skills);
}

function extractSkillsFromResume(resumeContent: any) {
  // Extract skills directly if available
  if (resumeContent.skills && Array.isArray(resumeContent.skills)) {
    return resumeContent.skills;
  }
  
  // Otherwise, try to extract from experience descriptions
  const skills = new Set<string>();
  
  if (resumeContent.experience && Array.isArray(resumeContent.experience)) {
    for (const exp of resumeContent.experience) {
      if (exp.description) {
        const extractedSkills = extractSkills(exp.description);
        extractedSkills.forEach(skill => skills.add(skill));
      }
    }
  }
  
  return Array.from(skills);
}

function findMissingSkills(jobSkills: string[], resumeSkills: string[]) {
  // Normalize skills by converting to lowercase and stemming
  const normalizedJobSkills = jobSkills.map(skill => 
    stemmer.stem(skill.toLowerCase())
  );
  
  const normalizedResumeSkills = resumeSkills.map(skill => 
    stemmer.stem(skill.toLowerCase())
  );
  
  // Find skills in job that aren't in resume
  return jobSkills.filter((skill, index) => 
    !normalizedResumeSkills.includes(normalizedJobSkills[index])
  );
}

function calculateSkillsMatch(jobSkills: string[], resumeSkills: string[]) {
  if (jobSkills.length === 0) return 100;
  
  // Normalize skills
  const normalizedJobSkills = jobSkills.map(skill => 
    stemmer.stem(skill.toLowerCase())
  );
  
  const normalizedResumeSkills = resumeSkills.map(skill => 
    stemmer.stem(skill.toLowerCase())
  );
  
  // Count matches
  let matches = 0;
  for (const jobSkill of normalizedJobSkills) {
    if (normalizedResumeSkills.some(resumeSkill => resumeSkill.includes(jobSkill) || jobSkill.includes(resumeSkill))) {
      matches++;
    }
  }
  
  // Calculate percentage
  return Math.round((matches / jobSkills.length) * 100);
}

function extractExperienceRequirements(jobDescription: string) {
  const experienceReqs = [];
  
  // Look for patterns like "X+ years of experience" or "X years experience"
  const experienceRegex = /(\d+)(?:\+)?\s+years?\s+(?:of\s+)?experience/gi;
  let match;
  
  while ((match = experienceRegex.exec(jobDescription)) !== null) {
    experienceReqs.push({
      years: parseInt(match[1]),
      context: jobDescription.substring(
        Math.max(0, match.index - 50),
        Math.min(jobDescription.length, match.index + match[0].length + 50)
      )
    });
  }
  
  return experienceReqs;
}

function compareExperience(requirements: any[], resumeContent: any) {
  const results = [];
  
  // Calculate total years of experience from resume
  let totalYears = 0;
  
  if (resumeContent.experience && Array.isArray(resumeContent.experience)) {
    totalYears = calculateTotalExperience(resumeContent.experience);
  }
  
  // Compare each requirement
  for (const req of requirements) {
    const result = {
      requirement: `${req.years}+ years of experience`,
      context: req.context,
      met: totalYears >= req.years,
      resumeYears: totalYears
    };
    
    results.push(result);
  }
  
  return results;
}

function calculateTotalExperience(experience: any[]) {
  let totalMonths = 0;
  
  for (const exp of experience) {
    // Skip if missing dates
    if (!exp.startDate) continue;
    
    const startDate = new Date(exp.startDate);
    
    // End date is either the end date or current date if still employed
    const endDate = exp.current ? new Date() : 
                    exp.endDate ? new Date(exp.endDate) : new Date();
    
    // Calculate months
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    
    totalMonths += Math.max(0, months);
  }
  
  // Convert to years
  return totalMonths >= 12 ? 
         `${Math.floor(totalMonths / 12)}+ years` : 
         `${totalMonths} months`;
}

// Fallback skill suggestions if storage has no matches
function getFallbackSkillSuggestions(jobTitle: string, currentSkills?: string[]) {
  // Default skills for common job titles
  const skillMap: Record<string, string[]> = {
    'data scientist': [
      'Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 
      'Data Visualization', 'Statistical Analysis', 'NLP', 'Deep Learning'
    ],
    'software engineer': [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 
      'Docker', 'Kubernetes', 'AWS', 'CI/CD'
    ],
    'product manager': [
      'Agile', 'Scrum', 'User Research', 'Roadmapping', 'Product Strategy',
      'A/B Testing', 'Analytics', 'Competitive Analysis', 'Wireframing', 'Prioritization'
    ]
  };
  
  // Find best match for job title
  const normalizedTitle = jobTitle.toLowerCase();
  
  for (const [title, skills] of Object.entries(skillMap)) {
    if (normalizedTitle.includes(title)) {
      // Filter out skills the user already has
      if (currentSkills && currentSkills.length > 0) {
        return skills.filter(skill => 
          !currentSkills.some(current => current.toLowerCase() === skill.toLowerCase())
        );
      }
      return skills;
    }
  }
  
  // Generic skills if no match found
  return [
    'Communication', 'Problem Solving', 'Teamwork', 'Critical Thinking',
    'Time Management', 'Adaptability', 'Leadership', 'Project Management'
  ];
}

// Helper for improving descriptions
function startsWithActionVerb(text: string) {
  const actionVerbs = [
    'achieved', 'created', 'developed', 'implemented', 'increased', 'reduced',
    'managed', 'led', 'designed', 'built', 'improved', 'optimized', 'analyzed',
    'collaborated', 'delivered', 'established', 'generated', 'produced', 'trained'
  ];
  
  const firstWord = text.trim().split(' ')[0].toLowerCase();
  
  return actionVerbs.includes(firstWord);
}

function addActionVerb(text: string, type: string) {
  // Different verbs for different section types
  const verbsByType: Record<string, string[]> = {
    'experience': [
      'Developed', 'Implemented', 'Created', 'Led', 'Managed', 'Delivered',
      'Improved', 'Increased', 'Reduced', 'Achieved'
    ],
    'project': [
      'Built', 'Designed', 'Created', 'Developed', 'Implemented', 'Engineered',
      'Architected', 'Collaborated on', 'Launched', 'Optimized'
    ],
    'summary': [
      'Skilled in', 'Specialized in', 'Experienced in', 'Focused on',
      'Adept at', 'Proficient in', 'Knowledgeable about', 'Passionate about'
    ]
  };
  
  const verbs = verbsByType[type] || verbsByType.experience;
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  
  return `${randomVerb} ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

function containsQuantification(text: string) {
  // Check for numbers and percentages
  return /\d+%|\d+x|\$\d+|\d+ [a-z]+/.test(text);
}

function suggestQuantification(text: string, type: string) {
  // If it already has quantification, return as is
  if (containsQuantification(text)) return text;
  
  // For experience, add quantification at the end
  if (type === 'experience') {
    // Generate random but reasonable values
    const metrics = [
      'resulting in a 15% increase in efficiency',
      'leading to 20% cost reduction',
      'improving performance by 25%',
      'growing user engagement by 30%',
      'saving the team 10+ hours per week'
    ];
    
    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
    
    return `${text}, ${randomMetric}`;
  }
  
  // For projects, add specific details
  if (type === 'project') {
    const details = [
      'with over 500 users',
      'handling 1000+ daily transactions',
      'reducing load time by 40%',
      'increasing conversion rate by 25%',
      'processing 10GB of data daily'
    ];
    
    const randomDetail = details[Math.floor(Math.random() * details.length)];
    
    return `${text} ${randomDetail}`;
  }
  
  return text;
}

function getDescriptionTemplate(type: string) {
  if (type === 'experience') {
    return '• Led a team of X members to implement Y solution\n• Developed and maintained Z, resulting in A% improvement\n• Collaborated with cross-functional teams to deliver B on time and under budget';
  }
  
  if (type === 'project') {
    return '• Built a web application using X technology that solved Y problem\n• Implemented Z features, resulting in positive user feedback\n• Collaborated with A team members to deliver the project within B timeline';
  }
  
  if (type === 'summary') {
    return 'Professional with X years of experience in Y industry. Skilled in Z tools and methodologies with a proven track record of delivering high-quality results. Passionate about solving complex problems and driving innovation.';
  }
  
  return 'Add a detailed description here.';
}
