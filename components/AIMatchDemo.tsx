
import React, { useState } from 'react';
import { simulateMatch } from '../services/geminiService';
import { MatchResult } from '../types';

const AIMatchDemo: React.FC = () => {
  const [job, setJob] = useState('');
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleMatch = async () => {
    if (!job || !profile) return;
    setLoading(true);
    const data = await simulateMatch(job, profile);
    setResult(data);
    setLoading(false);
  };

  return (
    <section className="py-28 bg-brand-dark text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="green-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#82e05a" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#green-grid)" />
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-[900] mb-6">Match de IA em Tempo Real</h2>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto font-medium">Nossa inteligência entende as nuances regionais de SC para sugerir a combinação perfeita.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-5 space-y-8 bg-slate-900/50 p-10 rounded-[3rem] border border-white/5">
            <div className="space-y-4">
              <label className="text-xs font-black text-brand-green uppercase tracking-[0.3em]">Descrição da Vaga</label>
              <textarea 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-[1.5rem] p-5 text-white focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all min-h-[160px] text-base resize-none"
                placeholder="Ex: Desenvolvedor Senior em Blumenau, salário compatível com mercado tech de SC..."
                value={job}
                onChange={(e) => setJob(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-brand-green uppercase tracking-[0.3em]">Perfil Profissional</label>
              <textarea 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-[1.5rem] p-5 text-white focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all min-h-[160px] text-base resize-none"
                placeholder="Ex: Residente em Joinville, 8 anos de experiência com indústria têxtil e tech..."
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              />
            </div>
            <button 
              onClick={handleMatch}
              disabled={loading || !job || !profile}
              className="w-full py-5 gradient-primary rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(130,224,90,0.4)] transition-all disabled:opacity-50 disabled:grayscale active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-4">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sincronizando...
                </span>
              ) : 'Verificar Match'}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-12 flex flex-col justify-center min-h-[550px] shadow-3xl">
            {result ? (
              <div className="space-y-12 animate-fade-in">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="relative shrink-0">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-800" />
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="14" fill="transparent" 
                        strokeDasharray={553}
                        strokeDashoffset={553 - (553 * result.score) / 100}
                        strokeLinecap="round"
                        className="text-brand-green transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black">{result.score}%</span>
                      <span className="text-xs font-black text-brand-green uppercase tracking-[0.2em] mt-2">Score de Fit</span>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-3xl font-black mb-4">Relatório IA</h4>
                    {/* Fixed property name from compatibilityDetails to aiInsight to match MatchResult interface */}
                    <p className="text-slate-300 leading-relaxed italic text-xl font-medium">"{result.aiInsight}"</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6 bg-brand-green/5 p-8 rounded-[2rem] border border-brand-green/20">
                    <p className="text-sm font-black text-brand-green uppercase tracking-widest flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-brand-green rounded-full shadow-[0_0_10px_rgba(130,224,90,0.8)]"></div>
                      Pontos de Sucesso
                    </p>
                    <ul className="space-y-4">
                      {/* Fixed: pros now correctly exists on the MatchResult type */}
                      {result.pros.map(p => (
                        <li key={p} className="text-base text-slate-300 flex items-start gap-3 font-medium">
                          <span className="text-brand-green font-black">✓</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6 bg-yellow-500/5 p-8 rounded-[2rem] border border-yellow-500/20">
                    <p className="text-sm font-black text-yellow-500 uppercase tracking-widest flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
                      Ajustes Recomendados
                    </p>
                    <ul className="space-y-4">
                      {/* Fixed: cons now correctly exists on the MatchResult type */}
                      {result.cons.map(c => (
                        <li key={c} className="text-base text-slate-300 flex items-start gap-3 font-medium">
                          <span className="text-yellow-500 font-black">!</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8 py-10">
                <div className="w-32 h-32 bg-brand-green/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-brand-green/20">
                  <svg className="w-16 h-16 text-brand-green animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black">Pronto para a Análise</h3>
                <p className="text-slate-400 max-w-md mx-auto text-lg font-medium">Aguardando entrada de dados para processar o match regional catarinense.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIMatchDemo;
