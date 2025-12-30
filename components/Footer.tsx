
import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 pt-28 pb-14 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2">
            <div className="flex items-center mb-10 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="bg-brand-green px-5 py-2.5 rounded-xl shadow-lg shadow-brand-green/10">
                 <span className="text-white font-[900] text-2xl tracking-tight uppercase">JOBWAY</span>
              </div>
            </div>
            <p className="text-slate-400 max-w-sm mb-12 text-xl leading-relaxed font-medium">
              Conectando o talento local ao futuro global. A plataforma oficial das empresas que crescem em Santa Catarina.
            </p>
            <div className="flex gap-5">
              {['LK', 'IG', 'YT'].map(social => (
                <a key={social} href="#" className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-brand-green hover:border-brand-green hover:text-white transition-all shadow-xl font-black text-xs">
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-10">Santa Catarina</h4>
            <ul className="space-y-6 text-slate-400 font-bold text-sm">
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-brand-green transition-colors">Vagas em Florianópolis</button></li>
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-brand-green transition-colors">Vagas em Joinville</button></li>
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-brand-green transition-colors">Vagas em Blumenau</button></li>
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-brand-green transition-colors">Vagas em Balneário Camboriú</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-10">JOBWAY Tech</h4>
            <ul className="space-y-6 text-slate-400 font-bold text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-brand-green transition-colors">Como funciona</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-brand-green transition-colors">Sobre Nós</button></li>
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-brand-green transition-colors">Buscar Vagas</button></li>
              <li><button className="hover:text-brand-green transition-colors">API para RH</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-slate-500 font-bold">
          <p>© 2024 JOBWAY S.A. Feito com orgulho em SC.</p>
          <div className="flex items-center gap-4">
            <span className="w-3 h-3 bg-brand-green rounded-full shadow-[0_0_10px_rgba(130,224,90,0.5)]"></span>
            <p className="uppercase tracking-widest">De SC para o Mundo</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
