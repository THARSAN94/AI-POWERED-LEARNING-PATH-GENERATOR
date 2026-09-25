import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FontProvider } from './context/FontContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FontCustomizerModal } from './components/FontCustomizerModal';
import { LandingView } from './views/LandingView';
import { RegisterView } from './views/RegisterView';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { CourseLibraryView } from './views/CourseLibraryView';
import { RoadmapView } from './views/RoadmapView';
import { DailySessionView } from './views/DailySessionView';
import { DailyAssessmentView } from './views/DailyAssessmentView';
import { AssessmentResultView } from './views/AssessmentResultView';
import { PerformanceHistoryView } from './views/PerformanceHistoryView';
import { CertificatesView } from './views/CertificatesView';
import { PublicVerificationView } from './views/PublicVerificationView';
import { ProfileView } from './views/ProfileView';
import { Course, AssessmentSubmissionResult } from './types';
import { api } from './api';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [viewParams, setViewParams] = useState<any>({});
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  // Check URL pathname for deep linking (e.g. /verify/:code)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/verify/')) {
      const code = path.replace('/verify/', '').trim();
      if (code) {
        navigate('verify', { code });
        return;
      }
    }
  }, []);

  // Fetch initial course data for landing page
  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getCourses();
        setFeaturedCourses(res.courses);
      } catch (err) {
        console.error('Failed to load featured courses:', err);
      }
    }
    loadFeatured();
  }, []);

  const navigate = (view: string, params?: any) => {
    setCurrentView(view);
    setViewParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar currentView={currentView} onNavigate={navigate} />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView onNavigate={navigate} featuredCourses={featuredCourses} />
        )}

        {currentView === 'register' && (
          <RegisterView
            onNavigate={navigate}
            onRegisteredSuccess={(email) => navigate('login', { registeredEmail: email })}
          />
        )}

        {currentView === 'login' && (
          <LoginView onNavigate={navigate} registeredEmail={viewParams.registeredEmail} />
        )}

        {currentView === 'dashboard' && (
          <DashboardView onNavigate={navigate} />
        )}

        {currentView === 'courses' && (
          <CourseLibraryView
            onNavigate={navigate}
            onSelectCourseToConfigure={(course) => navigate('course-detail', { course })}
          />
        )}

        {currentView === 'roadmap' && viewParams.pathId && (
          <RoadmapView pathId={viewParams.pathId} onNavigate={navigate} />
        )}

        {currentView === 'daily-session' && viewParams.pathId && viewParams.dayNumber && (
          <DailySessionView
            pathId={viewParams.pathId}
            dayNumber={viewParams.dayNumber}
            onNavigate={navigate}
          />
        )}

        {currentView === 'daily-assessment' && viewParams.pathId && viewParams.dayNumber && (
          <DailyAssessmentView
            pathId={viewParams.pathId}
            dayNumber={viewParams.dayNumber}
            onNavigate={navigate}
            onAssessmentCompleted={(result: AssessmentSubmissionResult) => {
              navigate('assessment-result', {
                pathId: viewParams.pathId,
                dayNumber: viewParams.dayNumber,
                result,
              });
            }}
          />
        )}

        {currentView === 'assessment-result' && viewParams.result && (
          <AssessmentResultView
            pathId={viewParams.pathId}
            dayNumber={viewParams.dayNumber}
            result={viewParams.result}
            onNavigate={navigate}
          />
        )}

        {currentView === 'performance' && (
          <PerformanceHistoryView onNavigate={navigate} />
        )}

        {currentView === 'certificates' && (
          <CertificatesView onNavigate={navigate} selectedCertId={viewParams.certId} />
        )}

        {currentView === 'verify' && (
          <PublicVerificationView initialCode={viewParams.code || ''} onNavigate={navigate} />
        )}

        {currentView === 'profile' && (
          <ProfileView onNavigate={navigate} />
        )}
      </main>

      <Footer onNavigate={navigate} />
      <FontCustomizerModal />
    </div>
  );
}

export default function App() {
  return (
    <FontProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </FontProvider>
  );
}
