import React, { useState, useEffect } from 'react';
import {
  Flame,
  Volume2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Play,
  Pause,
  Leaf,
  Wind,
} from 'lucide-react';
import { zenAudio } from '../utils/audioZen';

export interface RitualStepItem {
  id: string;
  order: string;
  name: string;
  subTitle: string;
  poem: string;
  author: string;
  essence: string;
  actionGuide: string;
  metrics: {
    label: string;
    value: string;
  }[];
  accentColor: string;
}

export const SONG_RITUAL_STEPS: RitualStepItem[] = [
  {
    id: 'incense',
    order: '一',
    name: '焚香',
    subTitle: '净手息心 · 沉香引席',
    poem: '焚香引幽步，酌茗开净筵。',
    author: '苏轼《安详斋》',
    essence: '点燃一炷沉水香，净手拭案，屏息凝神，为茶汤破除尘杂浊气。',
    actionGuide: '席主微闭双目，引沉香一室幽芬，心境澄澈方可辨活水真味。',
    metrics: [
      { label: '香品规制', value: '海南老料沉香' },
      { label: '净手礼仪', value: '温泉拭帕三度' },
      { label: '心境调息', value: '息粗心细' },
    ],
    accentColor: '#8C7A58',
  },
  {
    id: 'boil',
    order: '二',
    name: '候汤',
    subTitle: '榄炭慢候 · 松风鱼目',
    poem: '蟹眼已过鱼眼生，飕飕欲作松风鸣。',
    author: '苏轼《试院煎茶》',
    essence: '橄榄炭文火初红，铜鍑活泉初沸为蟹眼，连珠腾波为鱼目，候汤至二沸为上。',
    actionGuide: '倾听鍑中声息由细微松风转为波涛，水嫩则茶滞，水老则气弱，唯适中得道。',
    metrics: [
      { label: '炭火类型', value: '乌榄核炭' },
      { label: '泉水火候', value: '二沸鱼目微泛' },
      { label: '水温适宜', value: '96°C 活火初候' },
    ],
    accentColor: '#C2410C',
  },
  {
    id: 'pour',
    order: '三',
    name: '注水',
    subTitle: '悬壶高冲 · 激荡灵芽',
    poem: '高提悬注飞急浪，深谷兰香落鼎中。',
    author: '蔡襄《茶录》意旨',
    essence: '提壶悬高，春水如虹直贯壶底，翻卷老树原叶，促其内质岩骨层层苏醒。',
    actionGuide: '手腕平稳高悬，令沸水激荡茶叶上下翻滚，第一泡温器醒茶，激扬兰花底香。',
    metrics: [
      { label: '注水落差', value: '悬壶 25~30cm' },
      { label: '水流节奏', value: '缓急兼备' },
      { label: '醒茶时长', value: '5~8 秒回旋' },
    ],
    accentColor: '#2B5F44',
  },
  {
    id: 'serve',
    order: '四',
    name: '出汤',
    subTitle: '压低巡杯 · 均分琼浆',
    poem: '关公巡城分甘露，韩信点兵滴玉珠。',
    author: '潮汕工夫茶典',
    essence: '壶嘴压低贴近公道杯，循环低斟以保香聚气，末段数滴点尽，茶汤浓淡色泽浑然如一。',
    actionGuide: '轻摇壶身，低斟如丝，韩信点兵收尽茶胆，汤色澄黄透亮如金珀。',
    metrics: [
      { label: '出汤角度', value: '压低贴盅' },
      { label: '出汤时间', value: '12~18 秒尽出' },
      { label: '汤色品相', value: '金琥珀明澈' },
    ],
    accentColor: '#92400E',
  },
  {
    id: 'taste',
    order: '五',
    name: '审评',
    subTitle: '掀盖嗅香 · 细啜喉韵',
    poem: '两腋清风生座右，齿颊留芳意未穷。',
    author: '卢仝《七碗茶歌》',
    essence: '微启杯盖嗅其兰花热香，继而观汤色、啜汤水、审冷香、探回甘喉韵。',
    actionGuide: '三口细啜，舌底鸣泉，体会凤凰山场与武夷岩壁赋予老树的甘冽长韵。',
    metrics: [
      { label: '审评维度', value: '香·水·韵·滑' },
      { label: '喉吻润度', value: '清甜回甘持久' },
      { label: '冷香附着', value: '杯底幽兰不散' },
    ],
    accentColor: '#1E293B',
  },
];

interface SongRitualStepsGuideProps {
  isCharcoalPrepEnabled?: boolean;
  onTriggerWaterSound?: () => void;
  className?: string;
}

