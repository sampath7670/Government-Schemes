import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProfileModal from './components/ProfileModal';
import AIChatModal from './components/AIChatModal';
import DashboardPage from './pages/DashboardPage';
import SchemeExplorerPage from './pages/SchemeExplorerPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import EligibilityCheckPage from './pages/EligibilityCheckPage';
import SourcesPage from './pages/SourcesPage';
import AdminPage from './pages/AdminPage';
import { fetchStates } from './services/api';

export default function App() {
  const [currentProfile, setCurrentProfile] = useState({
    name: 'Anitha',
    age: 15,
    state: 'Andhra Pradesh',
    education_level: 'Class 10',
    class_name: 'Class 10',
    category: 'OBC',
    annual_income: 150000,
    gender: 'Female',
    school_type: 'Government',
    is_pwd: false,
    disability_status: 'No'
  });

  const [statesList, setStatesList] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiSelectedScheme, setAiSelectedScheme] = useState(null);

  useEffect(() => {
    fetchStates().then(setStatesList).catch(console.error);
  }, []);

  const handleOpenAskAI = (scheme = null) => {
    setAiSelectedScheme(scheme);
    setIsAIChatOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar
          currentProfile={currentProfile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />

        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  currentProfile={currentProfile}
                  onOpenProfileModal={() => setIsProfileModalOpen(true)}
                  onAskAI={handleOpenAskAI}
                />
              }
            />
            <Route
              path="/schemes"
              element={
                <SchemeExplorerPage
                  currentProfile={currentProfile}
                  onAskAI={handleOpenAskAI}
                />
              }
            />
            <Route
              path="/schemes/:schemeId"
              element={<SchemeDetailPage onAskAI={handleOpenAskAI} />}
            />
            <Route
              path="/eligibility"
              element={
                <EligibilityCheckPage
                  currentProfile={currentProfile}
                  onOpenProfileModal={() => setIsProfileModalOpen(true)}
                  onAskAI={handleOpenAskAI}
                />
              }
            />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
            <p className="font-bold text-white">AI-Powered Government & Public Service Assistant — Class 10 Student Schemes Module</p>
            <p className="text-slate-400">
              Disclaimer: Scheme information presented is compiled from verified official government portals. Final eligibility determination rests exclusively with the respective issuing authority.
            </p>
            <p className="text-slate-500 text-[11px]">Academic Year 2026-27 • 28 States & 8 Union Territories Data Architecture</p>
          </div>
        </footer>

        {/* Global Modals */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={currentProfile}
          onSaveProfile={setCurrentProfile}
          statesList={statesList}
        />

        <AIChatModal
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
          selectedScheme={aiSelectedScheme}
          currentProfile={currentProfile}
        />
      </div>
    </Router>
  );
}
