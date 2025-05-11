import { useState } from 'react';
import { useResumeStore } from '@/lib/resumeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { improveDescription } from '@/lib/ml';
import { useToast } from '@/hooks/use-toast';

export function ProjectsForm() {
  const { currentResume, addProject, updateProject, removeProject } = useResumeStore();
  const { projects } = currentResume;
  const { toast } = useToast();
  
  const [improvingIds, setImprovingIds] = useState<string[]>([]);

  const handleInputChange = (id: string, key: string, value: any) => {
    updateProject(id, { [key]: value });
  };

  const handleImproveDescription = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    try {
      setImprovingIds(prev => [...prev, id]);
      
      const improved = await improveDescription(project.description, 'project');
      
      updateProject(id, { description: improved });
      
      toast({
        title: "Description Enhanced",
        description: "Your project description has been improved."
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
      <CardContent className="pt-6 px-6 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
          <Button
            variant="ghost"
            onClick={addProject}
            className="btn-electric-blue flex items-center rounded-md"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-border rounded-md">
            <p className="text-secondary-text">No projects added yet. Click "Add" to showcase your work.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border border-border rounded-md p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`name-${project.id}`} className="block text-secondary-text mb-1">
                    Project Name
                  </Label>
                  <Input
                    id={`name-${project.id}`}
                    type="text"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={project.name}
                    onChange={(e) => handleInputChange(project.id, 'name', e.target.value)}
                    placeholder="Project Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`link-${project.id}`} className="block text-secondary-text mb-1">
                    Link (Optional)
                  </Label>
                  <Input
                    id={`link-${project.id}`}
                    type="url"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                    value={project.link || ''}
                    onChange={(e) => handleInputChange(project.id, 'link', e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor={`description-${project.id}`} className="block text-secondary-text mb-1">
                  Description
                </Label>
                <div className="relative">
                  <Textarea
                    id={`description-${project.id}`}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors min-h-[80px] resize-none"
                    value={project.description}
                    onChange={(e) => handleInputChange(project.id, 'description', e.target.value)}
                    placeholder="Describe the project, technologies used, and your role. Use bullet points for clarity."
                  />
                  <div className="absolute right-2 top-2">
                    <Button
                      size="sm"
                      className="text-xs btn-electric-blue px-2 py-1 rounded-full"
                      onClick={() => handleImproveDescription(project.id)}
                      disabled={improvingIds.includes(project.id)}
                    >
                      {improvingIds.includes(project.id) ? (
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
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="text-secondary-accent hover:text-secondary-accent hover:underline flex items-center"
                  onClick={() => removeProject(project.id)}
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
