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
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);

  // Run analysis when component mounts or resume changes significantly
  useEffect(() => {
    // Ensure resume is loaded and initialized before analyzing
    // Only analyze if it's been more than 5 seconds since the last analysis
    // This prevents too many API calls when the user is making lots of changes
    const now = Date.now();
    if (initialized && (now - lastAnalysisTime > 5000)) {
      performAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentResume.experience.length, 
    currentResume.skills.length, 
    currentResume.education.length, 
    currentResume.projects.length,
    currentResume.personalDetails.summary,
    initialized
  ]);
  
  // Force analysis when component mounts
  useEffect(() => {
    if (initialized) {
      const timer = setTimeout(() => {
        performAnalysis();
      }, 1000); // Small delay to ensure data is loaded
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  const performAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setUsingFallback(false);
      setLastAnalysisTime(Date.now());
      
      const result = await analyzeResume(currentResume);
      
      // Ensure result has expected properties
      const processedResult = {
        score: typeof result.score === 'number' ? result.score : 0,
        improvements: Array.isArray(result.improvements) ? result.improvements : [],
        grammarIssues: Array.isArray(result.grammarIssues) ? result.grammarIssues : [],
        fallback: result.fallback || false
      };
      
      setAnalysis(processedResult);
      
      // Check if we're using fallback analysis
      if (processedResult.fallback) {
        setUsingFallback(true);
        toast({
          title: "Using Basic Analysis",
          description: "AI-powered analysis is currently unavailable. Using basic analysis instead.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      
      // Set basic fallback analysis when error occurs
      setAnalysis({
        score: 0,
        improvements: [
          "Add more details to your work experiences",
          "Quantify your achievements with numbers", 
          "Include relevant skills for your industry"
        ],
        grammarIssues: [],
        fallback: true
      });
      
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Activity className="h-5 w-5 mr-2 text-highlight" />
            {usingFallback ? 'Basic Resume Analysis' : 'AI Resume Analysis'}
            {usingFallback && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-400/10 text-yellow-500 rounded-full">Basic Mode</span>
            )}
          </h2>
          
          {/* Move refresh button outside textboxes and to the top right */}
          <Button 
            className="btn-electric-blue px-3 py-1 rounded-md flex items-center justify-center"
            onClick={performAnalysis}
            size="sm"
            disabled={isAnalyzing}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-highlight border-t-transparent rounded-full mb-4"></div>
            <p className="text-secondary-text">Analyzing your resume...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-md border border-border">
              <h3 className="font-semibold text-primary-accent mb-2 flex items-center">
                Resume Score: <span className="ml-2 text-highlight text-xl">{analysis.score}/100</span>
              </h3>
              <div className="w-full bg-border rounded-full h-2.5 mb-2">
                <div 
                  className="bg-highlight h-2.5 rounded-full transition-all duration-700 ease-in-out" 
                  style={{ width: `${Math.max(5, analysis.score)}%` }}
                ></div>
              </div>
              <p className="text-sm text-secondary-text">
                {analysis.score >= 90 ? 'Excellent! Your resume is very strong.' :
                 analysis.score >= 70 ? 'Your resume is strong but has room for improvement.' :
                 analysis.score >= 50 ? 'Your resume needs some work to stand out.' :
                 'Your resume needs significant improvements.'}
              </p>
            </div>
            
            {analysis.improvements.length > 0 && (
              <div className="p-4 bg-background rounded-md border border-border">
                <h3 className="font-semibold text-primary-accent mb-3">
                  Improvement Suggestions:
                </h3>
                <ul className="space-y-2 text-sm">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-highlight shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="p-4 bg-background rounded-md border border-border">
              <h3 className="font-semibold text-primary-accent mb-3">
                Grammar & Clarity:
              </h3>
              {analysis.grammarIssues && analysis.grammarIssues.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {analysis.grammarIssues.map((issue, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-highlight shrink-0" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-start">
                  <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-highlight shrink-0" />
                  <span className="text-sm">No grammar issues detected. Your language is clear and professional.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
