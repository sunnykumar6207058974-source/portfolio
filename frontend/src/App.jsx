import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import ParticleBackground from "./components/ParticleBackground";
import ScrollProgressBar from "./components/ScrollProgressBar";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { trackPageView } from "./utils/analytics";

// Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import ResumePage from "./pages/ResumePage";
import AdminDashboard from "./pages/AdminDashboard";
import ClientTrackerPage from "./pages/ClientTrackerPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingFinished = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AnimatePresence mode="wait">
            {isLoading && <LoadingScreen onFinished={handleLoadingFinished} />}
          </AnimatePresence>

        <Router>
          <ScrollToTop />
          <CustomCursor />
          <div className="relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden min-h-screen">
            <ScrollProgressBar />
            <ParticleBackground />
            <div className="relative z-10">
              <Navbar />
              <main id="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/track" element={<ClientTrackerPage />} />
                  <Route path="/track/:trackingCode" element={<ClientTrackerPage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
  );
}

export default App;