
import React from 'react';

interface Props {
  onNavigate: (page: string) => void;
}

const RegisterSelection: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="pt-40 pb-24 min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        <button 
          onClick={() => onNavigate('register-professional')}
          className="group bg-white p-10 rounded-[3rem] border-2 border-transparent hover:border-brand-green shadow-xl transition-all text-left"
        >
          <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">👤</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Sou Profissional</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">Encontre as melhores vagas perto de você em SC e acumule pontos para o Canadá.</p>
          <span className="inline-flex items-center gap-2 text-brand-greenDark font-black uppercase tracking-widest text-sm">
            Criar Perfil Talento →
          </span>
        </button>

        <button 
          onClick={() => onNavigate('register-company')}
          className="group bg-brand-dark p-10 rounded-[3rem] border-2 border-transparent hover:border-brand-green shadow-xl transition-all text-left"
        >
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🏢</div>
          <h2 className="text-3xl font-black text-white mb-4">Sou Empresa</h2>
          <p className="text-slate-400 font-medium leading-relaxed mb-8">Contrate talentos locais com fit cultural garantido em tempo recorde.</p>
          <span className="inline-flex items-center gap-2 text-brand-green font-black uppercase tracking-widest text-sm">
            Cadastrar Minha PME →
          </span>
        </button>
      </div>
    </div>
  );
};

export default RegisterSelection;
