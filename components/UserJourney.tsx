
import React from 'react';

const UserJourney: React.FC = () => {
  const steps = [
    { title: 'Match de Proximidade', desc: 'IA localiza talentos no seu bairro ou cidade em SC.', color: 'bg-brand-green' },
    { title: 'Análise de Fit', desc: 'Termômetro de cultura alinha valores e soft skills.', color: 'bg-brand-green' },
    { title: 'Top 3 em 5 Dias', desc: 'Receba os finalistas prontos para contratação.', color: 'bg-brand-greenDark' },
    { title: 'Milhas Canadá', desc: 'Contratação gera pontos para o intercâmbio do talento.', color: 'bg-red-500' }
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-[900] text-slate-900 mb-4 uppercase tracking-tighter">A Jornada JOBWAY</h2>
          <p className="text-slate-500 font-bold">Simplicidade tecnológica focada no ecossistema catarinense.</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          <div className="grid lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-4 transition-all duration-500">
                <div className={`w-14 h-14 ${step.color} text-white rounded-2xl flex items-center justify-center mb-6 text-xl font-black shadow-xl`}>
                  {idx + 1}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserJourney;
