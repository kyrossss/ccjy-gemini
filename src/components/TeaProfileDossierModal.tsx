import React, { useState } from 'react';
import {
  X,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Calendar,
  Share2,
  ChevronDown,
  ChevronUp,
  Tag,
  Check,
  CheckCircle2,
  Flame,
  Award,
} from 'lucide-react';
import {
  PersonalTeaRadar,
  TeaProfileResult,
  AVAILABLE_TASTE_TAGS,
  generateCuratedTeaProfile,
  NicheTeaRecommendation,
} from '../utils/teaProfileLogic';
import { TeaProfileRadar } from './TeaProfileRadar';
import { TeaShareCardModal } from './TeaShareCardModal';
import {
  UserOrderRecord,
  extractAggregatedOrderReviews,
} from '../utils/orderResumeLogic';
import { TeaItem } from '../data/mockData';

interface TeaProfileDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  userOrders: UserOrderRecord[];
  customPalateTags?: string[] | null;
  onUpdateCustomPalateTags?: (tags: string[]) => void;
  onAddToCart: (item: TeaItem, quantity: number) => void;
  onSelectSalonTea?: (teaName: string) => void;
  userName?: string;
  userTierTitle?: string;
}

export const TeaProfileDossierModal: React.FC<TeaProfileDossierModalProps> = ({
  isOpen,
  onClose,
  userOrders,
  customPalateTags,
  onUpdateCustomPalateTags,
  onAddToCart,
  onSelectSalonTea,
  userName = '林清羽',
  userTierTitle = '掌席茶人 · MASTER',
}) => {
  // Extract user orders and aggregated reviews for profile analysis
  const orderItems = userOrders.flatMap((o) => o.items);
  const aggregatedReviews = extractAggregatedOrderReviews(userOrders);
  const effectiveSeedTags =
    customPalateTags && customPalateTags.length > 0
      ? customPalateTags
      : aggregatedReviews.reviewTags;

  // Selected tags state (seeded from user's custom tags or actual order reviews)
  const [selectedTags, setSelectedTags] = useState<string[]>(effectiveSeedTags);

  // Profile result state
  const [profile, setProfile] = useState<TeaProfileResult>(() =>
    generateCuratedTeaProfile(orderItems, aggregatedReviews.reviewNotes, effectiveSeedTags)
  );

  // Automatically sync when userOrders or customPalateTags change
  React.useEffect(() => {
    const latestItems = userOrders.flatMap((o) => o.items);
    const latestAgg = extractAggregatedOrderReviews(userOrders);
    const activeTags =
      customPalateTags && customPalateTags.length > 0
        ? customPalateTags
        : latestAgg.reviewTags;
    setSelectedTags(activeTags);
    setProfile(
      generateCuratedTeaProfile(latestItems, latestAgg.reviewNotes, activeTags)
    );
  }, [userOrders, customPalateTags, isOpen]);

  const [isLoading, setIsLoading] = useState(false);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [addedTeaId, setAddedTeaId] = useState<string | null>(null);

  // 轻量级平滑动效：模态框打开时评分从零增长至当前分值 (0 -> 1 count-up)
  const [scoreProgress, setScoreProgress] = useState(0);

  React.useEffect(() => {
    if (!isOpen) {
      setScoreProgress(0);
      return;
    }
    setScoreProgress(0);
    const start = performance.now();
    const duration = 850; // ms
    let animId: number;

    const step = (timestamp: number) => {
      const elapsed = timestamp - start;
      const t = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setScoreProgress(eased);
      if (t < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle tag in preference list
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        if (prev.length <= 1) return prev; // Keep at least one tag
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Re-analyze profile via server API (with fallback) and persist custom palate tags
  const handleReanalyze = async (tagsToUse: string[] = selectedTags) => {
    setIsLoading(true);
    onUpdateCustomPalateTags?.(tagsToUse);
    try {
      const response = await fetch('/api/tea-profile/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orders: orderItems,
          reviews:
            aggregatedReviews.reviewNotes.length > 0
              ? aggregatedReviews.reviewNotes
              : [
                  '水仙焙火沉厚，青苔木质香极沉，耐泡度高',
                  '单丛滚水急出，栀子花香高锐，舌底生津迅疾',
                ],
          tastingTags: tagsToUse,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setProfile(json.data);
          setIsLoading(false);
          return;
        }
      }
      // Fallback
      setProfile(generateCuratedTeaProfile(orderItems, aggregatedReviews.reviewNotes, tagsToUse));
    } catch {
      setProfile(generateCuratedTeaProfile(orderItems, aggregatedReviews.reviewNotes, tagsToUse));
    } finally {
      setIsLoading(false);
    }
  };

  // One-click Add Niche Tea sample to cart
  const handleAddNicheToCart = (tea: NicheTeaRecommendation) => {
    const mockItem: TeaItem = {
      id: tea.id,
      name: tea.name,
      enName: tea.subCategory,
      category: 'tea',
      subCategory: tea.subCategory,
      price: tea.price,
      image: tea.image,
      tagline: `${tea.origin} · ${tea.sampleSpec}`,
      description: tea.matchReason,
      origin: tea.origin,
      specs: [
        { label: '规格', value: tea.sampleSpec },
        { label: '稀缺度', value: tea.rarity },
        { label: '契合度', value: `${tea.matchScore}%` },
      ],
      inStock: true,
    };

    onAddToCart(mockItem, 1);
    setAddedTeaId(tea.id);
    setTimeout(() => setAddedTeaId(null), 2500);
  };

  // Jump to Salon Reservation with tea preselected
  const handleBookSalonWithTea = (tea: NicheTeaRecommendation) => {
    if (onSelectSalonTea) {
      onSelectSalonTea(tea.name);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-[#FAF8F3] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-[#DCD5C4] overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#ECE5D7] bg-white flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E]" />
                <span className="text-[10px] font-mono tracking-widest text-[#847E72] uppercase font-bold">
                  AI TEA CHARACTER DOSSIER
                </span>
              </div>
              <h2 className="font-oriental-serif text-lg font-bold text-[#1E2320]">
                个人茶性档案 · 偏好雷达
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReanalyze()}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-xl bg-[#FAF6EE] hover:bg-[#F2ECE1] border border-[#E2DBD0] text-[#8F733E] text-xs font-oriental-serif flex items-center gap-1 transition-all disabled:opacity-50"
                title="重新由AI解构分析"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">重新解构</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#6D675B] hover:bg-[#F0ECE1] transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* 1. Persona & Poetic Vision Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#24312A] via-[#1D2721] to-[#161E1A] text-[#FAF8F5] shadow-lg border border-[#3E4D43] relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none w-36 h-36 overflow-hidden">
                <img
                  src="/assets/aistudio/IMG_6490_7c61932b.JPG"
                  alt="bg-seal"
                  className="w-full h-full object-cover scale-150 mix-blend-screen"
                />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-oriental-serif text-xs text-[#D8C496] tracking-wider">
                      春城嘉叶 · 茶道基因解构
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#E8DFC9] border border-white/20">
                      {userName}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI 深度研判
                  </span>
                </div>

                <div>
                  <h3 className="font-oriental-serif text-2xl font-bold tracking-wider text-white">
                    {profile.characterTitle}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#8F733E]/30 border border-[#D8C496]/40 text-[#E8DFC9] text-xs font-oriental-serif">
                    <Award className="w-3 h-3 text-[#D8C496]" />
                    <span>{profile.characterBadge}</span>
                  </div>
                </div>

                <p className="text-xs text-[#C8C2B3] font-oriental-serif italic leading-relaxed pt-2 border-t border-white/10">
                  「{profile.philosophy}」
                </p>

                {profile.tastingAdvice && (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#D4CDBC] flex items-start gap-2">
                    <Flame className="w-3.5 h-3.5 text-[#D8C496] shrink-0 mt-0.5" />
                    <span>{profile.tastingAdvice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Radar Chart Visualization */}
            <div className="bg-white rounded-3xl p-5 border border-[#232B26]/[0.06] shadow-xs flex flex-col items-center text-center">
              <div className="w-full flex items-center justify-between mb-2">
                <div className="text-left space-y-0.5">
                  <h3 className="font-oriental-serif text-sm font-bold text-[#1E2320] cjk-title">
                    东方工夫茶五维图谱
                  </h3>
                  <span className="text-[10px] text-[#8C8578] font-mono block">
                    ROAST · AROMA · SWEETNESS · BODY · THROAT
                  </span>
                </div>
                <span className="text-[10px] font-oriental-serif px-2.5 py-0.5 rounded-full bg-[#FAF5E8] text-[#8F733E] border border-[#8F733E]/20 leading-none whitespace-nowrap shrink-0 shadow-2xs">
                  可点击顶点查看释义
                </span>
              </div>

              {/* Animated Radar growing from zero to full values on open */}
              <TeaProfileRadar
                radar={{
                  roast: Math.round(profile.radar.roast * scoreProgress),
                  aroma: Math.round(profile.radar.aroma * scoreProgress),
                  sweetness: Math.round(profile.radar.sweetness * scoreProgress),
                  mouthfeel: Math.round(profile.radar.mouthfeel * scoreProgress),
                  throatCharm: Math.round(profile.radar.throatCharm * scoreProgress),
                }}
                size={270}
                interactive={true}
              />

              <div className="w-full pt-3 mt-2 border-t border-[#232B26]/[0.06] flex items-center justify-between text-xs gap-2">
                <span className="text-[11px] text-[#787163] font-oriental-serif truncate">
                  将五维雷达图与 AI 心情诗词合成为社交藏卡
                </span>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF5E8] hover:bg-[#F1E5CC] text-[#8F733E] border border-[#8F733E]/20 font-oriental-serif text-xs font-bold flex items-center gap-1 transition-colors leading-none shrink-0 whitespace-nowrap"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>生成雅致茶语海报</span>
                </button>
              </div>
            </div>

            {/* 3. Taste Preference Tuning Panel (User can toggle and re-analyze) */}
            <div className="bg-white rounded-3xl p-4 border border-[#ECE5D7] shadow-xs space-y-3">
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#8F733E]" />
                  <h3 className="font-oriental-serif text-xs font-bold text-[#202723]">
                    微调我的舌尖口感偏好
                  </h3>
                  <span className="text-[10px] text-[#8C8578] font-mono">
                    ({selectedTags.length} 个活跃标签)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#8F733E] font-oriental-serif">
                  <span>{isTagsExpanded ? '收起' : '展开微调'}</span>
                  {isTagsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </div>

              {isTagsExpanded ? (
                <div className="space-y-3 pt-2 border-t border-[#F0ECE1] animate-in fade-in">
                  <p className="text-[11px] text-[#787163]">
                    点击增减您所追求的茶汤特质，系统将即时调校您的五维雷达图与推荐好茶：
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set([...AVAILABLE_TASTE_TAGS, ...selectedTags])).map((tag) => {
                      const isActive = selectedTags.includes(tag);
                      const isCustom = !AVAILABLE_TASTE_TAGS.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => handleToggleTag(tag)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-oriental-serif transition-all flex items-center gap-1 ${
                            isActive
                              ? 'bg-[#232B26] text-white font-bold shadow-xs'
                              : 'bg-[#F5F2EA] text-[#635C50] hover:bg-[#EAE4D6]'
                          }`}
                        >
                          {isActive && <Check className="w-3 h-3 text-emerald-400" />}
                          <span>{isCustom ? `✦ ${tag}` : tag}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleReanalyze(selectedTags)}
                    disabled={isLoading}
                    className="w-full py-2 bg-[#8F733E] hover:bg-[#7D6435] text-white rounded-xl text-xs font-oriental-serif font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>依据选定标签重构档案</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-[#FAF6EE] text-[#716A5C] text-[10px] font-oriental-serif border border-[#E8E1D3]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Niche Rare Teas AI Recommendations */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-oriental-serif text-sm font-bold text-[#1E2320]">
                    AI 专属匹配 · 冷门小众名枞
                  </h3>
                  <span className="text-[10px] text-[#8C8578] font-mono block">
                    EXCLUSIVE ARTISANAL & BOUTIQUE RARE TEAS
                  </span>
                </div>
                <span className="text-[10px] font-oriental-serif text-[#2C5F3F] bg-[#EAF2EC] px-2 py-0.5 rounded-full font-bold">
                  小产区臻萃
                </span>
              </div>

              <div className="space-y-3">
                {profile.recommendedTeas.map((tea) => {
                  const isJustAdded = addedTeaId === tea.id;
                  return (
                    <div
                      key={tea.id}
                      className="bg-white rounded-2xl p-4 border border-[#ECE5D7] shadow-xs space-y-3 hover:border-[#8F733E] transition-all"
                    >
                      <div className="flex gap-3">
                        {/* Tea Image */}
                        <div className="w-18 h-18 rounded-xl overflow-hidden shrink-0 border border-[#ECE5D7]">
                          <img
                            src={tea.image}
                            alt={tea.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-mono text-[#8F733E] font-medium block whitespace-nowrap">
                              {tea.subCategory}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#FAF5E8] border border-[#8F733E]/20 text-[#8F733E] font-mono font-bold text-[10px] leading-none whitespace-nowrap shrink-0 shadow-2xs">
                              契合度 {Math.round(tea.matchScore * scoreProgress)}%
                            </span>
                          </div>

                          <h4 className="font-oriental-serif font-bold text-sm text-[#202723] cjk-title">
                            {tea.name}
                          </h4>

                          <div className="text-[10px] text-[#7A7365] flex items-center gap-1.5 flex-wrap">
                            <span>{tea.origin}</span>
                            <span className="text-[#C5BEAF]">·</span>
                            <span className="text-[#AF3828] font-medium">{tea.rarity}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Matching Reason */}
                      <div className="p-2.5 rounded-xl bg-[#FAF8F3] border border-[#EDE7DB] text-xs text-[#595245] leading-relaxed">
                        <span className="font-oriental-serif font-bold text-[#8F733E] mr-1">
                          【AI 品鉴解析】：
                        </span>
                        {tea.matchReason}
                      </div>

                      {/* Tasting Notes */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {tea.tastingNotes.map((note) => (
                          <span
                            key={note}
                            className="px-2 py-0.5 rounded-md bg-[#F4F1E9] text-[10px] font-oriental-serif text-[#686154]"
                          >
                            {note}
                          </span>
                        ))}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[10px] text-[#AF3828]">¥</span>
                            <span className="font-mono text-base font-bold text-[#AF3828]">
                              {tea.price}
                            </span>
                          </div>
                          <span className="text-[9px] text-[#918B7E] font-mono block">
                            {tea.sampleSpec}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBookSalonWithTea(tea)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#FAF5E8] hover:bg-[#F0E8D4] text-[#8F733E] border border-[#E3D6BC] text-xs font-oriental-serif transition-colors flex items-center gap-1"
                            title="前往茶室预约专属试饮"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>茶室试饮</span>
                          </button>

                          <button
                            onClick={() => handleAddNicheToCart(tea)}
                            className="px-3 py-1.5 rounded-xl bg-[#232B26] hover:bg-[#344038] text-white text-xs font-oriental-serif font-bold transition-all flex items-center gap-1 shadow-xs"
                          >
                            {isJustAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>已加购</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>加购尝鲜装</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Generate Sharing Card */}
          <div className="p-4 bg-white border-t border-[#ECE5D7] flex items-center justify-between shrink-0 gap-3">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#8F733E] to-[#A48548] hover:from-[#7D6435] hover:to-[#93753C] text-white text-xs font-oriental-serif font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>生成雅致茶语海报 · 分享微信朋友圈</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-2xl bg-[#EFECE3] hover:bg-[#E5E1D5] text-[#4F493D] font-oriental-serif text-xs transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>

      {/* Share Poster Modal */}
      <TeaShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
        userName={userName}
        userTierTitle={userTierTitle}
      />
    </>
  );
};
