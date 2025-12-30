
import React from 'react';

export const CITIES = [
  { name: 'Florianópolis', image: 'https://www.quintoandar.com.br/guias/wp-content/uploads/2019/03/melhores-bairros-de-florianopolis-1-scaled.webp', count: 1240 },
  { name: 'Joinville', image: 'https://www.incorposul.com.br/wp-content/uploads/2019/10/vantagens-de-morar-em-joinville.jpg', count: 980 },
  { name: 'Blumenau', image: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?q=80&w=800&auto=format&fit=crop', count: 750 },
  { name: 'Itajaí', image: 'https://cdn.myside.com.br/base/44e/215/cff/praia-brava-itajai.jpg', count: 620 },
  { name: 'Itapema', image: 'https://site-arquivos-prod.s3.sa-east-1.amazonaws.com/blog/3435/55610710-b873-4383-a82c-eeb9e54d3385', count: 340 },
  { name: 'Balneário Camboriú', image: 'https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?q=80&w=800&auto=format&fit=crop', count: 890 },
];

export const JOBS_DATABASE = [
  { id: 1, title: 'Desenvolvedor Full Stack Sênior', company: 'TechFloripa PME', city: 'Florianópolis', salary: 'R$ 12.000 - 16.000', category: 'TI', type: 'Presencial' },
  { id: 2, title: 'Gerente de Vendas Têxtil', company: 'Fios de Blumenau', city: 'Blumenau', salary: 'R$ 8.000 + Comissões', category: 'Vendas', type: 'Híbrido' },
  { id: 3, title: 'Analista de Logística Portuária', company: 'Porto Seguro SC', city: 'Itajaí', salary: 'R$ 5.500', category: 'Logística', type: 'Presencial' },
  { id: 4, title: 'Engenheiro de Produção', company: 'Joinville Metais', city: 'Joinville', salary: 'A combinar', category: 'Engenharia', type: 'Presencial' },
  { id: 5, title: 'Designer de UX/UI', company: 'CreativeBC', city: 'Balneário Camboriú', salary: 'R$ 7.000', category: 'Design', type: 'Remoto (SC)' },
  { id: 6, title: 'Recepcionista Bilíngue', company: 'Hotel Oceano', city: 'Itapema', salary: 'R$ 3.200', category: 'Hospitalidade', type: 'Presencial' },
];

export const VALUES = [
  { title: 'Inovação Regional', desc: 'Acreditamos no potencial tecnológico de Santa Catarina como motor do Brasil.', icon: '💡' },
  { title: 'Transparência IA', desc: 'Nossos algoritmos são éticos e focados no desenvolvimento humano real.', icon: '🛡️' },
  { title: 'Impacto Social', desc: 'Trabalho perto de casa significa mais tempo com a família e menos poluição.', icon: '🌱' },
  { title: 'Foco no Talento', desc: 'O profissional é o centro. O sucesso da empresa é consequência.', icon: '⭐' },
];

export const EMPLOYER_FEATURES = [
  {
    title: 'Geolocalização Ativa',
    description: 'Priorizamos candidatos em um raio de até 15km da sua empresa em SC, reduzindo turnover e custos.',
    icon: '📍'
  },
  {
    title: 'Termômetro Cultural',
    description: 'Nossa IA analisa 12 traços comportamentais para garantir que o candidato vibre na mesma sintonia da sua PME.',
    icon: '🌡️'
  },
  {
    title: 'Contratação em 5 Dias ou ate mesmo horas',
    description: 'Fluxo otimizado para que a vaga seja preenchida com qualidade técnica e cultural em tempo recorde.',
    icon: '⚡'
  }
];

export const CANADA_TASKS = [
  { id: '1', title: 'Perfil 100% Completo', points: 500, icon: '👤', completed: true },
  { id: '2', title: 'Cursos Realizados', points: 1000, icon: '🤝', completed: false },
  { id: '3', title: 'Indicar Amigos em SC', points: 300, icon: '📣', completed: false },
  { id: '4', title: 'Badge de Soft Skills', points: 750, icon: '🏆', completed: false },
];

export const CANDIDATE_FEATURES = [
  {
    title: 'Ponte para o Canadá',
    description: 'Acumule pontos ao buscar vagas em SC e concorra a intercâmbios de idiomas no Canadá.',
    icon: '🇨🇦'
  },
  {
    title: 'Match por Proximidade',
    description: 'Trabalhe perto de casa. Chega de perder horas no trânsito da BR-101.',
    icon: '🏠'
  },
  {
    title: 'Feedback com IA',
    description: 'Receba uma análise detalhada do porquê você deu match (ou não) com cada vaga.',
    icon: '🤖'
  }
];
