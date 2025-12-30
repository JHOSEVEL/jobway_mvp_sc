
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface Props {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const [userType, setUserType] = useState<'professional' | 'company'>('professional');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // No dashboard real, o App.tsx já escuta a mudança de sessão e redireciona
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-slate-50 px-4 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="flex bg-slate-200 p-1.5 rounded-2xl mb-8 shadow-inner">
          <button
            onClick={() => setUserType('professional')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              userType === 'professional' 
                ? 'bg-white text-slate-900 shadow-md' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sou Profissional
          </button>
          <button
            onClick={() => setUserType('company')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              userType === 'company' 
                ? 'bg-brand-dark text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sou Empresa
          </button>
        </div>

        <div className={`p-10 rounded-[3rem] shadow-2xl transition-all duration-500 border ${
          userType === 'professional' 
            ? 'bg-white border-slate-100' 
            : 'bg-brand-dark border-white/5 text-white'
        }`}>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">
              Bem-vindo de volta!
            </h1>
            <p className={`text-sm font-medium ${userType === 'professional' ? 'text-slate-500' : 'text-slate-400'}`}>
              Acesse suas vagas e matches inteligentes em SC.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${userType === 'professional' ? 'text-slate-400' : 'text-slate-500'}`}>
                E-mail
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                className={`w-full px-5 py-4 rounded-xl outline-none border transition-all font-medium ${
                  userType === 'professional'
                    ? 'bg-slate-50 border-slate-200 focus:border-brand-green text-slate-900'
                    : 'bg-white/5 border-white/10 focus:border-brand-green text-white'
                }`}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${userType === 'professional' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Senha
                </label>
                <button 
                  type="button" 
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[10px] font-black uppercase tracking-widest text-brand-greenDark hover:underline"
                >
                  Esqueceu?
                </button>
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-5 py-4 rounded-xl outline-none border transition-all font-medium ${
                  userType === 'professional'
                    ? 'bg-slate-50 border-slate-200 focus:border-brand-green text-slate-900'
                    : 'bg-white/5 border-white/10 focus:border-brand-green text-white'
                }`}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-brand-green text-slate-900 rounded-2xl font-black text-lg hover:bg-brand-greenDark shadow-xl shadow-brand-green/10 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                'Acessar JOBWAY'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`text-xs font-bold ${userType === 'professional' ? 'text-slate-400' : 'text-slate-500'}`}>
              Ainda não tem conta?{' '}
              <button 
                onClick={() => onNavigate('register')}
                className="text-brand-greenDark hover:underline"
              >
                Cadastre-se agora
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
