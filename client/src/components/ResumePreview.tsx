import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useResumeStore } from '@/lib/resumeStore';
import { ProfessionalTemplate } from '@/components/templates/ProfessionalTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { AcademicTemplate } from '@/components/templates/AcademicTemplate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Eye } from 'lucide-react';
import { downloadPDF } from '@/lib/pdf';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

export interface ResumePreviewRef {
  getPreviewElement: () => HTMLDivElement | null;
}

interface ResumePreviewProps {
  previewRef: React.RefObject<ResumePreviewRef>;
}

export function ResumePreview({ previewRef }: ResumePreviewProps) {
  const { currentResume } = useResumeStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadPDF = async () => {
    try {
      await downloadPDF(currentResume, contentRef);
      
      toast({
        title: "PDF Generated",
        description: "Your resume has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const toggleMobilePreview = () => {
    setShowMobilePreview(!showMobilePreview);
  };

  // Render the appropriate template based on the current template selection
  const renderTemplate = () => {
    switch (currentResume.template) {
      case 'professional':
        return <ProfessionalTemplate resume={currentResume} />;
      case 'creative':
        return <CreativeTemplate resume={currentResume} />;
      case 'academic':
        return <AcademicTemplate resume={currentResume} />;
      default:
        return <ProfessionalTemplate resume={currentResume} />;
    }
  };

  return (
    <Card className="bg-card-bg rounded-lg shadow-lg overflow-hidden sticky top-6 self-start max-h-screen" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h2 className="text-lg font-bold">Resume Preview</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownloadPDF}
            title="Download PDF"
            className="text-secondary-text hover:text-primary-text transition-colors"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrint}
            title="Print"
            className="text-secondary-text hover:text-primary-text transition-colors"
          >
            <Printer className="h-4 w-4" />
          </Button>
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobilePreview}
              title="Toggle Preview"
              className="text-secondary-text hover:text-primary-text transition-colors lg:hidden"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div 
        className={`overflow-auto p-8 bg-white h-full scrollbar-hide ${isMobile && !showMobilePreview ? 'hidden' : ''}`}
        ref={contentRef}
      >
        {/* Resume Preview Content */}
        <div className="resume-preview text-gray-800 max-w-[800px] mx-auto">
          {renderTemplate()}
        </div>
      </div>
    </Card>
  );
}

export const ResumePreviewWithRef = forwardRef<ResumePreviewRef, Omit<ResumePreviewProps, 'previewRef'>>((props, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useImperativeHandle(ref, () => ({
    getPreviewElement: () => contentRef.current
  }));
  
  return <ResumePreview {...props} previewRef={{ current: { getPreviewElement: () => contentRef.current } }} />;
});

ResumePreviewWithRef.displayName = 'ResumePreviewWithRef';
