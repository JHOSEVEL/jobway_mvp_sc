
import { GoogleGenAI, Type } from "@google/genai";
import { MatchResult } from "../types";

export const simulateMatch = async (jobData: any, candidateData: any): Promise<MatchResult | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Você é um Recrutador Especialista de Santa Catarina. Analise o match entre esta VAGA e este CANDIDATO.
      
      IMPORTANTE: Considere com peso extra:
      1. PROJETOS PESSOAIS: Portfólios, links GitHub, projetos reais realizados.
      2. CERTIFICAÇÕES: Certificados técnicos, cursos de especialização, licenças.
      3. EXPERIÊNCIA: Relevância dos cargos anteriores.
      4. GEOLOCALIZAÇÃO: Proximidade com ${jobData.city}.

      VAGA: ${JSON.stringify(jobData)}
      CANDIDATO: ${JSON.stringify(candidateData)}
      
      Explique explicitamente no 'aiInsight' como os projetos e certificações influenciaram o score.`,
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
      model: 'gemini-2.5-flash-lite-latest',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: "Extraia nome, e-mail, principal competência, experiências, formação, CERTIFICAÇÕES e links de PROJETOS/GITHUB." }
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
