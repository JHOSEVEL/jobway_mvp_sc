
import React from 'react';
import { CANADA_TASKS } from '../constants';

const CanadaSection: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1200&auto=format&fit=crop" 
              alt="Intercâmbio Canadá" 
              className="rounded-[3rem] shadow-2xl relative z-10 border-4 border-white"
            />
            <div className="absolute top-10 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">🍁</div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Seu Progresso</p>
                <p className="text-lg font-black text-slate-900">2.450 Milhas SC-CA</p>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black mb-6 tracking-widest uppercase">
              O Futuro é Global
            </div>
            <h2 className="text-4xl lg:text-5xl font-[900] text-slate-900 mb-6 leading-tight">
              Trabalhe em SC, <span className="text-red-600">Aterrisse no Canadá.</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">
              Na JOBWAY, cada ação na plataforma aproxima você do seu intercâmbio. Conectamos você às melhores PMEs catarinenses enquanto você constrói seu caminho internacional.
            </p>

            <div className="space-y-4">
              {CANADA_TASKS.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-green transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{task.icon}</span>
                    <span className="font-bold text-slate-700">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-brand-greenDark">+{task.points} pts</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.completed ? 'bg-brand-green text-white' : 'bg-slate-200 text-slate-400'}`}>
                      {task.completed ? '✓' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-10 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl">
              Ver Ranking de Intercâmbio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CanadaSection;
