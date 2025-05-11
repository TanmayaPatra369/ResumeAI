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
              <div className={`relative rounded-md p-1 ${
                activeTemplate === template.id ? 'bg-highlight bg-opacity-20 ring-2 ring-highlight' : 'hover:bg-card hover:bg-opacity-50'
              }`}>
                <img 
                  src={template.thumbnail}
                  alt={`${template.name} template`}
                  className="w-full h-24 object-cover rounded-md"
                />
                {activeTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-highlight text-xs text-background px-2 py-1 rounded-full font-semibold">
                    ✓ Selected
                  </div>
                )}
              </div>
              <span className={`block text-center mt-2 text-sm font-medium ${
                activeTemplate === template.id ? 'text-highlight' : 'text-primary-text'
              }`}>{template.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
