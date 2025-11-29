import React from 'react';
import { TraditionalStep } from '../types';
import LatexRenderer from './LatexRenderer';

interface TraditionalStepListProps {
  steps: TraditionalStep[];
  finalAnswer: string;
  isEli15: boolean;
}

const TraditionalStepList: React.FC<TraditionalStepListProps> = ({ steps, finalAnswer, isEli15 }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 py-6 px-4">
      {steps.map((step, index) => (
        <div 
          key={step.stepNumber} 
          className="group relative pl-8 border-l-2 border-slate-200 dark:border-slate-700 pb-8 last:border-0 last:pb-0"
        >
          {/* Timeline Dot */}
          <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm transition-transform group-hover:scale-125 ${isEli15 ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
          
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Step {step.stepNumber}
            </h3>
            
            <div className={`leading-relaxed transition-colors duration-300 ${isEli15 ? 'text-lg text-emerald-800 dark:text-emerald-100' : 'text-slate-700 dark:text-slate-300'}`}>
              {isEli15 ? (step.simplifiedExplanation || step.explanation) : step.explanation}
              {isEli15 && (
                 <span className="ml-2 text-xs font-bold text-emerald-500 uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30">
                   Simplified
                 </span>
              )}
            </div>

            {step.formulaUsed && !isEli15 && (
              <div className="text-xs text-indigo-500 font-medium bg-indigo-50 dark:bg-indigo-900/10 px-3 py-1.5 rounded-md self-start">
                Rule: <LatexRenderer latex={step.formulaUsed} />
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
              <LatexRenderer latex={step.latex} displayMode={true} />
            </div>
          </div>
        </div>
      ))}

      {/* Final Answer Block */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 transform hover:scale-[1.01] transition-all">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">Final Answer</h3>
        <div className="text-2xl font-bold text-center py-2 overflow-x-auto">
          <LatexRenderer latex={finalAnswer} displayMode={true} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default TraditionalStepList;