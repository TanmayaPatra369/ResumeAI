import { useState } from 'react';
import { useResumeStore } from '@/lib/resumeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { generateSummary } from '@/lib/ml';
import { useToast } from '@/hooks/use-toast';

export function PersonalDetailsForm() {
  const { currentResume, setPersonalDetails, setIsGeneratingSummary } = useResumeStore();
  const { personalDetails } = currentResume;
  const { toast } = useToast();
  
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setPersonalDetails({ [key]: value });
  };

  const handleGenerateSummary = async () => {
    try {
      setSummaryLoading(true);
      setIsGeneratingSummary(true);
      
      const summary = await generateSummary(currentResume);
      
      setPersonalDetails({ summary });
      
      toast({
        title: "Summary Generated",
        description: "Your professional summary has been created based on your resume content."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSummaryLoading(false);
      setIsGeneratingSummary(false);
    }
  };

  return (
    <Card className="bg-card-bg rounded-lg shadow-lg">
      <CardContent className="pt-6 px-6 pb-6">
        <h2 className="text-xl font-bold mb-4">Personal Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="block text-secondary-text mb-1">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                placeholder="John Doe"
                value={personalDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="jobTitle" className="block text-secondary-text mb-1">
                Job Title
              </Label>
              <div className="relative">
                <Input
                  id="jobTitle"
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                  placeholder="Software Engineer"
                  value={personalDetails.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute right-2 top-2 cursor-help">
                      <HelpCircle className="h-4 w-4 text-highlight" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Suggested based on your skills and experience</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="summary" className="block text-secondary-text mb-1">
              Professional Summary
            </Label>
            <div className="relative">
              <Textarea
                id="summary"
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors h-24 resize-none"
                placeholder="Brief overview of your experience and skills..."
                value={personalDetails.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
              />
              <div className="absolute right-2 top-2">
                <Button
                  size="sm"
                  className="text-xs bg-primary-accent text-background px-2 py-1 rounded-full"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                >
                  {summaryLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-1">⟳</span> Generating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" /> Auto-generate
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="block text-secondary-text mb-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                placeholder="john.doe@example.com"
                value={personalDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="block text-secondary-text mb-1">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                placeholder="(123) 456-7890"
                value={personalDetails.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin" className="block text-secondary-text mb-1">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                placeholder="linkedin.com/in/johndoe"
                value={personalDetails.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="block text-secondary-text mb-1">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                placeholder="San Francisco, CA"
                value={personalDetails.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
