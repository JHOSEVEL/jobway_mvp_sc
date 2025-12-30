
import React from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-brand-green px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow">
               <span className="text-white font-[900] text-2xl tracking-tight uppercase">JOBWAY</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-wide text-slate-600">
            <button 
              onClick={() => onNavigate('home')} 
              className={`hover:text-brand-greenDark transition-colors ${currentPage === 'home' ? 'text-brand-greenDark font-black' : ''}`}
            >
              Início
            </button>
            <button 
              onClick={() => onNavigate('about')} 
              className={`hover:text-brand-greenDark transition-colors ${currentPage === 'about' ? 'text-brand-greenDark font-black' : ''}`}
            >
              Sobre Nós
            </button>
            <button 
              onClick={() => onNavigate('jobs')} 
              className={`hover:text-brand-greenDark transition-colors ${currentPage === 'jobs' ? 'text-brand-greenDark font-black' : ''}`}
            >
              Vagas SC
            </button>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => onNavigate('login')}
              className={`text-sm font-black transition-colors ${currentPage === 'login' ? 'text-brand-greenDark' : 'text-slate-700 hover:text-brand-greenDark'}`}
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="text-sm font-black bg-brand-green text-white px-8 py-3 rounded-xl hover:bg-brand-greenDark shadow-lg shadow-brand-green/20 transition-all active:scale-95"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
