
import React, { useState, useEffect } from 'react';
import { CANADA_TASKS } from '../constants';
import { supabase } from '../services/supabase';
import { simulateMatch } from '../services/geminiService';
import { MatchResult } from '../types';

interface Props {
  onNavigate: (page: string) => void;
  profile?: any;
}

const DashboardProfessional: React.FC<Props> = ({ onNavigate, profile }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(true);
  
  // States para o Modal de Análise
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<MatchResult | null>(null);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  const userName = profile?.full_name || "Talento";
  const userCity = profile?.city || "Sua Cidade";
  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=82e05a&color=fff&size=128`;
  
  const GOAL_POINTS = 5000; 
  const progressPercentage = Math.min((points / GOAL_POINTS) * 100, 100);

  useEffect(() => {
    if (profile?.id) {
      fetchRecommendedJobs();
      fetchUserPoints();
    }
  }, [userCity, profile?.id]);

  const fetchUserPoints = async () => {
    setLoadingPoints(true);
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('canada_points')
        .eq('id', profile.id)
        .single();
      
      if (error) throw error;
      setPoints(data?.canada_points || 0);
    } catch (err) {
      console.error("Erro ao buscar pontos:", err);
    } finally {
      setLoadingPoints(false);
    }
  };

  const fetchRecommendedJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs_database')
        .select('*')
        .eq('status', 'Ativa')
        .limit(10);

      if (error) throw error;

      const processed = (data || []).map(job => ({
        ...job,
        matchScore: job.city === userCity ? 95 : 78,
      })).sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);

      setJobs(processed);
    } catch (err: any) {
      console.error("Erro ao buscar recomendações:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAnalysis = async (job: any) => {
    setIsGeneratingAnalysis(true);
    setIsAnalysisModalOpen(true);
    try {
      const analysis = await simulateMatch(job, profile);
      setSelectedAnalysis(analysis);
    } catch (err) {
      console.error("Erro ao gerar análise:", err);
      setIsAnalysisModalOpen(false);
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const handleApply = async (job: any) => {
    if (!profile) return;
    
    setIsApplying(job.id);
    try {
      const { error: applyError } = await supabase.from('applications').insert({
        id: crypto.randomUUID(),
        job_id: job.id,
        professional_id: profile.id,
        status: 'pending',
        match_score: job.matchScore || 85,
        compatibility_details: {},
        traits: []
      });

      if (applyError && applyError.code !== '23505') throw applyError;

      const newPoints = points + 50;
      await supabase.from('professionals').update({ canada_points: newPoints }).eq('id', profile.id);
      setPoints(newPoints);

      const text = `Olá! Sou o(a) ${userName} e acabo de me candidatar à vaga de "${job.title}" em ${job.city} através do JOBWAY. Tenho interesse em conversar sobre a oportunidade!`;
      const whatsappUrl = `https://wa.me/5548999999999?text=${encodeURIComponent(text)}`;
      
      window.open(whatsappUrl, '_blank');
      
      if (applyError?.code === '23505') {
        alert("Você já se candidatou! Abrindo o WhatsApp novamente...");
      }
    } catch (err: any) {
      console.error("Erro ao candidatar:", err.message || err);
      alert("Houve um erro ao processar sua candidatura: " + err.message);
    } finally {
      setIsApplying(null);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modal de Análise IA Premium */}
        {isAnalysisModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] relative">
              <button 
                onClick={() => { setIsAnalysisModalOpen(false); setSelectedAnalysis(null); }}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 font-bold p-2 transition-colors"
              >
                Fechar
              </button>

              {isGeneratingAnalysis ? (
                <div className="py-20 flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-slate-900">IA Gerando Relatório Detalhado...</h3>
                    <p className="text-slate-500 font-medium">Analisando fit cultural, técnico e geográfico em SC.</p>
                  </div>
                </div>
              ) : selectedAnalysis ? (
                <div className="animate-fade-in space-y-12">
                  <div className="flex flex-col md:flex-row items-center gap-10 border-b border-slate-100 pb-10">
                    <div className="relative shrink-0">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                        <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" 
                          strokeDasharray={465}
                          strokeDashoffset={465 - (465 * selectedAnalysis.score) / 100}
                          strokeLinecap="round"
                          className="text-brand-green transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-black text-slate-900">{selectedAnalysis.score}%</span>
                        <span className="text-[10px] font-black text-brand-greenDark uppercase tracking-widest mt-1">Match Global</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-[900] text-slate-900 mb-4 tracking-tight">O que a JOBWAY IA diz sobre isso</h2>
                      <p className="text-slate-600 italic font-medium text-lg leading-relaxed bg-brand-green/5 p-6 rounded-3xl border-l-4 border-brand-green">
                        "{selectedAnalysis.aiInsight}"
                      </p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className="w-4 h-1 bg-brand-green rounded-full"></span> Breakdown do Match
                        </h4>
                        <div className="space-y-4">
                          {[
                            { label: 'Match Técnico', value: selectedAnalysis.breakdown.tech },
                            { label: 'Soft Skills', value: selectedAnalysis.breakdown.soft },
                            { label: 'Cultura & Valores', value: selectedAnalysis.breakdown.culture },
                            { label: 'Proximidade (SC)', value: selectedAnalysis.breakdown.geo },
                          ].map((item) => (
                            <div key={item.label} className="space-y-2">
                              <div className="flex justify-between text-[11px] font-black text-slate-700 uppercase">
                                <span>{item.label}</span>
                                <span className="text-brand-greenDark">{item.value}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-brand-green transition-all duration-1000" style={{width: `${item.value}%`}}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className="w-4 h-1 bg-brand-green rounded-full"></span> Traços Identificados
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedAnalysis.behavioralTraits.map(trait => (
                            <div key={trait.name} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase">{trait.name}</span>
                                <span className="text-[10px] font-black text-brand-greenDark">{trait.score}%</span>
                              </div>
                              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-green" style={{width: `${trait.score}%`}}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-brand-greenDark uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className="text-lg">🌟</span> Pontos Fortes do Perfil
                        </h4>
                        <ul className="space-y-4">
                          {selectedAnalysis.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-sm font-bold">
                              <span className="text-brand-greenDark font-black">✓</span> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className="text-lg">📈</span> Oportunidades de Melhoria
                        </h4>
                        <ul className="space-y-4">
                          {selectedAnalysis.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm font-bold">
                              <span className="text-amber-500 font-black">!</span> {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <img 
              src={userAvatar} 
              alt={userName} 
              className="w-20 h-20 rounded-3xl border-4 border-white shadow-xl bg-brand-green"
            />
            <div>
              <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">Olá, {userName.split(' ')[0]}! 🚀</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Seu Painel de Oportunidades em {userCity}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-4 group cursor-help transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">🍁</div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Milhas Acumuladas</p>
                <p className="text-xl font-black text-slate-900">
                  {loadingPoints ? "..." : points.toLocaleString()} <span className="text-xs text-slate-400 font-bold tracking-normal lowercase">pts</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            
            {/* Canada Progress Widget */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      Missão Canadá <span className="text-rose-600">🍁</span>
                    </h2>
                    <p className="text-sm font-bold text-slate-500">Acumule pontos para destravar seu intercâmbio.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Próximo Nível: Passaporte Bronze</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progresso do Nível</span>
                    <span className="text-lg font-black text-rose-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner p-1">
                    <div 
                      style={{ width: `${progressPercentage}%` }}
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full shadow-lg shadow-rose-500/20 transition-all duration-1000 ease-out"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <span>{points} PONTOS</span>
                    <span>META: {GOAL_POINTS} PONTOS</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Candidaturas</p>
                    <p className="text-lg font-black text-slate-900">+50 <span className="text-[10px]">pts</span></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Entrevistas</p>
                    <p className="text-lg font-black text-slate-900">+500 <span className="text-[10px]">pts</span></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Contratação</p>
                    <p className="text-lg font-black text-slate-900">+2k <span className="text-[10px]">pts</span></p>
                  </div>
                  <div className="bg-rose-500 p-4 rounded-2xl text-center text-white cursor-pointer hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20">
                    <p className="text-[10px] font-black uppercase mb-1">Dicas</p>
                    <p className="text-xs font-bold">Ganhe Mais</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <h2 className="text-2xl font-black text-slate-900">Vagas Recomendadas</h2>
                <button onClick={() => onNavigate('jobs')} className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">Ver Todas</button>
              </div>

              {loading ? (
                <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="grid gap-6">
                  {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="group p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-brand-green/30 hover:bg-white hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-white border border-slate-200 text-slate-400 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">{job.job_type}</span>
                          <span className="text-brand-greenDark text-[10px] font-black">{job.matchScore}% Match</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-brand-greenDark transition-colors">{job.title}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase">📍 {job.city}, SC • 💰 {job.salary}</p>
                        
                        <button 
                          onClick={() => handleOpenAnalysis(job)}
                          className="mt-4 text-[10px] font-black text-brand-greenDark uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                        >
                          Ver Análise IA 🤖 →
                        </button>
                      </div>
                      <button 
                        onClick={() => handleApply(job)}
                        disabled={isApplying === job.id}
                        className="whitespace-nowrap w-full md:w-auto px-8 py-5 bg-brand-green text-slate-900 rounded-2xl font-black text-sm hover:bg-brand-greenDark transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-brand-green/10"
                      >
                        {isApplying === job.id ? (
                          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>Candidatar-se</>
                        )}
                      </button>
                    </div>
                  )) : (
                    <p className="text-center py-12 text-slate-400 font-bold">Nenhuma vaga recomendada no momento.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-brand-dark to-slate-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 text-6xl group-hover:rotate-12 transition-transform">🇨🇦</div>
              <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Tasks de Pontuação</h2>
              <p className="text-slate-400 text-sm font-bold mb-8">Complete as missões para acelerar seu embarque.</p>
              <div className="space-y-4 mb-10">
                {CANADA_TASKS.map(task => (
                  <div key={task.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${task.completed ? 'bg-brand-green/10 border-brand-green/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{task.icon}</span>
                      <span className={`text-xs font-bold ${task.completed ? 'text-brand-green' : 'text-slate-300'}`}>{task.title}</span>
                    </div>
                    <span className={`text-[10px] font-black ${task.completed ? 'text-brand-green' : 'text-slate-500'}`}>
                      {task.completed ? 'CONCLUÍDO' : `+${task.points} pts`}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-brand-green text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-brand-greenDark shadow-lg shadow-brand-green/20">Ver Ranking Global</button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Apoio ao Talento SC</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                Dúvidas sobre como funciona a pontuação ou vistos para o Canadá? Fale com nosso consultor.
              </p>
              <button className="w-full py-3 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:border-brand-green hover:text-brand-greenDark transition-all">
                Dúvidas Frequentes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfessional;
