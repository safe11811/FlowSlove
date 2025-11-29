import React from 'react';
import { MATH_KEYS } from '../constants';
import { Delete } from 'lucide-react';

interface MathKeyboardProps {
  onInsert: (value: string) => void;
  onDelete: () => void;
  isOpen: boolean;
}

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert, onDelete, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 p-4 glass-panel rounded-2xl shadow-xl z-50 animate-fade-in-up">
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {MATH_KEYS.map((key) => (
          <button
            key={key.label}
            onClick={() => onInsert(key.value)}
            className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 font-mono text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
          >
            {key.label}
          </button>
        ))}
        <button
          onClick={onDelete}
          className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-colors border border-rose-100 dark:border-rose-900/30"
        >
          <Delete size={18} />
        </button>
      </div>
    </div>
  );
};

export default MathKeyboard;