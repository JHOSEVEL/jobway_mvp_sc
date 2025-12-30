
import { GoogleGenAI, Type } from "@google/genai";
import { MatchResult } from "../types";

export const simulateMatch = async (jobData: any, candidateData: any): Promise<MatchResult | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Você é um Recrutador Técnico Sênior especializado no mercado de Santa Catarina (SC).
      Sua missão é realizar um match ultra-preciso entre uma vaga e um candidato, considerando:
      
      1. EXPERIÊNCIA E FORMAÇÃO (Peso 40%): Relevância do cargo e tempo de mercado.
      2. PROJETOS PESSOAIS E PORTFÓLIO (Peso 25%): Analise projetos práticos, links de GitHub, apps ou soluções reais citadas pelo candidato. Valorize a iniciativa técnica.
      3. CERTIFICAÇÕES (Peso 15%): Certificações de mercado (Cloud, Gestão, Linguagens) agregam valor ao score.
      4. SOFT SKILLS E CULTURA (Peso 10%): Alinhamento com os valores descritos.
      5. GEOLOCALIZAÇÃO (Peso 10%): Proximidade com a cidade de SC descrita na vaga.

      VAGA: ${JSON.stringify(jobData)}
      CANDIDATO: ${JSON.stringify(candidateData)}
      
      Gere um parecer crítico que explique como os projetos e certificações do candidato impactaram (ou poderiam impactar) o score final.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                tech: { type: Type.NUMBER },
                soft: { type: Type.NUMBER },
                culture: { type: Type.NUMBER },
                geo: { type: Type.NUMBER }
              },
              required: ["tech", "soft", "culture", "geo"]
            },
            behavioralTraits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                },
                required: ["name", "score"]
              }
            },
            aiInsight: { type: Type.STRING },
            yearsExp: { type: Type.NUMBER },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "breakdown", "behavioralTraits", "aiInsight", "yearsExp", "skills", "tags", "pros", "cons"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Erro no match refinado:", error);
    return null;
  }
};

export const parseResume = async (base64Data: string, mimeType: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: "Extraia nome, e-mail, principal competência, experiências, formação, CERTIFICAÇÕES e PROJETOS PESSOAIS/PORTFÓLIO." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            mainSkill: { type: Type.STRING },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            projects: { type: Type.ARRAY, items: { type: Type.STRING } },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  period: { type: Type.STRING }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Erro no parse de currículo:", error);
    return null;
  }
};
