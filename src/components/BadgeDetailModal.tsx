import React from 'react';
import { X, Check, Lock, Sparkles, Shield, Award, Compass, Scroll } from 'lucide-react';
import { StageBadgeStatus } from '../utils/cultivationLogic';

interface BadgeDetailModalProps {
  badge: StageBadgeStatus | null;
  isOpen: boolean;
  onClose: () => void;
  leafPoints: number;
  salonBookingsCount: number;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  isOpen,
  onClose,
  leafPoints,
  salonBookingsCount,
}) => {
  if (!isOpen || !badge) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#D9CEBA] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#ECE5D8] bg-[#F4EFE6]/80">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: badge.isUnlocked ? '#B23A2B' : '#8A8275' }}
            />
            <span className="font-oriental-serif text-xs font-bold text-[#1E2320] tracking-widest">
              茶道境界 · 视觉徽章鉴赏
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#DCD3C4] flex items-center justify-center text-[#5E574B] hover:text-[#1E2320] transition-colors"
            aria-label="关闭徽章详情"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto max-h-[80vh] space-y-4">
          {/* Main Visual Badge Card (Certificate Scroll Style) */}
          <div className="relative rounded-2xl p-6 border-2 border-[#D8C7A5] bg-gradient-to-b from-[#FFFDF9] to-[#F8F4EC] shadow-sm text-center space-y-3.5 overflow-hidden">
            {/* Subtle watermarked background seal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="font-oriental-serif text-[180px] font-bold text-[#232B26]">
                {badge.sealChar}
              </span>
            </div>

            {/* Lock / Unlocked Status Chip */}
            <div className="flex justify-center">
              {badge.isUnlocked ? (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBF3ED] text-[#2F6740] border border-[#CDE3D3] text-xs font-oriental-serif font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>已悟此境 · 徽章已解锁</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F2EDE1] text-[#786F60] border border-[#DED4C1] text-xs font-oriental-serif">
                  <Lock className="w-3.5 h-3.5" />
                  <span>待修持参悟 · 徽章暂锁</span>
                </div>
              )}
            </div>

            {/* Visual Seal Stamp Crest */}
            <div className="relative inline-block my-1">
              {/* Outer Calligraphy Seal Frame */}
              <div
                className={`w-24 h-24 rounded-2xl mx-auto border-2 flex flex-col items-center justify-center relative shadow-md transition-transform duration-300 ${
                  badge.isUnlocked
                    ? 'border-[#B23A2B] bg-[#FAF6F0]'
                    : 'border-[#A39A8B] bg-[#EFECE5] opacity-75'
                }`}
              >
                {/* Traditional Vermilion Seal Stamp */}
                <span
                  className={`font-oriental-serif text-4xl font-bold tracking-tight ${
                    badge.isUnlocked ? 'text-[#B23A2B]' : 'text-[#847B6D]'
                  }`}
                >
                  {badge.sealChar}
                </span>

                <span
                  className={`text-[9px] font-mono tracking-widest mt-0.5 uppercase ${
                    badge.isUnlocked ? 'text-[#8F733E]' : 'text-[#9A9183]'
                  }`}
                >
                  {badge.pinyin}
                </span>

                {/* Corner decorative accents */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#B23A2B]/40" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#B23A2B]/40" />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#B23A2B]/40" />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#B23A2B]/40" />
              </div>
            </div>

            {/* Badge Name & Subtitle */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-[10px] text-[#8C8476] tracking-widest uppercase">
                  STAGE 0{badge.order} · {badge.enTitle}
                </span>
              </div>
              <h3 className="font-oriental-serif text-2xl font-bold text-[#1E2320] tracking-wider">
                {badge.name} · {badge.title.split(' · ')[0]}
              </h3>
              <p className="text-xs text-[#8F733E] font-oriental-serif">
                {badge.title.split(' · ')[1] || badge.title}
              </p>
            </div>

            {/* Poetic Inscription */}
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#ECE2D2] text-xs font-oriental-serif text-[#4B4438] italic leading-relaxed">
              「{badge.poeticQuote}」
            </div>

            {/* Stage Craft Lore */}
            <p className="text-xs text-[#6F6759] font-light leading-relaxed text-left px-1">
              {badge.lore}
            </p>
          </div>

          {/* Unlock Requirement & User Progress Status */}
          <div className="bg-white rounded-2xl p-4 border border-[#ECE5D8] space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-[#232B26] font-oriental-serif font-bold">
              <Compass className="w-3.5 h-3.5 text-[#8F733E]" />
              <span>晋阶参悟条件</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5D8] space-y-1">
                <div className="flex items-center justify-between text-[#8A8375]">
                  <span>积蓄叶值</span>
                  <span className={leafPoints >= badge.minPoints ? 'text-[#2F6740] font-bold' : 'text-[#8A8375]'}>
                    {leafPoints >= badge.minPoints ? '✓ 已达标' : '未达标'}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-[#232B26]">
                  {leafPoints.toLocaleString()} / {badge.minPoints.toLocaleString()} 点
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5D8] space-y-1">
                <div className="flex items-center justify-between text-[#8A8375]">
                  <span>茶室预约</span>
                  <span className={salonBookingsCount >= badge.minBookings ? 'text-[#2F6740] font-bold' : 'text-[#8A8375]'}>
                    {salonBookingsCount >= badge.minBookings ? '✓ 已达标' : '未达标'}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-[#232B26]">
                  {salonBookingsCount} / {badge.minBookings} 席
                </div>
              </div>
            </div>
          </div>

          {/* Exclusive Unlocked Privileges */}
          <div className="bg-white rounded-2xl p-4 border border-[#ECE5D8] space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-[#232B26] font-oriental-serif font-bold">
              <Award className="w-3.5 h-3.5 text-[#8F733E]" />
              <span>本境专属茶事礼遇</span>
            </div>

            <ul className="space-y-1.5">
              {badge.perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-[#635C4F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E] mt-1.5 shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#ECE5D8] bg-[#FAF8F5] text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#232B26] hover:bg-black text-[#FAF8F5] text-xs font-oriental-serif font-medium tracking-widest transition-colors"
          >
            知晓心法 · 返回名鉴
          </button>
        </div>
      </div>
    </div>
  );
};
