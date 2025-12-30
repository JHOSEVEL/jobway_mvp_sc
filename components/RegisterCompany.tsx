
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface Props {
  onNavigate: (page: string) => void;
}

const RegisterCompany: React.FC<Props> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    email: '',
    phone: '',
    cep: '',
    culture: 'Inovação & Agilidade',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      // 1. Auth SignUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          alert("Este e-mail corporativo já está cadastrado. Por favor, faça login.");
          onNavigate('login');
          return;
        }
        throw authError;
      }

      if (!authData.user) throw new Error("Erro na criação do usuário.");

      const userId = authData.user.id;

      // 2. Create Profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email: formData.email,
        full_name: formData.companyName,
        user_type: 'company',
        city: formData.location.split(',').pop()?.trim() || 'SC'
      });

      if (profileError) throw profileError;

      // 3. Create Company Record
      const { error: compError } = await supabase.from('companies').insert({
        id: userId,
        cnpj: formData.cnpj,
        phone: formData.phone,
        cep: formData.cep,
        culture: formData.culture,
        address: formData.location
      });

      if (compError) throw compError;

      alert("Empresa cadastrada com sucesso!");
      onNavigate('dashboard-company');
    } catch (err: any) {
      console.error(err);
      alert(`Erro no cadastro da empresa: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-24 bg-brand-dark min-h-screen text-white animate-fade-in">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-brand-green/20 text-brand-green px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">Portal da Empresa</div>
          <h1 className="text-4xl font-black mb-4 text-white">Contrate os melhores de SC</h1>
          <p className="text-slate-400 font-medium">Recrutamento inteligente para PMEs catarinenses baseado em proximidade.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nome da Empresa (PME)</label>
              <input 
                required 
                type="text" 
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">CNPJ</label>
              <input 
                required 
                type="text" 
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={e => setFormData({...formData, cnpj: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">E-mail Corporativo</label>
              <input 
                required 
                type="email" 
                placeholder="contato@empresa.com.br"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Telefone / WhatsApp</label>
              <input 
                required 
                type="tel" 
                placeholder="(48) 99999-9999"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">CEP da Sede (Match por Geometria)</label>
              <input 
                required 
                type="text" 
                placeholder="00000-000"
                value={formData.cep}
                onChange={e => setFormData({...formData, cep: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Cultura Predominante</label>
              <select 
                value={formData.culture}
                onChange={e => setFormData({...formData, culture: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white"
              >
                <option>Inovação & Agilidade</option>
                <option>Tradição & Estabilidade</option>
                <option>Foco em Resultados</option>
                <option>Foco em Pessoas</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Endereço Completo em SC</label>
            <input 
              required 
              type="text" 
              placeholder="Rua, Número, Bairro, Cidade - SC" 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white" 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Senha de Acesso</label>
              <input 
                required 
                type="password" 
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Confirmar Senha</label>
              <input 
                required 
                type="password" 
                placeholder="Repita sua senha"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-all text-white" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-brand-green text-brand-dark rounded-2xl font-black text-lg hover:bg-brand-greenDark shadow-2xl shadow-brand-green/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar Empresa e Acessar Painel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;
