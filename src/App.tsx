import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Home } from "@/pages/Home";
import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/ui/splash-screen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useLenis, smoothScrollTo } from "@/hooks/useLenis";

/** Scrolls to the section named by the URL: "/#projects", or an old page URL like "/projects". */
function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    const id = location.hash.slice(1) || location.pathname.replace(/^\/|\/$/g, "");
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const element = id ? document.getElementById(id) : null;
      smoothScrollTo(element ?? 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [location]);

  return null;
}

function App() {
  useLenis(!useReducedMotion());

  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on first visit or hard refresh, not on navigation
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    return !hasSeenSplash;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <BrowserRouter>
        {!showSplash && <ThemeToggle />}
        <ScrollToSection />
        {/* Everything lives on one page; any path renders it */}
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
