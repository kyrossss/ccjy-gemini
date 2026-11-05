import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import {
  OrientalEmptyStateVariant,
  SmartJumpRecommendation,
  getEmptyStatePreset,
} from '../utils/emptyStateLogic';
import { zenAudio } from '../utils/audioZen';

export interface OrientalEmptyStateProps {
  variant: OrientalEmptyStateVariant;
  title?: string;
  poem?: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  onSmartRecommendationClick?: (rec: SmartJumpRecommendation) => void;
  compact?: boolean;
}

/**
 * Custom Oriental Ink-Wash Brushstroke (东方雅韵 · 水墨设色笔触) Illustration per domain variant
 */
const OrientalIllustration: React.FC<{
  variant: OrientalEmptyStateVariant;
  sealText: string;
  inkMotif: string;
  compact?: boolean;
}> = ({ variant, sealText, inkMotif, compact = false }) => {
  return (
    <div
      className={`relative mx-auto flex items-center justify-center select-none ${
        compact ? 'w-26 h-26' : 'w-32 h-32'
      }`}
    >
      {/* Warm Xuan Paper Concentric Halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#F5EFE2] to-[#EAE1CF] border border-[#DED2BA] shadow-inner" />
      <div className="absolute inset-2 rounded-full border border-dashed border-[#CBBBA0]/60 pointer-events-none" />

      {/* Custom Domain Ink-Wash Brushstroke SVG Artwork */}
      <svg
        viewBox="0 0 120 120"
        className="relative z-10 w-full h-full p-2.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${sealText} · ${inkMotif} 东方雅韵水墨插画`}
      >
        <defs>
          {/* Ink-Wash Brushstroke Bleeding Filter (墨韵渗化滤镜) */}
          <filter id={`ink-wash-${variant}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <linearGradient id="ink-mountain-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#232B26" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#232B26" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Expressive Calligraphic Enso Brushstroke Arc (飞白水墨圆相笔触) */}
        <path
          d="M22 62 C18 32, 46 14, 76 20 C102 25, 108 58, 94 82 C82 102, 48 106, 30 88"
          stroke="#232B26"
          strokeOpacity="0.16"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="110 8"
          filter={`url(#ink-wash-${variant})`}
        />

        {(variant === 'home' || variant === 'terroir') && (
          <g filter={`url(#ink-wash-${variant})`}>
            {/* Distant Ink Wash Peaks (远山淡墨) */}
            <path
              d="M14 78 Q32 46 52 70 T90 50 L106 78 Z"
              fill="url(#ink-mountain-grad)"
            />
            {/* Foreground Ink Mountain Brushstroke (近山焦墨笔触) */}
            <path
              d="M18 82 L42 50 L64 75 L82 54 L104 82"
              stroke="#232B26"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Crescent Moon / Golden Sun */}
            <circle cx="82" cy="34" r="10.5" fill="#D8C496" fillOpacity="0.55" />
            <circle cx="86" cy="31" r="8.5" fill="#F1E9DA" />
            {/* Floating Cloud Mist Brushstrokes (山岚云气) */}
            <path
              d="M16 84 H104"
              stroke="#8F733E"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M28 91 Q60 88 92 91"
              stroke="#8F733E"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
            {/* Tea Leaf Bud in Mist */}
            <path
              d="M50 42 C50 32, 66 32, 66 42 C66 52, 50 52, 50 42 Z"
              fill="#2F6740"
              fillOpacity="0.22"
              stroke="#2F6740"
              strokeWidth="1.6"
            />
            <path d="M50 42 H66" stroke="#2F6740" strokeWidth="1.2" />
          </g>
        )}

        {variant === 'cart' && (
          <g filter={`url(#ink-wash-${variant})`}>
            {/* Rising Tea Steam Ink Wisps */}
            <path
              d="M48 35 C46 28, 55 25, 53 18"
              stroke="#8F733E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M64 37 C63 30, 71 27, 69 20"
              stroke="#8F733E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Pot Lid & Finial */}
            <circle cx="60" cy="45" r="3.5" fill="#8F733E" />
            <path
              d="M46 50 Q60 44 74 50"
              stroke="#232B26"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Pear-Shaped Zhuni Pot Body (孟臣梨形朱泥壶) */}
            <path
              d="M45 50 C38 62, 40 78, 60 78 C80 78, 82 62, 75 50 Z"
              fill="url(#ink-mountain-grad)"
              stroke="#232B26"
              strokeWidth="2.1"
            />
            {/* Spout & Handle */}
            <path
              d="M42 58 C33 56, 30 49, 26 48"
              stroke="#232B26"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M76 54 C88 54, 88 70, 74 71"
              stroke="#232B26"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Ink Brush Tray Base */}
            <path
              d="M26 84 Q60 87 94 84"
              stroke="#8F733E"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {variant === 'bookings' && (
          <g filter={`url(#ink-wash-${variant})`}>
            {/* Zen Low Tea Table Brushstrokes */}
            <path
              d="M24 73 H96 M31 73 V85 M89 73 V85"
              stroke="#232B26"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Incense Censer on Table */}
            <rect
              x="52"
              y="61"
              width="16"
              height="10"
              rx="3"
              fill="#8F733E"
              fillOpacity="0.25"
              stroke="#232B26"
              strokeWidth="1.8"
            />
            {/* Curling Incense Smoke (袅袅炉烟) */}
            <path
              d="M60 58 C54 50, 67 44, 59 34 C54 28, 64 23, 60 18"
              stroke="#8F733E"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Ink Bamboo Branch Accent (墨竹扫阶) */}
            <path
              d="M25 32 Q40 38 46 48"
              stroke="#2F6740"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M36 36 L29 44 M42 42 L36 50"
              stroke="#2F6740"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Dry Landscape Sand Ripples */}
            <path
              d="M22 91 Q42 87 60 91 T98 91"
              stroke="#8F733E"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
        )}

        {variant === 'consign' && (
          <g filter={`url(#ink-wash-${variant})`}>
            {/* Vintage Aged Puer Tea Cake & Provenance Stand */}
            <circle
              cx="60"
              cy="55"
              r="22"
              fill="url(#ink-mountain-grad)"
              stroke="#232B26"
              strokeWidth="2.1"
            />
            <circle
              cx="60"
              cy="55"
              r="15"
              stroke="#8F733E"
              strokeWidth="1.3"
              strokeDasharray="3 2"
            />
            {/* Inner Neifei Provenance Ticket */}
            <rect
              x="55"
              y="49"
              width="10"
              height="12"
              rx="1.5"
              fill="#FAF8F5"
              stroke="#B23A2B"
              strokeWidth="1.4"
            />
            {/* Wooden Pedestal Stand */}
            <path
              d="M35 82 H85 L78 89 H42 Z"
              fill="#232B26"
              fillOpacity="0.18"
              stroke="#232B26"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </g>
        )}

        {(variant === 'shop' || variant === 'orders') && (
          <g filter={`url(#ink-wash-${variant})`}>
            {/* Sancai Gaiwan (三才盖碗) */}
            <path
              d="M42 48 Q60 41 78 48"
              stroke="#232B26"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M55 44 H65"
              stroke="#8F733E"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M40 52 C42 70, 50 75, 60 75 C70 75, 78 70, 80 52 Z"
              fill="url(#ink-mountain-grad)"
              stroke="#232B26"
              strokeWidth="2"
            />
            {/* Saucer (茶船) */}
            <path
              d="M34 77 Q60 85 86 77"
              stroke="#8F733E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M46 34 C46 28, 52 26, 52 20 M68 35 C68 29, 73 27, 73 22"
              stroke="#8F733E"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>

      {/* Traditional Cinnabar Square Seal (朱砂闲章) */}
      <div className="absolute -bottom-1 -right-1 z-20 w-8 h-8 rounded-md bg-[#A63429] text-[#FAF8F5] border border-[#E8D5B5] shadow-xs flex items-center justify-center font-oriental-serif text-[11px] font-bold tracking-tighter leading-none rotate-3">
        {sealText}
      </div>
    </div>
  );
};

