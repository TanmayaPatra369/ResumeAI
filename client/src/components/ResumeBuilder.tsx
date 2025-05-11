import { useRef } from 'react';
import { TemplateSelector } from '@/components/TemplateSelector';
import { PersonalDetailsForm } from '@/components/PersonalDetailsForm';
import { ExperienceForm } from '@/components/ExperienceForm';
import { EducationForm } from '@/components/EducationForm';
import { SkillsForm } from '@/components/SkillsForm';
import { ProjectsForm } from '@/components/ProjectsForm';
import { ResumeAnalysis } from '@/components/ResumeAnalysis';
import { ResumePreview, ResumePreviewWithRef, type ResumePreviewRef } from '@/components/ResumePreview';
import { Header } from '@/components/Header';
import { JobDescriptionModal } from '@/components/JobDescriptionModal';
import { useResumeStore } from '@/lib/resumeStore';

export function ResumeBuilder() {
  const { showJobDescriptionModal } = useResumeStore();
  const previewRef = useRef<ResumePreviewRef>(null);

  return (
    <div className="min-h-screen bg-background text-primary-text">
      <Header previewRef={previewRef} />
      
      <main className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Forms */}
        <div className="lg:w-1/2 space-y-8">
          <TemplateSelector />
          <PersonalDetailsForm />
          <ExperienceForm />
          <EducationForm />
          <SkillsForm />
          <ProjectsForm />
          <ResumeAnalysis />
        </div>
        
        {/* Right Column: Preview */}
        <div className="lg:w-1/2">
          <ResumePreviewWithRef ref={previewRef} />
        </div>
      </main>
      
      {/* Job Description Modal */}
      {showJobDescriptionModal && <JobDescriptionModal />}
    </div>
  );
}
