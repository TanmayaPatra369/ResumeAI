import OpenAI from "openai";

// Initialize the OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyzes a job description against a resume to provide matching insights
 */
export async function analyzeJobWithAI(jobDescription: string, resume: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert career advisor and resume analyst. Analyze the job description and resume to identify:
          1. Key skills mentioned in the job description and which ones the resume has or is missing
          2. Experience requirements in the job and how the resume's experience matches
          3. Calculate a percentage match of skills and experience
          4. Provide specific actionable advice on improving the resume for this job
          
          Provide your analysis in a structured JSON format.`
        },
        {
          role: "user",
          content: `Job Description: ${jobDescription}\n\nResume Content: ${JSON.stringify(resume)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing job with OpenAI:", error);
    throw new Error("Failed to analyze job description with AI");
  }
}

/**
 * Generates a professional summary based on resume content and optional job description
 */
export async function generateSummaryWithAI(resume: any, jobDescription?: string) {
  try {
    const prompt = jobDescription 
      ? `Generate a professional summary for a resume tailored to this job description. Make it concise (3-4 sentences), professional, and highlight key qualifications from the resume that match the job.`
      : `Generate a professional summary for this resume. Make it concise (3-4 sentences), professional, and highlight key qualifications and experience.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer who creates impactful professional summaries."
        },
        {
          role: "user",
          content: `${prompt}\n\nResume: ${JSON.stringify(resume)}${jobDescription ? `\n\nJob Description: ${jobDescription}` : ''}`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating summary with OpenAI:", error);
    throw new Error("Failed to generate resume summary with AI");
  }
}

/**
 * Suggests relevant skills based on job title, industry, and current skills
 */
export async function suggestSkillsWithAI(jobTitle: string, industry?: string, currentSkills?: string[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a career and industry expert who suggests relevant skills for different job roles."
        },
        {
          role: "user",
          content: `Suggest 10 highly relevant technical and soft skills for a ${jobTitle} ${industry ? `in the ${industry} industry` : ''}.
          ${currentSkills?.length ? `The person already has these skills: ${currentSkills.join(', ')}. Don't include these in your suggestions.` : ''}
          Return the result as a JSON array of strings containing only the skill names.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.skills || [];
  } catch (error) {
    console.error("Error suggesting skills with OpenAI:", error);
    throw new Error("Failed to suggest skills with AI");
  }
}

/**
 * Improves description text for experience, projects or summaries
 */
export async function improveDescriptionWithAI(description: string, type: string) {
  try {
    // Different prompts based on the type of content
    const prompts = {
      experience: "Improve this work experience description to be more impactful. Use action verbs, include achievements with metrics where possible, and keep it concise but impressive.",
      project: "Improve this project description to highlight technical skills, achievements, and the impact of the work. Use action verbs and be specific about technologies used.",
      summary: "Improve this professional summary to be more compelling. Highlight key qualifications and achievements, use professional language, and keep it concise (3-4 sentences)."
    };

    const prompt = prompts[type as keyof typeof prompts] || prompts.experience;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer who improves resume content to be more impactful and professional."
        },
        {
          role: "user",
          content: `${prompt}\n\nOriginal text: ${description}`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error improving description with OpenAI:", error);
    throw new Error("Failed to improve description with AI");
  }
}

/**
 * Analyzes a resume for quality and provides a score with improvement suggestions
 */
export async function scoreResumeWithAI(resume: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert resume reviewer. Analyze the resume and provide:
          1. An overall score from 0-100
          2. Up to 5 specific areas for improvement with actionable suggestions
          3. Identify any grammar or clarity issues
          
          Format your response as a JSON object with the following structure:
          {
            "score": number,
            "improvements": string[],
            "grammarIssues": string[]
          }
          
          The score should be 0-100 based on resume quality.
          The improvements should be specific, actionable suggestions.
          The grammarIssues should list any writing clarity problems.`
        },
        {
          role: "user",
          content: `Resume: ${JSON.stringify(resume)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    // Parse and validate the response
    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    // Ensure the response has the expected structure
    return {
      score: typeof parsed.score === 'number' ? parsed.score : 65,
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [
        "Add more quantifiable achievements to your work experiences",
        "Include a stronger professional summary highlighting your key skills",
        "Tailor your skills section to match industry requirements"
      ],
      grammarIssues: Array.isArray(parsed.grammarIssues) ? parsed.grammarIssues : []
    };
  } catch (error) {
    console.error("Error scoring resume with OpenAI:", error);
    
    // Instead of throwing an error, return a fallback response
    return {
      score: 60,
      improvements: [
        "Add more quantifiable achievements to your work experiences",
        "Include specific technologies and tools you've used in each role",
        "Ensure your resume is tailored to the specific job you're applying for",
        "Add more skills relevant to your target industry",
        "Make sure each experience entry has 3-5 bullet points of achievements"
      ],
      grammarIssues: [],
      fallback: true
    };
  }
}