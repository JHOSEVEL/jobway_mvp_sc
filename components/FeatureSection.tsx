
import React from 'react';
import { EMPLOYER_FEATURES, CANDIDATE_FEATURES } from '../constants';

const FeatureSection: React.FC = () => {
  return (
    <section id="solucoes" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* For Employers */}
        <div className="mb-28">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl font-[900] text-slate-900">Para Empresas</h2>
            <div className="h-2 flex-grow bg-slate-100 rounded-full relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full w-1/4 bg-brand-green rounded-full"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {EMPLOYER_FEATURES.map((feat) => (
              <div key={feat.title} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block p-4 bg-white rounded-[1.5rem] shadow-sm">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* For Professionals */}
        <div>
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl font-[900] text-slate-900">Para Profissionais</h2>
            <div className="h-2 flex-grow bg-slate-100 rounded-full relative overflow-hidden">
               <div className="absolute top-0 right-0 h-full w-1/4 bg-brand-green rounded-full"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {CANDIDATE_FEATURES.map((feat) => (
              <div key={feat.title} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block p-4 bg-white rounded-[1.5rem] shadow-sm">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
