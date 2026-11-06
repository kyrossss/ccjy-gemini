import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Gift,
  Flame,
  Shield,
  Coins,
  ArrowRight,
  Award,
  ChevronRight,
  Package,
  Calendar,
  Sparkles,
  Warehouse,
  AlertTriangle,
  ScrollText,
  ChevronDown,
  Crown,
  History,
  Play,
  Pause,
} from 'lucide-react';
import { MemberTierLevel, TIER_CONFIGS, resolveEffectiveMembership } from '../../utils/teaLogic';
import { CultivationProgressSection } from '../CultivationProgressSection';
import { UpcomingSeatCountdownCard } from '../UpcomingSeatCountdownCard';
import { BookingInvitationData } from '../TeaInvitationModal';
import { CourtesyMoodMemo } from '../../utils/courtesyNotificationLogic';
import { JiayeCoinIcon, JiayeCoinBadge } from '../JiayeCoinIcon';
import { TeaProfileRadar } from '../TeaProfileRadar';
import { PALATE_EVOLUTION_TIMELINE, PalateEvolutionMilestone } from '../../utils/teaProfileLogic';

interface MemberViewProps {
  userTier: MemberTierLevel;
  setUserTier: (tier: MemberTierLevel) => void;
  leafPoints: number;
  chaTokens: number;
  onOpenPointsRedeem: () => void;
  onOpenDailyRitual: () => void;
  onOpenConsignmentSubmit: () => void;
  recentOrdersCount: number;
  activeBookingsCount: number;
  activeBookings?: BookingInvitationData[];
  onOpenSalonReservation?: () => void;
  onOpenResume?: (tab: 'orders' | 'bookings' | 'consignments') => void;
  onOpenTeaProfile?: () => void;
  onOpenInvitation?: (booking: BookingInvitationData) => void;
  onOpenPosterModal?: (booking: BookingInvitationData) => void;
  onOpenMoodMemo?: (booking: BookingInvitationData) => void;
  onTriggerCourtesyPush?: (booking: BookingInvitationData) => void;
  savedMemo?: CourtesyMoodMemo | null;
  userConsignmentsCount?: number;
  onResetDemoState?: () => void;
  onOpenInventoryBackend?: () => void;
  lowStockAlertCount?: number;
  liveCharacterTitle?: string;
  liveRadarScores?: {
    roast: number;
    aroma: number;
    sweetness: number;
    mouthfeel: number;
    throatCharm: number;
  };
}

