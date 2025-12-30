
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { simulateMatch } from '../services/geminiService';
import { MatchResult } from '../types';

interface Props {
  onNavigate: (page: string) => void;
  profile?: any;
}

const DashboardCompany: React.FC<Props> = ({ onNavigate, profile }) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [isCalculating, setIsCalculating] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<MatchResult | null>(null);

  const companyName = profile?.full_name || "Empresa Parceira";
  const companyCity = profile?.city || "Santa Catarina";
  const companyAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0f172a&color=fff&size=128&bold=true`;

  useEffect(() => {
    fetchCompanyJobs();
  }, [profile?.id]);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplications(selectedJobId);
    } else {
      setApplications([]);
    }
  }, [selectedJobId]);

  const fetchCompanyJobs = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs_database')
        .select('*')
        .eq('company_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      
      if (data && data.length > 0) {
        if (!selectedJobId || !data.find(j => j.id === selectedJobId)) {
          setSelectedJobId(data[0].id);
        }
      } else {
        setSelectedJobId(null);
      }
    } catch (err: any) {
      console.error("Erro ao buscar vagas:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    setLoadingApps(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id, 
          status, 
          match_score, 
          compatibility_details, 
          created_at,
          profiles (
            id, 
            full_name, 
            city
          )
        `)
        .eq('job_id', jobId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar candidatos:", err.message);
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJobId) return;
    
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta vaga? Esta ação é irreversível.");
    
    if (confirmDelete) {
      setActionLoading(true);
      try {
        const { error } = await supabase
          .from('jobs_database')
          .delete()
          .eq('id', selectedJobId);

        if (error) throw error;
        
        const remainingJobs = jobs.filter(j => j.id !== selectedJobId);
        setJobs(remainingJobs);
        setSelectedJobId(remainingJobs.length > 0 ? remainingJobs[0].id : null);
        
        alert("Vaga excluída com sucesso.");
      } catch (err: any) {
        alert("Erro ao excluir vaga: " + err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleStartEdit = () => {
    const jobToEdit = jobs.find(j => j.id === selectedJobId);
    if (jobToEdit) {
      setEditFormData({ ...jobToEdit });
      setIsEditing(true);
    }
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('jobs_database')
        .update({
          title: editFormData.title,
          salary: editFormData.salary,
          job_type: editFormData.job_type,
          city: editFormData.city,
          description: editFormData.description
        })
        .eq('id', editFormData.id);

      if (error) throw error;

      // Sincroniza estado local refletindo as mudanças na lista
      const updatedJobs = jobs.map(j => j.id === editFormData.id ? { ...editFormData } : j);
      setJobs(updatedJobs);
      setIsEditing(false);
      alert("Alterações salvas com sucesso!");
    } catch (err: any) {
      alert("Erro ao salvar alterações: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCalculateMatch = async (app: any) => {
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job || !app) return;

    setIsCalculating(app.id);
    try {
      const result = await simulateMatch(job, app.profiles);
      if (result) {
        const { error } = await supabase.from('applications').update({
          match_score: result.score,
          compatibility_details: result
        }).eq('id', app.id);
        
        if (error) throw error;
        await fetchApplications(selectedJobId!);
      }
    } catch (err: any) {
      console.error("Erro no cálculo de match:", err.message);
    } finally {
      setIsCalculating(null);
    }
  };

  const handleOpenAnalysis = (details: MatchResult) => {
    setSelectedAnalysis(details);
    setIsAnalysisModalOpen(true);
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen animate-fade-in text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modal de Análise IA Profunda */}
        {isAnalysisModalOpen && selectedAnalysis && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] relative">
              <button 
                onClick={() => { setIsAnalysisModalOpen(false); setSelectedAnalysis(null); }}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 font-bold p-2 transition-colors"
              >
                Fechar
              </button>

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
                      <span className="text-4xl font-black text-slate-900 leading-none">{selectedAnalysis.score}%</span>
                      <span className="text-[10px] font-black text-brand-greenDark uppercase tracking-widest mt-1">Score de Fit</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-[900] text-slate-900 mb-4 tracking-tight">Parecer IA Detalhado</h2>
                    <p className="text-slate-600 italic font-medium text-lg leading-relaxed bg-brand-green/5 p-6 rounded-3xl border-l-4 border-brand-green">
                      "{selectedAnalysis.aiInsight}"
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-4 h-1 bg-brand-green rounded-full"></span> Breakdown de Compatibilidade
                      </h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Domínio Técnico & Projetos', value: selectedAnalysis.breakdown.tech },
                          { label: 'Soft Skills', value: selectedAnalysis.breakdown.soft },
                          { label: 'Cultura & Valores', value: selectedAnalysis.breakdown.culture },
                          { label: 'Mobilidade SC', value: selectedAnalysis.breakdown.geo },
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
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-5">
                      <h4 className="text-[10px] font-black text-brand-greenDark uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="text-lg">✅</span> Por que este perfil se destaca?
                      </h4>
                      <ul className="space-y-4">
                        {selectedAnalysis.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-sm font-bold">
                            <span className="text-brand-greenDark font-black">✓</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edição (CORRIGIDO) */}
        {isEditing && editFormData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <h2 className="text-3xl font-black text-slate-900">Editar Vaga</h2>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 font-bold transition-colors">Fechar</button>
              </div>
              
              <form onSubmit={handleUpdateJob} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título do Cargo</label>
                  <input 
                    required
                    type="text" 
                    value={editFormData.title}
                    onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-brand-green transition-all font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Salário</label>
                    <input 
                      type="text" 
                      value={editFormData.salary}
                      onChange={e => setEditFormData({...editFormData, salary: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-brand-green transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Modelo</label>
                    <select 
                      value={editFormData.job_type}
                      onChange={e => setEditFormData({...editFormData, job_type: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-brand-green transition-all font-bold"
                    >
                      <option>Presencial</option>
                      <option>Híbrido</option>
                      <option>Remoto (SC)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cidade em SC</label>
                  <input 
                    type="text" 
                    value={editFormData.city}
                    onChange={e => setEditFormData({...editFormData, city: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-brand-green transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descrição</label>
                  <textarea 
                    rows={4}
                    value={editFormData.description}
                    onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-brand-green transition-all resize-none font-medium"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={actionLoading}
                    className="flex-[2] py-5 bg-brand-green text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-greenDark shadow-xl shadow-brand-green/20 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Header de Identidade da Empresa */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <img 
              src={companyAvatar} 
              alt={companyName} 
              className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-xl"
            />
            <div>
              <div className="inline-block bg-brand-dark text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2">Empresa Ativa em SC</div>
              <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">{companyName}</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">📍 Sede: {companyCity}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-green/20 rounded-xl flex items-center justify-center text-xl">💼</div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Minhas Vagas</p>
                <p className="text-xl font-black text-brand-dark">{jobs.length}</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('post-job')}
              className="bg-brand-green text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-brand-greenDark transition-all shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2"
            >
              <span>+</span> Publicar Nova Vaga
            </button>
          </div>
        </div>

        {/* Barra de Ferramentas e Seletor de Vaga */}
        <div className="bg-brand-dark rounded-[2.5rem] p-8 shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <span className="text-brand-green">🤖</span> Gestor de Recrutamento
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Selecione uma vaga para editar, excluir ou ver candidatos.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl border border-white/5 w-full sm:w-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Vaga Atual:</span>
              <select 
                className="bg-transparent border-none rounded-lg px-4 py-2 font-black text-brand-green outline-none text-sm cursor-pointer min-w-[200px]"
                value={selectedJobId || ''}
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                {jobs.map(j => <option key={j.id} value={j.id} className="text-slate-900">{j.title}</option>)}
                {jobs.length === 0 && <option className="text-slate-900">Nenhuma vaga ativa</option>}
              </select>
            </div>
            
            {selectedJobId && (
              <div className="flex gap-2">
                <button 
                  onClick={handleStartEdit}
                  className="p-3.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-xl hover:bg-amber-400 hover:text-brand-dark transition-all flex items-center gap-2 group"
                  title="Editar Vaga"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <span className="text-[10px] font-black uppercase hidden group-hover:inline ml-2">Editar</span>
                </button>
                <button 
                  onClick={handleDeleteJob}
                  disabled={actionLoading}
                  className="p-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 group"
                  title="Excluir Vaga"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  <span className="text-[10px] font-black uppercase hidden group-hover:inline ml-2">Excluir</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Candidatos */}
        <div className="space-y-6">
          {!selectedJobId ? (
             <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
               <span className="text-6xl block mb-6 grayscale opacity-40">📣</span>
               <h3 className="text-xl font-black text-slate-400 mb-2">Suas vagas aparecerão aqui.</h3>
               <p className="text-slate-400 text-sm font-medium">Divulgue vagas para ver os talentos catarinenses.</p>
             </div>
          ) : loadingApps ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
              <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Sincronizando Matches...</p>
            </div>
          ) : applications.length > 0 ? (
            applications.map((app) => {
              const details: MatchResult | null = app.compatibility_details;
              const candidate = app.profiles;
              const hasAnalysis = details && details.behavioralTraits && details.behavioralTraits.length > 0;

              return (
                <div key={app.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-1/4 flex flex-col">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 bg-slate-100 border-2 border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-2xl font-black shadow-inner overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate?.full_name || 'C')}&background=f1f5f9&color=64748b&bold=true`} alt="Avatar" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 leading-tight">{candidate?.full_name || 'Candidato'}</h3>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-tight">📍 {candidate?.city || 'SC'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-6">
                        {(details?.tags || ['Análise Requerida']).map(tag => (
                          <span key={tag} className="bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {!hasAnalysis ? (
                        <button 
                          onClick={() => handleCalculateMatch(app)}
                          disabled={isCalculating === app.id}
                          className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 shadow-lg transition-all disabled:opacity-50"
                        >
                          {isCalculating === app.id ? "Analisando..." : "Gerar Relatório IA"}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOpenAnalysis(details)}
                          className="w-full py-4 bg-white border-2 border-brand-green text-brand-greenDark rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-white transition-all shadow-sm"
                        >
                          Ver Detalhes IA
                        </button>
                      )}
                    </div>

                    <div className="lg:w-2/4 flex flex-col justify-center bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="text-lg">📊</span> Fit Comportamental & Técnico
                        </h4>
                        <span className="text-[10px] font-black text-brand-greenDark uppercase">Match Refinado</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {(details?.behavioralTraits || [
                          {name: 'Proatividade', score: 0},
                          {name: 'Comunicação', score: 0},
                          {name: 'Liderança', score: 0},
                          {name: 'Adaptabilidade', score: 0}
                        ]).map((trait) => (
                          <div key={trait.name} className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                              <span>{trait.name}</span>
                              <span className={trait.score > 70 ? 'text-brand-greenDark' : 'text-slate-400'}>{trait.score}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                              <div 
                                style={{width: `${trait.score}%`}} 
                                className={`h-full transition-all duration-1000 ease-out rounded-full ${trait.score > 75 ? 'bg-brand-green' : trait.score > 45 ? 'bg-amber-400' : 'bg-slate-300'}`}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:w-1/4 flex flex-col items-center justify-center text-center">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full border-8 border-slate-50 flex items-center justify-center shadow-2xl bg-white group-hover:scale-105 transition-transform">
                          <span className="text-4xl font-black text-slate-900">{app.match_score || '0'}%</span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-green text-slate-900 text-[9px] font-black px-3 py-1 rounded-full shadow-lg uppercase">Score</div>
                      </div>
                      <button 
                        onClick={() => window.open(`https://wa.me/5548999999999?text=Olá ${candidate?.full_name}, vimos sua candidatura para ${selectedJob?.title} no JOBWAY!`, '_blank')}
                        className="w-full bg-brand-green text-slate-900 py-4 rounded-2xl font-black text-xs uppercase hover:bg-brand-greenDark shadow-xl shadow-brand-green/20 transition-all flex items-center justify-center gap-2 group-hover:-translate-y-1"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.389l-.72 2.634 2.696-.707c.814.479 1.761.751 2.7.751 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.772-5.767zm3.387 8.192c-.14.394-.712.721-1.164.811-.31.066-.713.118-1.594-.251-1.127-.47-1.851-1.616-1.908-1.691-.056-.075-.469-.624-.469-1.199 0-.575.301-.856.408-.971.108-.115.235-.145.31-.145.075 0 .151 0 .216.006.07.003.162-.026.254.197.092.223.315.769.342.825.027.056.045.121.009.194-.036.072-.054.156-.108.219-.054.063-.112.141-.161.189-.054.053-.109.112-.048.216.06.103.267.44.574.714.395.352.728.461.831.513.103.053.162.044.223-.024.06-.069.257-.301.326-.403.069-.102.138-.087.232-.053.094.033.6.283.704.334.103.051.173.075.197.115.024.04.024.232-.116.626z"/></svg>
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {details?.aiInsight && (
                    <div className="bg-slate-50/80 p-8 md:p-10 border-t border-slate-100 flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex items-center gap-3 shrink-0 mt-1">
                        <div className="w-8 h-8 bg-brand-green/20 rounded-lg flex items-center justify-center text-lg">💡</div>
                        <div className="text-brand-greenDark font-black text-[10px] uppercase tracking-[0.2em]">Parecer da IA</div>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-brand-green/20 pl-6">
                        "{details.aiInsight}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <span className="text-6xl block mb-6 grayscale opacity-40">👥</span>
              <h3 className="text-xl font-black text-slate-400 mb-2">Sem candidaturas ainda.</h3>
              <p className="text-slate-400 text-sm font-medium">Os talentos aparecerão aqui à medida que se candidatarem.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCompany;
