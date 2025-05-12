import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileEdit,
  FileText,
  ChevronRight,
  Sparkles,
  Brain,
  File,
  Download,
} from "lucide-react";
import { useResumeStore } from "@/lib/resumeStore";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const { initialize, initialized } = useResumeStore();
  const { toast } = useToast();

  // Initialize with default resume if not already initialized
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  const handleCreateResume = (e: React.MouseEvent) => {
    e.preventDefault();
    // Show feedback toast to user
    toast({
      title: "Creating Resume",
      description: "Setting up your new resume...",
    });

    // Initialize with defaults if needed
    if (!initialized) {
      initialize();
    }

    // Use setTimeout to give visual feedback that something is happening
    setTimeout(() => {
      // Force navigation with window.location in case the setLocation isn't working
      window.location.href = "/edit";
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background text-primary-text">
      {/* Header */}
      <header className="py-6 px-6 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-highlight" />
            <h1 className="text-2xl md:text-3xl font-bold">ResumeAI</h1>
          </div>
          <Button
            onClick={handleCreateResume}
            className="bg-highlight text-background hover:bg-opacity-80 transition-colors"
          >
            <FileEdit className="h-4 w-4 mr-2" />
            Create Resume
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Build Your Career with
            <span className="text-highlight ml-2">AI-Powered</span> Resumes
          </h1>
          <p className="text-xl text-secondary-text max-w-2xl mx-auto mb-10">
            Create professional resumes with intelligent suggestions, expert
            templates, and real-time feedback from our ML engine.
          </p>
          <Button
            onClick={handleCreateResume}
            size="lg"
            className="bg-highlight text-background hover:bg-opacity-80 transition-colors text-lg px-8 py-6"
          >
            Start Building <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Intelligent Resume Building
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-highlight bg-opacity-20 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-highlight" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Suggestions</h3>
                <p className="text-secondary-text">
                  Get intelligent recommendations for skills, job descriptions,
                  and achievements based on industry standards.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary-accent bg-opacity-20 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Job Description Analysis
                </h3>
                <p className="text-secondary-text">
                  Match your resume against job descriptions to identify skill
                  gaps and tailor your application.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-secondary-accent bg-opacity-20 flex items-center justify-center mb-4">
                  <File className="h-6 w-6 text-secondary-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Professional Templates
                </h3>
                <p className="text-secondary-text">
                  Choose from a variety of professionally designed templates
                  that stand out to recruiters.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center max-w-3xl">
            Ready to Build a Resume That Gets Noticed?
          </h2>
          <p className="text-xl text-secondary-text max-w-2xl text-center mb-10">
            Start creating your professional resume today with our ML-powered
            tools and stand out from the competition.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              onClick={handleCreateResume}
              size="lg"
              className="bg-highlight text-background hover:bg-opacity-80 transition-colors"
            >
              Create New Resume
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-highlight text-highlight hover:bg-highlight hover:bg-opacity-10 transition-colors"
              onClick={() => {
                toast({
                  title: "LinkedIn Import",
                  description:
                    "LinkedIn import feature will be available in the next update.",
                  variant: "default",
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Import from LinkedIn
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileText className="h-5 w-5 text-highlight" />
              <span className="text-lg font-bold">ResumeAI</span>
            </div>
            <div className="text-sm text-secondary-text">
              © {new Date().getFullYear()} ResumeAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
