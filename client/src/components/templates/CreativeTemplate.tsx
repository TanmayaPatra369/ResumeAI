import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface CreativeTemplateProps {
  resume: Resume;
}

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
  const { personalDetails, experience, education, skills, projects } = resume;

  return (
    <div className="text-gray-800 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-md mb-6">
        <h1 className="text-3xl font-bold">
          {personalDetails.name || 'Your Name'}
        </h1>
        <p className="text-xl mt-1">
          {personalDetails.jobTitle || 'Your Profession'}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {personalDetails.email && (
            <span className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {personalDetails.email}
            </span>
          )}
          
          {personalDetails.phone && (
            <span className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              {personalDetails.phone}
            </span>
          )}
          
          {personalDetails.location && (
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {personalDetails.location}
            </span>
          )}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          {personalDetails.linkedin && (
            <span className="flex items-center">
              <Linkedin className="h-4 w-4 mr-1" />
              {personalDetails.linkedin}
            </span>
          )}
          
          {personalDetails.github && (
            <span className="flex items-center">
              <Github className="h-4 w-4 mr-1" />
              {personalDetails.github}
            </span>
          )}
          
          {personalDetails.website && (
            <span className="flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              {personalDetails.website}
            </span>
          )}
        </div>
      </div>
      
      {/* Two column layout for the rest */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Skills, Education */}
        <div className="md:col-span-1">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-700 mb-3 pb-1 border-b-2 border-indigo-700">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-700 mb-3 pb-1 border-b-2 border-indigo-700">
                Education
              </h2>
              
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-700 italic">{edu.institution}</p>
                  {edu.location && <p className="text-gray-600 text-sm">{edu.location}</p>}
                  <p className="text-gray-600 text-sm">
                    {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                      edu.current 
                        ? 'Present'
                        : edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                          : ''
                    }
                  </p>
                  
                  {edu.description && (
                    <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right column - Summary, Experience, Projects */}
        <div className="md:col-span-2">
          {/* Summary */}
          {personalDetails.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-700 mb-3 pb-1 border-b-2 border-indigo-700">
                About Me
              </h2>
              <p className="text-gray-700">
                {personalDetails.summary}
              </p>
            </div>
          )}
          
          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-700 mb-3 pb-1 border-b-2 border-indigo-700">
                Experience
              </h2>
              
              {experience.map((exp) => (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-gray-900 font-bold text-lg">{exp.title}</h3>
                    <span className="text-indigo-600 text-sm font-semibold">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                        exp.current 
                          ? 'Present'
                          : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : ''
                      }
                    </span>
                  </div>
                  <p className="text-gray-700 font-semibold">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                  
                  {exp.description && (
                    <ul className="list-disc ml-5 mt-2 text-gray-700 text-sm">
                      {exp.description.split('\n').map((bullet, idx) => (
                        <li key={idx}>
                          {bullet.replace(/^[•\-*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-700 mb-3 pb-1 border-b-2 border-indigo-700">
                Projects
              </h2>
              
              {projects.map((project) => (
                <div key={project.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-gray-900 font-bold">{project.name}</h3>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        {project.link.includes('github.com') ? 'GitHub' : 'View Project'}
                      </a>
                    )}
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