export const SongRitualStepsGuide: React.FC<SongRitualStepsGuideProps> = ({
  isCharcoalPrepEnabled = true,
  onTriggerWaterSound,
  className = '',
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1); // 默认聚焦在“二·候汤”
  const [isPlayingAutoDemo, setIsPlayingAutoDemo] = useState<boolean>(false);

  const currentStep = SONG_RITUAL_STEPS[activeStepIndex];

  // 自动循环茶仪播放演示
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAutoDemo) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % SONG_RITUAL_STEPS.length);
      }, 4200);
    }
    return () => clearInterval(timer);
  }, [isPlayingAutoDemo]);

  const handleStepClick = (idx: number) => {
    zenAudio.playZenChime();
    setActiveStepIndex(idx);
    setIsPlayingAutoDemo(false);
    if (idx === 1 && onTriggerWaterSound) {
      onTriggerWaterSound();
    }
  };

  const handleNext = () => {
    zenAudio.playZenChime();
    setActiveStepIndex((prev) => (prev + 1) % SONG_RITUAL_STEPS.length);
    setIsPlayingAutoDemo(false);
  };

  const handlePrev = () => {
    zenAudio.playZenChime();
    setActiveStepIndex((prev) => (prev - 1 + SONG_RITUAL_STEPS.length) % SONG_RITUAL_STEPS.length);
    setIsPlayingAutoDemo(false);
  };

  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#FAF7F0] via-[#F6F2E7] to-[#EEE8D9] border border-[#E0D5BE] shadow-sm space-y-4 select-none relative overflow-hidden ${className}`}
    >
      {/* Background Watermark Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.7) 0%, transparent 70%), repeating-linear-gradient(45deg, rgba(30,35,30,0.02) 0px, rgba(30,35,30,0.02) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold">
            <Sparkles className="w-3 h-3 text-[#8F733E]" />
            <span>SONG DYNASTY TEA RITUAL · 宋式雅席五序</span>
          </div>
          <h3 className="font-oriental-serif text-sm sm:text-base font-bold text-[#232B26] flex items-center gap-2 flex-wrap">
            <span>茶仪五序 · 慢火候汤微观交互</span>
            {isCharcoalPrepEnabled && (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#EA580C]/15 border border-[#EA580C]/20 text-[#C2410C] leading-none whitespace-nowrap shrink-0">
                炭火备水已联通
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsPlayingAutoDemo(!isPlayingAutoDemo)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-oriental-serif flex items-center gap-1 transition-all border whitespace-nowrap ${
              isPlayingAutoDemo
                ? 'bg-[#232B26] text-white border-[#232B26] shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#6A6253] border-[#232B26]/[0.08]'
            }`}
          >
            {isPlayingAutoDemo ? (
              <>
                <Pause className="w-3 h-3 shrink-0" />
                <span>暂停演示</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 shrink-0" />
                <span>自动巡礼</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5-Step Horizontal Tab Strip (焚香、候汤、注水、出汤、审评) */}
      <div className="relative z-10 grid grid-cols-5 gap-1.5 sm:gap-2">
        {SONG_RITUAL_STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleStepClick(idx)}
              className={`p-2.5 sm:p-3 rounded-2xl transition-all text-center flex flex-col items-center justify-between border relative group ${
                isActive
                  ? 'bg-[#242C27] text-[#FAF6F0] border-[#232B26]/20 shadow-md scale-[1.02]'
                  : 'bg-white/70 hover:bg-white text-[#6B6355] border-[#232B26]/[0.06]'
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[9px] font-mono block whitespace-nowrap ${
                    isActive ? 'text-[#D8C496]' : 'text-[#968E7E]'
                  }`}
                >
                  第{step.order}序
                </span>
              </div>
              <span
                className={`font-oriental-serif text-xs sm:text-sm font-bold block mt-1 whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-[#232B26]'
                }`}
              >
                {step.name}
              </span>
              <span
                className={`text-[9px] truncate max-w-full block mt-0.5 font-light ${
                  isActive ? 'text-[#C7BCAB]' : 'text-[#8E8677]'
                }`}
              >
                {step.subTitle.split('·')[0].trim()}
              </span>

              {/* Active Golden Dot */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#D8C496] mt-1 shadow-xs shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Step Deep Micro-Interaction Stage Card */}
      <div className="relative z-10 p-4 sm:p-5 bg-white/95 rounded-2xl border border-[#232B26]/[0.06] shadow-xs space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-oriental-serif text-xs px-2.5 py-1 rounded-md bg-[#FAF4E8] text-[#8F733E] border border-[#8F733E]/20 font-bold leading-none whitespace-nowrap shrink-0">
                第{currentStep.order}序 · {currentStep.name}
              </span>
              <span className="text-xs font-oriental-serif font-bold text-[#1F2522]">
                {currentStep.subTitle}
              </span>
            </div>
            <p className="text-xs text-[#524B3F] font-light leading-relaxed cjk-body">
              {currentStep.essence}
            </p>
          </div>

          {/* Micro Animation Artwork Box */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#FAF7F0] to-[#EFE8D8] border border-[#8F733E]/15 flex items-center justify-center shrink-0 p-2 shadow-inner relative overflow-hidden">
            {/* Step-specific SVG Micro-Animation */}
            {currentStep.id === 'incense' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Incense Burner Tripod */}
                <path d="M 30 75 Q 50 82 70 75 L 68 85 L 32 85 Z" fill="#4B3F2F" />
                <rect x="49" y="45" width="2" height="30" fill="#8C7A58" />
                <circle cx="50" cy="44" r="1.5" fill="#EF4444" className="animate-pulse" />
                {/* Wisp of Smoke */}
                <path
                  d="M 50 42 C 45 32 55 24 48 14 C 44 8 52 4 50 0"
                  fill="none"
                  stroke="#9C8E79"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeOpacity="0.75"
                  className="animate-pulse"
                />
              </svg>
            )}

            {currentStep.id === 'boil' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Charcoal Embers Glow */}
                <ellipse cx="50" cy="78" rx="26" ry="7" fill="#C2410C" opacity="0.6" className="animate-pulse" />
                {/* Tea Kettle / Cauldron */}
                <path d="M 28 68 Q 50 78 72 68 L 68 45 Q 50 40 32 45 Z" fill="#292524" />
                <path d="M 32 45 Q 50 40 68 45" stroke="#78716C" strokeWidth="2" fill="none" />
                {/* Rising Crab-eye & Fish-eye Bubbles */}
                <circle cx="44" cy="55" r="2" fill="#E0F2FE" opacity="0.8" className="animate-bounce" />
                <circle cx="52" cy="50" r="3" fill="#E0F2FE" opacity="0.9" className="animate-ping" />
                <circle cx="58" cy="54" r="1.8" fill="#E0F2FE" opacity="0.7" />
              </svg>
            )}

            {currentStep.id === 'pour' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* High suspended stream pouring */}
                <path
                  d="M 50 8 L 50 62"
                  stroke="#38BDF8"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                {/* Tea Pot Bowl */}
                <path d="M 30 72 Q 50 85 70 72 L 66 60 Q 50 56 34 60 Z" fill="#573826" />
                {/* Splashing Ripple & Awakening Leaves */}
                <ellipse cx="50" cy="64" rx="14" ry="4" stroke="#7DD3FC" strokeWidth="1" fill="none" />
                <circle cx="46" cy="62" r="1.5" fill="#22C55E" />
                <circle cx="54" cy="63" r="1.8" fill="#22C55E" />
              </svg>
            )}

            {currentStep.id === 'serve' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Spout tilting close to cup */}
                <path d="M 30 38 L 46 54 L 38 62 Z" fill="#451A03" />
                {/* Golden stream into cup */}
                <path d="M 46 54 L 56 70" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
                {/* Fair cup */}
                <path d="M 50 78 Q 62 82 74 78 L 72 68 Q 62 65 52 68 Z" fill="#E6D3B3" stroke="#B45309" strokeWidth="1" />
                <ellipse cx="62" cy="71" rx="8" ry="3" fill="#FBBF24" opacity="0.9" />
              </svg>
            )}

            {currentStep.id === 'taste' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Gaiwan Cup & Lifted Lid */}
                <path d="M 34 76 Q 50 84 66 76 L 64 64 Q 50 60 36 64 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="1" />
                {/* Golden Tea Soup inside */}
                <ellipse cx="50" cy="66" rx="11" ry="3.5" fill="#F59E0B" opacity="0.85" />
                {/* Lifted Lid Tilted */}
                <path d="M 36 50 Q 52 42 66 54" stroke="#64748B" strokeWidth="2.5" fill="none" />
                <circle cx="51" cy="44" r="2.5" fill="#64748B" />
                {/* Escaping Floral Aroma Steam */}
                <path d="M 46 40 Q 42 30 48 20" stroke="#FBBF24" strokeWidth="1.4" fill="none" strokeDasharray="2,2" />
                <path d="M 54 38 Q 60 28 52 18" stroke="#FBBF24" strokeWidth="1.4" fill="none" strokeDasharray="2,2" />
              </svg>
            )}
          </div>
        </div>

        {/* Action Detail & Classical Poetry Quote */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE4D4] flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 min-w-0">
            <span className="font-oriental-serif text-[11px] font-bold text-[#8F733E] block">
              典籍古注 · {currentStep.author}
            </span>
            <p className="font-oriental-serif italic text-xs text-[#4A4234] truncate">
              「{currentStep.poem}」
            </p>
            <p className="text-[11px] text-[#786E5D] font-light">
              {currentStep.actionGuide}
            </p>
          </div>
        </div>

        {/* Classical Ritual Metrics Chips */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F2ECE1]">
          {currentStep.metrics.map((m, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-[#FAF9F5] border border-[#ECE5D8] text-center">
              <span className="text-[9px] text-[#8C8476] font-oriental-serif block">
                {m.label}
              </span>
              <span className="font-oriental-serif font-bold text-xs text-[#202723] block mt-0.5 truncate">
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handlePrev}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD4C2] hover:border-[#232B26] text-xs font-oriental-serif text-[#5E574A] flex items-center gap-1 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>前序茶仪</span>
          </button>

          <span className="text-[10px] font-mono text-[#8C8476]">
            {activeStepIndex + 1} / {SONG_RITUAL_STEPS.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded-xl bg-[#232B26] hover:bg-[#343F37] text-white text-xs font-oriental-serif flex items-center gap-1 transition-all shadow-xs"
          >
            <span>下序：{SONG_RITUAL_STEPS[(activeStepIndex + 1) % SONG_RITUAL_STEPS.length].name}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
