import React, { useState } from 'react';
import { Sparkles, Check, Lock, ChevronRight, Award, Compass, Scroll, Info } from 'lucide-react';
import {
  calculateCultivationProgress,
  StageBadgeStatus,
} from '../utils/cultivationLogic';
import { BadgeDetailModal } from './BadgeDetailModal';
import { zenAudio } from '../utils/audioZen';

interface CultivationProgressSectionProps {
  leafPoints: number;
  salonBookingsCount: number;
  onOpenSalonReservation?: () => void;
}

export const CultivationProgressSection: React.FC<CultivationProgressSectionProps> = ({
  leafPoints,
  salonBookingsCount,
  onOpenSalonReservation,
}) => {
  const progress = calculateCultivationProgress(leafPoints, salonBookingsCount);
  const [selectedBadge, setSelectedBadge] = useState<StageBadgeStatus | null>(null);

  const handleOpenBadge = (badge: StageBadgeStatus) => {
    zenAudio.playZenChime();
    setSelectedBadge(badge);
  };

  return (
    <section aria-label="茶道修行进度" className="space-y-4">
      {/* Editorial Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#8F733E] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#BFA15F]" />
            <span>TEA CULTIVATION · 五重境界</span>
          </div>
          <h2 className="font-oriental-serif text-base font-bold text-[#1E2320] tracking-wide mt-0.5">
            茶道修行进度 · 境界与徽章
          </h2>
        </div>
        <span className="text-[10px] font-oriental-serif text-[#7A7366] bg-[#F2EDE2] px-2.5 py-0.5 rounded-full border border-[#DFD7C7]">
          当前境界：{progress.currentStage.name}
        </span>
      </div>

      {/* Hero Stage Parchment Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FAF7F0] via-[#F5EFE3] to-[#ECE4D4] border border-[#D9CDB8] shadow-sm space-y-4 relative overflow-hidden">
        {/* Subtle background seal */}
        <div className="absolute -right-4 -bottom-6 opacity-10 pointer-events-none select-none">
          <span className="font-oriental-serif text-[130px] font-bold text-[#232B26]">
            {progress.currentStage.sealChar}
          </span>
        </div>

        {/* Current Stage Overview */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            {/* Vermilion Stamp Crest */}
            <div className="w-14 h-14 rounded-2xl bg-[#FFFDF9] border-2 border-[#B23A2B] shadow-xs flex flex-col items-center justify-center relative shrink-0">
              <span className="font-oriental-serif text-2xl font-bold text-[#B23A2B] leading-none">
                {progress.currentStage.sealChar}
              </span>
              <span className="text-[8px] font-mono text-[#8F733E] uppercase mt-0.5">
                {progress.currentStage.pinyin}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#8C8476] tracking-wider uppercase">
                  STAGE 0{progress.currentStage.order}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#E5DDD0] text-[#4E473B] text-[9px] font-oriental-serif">
                  已修得
                </span>
              </div>
              <h3 className="font-oriental-serif text-lg font-bold text-[#1E2320]">
                {progress.currentStage.name} · {progress.currentStage.title.split(' · ')[0]}
              </h3>
              <p className="text-[11px] text-[#7A7263] font-oriental-serif mt-0.5 line-clamp-1">
                {progress.currentStage.poeticQuote}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenBadge(progress.stageBadges[progress.currentStage.order - 1])}
            className="p-2 rounded-xl bg-white/70 hover:bg-white text-[#8F733E] border border-[#DDD3C0] transition-colors shrink-0"
            title="查看当前境界专属徽章详情"
          >
            <Award className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive 5-Stage Stepper Track */}
        <div className="space-y-2 pt-2 border-t border-[#DFD5C2]">
          <div className="flex items-center justify-between text-[11px] font-oriental-serif text-[#6F6759]">
            <span>修行阶梯演进</span>
            <span className="font-mono text-xs font-bold text-[#8F733E]">
              {progress.isMaxStage ? '登峰造极' : `晋阶进度 ${progress.overallProgressPercent}%`}
            </span>
          </div>

          {/* Connected Track Container */}
          <div className="relative py-2">
            {/* Background connecting bar */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-[#DDD5C3] rounded-full" />

            {/* Active connecting progress bar */}
            <div
              className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-[#8F733E] to-[#BFA15F] rounded-full transition-all duration-500"
              style={{
                width: progress.isMaxStage
                  ? 'calc(100% - 32px)'
                  : `calc(${((progress.currentStage.order - 1 + progress.overallProgressPercent / 100) / 4) * 100}% - 16px)`,
              }}
            />

            {/* 5 Milestone Nodes */}
            <div className="relative flex items-center justify-between z-10">
              {progress.stageBadges.map((badge, idx) => {
                const isCurrent = badge.isCurrent;
                const isUnlocked = badge.isUnlocked;

                return (
                  <button
                    key={badge.id}
                    onClick={() => handleOpenBadge(badge)}
                    className="flex flex-col items-center group focus:outline-none"
                    title={`点击查看【${badge.name}】境界徽章`}
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-xs shadow-xs relative ${
                        isCurrent
                          ? 'bg-[#232B26] text-[#EFECE3] ring-4 ring-[#8F733E]/30 scale-110 font-bold'
                          : isUnlocked
                          ? 'bg-[#8F733E] text-white hover:scale-105'
                          : 'bg-[#E5DFD2] text-[#8C8375] border border-[#D5CCBA] hover:bg-[#DCD5C6]'
                      }`}
                    >
                      {isCurrent ? (
                        <span className="font-oriental-serif text-[11px]">{badge.sealChar}</span>
                      ) : isUnlocked ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}

                      {/* Breathing glow indicator for current stage */}
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#B23A2B] animate-ping" />
                      )}
                    </div>

                    {/* Stage Name */}
                    <span
                      className={`text-[10px] font-oriental-serif mt-1.5 transition-colors ${
                        isCurrent
                          ? 'font-bold text-[#1E2320]'
                          : isUnlocked
                          ? 'text-[#584F41]'
                          : 'text-[#9A9182]'
                      }`}
                    >
                      {badge.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual Requirement Status Chips */}
          {!progress.isMaxStage && progress.nextStage && (
            <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
              {/* Points Progress */}
              <div className="p-2.5 bg-white/70 rounded-xl border border-[#DFD6C4] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#786F60]">
                  <span>积蓄叶值</span>
                  <span className={progress.pointsMet ? 'text-[#2F6740] font-bold' : 'text-[#8F733E]'}>
                    {progress.pointsMet ? '已达成' : `缺 ${progress.pointsRemaining.toLocaleString()} 点`}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono text-xs font-bold text-[#1E2320]">
                  <span>{progress.pointsCurrent.toLocaleString()}</span>
                  <span className="text-[10px] text-[#9A9182] font-normal">
                    / {progress.nextPointsRequired.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1 bg-[#E8E1D2] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8F733E] rounded-full"
                    style={{
                      width: `${Math.min(100, (progress.pointsCurrent / progress.nextPointsRequired) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Tea Salon Bookings Progress */}
              <div className="p-2.5 bg-white/70 rounded-xl border border-[#DFD6C4] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#786F60]">
                  <span>茶室预约</span>
                  <span className={progress.bookingsMet ? 'text-[#2F6740] font-bold' : 'text-[#8F733E]'}>
                    {progress.bookingsMet ? '已达成' : `缺 ${progress.bookingsRemaining} 席`}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono text-xs font-bold text-[#1E2320]">
                  <span>{progress.bookingsCurrent}</span>
                  <span className="text-[10px] text-[#9A9182] font-normal">
                    / {progress.nextBookingsRequired} 席
                  </span>
                </div>
                <div className="w-full h-1 bg-[#E8E1D2] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#36533F] rounded-full"
                    style={{
                      width: `${Math.min(100, (progress.bookingsCurrent / progress.nextBookingsRequired) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Summary Action Hint */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-[#696152] bg-white/50 p-2.5 rounded-xl border border-[#DFD5C2]">
            <div className="flex items-center gap-1.5 line-clamp-1">
              <Compass className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
              <span className="font-oriental-serif">{progress.summaryHint}</span>
            </div>

            {!progress.bookingsMet && onOpenSalonReservation && (
              <button
                onClick={onOpenSalonReservation}
                className="text-[10px] text-[#8F733E] font-medium hover:underline shrink-0 flex items-center"
              >
                <span>去预约</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Badges Showcase (五重专属视觉徽章谱) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#232B26] font-oriental-serif font-bold">
            <Award className="w-3.5 h-3.5 text-[#8F733E]" />
            <span>茶道境界专属视觉徽章谱</span>
          </div>
          <span className="text-[10px] text-[#8A8275] font-mono">
            已点亮 {progress.stageBadges.filter((b) => b.isUnlocked).length} / 5
          </span>
        </div>

        {/* Badges Horizontal Scroll / Grid */}
        <div className="grid grid-cols-5 gap-1.5">
          {progress.stageBadges.map((badge) => {
            const isUnlocked = badge.isUnlocked;
            const isCurrent = badge.isCurrent;

            return (
              <button
                key={badge.id}
                onClick={() => handleOpenBadge(badge)}
                className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between group relative overflow-hidden ${
                  isCurrent
                    ? 'bg-[#FAF6EE] border-[#8F733E] shadow-xs'
                    : isUnlocked
                    ? 'bg-white border-[#E6DEC $\rightarrow$ #E6DECF] hover:border-[#8F733E]'
                    : 'bg-[#F4F1EA]/70 border-[#E4DDD0] opacity-70 hover:opacity-90'
                }`}
              >
                {/* Badge Seal Stamp Frame */}
                <div
                  className={`w-10 h-10 rounded-xl border flex flex-col items-center justify-center relative shadow-2xs mb-1.5 ${
                    isUnlocked
                      ? 'border-[#B23A2B] bg-[#FFFDF9]'
                      : 'border-[#B0A798] bg-[#EBE7DF]'
                  }`}
                >
                  <span
                    className={`font-oriental-serif text-base font-bold ${
                      isUnlocked ? 'text-[#B23A2B]' : 'text-[#877E70]'
                    }`}
                  >
                    {badge.sealChar}
                  </span>
                  <span
                    className={`text-[6px] font-mono leading-none tracking-tighter ${
                      isUnlocked ? 'text-[#8F733E]' : 'text-[#9A9183]'
                    }`}
                  >
                    {badge.pinyin.split(' ')[0]}
                  </span>

                  {/* Corner Marks */}
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 border-t border-l border-[#B23A2B]/40" />
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 border-t border-r border-[#B23A2B]/40" />
                  <div className="absolute bottom-0.5 left-0.5 w-1 h-1 border-b border-l border-[#B23A2B]/40" />
                  <div className="absolute bottom-0.5 right-0.5 w-1 h-1 border-b border-r border-[#B23A2B]/40" />
                </div>

                {/* Badge Name */}
                <span
                  className={`text-[11px] font-oriental-serif font-bold tracking-tight block ${
                    isCurrent
                      ? 'text-[#1E2320]'
                      : isUnlocked
                      ? 'text-[#3E372B]'
                      : 'text-[#857D6F]'
                  }`}
                >
                  {badge.name}
                </span>

                {/* Status indicator */}
                <div className="mt-1">
                  {isUnlocked ? (
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded-full bg-[#EBF3ED] text-[#2F6740] font-medium">
                      已解锁
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono text-[#9A9183] flex items-center justify-center gap-0.5">
                      <Lock className="w-2 h-2" />
                      <span>待悟</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badge Detail Modal Dialog */}
      <BadgeDetailModal
        badge={selectedBadge}
        isOpen={selectedBadge !== null}
        onClose={() => setSelectedBadge(null)}
        leafPoints={leafPoints}
        salonBookingsCount={salonBookingsCount}
      />
    </section>
  );
};
