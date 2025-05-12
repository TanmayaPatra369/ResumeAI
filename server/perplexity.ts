/**
 * Perplexity API integration for resume builder AI features
 */

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Makes a request to the Perplexity API
 */
async function callPerplexityAPI(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.2
): Promise<string> {
  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: temperature,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 1,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Perplexity API error: ${response.status} ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('Error calling Perplexity API:', error);
    throw new Error(`Failed to get response from Perplexity: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Analyzes a job description against a resume to provide matching insights
 */
export async function analyzeJobWithPerplexity(jobDescription: string, resume: any): Promise<any> {
  console.log('Analyzing job with Perplexity...');
  
  const systemPrompt = `You are an expert career consultant specialized in resume analysis. 
    Analyze the job description and the resume data provided to create a detailed job match analysis. 
    Return your analysis as a JSON object with the following format:
    {
      "skillsMatch": {
        "percentage": number,
        "matched": string[],
        "missing": string[]
      },
      "experienceMatch": [
        {
          "requirement": string,
          "context": string,
          "met": boolean,
          "resumeYears": string
        }
      ]
    }`;

  const userPrompt = `
    Job Description: ${jobDescription}
    
    Resume: ${JSON.stringify(resume, null, 2)}
    
    Analyze how well this resume matches the job description. Identify matching and missing skills, 
    and determine if the experience requirements are met. Return only a properly formatted JSON object.`;

  try {
    const response = await callPerplexityAPI(systemPrompt, userPrompt, 0.2);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error analyzing job with Perplexity:', error);
    throw new Error('Failed to analyze job with Perplexity');
  }
}

/**
 * Generates a professional summary based on resume content and optional job description
 */
export async function generateSummaryWithPerplexity(resume: any, jobDescription?: string): Promise<string> {
  console.log('Generating summary with Perplexity...');
  
  const systemPrompt = `You are an expert resume writer. Create a concise, professional summary paragraph 
    for a resume based on the person's experience, education, and skills. 
    If a job description is provided, tailor the summary to highlight relevant qualifications for that role.
    The summary should be 2-4 sentences, professional in tone, and highlight the candidate's most impressive achievements.`;

  const userPrompt = `
    Resume details:
    Name: ${resume.personalDetails.name}
    Current title: ${resume.personalDetails.jobTitle}
    Experience: ${JSON.stringify(resume.experience, null, 2)}
    Education: ${JSON.stringify(resume.education, null, 2)}
    Skills: ${resume.skills.join(', ')}
    
    ${jobDescription ? `Job Description: ${jobDescription}` : ''}
    
    Write a concise, professional summary paragraph for this resume.`;

  try {
    return await callPerplexityAPI(systemPrompt, userPrompt, 0.3);
  } catch (error) {
    console.error('Error generating summary with Perplexity:', error);
    throw new Error('Failed to generate summary with Perplexity');
  }
}

/**
 * Suggests relevant skills based on job title, industry, and current skills
 */
export async function suggestSkillsWithPerplexity(
  jobTitle: string, 
  industry?: string, 
  currentSkills?: string[]
): Promise<string[]> {
  console.log('Suggesting skills with Perplexity...');
  
  const systemPrompt = `You are an expert career advisor specializing in skill recommendations for different professions.
    Based on a job title, industry, and possibly existing skills, recommend additional relevant skills.
    Return a plain JSON array of strings representing the suggested skills, with no markdown formatting, additional code blocks, or explanations.
    Example format: ["Skill 1", "Skill 2", "Skill 3"]`;

  const userPrompt = `
    Job Title: ${jobTitle}
    ${industry ? `Industry: ${industry}` : ''}
    ${currentSkills && currentSkills.length > 0 ? `Current Skills: ${currentSkills.join(', ')}` : ''}
    
    Please suggest a comprehensive list of 10-15 relevant skills for this job.
    Return only a plain JSON array of strings with no markdown or code block formatting.`;

  try {
    let response = await callPerplexityAPI(systemPrompt, userPrompt, 0.2);
    
    // Clean up the response
    // Remove markdown code blocks
    response = response.replace(/```json\n|\n```|```/g, '');
    // Remove any explanatory text before or after the JSON array
    response = response.trim();
    
    // If it starts with a bracket, assume it's JSON
    if (response.startsWith('[') && response.endsWith(']')) {
      return JSON.parse(response);
    } 
    
    // Try to find JSON array in the response by looking for the first [ and last ]
    const startBracket = response.indexOf('[');
    const endBracket = response.lastIndexOf(']');
    if (startBracket !== -1 && endBracket !== -1 && startBracket < endBracket) {
      try {
        const jsonString = response.substring(startBracket, endBracket + 1);
        return JSON.parse(jsonString);
      } catch (e) {
        console.error('Error parsing JSON array:', e);
      }
    }
    
    // If we can't parse it as JSON, extract skills manually
    const fallbackSkills = response
      .split(/,|\n/)
      .map(s => s.trim())
      .filter(s => s && !s.includes('[') && !s.includes(']') && !s.includes('{') && !s.includes('}'));
    
    return fallbackSkills.length > 0 ? fallbackSkills : ["JavaScript", "React", "Node.js", "TypeScript", "REST APIs"];
  } catch (error) {
    console.error('Error suggesting skills with Perplexity:', error);
    throw new Error('Failed to suggest skills with Perplexity');
  }
}

/**
 * Improves description text for experience, projects or summaries
 */
export async function improveDescriptionWithPerplexity(description: string, type: string): Promise<string> {
  console.log(`Improving ${type} description with Perplexity...`);
  
  const systemPrompt = `You are an expert resume writer. Your task is to improve the given ${type} description
    to make it more professional, impactful, and achievement-oriented.
    Use action verbs, quantify achievements when possible, and focus on results.
    Keep the content truthful to the original information while enhancing the presentation.`;

  const userPrompt = `
    Original ${type} description: ${description}
    
    Please enhance this description to make it more professional and impactful. 
    Use strong action verbs and highlight measurable achievements and results.
    The improved description should be approximately the same length as the original.`;

  try {
    return await callPerplexityAPI(systemPrompt, userPrompt, 0.4);
  } catch (error) {
    console.error(`Error improving ${type} description with Perplexity:`, error);
    throw new Error(`Failed to improve ${type} description with Perplexity`);
  }
}

/**
 * Analyzes a resume for quality and provides a score with improvement suggestions
 */
export async function scoreResumeWithPerplexity(resume: any): Promise<any> {
  console.log('Scoring resume with Perplexity...');
  
  const systemPrompt = `You are an expert resume reviewer with years of experience in HR and recruitment.
    Evaluate the provided resume and provide a comprehensive assessment of its quality.
    Return your analysis as a JSON object with the following format:
    {
      "score": number,
      "improvements": string[],
      "grammarIssues": string[]
    }
    The score should be between 0-100, with 100 being a perfect resume.
    Do not include any markdown formatting, code blocks, or explanatory text.`;

  const userPrompt = `
    Resume: ${JSON.stringify(resume, null, 2)}
    
    Please evaluate this resume and provide:
    1. An overall score (0-100)
    2. A list of specific improvements that could strengthen the resume
    3. Any grammar or language issues in the text
    
    Return your analysis as a properly formatted JSON object without any markdown, code blocks, or additional text.`;

  try {
    let response = await callPerplexityAPI(systemPrompt, userPrompt, 0.2);
    
    // Clean up the response
    // Remove markdown code blocks
    response = response.replace(/```json\n|\n```|```/g, '');
    response = response.trim();
    
    // If it starts with a curly brace, assume it's JSON
    if (response.startsWith('{') && response.endsWith('}')) {
      return JSON.parse(response);
    }
    
    // Try to find JSON object in the response by looking for the first { and last }
    const startBrace = response.indexOf('{');
    const endBrace = response.lastIndexOf('}');
    if (startBrace !== -1 && endBrace !== -1 && startBrace < endBrace) {
      try {
        const jsonString = response.substring(startBrace, endBrace + 1);
        return JSON.parse(jsonString);
      } catch (e) {
        console.error('Error parsing JSON object:', e);
      }
    }
    
    // If we can't parse it as JSON, return a fallback response
    return {
      score: 65,
      improvements: [
        "Add more quantifiable achievements to your experience descriptions",
        "Include more skills that are relevant to your target industry",
        "Make sure your job titles are clear and aligned with industry standards"
      ],
      grammarIssues: [],
      fallback: true
    };
  } catch (error) {
    console.error('Error scoring resume with Perplexity:', error);
    throw new Error('Failed to score resume with Perplexity');
  }
}