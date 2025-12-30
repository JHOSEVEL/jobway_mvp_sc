
import React from 'react';
import { CITIES } from '../constants';

const CityGrid: React.FC = () => {
  return (
    <section id="cidades" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Inteligência Local</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A inteligência local que entende o mercado catarinense de ponta a ponta.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIES.map((city) => (
            <div key={city.name} className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <img 
                src={city.image} 
                alt={city.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                <p className="text-blue-300 text-sm font-medium">{city.count} vagas ativas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityGrid;
