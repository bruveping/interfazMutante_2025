import React, { useState } from 'react';
import { HSL, HarmonyType } from '../types';
import { generateAiPalette } from '../services/geminiService';

interface ControlsProps {
  baseColor: HSL;
  setBaseColor: (hsl: HSL) => void;
  harmony: HarmonyType;
  setHarmony: (h: HarmonyType) => void;
  onShuffle: () => void;
  setAiLoading: (loading: boolean) => void;
  setAiMessage: (msg: string | null) => void;
}

const Controls: React.FC<ControlsProps> = ({
  baseColor,
  setBaseColor,
  harmony,
  setHarmony,
  onShuffle,
  setAiLoading,
  setAiMessage
}) => {
  const [moodInput, setMoodInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor({ ...baseColor, h: parseInt(e.target.value) });
  };

  const handleSatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor({ ...baseColor, s: parseInt(e.target.value) });
  };

  const handleLightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor({ ...baseColor, l: parseInt(e.target.value) });
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodInput.trim()) return;

    setIsGenerating(true);
    setAiLoading(true);
    setAiMessage(null);
    try {
      const result = await generateAiPalette(moodInput);
      if (result) {
        // We need to convert hex back to HSL for our state
        // Importing here to avoid circular dependencies if utils imported types from here
        // But since utils is pure, it's fine. 
        // For simplicity, we assume utils is available or we do a quick parse.
        // Let's rely on the hexToHsl passed down or imported in App, but here we only emit changes.
        // Actually, we need to pass the result up to App to convert and set.
        // Let's dispatch a custom event or use a prop.
        
        // Since we can't import hexToHsl here easily without making this file dependent on utils 
        // (which is fine, but let's keep it clean), let's just emit the raw result via a callback? 
        // No, let's import the util, it's standard practice.
        const { hexToHsl } = await import('../utils/colorUtils');
        const newHsl = hexToHsl(result.baseHex);
        setBaseColor(newHsl);
        setHarmony(result.harmony as HarmonyType);
        setAiMessage(result.description);
      } else {
         setAiMessage("No se pudo generar. Intenta otra descripción.");
      }
    } catch (e) {
      setAiMessage("Error de conexión con IA.");
    } finally {
      setIsGenerating(false);
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
      
      {/* AI Section */}
      <div className="space-y-3 pb-6 border-b border-slate-700">
        <label className="text-sm font-semibold text-purple-400 flex items-center gap-2">
           ✨ Generador Mágico (IA)
        </label>
        <form onSubmit={handleAiSubmit} className="flex gap-2">
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="Ej: Atardecer en la playa..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isGenerating || !process.env.API_KEY}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isGenerating 
                ? 'bg-slate-600 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {isGenerating ? '...' : 'Crear'}
          </button>
        </form>
        {!process.env.API_KEY && (
          <p className="text-xs text-red-400">API Key no detectada.</p>
        )}
      </div>

      {/* Manual Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Regla de Armonía</label>
          <select
            value={harmony}
            onChange={(e) => setHarmony(e.target.value as HarmonyType)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(HarmonyType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Matiz (Hue)</span>
            <span>{baseColor.h}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={baseColor.h}
            onChange={handleHueChange}
            className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Saturación</span>
            <span>{baseColor.s}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={baseColor.s}
            onChange={handleSatChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Luminosidad</span>
            <span>{baseColor.l}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={baseColor.l}
            onChange={handleLightChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <button
          onClick={onShuffle}
          className="w-full mt-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-600"
        >
          🔄 Reorganizar Euclides
        </button>
      </div>
    </div>
  );
};

export default Controls;