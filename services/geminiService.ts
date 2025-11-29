import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SolutionData, BlockType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The mathematical topic (e.g., Calculus, Algebra)" },
    detectedProblem: { type: Type.STRING, description: "The exact problem statement extracted from the input/image in LaTeX format." },
    finalAnswer: { type: Type.STRING, description: "The final concise answer in LaTeX" },
    tips: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Short conceptual tips or 'Why' explanations"
    },
    similarProblems: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 similar practice problems in LaTeX"
    },
    traditionalSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          explanation: { type: Type.STRING, description: "Standard academic explanation" },
          simplifiedExplanation: { type: Type.STRING, description: "ELI15 explanation: Use analogies (e.g., pizza, velocity) and very simple language." },
          latex: { type: Type.STRING, description: "The mathematical expression for this step in LaTeX" },
          formulaUsed: { type: Type.STRING, description: "Optional formula used in LaTeX" }
        },
        required: ["stepNumber", "explanation", "latex"]
      }
    },
    flowNodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["IDENTIFY", "APPLY", "SIMPLIFY", "TRANSFORM", "FINAL"] },
          label: { type: Type.STRING, description: "Short title for the node" },
          description: { type: Type.STRING, description: "Standard description" },
          simplifiedDescription: { type: Type.STRING, description: "ELI15 description" },
          latex: { type: Type.STRING, description: "Relevant LaTeX for this specific node" }
        },
        required: ["id", "type", "label"]
      }
    }
  },
  required: ["topic", "detectedProblem", "finalAnswer", "traditionalSteps", "flowNodes", "tips"]
};

export const solveMathProblem = async (query: string, imageBase64?: string): Promise<SolutionData> => {
  try {
    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64
        }
      });
      parts.push({ text: "Analyze the image. Detect the math problem exactly and solve it." });
    } else {
      parts.push({ text: `Solve this math problem: ${query}` });
    }

    const systemInstruction = `
      You are FlowSolve, an advanced 11th/12th grade JEE-level math tutor.
      
      Tasks:
      1. **OCR/Detection**: If an image is provided, accurately transcribe the math problem into LaTeX in the 'detectedProblem' field. If text is provided, format it as LaTeX.
      2. **Dual-Mode Explanation**:
         - Standard Mode: Detailed, textbook-style academic rigor.
         - ELI15 Mode ('simplifiedExplanation'): Explain it like I'm 15. Use simple analogies (e.g., 'Derivative is like the speedometer of a car'). Avoid jargon where possible.
      
      Structure:
      - 'flowNodes': A visual logic chain.
      - 'traditionalSteps': Linear step-by-step solution.
      
      Ensure all math is valid LaTeX. Do not include markdown backticks around LaTeX.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, 
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text);
    return data as SolutionData;

  } catch (error) {
    console.error("Error solving problem:", error);
    throw error;
  }
};