import React, { useState } from 'react';
import {
  X,
  Package,
  Calendar,
  Coins,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Truck,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  User,
  Copy,
  Check,
  Trash2,
  Feather,
  ShoppingBag,
} from 'lucide-react';
import {
  UserOrderRecord,
  OrderItemRecord,
  extractDescriptorTagsFromReview,
  extractAggregatedOrderReviews,
} from '../utils/orderResumeLogic';
import {
  AVAILABLE_TASTE_TAGS,
  generateCuratedTeaProfile,
} from '../utils/teaProfileLogic';
import { ConsignmentItem } from '../data/mockData';
import { BookingInvitationData } from './TeaInvitationModal';
import { UpcomingSeatCountdownCard } from './UpcomingSeatCountdownCard';
import { OrientalEmptyState } from './OrientalEmptyState';
import { zenAudio } from '../utils/audioZen';

export type ResumeTabType = 'orders' | 'bookings' | 'consignments';

interface TeaResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ResumeTabType;
  orders: UserOrderRecord[];
  bookings: BookingInvitationData[];
  consignments: ConsignmentItem[];
  customPalateTags?: string[] | null;
  onOpenInvitation: (booking: BookingInvitationData) => void;
  onOpenPosterModal?: (booking: BookingInvitationData) => void;
  onOpenMoodMemo?: (booking: BookingInvitationData) => void;
  onCancelBooking?: (bookingId: string) => void;
  onSaveOrderReview?: (
    orderId: string,
    reviewNote: string,
    reviewTags: string[],
    syncToTeaProfile: boolean
  ) => void;
  onReorderItems?: (items: OrderItemRecord[]) => void;
  onOpenOrderItemDetail?: (item: OrderItemRecord) => void;
  onOpenTeaProfile?: () => void;
  onOpenConsignmentDetail: (item: ConsignmentItem) => void;
  onOpenNewConsignment: () => void;
  onGoToRooms: () => void;
  onGoToShop: () => void;
}

const FALLBACK_RESUME_IMG = '/assets/aistudio/IMG_6489_3dbe7626.JPG';