export const OrientalEmptyState: React.FC<OrientalEmptyStateProps> = ({
  variant,
  title,
  poem,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  onSmartRecommendationClick,
  compact = false,
}) => {
  const preset = getEmptyStatePreset(variant, {
    ...(title ? { title } : {}),
    ...(poem ? { poem } : {}),
    ...(description ? { description } : {}),
    ...(primaryActionLabel ? { primaryActionLabel } : {}),
    ...(secondaryActionLabel ? { secondaryActionLabel } : {}),
  });

  const handleSmartRecClick = (rec: SmartJumpRecommendation) => {
    zenAudio.playZenChime();
    if (onSmartRecommendationClick) {
      onSmartRecommendationClick(rec);
    } else if (onPrimaryAction) {
      onPrimaryAction();
    } else if (onSecondaryAction) {
      onSecondaryAction();
    }
  };

  return (
    <div
      className={`rounded-3xl bg-gradient-to-b from-[#FAF8F4] to-[#F3EFE6] border border-[#E4DDD0] text-center shadow-xs relative overflow-hidden ${
        compact ? 'p-5 space-y-3' : 'p-6 sm:p-8 space-y-4'
      }`}
    >
      {/* Subtle Corner Frame Ornaments */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#C9BC9E] pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#C9BC9E] pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#C9BC9E] pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#C9BC9E] pointer-events-none" />

      {/* Top Oriental Elegance Motif Pill */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFE9DC] border border-[#DED3BE] text-[10px] font-oriental-serif text-[#6B6150]">
        <Sparkles className="w-2.5 h-2.5 text-[#8F733E]" />
        <span>{preset.themeTag}</span>
        <span className="text-[#B8AD98]">·</span>
        <span className="text-[#8F733E]">{preset.inkMotif}</span>
      </div>

      {/* Oriental Ink-Wash Brushstroke SVG Illustration */}
      <OrientalIllustration
        variant={variant}
        sealText={preset.sealText}
        inkMotif={preset.inkMotif}
        compact={compact}
      />

      {/* Editorial Copy & Poetic Verse */}
      <div className="space-y-1.5 max-w-xs mx-auto">
        <span className="text-[9px] font-mono tracking-widest text-[#8F733E] uppercase block">
          {preset.enKicker}
        </span>
        <h3 className="font-oriental-serif text-sm sm:text-base font-bold text-[#1E2320] tracking-wide">
          {preset.title}
        </h3>
        <p className="font-oriental-serif text-xs text-[#8F733E] italic">
          「{preset.poem}」
        </p>
        <p className="text-xs text-[#6E675B] font-light leading-relaxed pt-0.5">
          {preset.description}
        </p>
      </div>

      {/* Smart Contextual Jump Recommendations (智能寻味推荐直达) */}
      {preset.smartRecommendations.length > 0 &&
        (onSmartRecommendationClick || onPrimaryAction || onSecondaryAction) && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-oriental-serif text-[#8C8474] block">
              ✦ 智能寻味引导 · 点击直达雅集专席
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {preset.smartRecommendations.map((rec) => (
                <button
                  type="button"
                  key={rec.id}
                  onClick={() => handleSmartRecClick(rec)}
                  className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-[#232B26] text-[#4E473B] hover:text-white border border-[#DED4C1] hover:border-[#232B26] text-[11px] font-oriental-serif transition-all flex items-center gap-1 shadow-2xs group"
                >
                  <span className="px-1.2 py-0.2 rounded bg-[#FAF5E8] group-hover:bg-white/15 text-[#8F733E] group-hover:text-[#E8D5A7] text-[9px] font-mono">
                    {rec.tag}
                  </span>
                  <span>{rec.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Guided Jump Links / CTAs */}
      {(onPrimaryAction || onSecondaryAction) && (
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {onPrimaryAction && (
            <button
              type="button"
              onClick={() => {
                zenAudio.playZenChime();
                onPrimaryAction();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#232B26] hover:bg-[#171C19] text-white text-xs font-oriental-serif font-medium tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs whitespace-nowrap"
            >
              <span>{preset.primaryActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8C496]" />
            </button>
          )}

          {onSecondaryAction && preset.secondaryActionLabel && (
            <button
              type="button"
              onClick={() => {
                zenAudio.playZenChime();
                onSecondaryAction();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FAF5E8] hover:bg-[#EFE4CC] text-[#8F733E] border border-[#E3D3B2] text-xs font-oriental-serif font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{preset.secondaryActionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