export const MemberView: React.FC<MemberViewProps> = ({
  userTier,
  setUserTier,
  leafPoints,
  chaTokens,
  onOpenPointsRedeem,
  onOpenDailyRitual,
  onOpenConsignmentSubmit,
  recentOrdersCount,
  activeBookingsCount,
  activeBookings = [],
  onOpenSalonReservation,
  onOpenResume,
  onOpenTeaProfile,
  onOpenInvitation,
  onOpenPosterModal,
  onOpenMoodMemo,
  onTriggerCourtesyPush,
  savedMemo,
  userConsignmentsCount = 1,
  onResetDemoState,
  onOpenInventoryBackend,
  lowStockAlertCount = 0,
  liveCharacterTitle = '深谷苍苔 · 岩骨清客',
  liveRadarScores = {
    roast: 86,
    aroma: 84,
    sweetness: 93,
    mouthfeel: 94,
    throatCharm: 97,
  },
}) => {
  const [annualTier, setAnnualTier] = useState<MemberTierLevel>(userTier);
  const [lifetimeTier, setLifetimeTier] = useState<'LIFETIME_PLATINUM' | 'LIFETIME_BLACK_GOLD' | null>('LIFETIME_BLACK_GOLD');

  useEffect(() => {
    setAnnualTier(userTier);
  }, [userTier]);

  const effectiveMembership = resolveEffectiveMembership(annualTier, lifetimeTier);
  const activeConfig = effectiveMembership.effectiveTierConfig;

  const [showQR, setShowQR] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [showCharter, setShowCharter] = useState(false);

  // Palate Evolution View state (五维雷达动态演变轨迹)
  const [isEvolutionMode, setIsEvolutionMode] = useState(false);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(
    PALATE_EVOLUTION_TIMELINE.length - 1
  );
  const [isPlayingEvolution, setIsPlayingEvolution] = useState(false);

  // Auto-play timeline progression loop
  useEffect(() => {
    if (!isPlayingEvolution || !isEvolutionMode) return;
    const interval = setInterval(() => {
      setSelectedMilestoneIndex((prev) => (prev + 1) % PALATE_EVOLUTION_TIMELINE.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isPlayingEvolution, isEvolutionMode]);

  const activeMilestone = PALATE_EVOLUTION_TIMELINE[selectedMilestoneIndex];
  const effectiveRadar = isEvolutionMode ? activeMilestone.radar : liveRadarScores;

  const nextTierPoints =
    annualTier === 'GUEST'
      ? TIER_CONFIGS.SILVER.minPoints
      : annualTier === 'SILVER'
      ? TIER_CONFIGS.GOLD.minPoints
      : annualTier === 'GOLD'
      ? TIER_CONFIGS.PLATINUM.minPoints
      : annualTier === 'PLATINUM'
      ? TIER_CONFIGS.BLACK_GOLD.minPoints
      : 200000;

  const currentTierBasePoints = activeConfig.minPoints;
  const progressRatio = Math.min(
    100,
    Math.max(
      0,
      Math.round(((leafPoints - currentTierBasePoints) / (nextTierPoints - currentTierBasePoints || 1)) * 100)
    )
  );

  return (
    <div className="space-y-6 px-5 pb-14">
      {/* Editorial Header */}
      <div className="pt-3">
        <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block whitespace-nowrap">
          MEMBERSHIP IDENTITY & TEA TOKENS
        </span>
        <h1 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1F2522] tracking-wider mt-0.5 cjk-title">
          茶人名鉴 · 身份与嘉叶币
        </h1>
        <p className="text-xs text-[#7B7569] font-light mt-1 cjk-body leading-relaxed">
          以茶修身，见素抱朴。叶值积跬步，嘉叶币行四方。
        </p>
      </div>

      {/* Dual Track Identity Switcher for Interactive Demo (双轨等阶演示与切换) */}
      <div className="p-3 bg-[#EFECE3] rounded-3xl border border-[#DCD5C4] space-y-2.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[#6D675B] text-[11px] font-oriental-serif font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
            <Award className="w-3.5 h-3.5 text-[#59665B]" />
            <span>茶道修持席阶：</span>
          </span>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {(['GUEST', 'SILVER', 'GOLD', 'PLATINUM', 'BLACK_GOLD'] as MemberTierLevel[]).map((t) => {
              const conf = TIER_CONFIGS[t];
              const isSelected = annualTier === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    setAnnualTier(t);
                    setUserTier(t);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-oriental-serif transition-all shrink-0 whitespace-nowrap border ${
                    isSelected
                      ? t === 'SILVER'
                        ? 'bg-[#1C282E] text-[#DCE8EE] border-[#587382]/60 shadow-2xs font-bold'
                        : t === 'GOLD'
                        ? 'bg-[#2A1F1A] text-[#E8D6C9] border-[#8C684E]/60 shadow-2xs font-bold'
                        : t === 'PLATINUM'
                        ? 'bg-[#141F28] text-[#D0E2ED] border-[#4D697B]/60 shadow-2xs font-bold'
                        : t === 'BLACK_GOLD'
                        ? 'bg-[#151210] text-[#E5DCD0] border-[#69543B]/60 shadow-2xs font-bold'
                        : 'bg-[#1E2622] text-[#E6E1D8] font-bold border-[#3E4C43] shadow-2xs'
                      : 'text-[#6A6458] bg-transparent border-transparent hover:bg-white/60'
                  }`}
                >
                  {conf.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-[#DDD5C4]">
          <span className="text-[#8F733E] text-[11px] font-oriental-serif font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8F733E]" />
            <span>终身尊荣身份：</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLifetimeTier(null)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-oriental-serif transition-all border ${
                lifetimeTier === null
                  ? 'bg-white text-[#232B26] font-bold border-[#C5BCAB] shadow-2xs'
                  : 'text-[#847B6C] border-transparent hover:bg-white/40'
              }`}
            >
              无终身身份
            </button>
            <button
              onClick={() => setLifetimeTier('LIFETIME_PLATINUM')}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-oriental-serif transition-all border flex items-center gap-1 ${
                lifetimeTier === 'LIFETIME_PLATINUM'
                  ? 'bg-[#122427] text-[#CCE8EB] font-bold border-[#45797C]/60 shadow-xs'
                  : 'text-[#2D5A5D] bg-white/70 border-[#C5DFE2] hover:bg-[#D8EDEF]/50'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5 text-[#5FA2A6]" />
              <span>终身 · 尊享席 (60万)</span>
            </button>
            <button
              onClick={() => setLifetimeTier('LIFETIME_BLACK_GOLD')}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-oriental-serif transition-all border flex items-center gap-1 ${
                lifetimeTier === 'LIFETIME_BLACK_GOLD'
                  ? 'bg-[#181310] text-[#E8DFC9] font-bold border-[#755E42]/70 shadow-xs'
                  : 'text-[#8F733E] bg-white/70 border-[#E8DEC9] hover:bg-[#F2ECE0]'
              }`}
            >
              <Crown className="w-2.5 h-2.5 text-[#C9B68F]" />
              <span>终身 · 典藏席主 (100万)</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIP Luxury Oriental Member Card (素雅缎面质感 · 大地色系底纹) */}
      <div
        className={`relative rounded-3xl p-6 text-[#FAF8F5] overflow-hidden shadow-lg border bg-gradient-to-br ${activeConfig.theme.bgGradient} ${activeConfig.theme.borderClass} select-none transition-all duration-500 bg-satin-brocade ${
          effectiveMembership.isLifetimeActive ? 'animate-warm-rim-pulse' : ''
        }`}
        style={{
          boxShadow: effectiveMembership.isLifetimeActive
            ? '0 12px 34px rgba(0, 0, 0, 0.48), inset 0 0 0 1px rgba(190, 160, 110, 0.25)'
            : '0 8px 24px rgba(0, 0, 0, 0.22)',
        }}
      >
        {/* Subtle Watermark Landscape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none overflow-hidden mix-blend-screen">
          <img
            src="/assets/aistudio/IMG_6488_a1ec8e50.JPG"
            alt="watermark"
            className="w-full h-full object-cover scale-150"
          />
        </div>

        {/* Minimal Brocade Silk Soft Ambient Grain (素雅文人缎面纹理) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px)',
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Top Row: Identity Title, Hierarchy Pill, Lifetime Seal, and QR Button */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-oriental-serif text-xs tracking-widest text-[#D8C496] whitespace-nowrap">
                  春城嘉叶 · 席主名签
                </span>
                <span
                  className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border flex items-center gap-1 shadow-2xs backdrop-blur-xs leading-none whitespace-nowrap"
                  style={{
                    backgroundColor: activeConfig.theme.badgeBgColor,
                    borderColor: activeConfig.theme.accentColor,
                    color: activeConfig.theme.badgeTextColor,
                  }}
                >
                  <Award className="w-2.5 h-2.5 shrink-0" />
                  <span>{activeConfig.name}</span>
                  <span className="opacity-60">·</span>
                  <span>{activeConfig.theme.metalLabel || activeConfig.theme.keyword}</span>
                </span>
                {effectiveMembership.isLifetimeActive && (
                  <span className="text-[9px] font-oriental-serif px-2.5 py-0.5 rounded-full bg-[#181310]/85 border border-[#8F733E]/40 text-[#E8DFC9] flex items-center gap-1 shadow-2xs leading-none whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 text-[#C9B68F] shrink-0" />
                    <span>终身奉席 · 金石御籍</span>
                  </span>
                )}
              </div>

              {/* User Name and Crown Icon */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <h2 className="font-oriental-serif text-2xl sm:text-3xl font-bold tracking-widest text-white leading-none">
                  林清羽
                </h2>
                {effectiveMembership.isLifetimeActive && (
                  <Crown className="w-4 h-4 text-[#C9B68F] shrink-0" />
                )}
              </div>
            </div>

            {/* Right Action Cluster: Seal Stamp & QR Code */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Oriental Intaglio Seal Stamp */}
              <div
                className="px-3 py-1 rounded-md border font-oriental-serif text-[10px] font-bold tracking-widest select-none flex items-center gap-1.5 leading-none shrink-0"
                style={{
                  borderColor: effectiveMembership.isLifetimeActive ? 'rgba(201, 182, 143, 0.35)' : activeConfig.theme.sealColor,
                  color: effectiveMembership.isLifetimeActive ? '#FAF5EE' : activeConfig.theme.sealColor,
                  backgroundColor: effectiveMembership.isLifetimeActive ? 'rgba(26, 20, 16, 0.85)' : 'rgba(0,0,0,0.3)',
                  boxShadow: effectiveMembership.isLifetimeActive ? 'inset 0 0 0 0.5px rgba(201,182,143,0.3)' : undefined,
                }}
              >
                {effectiveMembership.isLifetimeActive && (
                  <Sparkles className="w-3 h-3 text-[#C9B68F] shrink-0" />
                )}
                <span className="whitespace-nowrap">{activeConfig.theme.sealText}</span>
              </div>

              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[#D8C496] transition-colors shrink-0"
                title="出示到店品鉴码"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* QR Popup */}
          {showQR && (
            <div className="p-3.5 bg-white text-[#232B26] rounded-2xl flex items-center justify-between text-xs animate-in fade-in border border-[#232B26]/[0.08] shadow-sm">
              <div className="space-y-0.5">
                <span className="font-bold font-oriental-serif block">贵宾核验身份码</span>
                <span className="text-[10px] text-[#716A5D] block">到店扫码即刻锁定私享茶席</span>
              </div>
              <div className="w-12 h-12 bg-black/[0.04] rounded-lg flex items-center justify-center font-mono text-[9px] text-center p-1 border border-black/[0.06]">
                CCJY-VIP-786
              </div>
            </div>
          )}

          {/* Lifetime Exclusive Serial Badge (终身专属收藏编号 · 金石铭牌) */}
          {effectiveMembership.isLifetimeActive && (
            <div className="relative p-3.5 px-4 rounded-2xl bg-[#14110E]/95 border border-[#C9B68F]/25 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between text-xs backdrop-blur-md overflow-hidden gap-2.5">
              <div className="relative z-10 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#2A231C] border border-[#C9B68F]/30 flex items-center justify-center text-[#C9B68F] shadow-xs shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-oriental-serif font-bold text-[#E8DFC9] tracking-wider text-xs flex items-center gap-2 whitespace-nowrap">
                    <span>终身殿堂席位 · 金石御籍</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#8F733E]/20 text-[#D8C496] text-[9px] font-mono border border-[#8F733E]/25 leading-none shrink-0 whitespace-nowrap">
                      永久尊荣
                    </span>
                  </span>
                  <span className="text-[10px] text-[#A69B88] font-light truncate mt-0.5">
                    孤品首位认购权 · 私人茶会 · 研发新品共创
                  </span>
                </div>
              </div>

              {/* CCJY-№008 Serial - Clear spacing, never overlapping with pill */}
              <div className="relative z-10 flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E] opacity-80" />
                <span className="font-mono text-xs font-bold tracking-widest text-[#FAF6EE] bg-black/60 px-3 py-1 rounded-md border border-[#C9B68F]/30 leading-none whitespace-nowrap shadow-xs">
                  CCJY-№008
                </span>
              </div>
            </div>
          )}

              {/* Independent Three Accounts: Growth Value / Points / Jiaye Coins (储值金) */}
          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10">
            <div className="min-w-0 pr-1">
              <span className="text-[9px] text-[#A6A092] tracking-wider uppercase font-mono block whitespace-nowrap">
                年度成长值
              </span>
              <div className="flex items-baseline gap-1 mt-1 whitespace-nowrap price-nowrap">
                <span className="font-mono text-base sm:text-2xl font-bold text-[#FAF8F5]">
                  {(leafPoints * 2).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#C8C2B3]">分</span>
              </div>
              <span className="text-[9px] text-[#8E877B] block mt-0.5 font-oriental-serif whitespace-nowrap">茶器1.5x加速</span>
            </div>

            <div className="min-w-0 pr-1">
              <span className="text-[9px] text-[#A6A092] tracking-wider uppercase font-mono block whitespace-nowrap">
                积蓄积分
              </span>
              <div className="flex items-baseline gap-1 mt-1 whitespace-nowrap price-nowrap">
                <span className="font-mono text-base sm:text-2xl font-bold text-[#FAF8F5]">
                  {leafPoints.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#C8C2B3]">点</span>
              </div>
              <span className="text-[9px] text-[#8E877B] block mt-0.5 font-oriental-serif whitespace-nowrap">
                {effectiveMembership.effectivePointMultiplier}x 倍率加速
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[9px] text-[#A6A092] tracking-wider uppercase font-mono flex items-center gap-1 whitespace-nowrap">
                <JiayeCoinIcon size={12} variant="light" />
                <span>嘉叶币储值</span>
              </span>
              <div className="flex items-baseline gap-1 mt-1 whitespace-nowrap price-nowrap">
                <JiayeCoinIcon size={14} variant="light" />
                <span className="font-mono text-base sm:text-2xl font-bold text-[#FAF6EE]">
                  ¥{chaTokens.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#C9B68F]">元</span>
              </div>
              <span className="text-[9px] text-[#C9B68F] block mt-0.5 font-oriental-serif whitespace-nowrap">
                100%全额直接购买抵扣
              </span>
            </div>
          </div>

          {/* Level Progress & Dual Identity Note */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex justify-between items-center text-[10px] text-[#B0AA9D] font-mono gap-2 flex-wrap">
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span>当前席阶：{activeConfig.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-[#D8C496] border border-white/20 leading-none whitespace-nowrap shrink-0">
                  终身实付 62,800 元
                </span>
              </span>
              <span className="whitespace-nowrap shrink-0">距下阶需 {nextTierPoints.toLocaleString()} 分</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#59665B] via-[#8F733E] to-[#C9B68F] rounded-full transition-all duration-500"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] text-[#C4BCAB] flex-wrap gap-1">
              <span className="whitespace-nowrap">寄售费率：{Math.round(effectiveMembership.effectiveConsignmentFeeRate * 100)}%</span>
              <span className="text-[#D8C496] whitespace-nowrap">终身门槛：尊享60万 / 典藏100万</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Track Priority Effective Notice Card */}
      <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#232B26]/[0.06] text-xs text-[#524B3F] flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#FAF1DF] border border-[#8F733E]/20 flex items-center justify-center text-[#8F733E] shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-oriental-serif text-[11px] leading-relaxed">
            {effectiveMembership.appliedReason}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#8F733E] bg-white px-2 py-0.5 rounded-md border border-[#8F733E]/20 shrink-0 leading-none whitespace-nowrap">
          孰高原则
        </span>
      </div>

      {/* Tea Character Dossier & Palate Radar Interactive Card (个人茶性五维雷达 + 动态演变视图 - 东方美学朱砂/黛青/暗金) */}
      <div className="bg-gradient-to-b from-[#161C19] via-[#141A17] to-[#111613] rounded-3xl p-5 border border-[#C9B68F]/20 shadow-lg text-[#FAF5EE] space-y-4 relative overflow-hidden">
        {/* Subtle Watermark Landscape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5 pointer-events-none overflow-hidden mix-blend-screen">
          <img
            src="/assets/aistudio/IMG_6490_7c61932b.JPG"
            alt="watermark"
            className="w-full h-full object-cover scale-150"
          />
        </div>

        {/* Card Header & View Mode Switcher */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B33927] shadow-[0_0_6px_rgba(179,57,39,0.8)]" />
              <span className="text-[10px] font-mono tracking-wider text-[#C9B68F] font-bold uppercase whitespace-nowrap">
                AI PALATE DOSSIER / 个人茶性五维雷达
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#B33927]/20 border border-[#B33927]/40 text-[#FFC4B8] text-[9px] font-mono leading-none whitespace-nowrap">
                {isEvolutionMode ? '演变轨迹回放' : '实时演算'}
              </span>
            </div>
            <h3 className="font-oriental-serif text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>
                {isEvolutionMode
                  ? `动态演变 · ${activeMilestone.phaseTitle}`
                  : `当前茶性 · ${liveCharacterTitle}`}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#EEDB9F] shrink-0" />
            </h3>
            <p className="text-[11px] text-[#C4BCAB] font-light leading-relaxed">
              {isEvolutionMode
                ? activeMilestone.evolutionNote
                : `历经 ${recentOrdersCount} 笔品鉴履历积累，点击雷达各点查看风土释义。`}
            </p>
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsEvolutionMode(!isEvolutionMode);
                setIsPlayingEvolution(false);
              }}
              className={`px-3 py-1.5 rounded-xl border font-oriental-serif text-xs font-bold flex items-center gap-1.5 transition-all leading-none ${
                isEvolutionMode
                  ? 'bg-[#B33927] text-white border-[#B33927] shadow-xs'
                  : 'bg-white/10 text-[#EEDB9F] border-[#C9B68F]/30 hover:bg-white/15'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{isEvolutionMode ? '返回当前图谱' : '动态演变视图'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Evolution Interactive Timeline (仅在演变视图下展示) */}
        {isEvolutionMode && (
          <div className="relative z-10 p-3.5 rounded-2xl bg-black/40 border border-[#C9B68F]/20 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs">
              <span className="font-oriental-serif font-bold text-[#EEDB9F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B33927] animate-pulse" />
                <span>品味进阶时间轴（近数月品茗变迁）</span>
              </span>

              {/* Play / Pause Auto Evolution Button */}
              <button
                type="button"
                onClick={() => setIsPlayingEvolution(!isPlayingEvolution)}
                className="px-2.5 py-1 rounded-lg bg-[#1C2621] border border-[#C9B68F]/30 text-[11px] font-oriental-serif text-[#EEDB9F] hover:text-white flex items-center gap-1 shadow-2xs leading-none"
              >
                {isPlayingEvolution ? (
                  <>
                    <Pause className="w-3 h-3 text-[#FF8A75]" />
                    <span>暂停播送</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#52B788]" />
                    <span>自动连续播放</span>
                  </>
                )}
              </button>
            </div>

            {/* Stepper Timeline Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {PALATE_EVOLUTION_TIMELINE.map((stage, idx) => {
                const isActive = selectedMilestoneIndex === idx;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      setSelectedMilestoneIndex(idx);
                      setIsPlayingEvolution(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                      isActive
                        ? 'bg-[#223028] border-[#C9B68F] shadow-sm ring-1 ring-[#C9B68F]/40'
                        : 'bg-black/30 border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-[#A69B88]">
                        阶段 {idx + 1}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B33927]" />
                      )}
                    </div>
                    <span className={`font-oriental-serif font-bold text-[11px] block leading-tight ${
                      isActive ? 'text-[#FAF5EE]' : 'text-[#D4CDBC]'
                    }`}>
                      {stage.monthLabel}
                    </span>
                    <span className="text-[10px] text-[#C9B68F] font-oriental-serif block mt-1 leading-none">
                      {stage.primaryShift}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Milestone Insight Ribbon */}
            <div className="p-3 rounded-xl bg-[#1C2621]/90 border border-[#C9B68F]/20 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-oriental-serif font-bold text-[#EEDB9F] text-xs">
                  {activeMilestone.phaseTitle} · 见证茶品：{activeMilestone.featuredTea}
                </span>
                <span className="text-[10px] font-mono text-[#D4CDBC] bg-black/40 px-2 py-0.5 rounded leading-none border border-white/10">
                  累计 {activeMilestone.orderCountSnapshot} 笔品鉴存证
                </span>
              </div>
              <p className="text-[11px] text-[#C4BCAB] font-light leading-relaxed">
                {activeMilestone.evolutionNote}
              </p>
            </div>
          </div>
        )}

        {/* Embedded Interactive 5D Radar with Smooth Morphing Transition */}
        <div className="relative z-10 pt-1 flex flex-col items-center">
          <TeaProfileRadar radar={effectiveRadar} size={270} interactive={true} />
        </div>

        {/* Bottom Bar: Action & Deep Dossier Link */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#A89F8F]">
          <span className="font-oriental-serif text-[11px]">
            {isEvolutionMode
              ? '雷达图轨迹平滑插值过渡中，点击时间轴可随意比对各月风土偏好。'
              : `已同步五维工夫茶图谱，可点击顶点展开详尽释义。`}
          </span>
          <button
            type="button"
            onClick={onOpenTeaProfile}
            className="text-[11px] font-oriental-serif text-[#C9B68F] hover:text-[#FAF5EE] hover:underline flex items-center gap-0.5 shrink-0 ml-2 whitespace-nowrap"
          >
            <span>深度风土档案 &rarr;</span>
          </button>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <button
          onClick={onOpenPointsRedeem}
          className="p-3.5 bg-white rounded-2xl border border-[#ECE6DB] hover:border-[#232B26] transition-all shadow-xs flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-full bg-[#FAF5E8] text-[#8F733E] flex items-center justify-center mb-1.5">
            <Gift className="w-4 h-4" />
          </div>
          <span className="text-xs font-oriental-serif font-bold text-[#202723]">
            积分兑换
          </span>
          <span className="text-[9px] text-[#868074] mt-0.5">
            珍藏茶样器物
          </span>
        </button>

        <button
          onClick={onOpenDailyRitual}
          className="p-3.5 bg-white rounded-2xl border border-[#ECE6DB] hover:border-[#232B26] transition-all shadow-xs flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-full bg-[#EBF3ED] text-[#2F6740] flex items-center justify-center mb-1.5">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs font-oriental-serif font-bold text-[#202723]">
            朝夕点茶
          </span>
          <span className="text-[9px] text-[#868074] mt-0.5">
            每日修持领币
          </span>
        </button>

        <button
          onClick={onOpenConsignmentSubmit}
          className="p-3.5 bg-white rounded-2xl border border-[#ECE6DB] hover:border-[#232B26] transition-all shadow-xs flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-full bg-[#F3EFE7] text-[#232B26] flex items-center justify-center mb-1.5">
            <Coins className="w-4 h-4" />
          </div>
          <span className="text-xs font-oriental-serif font-bold text-[#202723]">
            名物寄售
          </span>
          <span className="text-[9px] text-[#868074] mt-0.5">
            老茶鉴藏变现
          </span>
        </button>
      </div>

      {/* Visual Tea Cultivation Mastery & Badges (茶道修行五重境界进度条与徽章) */}
      <CultivationProgressSection
        leafPoints={leafPoints}
        salonBookingsCount={activeBookingsCount}
        onOpenSalonReservation={onOpenSalonReservation}
      />

      {/* My Tea Seats · Upcoming Session Countdown & Native Calendar Sync (我的茶席 · 席次预热倒计时) */}
      <UpcomingSeatCountdownCard
        bookings={activeBookings}
        onOpenInvitation={onOpenInvitation}
        onOpenPosterModal={onOpenPosterModal}
        onOpenMoodMemo={onOpenMoodMemo}
        onTriggerCourtesyPush={onTriggerCourtesyPush}
        savedMemo={savedMemo}
        onOpenAllBookings={() => onOpenResume?.('bookings')}
        onGoToBookRoom={onOpenSalonReservation}
      />

      {/* Orders and Bookings Overview */}
      <div className="bg-white rounded-3xl p-4 border border-[#ECE6DB] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-oriental-serif text-sm font-bold text-[#232B26]">
            我的茶事履历
          </h3>
          <span className="text-[10px] font-mono text-[#8C8578]">点击查看详实档案</span>
        </div>
        <div className="divide-y divide-[#F2EFE8] text-xs">
          <button
            onClick={() => onOpenResume?.('orders')}
            className="w-full py-2.5 flex items-center justify-between hover:bg-[#FAF8F5] px-1 rounded-xl transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-[#6D675B]" />
              <span className="text-[#6D675B]">已入囊商品订单</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-medium text-[#232B26]">{recentOrdersCount} 笔</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#B2ABA0]" />
            </div>
          </button>

          <button
            onClick={() => onOpenResume?.('bookings')}
            className="w-full py-2.5 flex items-center justify-between hover:bg-[#FAF8F5] px-1 rounded-xl transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#8F733E]" />
              <span className="text-[#6D675B]">私享茶室预约日程</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-medium text-[#8F733E]">{activeBookingsCount} 个席位有效</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#B2ABA0]" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenResume?.('consignments')}
            className="w-full py-2.5 flex items-center justify-between hover:bg-[#FAF8F5] px-1 rounded-xl transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-[#6D675B]" />
              <span className="text-[#6D675B]">已鉴藏入库流转名物</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-medium text-[#232B26]">{userConsignmentsCount} 件</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#B2ABA0]" />
            </div>
          </button>
        </div>
      </div>

      {/* Store Administrator Backend Entrance Card (掌柜中枢 · 仓储与低库存预警看板) */}
      {onOpenInventoryBackend && (
        <div
          onClick={onOpenInventoryBackend}
          className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-[#202924] via-[#27322C] to-[#1A211D] text-[#FAF8F5] border border-[#3E4C43] shadow-sm cursor-pointer hover:brightness-105 transition-all space-y-2.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono tracking-widest text-[#D8C496] uppercase font-bold flex items-center gap-1">
                  <Warehouse className="w-3.5 h-3.5" />
                  <span>STORE ADMIN BACKEND · 掌柜中枢</span>
                </span>
                {lowStockAlertCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#A63429] text-white text-[10px] font-mono font-bold flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{lowStockAlertCount} 款低库存预警</span>
                  </span>
                )}
              </div>
              <h3 className="font-oriental-serif text-sm sm:text-base font-bold text-white">
                小程序后台 · 全域仓储与低库存补货看板
              </h3>
              <p className="text-[11px] text-[#C8C1B3] font-light leading-relaxed">
                实时监控山场原叶 (Tea)、茗壶雅瓷 (Ceramics) 与典藏寄售 (Consignments) 库存水位，支持掌柜一键极速补仓。
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#D8C496] shrink-0 mt-1">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Tier Privileges Breakdown · 双轨会籍与终身尊荣体系 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#8F733E]" />
            <h2 className="font-oriental-serif text-sm font-bold text-[#232B26]">
              春城嘉叶茶人等阶与特权细则 · 双轨并存
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#8F733E] bg-[#FAF1E0] px-2 py-0.5 rounded-full border border-[#E8D9BF]">
            自动适用 · 孰高原则
          </span>
        </div>

        {/* Track A: 年度修持会籍 (5阶 · 素雅缎面大地色系) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#59665B]" />
              <span className="text-[11px] font-oriental-serif font-bold text-[#3E4C43]">
                茶道修持席阶（依年成长值阶梯晋级，动态流转）
              </span>
            </div>
            <span className="text-[10px] text-[#8F733E] font-mono">
              五大素雅缎面 · 名瓷大地色系
            </span>
          </div>

          {(['GUEST', 'SILVER', 'GOLD', 'PLATINUM', 'BLACK_GOLD'] as MemberTierLevel[]).map((t) => {
            const conf = TIER_CONFIGS[t];
            const isSelected = annualTier === t;
            const isEffective = effectiveMembership.primaryTierId === t;
            return (
              <div
                key={t}
                onClick={() => setAnnualTier(t)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden select-none bg-satin-brocade ${
                  isEffective
                    ? `bg-gradient-to-br ${conf.theme.bgGradient} text-white ${conf.theme.borderClass} shadow-md ring-1 ring-[#8F733E]/40`
                    : isSelected
                    ? `bg-gradient-to-br ${conf.theme.bgGradient} text-white/95 ${conf.theme.borderClass} opacity-95`
                    : 'bg-white border-[#ECE6DB] hover:border-[#D5CDBD] text-[#202723]'
                }`}
              >
                {/* Minimal brocade grain overlay */}
                {(isEffective || isSelected) && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-15"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px)',
                    }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="w-5 h-5 rounded-full border text-[9px] flex items-center justify-center font-bold shrink-0"
                      style={{
                        borderColor: isEffective || isSelected ? conf.theme.sealColor : '#8F733E',
                        color: isEffective || isSelected ? conf.theme.sealColor : '#8F733E',
                        backgroundColor: isEffective || isSelected ? 'rgba(0,0,0,0.3)' : 'transparent',
                      }}
                    >
                      {conf.theme.sealText.slice(0, 2)}
                    </span>
                    <span className="font-oriental-serif font-bold text-sm">
                      {conf.name} · {conf.enTitle}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                        isEffective || isSelected
                          ? 'bg-white/10 border-white/20 text-[#FAF8F5]'
                          : 'bg-[#FAF6EC] border-[#E8DFC9] text-[#8F733E]'
                      }`}
                    >
                      {conf.theme.metalLabel || conf.theme.themeName}
                    </span>
                    {isEffective && (
                      <span className="px-2 py-0.5 rounded-full bg-[#1F2522] border border-[#8F733E]/50 text-[#E8DFC9] text-[9px] font-mono font-bold shadow-2xs">
                        当前生效
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className={isEffective || isSelected ? 'text-[#FAF5EE] font-bold' : 'text-[#3E4C43] font-bold'}>
                      {conf.pointMultiplier.toFixed(1)}x 积分
                    </span>
                    <span className={isEffective || isSelected ? 'text-[#E8DFC9]' : 'text-[#8F733E]'}>
                      寄售率 {Math.round(conf.consignmentFeeRate * 100)}%
                    </span>
                  </div>
                </div>

                <div
                  className={`relative z-10 flex items-center justify-between text-[11px] mb-2.5 font-mono ${
                    isEffective || isSelected ? 'text-white/70' : 'text-[#696357]'
                  }`}
                >
                  <span>晋级门槛: {conf.minPoints === 0 ? '注册即入' : `${conf.minPoints.toLocaleString()} 成长值`}</span>
                  <span>{conf.discountRate > 0 ? `${Math.round((1 - conf.discountRate) * 10)}折商品特惠` : '基准消费礼遇'}</span>
                </div>

                <div className="relative z-10 flex flex-wrap gap-1.5">
                  {conf.privileges.map((p, i) => (
                    <span
                      key={i}
                      className={`text-[10px] px-2 py-0.5 rounded-md ${
                        isEffective || isSelected
                          ? 'text-white/85 bg-white/10 border border-white/10'
                          : 'text-[#696357] bg-[#EFECE3]/70'
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Track B: 终身尊荣身份 (2阶 · 边缘微弱暖光脉冲) */}
        <div className="space-y-2.5 pt-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-[#C9B68F]" />
              <span className="text-[11px] font-oriental-serif font-bold text-[#8F733E]">
                终身尊荣身份（实付累计达成，永久有效不降级）
              </span>
            </div>
            <span className="text-[10px] text-[#A48B5C] font-mono flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#C9B68F]" />
              <span>边缘暖光脉冲</span>
            </span>
          </div>

          {(['LIFETIME_PLATINUM', 'LIFETIME_BLACK_GOLD'] as const).map((t) => {
            const conf = TIER_CONFIGS[t];
            const isSelected = lifetimeTier === t;
            const isEffective = effectiveMembership.primaryTierId === t;
            return (
              <div
                key={t}
                onClick={() => setLifetimeTier(t)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden select-none bg-satin-brocade ${
                  isEffective
                    ? `bg-gradient-to-br ${conf.theme.bgGradient} text-[#FAF5EE] ${conf.theme.borderClass} animate-warm-rim-pulse`
                    : isSelected
                    ? `bg-gradient-to-br ${conf.theme.bgGradient} text-[#FAF5EE] ${conf.theme.borderClass}`
                    : 'bg-gradient-to-br from-[#1C1713] via-[#2A231C] to-[#14100D] text-[#E8DFD3] border-[#8F733E]/40 hover:border-[#C9B68F]'
                }`}
                style={{
                  boxShadow: isEffective
                    ? '0 10px 28px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(201, 182, 143, 0.25)'
                    : undefined,
                }}
              >
                <div className="relative z-10 flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Hot-stamped Golden Seal */}
                    <span
                      className="px-2 py-0.5 rounded border text-[9px] font-bold shadow-xs flex items-center gap-0.5"
                      style={{
                        borderColor: isEffective ? '#C9B68F' : conf.theme.sealColor,
                        color: isEffective ? '#FAF5EE' : conf.theme.sealColor,
                        backgroundColor: 'rgba(20, 15, 12, 0.85)',
                      }}
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#C9B68F]" />
                      <span>{conf.theme.sealText}</span>
                    </span>

                    <span className="font-oriental-serif font-bold text-sm text-[#FAF5EE]">
                      {conf.name} · {conf.enTitle}
                    </span>

                    {/* Dynamic Warm Rim Ribbon Badge */}
                    <span className="relative overflow-hidden px-2.5 py-0.5 rounded-full bg-[#1F1914] border border-[#8F733E]/60 text-[#E8DFC9] text-[10px] font-oriental-serif font-medium flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5 text-[#C9B68F]" />
                      <span>终身尊荣 · 暖光内敛</span>
                    </span>

                    {isEffective && (
                      <span className="px-2 py-0.5 rounded-full bg-[#2A231C] border border-[#C9B68F]/50 text-[#FAF5EE] text-[9px] font-mono font-bold shadow-xs">
                        当前最高裁定
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-[#FAF5EE] font-bold">
                      {conf.pointMultiplier.toFixed(1)}x 极优积分
                    </span>
                    <span className="text-[#E8DFC9]">
                      极优寄售率 {Math.round(conf.consignmentFeeRate * 100)}%
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] mb-2.5 font-mono text-[#D8CDBE]">
                  <span>实付门槛: {t === 'LIFETIME_PLATINUM' ? '累计实付满 60 万元' : '累计实付满 100 万元'}</span>
                  <span className="text-[#C9B68F]">
                    {conf.discountRate > 0 ? `${Math.round((1 - conf.discountRate) * 10)}折全域特惠 · 永不降级` : '全域至高礼遇'}
                  </span>
                </div>

                <div className="relative z-10 flex flex-wrap gap-1.5">
                  {conf.privileges.map((p, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md text-[#FAF5EE] bg-white/10 border border-white/15"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tea Utensil Exchange & Consignment Dual-Track Mechanism (茶器置换与寄售权益) */}
      <div className="bg-[#FAF7F0] rounded-3xl p-4 sm:p-5 border border-[#E5DECD] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-[#8F733E]" />
            <h3 className="font-oriental-serif text-sm font-bold text-[#232B26]">
              茶器置换与典藏寄售闭环
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#8F733E] bg-[#FAF1E0] px-2 py-0.5 rounded-full border border-[#E8D9BF]">
            独立双轨 · 嘉叶币承接
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Track 1: Consignment */}
          <div className="p-3 bg-white rounded-2xl border border-[#ECE4D4] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-oriental-serif font-bold text-[#232B26]">
                1. 典藏寄售 (二级流转)
              </span>
              <span className="font-mono text-[11px] text-[#285E37] font-bold">
                费率 10% ~ 5%
              </span>
            </div>
            <p className="text-[11px] text-[#6E6759] leading-relaxed">
              知音10% ➔ 品鉴9% ➔ 雅集8% ➔ 尊享7% ➔ 典藏6% ➔ 终身典藏5%。实物鉴真入仓，成交后快速结算，未成交不收取服务费。
            </p>
          </div>

          {/* Track 2: Utensil Exchange */}
          <div className="p-3 bg-white rounded-2xl border border-[#ECE4D4] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-oriental-serif font-bold text-[#232B26]">
                2. 茶器置换 (以旧换新)
              </span>
              <span className="font-mono text-[11px] text-[#8F733E] font-bold">
                嘉叶币 100% 发放
              </span>
            </div>
            <p className="text-[11px] text-[#6E6759] leading-relaxed">
              提交茶器资料 ➔ 权威鉴定估值 ➔ 会员签署协议 ➔ 净置换价全额以「嘉叶币」发放，仅用于商城抵扣新茶新器，不提现不转让。
            </p>
          </div>
        </div>

        {/* Six Mental Stages of Tea Mastery (茶人六阶心境成长路径) */}
        <div className="pt-2 border-t border-[#ECE3D2] space-y-2">
          <span className="text-[10px] font-mono text-[#8C8476] tracking-wider uppercase block">
            SIX STAGES OF TEA CULTIVATION / 茶人六阶成长心境
          </span>
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
            {[
              { stage: '喝茶人', desc: '初识佳茗', active: true },
              { stage: '爱茶人', desc: '风骨初谙', active: true },
              { stage: '茶人', desc: '雅集席主', active: true },
              { stage: '藏茶人', desc: '器茶两全', active: userTier === 'MASTER' || userTier === 'YINSHAN' },
              { stage: '鉴茶师', desc: '眼明手准', active: userTier === 'YINSHAN' },
              { stage: '共创者', desc: '同道筑梦', active: false },
            ].map((s, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl text-center shrink-0 min-w-[70px] border transition-all ${
                  s.active
                    ? 'bg-[#232B26] text-white border-[#232B26] shadow-2xs'
                    : 'bg-[#F2ECE0] text-[#7A7365] border-[#E0D7C6]'
                }`}
              >
                <span className="text-[11px] font-oriental-serif font-bold block">{s.stage}</span>
                <span className="text-[9px] opacity-75 block mt-0.5">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collapsible Official Membership Charter (春城嘉叶会籍章程 · 生态细则全览) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ECE5D7] shadow-xs space-y-3">
        <button
          type="button"
          onClick={() => setShowCharter(!showCharter)}
          className="w-full flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#FAF6EC] border border-[#E8DEC9] flex items-center justify-center text-[#8F733E] shrink-0">
              <ScrollText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-oriental-serif text-xs sm:text-sm font-bold text-[#232B26] truncate">
                春城嘉叶会籍章程 · 生态细则全览
              </h3>
              <span className="text-[10px] text-[#8C8476] font-mono block truncate">
                membership-ecosystem-v1.0 · 认真喝每一杯茶
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#8C8476] shrink-0 transition-transform duration-200 ${
              showCharter ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showCharter && (
          <div className="pt-3 border-t border-[#F2ECE1] space-y-4 text-xs text-[#524B3F] leading-relaxed animate-in fade-in duration-200">
            {/* Core Manifesto */}
            <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#ECE4D4] italic font-oriental-serif text-[#6B6150] text-center text-[11px]">
              「认真喝每一杯茶，也认真对待每一段长期关系。从喝茶人，到爱茶人，再到茶文化参与者、品牌收藏家与共创者。」
            </div>

            {/* 1. Account Roles */}
            <div className="space-y-1.5">
              <span className="font-oriental-serif font-bold text-[#202723] block text-xs">
                一、三类独立账户与记账准则
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#696153]">
                <li>
                  <strong className="text-[#202723]">成长值：</strong>
                  用于年度会籍等级与成长进度。买茶实付 1元=1成长值，买茶器/手作壶实付 1元=1.5成长值；茶评+100、小红书+300、茶会+500、置换成功+500、寄售成功+500。
                </li>
                <li>
                  <strong className="text-[#202723]">积分：</strong>
                  自入账起 24 个月有效。用于适用订单抵扣、商品兑换和活动兑换。消费按会籍倍率发放（1x ~ 3x）。
                </li>
                <li>
                  <strong className="text-[#202723]">嘉叶币（储值金）：</strong>
                  春城嘉叶专享会员储值金（1币=1元），全场茗茶、名家手作壶与雅席预约支持 100% 全额直接购买抵扣，不提现、不转让。茶器置换净估值 100% 以嘉叶币发放，专款专用于换购新茶新器。
                </li>
              </ul>
            </div>

            {/* 2. Dual Membership */}
            <div className="space-y-1.5">
              <span className="font-oriental-serif font-bold text-[#202723] block text-xs">
                二、双轨会籍（年度动态成长 vs 终身尊荣）
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="p-2.5 bg-[#F9F7F2] rounded-xl border border-[#ECE5D7] space-y-1">
                  <span className="font-bold text-[#232B26] block">【茶道修持 · 年度席阶】</span>
                  <div>知音会员：注册即可 · 1.0倍积分 · 10%寄售费率</div>
                  <div>品鉴会员：10,000分 · 1.2倍积分 · 9%寄售费率</div>
                  <div>雅集会员：30,000分 · 1.5倍积分 · 8%寄售费率</div>
                  <div>尊享会员：80,000分 · 1.8倍积分 · 7%寄售费率</div>
                  <div>典藏会员：200,000分 · 2.0倍积分 · 6%寄售费率</div>
                </div>
                <div className="p-2.5 bg-[#FAF4E8] rounded-xl border border-[#EADBBD] space-y-1">
                  <span className="font-bold text-[#8F733E] block">【金石御籍 · 终身尊荣身份】</span>
                  <div>终身 · 尊享席：实付 600,000元 · 2.5倍积分 · 6%寄售费率 · 永久尊荣与年度会员礼</div>
                  <div>终身 · 典藏席主：实付 1,000,000元 · 3.0倍积分 · 5%寄售费率 · 专属收藏编号、私人茶会与新品研发</div>
                  <div className="text-[#8F733E] pt-0.5">※ 双轨并存时自动按最高身份倍率与最低费率执行</div>
                </div>
              </div>
            </div>

            {/* 3. Consignment & Exchange */}
            <div className="space-y-1.5">
              <span className="font-oriental-serif font-bold text-[#202723] block text-xs">
                三、寄售与茶器置换独立双轨机制
              </span>
              <p className="text-[11px] text-[#696153]">
                寄售未成交不收取成交服务费。茶器置换独立于寄售，会员经鉴真估值后，净置换价全额返还嘉叶币，专用于换购新茶新壶，资产全封闭安全流转，置换本身不计入终身消费累计。
              </p>
            </div>

            {/* 4. Brand Boundary */}
            <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#EAE2D2] text-[10px] text-[#7A7160]">
              <strong className="text-[#202723]">品牌边界与执行说明：</strong>
              爻 YÁO 商品默认不抵扣积分、不产生母品牌积分，也不参与会员折扣或满减，以保持春城嘉叶母品牌传统高山原叶与名家器物的高端心智。
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#FAF7F0] rounded-3xl p-5 border border-[#E5DECD] space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#ECE4D4] pb-2.5">
          <div className="flex items-center gap-2.5">
            <img
              src="https://www.chunchengjiaye.com/images/brand/logo-square-clean.png"
              alt="春城嘉叶 Logo"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-7 h-7 rounded-md object-contain bg-[#232B26] p-0.5"
            />
            <div>
              <h3 className="font-oriental-serif text-xs font-bold text-[#1E2320]">
                春城嘉叶（深圳）茶业有限公司
              </h3>
              <span className="text-[9px] font-mono text-[#8C8576] block">
                CHUN CHENG JIA YE · 官网实名档案
              </span>
            </div>
          </div>
          <span className="text-[10px] font-oriental-serif px-2 py-0.5 rounded-full bg-[#EAE2D2] text-[#635B4E]">
            官方认证
          </span>
        </div>

        <p className="text-xs font-oriental-serif text-[#4B4438] italic leading-relaxed text-center py-0.5">
          「一叶有来处，一器有分寸。以凤凰单丛与武夷岩茶为本，兼及景德镇赏瓷雅器、潮州手拉与宜兴手拍茗壶，并以爻 YÁO 探索更贴近日常的饮茶方式。」
        </p>

        {/* Full Street Address Card */}
        <div className="p-3 bg-white/80 rounded-2xl border border-[#ECE5D7] space-y-1">
          <span className="text-[10px] text-[#8C8576] font-mono block">
            企业注册与私享茶舍驻地 (SHENZHEN NANSHAN)
          </span>
          <p className="text-xs font-oriental-serif font-medium text-[#202723] leading-relaxed">
            深圳市南山区桃源街道平山社区留仙大道4088号博林天瑞花园3号楼40B
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-[#635D50]">
          <div className="p-2.5 bg-white/70 rounded-xl border border-[#ECE5D7]">
            <span className="text-[10px] text-[#8C8576] block">官方联系电话</span>
            <span className="font-mono font-bold text-[#202723]">13825293242</span>
          </div>
          <div className="p-2.5 bg-white/70 rounded-xl border border-[#ECE5D7]">
            <span className="text-[10px] text-[#8C8576] block">官方网站</span>
            <span className="font-mono text-[10px] text-[#8F733E] break-all">
              www.chunchengjiaye.com
            </span>
          </div>
          <div className="p-2.5 bg-white/70 rounded-xl border border-[#ECE5D7]">
            <span className="text-[10px] text-[#8C8576] block">官方抖音号</span>
            <span className="text-[10px] font-mono text-[#202723]">tiantian19860309</span>
          </div>
          <div className="p-2.5 bg-white/70 rounded-xl border border-[#ECE5D7]">
            <span className="text-[10px] text-[#8C8576] block">茶器与寄售</span>
            <span className="text-[10px] text-[#202723]">春城嘉叶茶器与寄售（闲鱼）</span>
          </div>
        </div>

        {/* Official WeChat Mini Program QR Code & ICP Filing */}
        <div className="p-3 bg-white/85 rounded-2xl border border-[#E6DEC8] flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-oriental-serif font-bold text-[#1F2522] block">
              春城嘉叶 · 官方微信小程序码
            </span>
            <p className="text-[10px] text-[#756E61] leading-relaxed">
              微信扫码直达「春城嘉叶」官方小程序，咨询当季茶品、器物与礼盒定制。
            </p>
            <div className="pt-1 text-[9px] font-mono text-[#968E7E] space-y-0.5">
              <div>备案号：粤ICP备2026111187号-1</div>
              <div>公安备案：粤公网安备44030002015862号</div>
            </div>
          </div>
          <img
            src="https://www.chunchengjiaye.com/images/contact/wechat-mini-program.jpg"
            alt="春城嘉叶微信小程序码"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-20 h-20 rounded-xl border border-[#E5DEC9] object-cover shrink-0 shadow-2xs bg-white p-1"
          />
        </div>

        {onResetDemoState && (
          <div className="pt-2 border-t border-[#ECE4D4] flex items-center justify-between text-[11px] text-[#7D7567]">
            <span>全站资产与履历已开启本地持久化同步</span>
            <button
              type="button"
              onClick={() => {
                onResetDemoState();
                setResetConfirmed(true);
                setTimeout(() => setResetConfirmed(false), 2200);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#DED5C4] text-[#5E574A] hover:border-[#232B26] hover:text-[#232B26] font-oriental-serif transition-colors"
            >
              {resetConfirmed ? '✦ 已恢复初始演示状态' : '重置演示数据'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
