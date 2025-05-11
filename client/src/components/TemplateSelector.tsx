import { useResumeStore } from '@/lib/resumeStore';
import { templates } from '@/lib/templates';
import { Card, CardContent } from '@/components/ui/card';
import type { Template } from '@/types/resume';

export function TemplateSelector() {
  const { currentResume, setTemplate } = useResumeStore();
  const activeTemplate = currentResume.template;

  const handleTemplateSelect = (template: Template) => {
    setTemplate(template);
  };

  return (
    <Card className="bg-card-bg rounded-lg shadow-lg">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-4">Resume Template</h2>
        <div className="grid grid-cols-3 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`relative cursor-pointer ${activeTemplate === template.id ? '' : 'opacity-70 hover:opacity-100 transition-opacity'}`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <img 
                src={template.thumbnail}
                alt={`${template.name} template`}
                className={`w-full h-24 object-cover rounded-md border-2 ${
                  activeTemplate === template.id ? 'border-highlight' : 'border-border'
                }`}
              />
              <span className="block text-center mt-1 text-sm">{template.name}</span>
              {activeTemplate === template.id && (
                <div className="absolute top-1 right-1 bg-highlight text-xs text-background px-1 rounded">Active</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
