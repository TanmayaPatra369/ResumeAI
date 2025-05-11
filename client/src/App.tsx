import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EditResume from "@/pages/EditResume";
import { useEffect } from "react";
import { useResumeStore } from "./lib/resumeStore";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/edit" component={EditResume} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { initialize, initialized } = useResumeStore();

  // Initialize the resume store on first load
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
