import { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/resumeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, FileSearch, Sparkles } from 'lucide-react';

import { suggestSkills } from '@/lib/ml';
import { useToast } from '@/hooks/use-toast';

export function SkillsForm() {
  const { currentResume, addSkill, removeSkill, toggleJobDescriptionModal } = useResumeStore();
  const { skills, personalDetails } = currentResume;
  const { toast } = useToast();
  
  const [newSkill, setNewSkill] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Load skill suggestions when job title changes
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!personalDetails.jobTitle) return;
      
      try {
        setIsLoadingSuggestions(true);
        const suggestions = await suggestSkills(
          personalDetails.jobTitle,
          undefined,
          skills
        );
        setSuggestedSkills(suggestions?.slice(0, 3) || []); // Just show top 3
      } catch (error) {
        console.error('Error loading skill suggestions:', error);
        // Fallback suggestions based on common skills
        setSuggestedSkills(['Communication', 'Problem Solving', 'Teamwork'].filter(
          skill => !skills.includes(skill)
        ));
      } finally {
        setIsLoadingSuggestions(false);
      }
    };
    
    loadSuggestions();
  }, [personalDetails.jobTitle, skills]);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleAddSuggestedSkill = (skill: string) => {
    addSkill(skill);
    // Remove from suggestions
    setSuggestedSkills(suggestedSkills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Card className="bg-card-bg rounded-lg shadow-lg">
      <CardContent className="pt-6 px-6 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Skills</h2>
          <Button
            variant="ghost"
            onClick={toggleJobDescriptionModal}
            className="btn-electric-blue flex items-center text-sm rounded-md"
          >
            <FileSearch className="h-4 w-4 mr-1" /> Match to Job Description
          </Button>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="addSkill" className="block text-secondary-text mb-1">
            Add Skills
          </Label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="addSkill"
                type="text"
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-primary-accent transition-colors"
                placeholder="Add a skill and press Enter"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {personalDetails.jobTitle && (
                <div className="absolute top-2 right-2" title="AI-powered skill suggestions">
                  <Sparkles className="h-4 w-4 text-highlight" aria-label="AI-powered skill suggestions" />
                </div>
              )}
            </div>
            <Button 
              onClick={handleAddSkill}
              className="btn-electric-blue px-3 py-2 rounded-md"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Skill suggestions */}
          {suggestedSkills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-button-hover border border-primary-accent text-primary-accent px-2 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer suggestion-tag"
                  onClick={() => handleAddSuggestedSkill(skill)}
                >
                  <Plus className="h-3 w-3" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Label className="block text-secondary-text mb-2">
            Your Skills
          </Label>
          {skills.length === 0 ? (
            <div className="text-center p-4 border border-dashed border-border rounded-md">
              <p className="text-secondary-text">No skills added yet. Add skills above or use AI suggestions.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-background border border-border text-primary-text px-3 py-1 rounded-full text-sm flex items-center group"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 opacity-50 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
