import { useState } from 'react';
import { useResumeStore } from '@/lib/resumeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Sparkles, Lightbulb } from 'lucide-react';
import { improveDescription } from '@/lib/ml';
import { useToast } from '@/hooks/use-toast';

export function ExperienceForm() {
  const { currentResume, addExperience, updateExperience, removeExperience } = useResumeStore();
  const { experience } = currentResume;
  const { toast } = useToast();
  
  const [improvingIds, setImprovingIds] = useState<string[]>([]);

  const handleInputChange = (id: string, key: string, value: any) => {
    updateExperience(id, { [key]: value });
  };

  const handleCurrentJobChange = (id: string, checked: boolean) => {
    updateExperience(id, { 
      current: checked,
      endDate: checked ? undefined : experience.find(exp => exp.id === id)?.endDate
    });
  };

  const handleImproveDescription = async (id: string) => {
    const exp = experience.find(e => e.id === id);
    if (!exp) return;
    
    try {
      setImprovingIds(prev => [...prev, id]);
      
      // If description is empty, provide a template example based on job title
      let description = exp.description;
      if (!description || description.trim() === '') {
        // Create default description based on job title
        const jobTitle = exp.title.toLowerCase();
        
        if (jobTitle.includes('developer') || jobTitle.includes('engineer')) {
          description = '• Developed web applications using modern technologies\n• Collaborated with team members on project tasks\n• Fixed bugs and improved application performance';
        } else if (jobTitle.includes('manager')) {
          description = '• Led a team of professionals to deliver project objectives\n• Managed project budgets and resources effectively\n• Implemented process improvements that increased efficiency';
        } else if (jobTitle.includes('analyst')) {
          description = '• Analyzed data to identify trends and insights\n• Created reports and dashboards for stakeholders\n• Provided recommendations based on data analysis';
        } else {
          description = '• Responsible for key tasks and deliverables\n• Collaborated with team members on projects\n• Implemented improvements in processes';
        }
      }
      
      const improved = await improveDescription(description, 'experience');
      
      updateExperience(id, { description: improved });
      
      toast({
        title: "Description Enhanced",
        description: "Your experience description has been improved with industry-standard formatting."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to improve description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImprovingIds(prev => prev.filter(i => i !== id));
    }
  };

  return (
    <Card className="bg-card-bg rounded-lg shadow-lg">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Work Experience</h2>
          <Button
            variant="ghost"
            onClick={addExperience}
            className="text-highlight hover:underline flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        {experience.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-border rounded-md">
            <p className="text-secondary-text">No work experience added yet. Click "Add" to include your work history.</p>
          </div>
        ) : (
          experience.map((exp) => (
            <div key={exp.id} className="border border-border rounded-md p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`job-title-${exp.id}`} className="block text-secondary-text mb-1">
                    Job Title
                  </Label>
                  <Input
                    id={`job-title-${exp.id}`}
                    type="text"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={exp.title}
                    onChange={(e) => handleInputChange(exp.id, 'title', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`company-${exp.id}`} className="block text-secondary-text mb-1">
                    Company
                  </Label>
                  <Input
                    id={`company-${exp.id}`}
                    type="text"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={exp.company}
                    onChange={(e) => handleInputChange(exp.id, 'company', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`location-${exp.id}`} className="block text-secondary-text mb-1">
                    Location (Optional)
                  </Label>
                  <Input
                    id={`location-${exp.id}`}
                    type="text"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={exp.location || ''}
                    onChange={(e) => handleInputChange(exp.id, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`startdate-${exp.id}`} className="block text-secondary-text mb-1">
                    Start Date
                  </Label>
                  <Input
                    id={`startdate-${exp.id}`}
                    type="month"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={exp.startDate}
                    onChange={(e) => handleInputChange(exp.id, 'startDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor={`enddate-${exp.id}`} className="block text-secondary-text mb-1">
                  End Date
                </Label>
                <div className="space-y-1">
                  <Input
                    id={`enddate-${exp.id}`}
                    type="month"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={exp.endDate || ''}
                    onChange={(e) => handleInputChange(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                  <div className="flex items-center text-sm mt-1">
                    <Checkbox
                      id={`current-job-${exp.id}`}
                      checked={exp.current}
                      onCheckedChange={(checked) => 
                        handleCurrentJobChange(exp.id, checked as boolean)
                      }
                      className="mr-2"
                    />
                    <Label
                      htmlFor={`current-job-${exp.id}`}
                      className="text-secondary-text text-sm"
                    >
                      I currently work here
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor={`description-${exp.id}`} className="block text-secondary-text mb-1">
                  Description
                </Label>
                <div className="relative">
                  <Textarea
                    id={`description-${exp.id}`}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors min-h-[100px] resize-none"
                    value={exp.description}
                    onChange={(e) => handleInputChange(exp.id, 'description', e.target.value)}
                    placeholder="• Led a team of X members to implement Y solution
• Developed and maintained Z, resulting in A% improvement
• Collaborated with cross-functional teams to deliver B on time and under budget"
                  />
                  <div className="absolute right-2 top-2">
                    <Button
                      size="sm"
                      className="text-xs bg-primary-accent text-background px-2 py-1 rounded-full"
                      onClick={() => handleImproveDescription(exp.id)}
                      disabled={improvingIds.includes(exp.id)}
                    >
                      {improvingIds.includes(exp.id) ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-1">⟳</span> Enhancing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" /> Enhance
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-highlight flex items-center">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  <span>Tip: Quantify achievements with numbers and percentages</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="text-secondary-accent hover:text-secondary-accent hover:underline flex items-center"
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
