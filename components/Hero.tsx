
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-greenDark text-xs font-black mb-8 tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
              </span>
              Líder em Recrutamento em SC
            </div>
            <h1 className="text-5xl lg:text-7xl font-[900] text-slate-900 leading-[1.1] mb-8">
              Contrate Talentos em SC em <span className="text-gradient">5 Dias ou até horas</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
              A JOBWAY utiliza IA de ponta para conectar PMEs a profissionais locais com base em competências, cultura e proximidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button className="px-10 py-5 bg-brand-green text-white rounded-2xl font-black text-lg hover:bg-brand-greenDark shadow-2xl shadow-brand-green/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                Sou Empresa
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-brand-green hover:text-brand-green transition-all flex items-center justify-center active:scale-95">
                Sou Profissional
              </button>
            </div>
            <div className="mt-12 flex items-center gap-5 text-sm text-slate-500 font-bold uppercase tracking-wider">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-10 h-10 rounded-full border-4 border-white shadow-lg" src={`https://picsum.photos/seed/person${i}/100/100`} alt="Talento JOBWAY" />
                ))}
              </div>
              <span>+2.500 matches realizados</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-80 h-80 bg-brand-green/15 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop" 
              alt="Ambiente de trabalho catarinense" 
              className="rounded-[3rem] shadow-3xl relative z-10 border border-white/40 grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-8 -right-8 glass-card p-8 rounded-[2rem] shadow-2xl z-20 border border-brand-green/20 animate-bounce-slow">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-brand-green text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900 leading-none mb-1">Match Encontrado!</p>
                  <p className="text-sm font-bold text-brand-greenDark">Vaga preenchida em 14h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
