import React, { useState } from 'react';
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
}

export const TeaProfileRadar: React.FC<TeaProfileRadarProps> = ({
  radar,
  size = 280,
  interactive = true,
}) => {
  const [selectedKey, setSelectedKey] = useState<keyof PersonalTeaRadar>('throatCharm');
  const center = { x: size / 2, y: size / 2 };
  const radius = (size / 2) - 45; // Leave padding for labels

  const { pointsString, axisPoints } = calculateRadarCoordinates(radar, center, radius);

  // Concentric polygon grids (20%, 40%, 60%, 80%, 100%)
  const gridRings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const selectedDim = TEA_DIMENSIONS.find((d) => d.key === selectedKey);

  const getDimensionScoreText = (val: number) => {
    if (val >= 94) return '极品造极 · 独步茶林';
    if (val >= 88) return '沉雄充沛 · 骨肉匀整';
    if (val >= 80) return '清灵温润 · 恰到分寸';
    return '含蓄内敛 · 尚有深韵';
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* SVG Radar */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="overflow-visible"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            {/* Elegant tea liquor gradient */}
            <radialGradient id="teaRadarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8F733E" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#2E4A3B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1E2A23" stopOpacity="0.15" />
            </radialGradient>
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8F733E" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Background Concentric Rings */}
          {gridRings.map((scale, idx) => {
            const ringPoints = axisPoints
              .map((p) => {
                const angle = -Math.PI / 2 + (axisPoints.indexOf(p) * (Math.PI * 2)) / axisPoints.length;
                const x = center.x + radius * scale * Math.cos(angle);
                const y = center.y + radius * scale * Math.sin(angle);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ');

            return (
              <polygon
                key={`ring-${idx}`}
                points={ringPoints}
                fill={idx === gridRings.length - 1 ? '#FAF8F4' : 'none'}
                stroke="#D6CEBE"
                strokeWidth={idx === gridRings.length - 1 ? '1.5' : '0.8'}
                strokeDasharray={idx < 4 ? '3 3' : undefined}
                className="opacity-70"
              />
            );
          })}

          {/* Axis Lines */}
          {axisPoints.map((axis) => (
            <line
              key={`axis-${axis.key}`}
              x1={center.x}
              y1={center.y}
              x2={axis.axisEnd.x}
              y2={axis.axisEnd.y}
              stroke="#D6CEBE"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="opacity-60"
            />
          ))}

          {/* Center Point */}
          <circle cx={center.x} cy={center.y} r="2.5" fill="#8F733E" opacity="0.6" />

          {/* User Data Polygon */}
          <polygon
            points={pointsString}
            fill="url(#teaRadarGrad)"
            stroke="#8F733E"
            strokeWidth="2.2"
            filter="url(#radarGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Data Vertices */}
          {axisPoints.map((axis) => {
            const isSelected = selectedKey === axis.key;
            return (
              <g
                key={`point-${axis.key}`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => interactive && setSelectedKey(axis.key)}
              >
                {/* Glow ring */}
                {isSelected && (
                  <circle
                    cx={axis.dataPoint.x}
                    cy={axis.dataPoint.y}
                    r="8"
                    fill="#8F733E"
                    className="opacity-20 animate-ping"
                  />
                )}
                <circle
                  cx={axis.dataPoint.x}
                  cy={axis.dataPoint.y}
                  r={isSelected ? '5.5' : '4'}
                  fill={isSelected ? '#FAF8F5' : '#8F733E'}
                  stroke={isSelected ? '#8F733E' : '#FFFFFF'}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Dimension Labels */}
          {axisPoints.map((axis) => {
            const isSelected = selectedKey === axis.key;
            // Slightly offset label outside the axis end
            const angle = -Math.PI / 2 + (axisPoints.indexOf(axis) * (Math.PI * 2)) / axisPoints.length;
            const labelDist = radius + 24;
            const lx = center.x + labelDist * Math.cos(angle);
            const ly = center.y + labelDist * Math.sin(angle);

            return (
              <g
                key={`label-${axis.key}`}
                className="cursor-pointer select-none"
                onClick={() => interactive && setSelectedKey(axis.key)}
              >
                <text
                  x={lx}
                  y={ly - 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`font-oriental-serif text-[11px] font-bold transition-colors ${
                    isSelected ? 'fill-[#8F733E]' : 'fill-[#2B342E]'
                  }`}
                >
                  {axis.label}
                </text>
                <text
                  x={lx}
                  y={ly + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono text-[10px] fill-[#7B7569] font-medium"
                >
                  {axis.value}分
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Dimension Insight Card */}
      {interactive && selectedDim && (
        <div className="w-full mt-3 p-3 bg-[#FAF8F3] rounded-2xl border border-[#E5DECD] text-left transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8F733E]" />
              <h4 className="font-oriental-serif font-bold text-xs text-[#202723]">
                {selectedDim.name} · {selectedDim.enName}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-sm text-[#8F733E]">
                {radar[selectedKey]}
              </span>
              <span className="text-[10px] text-[#8C8578]">/ 100</span>
            </div>
          </div>
          <p className="text-[11px] text-[#696357] mt-1 leading-relaxed">
            {selectedDim.description}
          </p>
          <div className="mt-1.5 pt-1.5 border-t border-[#ECE5D7] flex items-center justify-between text-[10px]">
            <span className="text-[#847E72] font-oriental-serif">感官层级评定：</span>
            <span className="font-oriental-serif font-bold text-[#2A5E3C]">
              {getDimensionScoreText(radar[selectedKey])}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
