import React from 'react';
import { X, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  isLoading: boolean;
}

// Minimal markdown renderer wrapper since we can't install react-markdown here
// We will just render the text with line breaks for now, or use a simple substitution
// Note: In a real environment, use 'react-markdown'. Here, we'll format manually.

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  
  // Basic parsing for bold and bullets
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-gray-700">
      {lines.map((line, i) => {
        if (line.trim().startsWith('**')) {
           // Header
           return <h3 key={i} className="font-bold text-gray-900 mt-4 mb-2 text-lg">{line.replace(/\*\*/g, '')}</h3>
        }
        if (line.trim().startsWith('-')) {
            // Bullet
            return (
                <div key={i} className="flex items-start">
                    <span className="mr-2 text-gray-400">•</span>
                    <span>{line.replace(/^- /, '')}</span>
                </div>
            )
        }
        if (line.trim() === "") return <div key={i} className="h-2"></div>;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
};

export const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-start">
          <div>
             <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h2 className="text-xl font-bold">Riepilogo Gemini</h2>
             </div>
             <p className="text-purple-100 text-sm">I tuoi messaggi non letti in breve</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
               <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
               </div>
               <p className="text-gray-500 font-medium animate-pulse">Analisi messaggi in corso...</p>
            </div>
          ) : (
            <div className="prose prose-purple max-w-none">
              <SimpleMarkdown text={summary} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};