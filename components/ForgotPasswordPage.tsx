
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface Props {
  onNavigate: (page: string) => void;
}

type Step = 'identify' | 'verify-otp' | 'success';

const ForgotPasswordPage: React.FC<Props> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('identify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppStep = () => {
    if (!email) {
      setError("Informe seu e-mail para identificarmos sua conta.");
      return;
    }
    setError(null);
    const message = `Olá JOBWAY! Preciso recuperar minha senha. Meu e-mail é: ${email}. Por favor, me envie o código de verificação.`;
    window.open(`https://wa.me/5548999999999?text=${encodeURIComponent(message)}`, '_blank');
    setStep('verify-otp');
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError("Insira o código completo de 6 dígitos.");
      return;
    }

    setLoading(true);
    // Simulação de verificação de código via backend/edge function
    // Em um cenário real, você validaria esse código contra uma tabela 'otps' no Supabase
    setTimeout(() => {
      setLoading(false);
      // Para o MVP, aceitamos o código simulado '123456' ou qualquer código de 6 dígitos para fins de demo
      // Em produção, isso dispararia o fluxo de resetPassword do Supabase
      onNavigate('reset-password');
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-slate-50 px-4 animate-fade-in text-slate-900">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
          
          {step === 'identify' && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🔑</div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Recuperar Acesso</h1>
                <p className="text-sm font-medium text-slate-500">
                  Como você prefere receber seu link de recuperação?
                </p>
              </div>

              <form onSubmit={handleEmailReset} className="space-y-6">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    E-mail de Cadastro
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@jobway.com.br"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-green transition-all font-medium text-slate-900"
                  />
                </div>

                <div className="grid gap-4">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Recuperar via E-mail'}
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="px-4 bg-white text-slate-300">OU</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsAppStep}
                    className="w-full py-5 bg-brand-green text-slate-900 rounded-2xl font-black text-lg hover:bg-brand-greenDark shadow-xl shadow-brand-green/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.389l-.72 2.634 2.696-.707c.814.479 1.761.751 2.7.751 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.772-5.767zm3.387 8.192c-.14.394-.712.721-1.164.811-.31.066-.713.118-1.594-.251-1.127-.47-1.851-1.616-1.908-1.691-.056-.075-.469-.624-.469-1.199 0-.575.301-.856.408-.971.108-.115.235-.145.31-.145.075 0 .151 0 .216.006.07.003.162-.026.254.197.092.223.315.769.342.825.027.056.045.121.009.194-.036.072-.054.156-.108.219-.054.063-.112.141-.161.189-.054.053-.109.112-.048.216.06.103.267.44.574.714.395.352.728.461.831.513.103.053.162.044.223-.024.06-.069.257-.301.326-.403.069-.102.138-.087.232-.053.094.033.6.283.704.334.103.051.173.075.197.115.024.04.024.232-.116.626z"/></svg>
                    Receber Código via WhatsApp
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'verify-otp' && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">💬</div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Verifique seu WhatsApp</h2>
              <p className="text-sm font-medium text-slate-500 mb-8">
                Insira abaixo o código de 6 dígitos que enviamos para você.
              </p>

              <div className="flex justify-center gap-2 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-12 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-black text-slate-900 focus:border-brand-green focus:bg-white outline-none transition-all"
                  />
                ))}
              </div>

              {error && (
                <p className="text-rose-500 text-xs font-bold mb-6">{error}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mb-6"
              >
                {loading ? 'Verificando...' : 'Confirmar Código'}
              </button>

              <button 
                onClick={() => setStep('identify')}
                className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
              >
                Tentar outra forma
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">✨</div>
              <h2 className="text-2xl font-black text-slate-900">Link Enviado!</h2>
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] text-emerald-700 text-sm font-bold leading-relaxed">
                Verifique sua caixa de entrada do e-mail cadastrado para prosseguir com a redefinição.
              </div>
              <button 
                onClick={() => onNavigate('login')}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Voltar para o Login
              </button>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-50">
            <button 
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancelar e voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
