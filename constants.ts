import { BlockType } from './types';

export const THEME_COLORS = {
  primary: 'indigo',
  secondary: 'rose',
  accent: 'cyan',
};

export const BLOCK_COLORS: Record<BlockType, string> = {
  [BlockType.IDENTIFY]: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  [BlockType.APPLY]: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
  [BlockType.SIMPLIFY]: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
  [BlockType.TRANSFORM]: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
  [BlockType.FINAL]: 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 font-bold',
};

export const SAMPLE_QUESTIONS = [
  "Integrate x * sin(x) dx",
  "Find the derivative of ln(tan(x))",
  "Solve matrix equation AX = B",
  "Find the probability of getting 2 heads in 3 tosses"
];

export const MATH_KEYS = [
  { label: 'x', value: 'x' },
  { label: 'y', value: 'y' },
  { label: 'θ', value: '\\theta' },
  { label: 'π', value: '\\pi' },
  { label: 'x²', value: '^2' },
  { label: '√', value: '\\sqrt{}' },
  { label: '÷', value: '\\frac{}{}' },
  { label: '×', value: '\\times' },
  { label: '∫', value: '\\int' },
  { label: 'd/dx', value: '\\frac{d}{dx}' },
  { label: 'Σ', value: '\\sum' },
  { label: '∞', value: '\\infty' },
  { label: 'sin', value: '\\sin()' },
  { label: 'cos', value: '\\cos()' },
  { label: 'tan', value: '\\tan()' },
  { label: 'ln', value: '\\ln()' },
];