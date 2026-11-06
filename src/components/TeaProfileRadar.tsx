import React, { useState, useEffect, useRef } from 'react';
import {
  PersonalTeaRadar,
  TEA_DIMENSIONS,
  calculateRadarCoordinates,
  TeaTasteDimension,
} from '../utils/teaProfileLogic';

interface TeaProfileRadarProps {
  radar: PersonalTeaRadar;
  size?: number;
  interactive?: boolean;
  highlightDimension?: keyof PersonalTeaRadar | null;
  onSelectDimension?: (key: keyof PersonalTeaRadar) => void;
  showInsightCard?: boolean;
  themeMode?: 'oriental-lacquer' | 'classic';
}

export const TeaProfileRadar: React.FC<TeaProfileRadarProps> = ({
  radar,
  size = 280,
  interactive = true,
  highlightDimension,
  onSelectDimension,
  showInsightCard = true,
  themeMode = 'oriental-lacquer',
}) => {
  const [selectedKey, setSelectedKey] = useState<keyof PersonalTeaRadar>(
    highlightDimension || 'throatCharm'
  );
  
  // Keep previous values to support smooth morphing between different milestone radars
  const prevRadarRef = useRef<PersonalTeaRadar>(radar);
  const [currentValues, setCurrentValues] = useState<PersonalTeaRadar>(radar);

  useEffect(() => {
    if (highlightDimension) {
      setSelectedKey(highlightDimension);
    }
  }, [highlightDimension]);

  // Smooth morphing interpolation whenever the `radar` prop changes (entrance or timeline switch)
  useEffect(() => {
    const fromRadar = { ...prevRadarRef.current };
    const toRadar = { ...radar };
    prevRadarRef.current = toRadar;

    const start = performance.now();
    const duration = 750; // ms

    let animId: number;
    const step = (timestamp: number) => {
      const elapsed = timestamp - start;
      const t = Math.min(1, elapsed / duration);
      // Classic cubic ease-out: 1 - pow(1 - t, 3)
      const eased = 1 - Math.pow(1 - t, 3);

      setCurrentValues({
        roast: Math.round(fromRadar.roast + (toRadar.roast - fromRadar.roast) * eased),
        aroma: Math.round(fromRadar.aroma + (toRadar.aroma - fromRadar.aroma) * eased),
        sweetness: Math.round(fromRadar.sweetness + (toRadar.sweetness - fromRadar.sweetness) * eased),
        mouthfeel: Math.round(fromRadar.mouthfeel + (toRadar.mouthfeel - fromRadar.mouthfeel) * eased),
        throatCharm: Math.round(fromRadar.throatCharm + (toRadar.throatCharm - fromRadar.throatCharm) * eased),
      });

      if (t < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [radar]);

  const center = { x: size / 2, y: size / 2 };
  const radius = size / 2 - 46; // Leave padding for high-contrast labels

  const { pointsString, axisPoints } = calculateRadarCoordinates(currentValues, center, radius);

  // Concentric polygon grids (20%, 40%, 60%, 80%, 100%)
  const gridRings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const selectedDim = TEA_DIMENSIONS.find((d) => d.key === selectedKey);

  const getDimensionScoreText = (val: number) => {
    if (val >= 94) return '极品造极 · 独步茶林';
    if (val >= 88) return '沉雄充沛 · 骨肉匀整';
    if (val >= 80) return '清灵温润 · 恰到分寸';
    return '含蓄内敛 · 尚有深韵';
  };

  const handlePointClick = (key: keyof PersonalTeaRadar) => {
    if (!interactive) return;
    setSelectedKey(key);
    onSelectDimension?.(key);
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* SVG Radar */}
      <div className="relative flex justify-center">
        <svg
          width={size}
          height={size}
          className="overflow-visible"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            {/* Oriental Aesthetic Rich Gradients: 朱砂红 (Cinnabar) · 黛青 (Dai Cyan) · 暗金 (Muted Gold) */}
            <radialGradient id="orientalLacquerGrad" cx="50%" cy="50%" r="60%">
              {/* Center: Warm 暗金 Amber Gold */}
              <stop offset="0%" stopColor="#C9B68F" stopOpacity={0.65} />
              {/* Mid: 黛青 Dai Cyan Mineral Jade */}
              <stop offset="48%" stopColor="#1C382B" stopOpacity={0.45} />
              {/* Outer rim: 朱砂红 Cinnabar Warmth */}
              <stop offset="100%" stopColor="#B33927" stopOpacity={0.28} />
            </radialGradient>

            {/* Glowing Drop Shadow using Cinnabar & Gold */}
            <filter id="orientalGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#B33927" floodOpacity={0.35} />
            </filter>

            {/* Subtle Vertex Ring Gradient */}
            <linearGradient id="vertexGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EEDB9F" />
              <stop offset="100%" stopColor="#C9A35E" />
            </linearGradient>
          </defs>

          {/* Background Concentric Rings (黛青水墨经纬骨架) */}
          {gridRings.map((scale, idx) => {
            const ringPoints = axisPoints
              .map((p) => {
                const angle = -Math.PI / 2 + (axisPoints.indexOf(p) * (Math.PI * 2)) / axisPoints.length;
                const x = center.x + radius * scale * Math.cos(angle);
                const y = center.y + radius * scale * Math.sin(angle);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ');

            const isOutermost = idx === gridRings.length - 1;

            return (
              <polygon
                key={`ring-${idx}`}
                points={ringPoints}
                fill={isOutermost ? 'rgba(23, 31, 26, 0.45)' : 'none'}
                stroke={isOutermost ? 'rgba(201, 182, 143, 0.35)' : 'rgba(78, 105, 90, 0.22)'}
                strokeWidth={isOutermost ? '1.2' : '0.75'}
                strokeDasharray={idx < 4 ? '3 3' : undefined}
                className="transition-all duration-500"
              />
            );
          })}

          {/* Axis Radial Lines (黛青沉水经纬) */}
          {axisPoints.map((axis) => (
            <line
              key={`axis-${axis.key}`}
              x1={center.x}
              y1={center.y}
              x2={axis.axisEnd.x}
              y2={axis.axisEnd.y}
              stroke="rgba(201, 182, 143, 0.28)"
              strokeWidth="0.85"
              strokeDasharray="2 2"
            />
          ))}

          {/* Center Point: 暗金铜铆钉印记 */}
          <circle cx={center.x} cy={center.y} r="3" fill="#C9B68F" opacity="0.9" />
          <circle cx={center.x} cy={center.y} r="1.2" fill="#B33927" />

          {/* User Data Polygon with Oriental Color Palette (朱砂、黛青、暗金) */}
          <polygon
            points={pointsString}
            fill="url(#orientalLacquerGrad)"
            stroke="#C9A35E"
            strokeWidth="2.2"
            filter="url(#orientalGlow)"
            className="transition-all duration-150 ease-out"
          />

          {/* Data Vertices (朱砂外环 + 暗金中心) */}
          {axisPoints.map((axis) => {
            const isSelected = selectedKey === axis.key;
            return (
              <g
                key={`point-${axis.key}`}
                className="cursor-pointer group"
                onClick={() => handlePointClick(axis.key)}
              >
                {/* Active Focus Pulsing Ring in 朱砂红 */}
                {isSelected && (
                  <circle
                    cx={axis.dataPoint.x}
                    cy={axis.dataPoint.y}
                    r="10"
                    fill="#B33927"
                    className="opacity-35 animate-ping"
                  />
                )}
                {/* Click target hit-box for easy mobile touching */}
                <circle
                  cx={axis.dataPoint.x}
                  cy={axis.dataPoint.y}
                  r="18"
                  fill="transparent"
                />
                {/* Vertex dot: Cinnabar outer border, golden solid center */}
                <circle
                  cx={axis.dataPoint.x}
                  cy={axis.dataPoint.y}
                  r={isSelected ? '6' : '4.5'}
                  fill={isSelected ? '#B33927' : 'url(#vertexGoldGrad)'}
                  stroke={isSelected ? '#FAF4E8' : '#141A17'}
                  strokeWidth="2"
                  className="transition-all duration-200 drop-shadow-sm"
                />
              </g>
            );
          })}

          {/* Dimension Labels & Scores (高对比度暗色设计：暗金高亮与高白透亮) */}
          {axisPoints.map((axis) => {
            const isSelected = selectedKey === axis.key;
            // Slightly offset label outside the axis end
            const angle = -Math.PI / 2 + (axisPoints.indexOf(axis) * (Math.PI * 2)) / axisPoints.length;
            const labelDist = radius + 25;
            const lx = center.x + labelDist * Math.cos(angle);
            const ly = center.y + labelDist * Math.sin(angle);

            return (
              <g
                key={`label-${axis.key}`}
                className="cursor-pointer select-none"
                onClick={() => handlePointClick(axis.key)}
              >
                {/* Dimension Chinese Label */}
                <text
                  x={lx}
                  y={ly - 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`font-oriental-serif text-[11px] font-bold tracking-wider transition-colors ${
                    isSelected
                      ? 'fill-[#FFD885] font-extrabold filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                      : 'fill-[#E8DFC9] filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {axis.label}
                </text>
                {/* Score badge text - High contrast on dark background */}
                <text
                  x={lx}
                  y={ly + 11}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`font-mono text-[10px] font-bold tracking-tight transition-colors ${
                    isSelected ? 'fill-[#FF8A75]' : 'fill-[#C9B68F]'
                  }`}
                >
                  {currentValues[axis.key]}分
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Dimension Insight Card (东方漆器金石雅韵) */}
      {showInsightCard && interactive && selectedDim && (
        <div className="w-full mt-3 p-4 bg-[#141A17]/95 rounded-2xl border border-[#C9B68F]/25 text-left transition-all animate-in fade-in duration-300 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B33927] shadow-[0_0_8px_rgba(179,57,39,0.7)]" />
              <h4 className="font-oriental-serif font-bold text-xs sm:text-sm text-[#FAF5EE] tracking-wide">
                {selectedDim.name} · <span className="text-[#C9B68F] font-mono font-normal text-[11px]">{selectedDim.enName}</span>
              </h4>
              <span className="text-[9px] font-oriental-serif px-2 py-0.5 rounded-full bg-[#B33927]/25 text-[#FFC4B8] border border-[#B33927]/40 leading-none whitespace-nowrap">
                朱砂点定
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <span className="font-bold text-base text-[#EEDB9F]">
                {currentValues[selectedKey]}
              </span>
              <span className="text-[10px] text-[#A69B88]">/ 100</span>
            </div>
          </div>
          <p className="text-[11px] text-[#D4CDBC] mt-2 leading-relaxed font-light">
            {selectedDim.description}
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#C9B68F]/15 flex items-center justify-between text-[10px]">
            <span className="text-[#A89F8F] font-oriental-serif">东方工夫茶境评定：</span>
            <span className="font-oriental-serif font-bold text-[#EEDB9F] px-2.5 py-0.5 rounded-md bg-[#1C2822] border border-[#C9B68F]/30 leading-none">
              {getDimensionScoreText(currentValues[selectedKey])}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
