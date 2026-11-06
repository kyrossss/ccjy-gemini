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
  Camera,
  Scan,
  Cpu,
  Coins,
  Upload,
  Info,
  TrendingUp,
} from 'lucide-react';
import { ConsignmentItem } from '../data/mockData';
import {
  MemberTierLevel,
  calculateConsignmentBreakdown,
  calculateDiscountedPrice,
  TIER_CONFIGS,
} from '../utils/teaLogic';
import { zenAudio } from '../utils/audioZen';
import { ConsignmentLifecycleTimeline } from './ConsignmentLifecycleTimeline';
import {
  requestAIConsignmentAppraisal,
  AIConsignmentAppraisalResult,
} from '../utils/aiConsignmentAppraisal';

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
  const [submitType, setSubmitType] = useState<'consign' | 'exchange'>('consign');

  // Form State for "我要寄售" / "茶器置换"
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

  // AI Smart Photo Appraisal State
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(
    '/assets/aistudio/IMG_6487_f774f6f1.JPG'
  );
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiAppraisal, setAiAppraisal] = useState<AIConsignmentAppraisalResult | null>(null);
  const [aiAppliedFeedback, setAiAppliedFeedback] = useState(false);

  const handleRunAiAppraisal = async (photoUrlToUse?: string) => {
    const url = photoUrlToUse || selectedPhotoUrl;
    setIsAiScanning(true);
    zenAudio.playZenChime();

    try {
      const result = await requestAIConsignmentAppraisal(url, formCategory, formProvenance);
      setAiAppraisal(result);
    } catch {
      // fallback handled inside requestAIConsignmentAppraisal
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleApplyAiAppraisal = () => {
    if (!aiAppraisal) return;
    zenAudio.playZenChime();
    setFormName(aiAppraisal.suggestedName);
    setFormCategory(aiAppraisal.detectedCategory);
    setFormPrice(aiAppraisal.priceRange.suggestedPrice);
    setFormCondition(aiAppraisal.conditionRating);
    setFormProvenance(
      `${aiAppraisal.material} · ${aiAppraisal.estimatedEra}。\n${aiAppraisal.craftsmanshipFeatures.join('；')}。`
    );
    setAiAppliedFeedback(true);
    setTimeout(() => setAiAppliedFeedback(false), 2500);
  };

  useEffect(() => {
    setMode(initialMode);
    setSubmitType('consign');
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

                {/* Provenance & Circulating Lifecycle Detailed Timeline */}
                <ConsignmentLifecycleTimeline
                  item={selectedItem}
                  defaultExpanded={true}
                  userTier={userTier}
                />

                {/* Added to Cart Toast Feedback */}
                {addedToBagFeedback && (
                  <div className="p-3 rounded-2xl bg-[#FAF5E8] border border-[#E3D3B2] flex items-center justify-between text-xs text-[#735A2B] animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 font-oriental-serif">
                      <CheckCircle2 className="w-4 h-4 text-[#8F733E]" />
                      <span>已将该典藏孤品收入茶囊，可合并结算或使用嘉叶币抵扣</span>
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
                        认藏获赠 +{Math.floor(discountedPrice / 100)} 嘉叶币
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
                        className="h-11 px-2.5 rounded-xl bg-[#F3EFE7] hover:bg-[#E7E0D2] text-[#232B26] border border-[#D8CFC0] font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] text-center whitespace-nowrap"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                        <span>收入茶囊结缘</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          zenAudio.playZenChime();
                          onDirectAcquireConsignment?.(selectedItem);
                          setInquireSuccess(true);
                        }}
                        className="h-11 px-2.5 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm text-center whitespace-nowrap"
                      >
                        <span>立即专席认藏</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D8C496] shrink-0" />
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
                  {submitType === 'exchange' ? '茶器置换申请已受理' : '寄售流转已提交入库'}
                </h3>
                <p className="text-xs text-[#6F695E] leading-relaxed max-w-xs mx-auto">
                  {submitType === 'exchange'
                    ? '专属品鉴师已受理您的茶器置换估值申请。完成实物复核后，净置换款将以嘉叶币全额返至您的账户，并即刻计入 +500 成长值！'
                    : '专属品鉴师已受理并生成一器一档防伪证书，该名物已同步展示于流转大堂与您的「茶事履历 — 流转名物」中。'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Dual Sub-Type Switcher: Consignment vs Utensil Exchange */}
                <div className="flex bg-[#EFECE3] p-1 rounded-2xl border border-[#DCD5C4]">
                  <button
                    type="button"
                    onClick={() => setSubmitType('consign')}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-oriental-serif transition-all text-center whitespace-nowrap ${
                      submitType === 'consign'
                        ? 'bg-[#232B26] text-[#FAF8F5] font-bold shadow-xs'
                        : 'text-[#6B6456] hover:text-[#232B26]'
                    }`}
                  >
                    典藏寄售 (二级流转)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmitType('exchange')}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-oriental-serif transition-all text-center whitespace-nowrap ${
                      submitType === 'exchange'
                        ? 'bg-[#8F733E] text-white font-bold shadow-xs'
                        : 'text-[#6B6456] hover:text-[#232B26]'
                    }`}
                  >
                    茶器置换 (以旧换新 · 返嘉叶币)
                  </button>
                </div>

                {/* AI Smart Photo Appraisal & Pricing Reference Section */}
                {/* AI Smart Photo Appraisal & Pricing Reference Section */}
                <div className="p-4 rounded-2xl bg-[#F6F2E8] border border-[#8F733E]/15 space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-[#232B26] text-[#EEDB9F] flex items-center justify-center shrink-0">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-oriental-serif text-xs font-bold text-[#232B26] truncate">
                          AI 智能照片鉴物 · 自动提炼属性与定价
                        </h4>
                        <p className="text-[10px] text-[#786F60] truncate font-light">
                          上传照片自动解析材质、年代与历史流转成交公允定价
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white text-[#8F733E] border border-[#8F733E]/20 leading-none whitespace-nowrap shrink-0">
                      Gemini 多模态
                    </span>
                  </div>

                  {/* Photo Presets & Current Image Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-oriental-serif text-[#6D6555] block">
                      选择器物实拍照片或点选茶席名物范例：
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        {
                          id: 'sample-pot',
                          label: '老朱泥梨皮壶',
                          url: '/assets/aistudio/IMG_6487_f774f6f1.JPG',
                        },
                        {
                          id: 'sample-tea',
                          label: '纯干仓八八青',
                          url: '/assets/aistudio/IMG_6492_3fd88e0f.JPG',
                        },
                        {
                          id: 'sample-cup',
                          label: '双描金白瓷杯',
                          url: '/assets/aistudio/IMG_6490_7c61932b.JPG',
                        },
                        {
                          id: 'sample-brick',
                          label: '原野熟普砖茶',
                          url: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
                        },
                      ].map((sample) => (
                        <button
                          type="button"
                          key={sample.id}
                          onClick={() => {
                            setSelectedPhotoUrl(sample.url);
                            handleRunAiAppraisal(sample.url);
                          }}
                          className={`relative rounded-xl overflow-hidden p-1 border text-left transition-all ${
                            selectedPhotoUrl === sample.url
                              ? 'border-[#232B26] ring-1 ring-[#232B26]/30 bg-white shadow-2xs'
                              : 'border-[#232B26]/[0.08] bg-white/70 hover:border-[#8F733E]'
                          }`}
                        >
                          <img
                            src={sample.url}
                            alt={sample.label}
                            className="w-full h-11 object-cover rounded-lg"
                          />
                          <span className="text-[9px] font-oriental-serif text-[#2B342F] block mt-0.5 truncate text-center">
                            {sample.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Run AI Identification Trigger */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isAiScanning}
                      onClick={() => handleRunAiAppraisal()}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#232B26] hover:bg-black text-[#FAF8F5] text-xs font-oriental-serif font-medium flex items-center justify-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 whitespace-nowrap text-center"
                    >
                      {isAiScanning ? (
                        <>
                          <Scan className="w-3.5 h-3.5 animate-spin text-[#EEDB9F] shrink-0" />
                          <span>正在解析胎土细砂与历史成交数据库...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-[#EEDB9F] shrink-0" />
                          <span>AI 智能识别鉴物与流转估价</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Recognition Result & Pricing Range Display */}
                  {aiAppraisal && (
                    <div className="p-3.5 rounded-xl bg-white border border-[#232B26]/[0.06] space-y-2.5 shadow-2xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6740] shrink-0" />
                          <span className="font-oriental-serif font-bold text-xs text-[#1E2320]">
                            识别成功 · 属性提炼报告
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8F733E] whitespace-nowrap">
                          匹配置信度 {aiAppraisal.confidenceScore}%
                        </span>
                      </div>

                      {/* Extracted Attributes Badges */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] text-[#847D70] shrink-0 font-mono">建议全称:</span>
                          <span className="font-oriental-serif font-bold text-[#1E2320]">
                            {aiAppraisal.suggestedName}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] text-[#847D70] shrink-0 font-mono">材质/原料:</span>
                          <span className="text-[11px] text-[#4E473C]">
                            {aiAppraisal.material}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] text-[#847D70] shrink-0 font-mono">预估年代:</span>
                          <span className="text-[11px] text-[#4E473C] font-mono">
                            {aiAppraisal.estimatedEra}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] text-[#847D70] shrink-0 font-mono">品相定级:</span>
                          <span className="text-[11px] text-[#2F6740] font-medium">
                            {aiAppraisal.conditionRating}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Range Benchmark Bar */}
                      <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#8F733E]/15 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-oriental-serif font-bold text-[#232B26] flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-[#8F733E] shrink-0" />
                            <span>历史流转公允定价区间</span>
                          </span>
                          <span className="text-[10px] font-mono text-[#8F733E] whitespace-nowrap">
                            建议挂牌: ¥{aiAppraisal.priceRange.suggestedPrice.toLocaleString()}
                          </span>
                        </div>

                        {/* Visual Range Slider */}
                        <div className="relative pt-1 pb-1">
                          <div className="h-2 rounded-full bg-[#E5DEC9] relative overflow-hidden">
                            <div className="absolute left-[15%] right-[15%] h-full bg-[#8F733E]/30 rounded-full" />
                          </div>
                          <div className="flex items-center justify-between text-[9px] font-mono text-[#7D7668] mt-1.5">
                            <span className="whitespace-nowrap">最低 ¥{aiAppraisal.priceRange.minPrice.toLocaleString()}</span>
                            <span className="font-bold text-[#1E2320] bg-white px-2 py-0.5 rounded-md border border-[#8F733E]/20 leading-none whitespace-nowrap">
                              中位建议 ¥{aiAppraisal.priceRange.suggestedPrice.toLocaleString()}
                            </span>
                            <span className="whitespace-nowrap">最高 ¥{aiAppraisal.priceRange.maxPrice.toLocaleString()}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-[#6E6657] font-light leading-relaxed">
                          {aiAppraisal.pricingRationale}
                        </p>
                      </div>

                      {/* One Click Apply Button */}
                      <button
                        type="button"
                        onClick={handleApplyAiAppraisal}
                        className="w-full py-1.5 rounded-xl bg-[#8F733E] hover:bg-[#785E2F] text-white text-xs font-oriental-serif font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#FFF2D6]" />
                        <span>一键采纳属性与建议价格 (¥{aiAppraisal.priceRange.suggestedPrice.toLocaleString()})</span>
                      </button>

                      {aiAppliedFeedback && (
                        <div className="text-center text-[11px] font-oriental-serif text-[#2F6740] animate-in fade-in">
                          ✓ 已为您自动填入品名、材质年代、品相描述与建议流转席价！
                        </div>
                      )}
                    </div>
                  )}
                </div>

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
                    {submitType === 'exchange' ? '拟置换茶器全称与堂号' : '器物或茶叶全称'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={
                      submitType === 'exchange'
                        ? '例如：吴瑞全手拉朱泥急须 / 孟臣小品壶'
                        : '例如：2008年老班章大树生普 / 惠孟臣制古朱泥壶'
                    }
                    className="w-full text-xs bg-white rounded-xl px-3 py-2.5 border border-[#DBD4C5] text-[#29322D] focus:outline-none focus:border-[#232B26]"
                  />
                </div>

                <div>
                  <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                    {submitType === 'exchange' ? '期望参考估值 (¥ 人民币)' : '拟流转售价 (¥ 人民币)'}
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

                {/* Calculation Preview for Consign vs Exchange */}
                {submitType === 'exchange' ? (
                  <div className="bg-[#FAF6EC] p-3.5 rounded-2xl border border-[#E8DFC9] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#7A6E5A]">
                      <span>参考估值折算嘉叶币 (100% 全额返还)</span>
                      <span className="font-mono text-[#8F733E] font-bold">
                        +{formPrice.toLocaleString()} 嘉叶币
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#242A27] font-semibold">
                      <span>履约奖励成长值</span>
                      <span className="font-mono text-xs text-[#285E37]">+500 成长值</span>
                    </div>
                    <div className="pt-1.5 border-t border-[#E8DFC9] text-[10px] text-[#786D5C] leading-relaxed">
                      ※ 春城嘉叶准则：净置换价全额以「嘉叶币」发放，仅用于在商城抵扣选购新名家壶与新茶，不提现不转让。置换本身不重复计入终身消费累计。
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F3EFE7] p-3.5 rounded-2xl border border-[#DDD6C5] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#686053]">
                      <span>
                        平台流转品鉴服务费 ({Math.round(breakdown.platformFeeRate * 100)}%)
                      </span>
                      <span className="font-mono">¥{breakdown.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#242A27] font-semibold">
                      <span>成交后您实收现金</span>
                      <span className="font-mono text-sm">
                        ¥{breakdown.sellerReceives.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8F733E] pt-1 border-t border-[#DDD6C5]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        流转立享空投 {breakdown.chaTokenReward} 嘉叶币 · 未成交不收取任何服务费
                      </span>
                    </div>
                  </div>
                )}

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
                  <span>
                    {submitType === 'exchange' ? '确认申请茶器置换 (+500成长值)' : '确认提交鉴藏寄售入库'}
                  </span>
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
