
import React from 'react';

const Stats: React.FC = () => {
  return (
    <section className="py-28 gradient-primary overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-20">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-5xl lg:text-7xl font-[900] mb-10 leading-[1.1] tracking-tight">
              Ajudando SC a vencer o apagão de talentos.
            </h2>
            <p className="text-2xl text-white/90 mb-12 leading-relaxed font-bold">
              84% das empresas no estado enfrentam dificuldades para contratar. Nós encurtamos esse caminho com IA.
            </p>
            <div className="grid grid-cols-2 gap-16">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20">
                <p className="text-6xl font-black mb-2 tracking-tighter">5 Dias</p>
                <p className="text-white/80 text-sm font-black uppercase tracking-widest">Contratação Média</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20">
                <p className="text-6xl font-black mb-2 tracking-tighter">R$ 9,99</p>
                <p className="text-white/80 text-sm font-black uppercase tracking-widest">Preço por Vaga</p>
              </div>
            </div>
          </div>
          
          <div className="relative group w-full md:w-auto">
            <div className="absolute inset-0 bg-white/30 rounded-[4rem] blur-[60px] group-hover:bg-white/40 transition-all duration-700"></div>
            <div className="relative bg-white text-brand-dark p-14 rounded-[4rem] shadow-4xl flex flex-col items-center text-center max-w-sm mx-auto border border-white/50">
              <div className="w-24 h-24 bg-brand-green/20 rounded-full flex items-center justify-center mb-8">
                <span className="text-6xl">✨</span>
              </div>
              <p className="text-sm font-black text-brand-greenDark uppercase tracking-[0.4em] mb-4">Novo Padrão</p>
              <h3 className="text-3xl font-[900] mb-10 leading-tight">Escala seu time com quem entende de SC.</h3>
              <button className="w-full py-6 bg-brand-dark text-white rounded-[1.5rem] font-black text-xl hover:bg-slate-800 shadow-2xl transition-all hover:-translate-y-2 active:scale-95">
                Começar agora
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos Decorativos */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
    </section>
  );
};

export default Stats;
