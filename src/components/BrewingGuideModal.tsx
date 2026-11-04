import React, { useState, useEffect } from 'react';
import { X, Flame, Scale, Coffee, Clock, Sparkles, BookOpen, Volume2, CheckCircle2, Play, Pause, RotateCcw } from 'lucide-react';
import { TeaWisdomItem } from '../data/teaWisdomData';
import { getSteepTimeForRound, formatSteepDurationCN } from '../utils/brewingLogic';
import { formatTimerSeconds } from '../utils/orderResumeLogic';
import { zenAudio } from '../utils/audioZen';

interface BrewingGuideModalProps {
  item: TeaWisdomItem | null;
  onClose: () => void;
  onExploreProducts?: () => void;
}

export const BrewingGuideModal: React.FC<BrewingGuideModalProps> = ({
  item,
  onClose,
  onExploreProducts,
}) => {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  // Live Steep Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);

  // Sync steep time when item or round changes
  useEffect(() => {
    if (item) {
      const time = getSteepTimeForRound(item, selectedRound);
      setSecondsRemaining(time);
      setIsTimerRunning(false);
      setTimerFinished(false);
    }
  }, [item, selectedRound]);

  // Timer interval countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimerFinished(true);
            zenAudio.playZenChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  if (!item) return null;

  const currentSteepTime = getSteepTimeForRound(item, selectedRound);

  const handleRoundChange = (round: number) => {
    zenAudio.playZenChime();
    setSelectedRound(round);
  };

  const handlePlaySound = () => {
    zenAudio.playZenChime();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E3DCCF] animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-[#EBE4D8] bg-[#F4EFEA]/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest font-mono text-[#8F733E] uppercase font-bold">
                {item.categoryEn}
              </span>
              <span className="text-[10px] bg-[#E8E0D1] text-[#635B4E] px-2 py-0.5 rounded-full font-mono">
                {item.badge}
              </span>
            </div>
            <h2 className="font-oriental-serif text-lg font-bold text-[#1E2320] mt-0.5">
              {item.title}
            </h2>
            <p className="text-xs text-[#7B7366] font-light mt-0.5">
              {item.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 border border-[#DCD3C4] flex items-center justify-center text-[#5E574B] hover:text-[#1E2320] transition-colors"
            aria-label="关闭冲泡指南"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Cover Hero Banner if present */}
          {item.coverImage && (
            <div className="relative h-36 rounded-2xl overflow-hidden border border-[#DFD6C7]">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-white/80 text-[10px] font-mono tracking-widest uppercase">
                  SPRING CHENG JIA YE · CHUN CHENG JIA YE
                </span>
                <p className="text-white text-xs font-oriental-serif font-light leading-relaxed drop-shadow-xs mt-0.5">
                  「{item.mindquote}」
                </p>
              </div>
            </div>
          )}

          {/* Core Brewing Parameters Matrix */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-[#E7DFD2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#B23A2B] text-xs font-medium">
                <Flame className="w-3.5 h-3.5" />
                <span className="font-oriental-serif font-bold">纯净适温</span>
              </div>
              <p className="text-xs text-[#2A312B] font-mono font-medium">
                {item.temperature}
              </p>
              <span className="text-[10px] text-[#8C8476] block">
                水沸适度，生香提韵
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E7DFD2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#8F733E] text-xs font-medium">
                <Scale className="w-3.5 h-3.5" />
                <span className="font-oriental-serif font-bold">投茶比例</span>
              </div>
              <p className="text-xs text-[#2A312B] font-mono font-medium">
                {item.waterLeafRatio}
              </p>
              <span className="text-[10px] text-[#8C8476] block">
                茶水交融，浓淡有分寸
              </span>
            </div>
          </div>

          {/* Recommended Tea Vessel */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E7DFD2] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F4EFEA] border border-[#DFD5C4] flex items-center justify-center shrink-0 text-[#8F733E]">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#8C8476] block uppercase tracking-wide">
                RECOMMENDED VESSEL · 适宜器物
              </span>
              <h4 className="font-oriental-serif text-xs font-bold text-[#1E2320]">
                {item.recommendedVessel}
              </h4>
              <p className="text-[11px] text-[#696256] mt-0.5">
                一器适一茶，泥料气孔与出水流速共同决定杯中香气滋味。
              </p>
            </div>
          </div>

          {/* Steep Time Rhythm Curve (if applicable) */}
          {item.steepTimes && item.steepTimes.length > 1 && (
            <div className="bg-[#F6F2EB] p-4 rounded-2xl border border-[#E2D8C7] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span className="font-oriental-serif text-xs font-bold text-[#1E2320]">
                    每泡出汤节奏与坐杯建议
                  </span>
                </div>
                <button
                  onClick={handlePlaySound}
                  className="flex items-center gap-1 text-[11px] text-[#8F733E] hover:underline"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>点茶磬音</span>
                </button>
              </div>

              {/* Rounds Picker */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[1, 2, 3, 4, 5, 6, 7].map((round) => {
                  const isActive = selectedRound === round;
                  return (
                    <button
                      key={round}
                      onClick={() => handleRoundChange(round)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                        isActive
                          ? 'bg-[#1E2320] text-white shadow-xs'
                          : 'bg-white text-[#5E574B] border border-[#DDD3C2] hover:bg-[#EFEAE2]'
                      }`}
                    >
                      第 {round} 泡
                    </button>
                  );
                })}
              </div>

              {/* Time display & Interactive Steep Countdown Timer */}
              <div className="bg-white p-3.5 rounded-xl border border-[#DFD7C8] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8A8274] font-mono block">
                      第 {selectedRound} 泡建议出汤时间
                    </span>
                    <span className="font-oriental-serif font-bold text-sm text-[#1E2320]">
                      {formatSteepDurationCN(currentSteepTime)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8A8274] font-mono block">
                      风味特征
                    </span>
                    <span className="text-xs text-[#8F733E] font-medium">
                      {selectedRound <= 2
                        ? '高香初展 · 蜜兰清芬'
                        : selectedRound <= 4
                        ? '醇厚饱满 · 岩骨枞味'
                        : '甘润悠长 · 喉韵绵密'}
                    </span>
                  </div>
                </div>

                {/* Gongfu Brew Countdown Panel */}
                <div className="pt-2.5 border-t border-[#EFEAE2] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-mono font-bold text-xs border transition-all ${
                        timerFinished
                          ? 'bg-[#EBF3ED] text-[#2F6740] border-[#97C5A3] scale-105'
                          : isTimerRunning
                          ? 'bg-[#232B26] text-white border-[#232B26] animate-pulse'
                          : 'bg-[#F5F1E8] text-[#343029] border-[#DDD5C5]'
                      }`}
                    >
                      {formatTimerSeconds(secondsRemaining)}
                    </div>
                    <div>
                      <span className="text-xs font-oriental-serif font-bold text-[#1E2320] block">
                        {timerFinished
                          ? '出汤时机已至 · 尽享真味'
                          : isTimerRunning
                          ? '静心注水 · 计时浸润中'
                          : '静心出汤计时器'}
                      </span>
                      <span className="text-[10px] text-[#8C8476]">
                        {timerFinished
                          ? '请及时沥尽茶汤，避免久浸苦涩'
                          : isTimerRunning
                          ? '气平意敛，观叶舒卷'
                          : `点击开始第 ${selectedRound} 泡倒计时`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {timerFinished ? (
                      selectedRound < 7 && (
                        <button
                          onClick={() => handleRoundChange(selectedRound + 1)}
                          className="px-3 py-1.5 rounded-xl bg-[#232B26] text-white text-xs font-oriental-serif hover:bg-[#181E1A] transition-colors"
                        >
                          下一泡
                        </button>
                      )
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            zenAudio.playZenChime();
                            setIsTimerRunning(!isTimerRunning);
                          }}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            isTimerRunning
                              ? 'bg-[#DCD4C4] text-[#232B26] hover:bg-[#C8BEAB]'
                              : 'bg-[#232B26] text-white hover:bg-[#181E1A]'
                          }`}
                          aria-label={isTimerRunning ? '暂停计时' : '开始计时'}
                        >
                          {isTimerRunning ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsTimerRunning(false);
                            setSecondsRemaining(currentSteepTime);
                            setTimerFinished(false);
                          }}
                          className="w-8 h-8 rounded-xl bg-[#F0EBE0] text-[#696256] hover:bg-[#E3DC CE] flex items-center justify-center transition-colors"
                          aria-label="重置计时"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step-by-Step Gongfu Infusion Path */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#8F733E]" />
                <h3 className="font-oriental-serif text-xs font-bold text-[#1E2320] tracking-wide">
                  冲泡操作法门 · 五步心传
                </h3>
              </div>
              <span className="text-[10px] text-[#8C8476] font-mono">
                共 {item.steps.length} 步
              </span>
            </div>

            <div className="space-y-2.5">
              {item.steps.map((st) => (
                <div
                  key={st.step}
                  className="bg-white p-3.5 rounded-2xl border border-[#E7DFD2] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1E2320] text-white text-[11px] font-mono flex items-center justify-center font-bold">
                        {st.step}
                      </span>
                      <h4 className="font-oriental-serif text-xs font-bold text-[#1E2320]">
                        {st.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#8F733E] bg-[#F7F2EB] px-2 py-0.5 rounded-md border border-[#E8DFCFA]">
                      {st.action}
                    </span>
                  </div>

                  <p className="text-xs text-[#524B40] leading-relaxed font-light pl-7">
                    {st.detail}
                  </p>

                  <div className="ml-7 pt-1 flex items-start gap-1 text-[11px] text-[#786D5A] bg-[#FAF7F2] p-2 rounded-lg border border-[#EDE5D8]">
                    <Sparkles className="w-3 h-3 text-[#B23A2B] shrink-0 mt-0.5" />
                    <span><strong>心法要诀：</strong>{st.proTip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Notes */}
          {item.culturalNotes && item.culturalNotes.length > 0 && (
            <div className="bg-[#F8F5EF] p-4 rounded-2xl border border-[#E5DCce] space-y-2">
              <span className="text-[10px] font-mono text-[#8C8476] uppercase tracking-wider block">
                CULTURE & TRADITION · 渊源掌故
              </span>
              <ul className="space-y-1.5">
                {item.culturalNotes.map((note, idx) => (
                  <li key={idx} className="text-xs text-[#5E5648] flex items-start gap-1.5">
                    <span className="text-[#8F733E] text-xs font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Brand Seal Signature */}
          <div className="pt-2 pb-1 text-center border-t border-[#EDE5D8] flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD3C3]">
              <span className="w-2 h-2 rounded-full bg-[#B23A2B]" />
              <span className="text-[11px] font-oriental-serif font-bold text-[#1E2320]">
                春城嘉叶 · 一叶有来处，一器有分寸
              </span>
            </div>
            <span className="text-[10px] text-[#9A9182] font-mono mt-1">
              CHUN CHENG JIA YE · ORIENTAL TEA ARCHIVE
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EAE3D6] bg-white/95 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-[#D5CBB9] text-xs font-oriental-serif text-[#5E574B] hover:bg-[#F5F0E8] transition-colors"
          >
            收纳心法
          </button>
          {onExploreProducts && (
            <button
              onClick={() => {
                onClose();
                onExploreProducts();
              }}
              className="flex-1 py-3 rounded-2xl bg-[#1E2320] text-white text-xs font-oriental-serif font-medium hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>品鉴相应器物与茶</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
