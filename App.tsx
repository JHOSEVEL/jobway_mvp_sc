
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CityGrid from './components/CityGrid';
import FeatureSection from './components/FeatureSection';
import UserJourney from './components/UserJourney';
import CanadaSection from './components/CanadaSection';
import Stats from './components/Stats';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import JobsPage from './components/JobsPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import RegisterSelection from './components/RegisterSelection';
import RegisterProfessional from './components/RegisterProfessional';
import RegisterCompany from './components/RegisterCompany';
import DashboardProfessional from './components/DashboardProfessional';
import DashboardCompany from './components/DashboardCompany';
import PostJobPage from './components/PostJobPage';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    // Ouvir mudanças na auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        // Se o evento for PASSWORD_RECOVERY, redireciona para reset-password
        if (_event === 'PASSWORD_RECOVERY') {
          setCurrentPage('reset-password');
        }
      } else {
        setProfile(null);
        if (currentPage !== 'reset-password' && currentPage !== 'forgot-password') {
          setCurrentPage('home');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
      if (currentPage === 'home' || currentPage === 'login') {
        setCurrentPage(data.user_type === 'professional' ? 'dashboard-professional' : 'dashboard-company');
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'jobs':
        return <JobsPage profile={profile} onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={setCurrentPage} />;
      case 'reset-password':
        return <ResetPasswordPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterSelection onNavigate={setCurrentPage} />;
      case 'register-professional':
        return <RegisterProfessional onNavigate={setCurrentPage} />;
      case 'register-company':
        return <RegisterCompany onNavigate={setCurrentPage} />;
      case 'dashboard-professional':
        return <DashboardProfessional onNavigate={setCurrentPage} profile={profile} />;
      case 'dashboard-company':
        return <DashboardCompany onNavigate={setCurrentPage} profile={profile} />;
      case 'post-job':
        return <PostJobPage onNavigate={setCurrentPage} profile={profile} />;
      default:
        return (
          <>
            <Hero />
            <UserJourney />
            <CityGrid />
            <FeatureSection />
            <CanadaSection />
            <Stats />
          </>
        );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-green selection:text-white">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      {session && (
        <div className="fixed top-24 right-8 z-[60]">
          <button 
            onClick={handleLogout}
            className="bg-white/80 backdrop-blur border border-slate-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"
          >
            Sair da Conta
          </button>
        </div>
      )}
      <main>
        {renderContent()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
