
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from '../services/supabase';

interface Props {
  onNavigate: (page: string) => void;
  profile?: any;
}

const PostJobPage: React.FC<Props> = ({ onNavigate, profile }) => {
  const [loadingIA, setLoadingIA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [salary, setSalary] = useState('');
  const [generatedData, setGeneratedData] = useState<{
    title: string;
    description: string;
    requirements: string[];
    softSkills: string[];
  } | null>(null);

  const [locationData, setLocationData] = useState({
    city: profile?.city || 'Florianópolis',
    cep: '',
    type: 'Presencial'
  });

  const generateJobDetails = async () => {
    if (!jobRole || userInput.length < 10) {
      alert("Por favor, informe a Função e conte um pouco sobre as atividades para que a IA possa trabalhar.");
      return;
    }

    setLoadingIA(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Aja como um recrutador sênior especialista no mercado de Santa Catarina (SC). 
        Baseado nos seguintes dados, gere uma vaga de emprego completa, profissional e atrativa.
        
        Função desejada: ${jobRole}
        Salário/Faixa: ${salary || 'A combinar'}
        Resumo das atividades: ${userInput}
        Cidade de atuação: ${locationData.city}
        Modelo: ${locationData.type}
        
        O tom deve ser profissional, tecnológico e focado na cultura local de SC.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Título otimizado para a vaga" },
              description: { type: Type.STRING, description: "Descrição detalhada e atrativa da oportunidade" },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de requisitos técnicos" },
              softSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de competências comportamentais" }
            },
            required: ["title", "description", "requirements", "softSkills"]
          }
        }
      });

      if (response.text) {
        setGeneratedData(JSON.parse(response.text));
      }
    } catch (error: any) {
      console.error("Erro ao gerar vaga:", error);
      alert(`Erro na IA: ${error.message || "Tente novamente em instantes."}`);
    } finally {
      setLoadingIA(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      alert("Erro: Sessão do usuário não encontrada. Por favor, faça login novamente.");
      onNavigate('login');
      return;
    }

    if (!generatedData) return;

    setIsSubmitting(true);
    try {
      // Inserindo na tabela jobs_database
      // Nota: Não enviamos o campo 'id' para permitir que o banco use o DEFAULT gen_random_uuid()
      const { error } = await supabase.from('jobs_database').insert({
        company_id: profile.id,
        title: generatedData.title,
        description: generatedData.description,
        salary: salary.trim() || 'A combinar',
        city: locationData.city,
        cep: locationData.cep.trim() || null, // Garante que CEP vazio vá como null se a coluna permitir
        job_type: locationData.type,
        status: 'Ativa',
        requirements: generatedData.requirements,
        soft_skills: generatedData.softSkills
      });

      if (error) {
        throw new Error(error.message);
      }

      alert("Vaga publicada com sucesso na tabela jobs_database!");
      onNavigate('dashboard-company');
    } catch (err: any) {
      console.error("Erro detalhado ao publicar vaga:", err);
      alert(`Erro ao publicar: ${err.message || "Verifique se a tabela 'jobs_database' possui a coluna 'cep' e o ID auto-gerado."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-slate-900 min-h-screen animate-fade-in text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => onNavigate('dashboard-company')}
            className="text-slate-400 hover:text-white font-bold text-sm flex items-center gap-2 transition-colors"
          >
            ← Voltar ao Painel
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-white tracking-tight">Publicar Vaga Inteligente</h1>
            <p className="text-brand-green text-xs font-black uppercase tracking-widest mt-1">IA Powered Recruitment SC</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cidade em SC</label>
                <select 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all"
                  value={locationData.city}
                  onChange={e => setLocationData({...locationData, city: e.target.value})}
                >
                  <option>Florianópolis</option>
                  <option>Joinville</option>
                  <option>Blumenau</option>
                  <option>Itajaí</option>
                  <option>Balneário Camboriú</option>
                  <option>Itapema</option>
                  <option>Chapecó</option>
                  <option>Criciúma</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">CEP da Vaga</label>
                <input 
                  required
                  type="text"
                  placeholder="00000-000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all"
                  value={locationData.cep}
                  onChange={e => setLocationData({...locationData, cep: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Modelo</label>
                <select 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all"
                  value={locationData.type}
                  onChange={e => setLocationData({...locationData, type: e.target.value})}
                >
                  <option>Presencial</option>
                  <option>Híbrido</option>
                  <option>Remoto (SC)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-green/20 to-transparent border border-brand-green/30 p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20 text-6xl rotate-12 pointer-events-none">✨</div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Função / Cargo</label>
                <input 
                  type="text"
                  placeholder="Ex: Gerente de Loja, Dev React..."
                  className="w-full bg-brand-dark/50 border border-brand-green/20 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all font-bold"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Salário Previsto (Opcional)</label>
                <input 
                  type="text"
                  placeholder="Ex: R$ 4.500 ou A combinar"
                  className="w-full bg-brand-dark/50 border border-brand-green/20 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all font-bold"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">O que o profissional fará?</h2>
              <textarea 
                rows={4}
                placeholder="Descreva as principais responsabilidades em poucas palavras..."
                className="w-full bg-brand-dark/50 border border-brand-green/20 rounded-2xl p-6 text-white outline-none focus:border-brand-green transition-all resize-none font-medium text-lg leading-relaxed placeholder:text-slate-600"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
              />
            </div>

            <button 
              type="button"
              onClick={generateJobDetails}
              disabled={loadingIA || !jobRole || userInput.length < 10}
              className="w-full py-5 bg-brand-green text-slate-900 rounded-2xl font-black text-lg hover:bg-brand-greenDark shadow-xl shadow-brand-green/10 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
            >
              {loadingIA ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  Estruturando Vaga Completa...
                </>
              ) : (
                <>✨ Gerar Anúncio Inteligente</>
              )}
            </button>
          </div>

          {generatedData && (
            <div className="animate-fade-in space-y-8">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-l-[12px] border-brand-green text-slate-900">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-brand-greenDark uppercase tracking-[0.3em] block">Anúncio Gerado por IA</span>
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-400 uppercase tracking-widest">Preview</span>
                  </div>
                  <h2 className="text-4xl font-[900] text-slate-900 leading-tight mb-4">{generatedData.title}</h2>
                  <div className="flex flex-wrap gap-4">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      📍 {locationData.city}, SC
                    </span>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      💼 {locationData.type}
                    </span>
                    <span className="text-brand-greenDark font-black uppercase tracking-widest text-[10px] flex items-center gap-2 bg-brand-green/10 px-3 py-1.5 rounded-lg border border-brand-green/20">
                      💰 {salary || 'A combinar'}
                    </span>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">A Oportunidade</h3>
                    <p className="text-slate-700 leading-relaxed font-medium text-lg">{generatedData.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">Requisitos Técnicos</h3>
                      <ul className="space-y-3">
                        {generatedData.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600 font-bold text-sm">
                            <span className="text-brand-green shrink-0">✓</span> {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">Perfil Comportamental</h3>
                      <ul className="space-y-3">
                        {generatedData.softSkills.map((skill, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600 font-bold text-sm">
                            <span className="text-brand-green shrink-0">✨</span> {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => setGeneratedData(null)}
                  disabled={isSubmitting}
                  className="flex-1 py-6 bg-slate-800 text-white rounded-[2rem] font-black text-lg hover:bg-slate-700 transition-all active:scale-95"
                >
                  Editar Dados
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] py-6 bg-brand-green text-slate-900 rounded-[2rem] font-black text-xl hover:bg-brand-greenDark shadow-2xl shadow-brand-green/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      Publicando...
                    </>
                  ) : (
                    <>🚀 Publicar Vaga em Santa Catarina</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
