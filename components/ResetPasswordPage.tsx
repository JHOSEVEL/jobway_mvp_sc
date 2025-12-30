
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface Props {
  onNavigate: (page: string) => void;
}

const ResetPasswordPage: React.FC<Props> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir senha. O link pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-slate-50 px-4 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🔐</div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Nova Senha</h1>
            <p className="text-sm font-medium text-slate-500">
              Crie uma senha forte para sua segurança no JOBWAY.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-bold">
                Senha redefinida com sucesso! Você já pode acessar sua conta.
              </div>
              <button 
                onClick={() => onNavigate('login')}
                className="w-full py-4 bg-brand-green text-slate-900 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-greenDark shadow-lg transition-all"
              >
                Ir para o Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Nova Senha
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-green transition-all font-medium text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Confirmar Nova Senha
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-green transition-all font-medium text-slate-900"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-5 bg-brand-green text-slate-900 rounded-2xl font-black text-lg hover:bg-brand-greenDark shadow-xl shadow-brand-green/10 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Redefinindo...' : 'Atualizar Senha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
