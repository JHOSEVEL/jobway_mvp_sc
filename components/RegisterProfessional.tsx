
import React, { useState } from 'react';
import { parseResume } from '../services/geminiService';
import { supabase } from '../services/supabase';

interface Props {
  onNavigate: (page: string) => void;
}

interface Experience {
  role: string;
  company: string;
  period: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

const RegisterProfessional: React.FC<Props> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Florianópolis',
    cep: '',
    mainSkill: '',
    password: '',
    confirmPassword: ''
  });
  const [experiences, setExperiences] = useState<Experience[]>([{ role: '', company: '', period: '' }]);
  const [education, setEducation] = useState<Education[]>([{ degree: '', institution: '', year: '' }]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      const result = await parseResume(base64String, file.type);
      
      if (result) {
        setFormData(prev => ({
          ...prev,
          fullName: result.fullName || prev.fullName,
          email: result.email || prev.email,
          mainSkill: result.mainSkill || prev.mainSkill
        }));
        if (result.experiences) setExperiences(result.experiences);
        if (result.education) setEducation(result.education);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const addExperience = () => setExperiences([...experiences, { role: '', company: '', period: '' }]);
  const addEducation = () => setEducation([...education, { degree: '', institution: '', year: '' }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          alert("Este e-mail já está cadastrado no JOBWAY. Por favor, faça login.");
          onNavigate('login');
          return;
        }
        throw authError;
      }

      if (!authData.user) throw new Error("Erro ao criar usuário.");

      const userId = authData.user.id;

      // 2. Criar Perfil (Removido avatar_url)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email: formData.email,
        full_name: formData.fullName,
        user_type: 'professional',
        city: formData.city
      });

      if (profileError) throw profileError;

      // 3. Criar Dados do Profissional
      const { error: profError } = await supabase.from('professionals').insert({
        id: userId,
        cep: formData.cep,
        main_skill: formData.mainSkill,
        canada_points: 0
      });

      if (profError) throw profError;

      // 4. Inserir Experiências
      const validExperiences = experiences.filter(exp => exp.role && exp.company).map(exp => ({
        professional_id: userId,
        ...exp
      }));

      if (validExperiences.length > 0) {
        await supabase.from('experiences').insert(validExperiences);
      }

      alert("Cadastro realizado com sucesso! Bem-vindo ao JOBWAY.");
      onNavigate('dashboard-professional');
    } catch (err: any) {
      console.error(err);
      alert(`Erro no cadastro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-brand-green/10 text-brand-greenDark px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">Cadastro Talento</div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Seu futuro começa em SC</h1>
          <p className="text-slate-500 font-medium">Suba seu currículo para preenchimento automático ou preencha manualmente.</p>
        </div>

        <div className="mb-12 p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 text-center relative overflow-hidden group hover:border-brand-green transition-all">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,image/*" 
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div className="relative z-0">
            <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">📄</span>
            <p className="font-black text-slate-900 mb-1">Arraste seu currículo ou clique para subir</p>
            <p className="text-sm text-slate-500">Nossa IA preencherá o formulário em segundos</p>
            {loading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-brand-greenDark font-black text-xs uppercase animate-pulse">
                <div className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
                Processando com IA...
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
            <h2 className="text-xl font-black text-slate-900 border-l-4 border-brand-green pl-4">Dados Pessoais & Localização</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                <input 
                  required 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Telefone / WhatsApp</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="(48) 99999-9999"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cidade em SC</label>
                <select 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all"
                >
                  <option>Florianópolis</option>
                  <option>Joinville</option>
                  <option>Blumenau</option>
                  <option>Itajaí</option>
                  <option>Balneário Camboriú</option>
                  <option>Outra</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">CEP (Para Match de Proximidade)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={e => setFormData({...formData, cep: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Principal Competência</label>
              <input 
                required 
                type="text" 
                placeholder="Ex: Desenvolvedor React, Vendedor Externo..." 
                value={formData.mainSkill}
                onChange={e => setFormData({...formData, mainSkill: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all" 
              />
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
            <h2 className="text-xl font-black text-slate-900 border-l-4 border-brand-green pl-4">Segurança da Conta</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Senha</label>
                <input 
                  required 
                  minLength={6}
                  type="password" 
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirmar Senha</label>
                <input 
                  required 
                  type="password" 
                  placeholder="Repita sua senha"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all" 
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 border-l-4 border-brand-green pl-4">Experiência Profissional</h2>
              <button type="button" onClick={addExperience} className="text-brand-greenDark font-black text-xs uppercase hover:underline">+ Adicionar</button>
            </div>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div key={index} className="grid md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Cargo</label>
                    <input 
                      type="text" 
                      value={exp.role}
                      onChange={e => {
                        const newExp = [...experiences];
                        newExp[index].role = e.target.value;
                        setExperiences(newExp);
                      }}
                      className="w-full border-b border-slate-100 outline-none focus:border-brand-green font-bold text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Empresa</label>
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={e => {
                        const newExp = [...experiences];
                        newExp[index].company = e.target.value;
                        setExperiences(newExp);
                      }}
                      className="w-full border-b border-slate-100 outline-none focus:border-brand-green font-bold text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Período</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 2021 - Atual"
                      value={exp.period}
                      onChange={e => {
                        const newExp = [...experiences];
                        newExp[index].period = e.target.value;
                        setExperiences(newExp);
                      }}
                      className="w-full border-b border-slate-100 outline-none focus:border-brand-green font-bold text-sm" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-brand-green text-white rounded-2xl font-black text-lg hover:bg-brand-greenDark shadow-2xl shadow-brand-green/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Finalizar Cadastro e Ver Vagas"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterProfessional;
