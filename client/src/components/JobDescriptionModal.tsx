import { useState } from 'react';
import { useResumeStore } from '@/lib/resumeStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { analyzeJobDescription } from '@/lib/ml';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export function JobDescriptionModal() {
  const { 
    currentResume, 
    showJobDescriptionModal, 
    toggleJobDescriptionModal, 
    setJobDescription, 
    setJobAnalysis, 
    jobDescription,
    addSkill
  } = useResumeStore();
  
  const { toast } = useToast();
  
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const handleAnalyzeJobDescription = async () => {
    if (!jobDescriptionText.trim()) {
      toast({
        title: "Empty Job Description",
        description: "Please paste a job description to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Set basic job description data
      setJobDescription({
        jobTitle: currentResume.personalDetails.jobTitle || 'Unknown Position',
        company: 'Unknown Company',
        description: jobDescriptionText,
      });
      
      // Analyze the job description against the resume
      const analysis = await analyzeJobDescription(jobDescriptionText, currentResume);
      
      // Update the job analysis in the store
      setJobAnalysis(analysis);
      
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis Complete",
        description: "Your resume has been compared to the job description."
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the job description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleAddMissingSkill = (skill: string) => {
    addSkill(skill);
    
    toast({
      title: "Skill Added",
      description: `"${skill}" has been added to your skills.`
    });
  };
  
  const handleOptimizeResume = () => {
    // Add all missing skills at once
    if (jobDescription?.analysis?.skillsMatch.missing) {
      jobDescription.analysis.skillsMatch.missing.forEach(skill => {
        addSkill(skill);
      });
      
      toast({
        title: "Resume Optimized",
        description: "Missing skills have been added to your resume."
      });
    }
    
    // Close the modal
    toggleJobDescriptionModal();
  };
  
  return (
    <Dialog open={showJobDescriptionModal} onOpenChange={toggleJobDescriptionModal}>
      <DialogContent className="bg-card-bg rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-border">
          <DialogTitle className="text-xl font-bold">Job Description Analyzer</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 overflow-auto flex-1">
          <div className="mb-6">
            <Label className="block text-secondary-text mb-2">Paste Job Description</Label>
            <Textarea 
              className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors min-h-[200px] resize-none" 
              placeholder="Paste the job description here to analyze required skills and experience..."
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="btn-electric-blue px-4 py-2 rounded-md flex items-center justify-center flex-1" 
              onClick={handleAnalyzeJobDescription}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Job Requirements
                </>
              )}
            </Button>
            
            <Button 
              className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center justify-center shadow-md" 
              onClick={toggleJobDescriptionModal}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
          
          {jobDescription?.analysis && analysisComplete && (
            <div className="mt-6 bg-background p-4 rounded-md border border-border">
              <h3 className="font-semibold text-primary-accent mb-3">Job Analysis Results</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-primary-text mb-2">Skills Match</h4>
                <div className="w-full bg-border rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-highlight h-2.5 rounded-full" 
                    style={{ width: `${jobDescription.analysis.skillsMatch.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-secondary-text">
                  <span>{jobDescription.analysis.skillsMatch.percentage}% Match</span>
                  <span>{100 - jobDescription.analysis.skillsMatch.percentage}% Gap</span>
                </div>
              </div>
              
              {jobDescription.analysis.skillsMatch.missing.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-primary-text mb-2">Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobDescription.analysis.skillsMatch.missing.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-secondary-accent bg-opacity-10 text-secondary-accent px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <span>{skill}</span>
                        <button 
                          className="ml-1"
                          onClick={() => handleAddMissingSkill(skill)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {jobDescription.analysis.experienceMatch.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-primary-text mb-2">Experience Requirements</h4>
                  <ul className="space-y-1 text-sm">
                    {jobDescription.analysis.experienceMatch.map((match, index) => (
                      <li key={index} className="flex items-start">
                        {match.met ? (
                          <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-highlight" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-secondary-accent" />
                        )}
                        <span>
                          <span className="font-medium">Required:</span> {match.requirement}{' '}
                          <span className={match.met ? 'text-highlight' : 'text-secondary-accent'}>
                            ({match.met ? `You have: ${match.resumeYears}` : 'Missing in your resume'})
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button 
                className="bg-primary-accent text-background hover:bg-opacity-80 transition-colors px-4 py-2 rounded-md flex items-center justify-center w-full mt-4" 
                onClick={handleOptimizeResume}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize Resume for This Job
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
