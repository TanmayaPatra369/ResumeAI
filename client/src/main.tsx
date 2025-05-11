import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "./components/ui/toaster";

// Import Remix icon font
import "remixicon/fonts/remixicon.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
