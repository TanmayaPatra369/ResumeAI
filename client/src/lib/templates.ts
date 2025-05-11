import type { Template } from '../types/resume';

export interface TemplateOption {
  id: Template;
  name: string;
  thumbnail: string;
  description: string;
}

// Define the available templates
export const templates: TemplateOption[] = [
  {
    id: 'professional',
    name: 'Professional',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200',
    description: 'A clean, professional template suitable for corporate environments'
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnail: 'https://images.unsplash.com/photo-1606326608690-4e0281b1e588?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200',
    description: 'A modern, eye-catching design for creative industries'
  },
  {
    id: 'academic',
    name: 'Academic',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200',
    description: 'A structured format ideal for academic and research positions'
  }
];

// Function to get a template by ID
export const getTemplateById = (id: Template): TemplateOption => {
  const template = templates.find(t => t.id === id);
  return template || templates[0];
};
