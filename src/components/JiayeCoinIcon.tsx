import React from 'react';

export interface JiayeCoinIconProps {
  /**
   * Pixel dimension or preset size:
   * 'xs' = 11px, 'sm' = 13px, 'md' = 15px, 'lg' = 20px, 'xl' = 28px
   * Default is 14px (compact, bookish proportion aligned with text)
   */
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Color tone theme:
   * - 'current': Inherits text color via currentColor (pure oriental calligraphic line)
   * - 'gold': Song Dynasty antique bronze-gold (#8F733E)
   * - 'cinnabar': Seal cinnabar vermilion (#A63429)
   * - 'ink': Deep scholar pine soot ink (#232B26)
   * - 'light': Soft warm ivory (#FAF5EE) for dark cards
   */
  variant?: 'current' | 'gold' | 'cinnabar' | 'ink' | 'light' | 'antique' | 'shimmer';
  className?: string;
  title?: string;
}

const SIZE_MAP: Record<string, number> = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 20,
  xl: 28,
};

/**
 * 春城嘉叶 · 东方极简圆形古钱币线条 Logo (Jiaye Intaglio Seal Coin)
 * 采用宋代金石印刻「阴刻白文」美学与极简线条：
 * 外圆内方规制，方孔内刻极微小之「叶」字，摒弃写实厚重金属浮雕，
 * 专为东方书卷排版设计，尺寸紧凑、与正文字体自然居中平齐。
 */
export const JiayeCoinIcon: React.FC<JiayeCoinIconProps> = ({
  size = 'sm',
  variant = 'gold',
  className = '',
  title = '嘉叶币',
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 14;

  // Resolve palette for minimal seal engraving
  let strokeColor = '#8F733E';
  let sealFill = 'currentColor';

  if (variant === 'current') {
    strokeColor = 'currentColor';
    sealFill = 'currentColor';
  } else if (variant === 'cinnabar') {
    strokeColor = '#A63429';
    sealFill = '#A63429';
  } else if (variant === 'ink') {
    strokeColor = '#232B26';
    sealFill = '#232B26';
  } else if (variant === 'light') {
    strokeColor = '#EADCC3';
    sealFill = '#EADCC3';
  } else {
    // 'gold', 'antique', 'shimmer' defaults to understated Song antique bronze
    strokeColor = '#8F733E';
    sealFill = '#8F733E';
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 align-middle select-none relative -top-[0.5px] ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      title={title}
      role="img"
      aria-label="嘉叶币"
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Outer Circular Rim (外圆·天道·极简双道细弦线) */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={strokeColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeOpacity="0.45"
        />

        {/* Four cardinal guide ticks (金石十字衡准微刻) */}
        <line x1="50" y1="4" x2="50" y2="10" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="50" y1="90" x2="50" y2="96" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="4" y1="50" x2="10" y2="50" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="90" y1="50" x2="96" y2="50" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.6" />

        {/* Center Square Aperture (内方·地德·古代方孔古印底框) */}
        <rect
          x="33"
          y="33"
          width="34"
          height="34"
          rx="2"
          fill={sealFill}
          fillOpacity={variant === 'light' ? '0.2' : '0.12'}
          stroke={strokeColor}
          strokeWidth="2.8"
        />

        {/* Intaglio (阴刻镂空白文) Seal Engraving "叶" Glyph (小篆宋体微雕字骨) */}
        {/* 口部 (Leaf mouth radical, precise intaglio lines) */}
        <rect
          x="40"
          y="41"
          width="7"
          height="9"
          rx="0.5"
          stroke={strokeColor}
          strokeWidth="1.8"
          fill="none"
        />
        {/* 十字/木字骨 (Vertical pillar & horizontal branch) */}
        {/* Horizontal beam */}
        <line
          x1="51"
          y1="45"
          x2="60"
          y2="45"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Main central vertical stem passing down */}
        <line
          x1="55"
          y1="38"
          x2="55"
          y2="61"
          stroke={strokeColor}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Left spreading tea vein stroke */}
        <path
          d="M 54 48 Q 49 53 44 59"
          stroke={strokeColor}
          strokeWidth="1.9"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right budding tea leaf stroke */}
        <path
          d="M 56 48 Q 59 53 62 58"
          stroke={strokeColor}
          strokeWidth="1.9"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
};

/**
 * 伴随文字与金额的嘉叶币精致微型铭牌 (JiayeCoinBadge)
 * 纯粹书卷文字排版，字体基线严整对齐
 */
export const JiayeCoinBadge: React.FC<{
  amount: number | string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'gold' | 'ink' | 'light';
  showUnit?: boolean;
  className?: string;
}> = ({
  amount,
  size = 'sm',
  variant = 'gold',
  showUnit = true,
  className = '',
}) => {
  const iconSize = size === 'xs' ? 11 : size === 'sm' ? 13 : 15;
  const isLight = variant === 'light';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono tracking-tight font-medium whitespace-nowrap shrink-0 ${
        isLight ? 'text-[#FAF5EE]' : 'text-[#8F733E]'
      } ${className}`}
    >
      <JiayeCoinIcon size={iconSize} variant={isLight ? 'light' : 'gold'} />
      <span className="tabular-nums font-semibold leading-none">
        {typeof amount === 'number' ? amount.toLocaleString() : amount}
      </span>
      {showUnit && (
        <span
          className={`text-[10px] font-oriental-serif ml-0.5 leading-none whitespace-nowrap ${
            isLight ? 'text-[#C9B68F]' : 'text-[#7A6D56]'
          }`}
        >
          嘉叶币
        </span>
      )}
    </span>
  );
};
