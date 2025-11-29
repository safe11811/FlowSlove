import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Mic, 
  ArrowRight, 
  Moon, 
  Sun, 
  History, 
  Sparkles, 
  Share2, 
  Check, 
  Image as ImageIcon, 
  X,
  Keyboard,
  Baby,
  BrainCircuit
} from 'lucide-react';
import { solveMathProblem } from './services/geminiService';
import { SolutionData, SolveMode } from './types';
import { SAMPLE_QUESTIONS } from './constants';
import FlowChart from './components/FlowChart';
import TraditionalStepList from './components/TraditionalStepList';
import LatexRenderer from './components/LatexRenderer';
import MathKeyboard from './components/MathKeyboard';

// Simple confetti effect component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            animationDuration: `${3 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<SolutionData | null>(null);
  const [mode, setMode] = useState<SolveMode>(SolveMode.FLOWCHART);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [streak, setStreak] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isEli15, setIsEli15] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Theme toggle
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSolve = async (queryOverride?: string) => {
    const query = queryOverride || input;
    if (!query && !image) return;

    setLoading(true);
    setSolution(null);
    setShowKeyboard(false);
    
    try {
      const data = await solveMathProblem(query, image ? image.split(',')[1] : undefined);
      setSolution(data);
      setStreak(s => s + 1);
    } catch (err) {
      console.error(err);
      alert("Oops! Could not solve that problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const insertMathSymbol = (symbol: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const newValue = input.substring(0, start) + symbol + input.substring(end);
      setInput(newValue);
      
      // Needs timeout to set cursor position after render
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = start + symbol.length;
          // If inserting a function like \frac{}{}, put cursor inside braces
          if (symbol.includes('{}')) {
            inputRef.current.setSelectionRange(newCursorPos - 1, newCursorPos - 1);
          } else if (symbol.includes('()')) {
             inputRef.current.setSelectionRange(newCursorPos - 1, newCursorPos - 1);
          } else {
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
          inputRef.current.focus();
        }
      }, 0);
    } else {
      setInput(prev => prev + symbol);
    }
  };

  const deleteChar = () => {
     setInput(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setSolution(null)}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="text-xl font-bold tracking-tight">FlowSolve</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500">
            <Sparkles size={12} className="text-amber-500" />
            <span>Streak: {streak}</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col">
        
        {!solution && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
             <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500 pb-2">
                Math, visualized.
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Solve complex 11th & 12th grade problems with AI-powered flowcharts and deep explanations.
              </p>
             </div>

             {/* Input Area */}
             <div className="w-full max-w-xl relative">
               <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative glass-panel rounded-2xl p-2 shadow-2xl dark:shadow-indigo-900/20 border border-slate-200 dark:border-slate-800">
                 
                 {image && (
                   <div className="relative mx-2 mt-2 mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                     <span className="text-xs text-slate-500 truncate max-w-[200px]">Image attached</span>
                     <button onClick={() => setImage(null)} className="p-1 hover:text-red-500"><X size={14} /></button>
                   </div>
                 )}

                 {/* Live Preview of Math */}
                 {input && (
                   <div className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm overflow-x-auto border-b border-dashed border-slate-200 dark:border-slate-800 mb-2">
                     <span className="text-xs font-bold uppercase mr-2 opacity-50">Preview:</span>
                     <LatexRenderer latex={input} />
                   </div>
                 )}

                 <textarea
                   ref={inputRef}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder="Type a problem (e.g. Integral of x * sin(x))..."
                   className="w-full bg-transparent border-none focus:ring-0 p-4 min-h-[60px] resize-none text-lg placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSolve();
                     }
                   }}
                 />
                 
                 <div className="flex justify-between items-center px-2 pb-2">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                        title="Upload Image (OCR)"
                      >
                        <Camera size={20} />
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                      </button>
                      <button 
                         onClick={() => setShowKeyboard(!showKeyboard)}
                         className={`p-2 rounded-xl transition-all ${showKeyboard ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                         title="Math Keyboard"
                      >
                        <Keyboard size={20} />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleSolve()}
                      disabled={loading || (!input && !image)}
                      className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{loading ? 'Thinking...' : 'Solve'}</span>
                      {!loading && <ArrowRight size={16} />}
                    </button>
                 </div>
                 
                 <MathKeyboard 
                   isOpen={showKeyboard} 
                   onInsert={insertMathSymbol} 
                   onDelete={deleteChar} 
                 />

               </div>
             </div>

             {/* Suggestions */}
             <div className="flex flex-wrap justify-center gap-2 mt-8">
               {SAMPLE_QUESTIONS.map((q, i) => (
                 <button 
                  key={i} 
                  onClick={() => {
                    setInput(q);
                    handleSolve(q);
                  }}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-500 hover:border-indigo-400 transition-colors"
                >
                   {q}
                 </button>
               ))}
             </div>
          </div>
        )}

        {/* Results View */}
        {solution && (
          <div className="flex flex-col animate-fade-in pb-20">
            {streak > 0 && streak % 5 === 0 && <Confetti />}
            
            {/* Header */}
            <div className="flex flex-col mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1 block">
                    {solution.topic}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Solution</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
                  {/* ELI15 Toggle */}
                  <button
                    onClick={() => setIsEli15(!isEli15)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${isEli15 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                  >
                     {isEli15 ? <Baby size={16} /> : <BrainCircuit size={16} />}
                     <span>{isEli15 ? "Explained for 15yo" : "Academic Mode"}</span>
                  </button>

                  <div className="flex space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                    <button
                      onClick={() => setMode(SolveMode.FLOWCHART)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === SolveMode.FLOWCHART ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Flow Chart
                    </button>
                    <button
                      onClick={() => setMode(SolveMode.TRADITIONAL)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === SolveMode.TRADITIONAL ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Textbook Steps
                    </button>
                  </div>
                </div>
              </div>

              {/* OCR Verification Display */}
              <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-900/20 flex items-start space-x-3">
                 <span className="text-xs font-bold uppercase text-indigo-400 mt-1 whitespace-nowrap">Detected:</span>
                 <div className="text-indigo-900 dark:text-indigo-100 overflow-x-auto">
                    <LatexRenderer latex={solution.detectedProblem} />
                 </div>
              </div>
            </div>

            {/* Content Switcher */}
            <div className="min-h-[400px]">
              {mode === SolveMode.FLOWCHART ? (
                <FlowChart nodes={solution.flowNodes} isEli15={isEli15} />
              ) : (
                <TraditionalStepList steps={solution.traditionalSteps} finalAnswer={solution.finalAnswer} isEli15={isEli15} />
              )}
            </div>

            {/* Bottom Panel: Understanding & Practice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
               {/* Tips */}
               <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2 mb-4 text-amber-500">
                    <Sparkles size={18} />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Key Concepts</h3>
                  </div>
                  <ul className="space-y-2">
                    {solution.tips.map((tip, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                        <span className="mr-2 text-indigo-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
               </div>

               {/* Practice */}
               <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2 mb-4 text-emerald-500">
                    <Check size={18} />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Similar Problems</h3>
                  </div>
                  <div className="space-y-3">
                    {solution.similarProblems.map((prob, i) => (
                      <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-lg text-sm shadow-sm border border-slate-100 dark:border-slate-700">
                        <LatexRenderer latex={prob} />
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-30">
              <button 
                onClick={() => setSolution(null)} 
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-xl hover:scale-105 transition-transform font-medium flex items-center space-x-2"
              >
                <span>New Problem</span>
              </button>
              <button className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-500 transition-colors">
                <Share2 size={20} />
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;