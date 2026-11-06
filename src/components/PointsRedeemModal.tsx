import React, { useState } from 'react';
import { X, Gift, Sparkles, CheckCircle2, FileCheck2 } from 'lucide-react';
import { PointsItem, POINTS_ITEMS } from '../data/mockData';
import { zenAudio } from '../utils/audioZen';

interface PointsRedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  leafPoints: number;
  chaTokens: number;
  onRedeem: (item: PointsItem, costPoints: number) => void;
  onOpenResumeOrders?: () => void;
}

const FALLBACK_GIFT_IMG = '/assets/aistudio/IMG_6489_3dbe7626.JPG';

export const PointsRedeemModal: React.FC<PointsRedeemModalProps> = ({
  isOpen,
  onClose,
  leafPoints,
  chaTokens,
  onRedeem,
  onOpenResumeOrders,
}) => {
  const [successItem, setSuccessItem] = useState<PointsItem | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRedeemItem = (item: PointsItem) => {
    if (leafPoints < item.pointsRequired) {
      setWarningMessage(
        `当前叶值不足：兑换需要 ${item.pointsRequired.toLocaleString()} 叶值，您尚有 ${leafPoints.toLocaleString()} 叶值`
      );
      setTimeout(() => setWarningMessage(null), 3000);
      return;
    }
    zenAudio.playZenChime();
    onRedeem(item, item.pointsRequired);
    setSuccessItem(item);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#E4DEC9] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ECE7DD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#8F733E]" />
            <span className="font-oriental-serif font-bold text-sm text-[#1E2320]">
              叶值积分兑换礼遇
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 text-[#5A544A]"
            aria-label="关闭积分兑换"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner if any */}
        {warningMessage && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-[#FFF6E5] border border-[#F3D79B] text-xs text-[#8A5A12] flex items-center justify-between animate-in fade-in duration-150">
            <span>{warningMessage}</span>
            <button
              type="button"
              onClick={() => setWarningMessage(null)}
              className="text-xs text-[#8A5A12] hover:underline ml-2"
            >
              关闭
            </button>
          </div>
        )}

        {/* User Balance Overview */}
        <div className="bg-[#F2ECE1] p-4 m-5 mb-0 rounded-2xl border border-[#E0D7C5] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#817A6F] block tracking-wider uppercase font-mono">
              AVAILABLE ASSETS
            </span>
            <div className="flex items-baseline gap-3 mt-0.5">
              <div>
                <span className="font-mono text-xl font-bold text-[#232B26]">
                  {leafPoints.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#5A5448] ml-1">叶值</span>
              </div>
              <span className="text-[#BEB7A9]">|</span>
              <div>
                <span className="font-mono text-base font-bold text-[#8F733E]">
                  {chaTokens.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#7E6637] ml-1">嘉叶币</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#7E776C] bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#DBD4C3] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#8F733E]" />
            <span>日常朝夕点茶可获叶值</span>
          </div>
        </div>

        {/* Success Banner with Direct Link to Tea Resume Orders */}
        {successItem && (
          <div className="mx-5 mt-4 p-4 bg-[#EAF4ED] border border-[#C5DEC9] rounded-2xl space-y-2.5 text-[#2B603B] text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-oriental-serif font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>已成功兑换「{successItem.name}」并生成发货履历单！</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessItem(null)}
                className="text-[11px] text-[#4C7A5A] hover:underline"
              >
                收起
              </button>
            </div>
            <p className="text-[11px] text-[#456B50] leading-relaxed">
              该礼遇已自动入库至您的「茶事履历 — 已入囊商品订单」，并附赠 +1 嘉叶币流转激励。
            </p>
            {onOpenResumeOrders && (
              <button
                type="button"
                onClick={() => {
                  setSuccessItem(null);
                  onClose();
                  onOpenResumeOrders();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#232B26] text-white text-xs font-oriental-serif flex items-center gap-1.5 shadow-2xs hover:bg-black transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-[#D8C496]" />
                <span>前往茶事履历查看兑换订单</span>
              </button>
            )}
          </div>
        )}

        {/* Items Grid */}
        <div className="p-5 space-y-3">
          {POINTS_ITEMS.map((item) => {
            const canAfford = leafPoints >= item.pointsRequired;
            return (
              <div
                key={item.id}
                className="flex gap-3 bg-white p-3.5 rounded-2xl border border-[#ECE7DC] shadow-xs items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_GIFT_IMG;
                  }}
                  className="w-18 h-18 rounded-xl object-cover bg-black/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold font-oriental-serif text-[#222825] truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[#7D766A] mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-mono text-sm font-bold text-[#8F733E]">
                      {item.pointsRequired.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#938C7F]">叶值</span>
                    <span className="text-[10px] text-[#A6A094] line-through">
                      市价 ¥{item.marketValue}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRedeemItem(item)}
                  disabled={!canAfford}
                  className={`px-3.5 py-2 rounded-xl text-xs font-oriental-serif tracking-wider shrink-0 transition-all active:scale-[0.98] ${
                    canAfford
                      ? 'bg-[#232B26] hover:bg-[#181E1A] text-white shadow-xs'
                      : 'bg-[#EAE6DD] text-[#9E978B] cursor-not-allowed'
                  }`}
                >
                  {canAfford ? '立即兑换' : '叶值不足'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
