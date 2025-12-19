import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";

// Lazy load components for better performance
const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const Achievements = lazy(() => import("./components/Achievements"));
const MediaGallery = lazy(() => import("./components/MediaGallery"));
const Newsletter = lazy(() => import("./components/Newsletter"));
const Footer = lazy(() => import("./components/Footer"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const AdminLogin = lazy(() => import("./admin/Login"));
const AdminDashboard = lazy(() => import("./admin/Dashboard"));

import { storage, STORAGE_KEYS } from "./utils/storage";
import { initializeSeedData } from "./data/seedData";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-soft-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 font-mono text-sm">Loading...</p>
    </div>
  </div>
);

function LandingPage() {
  return (
    <main className="bg-white">
      <Suspense fallback={<PageLoader />}>
        <Hero />
        <About />
        <Achievements />
        <MediaGallery />
        <Newsletter />
        <Footer />
      </Suspense>
    </main>
  );
}

function AdminContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = storage.get(STORAGE_KEYS.ADMIN_SESSION);
    if (session && session.expiresAt > Date.now()) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    setIsAuthenticated(false);
  };

  if (isLoading) return <div className="min-h-screen bg-near-black" />;

  return (
    <Suspense fallback={<PageLoader />}>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      )}
    </Suspense>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  // Initialize seed data on first load
  useEffect(() => {
    initializeSeedData();
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/article/:id"
          element={
            <main className="bg-white">
              <Suspense fallback={<PageLoader />}>
                <ArticlePage />
              </Suspense>
            </main>
          }
        />
        <Route path="/admin-tqv-control" element={<AdminContainer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
