import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Mountain,
  Wind,
  Layers,
  GitCompare,
  RotateCcw,
} from 'lucide-react';
import {
  TEA_REGIONS,
  TerroirRegion,
  TerroirSensoryProfile,
  TERROIR_RADAR_AXES,
  TerroirRadarAxisMeta,
  TerroirBeltFilter,
  getRegionThemeMeta,
  compareTerroirProfiles,
  resolveRegionSelectionState,
  mapRegionToCatalogProducts,
  filterVisibleTerroirRegions,
} from '../utils/terroirLogic';
import { PRODUCTS } from '../data/mockData';
import { D3TerroirRadarChart } from './D3TerroirRadarChart';
import { OrientalEmptyState } from './OrientalEmptyState';
import { zenAudio } from '../utils/audioZen';

interface TeaTerroirExplorerProps {
  onOpenProductById?: (productId: string) => void;
  onExploreShop?: () => void;
  onReserveTeaInSalon?: (teaName: string) => void;
  onFilterShopByTerroir?: (keyword: string) => void;
}

export const TeaTerroirExplorer: React.FC<TeaTerroirExplorerProps> = ({
  onOpenProductById,
  onExploreShop,
  onReserveTeaInSalon,
  onFilterShopByTerroir,
}) => {
  const [terroirBeltFilter, setTerroirBeltFilter] = useState<TerroirBeltFilter>('all');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('wuyi');
  const [compareRegionId, setCompareRegionId] = useState<string | null>('xihu');
  const [currentProfile, setCurrentProfile] = useState<TerroirSensoryProfile>(
    TEA_REGIONS[0].defaultProfile
  );
  const [activeAxisKey, setActiveAxisKey] =
    useState<keyof TerroirSensoryProfile['radarScores']>('mineralBody');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<'gemini-ai' | 'curated' | 'fallback'>('curated');

  const visibleRegions = filterVisibleTerroirRegions(terroirBeltFilter);
  const isStateModified =
    terroirBeltFilter !== 'all' ||
    selectedRegionId !== 'wuyi' ||
    compareRegionId !== 'xihu' ||
    activeAxisKey !== 'mineralBody' ||
    aiSource !== 'curated';

  const selectedRegion = TEA_REGIONS.find((r) => r.id === selectedRegionId) || TEA_REGIONS[0];
  const compareRegion = compareRegionId
    ? TEA_REGIONS.find((r) => r.id === compareRegionId) || null
    : null;
  const compareProfile = compareRegion ? compareRegion.defaultProfile : null;

  // Switch primary terroir region using pure tested state resolver
  const handleSelectRegion = (region: TerroirRegion) => {
    zenAudio.playZenChime();
    const resolved = resolveRegionSelectionState(region.id, compareRegionId);
    setSelectedRegionId(resolved.selectedRegion.id);
    setCurrentProfile(resolved.profile);
    setActiveAxisKey(resolved.topAxisKey);
    setCompareRegionId(resolved.nextCompareRegionId);
    setAiSource('curated');
  };

  // Reset terroir interactive state back to canonical initial defaults
  const handleResetTerroirState = () => {
    zenAudio.playZenChime();
    const initialResolved = resolveRegionSelectionState('wuyi', 'xihu');
    setTerroirBeltFilter('all');
    setSelectedRegionId(initialResolved.selectedRegion.id);
    setCurrentProfile(initialResolved.profile);
    setActiveAxisKey(initialResolved.topAxisKey);
    setCompareRegionId(initialResolved.nextCompareRegionId);
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

  const handleSelectAxis = (axis: TerroirRadarAxisMeta) => {
    setActiveAxisKey(axis.key);
  };

  const comparisonInsight = compareTerroirProfiles(currentProfile, compareProfile);
  const currentTheme = getRegionThemeMeta(selectedRegion.id);
  const catalogMapping = mapRegionToCatalogProducts(selectedRegion.id, PRODUCTS);

  return (
    <div className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex items-end justify-between px-1 gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>MOUNTAIN TERROIR D3 SPECTRUM · 山场风土</span>
          </div>
          <h2 className="font-oriental-serif text-lg font-bold text-[#1F2522] mt-0.5">
            山场风土 · 茶香感官光谱可视化
          </h2>
          <p className="text-xs text-[#7B7569] font-light mt-0.5">
            基于 D3.js 极坐标引擎，动态解构武夷岩韵、西湖清芳、乌岽山韵等产区风土感官光谱。
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isStateModified && (
            <button
              type="button"
              onClick={handleResetTerroirState}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FAF8F4] hover:bg-[#EFEAE0] text-[#7A705E] text-xs font-oriental-serif transition-colors border border-[#E5DEC9]"
              title="重置山场风土视图与筛选状态"
            >
              <RotateCcw className="w-3 h-3 text-[#8F733E]" />
              <span>重置</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleAiRegenerate}
            disabled={isLoadingAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2EDE4] hover:bg-[#E7E0D3] text-[#5C5446] text-xs font-oriental-serif transition-colors border border-[#DDD5C5] disabled:opacity-60 shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#8F733E] ${isLoadingAi ? 'animate-spin' : ''}`} />
            <span>{isLoadingAi ? 'AI 推演中...' : 'AI 重构光谱'}</span>
          </button>
        </div>
      </div>

      {/* Terroir Belt Filter Pills (including Uncharted Belt for Empty State Preview) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { id: 'all', label: '五大名山全谱' },
          { id: 'wuyi', label: '闽北·丹霞岩韵' },
          { id: 'wudong', label: '岭南·乌岽山韵' },
          { id: 'xihu', label: '江南·西湖清芳' },
          { id: 'menghai', label: '滇南·布朗霸韵' },
          { id: 'fuding', label: '闽东·太姥毫韵' },
          { id: 'uncharted', label: '雪域秘境·待拓' },
        ].map((belt) => (
          <button
            type="button"
            key={belt.id}
            onClick={() => {
              zenAudio.playZenChime();
              setTerroirBeltFilter(belt.id as TerroirBeltFilter);
              if (belt.id !== 'all' && belt.id !== 'uncharted') {
                const targetRegion = TEA_REGIONS.find((r) => r.id === belt.id);
                if (targetRegion) handleSelectRegion(targetRegion);
              }
            }}
            className={`px-3 py-1 rounded-xl text-[11px] font-oriental-serif whitespace-nowrap shrink-0 border transition-all ${
              terroirBeltFilter === belt.id
                ? 'bg-[#8F733E] text-white border-[#8F733E] font-bold shadow-2xs'
                : 'bg-[#FAF8F4] text-[#6B6457] border-[#E5DEC9] hover:border-[#8F733E]'
            }`}
          >
            {belt.label}
          </button>
        ))}
      </div>

      {visibleRegions.length === 0 ? (
        <OrientalEmptyState
          variant="terroir"
          compact
          onPrimaryAction={handleResetTerroirState}
          onSecondaryAction={onExploreShop}
          onSmartRecommendationClick={(rec) => {
            if (rec.searchKeyword && onFilterShopByTerroir) {
              onFilterShopByTerroir(rec.searchKeyword);
            } else if (onExploreShop) {
              onExploreShop();
            } else {
              handleResetTerroirState();
            }
          }}
        />
      ) : (
        <>
          {/* Tea Mountains Horizontal Selector */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
            {visibleRegions.map((region) => {
              const isSelected = region.id === selectedRegionId;
              const theme = getRegionThemeMeta(region.id);
              return (
                <button
                  type="button"
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
                    <span
                      className={`text-[9px] font-oriental-serif px-1.5 py-0.2 rounded ${
                        isSelected
                          ? 'bg-white/15 text-[#E8D5A7]'
                          : 'bg-[#F5F1E8] text-[#7A705E]'
                      }`}
                    >
                      {theme.signatureCharm.split(' ')[0]}
                    </span>
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

      {/* Main D3 Sensory Radar & Aroma Spectrum Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE6DB] shadow-xs space-y-5 relative overflow-hidden">
        {/* Top Tagline, Region Badge & Dual-Region Comparison Selector */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-[#F2EFE8] pb-4 gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold">
                {selectedRegion.pinyin}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F0E6] text-[#7A705E] font-oriental-serif border border-[#E8DEC9]">
                {aiSource === 'gemini-ai' ? '✦ Gemini AI 实时风土推演' : '春城嘉叶 · 馆藏山场风土谱'}
              </span>
            </div>
            <h3 className="font-oriental-serif text-base font-bold text-[#1F2522] mt-1">
              {currentProfile.regionName}
            </h3>
            <p className="font-oriental-serif text-xs text-[#8F733E] italic mt-0.5">
              {currentProfile.tagline}
            </p>
          </div>

          {/* Dual-Terroir Overlay Control (e.g. 武夷岩韵 vs 西湖清芳) */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F4] px-2.5 py-1.5 rounded-xl border border-[#E5DEC9] shrink-0 self-start">
            <GitCompare className="w-3.5 h-3.5 text-[#8F733E]" />
            <span className="text-[10px] font-oriental-serif text-[#6A6355]">叠加对照：</span>
            <select
              value={compareRegionId || 'none'}
              onChange={(e) => {
                zenAudio.playZenChime();
                const val = e.target.value;
                setCompareRegionId(val === 'none' ? null : val);
              }}
              aria-label="选择叠加对照产区"
              className="text-[11px] font-oriental-serif font-bold text-[#232B26] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="none">关闭双产区对照</option>
              {TEA_REGIONS.filter((r) => r.id !== selectedRegionId).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name.split(' ')[0]} ({getRegionThemeMeta(r.id).signatureCharm.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* D3.js Interactive Radar Chart & Dimension Progress Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <D3TerroirRadarChart
            primaryProfile={currentProfile}
            compareProfile={compareProfile}
            activeAxisKey={activeAxisKey}
            onSelectAxis={handleSelectAxis}
          />

          {/* Interactive 5-Dimension Spectrum Bars + Micro-Terroir Factors */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-[#7A7366] pb-1 border-b border-[#F2EFE8]">
              <span className="font-oriental-serif font-bold text-[#232B26]">
                五维茶香感官光谱 (点击维度联动图谱)
              </span>
              <span className="font-mono text-[10px]">0 - 100 INDEX</span>
            </div>

            {TERROIR_RADAR_AXES.map((axis) => {
              const score = currentProfile.radarScores[axis.key];
              const compScore =
                compareProfile && compareProfile.regionId !== currentProfile.regionId
                  ? compareProfile.radarScores[axis.key]
                  : null;
              const isFocused = activeAxisKey === axis.key;

              return (
                <button
                  type="button"
                  key={axis.key}
                  onClick={() => {
                    zenAudio.playZenChime();
                    setActiveAxisKey(axis.key);
                  }}
                  className={`w-full text-left p-2 rounded-xl border transition-all space-y-1 ${
                    isFocused
                      ? 'bg-[#FAF6EE] border-[#8F733E] shadow-2xs'
                      : 'bg-white border-transparent hover:bg-[#FAF8F4]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-oriental-serif text-[#232B26] font-bold">
                        {axis.label}
                      </span>
                      <span className="text-[10px] text-[#8A8274] font-oriental-serif">
                        ({axis.shortLabel})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span
                        className="font-bold text-xs"
                        style={{ color: currentTheme.strokeColor }}
                      >
                        {score}
                      </span>
                      {compScore !== null && (
                        <span className="text-[10px] text-[#8E8779]">vs {compScore}</span>
                      )}
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-[#EFE9DF] overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${score}%`,
                        backgroundColor: currentTheme.strokeColor,
                      }}
                    />
                  </div>
                </button>
              );
            })}

            {/* Comparative Terroir Insight Callout */}
            <div className="p-2.5 rounded-xl bg-[#F5F1E8] border border-[#E4DAC6] text-[11px] text-[#4E473B] font-oriental-serif leading-relaxed">
              {comparisonInsight.comparisonSummary}
            </div>
          </div>
        </div>

        {/* Terroir Physical Factors Bar (海拔 · 土壤母质 · 微气候) */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#ECE5D8]">
            <div className="flex items-center gap-1 text-[10px] text-[#8C8476] font-mono">
              <Mountain className="w-3 h-3 text-[#8F733E]" />
              <span>海拔垂直带</span>
            </div>
            <p className="font-oriental-serif font-bold text-[#232B26] mt-0.5 text-[11px] truncate">
              {selectedRegion.altitude}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#ECE5D8]">
            <div className="flex items-center gap-1 text-[10px] text-[#8C8476] font-mono">
              <Layers className="w-3 h-3 text-[#8F733E]" />
              <span>矿质土壤母岩</span>
            </div>
            <p className="font-oriental-serif font-bold text-[#232B26] mt-0.5 text-[11px] truncate">
              {selectedRegion.soil}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#ECE5D8]">
            <div className="flex items-center gap-1 text-[10px] text-[#8C8476] font-mono">
              <Wind className="w-3 h-3 text-[#8F733E]" />
              <span>云雾微气候</span>
            </div>
            <p className="font-oriental-serif font-bold text-[#232B26] mt-0.5 text-[11px] truncate">
              {selectedRegion.climate}
            </p>
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

        {/* Bottom CTA: Go to related product in Shop, Filter Shop, or Reserve in Salon */}
        <div className="pt-2 flex items-center justify-between border-t border-[#F2EFE8] flex-wrap gap-2">
          <div className="text-xs text-[#6F685B]">
            <span>源产地代表茗茶：</span>
            <span className="font-oriental-serif font-bold text-[#1F2522]">
              {catalogMapping.representativeProduct
                ? catalogMapping.representativeProduct.name
                : selectedRegion.signatureTea}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onFilterShopByTerroir && (
              <button
                type="button"
                onClick={() => {
                  zenAudio.playZenChime();
                  onFilterShopByTerroir(catalogMapping.searchKeyword);
                }}
                className="px-3 py-2 rounded-xl bg-[#F3EFE7] hover:bg-[#E7E0D3] text-[#4E473B] border border-[#DDD4C2] text-xs font-oriental-serif flex items-center gap-1 transition-colors"
              >
                <span>检索该山场 ({catalogMapping.filteredProducts.length}款)</span>
              </button>
            )}
            {onReserveTeaInSalon && (
              <button
                type="button"
                onClick={() => {
                  zenAudio.playZenChime();
                  onReserveTeaInSalon(selectedRegion.signatureTea);
                }}
                className="px-3 py-2 rounded-xl bg-[#FAF5E8] hover:bg-[#F2E6CC] text-[#8F733E] border border-[#E4D5B7] text-xs font-oriental-serif font-bold flex items-center gap-1 transition-colors"
              >
                <span>携茶预约茶室</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (catalogMapping.representativeProduct && onOpenProductById) {
                  onOpenProductById(catalogMapping.representativeProduct.id);
                } else if (selectedRegion.matchedProductId && onOpenProductById) {
                  onOpenProductById(selectedRegion.matchedProductId);
                } else if (onExploreShop) {
                  onExploreShop();
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white text-xs font-oriental-serif flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>品鉴代表茶详情</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