export const TeaResumeModal: React.FC<TeaResumeModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'orders',
  orders,
  bookings,
  consignments,
  customPalateTags,
  onOpenInvitation,
  onOpenPosterModal,
  onOpenMoodMemo,
  onCancelBooking,
  onSaveOrderReview,
  onReorderItems,
  onOpenOrderItemDetail,
  onOpenTeaProfile,
  onOpenConsignmentDetail,
  onOpenNewConsignment,
  onGoToRooms,
  onGoToShop,
}) => {
  const [activeTab, setActiveTab] = useState<ResumeTabType>(initialTab);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  // Order Review Editing State
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState<string>('');
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const [customDescriptorInput, setCustomDescriptorInput] = useState<string>('');
  const [syncToTeaProfile, setSyncToTeaProfile] = useState<boolean>(true);
  const [savedReviewOrderId, setSavedReviewOrderId] = useState<string | null>(null);

  // Sync tab if initialTab changes when opened
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleCopyTracking = (trackingNo: string) => {
    zenAudio.playZenChime();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingNo).catch(() => {});
    }
    setCopiedTrackingId(trackingNo);
    setTimeout(() => {
      setCopiedTrackingId((prev) => (prev === trackingNo ? null : prev));
    }, 2000);
  };

  const handleStartEditReview = (order: UserOrderRecord) => {
    zenAudio.playZenChime();
    if (editingOrderId === order.id) {
      setEditingOrderId(null);
      return;
    }
    setEditingOrderId(order.id);
    setDraftNote(order.reviewNote || '茶汤入口温润醇厚，山场气韵清晰，回甘持久。');
    setDraftTags(
      order.reviewTags && order.reviewTags.length > 0
        ? [...order.reviewTags]
        : ['岩骨厚实', '舌底生津']
    );
    setCustomDescriptorInput('');
    setSyncToTeaProfile(order.syncedToTeaProfile !== false);
  };

  const handleToggleDraftTag = (tag: string) => {
    setDraftTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomDescriptor = () => {
    const extracted = extractDescriptorTagsFromReview('', customDescriptorInput);
    if (extracted.length === 0) return;
    zenAudio.playZenChime();
    setDraftTags((prev) => Array.from(new Set([...prev, ...extracted])));
    setCustomDescriptorInput('');
  };

  const handleConfirmReview = (orderId: string) => {
    zenAudio.playZenChime();
    const descriptorTags = extractDescriptorTagsFromReview(draftNote, customDescriptorInput);
    const mergedTags = Array.from(new Set([...draftTags, ...descriptorTags]));
    const finalTags = mergedTags.length > 0 ? mergedTags : ['舌底生津'];
    onSaveOrderReview?.(orderId, draftNote, finalTags, syncToTeaProfile);
    setCustomDescriptorInput('');
    setEditingOrderId(null);
    setSavedReviewOrderId(orderId);
  };

  // Compute live preview of how current draft review & tags affect the 5D Tea Character Radar
  const aggregatedBase = extractAggregatedOrderReviews(orders);
  const baseActiveTags =
    customPalateTags && customPalateTags.length > 0
      ? customPalateTags
      : aggregatedBase.reviewTags;
  const pendingDescriptors = extractDescriptorTagsFromReview(draftNote, customDescriptorInput);
  const previewTags = syncToTeaProfile
    ? Array.from(new Set([...draftTags, ...pendingDescriptors, ...baseActiveTags]))
    : baseActiveTags;
  const previewNotes = syncToTeaProfile
    ? [...aggregatedBase.reviewNotes, draftNote]
    : aggregatedBase.reviewNotes;
  const liveRadarPreview = generateCuratedTeaProfile(
    orders.flatMap((o) => o.items),
    previewNotes,
    previewTags
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E4DEC9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#ECE7DD] bg-[#F4EFEA]/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold">
              SPRING CHENG JIA YE · TEA RESUME
            </span>
            <h2 className="font-oriental-serif text-lg font-bold text-[#1E2320]">
              我的茶事履历档案
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#DCD3C4] flex items-center justify-center text-[#5E574B] hover:text-[#1E2320] transition-colors"
            aria-label="关闭茶事履历"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#ECE7DD] bg-[#FAF8F5] px-4 pt-2">
          {[
            { key: 'orders', label: '商品订单', count: orders.length, icon: Package },
            { key: 'bookings', label: '茶室日程', count: bookings.length, icon: Calendar },
            { key: 'consignments', label: '流转名物', count: consignments.length, icon: Coins },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                type="button"
                key={tab.key}
                onClick={() => {
                  zenAudio.playZenChime();
                  setActiveTab(tab.key as ResumeTabType);
                }}
                className={`flex-1 py-3 text-xs font-oriental-serif flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  isActive
                    ? 'border-[#232B26] text-[#1E2320] font-bold'
                    : 'border-transparent text-[#8C867B] hover:text-[#232B26]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#232B26] text-white' : 'bg-[#EAE4D8] text-[#696256]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3.5">
              {orders.length === 0 ? (
                <OrientalEmptyState
                  variant="orders"
                  compact
                  onPrimaryAction={() => {
                    onClose();
                    onGoToShop();
                  }}
                />
              ) : (
                orders.map((order) => {
                  const isEditingThis = editingOrderId === order.id;
                  const isSavedThis = savedReviewOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-4 border border-[#ECE6DB] shadow-xs space-y-3"
                    >
                      {/* Order Meta Header */}
                      <div className="flex items-center justify-between text-xs border-b border-[#F4EFE6] pb-2.5">
                        <div>
                          <span className="font-mono text-[10px] text-[#8C8578] block">
                            {order.createdAt}
                          </span>
                          <span className="font-mono font-medium text-[#232B26]">
                            {order.id}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-oriental-serif px-2.5 py-1 rounded-full ${
                            order.status === 'shipping'
                              ? 'bg-[#EBF3ED] text-[#2F6740] font-medium'
                              : 'bg-[#F2ECE1] text-[#7A7264]'
                          }`}
                        >
                          {order.statusText}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (onOpenOrderItemDetail) {
                                zenAudio.playZenChime();
                                onClose();
                                onOpenOrderItemDetail(it);
                              }
                            }}
                            className={`flex items-center gap-3 p-1.5 -mx-1.5 rounded-xl transition-colors ${
                              onOpenOrderItemDetail
                                ? 'cursor-pointer hover:bg-[#FAF7F0] group'
                                : ''
                            }`}
                          >
                            {it.image ? (
                              <img
                                src={it.image}
                                alt={it.name}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_RESUME_IMG;
                                }}
                                className="w-12 h-12 rounded-xl object-cover bg-[#EFEAE2] shrink-0 border border-[#E5DEC7]"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-[#F0EDE5] flex items-center justify-center shrink-0 text-[#8C8578]">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-oriental-serif text-xs font-bold text-[#1E2320] group-hover:text-[#8F733E] truncate transition-colors">
                                  {it.name}
                                </h4>
                                {onOpenOrderItemDetail && (
                                  <span className="text-[10px] font-oriental-serif text-[#8F733E] opacity-75 group-hover:opacity-100 shrink-0 flex items-center gap-0.5">
                                    <span>查阅图鉴</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-[#7E776C] mt-0.5">
                                <span>数量：x{it.quantity}</span>
                                <span className="font-mono text-[#232B26]">
                                  {it.price === 0 ? '叶值礼遇' : `¥${it.price.toLocaleString()}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Logistics and Anti-Counterfeit Bar */}
                      <div className="bg-[#FAF8F4] p-2.5 rounded-xl border border-[#EBE5D8] text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-[#615B50]">
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-[#2F6740]" />
                            <span>{order.shippingCompany}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyTracking(order.trackingNumber)}
                            className="font-mono text-[#232B26] hover:text-[#8F733E] font-medium flex items-center gap-1 transition-colors"
                            title="复制顺丰单号"
                          >
                            <span>{order.trackingNumber}</span>
                            {copiedTrackingId === order.trackingNumber ? (
                              <Check className="w-3 h-3 text-[#2F6740]" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#8C8578]" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[#8A8478] pt-1 border-t border-[#EFE9DF]">
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#8F733E]" />
                            <span>正品防伪溯源码</span>
                          </div>
                          <span className="font-mono text-[10px] text-[#8F733E]">
                            {order.antiCounterfeitCode}
                          </span>
                        </div>
                      </div>

                      {/* Existing Tasting Review Display (Closed Loop with Personal Tea Character Radar) */}
                      {(order.reviewNote || (order.reviewTags && order.reviewTags.length > 0)) &&
                        !isEditingThis && (
                          <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#E6DAC2] space-y-1.5 text-xs">
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <span className="text-[10px] font-mono text-[#8F733E] font-bold flex items-center gap-1">
                                <Feather className="w-3 h-3" />
                                <span>
                                  {order.syncedToTeaProfile === false
                                    ? '席主品茗手记（仅存订单）'
                                    : '席主品茗评鉴 · 已存入茶性档案'}
                                </span>
                              </span>
                              {onOpenTeaProfile && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onOpenTeaProfile();
                                  }}
                                  className={`text-[10px] font-oriental-serif font-bold underline ${
                                    isSavedThis ? 'text-[#2F6740]' : 'text-[#8F733E]'
                                  }`}
                                >
                                  {isSavedThis
                                    ? '✦ 已同步雷达，点击查验 →'
                                    : '查验茶性五维雷达 →'}
                                </button>
                              )}
                            </div>
                            {order.reviewNote && (
                              <p className="text-[11px] text-[#4E473B] font-oriental-serif leading-relaxed">
                                「{order.reviewNote}」
                              </p>
                            )}
                            {order.reviewTags && order.reviewTags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {order.reviewTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-md bg-white text-[#7A6234] text-[10px] font-oriental-serif border border-[#E4D6B8]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      {/* Interactive Tasting Review Editor Drawer */}
                      {isEditingThis && (
                        <div className="p-3.5 rounded-2xl bg-[#F5F1E8] border border-[#DFD3BC] space-y-3 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-oriental-serif font-bold text-[#232B26]">
                              品茗感官手记与茶性档案同步
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingOrderId(null)}
                              className="text-[11px] text-[#7D7567] hover:underline"
                            >
                              取消
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={draftNote}
                            onChange={(e) => setDraftNote(e.target.value)}
                            placeholder="记录开汤香气、汤感稠滑度或喉底余韵（如：炭焙沉稳、兰香高扬、舌底生津）..."
                            className="w-full text-xs bg-white rounded-xl p-2.5 border border-[#DAD0BE] text-[#232B26] focus:outline-none focus:border-[#232B26]"
                          />

                          {/* Custom Descriptor Word Input */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#766E60] block font-oriental-serif">
                              输入自定义风味描述词（支持顿号/空格分隔，实时演化雷达）：
                            </span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={customDescriptorInput}
                                onChange={(e) => setCustomDescriptorInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomDescriptor();
                                  }
                                }}
                                placeholder="例如：蜜兰高香、炭火足焙、冰糖甜润、米汤稠滑"
                                className="flex-1 text-xs bg-white rounded-xl px-2.5 py-1.5 border border-[#DAD0BE] text-[#232B26] focus:outline-none focus:border-[#232B26]"
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomDescriptor}
                                className="px-2.5 py-1.5 rounded-xl bg-[#232B26] text-white text-[11px] font-oriental-serif shrink-0 hover:bg-black transition-colors"
                              >
                                + 添入标签
                              </button>
                            </div>
                          </div>

                          {/* Preset & Custom Tags Selector */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#766E60] block font-oriental-serif">
                              勾选或管理本单茶品突出的感官标签：
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {Array.from(new Set([...AVAILABLE_TASTE_TAGS, ...draftTags])).map(
                                (tag) => {
                                  const active = draftTags.includes(tag);
                                  const isCustom = !AVAILABLE_TASTE_TAGS.includes(tag);
                                  return (
                                    <button
                                      type="button"
                                      key={tag}
                                      onClick={() => handleToggleDraftTag(tag)}
                                      className={`px-2 py-0.5 rounded-lg text-[10px] font-oriental-serif border transition-all ${
                                        active
                                          ? 'bg-[#232B26] text-white border-[#232B26] font-bold'
                                          : 'bg-white text-[#645C4F] border-[#DFD7C8]'
                                      }`}
                                    >
                                      {isCustom ? `✦ ${tag}` : tag}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Option: 存入茶性档案 (Sync to Personal Tea Character Dossier) */}
                          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/90 border border-[#DFD4BE] cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={syncToTeaProfile}
                              onChange={(e) => setSyncToTeaProfile(e.target.checked)}
                              className="mt-0.5 w-4 h-4 accent-[#232B26] rounded cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-oriental-serif text-xs font-bold text-[#1E2320]">
                                  存入茶性档案
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FAF5E8] text-[#8F733E] border border-[#E5D5B5]">
                                  {syncToTeaProfile ? '实时联动五维雷达' : '仅存本单评价'}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#787062] mt-0.5 leading-relaxed">
                                勾选后，您输入的描述词与所选标签将同步更新至个人茶性标签库（customPalateTags），实时重塑五维茶性雷达图。
                              </p>
                            </div>
                          </label>

                          {/* Real-time 5D Radar Score Preview Bar */}
                          {syncToTeaProfile && (
                            <div className="p-2.5 rounded-xl bg-[#202823] text-[#FAF8F5] space-y-1.5">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-mono text-[#E4D1A0]">
                                  五维茶性雷达实时演算预览
                                </span>
                                <span className="font-oriental-serif text-[#D8C496]">
                                  {liveRadarPreview.characterTitle}
                                </span>
                              </div>
                              <div className="grid grid-cols-5 gap-1 text-center">
                                {[
                                  { label: '焙火', val: liveRadarPreview.radar.roast },
                                  { label: '香扬', val: liveRadarPreview.radar.aroma },
                                  { label: '回甘', val: liveRadarPreview.radar.sweetness },
                                  { label: '稠滑', val: liveRadarPreview.radar.mouthfeel },
                                  { label: '喉韵', val: liveRadarPreview.radar.throatCharm },
                                ].map((dim) => (
                                  <div
                                    key={dim.label}
                                    className="py-1 rounded-lg bg-white/10 border border-white/10"
                                  >
                                    <span className="text-[9px] text-[#C8C2B3] block font-oriental-serif">
                                      {dim.label}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-[#E8DFC9]">
                                      {dim.val}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleConfirmReview(order.id)}
                            className="w-full py-2 rounded-xl bg-[#8F733E] hover:bg-[#7A6132] text-white text-xs font-oriental-serif font-bold transition-colors shadow-2xs"
                          >
                            {syncToTeaProfile
                              ? '保存茶评并存入茶性档案（实时更新雷达）'
                              : '仅保存本单茶评手记'}
                          </button>
                        </div>
                      )}

                      {/* Financial Summary & Order Actions */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F4EFE6] flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#8F733E]">
                          <Sparkles className="w-3 h-3" />
                          <span>
                            {order.pointsEarned > 0
                              ? `+${order.pointsEarned} 叶值`
                              : '叶值礼遇'}
                          </span>
                          <span className="text-[#C8C0B0]">|</span>
                          <span className="font-mono font-bold text-xs text-[#1E2320]">
                            {order.totalAmount === 0
                              ? '实付 ¥0'
                              : `实付 ¥${order.totalAmount.toLocaleString()}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditReview(order)}
                            className="px-2.5 py-1 rounded-lg bg-[#FAF5E8] hover:bg-[#F1E5CC] text-[#8F733E] border border-[#E5D5B5] text-[11px] font-oriental-serif flex items-center gap-1 transition-colors"
                          >
                            <Feather className="w-3 h-3" />
                            <span>{order.reviewNote ? '修改茶评' : '撰写茶评'}</span>
                          </button>

                          {onReorderItems && order.totalAmount > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                zenAudio.playZenChime();
                                onReorderItems(order.items);
                                setReorderedId(order.id);
                                setTimeout(() => setReorderedId(null), 2000);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#232B26] hover:bg-black text-white text-[11px] font-oriental-serif flex items-center gap-1 transition-colors"
                            >
                              {reorderedId === order.id ? (
                                <>
                                  <Check className="w-3 h-3 text-[#D8C496]" />
                                  <span>已入茶囊</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3 h-3 text-[#D8C496]" />
                                  <span>再次结缘</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-3.5">
              {bookings.length === 0 ? (
                <OrientalEmptyState
                  variant="bookings"
                  compact
                  onPrimaryAction={() => {
                    onClose();
                    onGoToRooms();
                  }}
                  onSecondaryAction={() => {
                    onClose();
                    onGoToShop();
                  }}
                />
              ) : (
                <>
                  <UpcomingSeatCountdownCard
                    bookings={bookings}
                    compact
                    onOpenInvitation={(b) => {
                      onClose();
                      onOpenInvitation(b);
                    }}
                  />
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-4 border border-[#ECE6DB] shadow-xs space-y-3 relative overflow-hidden"
                    >
                      {/* Watermark Seal */}
                      <div className="absolute top-3 right-3 w-14 h-14 rounded-full border border-[#B23A2B]/20 flex items-center justify-center text-[#B23A2B]/30 font-oriental-serif text-[10px] -rotate-12 pointer-events-none">
                        已留席
                      </div>

                      {/* Room and Date Info */}
                      <div className="border-b border-[#F4EFE6] pb-2.5">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#8F733E]">
                          <span>席位预约凭证</span>
                          <span>·</span>
                          <span>{b.id}</span>
                        </div>
                        <h4 className="font-oriental-serif text-sm font-bold text-[#1E2320] mt-0.5">
                          {b.roomName}
                        </h4>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-[#5E574B]">
                          <Calendar className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                          <span className="font-mono">{b.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5E574B]">
                          <Clock className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                          <span className="truncate">{b.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5E574B]">
                          <User className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                          <span>侍茶师：{b.sommelier}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5E574B]">
                          <MapPin className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                          <span className="truncate">配茶：{b.pairedTea}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#F4EFE6] gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#7B7569]">
                            已付：
                            <strong className="font-mono font-bold text-[#1E2320]">
                              ¥{b.finalPrice.toLocaleString()}
                            </strong>
                          </span>
                          {onCancelBooking && (
                            <button
                              type="button"
                              onClick={() => {
                                zenAudio.playZenChime();
                                onCancelBooking(b.id);
                              }}
                              className="text-[11px] font-oriental-serif text-[#9E4738] hover:underline flex items-center gap-0.5"
                              title="释放此预约席位"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>取消席位</span>
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {onOpenMoodMemo && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenMoodMemo(b);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-[#FAF5E8] hover:bg-[#F2E7CF] text-[#8F733E] border border-[#E5D5B5] text-xs font-oriental-serif flex items-center gap-1 transition-colors font-bold"
                            >
                              <Feather className="w-3 h-3" />
                              <span>心境备忘</span>
                            </button>
                          )}
                          {onOpenPosterModal && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenPosterModal(b);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-[#FAF5E8] hover:bg-[#F1E5CC] text-[#8F733E] border border-[#E5D5B5] text-xs font-oriental-serif flex items-center gap-1 transition-colors"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>邀约海报</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenInvitation(b);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white text-xs font-oriental-serif flex items-center gap-1 transition-colors shadow-2xs"
                          >
                            <span>邀请函</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {bookings.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToRooms();
                  }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-[#DDD5C5] text-xs font-oriental-serif text-[#6C665A] hover:border-[#232B26] hover:text-[#232B26] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>预订更多茶席</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* TAB 3: CONSIGNMENTS */}
          {activeTab === 'consignments' && (
            <div className="space-y-3.5">
              {consignments.length === 0 ? (
                <OrientalEmptyState
                  variant="consign"
                  compact
                  title="您当前尚无委托流转中的藏品"
                  onPrimaryAction={() => {
                    onClose();
                    onOpenNewConsignment();
                  }}
                  onSecondaryAction={() => {
                    onClose();
                    onGoToShop();
                  }}
                  secondaryActionLabel="前往茶铺品鉴新器"
                />
              ) : (
                consignments.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-[#ECE6DB] shadow-xs space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_RESUME_IMG;
                        }}
                        className="w-16 h-16 rounded-xl object-cover bg-[#EFEAE2] shrink-0 border border-[#E5DEC7]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#8F733E] bg-[#FAF5E8] px-2 py-0.5 rounded-md">
                            {item.certificateNo}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              item.status === 'active'
                                ? 'text-[#2F6740] bg-[#EBF3ED]'
                                : 'text-[#8F733E] bg-[#FAF5E8]'
                            }`}
                          >
                            {item.status === 'active' ? '流转展示中' : '已结藏交割'}
                          </span>
                        </div>
                        <h4 className="font-oriental-serif text-xs font-bold text-[#1E2320] mt-1 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#7A7468] truncate mt-0.5">
                          {item.condition}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#FAF8F4] p-2.5 rounded-xl border border-[#EBE5D8] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#868074] block">
                          当前流转估值
                        </span>
                        <span className="font-mono font-bold text-sm text-[#1E2320]">
                          ¥{item.currentPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-[#696356]">
                        <span>{item.views} 人品鉴</span>
                        <span className="mx-1.5">·</span>
                        <span>{item.bidsCount ?? 0} 次意向认藏</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-[11px] text-[#868074]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2F6740]" />
                        <span>春城嘉叶专业母仓保管</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenConsignmentDetail(item);
                        }}
                        className="text-xs font-oriental-serif text-[#232B26] hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>鉴藏证书</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewConsignment();
                }}
                className="w-full py-3 rounded-2xl bg-[#232B26] hover:bg-[#181E1A] text-white text-xs font-oriental-serif flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Coins className="w-3.5 h-3.5 text-[#D8C496]" />
                <span>发起新茶物寄售鉴定</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
