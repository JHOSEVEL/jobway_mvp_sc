
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Job, MatchResult } from '../types';
import { simulateMatch } from '../services/geminiService';

interface Props {
  profile?: any;
  onNavigate: (page: string) => void;
}

const JobsPage: React.FC<Props> = ({ profile, onNavigate }) => {
  const [filter, setFilter] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  // States para o Modal de Análise
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<MatchResult | null>(null);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs_database')
        .select('*')
        .eq('status', 'Ativa')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar vagas:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAnalysis = async (job: Job) => {
    if (!profile) {
      alert("Para ver sua análise de match, você precisa estar logado!");
      onNavigate('login');
      return;
    }
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

  const handleApply = async (job: Job) => {
    if (!profile) {
      alert("Para se candidatar, você precisa estar logado!");
      onNavigate('login');
      return;
    }

    if (profile.user_type !== 'professional') {
      alert("Apenas perfis de profissionais podem se candidatar.");
      return;
    }

    setIsApplying(job.id);
    try {
      const { error: applyError } = await supabase.from('applications').insert({
        id: crypto.randomUUID(), 
        job_id: job.id,
        professional_id: profile.id,
        status: 'pending',
        match_score: Math.floor(Math.random() * (95 - 75) + 75),
        compatibility_details: {},
        traits: []
      });

      if (applyError && applyError.code !== '23505') throw applyError;

      const userName = profile.full_name || "Candidato(a)";
      const text = `Olá! Sou o(a) ${userName}. Me candidatei à vaga de "${job.title}" em ${job.city} através do JOBWAY e gostaria de dar continuidade ao processo seletivo!`;
      
      window.open(`https://wa.me/5548999999999?text=${encodeURIComponent(text)}`, '_blank');
      
      if (applyError?.code === '23505') {
        alert("Você já se candidatou para esta vaga! Abrindo WhatsApp novamente...");
      }
    } catch (err: any) {
      console.error("Erro na candidatura:", err.message);
      alert("Erro ao processar candidatura: " + err.message);
    } finally {
      setIsApplying(null);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(filter.toLowerCase()) ||
    job.city.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 bg-slate-50 animate-fade-in min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modal de Análise IA para Busca de Vagas */}
        {isAnalysisModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] relative">
              <button 
                onClick={() => { setIsAnalysisModalOpen(false); setSelectedAnalysis(null); }}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 font-bold p-2"
              >
                Fechar
              </button>

              {isGeneratingAnalysis ? (
                <div className="py-20 flex flex-col items-center justify-center gap-6">
                  <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                    <h3 className="text-xl font-black text-slate-900">Calculando seu Match...</h3>
                    <p className="text-slate-500 font-medium">Nossa IA está comparando seu perfil com os requisitos da vaga.</p>
                  </div>
                </div>
              ) : selectedAnalysis ? (
                <div className="animate-fade-in space-y-10">
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
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900">{selectedAnalysis.score}%</span>
                        <span className="text-[10px] font-black text-brand-greenDark uppercase tracking-widest mt-1">Match IA</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-[900] text-slate-900 mb-4">Análise Detalhada</h2>
                      <p className="text-slate-600 italic font-medium text-lg leading-relaxed">"{selectedAnalysis.aiInsight}"</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Fit Comportamental</h4>
                      <div className="space-y-5">
                        {selectedAnalysis.behavioralTraits.map(trait => (
                          <div key={trait.name} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-600">
                              <span>{trait.name}</span>
                              <span>{trait.score}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-green transition-all duration-1000" style={{width: `${trait.score}%`}}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-brand-greenDark uppercase tracking-widest">Seus Diferenciais</h4>
                        <ul className="space-y-3">
                          {selectedAnalysis.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                              <span className="text-brand-green">✓</span> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Atenção Necessária</h4>
                        <ul className="space-y-3">
                          {selectedAnalysis.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                              <span className="text-amber-500">!</span> {con}
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-[900] text-slate-900 mb-2 text-gradient">Vagas em Santa Catarina</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Conectando você às melhores PMEs da região</p>
          </div>
          <div className="relative max-w-md w-full">
            <input 
              type="text" 
              placeholder="Filtrar por cargo ou cidade..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm focus:ring-2 focus:ring-brand-green outline-none transition-all font-medium"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Sincronizando Oportunidades...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-lg hover:border-brand-green/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-brand-green/10 text-brand-greenDark text-[10px] font-black rounded-full uppercase tracking-widest">{job.job_type}</span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest">🔒 Confidencial</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-brand-greenDark transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-bold text-sm mb-4 lg:mb-0">
                    <span className="flex items-center gap-2">📍 {job.city}, SC</span>
                    <span className="flex items-center gap-2 text-brand-greenDark font-black">💰 {job.salary}</span>
                  </div>
                  <button 
                    onClick={() => handleOpenAnalysis(job)}
                    className="mt-4 text-[10px] font-black text-brand-greenDark uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                  >
                    Ver Análise de Match IA 🤖 →
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleApply(job)}
                    disabled={isApplying === job.id}
                    className="whitespace-nowrap px-8 py-4 bg-brand-green text-slate-900 rounded-xl font-black hover:bg-brand-greenDark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isApplying === job.id ? (
                      <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : "Candidatar-se via WhatsApp"}
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <span className="text-6xl mb-6 block">🔍</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhuma vaga encontrada</h3>
                <p className="text-slate-500 font-medium">Tente outro filtro ou volte mais tarde!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
