export enum SolveMode {
  FLOWCHART = 'FLOWCHART',
  TRADITIONAL = 'TRADITIONAL'
}

export enum BlockType {
  IDENTIFY = 'IDENTIFY',
  APPLY = 'APPLY',
  SIMPLIFY = 'SIMPLIFY',
  TRANSFORM = 'TRANSFORM',
  FINAL = 'FINAL'
}

export interface FlowNode {
  id: string;
  type: BlockType;
  label: string;
  latex?: string;
  description?: string;
  simplifiedDescription?: string; // ELI15
}

export interface TraditionalStep {
  stepNumber: number;
  explanation: string;
  simplifiedExplanation?: string; // ELI15
  latex: string;
  formulaUsed?: string;
}

export interface SolutionData {
  topic: string;
  detectedProblem: string; // OCR Result
  flowNodes: FlowNode[];
  traditionalSteps: TraditionalStep[];
  finalAnswer: string;
  similarProblems: string[];
  tips: string[];
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  topic: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
}