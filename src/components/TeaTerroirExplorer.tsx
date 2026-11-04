import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Mountain,
  Droplets,
  Wind,
  Layers,
  ChevronRight,
  Sparkle,
} from 'lucide-react';
import { TEA_REGIONS, TerroirRegion, TerroirSensoryProfile } from '../utils/terroirLogic';
import { zenAudio } from '../utils/audioZen';

interface TeaTerroirExplorerProps {
  onOpenProductById?: (productId: string) => void;
  onExploreShop?: () => void;
}

export const TeaTerroirExplorer: React.FC<TeaTerroirExplorerProps> = ({
  onOpenProductById,
  onExploreShop,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('wuyi');
  const [currentProfile, setCurrentProfile] = useState<TerroirSensoryProfile>(
    TEA_REGIONS[0].defaultProfile
  );
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<'gemini-ai' | 'curated' | 'fallback'>('curated');

  const selectedRegion = TEA_REGIONS.find((r) => r.id === selectedRegionId) || TEA_REGIONS[0];

  // Fetch or switch profile when region changes
  const handleSelectRegion = async (region: TerroirRegion) => {
    zenAudio.playZenChime();
    setSelectedRegionId(region.id);
    setCurrentProfile(region.defaultProfile);
    setAiSource('curated');
  };

  // AI Re-generation invocation
  const handleAiRegenerate = async () => {
    zenAudio.playZenChime();
    setIsLoadingAi(true);
    try {
      const response = await fetch('/api/tea-terroir/sensory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionId: selectedRegion.id,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      if (data.profile) {
        setCurrentProfile(data.profile);
        setAiSource(data.source || 'gemini-ai');
      }
    } catch (err) {
      console.warn('AI Terroir sensory fetch fallback:', err);
      setCurrentProfile(selectedRegion.defaultProfile);
      setAiSource('fallback');
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Radar Polygon Point calculation (5-axis radar chart)
  // Axes: 0: 香气高锐度 (top), 1: 山场岩骨韵 (top-right), 2: 喉韵幽长度 (bottom-right), 3: 汤感稠厚度 (bottom-left), 4: 回甘生津度 (top-left)
  const scores = [
    currentProfile.radarScores.aroma,
    currentProfile.radarScores.mineralBody,
    currentProfile.radarScores.throatDepth,
    currentProfile.radarScores.mouthfeel,
    currentProfile.radarScores.sweetness,
  ];

  const labels = ['香气高锐', '山场骨韵', '喉韵悠长', '汤感稠厚', '回甘生津'];
  const center = 100;
  const maxRadius = 70;

  // Convert angles & score ratios to SVG coordinates
  const getRadarPoint = (index: number, score: number) => {
    const angle = (index * (360 / 5) - 90) * (Math.PI / 180);
    const radius = (score / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  };

  const polygonPoints = scores.map((s, idx) => getRadarPoint(idx, s)).join(' ');

  return (
    <div className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>TERROIR SENSORY RADAR · 寻味茶山</span>
          </div>
          <h2 className="font-oriental-serif text-lg font-bold text-[#1F2522] mt-0.5">
            寻味茶山 · AI 感官香气图谱
          </h2>
          <p className="text-xs text-[#7B7569] font-light mt-0.5">
            滑动切换名山原野，AI 实时推演风土微气候与三调茶香感官意象。
          </p>
        </div>

        <button
          onClick={handleAiRegenerate}
          disabled={isLoadingAi}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2EDE4] hover:bg-[#E7E0D3] text-[#5C5446] text-xs font-oriental-serif transition-colors border border-[#DDD5C5] disabled:opacity-60"
        >
          <Sparkles className={`w-3.5 h-3.5 text-[#8F733E] ${isLoadingAi ? 'animate-spin' : ''}`} />
          <span>{isLoadingAi ? 'AI 推演中...' : 'AI 重构香气'}</span>
        </button>
      </div>

      {/* Tea Mountains Horizontal Slider / Carousel */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {TEA_REGIONS.map((region) => {
          const isSelected = region.id === selectedRegionId;
          return (
            <button
              key={region.id}
              onClick={() => handleSelectRegion(region)}
              className={`flex-shrink-0 text-left p-3 rounded-2xl border transition-all w-48 relative overflow-hidden ${
                isSelected
                  ? 'bg-[#232B26] text-white border-[#232B26] shadow-md scale-[1.01]'
                  : 'bg-white text-[#2B332E] border-[#E8E2D5] hover:border-[#232B26]/30 hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${
                    isSelected ? 'text-[#D8C496]' : 'text-[#8F733E]'
                  }`}
                >
                  {region.province}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#D8C496] animate-pulse" />
                )}
              </div>

              <h3
                className={`font-oriental-serif text-sm font-bold truncate ${
                  isSelected ? 'text-white' : 'text-[#1F2522]'
                }`}
              >
                {region.name}
              </h3>

              <div
                className={`text-[11px] font-oriental-serif truncate mt-1 ${
                  isSelected ? 'text-white/80' : 'text-[#6F695E]'
                }`}
              >
                {region.signatureTea}
              </div>

              <div
                className={`text-[10px] font-mono mt-2 pt-1.5 border-t truncate ${
                  isSelected
                    ? 'border-white/15 text-white/60'
                    : 'border-[#F0EBE1] text-[#938C7E]'
                }`}
              >
                {region.altitude}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Sensory Radar & Aroma Spectrum Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE6DB] shadow-xs space-y-5 relative overflow-hidden">
        {/* Top Tagline & Region Badge */}
        <div className="flex items-start justify-between border-b border-[#F2EFE8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold">
                {selectedRegion.pinyin}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F0E6] text-[#7A705E] font-oriental-serif border border-[#E8DEC9]">
                {aiSource === 'gemini-ai' ? '✦ Gemini 3.8 AI 灵感' : '春城嘉叶 · 馆藏风土档案'}
              </span>
            </div>
            <h3 className="font-oriental-serif text-base font-bold text-[#1F2522] mt-1">
              {currentProfile.regionName}
            </h3>
            <p className="font-oriental-serif text-xs text-[#8F733E] italic mt-0.5">
              {currentProfile.tagline}
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-[#F5F1E8] border border-[#DDD5C5] flex items-center justify-center shrink-0 text-[#232B26]">
            <Mountain className="w-5 h-5 text-[#8F733E]" />
          </div>
        </div>

        {/* Sensory Radar & Dimension Scores (Side-by-side or responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Visual SVG Radar Chart */}
          <div className="flex flex-col items-center justify-center bg-[#FAF8F4] p-3 rounded-2xl border border-[#ECE5D8] relative">
            <span className="text-[10px] font-mono text-[#8C8578] uppercase tracking-wider mb-1">
              FIVE-DIMENSION SENSORY RADAR
            </span>
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 max-w-full drop-shadow-xs"
            >
              {/* Concentric Reference Pentagons (20%, 40%, 60%, 80%, 100%) */}
              {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                const ringPoints = Array.from({ length: 5 })
                  .map((_, idx) => {
                    const angle = (idx * (360 / 5) - 90) * (Math.PI / 180);
                    const r = ratio * maxRadius;
                    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={i}
                    points={ringPoints}
                    fill="none"
                    stroke="#E2D9CA"
                    strokeWidth="0.8"
                    strokeDasharray={ratio === 1.0 ? 'none' : '2,2'}
                  />
                );
              })}

              {/* Axis Rays */}
              {Array.from({ length: 5 }).map((_, idx) => {
                const angle = (idx * (360 / 5) - 90) * (Math.PI / 180);
                const x2 = center + maxRadius * Math.cos(angle);
                const y2 = center + maxRadius * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="#DCD2C0"
                    strokeWidth="0.8"
                  />
                );
              })}

              {/* Data Radar Area */}
              <polygon
                points={polygonPoints}
                fill="rgba(143, 115, 62, 0.22)"
                stroke="#8F733E"
                strokeWidth="2"
                className="transition-all duration-700 ease-out"
              />

              {/* Data Points */}
              {scores.map((score, idx) => {
                const angle = (idx * (360 / 5) - 90) * (Math.PI / 180);
                const r = (score / 100) * maxRadius;
                const cx = center + r * Math.cos(angle);
                const cy = center + r * Math.sin(angle);
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r="3.5"
                    fill="#232B26"
                    stroke="#FAF8F4"
                    strokeWidth="1.5"
                    className="transition-all duration-700 ease-out"
                  />
                );
              })}

              {/* Labels on vertices */}
              {labels.map((lbl, idx) => {
                const angle = (idx * (360 / 5) - 90) * (Math.PI / 180);
                const textR = maxRadius + 16;
                const tx = center + textR * Math.cos(angle);
                const ty = center + textR * Math.sin(angle) + 3;
                return (
                  <text
                    key={idx}
                    x={tx}
                    y={ty}
                    fontSize="8.5"
                    textAnchor="middle"
                    fill="#5A5243"
                    fontFamily="serif"
                  >
                    {lbl}
                  </text>
                );
              })}
            </svg>
            <span className="text-[10px] text-[#A29A8C] mt-1 font-mono">
              五维感官雷达均值 · 综合气韵极境
            </span>
          </div>

          {/* Scores Breakdown List */}
          <div className="space-y-2">
            {[
              { label: '香气高锐度', score: currentProfile.radarScores.aroma, desc: '迎鼻扬香，毫香花香冲天' },
              { label: '山场岩骨韵', score: currentProfile.radarScores.mineralBody, desc: '砂岩矿质，刚劲骨力劲挺' },
              { label: '回甘生津度', score: currentProfile.radarScores.sweetness, desc: '两颊清泉，冰糖甜意绵长' },
              { label: '汤感稠厚度', score: currentProfile.radarScores.mouthfeel, desc: '稠滑如浆，茶胶饱满顺滑' },
              { label: '喉韵幽长度', score: currentProfile.radarScores.throatDepth, desc: '深沉入喉，冷杯留香不散' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-oriental-serif text-[#303833] font-medium">
                    {item.label}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-bold text-[#8F733E]">
                      {item.score}
                    </span>
                    <span className="text-[10px] text-[#A69F92]">/ 100</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EFE9DF] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B5985E] to-[#232B26] rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Three-Stage Aroma Symphony (前调 · 中调 · 后调) */}
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E9E3D6] space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-oriental-serif font-bold text-[#232B26]">
            <Wind className="w-3.5 h-3.5 text-[#8F733E]" />
            <span>三调感官香气谱 · 迎鼻至喉底</span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs">
            {/* Top Note */}
            <div className="bg-white p-3 rounded-xl border border-[#EDE7DB] flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#FAF5E8] text-[#8F733E] font-oriental-serif text-[11px] font-bold flex items-center justify-center shrink-0">
                前
              </span>
              <div>
                <span className="text-[10px] font-mono text-[#8C8476] block">
                  迎鼻初香 · TOP NOTE
                </span>
                <p className="font-oriental-serif text-xs font-semibold text-[#1F2522] mt-0.5">
                  {currentProfile.notes.top}
                </p>
              </div>
            </div>

            {/* Heart Note */}
            <div className="bg-white p-3 rounded-xl border border-[#EDE7DB] flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F6740] font-oriental-serif text-[11px] font-bold flex items-center justify-center shrink-0">
                中
              </span>
              <div>
                <span className="text-[10px] font-mono text-[#8C8476] block">
                  啜饮落水香 · HEART NOTE
                </span>
                <p className="font-oriental-serif text-xs font-semibold text-[#1F2522] mt-0.5">
                  {currentProfile.notes.heart}
                </p>
              </div>
            </div>

            {/* Base Note */}
            <div className="bg-white p-3 rounded-xl border border-[#EDE7DB] flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#F4EFE6] text-[#4F4638] font-oriental-serif text-[11px] font-bold flex items-center justify-center shrink-0">
                后
              </span>
              <div>
                <span className="text-[10px] font-mono text-[#8C8476] block">
                  杯底冷香与喉韵 · BASE NOTE
                </span>
                <p className="font-oriental-serif text-xs font-semibold text-[#1F2522] mt-0.5">
                  {currentProfile.notes.base}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Aroma Tags Matrix */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {currentProfile.keyAromaDescriptors.map((desc, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-[#F5F1E8] text-[#4F483B] text-[11px] font-oriental-serif border border-[#E4DEC9]"
            >
              {desc}
            </span>
          ))}
        </div>

        {/* Poetic Vision & Terroir Science */}
        <div className="space-y-2 text-xs">
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E3D6]">
            <span className="text-[10px] font-mono text-[#8C8476] block uppercase tracking-wide">
              AI TERROIR SYNTHESIS · 风土解构
            </span>
            <p className="font-oriental-serif text-xs text-[#4F483D] leading-relaxed mt-1">
              {currentProfile.poeticVision}
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E3D6]">
            <span className="text-[10px] font-mono text-[#8C8476] block uppercase tracking-wide">
              MICROCLIMATE & SOIL ESSENCE · 风土密码
            </span>
            <p className="font-oriental-serif text-xs text-[#5E574B] leading-relaxed mt-1">
              {currentProfile.terroirEssence}
            </p>
          </div>
        </div>

        {/* Bottom CTA: Go to related product in Shop */}
        <div className="pt-2 flex items-center justify-between border-t border-[#F2EFE8]">
          <div className="text-xs text-[#6F685B]">
            <span>源产地代表茗茶：</span>
            <span className="font-oriental-serif font-bold text-[#1F2522]">
              {selectedRegion.signatureTea}
            </span>
          </div>

          <button
            onClick={() => {
              if (selectedRegion.matchedProductId && onOpenProductById) {
                onOpenProductById(selectedRegion.matchedProductId);
              } else if (onExploreShop) {
                onExploreShop();
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white text-xs font-oriental-serif flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>品鉴该山场茶品</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
