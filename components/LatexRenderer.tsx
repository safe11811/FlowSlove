import React, { useEffect, useState } from 'react';

interface LatexRendererProps {
  latex: string;
  className?: string;
  displayMode?: boolean;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ latex, className = '', displayMode = false }) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const renderMath = () => {
      // Check if katex is loaded
      if ((window as any).katex) {
        try {
          // Use renderToString for safer rendering and better error catching
          const rendered = (window as any).katex.renderToString(latex, {
            throwOnError: false,
            displayMode: displayMode,
            output: 'html',
            strict: false,
            trust: true
          });
          
          if (mounted) {
            setHtml(rendered);
          }
        } catch (e) {
          console.warn("Katex rendering error (falling back to text):", e);
          if (mounted) {
            setHtml(null); // Fallback to null to trigger text render
          }
        }
      } else {
        // Retry shortly if script hasn't loaded yet
        if (mounted) {
          setTimeout(renderMath, 100);
        }
      }
    };

    renderMath();

    return () => {
      mounted = false;
    };
  }, [latex, displayMode]);

  // If HTML is null (error or loading), show the raw LaTeX formatted nicely
  if (html === null) {
    return (
      <span className={`font-mono text-xs opacity-70 ${className} break-all inline-block`}>
        {latex}
      </span>
    );
  }

  return (
    <span 
      className={`latex-content ${className}`} 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

export default LatexRenderer;