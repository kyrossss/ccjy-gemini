import React, { useState, useEffect } from 'react';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Sparkles,
  Thermometer,
  Waves,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import {
  TOTAL_CHARCOAL_BREW_SECONDS,
  CHARCOAL_BREW_STAGES,
  getCharcoalBrewStage,
  formatBrewTime,
  calculateBrewProgressRatio,
} from '../utils/charcoalBrewLogic';
import { zenAudio } from '../utils/audioZen';

interface CharcoalBrewProgressProps {
  isCharcoalPrepEnabled: boolean;
  onToggleCharcoalPrep: (enabled: boolean) => void;
  className?: string;
}

export const CharcoalBrewProgress: React.FC<CharcoalBrewProgressProps> = ({
  isCharcoalPrepEnabled,
  onToggleCharcoalPrep,
  className = '',
}) => {
  // Elapsed seconds in the 30-min preparation (starts with ~5-min prep for instant visual life)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(isCharcoalPrepEnabled);
  const [isFastForward, setIsFastForward] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [isSimmerSoundActive, setIsSimmerSoundActive] = useState<boolean>(false);

  // Sync isRunning with charcoal mode toggle
  useEffect(() => {
    if (!isCharcoalPrepEnabled) {
      setIsRunning(false);
      setIsFastForward(false);
      if (isSimmerSoundActive) {
        zenAudio.stopContinuousSimmer(1.5);
        setIsSimmerSoundActive(false);
      }
    } else {
      setIsRunning(true);
    }
  }, [isCharcoalPrepEnabled]);

  // Interval timer for countdown with auto-fadeout when reaching target
  useEffect(() => {
    if (!isRunning) return;

    const intervalRate = isFastForward ? 80 : 1000;
    const increment = isFastForward ? 12 : 1;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + increment;
        if (next >= TOTAL_CHARCOAL_BREW_SECONDS) {
          setIsRunning(false);
          setIsFastForward(false);
          setHasCompleted(true);
          // 烹泉达到预定时间点（30分钟火候合度），候汤之声自动平滑淡出 (Fade out)
          zenAudio.stopContinuousSimmer(2.5, () => {
            zenAudio.playZenChime();
          });
          setIsSimmerSoundActive(false);
          return TOTAL_CHARCOAL_BREW_SECONDS;
        }
        return next;
      });
    }, intervalRate);

    return () => clearInterval(timer);
  }, [isRunning, isFastForward]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      zenAudio.stopContinuousSimmer(1.0);
    };
  }, []);

  const progressRatio = calculateBrewProgressRatio(elapsedSeconds);
  const remainingSeconds = Math.max(0, TOTAL_CHARCOAL_BREW_SECONDS - elapsedSeconds);
  const currentStage = getCharcoalBrewStage(elapsedSeconds);

  // SVG circular geometry - scaled for mobile & desktop harmony
  const size = 104;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const toggleSimmerAudio = () => {
    if (isSimmerSoundActive) {
      zenAudio.stopContinuousSimmer(1.5);
      setIsSimmerSoundActive(false);
    } else {
      zenAudio.playZenChime();
      const started = zenAudio.startContinuousSimmer({ volume: 0.12 });
      if (started) {
        setIsSimmerSoundActive(true);
      }
    }
  };

  const handleTogglePlay = () => {
    zenAudio.playZenChime();
    if (!isRunning) {
      if (isCharcoalPrepEnabled) {
        zenAudio.startContinuousSimmer({ volume: 0.12 });
        setIsSimmerSoundActive(true);
      }
    } else {
      if (isSimmerSoundActive) {
        zenAudio.stopContinuousSimmer(1.2);
        setIsSimmerSoundActive(false);
      }
    }

    if (!isCharcoalPrepEnabled) {
      onToggleCharcoalPrep(true);
      setIsRunning(true);
      zenAudio.startContinuousSimmer({ volume: 0.12 });
      setIsSimmerSoundActive(true);
      return;
    }
    if (hasCompleted) {
      setElapsedSeconds(0);
      setHasCompleted(false);
      setIsRunning(true);
      zenAudio.startContinuousSimmer({ volume: 0.12 });
      setIsSimmerSoundActive(true);
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleToggleFastForward = () => {
    zenAudio.playZenChime();
    if (!isCharcoalPrepEnabled) {
      onToggleCharcoalPrep(true);
    }
    if (hasCompleted) {
      setElapsedSeconds(0);
      setHasCompleted(false);
    }
    setIsRunning(true);
    setIsFastForward(!isFastForward);
    if (!isSimmerSoundActive) {
      zenAudio.startContinuousSimmer({ volume: 0.12 });
      setIsSimmerSoundActive(true);
    }
  };

  const handleReset = () => {
    zenAudio.playZenChime();
    if (isSimmerSoundActive) {
      zenAudio.stopContinuousSimmer(1.2);
      setIsSimmerSoundActive(false);
    }
    setElapsedSeconds(0);
    setHasCompleted(false);
    setIsRunning(false);
    setIsFastForward(false);
  };

  return (
    <div
      className={`bg-white rounded-3xl p-4 sm:p-5 border border-[#ECE5D8] shadow-xs transition-all relative overflow-hidden ${className}`}
    >
      {/* Background warm ambient glow if running */}
      {isCharcoalPrepEnabled && isRunning && (
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-radial from-[#FF7043]/10 to-transparent blur-2xl pointer-events-none" />
      )}

      {/* Top Header Row with airy breathing room */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2ECE1] relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FAF3E3] border border-[#E8D8B6] flex items-center justify-center text-[#8F733E]">
            <Flame className="w-3.5 h-3.5 text-[#B23A2B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <h2 className="font-oriental-serif text-xs font-bold text-[#232B26] tracking-wide">
              烹泉进度 · 生火候汤
            </h2>
            <span className="text-[10px] font-mono text-[#8F733E]">
              30m
            </span>
          </div>
        </div>

        {/* Charcoal Mode Switch */}
        <button
          type="button"
          onClick={() => {
            zenAudio.playZenChime();
            onToggleCharcoalPrep(!isCharcoalPrepEnabled);
          }}
          className={`text-[10px] font-oriental-serif px-2.5 py-1 rounded-full border transition-all active:scale-95 flex items-center gap-1.5 ${
            isCharcoalPrepEnabled
              ? 'bg-[#FBEBE7] text-[#BF360C] border-[#FFAB91] font-bold shadow-2xs'
              : 'bg-[#FAF8F5] text-[#868074] border-[#E2D8C7] hover:border-[#8F733E]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCharcoalPrepEnabled ? 'bg-[#E64A19] animate-ping' : 'bg-[#C2B8A6]'
            }`}
          />
          <span>{isCharcoalPrepEnabled ? '炭火备水中' : '开启炭火备水'}</span>
        </button>
      </div>

      {/* Main Content: Ring + Stage Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
        {/* Left / Center: Circular Progress Ring & Play Controls */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative flex items-center justify-center">
            <svg
              width={size}
              height={size}
              className="transform -rotate-90 drop-shadow-2xs"
            >
              <defs>
                <linearGradient id="charcoalBrewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D84315" />
                  <stop offset="60%" stopColor="#FFA726" />
                  <stop offset="100%" stopColor="#8F733E" />
                </linearGradient>
              </defs>

              {/* Background Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#F1ECE2"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Animated Progress Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#charcoalBrewGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                  transition: isFastForward
                    ? 'stroke-dashoffset 0.1s linear'
                    : 'stroke-dashoffset 0.4s ease',
                }}
              />
            </svg>

            {/* Inner Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="font-mono text-base font-bold text-[#1E2320] tracking-tight leading-none">
                {formatBrewTime(remainingSeconds)}
              </span>
              <span className="text-[10px] font-oriental-serif text-[#8F733E] mt-1 font-semibold">
                {hasCompleted ? '候汤吉时' : currentStage.name}
              </span>
              <span className="text-[9px] font-mono text-[#9C9484] mt-0.5">
                {hasCompleted ? '100%' : `${Math.round(progressRatio * 100)}%`}
              </span>
            </div>
          </div>

          {/* Interactive Button Group with generous touch targets */}
          <div className="flex items-center gap-2 mt-2.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="h-8 px-3 rounded-xl bg-[#232B26] hover:bg-black text-[#FAF8F5] text-xs font-oriental-serif flex items-center gap-1.5 transition-transform active:scale-95 shadow-2xs"
              title={isRunning ? '暂停倒计时' : '继续倒计时'}
              aria-label={isRunning ? '暂停' : '开始'}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isRunning ? '暂停' : '候汤'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleFastForward}
              className={`h-8 px-2.5 rounded-xl border text-xs font-oriental-serif flex items-center gap-1 transition-all active:scale-95 ${
                isFastForward
                  ? 'bg-[#E64A19] text-white border-[#E64A19]'
                  : 'bg-white text-[#5D5548] border-[#DFD5C2] hover:bg-[#F8F4EC]'
              }`}
              title="加速体验30分钟生火候汤四重意境"
              aria-label="加速体验"
            >
              <FastForward className="w-3 h-3" />
              <span className="text-[10px]">体验</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="h-8 w-8 rounded-xl bg-white hover:bg-[#F8F4EC] text-[#7A7263] border border-[#DFD5C2] flex items-center justify-center transition-transform active:scale-95"
              title="重置进度"
              aria-label="重置"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={toggleSimmerAudio}
              className={`h-8 px-2.5 rounded-xl border flex items-center gap-1 transition-all active:scale-95 text-xs font-oriental-serif ${
                isSimmerSoundActive
                  ? 'bg-[#C2410C] text-white border-[#EA580C] shadow-2xs'
                  : 'bg-white hover:bg-[#FAF2EB] text-[#C2410C] border-[#FFCCBC]'
              }`}
              title={
                isSimmerSoundActive
                  ? '候汤之声播放中（达到预定时间点将自动淡出），轻触静音'
                  : '聆听候汤之声 (松风蟹眼沸水细音)'
              }
              aria-label="切换候汤之声"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSimmerSoundActive ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] hidden sm:inline">
                {isSimmerSoundActive ? '候汤中' : '候汤之声'}
              </span>
            </button>
          </div>
        </div>

        {/* Right / Body: 4-Stage Connected Minimal Stepper & Status Card */}
        <div className="w-full flex-1 space-y-2.5 min-w-0">
          {/* Minimal 4-Node Stepper Bar */}
          <div className="grid grid-cols-4 gap-1.5">
            {CHARCOAL_BREW_STAGES.map((stg) => {
              const isPast = elapsedSeconds >= stg.endSecond;
              const isCurrent = currentStage.index === stg.index && !hasCompleted;

              return (
                <button
                  key={stg.index}
                  type="button"
                  onClick={() => {
                    zenAudio.playZenChime();
                    setElapsedSeconds(stg.startSecond);
                    setHasCompleted(false);
                    setIsRunning(true);
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl text-center border transition-all ${
                    isCurrent
                      ? 'bg-[#232B26] text-white border-[#232B26] shadow-2xs'
                      : isPast
                      ? 'bg-[#F4F1EA] text-[#554D3F] border-[#DFD8C7]'
                      : 'bg-[#FAF8F5] text-[#8C8474] border-[#ECE6DB] hover:border-[#8F733E]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-[9px] mb-0.5">
                    <span className="font-mono">0{stg.index + 1}</span>
                    {isPast ? (
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#2F6740]" />
                    ) : isCurrent ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7043] animate-ping" />
                    ) : null}
                  </div>
                  <span className="font-oriental-serif text-[11px] font-bold block truncate">
                    {stg.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Stage Card: Airy, Clean, Single Row */}
          <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8DFC9] flex items-center justify-between gap-2.5">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#8F733E] font-medium">
                  {currentStage.startSecond / 60}-{currentStage.endSecond / 60}m
                </span>
                <span className="font-oriental-serif text-xs font-bold text-[#1E2320] truncate">
                  {currentStage.poeticTitle}
                </span>
              </div>
              <p className="text-[11px] text-[#635A4B] font-light truncate">
                {currentStage.waterSign}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <div className="inline-flex items-center gap-1 text-[10px] font-mono text-[#BF360C] bg-[#FBEBE7] px-2.5 py-0.5 rounded-full border border-[#BF360C]/20 leading-none whitespace-nowrap">
                <Thermometer className="w-3 h-3 shrink-0" />
                <span>{currentStage.tempRange}</span>
              </div>
            </div>
          </div>

          {/* Completed State Banner */}
          {hasCompleted && (
            <div className="bg-[#EBF3ED] text-[#2F6740] p-2.5 px-3.5 rounded-xl border border-[#2F6740]/20 text-[11px] font-oriental-serif flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                <span className="truncate">✦ 活火烹泉功成 · 水沸合度，请雅宾入席品茗</span>
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="underline text-[10px] shrink-0 hover:opacity-80 ml-2 whitespace-nowrap"
              >
                重置
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
