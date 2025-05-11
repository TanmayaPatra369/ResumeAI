import { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/resumeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, RefreshCw, Lightbulb } from 'lucide-react';
import { analyzeResume } from '@/lib/ml';
import { useToast } from '@/hooks/use-toast';

export function ResumeAnalysis() {
  const { currentResume, initialized } = useResumeStore();
  const { toast } = useToast();
  
  const [analysis, setAnalysis] = useState<{
    score: number;
    improvements: string[];
    grammarIssues: string[];
    fallback?: boolean;
  }>({ score: 0, improvements: [], grammarIssues: [] });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Run analysis when component mounts or resume changes significantly
  useEffect(() => {
    // Ensure resume is loaded and initialized before analyzing
    if (initialized) {
      performAnalysis();
    }
    // This is a simplified dependency array - in a real app, you'd want to be more selective
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResume.experience.length, currentResume.skills.length, currentResume.education.length, currentResume.personalDetails.summary]);
  
  // Force analysis when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      performAnalysis();
    }, 1000); // Small delay to ensure data is loaded
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setUsingFallback(false);
      
      const result = await analyzeResume(currentResume);
      setAnalysis(result);
      
      // Check if we're using fallback analysis
      if (result.fallback) {
        setUsingFallback(true);
        toast({
          title: "Using Basic Analysis",
          description: "AI-powered analysis is currently unavailable. Using basic analysis instead.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setUsingFallback(true);
      toast({
        title: "Analysis Notice",
        description: "Using basic resume analysis due to API limitations.",
        variant: "default"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-card-bg rounded-lg shadow-lg border-l-4 border-highlight">
      <CardContent className="pt-6 px-6 pb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-highlight" />
          {usingFallback ? 'Basic Resume Analysis' : 'AI Resume Analysis'}
          {usingFallback && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-400/10 text-yellow-500 rounded-full">Basic Mode</span>
          )}
        </h2>
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-highlight border-t-transparent rounded-full mb-4"></div>
            <p className="text-secondary-text">Analyzing your resume...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-background rounded-md border border-border">
              <h3 className="font-semibold text-primary-accent mb-2">
                Resume Score: {analysis.score}/100
              </h3>
              <div className="w-full bg-border rounded-full h-2.5">
                <div 
                  className="bg-highlight h-2.5 rounded-full" 
                  style={{ width: `${analysis.score}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2 text-secondary-text">
                {analysis.score >= 90 ? 'Excellent! Your resume is very strong.' :
                 analysis.score >= 70 ? 'Your resume is strong but has room for improvement.' :
                 analysis.score >= 50 ? 'Your resume needs some work to stand out.' :
                 'Your resume needs significant improvements.'}
              </p>
            </div>
            
            {analysis.improvements.length > 0 && (
              <div className="p-3 bg-background rounded-md border border-border">
                <h3 className="font-semibold text-primary-accent mb-2">
                  Improvement Suggestions:
                </h3>
                <ul className="space-y-1 text-sm">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-highlight shrink-0" />
                      <span dangerouslySetInnerHTML={{ 
                        __html: improvement.replace(
                          /([^<]*)((?:<[^>]*>)*)/g, 
                          (_, text, tags) => text.replace(
                            /\b([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)*)\b/g, 
                            '<span class="text-highlight">$1</span>'
                          ) + tags
                        )
                      }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="p-3 bg-background rounded-md border border-border">
              <h3 className="font-semibold text-primary-accent mb-2">
                Grammar & Clarity:
              </h3>
              {analysis.grammarIssues.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {analysis.grammarIssues.map((issue, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-highlight" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm">No grammar issues detected. Your language is clear and professional.</p>
              )}
            </div>
            
            <Button 
              className="w-full btn-electric-blue px-4 py-2 mt-2 rounded-md flex items-center justify-center"
              onClick={performAnalysis}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
