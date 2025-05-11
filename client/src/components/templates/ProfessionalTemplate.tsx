import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface ProfessionalTemplateProps {
  resume: Resume;
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
  const { personalDetails, experience, education, skills, projects } = resume;

  return (
    <div className="text-gray-800">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalDetails.name || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-700">
          {personalDetails.jobTitle || 'Your Profession'}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-gray-600">
          {personalDetails.email && (
            <span className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {personalDetails.email}
            </span>
          )}
          
          {personalDetails.phone && (
            <span className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {personalDetails.phone}
            </span>
          )}
          
          {personalDetails.location && (
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {personalDetails.location}
            </span>
          )}
          
          {personalDetails.linkedin && (
            <span className="flex items-center">
              <Linkedin className="h-3 w-3 mr-1" />
              {personalDetails.linkedin}
            </span>
          )}
          
          {personalDetails.github && (
            <span className="flex items-center">
              <Github className="h-3 w-3 mr-1" />
              {personalDetails.github}
            </span>
          )}
          
          {personalDetails.website && (
            <span className="flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              {personalDetails.website}
            </span>
          )}
        </div>
      </div>
      
      {/* Summary */}
      {personalDetails.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700">
            {personalDetails.summary}
          </p>
        </div>
      )}
      
      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Work Experience
          </h2>
          
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-gray-900 font-bold">{exp.title}</h3>
                <span className="text-gray-600 text-sm">
                  {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                    exp.current 
                      ? 'Present'
                      : exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : ''
                  }
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <h4 className="text-gray-700 italic">{exp.company}</h4>
                {exp.location && <span className="text-gray-600 text-sm">{exp.location}</span>}
              </div>
              
              {exp.description && (
                <ul className="list-disc ml-5 mt-1 text-gray-700 text-sm">
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
      
      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Education
          </h2>
          
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-gray-900 font-bold">{edu.degree}</h3>
                <span className="text-gray-600 text-sm">
                  {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                    edu.current 
                      ? 'Present'
                      : edu.endDate
                        ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : ''
                  }
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <h4 className="text-gray-700 italic">{edu.institution}</h4>
                {edu.location && <span className="text-gray-600 text-sm">{edu.location}</span>}
              </div>
              
              {edu.description && (
                <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
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
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {project.link.includes('github.com') ? 'GitHub' : 'Link'}
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
  );
}
