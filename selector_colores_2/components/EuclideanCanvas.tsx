import React, { useMemo } from 'react';
import { GeometricShape } from '../types';

interface EuclideanCanvasProps {
  colors: string[]; // Hex codes
  seed: number; // To force re-render/reshuffle
}

const generateShapes = (x: number, y: number, w: number, h: number, depth: number, colors: string[], shapes: GeometricShape[]) => {
  // Stop recursion randomly or if too small
  const area = w * h;
  const minDimension = 10; // Minimum percentage
  
  if (depth <= 0 || (Math.random() > 0.7 && depth < 3) || w < minDimension || h < minDimension) {
    shapes.push({
      x,
      y,
      width: w,
      height: h,
      colorIndex: Math.floor(Math.random() * colors.length),
    });
    return;
  }

  // Determine split direction (prefer splitting the longer side)
  const splitVertical = w > h ? true : h > w ? false : Math.random() > 0.5;

  // Split ratio between 30% and 70%
  const ratio = 0.3 + Math.random() * 0.4;

  if (splitVertical) {
    const w1 = w * ratio;
    const w2 = w - w1;
    generateShapes(x, y, w1, h, depth - 1, colors, shapes);
    generateShapes(x + w1, y, w2, h, depth - 1, colors, shapes);
  } else {
    const h1 = h * ratio;
    const h2 = h - h1;
    generateShapes(x, y, w, h1, depth - 1, colors, shapes);
    generateShapes(x, y + h1, w, h2, depth - 1, colors, shapes);
  }
};

const EuclideanCanvas: React.FC<EuclideanCanvasProps> = ({ colors, seed }) => {
  const shapes = useMemo(() => {
    const result: GeometricShape[] = [];
    if (colors.length === 0) return result;
    // 100x100 coordinate system for easy SVG scaling
    generateShapes(0, 0, 100, 100, 5, colors, result); 
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, seed]);

  return (
    <div className="w-full h-full min-h-[300px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {shapes.map((shape, i) => (
          <rect
            key={i}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={colors[shape.colorIndex]}
            stroke="#0f172a" // Dark slate border for separation
            strokeWidth="0.5"
            className="transition-all duration-500 ease-in-out hover:opacity-90"
          />
        ))}
      </svg>
    </div>
  );
};

export default EuclideanCanvas;