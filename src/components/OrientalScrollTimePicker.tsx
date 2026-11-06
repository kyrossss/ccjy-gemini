import React, { useRef, useEffect } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  Check,
} from 'lucide-react';
import { TimeSlotOptionConfig } from './ReservationModal';
import { zenAudio } from '../utils/audioZen';

interface OrientalScrollTimePickerProps {
  options: TimeSlotOptionConfig[];
  selectedSlotKey: string;
  onSelectSlot: (slot: TimeSlotOptionConfig) => void;
  isCharcoalPrep: boolean;
  onToggleCharcoalPrep?: () => void;
  roomBasePrice?: number;
  className?: string;
}

/**
 * 东方美学卷轴滚动时间选择器 (Oriental Scroll Time-Picker)
 * 以宋代书画横轴装裱为灵感，呈现紫檀轴头、绫绢包边与宣纸界格
 * 支持丝滑横向卷轴拖拽/滑动吸附，选定时拓印朱红吉印，伴随空灵铜罄音效
 */
export const OrientalScrollTimePicker: React.FC<OrientalScrollTimePickerProps> = ({
  options,
  selectedSlotKey,
  onSelectSlot,
  isCharcoalPrep,
  onToggleCharcoalPrep,
  roomBasePrice,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-scroll selected item into view
  useEffect(() => {
    const activeIdx = options.findIndex((opt) => opt.key === selectedSlotKey);
    if (activeIdx >= 0 && cardRefs.current[activeIdx]) {
      cardRefs.current[activeIdx]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedSlotKey, options]);

  const handleScroll = (direction: 'left' | 'right') => {
    zenAudio.playZenChime();
    if (scrollContainerRef.current) {
      const scrollDelta = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollDelta, behavior: 'smooth' });
    }
  };

  const handleSelect = (slot: TimeSlotOptionConfig) => {
    zenAudio.playZenChime();
    onSelectSlot(slot);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* 卷轴顶部题签与炭火备水模式切换 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* 卷轴题签 */}
          <div className="flex items-center gap-1.5 text-xs font-oriental-serif font-bold text-[#232B26]">
            <span className="w-1.5 h-3.5 bg-[#8F733E] rounded-xs inline-block" />
            <span>开卷择时 · 雅席吉辰</span>
          </div>
          <span className="text-[10px] text-[#8C8372] font-oriental-serif hidden sm:inline">
            横向展卷滑动 · 钦定入席吉时
          </span>
        </div>

        {/* 炭火备水模式快速切换 */}
        {onToggleCharcoalPrep && (
          <button
            type="button"
            onClick={() => {
              zenAudio.playZenChime();
              onToggleCharcoalPrep();
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-oriental-serif flex items-center gap-1.5 border transition-all active:scale-95 ${
              isCharcoalPrep
                ? 'bg-[#FBEBE7] text-[#BF360C] border-[#FFAB91] shadow-2xs font-bold'
                : 'bg-white text-[#736B5E] border-[#DED7C7] hover:border-[#8F733E]'
            }`}
            title="开启炭火备水（时段自动顺延30分钟模拟生火候汤）"
          >
            <Flame
              className={`w-3 h-3 transition-transform ${
                isCharcoalPrep ? 'text-[#E64A19] animate-pulse scale-110' : 'text-[#A09888]'
              }`}
            />
            <span>炭火备水 (+30分)</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isCharcoalPrep ? 'bg-[#E64A19] animate-ping' : 'bg-[#D3CABB]'
              }`}
            />
          </button>
        )}
      </div>

      {/* 宋代卷轴装裱主体 (Oriental Mounted Scroll Frame) */}
      <div className="relative rounded-2xl bg-[#F6F2E9] p-2 sm:p-2.5 border-2 border-[#D8C7A5] shadow-xs overflow-hidden">
        {/* 左侧紫檀卷轴轴头 (Left Spindle Head) */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#201813] via-[#3E2D22] to-[#1C140F] border-r border-[#8F733E]/40 z-20 flex flex-col justify-between py-1.5 shadow-sm"
        >
          <div className="w-full h-2 bg-[#C29D55] mx-auto opacity-70" />
          <div className="w-0.5 h-12 bg-[#EAD8B0] mx-auto opacity-40 rounded-full" />
          <div className="w-full h-2 bg-[#C29D55] mx-auto opacity-70" />
        </div>

        {/* 右侧紫檀卷轴轴头 (Right Spindle Head) */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-[#201813] via-[#3E2D22] to-[#1C140F] border-l border-[#8F733E]/40 z-20 flex flex-col justify-between py-1.5 shadow-sm"
        >
          <div className="w-full h-2 bg-[#C29D55] mx-auto opacity-70" />
          <div className="w-0.5 h-12 bg-[#EAD8B0] mx-auto opacity-40 rounded-full" />
          <div className="w-full h-2 bg-[#C29D55] mx-auto opacity-70" />
        </div>

        {/* 展卷左右轻推控制按钮 (Scroll Arrows) */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-[#4A4337] shadow-md border border-[#D5C7B0] flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-95"
          aria-label="向左展卷"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-[#4A4337] shadow-md border border-[#D5C7B0] flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-95"
          aria-label="向右展卷"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* 宣纸卷面横向滑动履带 (Scroll Paper Ribbon Canvas) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-5 py-1.5"
          style={{
            backgroundImage:
              'radial-gradient(#E8DFC9 0.75px, transparent 0.75px), radial-gradient(#E8DFC9 0.75px, #FAF7F0 0.75px)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.key === selectedSlotKey;
            const timeRange = isCharcoalPrep ? opt.charcoalTime : opt.standardTime;
            const poetic = isCharcoalPrep ? opt.charcoalPoetic : opt.standardPoetic;

            // Differentiated tier specific annotations
            let tierCustomBadge = '';
            if (roomBasePrice === 1280) {
              if (opt.key === 'afternoon') tierCustomBadge = '下午场 14:00-17:00 · 先约先得';
              else if (opt.key === 'evening') tierCustomBadge = '夜晚场 20:00-23:00 · 先约先得';
            } else if (roomBasePrice === 2680) {
              tierCustomBadge = '3-5小时 · 一人专享 · 专车接送';
            } else if (roomBasePrice === 598) {
              tierCustomBadge = '2-3小时 · 尽兴可添私存原茶';
            }

            return (
              <button
                type="button"
                key={opt.key}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => handleSelect(opt)}
                className={`snap-center shrink-0 w-[84%] sm:w-[54%] rounded-xl p-3 border text-left transition-all relative overflow-hidden select-none active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#212824] text-[#FAF8F5] border-[#8F733E] shadow-md ring-2 ring-[#8F733E]/50'
                    : 'bg-white/90 backdrop-blur-2xs text-[#443C32] border-[#D9CEBA] hover:border-[#8F733E] hover:bg-white'
                }`}
              >
                {/* Selected Top Gold Ribbon & Background Wash */}
                {isSelected && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8F733E] via-[#C9A96E] to-[#8F733E]" />
                    <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#8F733E]/15 blur-xl pointer-events-none" />
                  </>
                )}

                {/* Header: Slot Name & Time Period Icon */}
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-oriental-serif font-bold text-xs ${
                        isSelected ? 'bg-[#8F733E] text-white' : 'bg-[#F2ECE1] text-[#8F733E]'
                      }`}
                    >
                      {opt.key === 'morning' ? (
                        <Sun className="w-3.5 h-3.5" />
                      ) : opt.key === 'afternoon' ? (
                        <Sunset className="w-3.5 h-3.5" />
                      ) : (
                        <Moon className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="font-oriental-serif text-xs font-bold tracking-wider">
                      {opt.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border leading-none whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-white/10 text-[#E7D6B3] border-white/20'
                          : 'bg-[#FAF4E6] text-[#8F733E] border-[#8F733E]/20'
                      }`}
                    >
                      {opt.subTitle}
                    </span>
                  </div>

                  {/* Stamp / Selection Status */}
                  {isSelected ? (
                    <div className="flex items-center gap-1 font-oriental-serif text-[10px] font-bold text-[#C2410C] bg-[#FBEBE7] px-2.5 py-0.5 rounded border border-[#FFAB91]/40 shadow-2xs leading-none whitespace-nowrap shrink-0">
                      <Check className="w-3 h-3 text-[#C2410C]" />
                      <span>钦定入席</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#9A9385] font-oriental-serif whitespace-nowrap">轻触展开</span>
                  )}
                </div>

                {/* Big Time Display */}
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="font-mono text-base font-bold tracking-tight">
                    {timeRange}
                  </span>
                  {isCharcoalPrep && (
                    <span className="text-[9px] font-oriental-serif px-2 py-0.5 rounded bg-[#E64A19]/20 text-[#FFD6C9] border border-[#FFAB91]/30 leading-none whitespace-nowrap shrink-0">
                      +30分慢火候汤
                    </span>
                  )}
                </div>

                {/* Poetic & Tea Notes */}
                <div className="mt-2 space-y-1 relative z-10">
                  <div
                    className={`text-[11px] font-oriental-serif truncate ${
                      isSelected ? 'text-[#E8DCBF]' : 'text-[#5C5345]'
                    }`}
                  >
                    {poetic}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isSelected ? 'text-white/60' : 'text-[#8C8476]'
                    }`}
                  >
                    {tierCustomBadge || opt.teaSuggestion}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
