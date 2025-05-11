import { useResumeStore } from '@/lib/resumeStore';
import { downloadPDF } from '@/lib/pdf';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { useRef } from 'react';

interface HeaderProps {
  previewRef: React.RefObject<HTMLDivElement>;
}

export function Header({ previewRef }: HeaderProps) {
  const { currentResume } = useResumeStore();
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await downloadPDF(currentResume, previewRef);
      toast({
        title: "Success!",
        description: "Your resume has been exported to PDF.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    // For now, we'll just save to local storage
    localStorage.setItem('savedResume', JSON.stringify(currentResume));
    
    toast({
      title: "Success!",
      description: "Your resume has been saved.",
    });
  };

  return (
    <header className="py-4 px-6 border-b border-border">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="ri-file-text-line text-highlight text-2xl"></i>
          <h1 className="text-xl md:text-2xl font-bold">ResumeAI</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={handleSave}
            className="text-secondary-text hover:text-primary-text transition-colors"
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Save</span>
          </Button>
          
          <Button 
            onClick={handleExport}
            className="bg-highlight text-background hover:bg-opacity-80 transition-colors"
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
