import { useResumeStore } from '@/lib/resumeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

export function EducationForm() {
  const { currentResume, addEducation, updateEducation, removeEducation } = useResumeStore();
  const { education } = currentResume;

  const handleInputChange = (id: string, key: string, value: any) => {
    updateEducation(id, { [key]: value });
  };

  const handleCurrentEducationChange = (id: string, checked: boolean) => {
    updateEducation(id, { 
      current: checked,
      endDate: checked ? undefined : education.find(edu => edu.id === id)?.endDate
    });
  };

  return (
    <Card className="bg-card-bg rounded-lg shadow-lg">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Education</h2>
          <Button
            variant="ghost"
            onClick={addEducation}
            className="text-highlight hover:underline flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        {education.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-border rounded-md">
            <p className="text-secondary-text">No education added yet. Click "Add" to include your educational background.</p>
          </div>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="border border-border rounded-md p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`degree-${edu.id}`} className="block text-secondary-text mb-1">
                    Degree
                  </Label>
                  <Input
                    id={`degree-${edu.id}`}
                    type="text"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={edu.degree}
                    onChange={(e) => handleInputChange(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`institution-${edu.id}`} className="block text-secondary-text mb-1">
                    Institution
                  </Label>
                  <Input
                    id={`institution-${edu.id}`}
                    type="text"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={edu.institution}
                    onChange={(e) => handleInputChange(edu.id, 'institution', e.target.value)}
                    placeholder="University of Washington"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`location-${edu.id}`} className="block text-secondary-text mb-1">
                    Location (Optional)
                  </Label>
                  <Input
                    id={`location-${edu.id}`}
                    type="text"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={edu.location || ''}
                    onChange={(e) => handleInputChange(edu.id, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`startdate-${edu.id}`} className="block text-secondary-text mb-1">
                    Start Date
                  </Label>
                  <Input
                    id={`startdate-${edu.id}`}
                    type="month"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={edu.startDate}
                    onChange={(e) => handleInputChange(edu.id, 'startDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor={`enddate-${edu.id}`} className="block text-secondary-text mb-1">
                  End Date
                </Label>
                <div className="space-y-1">
                  <Input
                    id={`enddate-${edu.id}`}
                    type="month"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={edu.endDate || ''}
                    onChange={(e) => handleInputChange(edu.id, 'endDate', e.target.value)}
                    disabled={edu.current}
                  />
                  <div className="flex items-center text-sm mt-1">
                    <Checkbox
                      id={`current-education-${edu.id}`}
                      checked={edu.current}
                      onCheckedChange={(checked) => 
                        handleCurrentEducationChange(edu.id, checked as boolean)
                      }
                      className="mr-2"
                    />
                    <Label
                      htmlFor={`current-education-${edu.id}`}
                      className="text-secondary-text text-sm"
                    >
                      I'm currently studying here
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor={`description-${edu.id}`} className="block text-secondary-text mb-1">
                  Description (Optional)
                </Label>
                <Textarea
                  id={`description-${edu.id}`}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors min-h-[60px] resize-none"
                  value={edu.description || ''}
                  onChange={(e) => handleInputChange(edu.id, 'description', e.target.value)}
                  placeholder="Thesis, GPA, awards, relevant coursework, etc."
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="text-secondary-accent hover:text-secondary-accent hover:underline flex items-center"
                  onClick={() => removeEducation(edu.id)}
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
