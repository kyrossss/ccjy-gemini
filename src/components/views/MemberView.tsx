import React, { useState } from 'react';
import { QrCode, Gift, Flame, Shield, Coins, ArrowRight, Award, ChevronRight, Package, Calendar } from 'lucide-react';
import { MemberTierLevel, TIER_CONFIGS } from '../../utils/teaLogic';
import { CultivationProgressSection } from '../CultivationProgressSection';

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
  onOpenSalonReservation?: () => void;
  onOpenResume?: (tab: 'orders' | 'bookings' | 'consignments') => void;
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
  onOpenSalonReservation,
  onOpenResume,
}) => {
  const currentConfig = TIER_CONFIGS[userTier];
  const [showQR, setShowQR] = useState(false);

  const nextTierPoints =
    userTier === 'GUEST'
      ? TIER_CONFIGS.ENTHUSIAST.minPoints
      : userTier === 'ENTHUSIAST'
      ? TIER_CONFIGS.MASTER.minPoints
      : userTier === 'MASTER'
      ? TIER_CONFIGS.YINSHAN.minPoints
      : 50000;

  const currentTierBasePoints = currentConfig.minPoints;
  const progressRatio = Math.min(
    100,
    Math.max(
      0,
      Math.round(((leafPoints - currentTierBasePoints) / (nextTierPoints - currentTierBasePoints)) * 100)
    )
  );

  return (
    <div className="space-y-6 px-5 pb-14">
      {/* Editorial Header */}
      <div className="pt-3">
        <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block">
          MEMBERSHIP IDENTITY & TEA TOKENS
        </span>
        <h1 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1F2522] tracking-wider mt-0.5">
          茶人名鉴 · 身份与茗元
        </h1>
        <p className="text-xs text-[#7B7569] font-light mt-1">
          以茶修身，见素抱朴。叶值积跬步，茗元行四方。
        </p>
      </div>

      {/* Tier Switcher for interactive inspection */}
      <div className="p-2.5 bg-[#EFECE3] rounded-2xl border border-[#DCD5C4] flex items-center justify-between text-xs">
        <span className="text-[#6D675B] text-[11px] font-oriental-serif">切换身份演示：</span>
        <div className="flex items-center gap-1">
          {(['GUEST', 'ENTHUSIAST', 'MASTER', 'YINSHAN'] as MemberTierLevel[]).map((t) => (
            <button
              key={t}
              onClick={() => setUserTier(t)}
              className={`px-2 py-1 rounded-lg text-[10px] font-oriental-serif transition-all ${
                userTier === t
                  ? 'bg-[#232B26] text-white font-bold shadow-xs'
                  : 'text-[#6A6458] hover:bg-white/60'
              }`}
            >
              {TIER_CONFIGS[t].name}
            </button>
          ))}
        </div>
      </div>

      {/* VIP Luxury Oriental Member Card (Inspired by Reference IMG_6488 & IMG_6490) */}
      <div className="relative rounded-3xl p-6 text-[#FAF8F5] overflow-hidden shadow-xl border border-[#3E4A40] bg-gradient-to-br from-[#1C2621] via-[#24332B] to-[#151D18] select-none">
        {/* Subtle Watermark Landscape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none overflow-hidden">
          <img
            src="/assets/aistudio/IMG_6488_a1ec8e50.JPG"
            alt="watermark"
            className="w-full h-full object-cover mix-blend-screen scale-150"
          />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-oriental-serif text-xs tracking-widest text-[#D8C496]">
                  春城嘉叶 · 席主名签
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#E8DFC9] border border-white/20">
                  {currentConfig.enTitle}
                </span>
              </div>
              <h2 className="font-oriental-serif text-2xl font-bold tracking-widest mt-1 text-white">
                林清羽
              </h2>
            </div>

            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#D8C496] transition-colors"
              title="出示到店品鉴码"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          {/* QR Popup */}
          {showQR && (
            <div className="p-3 bg-white text-[#232B26] rounded-xl flex items-center justify-between text-xs animate-in fade-in">
              <div className="space-y-0.5">
                <span className="font-bold font-oriental-serif">贵宾核验身份码</span>
                <span className="text-[10px] text-[#716A5D] block">到店扫码即刻锁定私享茶席</span>
              </div>
              <div className="w-12 h-12 bg-black/10 rounded-md flex items-center justify-center font-mono text-[9px] text-center p-1">
                CCJY-VIP-786
              </div>
            </div>
          )}

          {/* Assets: Leaf Points & CHÁ Tokens */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/15">
            <div>
              <span className="text-[10px] text-[#A6A092] tracking-wider uppercase font-mono block">
                LEAF POINTS / 积蓄叶值
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-2xl font-bold text-[#EFECE3]">
                  {leafPoints.toLocaleString()}
                </span>
                <span className="text-xs text-[#C8C2B3]">点</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-[#A6A092] tracking-wider uppercase font-mono block">
                CHÁ TOKEN / 茗元代币
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-2xl font-bold text-[#D8C496]">
                  {chaTokens.toLocaleString()}
                </span>
                <span className="text-xs text-[#D8C496]">茗元</span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-[#B0AA9D] font-mono">
              <span>当前身份：{currentConfig.name}</span>
              <span>距离下阶需 {nextTierPoints.toLocaleString()} 叶值</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8F733E] to-[#D8C496] rounded-full transition-all duration-500"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
          </div>
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
            onClick={() => onOpenResume?.('consignments')}
            className="w-full py-2.5 flex items-center justify-between hover:bg-[#FAF8F5] px-1 rounded-xl transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-[#6D675B]" />
              <span className="text-[#6D675B]">已鉴藏入库流转名物</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-medium text-[#232B26]">1 件 (96年纯干仓生普)</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#B2ABA0]" />
            </div>
          </button>
        </div>
      </div>

      {/* Tier Privileges Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#8F733E]" />
          <h2 className="font-oriental-serif text-sm font-bold text-[#232B26]">
            春城嘉叶茶人等阶与特权细则
          </h2>
        </div>

        <div className="space-y-2">
          {(['GUEST', 'ENTHUSIAST', 'MASTER', 'YINSHAN'] as MemberTierLevel[]).map((t) => {
            const conf = TIER_CONFIGS[t];
            const isCurrent = userTier === t;
            return (
              <div
                key={t}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[#F4F1E8] border-[#8F733E] shadow-xs'
                    : 'bg-white border-[#ECE6DB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-oriental-serif font-bold text-xs text-[#202723]">
                      {conf.name} · {conf.enTitle}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-[#232B26] text-white text-[9px] font-mono">
                        当前
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-[#8F733E]">
                    {conf.discountRate > 0 ? `${Math.round((1 - conf.discountRate) * 10)}折特惠` : '基准礼遇'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {conf.privileges.map((p, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-[#696357] bg-[#EFECE3]/70 px-2 py-0.5 rounded-md"
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

      {/* Brand Profile & Contact Section */}
      <div className="bg-[#FAF7F0] rounded-3xl p-5 border border-[#E5DECD] space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#ECE4D4] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-[#232B26] text-[#FAF8F5] flex items-center justify-center font-oriental-serif font-bold text-xs">
              嘉
            </div>
            <div>
              <h3 className="font-oriental-serif text-xs font-bold text-[#1E2320]">
                春城嘉叶（深圳）茶业有限公司
              </h3>
              <span className="text-[9px] font-mono text-[#8C8576] block">
                CHUN CHENG JIA YE · 品牌档案
              </span>
            </div>
          </div>
          <span className="text-[10px] font-oriental-serif px-2 py-0.5 rounded-full bg-[#EAE2D2] text-[#635B4E]">
            品牌认证
          </span>
        </div>

        <p className="text-xs font-oriental-serif text-[#4B4438] italic leading-relaxed text-center py-1">
          「一叶有来处，一器有分寸。」
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-[#635D50]">
          <div className="p-2.5 bg-white/70 rounded-xl border border-[#ECE5D7]">
            <span className="text-[10px] text-[#8C8576] block">办公驻地</span>
            <span className="font-medium text-[#202723]">深圳市南山区</span>
          </div>
          <div className="p-2.5 bg-white/70 rounded-xl border border-[#ECE5D7]">
            <span className="text-[10px] text-[#8C8576] block">官方专线</span>
            <span className="font-mono text-[#202723]">13825293242</span>
          </div>
          <div className="p-2.5 bg-white/70 rounded-xl border border-[#ECE5D7]">
            <span className="text-[10px] text-[#8C8576] block">官方网站</span>
            <span className="font-mono text-[10px] text-[#8F733E] break-all">chunchengjiaye.com</span>
          </div>
          <div className="p-2.5 bg-white/70 rounded-xl border border-[#ECE5D7]">
            <span className="text-[10px] text-[#8C8576] block">抖音与寄售</span>
            <span className="text-[10px] text-[#202723]">tiantian19860309 / 闲鱼</span>
          </div>
        </div>
      </div>
    </div>
  );
};
