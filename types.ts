
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: 'professional' | 'company';
  city: string;
  created_at: string;
}

export interface Company {
  id: string;
  cnpj: string;
  phone: string;
  cep: string;
  culture: string;
  address: string;
  bio?: string;
}

export interface Professional {
  id: string;
  cep: string;
  main_skill: string;
  canada_points: number;
  bio?: string;
  years_exp?: number;
  skills?: string[];
  projects?: string[]; // Novos campos para match refinado
  certifications?: string[]; // Novos campos para match refinado
}

export interface Experience {
  id: string;
  professional_id: string;
  role: string;
  company: string;
  period: string;
  description?: string;
}

export interface Education {
  id: string;
  professional_id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  salary: string;
  city: string;
  cep: string;
  job_type: 'Presencial' | 'Híbrido' | 'Remoto (SC)';
  status: 'Ativa' | 'Pausada' | 'Encerrada';
  requirements: string[];
  soft_skills: string[];
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  professional_id: string;
  match_score: number;
  compatibility_details: MatchResult;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  profiles?: any;
}

export interface BehavioralTrait {
  name: string;
  score: number;
}

export interface MatchResult {
  score: number;
  status: string; 
  breakdown: {
    tech: number;
    soft: number;
    culture: number;
    geo: number;
  };
  behavioralTraits: BehavioralTrait[];
  aiInsight: string;
  yearsExp: number;
  skills: string[];
  tags: string[];
  pros: string[];
  cons: string[];
  projectEvaluation?: string; // Avaliação IA dos projetos
}
