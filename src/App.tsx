/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { QuickThemeModal } from './components/layout/QuickThemeModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { SymptomChecker } from './components/triage/SymptomChecker';
import { HealthMemoryPage } from './components/memory/HealthMemoryPage';
import { ReportUploadPage } from './components/reports/ReportUploadPage';
import { PatientBriefGenerator } from './components/brief/PatientBriefGenerator';
import { DoctorDirectory } from './components/directory/DoctorDirectory';
import { AppointmentsPage } from './components/appointments/AppointmentsPage';
import { EmergencySOSPage } from './components/emergency/EmergencySOSPage';
import { SettingsPage } from './components/settings/SettingsPage';

function MainApp() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedSpecialtyForDirectory, setSelectedSpecialtyForDirectory] = useState<string | undefined>(undefined);

  const navigateToDirectoryWithSpecialty = (specialty?: string) => {
    setSelectedSpecialtyForDirectory(specialty);
    setCurrentTab('directory');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-xs text-gray-500">Initializing 24CareAI Platform...</p>
        </div>
      );
    }

    if (currentTab === 'landing' || (!isAuthenticated && currentTab === 'dashboard')) {
      return (
        <LandingPage
          onExploreDemo={() => setCurrentTab('dashboard')}
          onSignUp={() => setAuthModalOpen(true)}
          onCheckSymptoms={() => setCurrentTab('triage')}
        />
      );
    }

    switch (currentTab) {
      case 'dashboard':
        if (user?.role === 'doctor') return <DoctorDashboard />;
        if (user?.role === 'admin') return <AdminDashboard />;
        return <PatientDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'triage':
        return (
          <SymptomChecker
            onNavigateToSOS={() => setCurrentTab('emergency')}
            onNavigateToDirectory={(spec) => navigateToDirectoryWithSpecialty(spec)}
          />
        );
      case 'memory':
        return <HealthMemoryPage />;
      case 'reports':
        return <ReportUploadPage />;
      case 'brief':
        return <PatientBriefGenerator />;
      case 'directory':
        return (
          <DoctorDirectory
            initialSpecialty={selectedSpecialtyForDirectory}
            onAppointmentBooked={() => setCurrentTab('appointments')}
          />
        );
      case 'appointments':
        return <AppointmentsPage onBookNew={() => setCurrentTab('directory')} />;
      case 'emergency':
        return <EmergencySOSPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <PatientDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openThemeModal={() => setThemeModalOpen(true)}
        openAuthModal={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>

      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

      <QuickThemeModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
