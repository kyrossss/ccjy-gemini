import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  FileCheck2,
} from 'lucide-react';
import { ConsignmentItem } from '../data/mockData';
import {
  MemberTierLevel,
  calculateConsignmentBreakdown,
  calculateDiscountedPrice,
  TIER_CONFIGS,
} from '../utils/teaLogic';
import { zenAudio } from '../utils/audioZen';

interface ConsignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: ConsignmentItem | null;
  mode: 'view' | 'submit';
  userTier: MemberTierLevel;
  onSubmitConsignment: (newItem: ConsignmentItem) => void;
  onAddToCartConsignment?: (item: ConsignmentItem) => void;
  onDirectAcquireConsignment?: (item: ConsignmentItem) => void;
  onOpenResumeOrders?: () => void;
}

const FALLBACK_CONSIGN_IMAGE = '/assets/aistudio/IMG_6487_f774f6f1.JPG';

export const ConsignmentModal: React.FC<ConsignmentModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  mode: initialMode,
  userTier,
  onSubmitConsignment,
  onAddToCartConsignment,
  onDirectAcquireConsignment,
  onOpenResumeOrders,
}) => {
  const [mode, setMode] = useState<'view' | 'submit'>(initialMode);

  // Form State for "我要寄售"
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'tea' | 'teapot' | 'antique'>('teapot');
  const [formPrice, setFormPrice] = useState(12000);
  const [formCondition, setFormCondition] = useState('全品相，包浆自然，附原装梧桐木盒');
  const [formProvenance, setFormProvenance] = useState(
    '2015年购于宜兴名师专场，入藏春城嘉叶恒温茶仓，出水极畅。'
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [inquireSuccess, setInquireSuccess] = useState(false);
  const [addedToBagFeedback, setAddedToBagFeedback] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setInquireSuccess(false);
    setAddedToBagFeedback(false);
  }, [initialMode, selectedItem, isOpen]);

  if (!isOpen) return null;

  const tierConfig = TIER_CONFIGS[userTier];
  const breakdown = calculateConsignmentBreakdown(formPrice, userTier);
  const discountedPrice = selectedItem
    ? calculateDiscountedPrice(selectedItem.currentPrice, userTier)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    zenAudio.playZenChime();
    const newItem: ConsignmentItem = {
      id: `csg-${Date.now()}`,
      name: formName.trim(),
      enName: 'Verified Consignment Item',
      category: formCategory,
      currentPrice: formPrice,
      originalEstimate: Math.round(formPrice * 1.1),
      sellerName: '当前会员',
      sellerTier: tierConfig.name,
      appraisalOrg: '春城嘉叶茶物美学品鉴委员会 & 东方鉴藏组',
      certificateNo: `CCJY-CSG-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'active',
      warehouseLocation: '春城嘉叶恒温恒氧专业母仓 (预留流转席)',
      condition: formCondition,
      image:
        formCategory === 'teapot'
          ? '/assets/aistudio/IMG_6487_f774f6f1.JPG'
          : formCategory === 'tea'
          ? '/assets/aistudio/IMG_6489_3dbe7626.JPG'
          : '/assets/aistudio/IMG_6490_7c61932b.JPG',
      provenance: formProvenance,
      views: 12,
      bidsCount: 0,
    };

    onSubmitConsignment(newItem);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setFormName('');
      onClose();
    }, 1600);
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
        {/* Header Tabs */}
        <div className="px-6 py-4 border-b border-[#ECE7DD] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMode('view')}
              className={`text-xs font-oriental-serif pb-1 transition-all ${
                mode === 'view'
                  ? 'border-b-2 border-[#232B26] font-bold text-[#1E2320]'
                  : 'text-[#8C867B] hover:text-[#232B26]'
              }`}
            >
              名物溯源鉴藏证书
            </button>
            <button
              type="button"
              onClick={() => setMode('submit')}
              className={`text-xs font-oriental-serif pb-1 transition-all ${
                mode === 'submit'
                  ? 'border-b-2 border-[#232B26] font-bold text-[#1E2320]'
                  : 'text-[#8C867B] hover:text-[#232B26]'
              }`}
            >
              发起名物寄售流转
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 text-[#5A544A]"
            aria-label="关闭寄售"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {mode === 'view' ? (
          /* View Certificate Mode */
          <div className="p-6 space-y-5">
            {selectedItem ? (
              <>
                {/* Traditional Oriental Authentication Certificate Style */}
                <div className="p-5 rounded-2xl bg-[#F4F0E6] border border-[#DDD5C2] relative overflow-hidden space-y-4">
                  {/* Watermark / Seal */}
                  <div className="absolute top-3 right-3 w-16 h-16 rounded-full border-2 border-[#B23A2B]/40 flex items-center justify-center text-[#B23A2B]/40 font-oriental-serif text-xs -rotate-12 pointer-events-none select-none">
                    {selectedItem.status === 'sold' || inquireSuccess ? '已结藏' : '嘉叶保真'}
                  </div>

                  <div className="flex items-center justify-between border-b border-[#D6CDBC] pb-3">
                    <div>
                      <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block">
                        CERTIFICATE OF PROVENANCE
                      </span>
                      <h3 className="font-oriental-serif text-base font-bold text-[#232B26] tracking-wide">
                        春城嘉叶名物流转鉴藏证书
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#8F733E]">
                      {selectedItem.certificateNo}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_CONSIGN_IMAGE;
                      }}
                      className="w-24 h-24 rounded-xl object-cover bg-black/10 shrink-0 border border-[#DED5C3]"
                    />
                    <div className="space-y-1 text-xs">
                      <h4 className="font-oriental-serif text-sm font-bold text-[#1E2320]">
                        {selectedItem.name}
                      </h4>
                      <p className="text-[11px] text-[#7A7468]">
                        品相评级：
                        <span className="text-[#202723] font-medium">{selectedItem.condition}</span>
                      </p>
                      <p className="text-[11px] text-[#7A7468]">
                        仓储履历：
                        <span className="text-[#202723]">{selectedItem.warehouseLocation}</span>
                      </p>
                      <p className="text-[11px] text-[#7A7468]">
                        送鉴委托：
                        <span className="text-[#8F733E] font-medium">
                          {selectedItem.sellerName} · {selectedItem.sellerTier}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D6CDBC] text-xs text-[#5C5549] leading-relaxed">
                    <span className="font-medium text-[#2A332E] block mb-1">
                      流转流派与源流题记：
                    </span>
                    {selectedItem.provenance}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#868074]">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#2E6840]" />
                      <span>{selectedItem.appraisalOrg}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-[#232B26]" />
                      <span className="font-mono">区块链防伪核验</span>
                    </div>
                  </div>
                </div>

                {/* Added to Cart Toast Feedback */}
                {addedToBagFeedback && (
                  <div className="p-3 rounded-2xl bg-[#FAF5E8] border border-[#E3D3B2] flex items-center justify-between text-xs text-[#735A2B] animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 font-oriental-serif">
                      <CheckCircle2 className="w-4 h-4 text-[#8F733E]" />
                      <span>已将该典藏孤品收入茶囊，可合并结算或使用茗元抵扣</span>
                    </div>
                  </div>
                )}

                {/* Inquiry / Direct Acquisition Closed-Loop Feedback or Action */}
                {inquireSuccess || selectedItem.status === 'sold' ? (
                  <div className="bg-[#EBF3ED] border border-[#C5DAC9] p-4 rounded-2xl space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#2F6740] font-oriental-serif font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#2F6740]" />
                        <span>
                          {inquireSuccess
                            ? `已为您的【${tierConfig.name}】席位完成专席认藏入库`
                            : '该典藏名物已由藏家认领结缘'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-white/80 text-[#2F6740] px-2 py-0.5 rounded-full border border-[#BBD4C0]">
                        母仓交割完毕
                      </span>
                    </div>
                    <p className="text-xs text-[#47604F] leading-relaxed">
                      鉴藏证书编号：
                      <span className="font-mono font-medium">{selectedItem.certificateNo}</span>
                      <br />
                      {inquireSuccess
                        ? '已同步生成保价特快调拨单并记入您的「茶事履历 — 商品订单」，附原装金石印章证书。'
                        : '实物已由春城嘉叶恒温母仓完成流转过户，证书档案永久存证。'}
                    </p>
                    {onOpenResumeOrders && (
                      <div className="pt-1 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenResumeOrders();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#232B26] text-white text-xs font-oriental-serif flex items-center gap-1.5 shadow-2xs hover:bg-black transition-colors"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-[#D8C496]" />
                          <span>前往茶事履历查验订单凭证</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Price & Dual Closed-Loop Purchase Actions */
                  <div className="pt-1 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-[#7B7569] block">
                          当前流转结席价 ({tierConfig.name}尊享礼遇)
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-mono text-2xl font-bold text-[#1F2522]">
                            ¥{discountedPrice.toLocaleString()}
                          </span>
                          {discountedPrice < selectedItem.currentPrice && (
                            <span className="font-mono text-xs text-[#9C9588] line-through">
                              原席价 ¥{selectedItem.currentPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#8F733E] bg-[#FAF5E8] px-2.5 py-1 rounded-lg border border-[#E6D7B9]">
                        认藏获赠 +{Math.floor(discountedPrice / 100)} 茗元
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          zenAudio.playZenChime();
                          onAddToCartConsignment?.(selectedItem);
                          setAddedToBagFeedback(true);
                        }}
                        className="h-11 rounded-xl bg-[#F3EFE7] hover:bg-[#E7E0D2] text-[#232B26] border border-[#D8CFC0] font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#8F733E]" />
                        <span>收入茶囊结缘</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          zenAudio.playZenChime();
                          onDirectAcquireConsignment?.(selectedItem);
                          setInquireSuccess(true);
                        }}
                        className="h-11 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm"
                      >
                        <span>立即专席认藏</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D8C496]" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 space-y-3">
                <p className="text-xs text-[#7A7469] font-oriental-serif">
                  请在寄售列表选择具体的品物查看流转证书，或直接发起新藏品寄售
                </p>
                <button
                  type="button"
                  onClick={() => setMode('submit')}
                  className="px-4 py-2 rounded-xl bg-[#232B26] text-white text-xs font-oriental-serif"
                >
                  发起名物寄售流转
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Submit Consignment Form */
          <div className="p-6">
            {isSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EBF3ED] text-[#2F6740] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-oriental-serif text-xl font-bold text-[#1E2320]">
                  寄售流转已提交入库
                </h3>
                <p className="text-xs text-[#6F695E] leading-relaxed max-w-xs mx-auto">
                  专属品鉴师已受理并生成防伪证书，该名物已同步展示于流转大堂与您的「茶事履历 — 流转名物」中。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                    品物类别
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'teapot', label: '名家手拉朱泥壶' },
                      { id: 'tea', label: '干仓年份老茶' },
                      { id: 'antique', label: '传世器物古董' },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setFormCategory(cat.id as 'tea' | 'teapot' | 'antique')}
                        className={`py-2 px-2 rounded-xl text-xs font-oriental-serif border transition-all text-center ${
                          formCategory === cat.id
                            ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26]'
                            : 'bg-white text-[#5F584C] border-[#DED7C7] hover:border-[#232B26]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                    器物或茶叶全称
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="例如：2008年老班章大树生普 / 惠孟臣制古朱泥壶"
                    className="w-full text-xs bg-white rounded-xl px-3 py-2.5 border border-[#DBD4C5] text-[#29322D] focus:outline-none focus:border-[#232B26]"
                  />
                </div>

                <div>
                  <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                    拟流转价格 (¥ 人民币)
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full font-mono text-sm bg-white rounded-xl px-3 py-2 border border-[#DBD4C5] text-[#29322D] focus:outline-none focus:border-[#232B26]"
                  />
                </div>

                {/* Instant Calculation Preview */}
                <div className="bg-[#F3EFE7] p-3.5 rounded-2xl border border-[#DDD6C5] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#686053]">
                    <span>
                      平台流转品鉴服务费 ({Math.round(breakdown.platformFeeRate * 100)}%)
                    </span>
                    <span className="font-mono">¥{breakdown.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#242A27] font-semibold">
                    <span>成交后您实收款项</span>
                    <span className="font-mono text-sm">
                      ¥{breakdown.sellerReceives.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8F733E] pt-1 border-t border-[#DDD6C5]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      流转立享奖励 {breakdown.chaTokenReward} 茗元代币 (基于 {tierConfig.name} 权益)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                    品相描述与原包装
                  </label>
                  <input
                    type="text"
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value)}
                    className="w-full text-xs bg-white rounded-xl px-3 py-2 border border-[#DBD4C5] text-[#29322D] focus:outline-none focus:border-[#232B26]"
                  />
                </div>

                <div>
                  <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                    收藏流转历史渊源
                  </label>
                  <textarea
                    rows={2}
                    value={formProvenance}
                    onChange={(e) => setFormProvenance(e.target.value)}
                    className="w-full text-xs bg-white rounded-xl px-3 py-2 border border-[#DBD4C5] text-[#29322D] focus:outline-none focus:border-[#232B26]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
                >
                  <span>确认提交鉴藏入库</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
