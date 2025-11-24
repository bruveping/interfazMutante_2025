import React, { useState, useEffect, useMemo } from 'react';
import { HSL, HarmonyType, ColorDefinition } from './types';
import { generatePalette, hslToHex } from './utils/colorUtils';
import EuclideanCanvas from './components/EuclideanCanvas';
import Controls from './components/Controls';

// Simple icons
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const App: React.FC = () => {
  // State
  const [baseColor, setBaseColor] = useState<HSL>({ h: 210, s: 70, l: 50 }); // Nice blue start
  const [harmony, setHarmony] = useState<HarmonyType>(HarmonyType.COMPLEMENTARY);
  const [seed, setSeed] = useState(0); // For redrawing canvas randomly
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Derived state
  const palette: ColorDefinition[] = useMemo(() => {
    return generatePalette(baseColor, harmony);
  }, [baseColor, harmony]);

  const hexColors = useMemo(() => palette.map(p => p.hex), [palette]);

  // Handlers
  const handleShuffle = () => {
    setSeed(prev => prev + 1);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar / Controls */}
      <aside className="w-full md:w-80 lg:w-96 p-6 flex flex-col gap-6 bg-slate-900 border-r border-slate-800 z-10 md:h-screen md:overflow-y-auto">
        <header>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            ChromaEuclid
          </h1>
          <p className="text-sm text-slate-500 mt-1">Explorador de Color Geométrico</p>
        </header>

        <Controls 
          baseColor={baseColor}
          setBaseColor={setBaseColor}
          harmony={harmony}
          setHarmony={setHarmony}
          onShuffle={handleShuffle}
          setAiLoading={setAiLoading}
          setAiMessage={setAiMessage}
        />

        {/* Palette List */}
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Paleta Generada
          </h3>
          <div className="space-y-2">
            {palette.map((color, idx) => (
              <div 
                key={`${color.hex}-${idx}`}
                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => copyToClipboard(color.hex)}
              >
                <div 
                  className="w-10 h-10 rounded-full shadow-inner ring-1 ring-slate-700/50" 
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1">
                  <p className="font-mono text-sm font-medium text-slate-200">{color.hex}</p>
                  <p className="text-xs text-slate-500">
                    H:{Math.round(color.hsl.h)} S:{Math.round(color.hsl.s)} L:{Math.round(color.hsl.l)}
                  </p>
                </div>
                <div className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedHex === color.hex ? <CheckIcon /> : <CopyIcon />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Visualization Area */}
      <main className="flex-1 p-4 md:p-8 flex flex-col h-screen overflow-hidden">
        {/* Status Bar */}
        <div className="mb-4 flex items-center justify-between min-h-[24px]">
           {aiLoading ? (
             <div className="text-sm text-purple-400 animate-pulse flex items-center gap-2">
               <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
               Consultando a la IA...
             </div>
           ) : aiMessage ? (
             <div className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
               ✨ {aiMessage}
             </div>
           ) : (
             <div className="text-sm text-slate-500">
               {palette.length} colores distribuidos proporcionalmente
             </div>
           )}
        </div>

        {/* The Canvas */}
        <div className="flex-1 relative">
           <EuclideanCanvas colors={hexColors} seed={seed} />
           
           {/* Overlay for mobile mainly, or subtle texture */}
           <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] rounded-xl"></div>
        </div>

        <footer className="mt-4 text-center text-xs text-slate-600">
          Explora monocromías, tétrades y más. Generado con React & Gemini.
        </footer>
      </main>
    </div>
  );
};

export default App;