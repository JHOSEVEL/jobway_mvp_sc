
import React from 'react';
import { VALUES } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-white animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-5xl lg:text-6xl font-[900] text-slate-900 mb-8 leading-tight">
              Nossa Missão é <span className="text-gradient">Fortalecer SC</span>
            </h1>
            <p className="text-xl text-slate-600 mb-6 font-medium leading-relaxed">
              A JOBWAY nasceu da percepção de que Santa Catarina possui um dos ecossistemas mais dinâmicos do mundo, mas que ainda sofre com a desconexão entre talentos e oportunidades locais.
            </p>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Não somos apenas uma plataforma de vagas; somos o elo tecnológico que garante que o crescimento das PMEs catarinenses seja sustentado pelo melhor capital humano da região.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop" 
              className="rounded-[3rem] shadow-3xl"
              alt="Time JOBWAY"
            />
            <div className="absolute -bottom-6 -left-6 bg-brand-green p-8 rounded-3xl text-white shadow-2xl">
              <p className="text-3xl font-black">+2.5k</p>
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Empresas Parceiras</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase">Nossos Valores</h2>
          <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((val) => (
            <div key={val.title} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-brand-green transition-all hover:shadow-xl">
              <span className="text-4xl mb-6 block">{val.icon}</span>
              <h3 className="text-xl font-black text-slate-900 mb-3">{val.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
