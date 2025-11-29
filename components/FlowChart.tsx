import React from 'react';
import { FlowNode, BlockType } from '../types';
import { BLOCK_COLORS } from '../constants';
import LatexRenderer from './LatexRenderer';
import { ArrowDown } from 'lucide-react';

interface FlowChartProps {
  nodes: FlowNode[];
  isEli15: boolean;
}

const FlowChart: React.FC<FlowChartProps> = ({ nodes, isEli15 }) => {
  return (
    <div className="flex flex-col items-center w-full py-8 px-4 space-y-2">
      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1;
        const colorClass = BLOCK_COLORS[node.type];

        return (
          <React.Fragment key={node.id}>
            {/* Node Card */}
            <div 
              className={`
                relative w-full max-w-md p-5 rounded-2xl border-2 shadow-sm
                transition-all duration-500 ease-out transform
                hover:scale-[1.02] hover:shadow-md
                ${colorClass}
                animate-fade-in-up
              `}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">
                  {node.type}
                </span>
                <div className="h-2 w-2 rounded-full bg-current opacity-50"></div>
              </div>
              
              <h3 className="text-sm font-semibold mb-2">{node.label}</h3>
              
              {node.latex && (
                <div className="bg-white/50 dark:bg-black/10 rounded-lg p-3 my-2 text-center overflow-x-auto">
                  <LatexRenderer latex={node.latex} displayMode={true} />
                </div>
              )}

              {(node.description || (isEli15 && node.simplifiedDescription)) && (
                <p className={`text-xs mt-2 leading-relaxed ${isEli15 ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'opacity-80'}`}>
                  {isEli15 ? (node.simplifiedDescription || node.description) : node.description}
                </p>
              )}
            </div>

            {/* Connector Arrow */}
            {!isLast && (
              <div 
                className="flex flex-col items-center justify-center h-12 text-slate-300 dark:text-slate-600 animate-fade-in"
                style={{ animationDelay: `${index * 150 + 75}ms` }}
              >
                <div className="w-0.5 h-full bg-current opacity-30"></div>
                <ArrowDown size={16} className="-mt-1 opacity-50" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FlowChart;