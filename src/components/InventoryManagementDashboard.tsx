import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  PackagePlus,
  Search,
  CheckCircle2,
  Layers,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  TrendingUp,
  Warehouse,
  Clock,
  Filter,
  BellRing,
  SlidersHorizontal,
  Coins,
  Send,
  ClipboardCheck,
  FileText,
  ShoppingBag,
  Calendar,
  Award,
  Truck,
  UserCheck,
  Copy,
  MapPin,
  Activity,
  Compass,
  Lightbulb,
  Wand2,
  Eye,
} from 'lucide-react';
import {
  REGIONAL_CONSIGNMENT_HEAT_DATA,
  generateConsignmentShowcaseAdvice,
  RegionalConsignmentHeat,
  ConsignmentShowcaseAdvice,
} from '../utils/consignmentHeatmapLogic';
import {
  InventoryRecord,
  InventoryCategory,
  ReplenishLogEntry,
  evaluateStockAlertLevel,
  computeInventorySummary,
  filterInventoryRecords,
  evaluateInventoryValuationStatus,
  computeStoreBackendMetrics,
  generateInventoryAuditReportText,
  DEFAULT_VALUATION_THRESHOLD,
  VALUATION_THRESHOLD_PRESETS,
} from '../utils/inventoryLogic';
import { UserOrderRecord } from '../utils/orderResumeLogic';
import { BookingInvitationData } from './TeaInvitationModal';
import { ConsignmentItem } from '../data/mockData';
import { OrientalEmptyState } from './OrientalEmptyState';
import { zenAudio } from '../utils/audioZen';

export type BackendModuleTab = 'inventory' | 'orders' | 'bookings' | 'consignments';

export interface InventoryManagementDashboardProps {
  records: InventoryRecord[];
  replenishLogs?: ReplenishLogEntry[];
  onReplenishItem: (itemId: string, addQuantity: number) => void;
  onBatchReplenish: (categoryFilter?: 'ALL' | InventoryCategory) => void;
  onResetInventory?: () => void;
  onBackToStorefront?: () => void;
  onTriggerValuationPush?: (valuationStatus: {
    currentValuation: number;
    threshold: number;
    deficit: number;
  }) => void;
  valuationThreshold?: number;
  onUpdateValuationThreshold?: (newThreshold: number) => void;
  onUpdateSafetyThreshold?: (itemId: string, newThreshold: number) => void;
  userOrders?: UserOrderRecord[];
  activeBookings?: BookingInvitationData[];
  consignments?: ConsignmentItem[];
  onTriggerCourtesyPush?: (booking: BookingInvitationData) => void;
  onOpenInvitation?: (booking: BookingInvitationData) => void;
  onUpdateConsignmentItem?: (
    itemId: string,
    patch: Partial<Pick<ConsignmentItem, 'currentPrice' | 'status'>>
  ) => void;
}

const FALLBACK_INV_IMG = '/assets/aistudio/IMG_6489_3dbe7626.JPG';
const SOMMELIER_ROSTER = ['苏婉', '陆清河', '林静姝', '陈茗烟'];

export const InventoryManagementDashboard: React.FC<InventoryManagementDashboardProps> = ({
  records,
  replenishLogs = [],
  onReplenishItem,
  onBatchReplenish,
  onResetInventory,
  onBackToStorefront,
  onTriggerValuationPush,
  valuationThreshold: controlledThreshold,
  onUpdateValuationThreshold,
  onUpdateSafetyThreshold,
  userOrders = [],
  activeBookings = [],
  consignments = [],
  onTriggerCourtesyPush,
  onOpenInvitation,
  onUpdateConsignmentItem,
}) => {
  const [activeBackendTab, setActiveBackendTab] = useState<BackendModuleTab>('inventory');
  const [internalThreshold, setInternalThreshold] = useState<number>(DEFAULT_VALUATION_THRESHOLD);
  const activeThreshold = controlledThreshold ?? internalThreshold;

  const [isThresholdConfigOpen, setIsThresholdConfigOpen] = useState<boolean>(false);
  const [isAuditReportOpen, setIsAuditReportOpen] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [pushSentBanner, setPushSentBanner] = useState<string | null>(null);

  // Order fulfillment local state map (orderId -> status label)
  const [orderFulfillmentMap, setOrderFulfillmentMap] = useState<Record<string, string>>({});
  // Booking sommelier override map (bookingId -> sommelier name)
  const [bookingSommelierMap, setBookingSommelierMap] = useState<Record<string, string>>({});
  // Booking verified map (bookingId -> boolean)
  const [verifiedBookingMap, setVerifiedBookingMap] = useState<Record<string, boolean>>({});

  // Consignment Module Sub-tabs & Heatmap / Showcase Advisor State
  const [consignmentSubTab, setConsignmentSubTab] = useState<'heatmap' | 'advice' | 'desk'>('heatmap');
  const [selectedHeatRegionId, setSelectedHeatRegionId] = useState<string>('greater_bay');
  const [expandedAdviceItemId, setExpandedAdviceItemId] = useState<string | null>(null);
  const [appliedAdviceMap, setAppliedAdviceMap] = useState<Record<string, boolean>>({});

  const [selectedCategory, setSelectedCategory] = useState<'ALL' | InventoryCategory>('ALL');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'alert-priority' | 'stock-asc' | 'value-desc'>(
    'alert-priority'
  );
  const [justReplenishedId, setJustReplenishedId] = useState<string | null>(null);
  const [batchSuccessBanner, setBatchSuccessBanner] = useState<string | null>(null);

  const summary = useMemo(() => computeInventorySummary(records), [records]);
  const valuationStatus = useMemo(
    () => evaluateInventoryValuationStatus(summary.totalValuation, activeThreshold),
    [summary.totalValuation, activeThreshold]
  );

  const backendMetrics = useMemo(
    () =>
      computeStoreBackendMetrics({
        records,
        orders: userOrders,
        bookings: activeBookings,
        consignments,
      }),
    [records, userOrders, activeBookings, consignments]
  );

  const auditReportText = useMemo(
    () => generateInventoryAuditReportText(records, summary, valuationStatus),
    [records, summary, valuationStatus]
  );

  const handleCopyAuditReport = () => {
    zenAudio.playZenChime();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(auditReportText).catch(() => {});
    }
    setCopiedReport(true);
    setBatchSuccessBanner('已将《春城嘉叶 · 全域仓储盘点与补货核准单》复制至剪贴板');
    setTimeout(() => setCopiedReport(false), 2500);
    setTimeout(() => setBatchSuccessBanner(null), 3500);
  };

  const handleSetThreshold = (val: number) => {
    zenAudio.playZenChime();
    setInternalThreshold(val);
    if (onUpdateValuationThreshold) {
      onUpdateValuationThreshold(val);
    }
  };

  const handleSimulateValuationPushNotification = () => {
    zenAudio.playZenChime();
    if (onTriggerValuationPush) {
      onTriggerValuationPush({
        currentValuation: valuationStatus.currentValuation,
        threshold: valuationStatus.threshold,
        deficit: valuationStatus.deficit,
      });
    }
    setPushSentBanner(
      `已向掌柜终端推送「货值告急预警」通知 (当前总货值 ¥${(valuationStatus.currentValuation / 10000).toFixed(1)}万 < 基准 ¥${(valuationStatus.threshold / 10000).toFixed(1)}万)`
    );
    setTimeout(() => {
      setPushSentBanner(null);
    }, 4500);
  };

  const filteredRecords = useMemo(
    () =>
      filterInventoryRecords(records, {
        category: selectedCategory,
        onlyLowStock,
        searchQuery,
        sortBy,
      }),
    [records, selectedCategory, onlyLowStock, searchQuery, sortBy]
  );

  const handleQuickReplenish = (itemId: string, qty: number, itemName: string) => {
    zenAudio.playZenChime();
    onReplenishItem(itemId, qty);
    setJustReplenishedId(itemId);
    setBatchSuccessBanner(`已为「${itemName}」快速补货 +${qty}，库存水位已实时刷新`);
    setTimeout(() => {
      setJustReplenishedId((prev) => (prev === itemId ? null : prev));
    }, 2000);
    setTimeout(() => {
      setBatchSuccessBanner(null);
    }, 3500);
  };

  const handleTriggerBatchReplenish = (cat: 'ALL' | InventoryCategory = 'ALL') => {
    zenAudio.playZenChime();
    onBatchReplenish(cat);
    const label =
      cat === 'ALL'
        ? '全馆三大品类'
        : cat === 'Tea'
        ? '山场原叶 (Tea)'
        : cat === 'Ceramics'
        ? '茗壶雅瓷 (Ceramics)'
        : '典藏寄售 (Consignments)';
    setBatchSuccessBanner(`已完成「${label}」低库存一键智能补仓，全部预警项均已恢复充盈水位`);
    setTimeout(() => {
      setBatchSuccessBanner(null);
    }, 4000);
  };

  return (
    <div className="space-y-5 px-4 sm:px-5 pb-14 pt-3 bg-[#FAF8F5] min-h-full">
      {/* Top Backend Admin Header with Threshold & Valuation Alert Highlight */}
      <div
        className={`rounded-3xl p-4 sm:p-5 text-[#FAF8F5] border shadow-md space-y-4 transition-all ${
          valuationStatus.isBelowThreshold
            ? valuationStatus.severity === 'severe'
              ? 'bg-gradient-to-br from-[#2D120F] via-[#241716] to-[#1C1413] border-[#C84A3D]/70 shadow-[#A63429]/15 ring-2 ring-[#C84A3D]/30'
              : 'bg-gradient-to-br from-[#292213] via-[#241E15] to-[#1B1813] border-[#CBA048]/60 shadow-[#9A6B1F]/15 ring-1 ring-[#CBA048]/30'
            : 'bg-gradient-to-br from-[#1C2520] via-[#232E28] to-[#161D19] border-[#3B483F]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {onBackToStorefront && (
                <button
                  type="button"
                  onClick={onBackToStorefront}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#E6D4AA] text-[10px] font-oriental-serif flex items-center gap-1 border border-white/15 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>返回前台茶舍</span>
                </button>
              )}
              <span className="text-[10px] font-mono tracking-widest text-[#D8C496] uppercase font-bold flex items-center gap-1">
                <Warehouse className="w-3.5 h-3.5" />
                <span>BACKEND INVENTORY DASHBOARD · 掌柜中枢</span>
              </span>

              {/* Dynamic Valuation Status Tag */}
              {valuationStatus.isBelowThreshold ? (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                    valuationStatus.severity === 'severe'
                      ? 'bg-[#A63429] text-white animate-pulse'
                      : 'bg-[#C58B2B] text-black font-semibold'
                  }`}
                >
                  <ShieldAlert className="w-2.5 h-2.5" />
                  <span>
                    货值低于基线 (-¥{(valuationStatus.deficit / 10000).toFixed(1)}万)
                  </span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#2F6740]/60 text-[#B8E2C3] border border-[#3E8053]/50 text-[10px] font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#63C783]" />
                  <span>总货值充盈 (100%+)</span>
                </span>
              )}
            </div>
            <h1 className="font-oriental-serif text-lg sm:text-xl font-bold tracking-wider text-white">
              春城嘉叶 · 全域仓储与低库存预警看板
            </h1>
            <p className="text-[11px] text-[#C4BDB0] font-light leading-relaxed">
              实时监控山场原叶 (Tea)、茗壶雅瓷 (Ceramics) 与典藏寄售 (Consignments) 三大核心库区水位与全域资金货值，防范供应链断货风险。
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
            {/* Export / Preview Inventory Audit Report Button */}
            <button
              type="button"
              onClick={() => setIsAuditReportOpen((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-oriental-serif flex items-center gap-1 transition-all ${
                isAuditReportOpen
                  ? 'bg-[#D8C496] text-[#1E2320] border-[#D8C496] font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-[#DFCFAF] border-white/15'
              }`}
              title="生成全馆仓储盘点与补货核准单"
            >
              <FileText className="w-3 h-3 text-[#D8C496]" />
              <span>盘点单</span>
            </button>

            {/* Configurable Threshold Toggle Button */}
            <button
              type="button"
              onClick={() => setIsThresholdConfigOpen((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-oriental-serif flex items-center gap-1 transition-all ${
                isThresholdConfigOpen
                  ? 'bg-[#D8C496] text-[#1E2320] border-[#D8C496] font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-[#DFCFAF] border-white/15'
              }`}
              title="设置全馆货值警戒基线"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#D8C496]" />
              <span>基准设定 (¥{(activeThreshold / 10000).toFixed(0)}万)</span>
            </button>

            {onResetInventory && (
              <button
                type="button"
                onClick={() => {
                  zenAudio.playZenChime();
                  onResetInventory();
                  setBatchSuccessBanner('已重置演示库存数据，恢复初始低库存预警状态');
                  setTimeout(() => setBatchSuccessBanner(null), 3000);
                }}
                className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#DFCFAF] border border-white/15 text-[11px] font-oriental-serif flex items-center gap-1 transition-colors"
                title="恢复初始低库存演示数据"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重置</span>
              </button>
            )}
          </div>
        </div>

        {/* Official Inventory Audit Report Drawer */}
        {isAuditReportOpen && (
          <div className="p-3.5 rounded-2xl bg-black/45 border border-[#D8C496]/35 backdrop-blur-xs space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#EEDB9F]">
                <ClipboardCheck className="w-3.5 h-3.5 text-[#D8C496]" />
                <span className="font-oriental-serif font-bold">
                  春城嘉叶 · 全域仓储盘点与低库存核准单
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyAuditReport}
                className="px-2.5 py-1 rounded-lg bg-[#D8C496] text-[#1A221D] text-[10px] font-oriental-serif font-bold flex items-center gap-1 hover:brightness-105 transition-all"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedReport ? '✦ 已复制至剪贴板' : '一键复制核准单'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/50 border border-white/10 text-[10px] font-mono text-[#E2DACB] whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto no-scrollbar">
              {auditReportText}
            </pre>
          </div>
        )}

        {/* Configurable Threshold Settings Drawer */}
        {isThresholdConfigOpen && (
          <div className="p-3.5 rounded-2xl bg-black/40 border border-[#D8C496]/30 backdrop-blur-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-[#EEDB9F]">
                <Coins className="w-3.5 h-3.5 text-[#D8C496]" />
                <span className="font-oriental-serif font-bold">
                  全馆总货值安全警戒基准设定（Configurable Valuation Threshold）
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#B0A99B]">
                当前货值：¥{(summary.totalValuation / 10000).toFixed(1)}万 / 设定基线：¥
                {(activeThreshold / 10000).toFixed(1)}万
              </span>
            </div>

            {/* Threshold Preset Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VALUATION_THRESHOLD_PRESETS.map((preset) => {
                const isActive = activeThreshold === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleSetThreshold(preset.value)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isActive
                        ? 'bg-[#D8C496] text-[#1A221D] border-[#D8C496] shadow-xs'
                        : 'bg-white/6 hover:bg-white/12 text-[#E2DACB] border-white/10'
                    }`}
                  >
                    <span className="font-oriental-serif text-xs font-bold block">
                      {preset.label}
                    </span>
                    <span
                      className={`text-[9px] block mt-0.5 line-clamp-1 ${
                        isActive ? 'text-[#3E382E]' : 'text-[#9A9386]'
                      }`}
                    >
                      {preset.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input Slider Row */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <span className="text-[#B5AE9E] text-[11px] shrink-0 font-oriental-serif">
                微调阈值：
              </span>
              <input
                type="range"
                min={80000}
                max={400000}
                step={10000}
                value={activeThreshold}
                onChange={(e) => handleSetThreshold(Number(e.target.value))}
                className="flex-1 accent-[#D8C496] cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-[#EEDB9F] shrink-0">
                ¥{activeThreshold.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* High-Level KPI Strip with Valuation Alert Styling */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/15 text-center">
          <div className="p-2.5 rounded-2xl bg-white/8 border border-white/10">
            <span className="text-[9px] font-mono text-[#B0A99B] block uppercase">
              在库总 SKU
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-white mt-0.5 block">
              {summary.totalSkus}
            </span>
          </div>

          <div
            onClick={() => {
              setActiveBackendTab('inventory');
              setOnlyLowStock(true);
            }}
            className="p-2.5 rounded-2xl bg-[#A63429]/30 border border-[#E57368]/40 cursor-pointer hover:bg-[#A63429]/40 transition-colors"
          >
            <span className="text-[9px] font-mono text-[#F7C5BF] block uppercase">
              紧急告罄预警
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#FFD5D0] mt-0.5 block">
              {summary.criticalTotalCount} 项
            </span>
          </div>

          <div
            onClick={() => {
              setActiveBackendTab('inventory');
              setOnlyLowStock(true);
            }}
            className="p-2.5 rounded-2xl bg-[#8F733E]/30 border border-[#D8C496]/40 cursor-pointer hover:bg-[#8F733E]/40 transition-colors"
          >
            <span className="text-[9px] font-mono text-[#F3E2B8] block uppercase">
              低库存待补总计
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#F9ECCB] mt-0.5 block">
              {summary.lowStockTotalCount} 项
            </span>
          </div>

          <div
            onClick={() => setIsThresholdConfigOpen(true)}
            className={`p-2.5 rounded-2xl border cursor-pointer transition-all ${
              valuationStatus.isBelowThreshold
                ? valuationStatus.severity === 'severe'
                  ? 'bg-[#A63429]/40 border-[#FF8F82] shadow-sm animate-pulse'
                  : 'bg-[#B08226]/40 border-[#E8C574]'
                : 'bg-white/8 border-white/10 hover:bg-white/12'
            }`}
            title="点击展开货值警戒基线设置"
          >
            <span
              className={`text-[9px] font-mono block uppercase ${
                valuationStatus.isBelowThreshold
                  ? valuationStatus.severity === 'severe'
                    ? 'text-[#FFD8D4] font-bold'
                    : 'text-[#FFEAB5] font-bold'
                  : 'text-[#B0A99B]'
              }`}
            >
              {valuationStatus.isBelowThreshold ? '总货值告警 (偏低)' : '在库总估值'}
            </span>
            <span
              className={`font-mono text-sm sm:text-base font-bold mt-0.5 block truncate ${
                valuationStatus.isBelowThreshold
                  ? valuationStatus.severity === 'severe'
                    ? 'text-white'
                    : 'text-[#FFE7AB]'
                  : 'text-[#D8C496]'
              }`}
            >
              ¥{(summary.totalValuation / 10000).toFixed(1)}万
            </span>
          </div>
        </div>

        {/* 4-Module Mini Program Store Backend Workbench Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/15">
          {[
            {
              id: 'inventory' as BackendModuleTab,
              label: '全域仓储补货',
              sub: `预警 ${summary.lowStockTotalCount} 项`,
              icon: Warehouse,
              badgeColor:
                summary.lowStockTotalCount > 0 ? 'bg-[#A63429] text-white' : 'bg-white/15 text-[#D8C496]',
            },
            {
              id: 'orders' as BackendModuleTab,
              label: '订单履约茶评',
              sub: `${backendMetrics.totalOrdersCount} 笔 · ¥${(backendMetrics.totalGmvRevenue / 1000).toFixed(1)}k`,
              icon: ShoppingBag,
              badgeColor: 'bg-white/15 text-[#D8C496]',
            },
            {
              id: 'bookings' as BackendModuleTab,
              label: '茶席排期调度',
              sub: `${backendMetrics.activeBookingsCount} 席 · ${backendMetrics.totalBookedGuests} 客`,
              icon: Calendar,
              badgeColor: 'bg-white/15 text-[#D8C496]',
            },
            {
              id: 'consignments' as BackendModuleTab,
              label: '寄售鉴真审定',
              sub: `在售 ${backendMetrics.activeConsignmentsCount} / 售罄 ${backendMetrics.soldConsignmentsCount}`,
              icon: Award,
              badgeColor: 'bg-white/15 text-[#D8C496]',
            },
          ].map((mod) => {
            const IconComp = mod.icon;
            const isActive = activeBackendTab === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  zenAudio.playZenChime();
                  setActiveBackendTab(mod.id);
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                  isActive
                    ? 'bg-[#D8C496] text-[#1A221D] border-[#D8C496] shadow-xs'
                    : 'bg-white/6 hover:bg-white/12 text-[#FAF8F5] border-white/10'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <IconComp
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-[#1A221D]' : 'text-[#D8C496]'
                      }`}
                    />
                    <span className="font-oriental-serif text-xs font-bold truncate">
                      {mod.label}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono block mt-0.5 truncate ${
                      isActive ? 'text-[#3A3327] font-semibold' : 'text-[#B5AEA0]'
                    }`}
                  >
                    {mod.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prominent Visual Highlight Banner when Total Valuation Drops Below Configurable Threshold */}
      {valuationStatus.isBelowThreshold && (
        <div
          className={`p-4 rounded-3xl border shadow-sm space-y-3 transition-all ${
            valuationStatus.severity === 'severe'
              ? 'bg-gradient-to-r from-[#FFF2F0] via-[#FDF5E8] to-[#FBF0ED] border-[#E8A59C]'
              : 'bg-gradient-to-r from-[#FAF3E3] via-[#F8F5EB] to-[#FAF2DF] border-[#E2CD9C]'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 ${
                  valuationStatus.severity === 'severe'
                    ? 'bg-[#A63429] animate-bounce'
                    : 'bg-[#B08226]'
                }`}
              >
                <BellRing className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-oriental-serif text-sm font-bold ${
                      valuationStatus.severity === 'severe'
                        ? 'text-[#7A1E14]'
                        : 'text-[#6F4E12]'
                    }`}
                  >
                    全馆库存货值跌破安全警戒线 · 供应链缺货预警
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      valuationStatus.severity === 'severe'
                        ? 'bg-[#A63429] text-white'
                        : 'bg-[#E5BE64] text-[#3A2703]'
                    }`}
                  >
                    警戒达成率 {valuationStatus.ratio}% (缺口 ¥
                    {(valuationStatus.deficit / 10000).toFixed(1)}万)
                  </span>
                </div>
                <p className="text-[11px] text-[#5C4F44] leading-relaxed">
                  当前全品类在库货值仅为 ¥{(valuationStatus.currentValuation / 10000).toFixed(1)}
                  万，低于掌柜设定的 ¥{(valuationStatus.threshold / 10000).toFixed(1)}
                  万基准。{valuationStatus.recommendedAction}
                </p>
              </div>
            </div>

            {/* Quick Actions: Simulate Push Notification + Batch Replenish */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleSimulateValuationPushNotification}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FAF8F5] text-[#232B26] border border-[#D5C7B0] text-xs font-oriental-serif font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all"
                title="触发掌柜终端模拟推送通知"
              >
                <Send className="w-3.5 h-3.5 text-[#8F733E]" />
                <span>触发掌柜推送提醒</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerBatchReplenish('ALL')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-[#A63429] hover:bg-[#8E2A20] text-white text-xs font-oriental-serif font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all"
              >
                <PackagePlus className="w-4 h-4" />
                <span>一键智能拉齐货值</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Push Notification Confirmation Toast */}
      {pushSentBanner && (
        <div className="px-4 py-2.5 rounded-2xl bg-[#1C2520] text-[#FAF8F5] text-xs font-oriental-serif flex items-center justify-between shadow-md border border-[#D8C496]/40 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-[#EEDB9F] animate-bounce shrink-0" />
            <span>{pushSentBanner}</span>
          </div>
          <span className="text-[10px] font-mono text-[#D8C496] shrink-0">PUSH TRIGGERED</span>
        </div>
      )}

      {/* Action Feedback Toast Banner */}
      {batchSuccessBanner && (
        <div className="px-4 py-2.5 rounded-2xl bg-[#232B26] text-[#FAF8F5] text-xs font-oriental-serif flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D8C496] shrink-0" />
            <span>{batchSuccessBanner}</span>
          </div>
          <span className="text-[10px] font-mono text-[#D8C496]">REALTIME SYNC</span>
        </div>
      )}

      {activeBackendTab === 'inventory' && (
        <>
          {/* Live Visual Low-Stock Alert Banner */}
          {summary.lowStockTotalCount > 0 ? (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-[#FDF4F2] via-[#FAF3EA] to-[#FAF6EC] border border-[#E6C5BC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#A63429] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-oriental-serif text-xs sm:text-sm font-bold text-[#7A231B]">
                      低库存红色/琥珀预警：共 {summary.lowStockTotalCount} 款器物与原叶低于安全水位
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#A63429]/12 text-[#A63429] font-mono text-[10px] font-bold">
                      含 {summary.criticalTotalCount} 款紧急告罄
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E564E] leading-relaxed">
                    山场原叶 {summary.byCategory.Tea.lowStockCount} 款 · 茗壶雅瓷{' '}
                    {summary.byCategory.Ceramics.lowStockCount} 款 · 典藏寄售{' '}
                    {summary.byCategory.Consignments.lowStockCount} 款待调拨补仓
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleTriggerBatchReplenish('ALL')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#A63429] hover:bg-[#8E2A20] text-white text-xs font-oriental-serif font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 shrink-0"
              >
                <PackagePlus className="w-4 h-4" />
                <span>一键智能补齐全部低库存 ({summary.lowStockTotalCount})</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-[#EBF3ED] border border-[#C6DFCD] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-[#255836]">
                <CheckCircle2 className="w-5 h-5 text-[#2F6740] shrink-0" />
                <div>
                  <span className="font-oriental-serif font-bold block">
                    三大库区水位全部充盈 · 无低库存预警
                  </span>
                  <span className="text-[11px] text-[#497556]">
                    山场原叶、茗壶雅瓷与典藏寄售均处于安全库存线以上，可切换查看全部在库 SKU。
                  </span>
                </div>
              </div>
              {onlyLowStock && (
                <button
                  type="button"
                  onClick={() => setOnlyLowStock(false)}
                  className="px-3 py-1.5 rounded-xl bg-[#2F6740] text-white text-xs font-oriental-serif shrink-0"
                >
                  查看全部在库 ({summary.totalSkus})
                </button>
              )}
            </div>
          )}

      {/* 3-Category Low-Stock Summary Cards (Tea, Ceramics, Consignments) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['Tea', 'Ceramics', 'Consignments'] as InventoryCategory[]).map((catKey) => {
          const cat = summary.byCategory[catKey];
          const isSelected = selectedCategory === catKey;
          const hasAlerts = cat.lowStockCount > 0;

          return (
            <div
              key={catKey}
              onClick={() =>
                setSelectedCategory((prev) => (prev === catKey ? 'ALL' : catKey))
              }
              className={`rounded-3xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#232B26] text-white border-[#232B26] shadow-md'
                  : 'bg-white text-[#1E2320] border-[#E7E0D2] hover:border-[#8F733E]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[9px] font-mono tracking-widest uppercase ${
                      isSelected ? 'text-[#D8C496]' : 'text-[#8F733E]'
                    }`}
                  >
                    {cat.enLabel}
                  </span>
                  {hasAlerts ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                        cat.criticalCount > 0
                          ? 'bg-[#A63429] text-white'
                          : 'bg-[#FAF0D7] text-[#9A6B1F] border border-[#E5CE9B]'
                      }`}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{cat.lowStockCount} 项预警</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F6740] text-[10px] font-mono">
                      水位正常
                    </span>
                  )}
                </div>

                <h2
                  className={`font-oriental-serif text-sm font-bold mt-1 ${
                    isSelected ? 'text-white' : 'text-[#1E2320]'
                  }`}
                >
                  {cat.labelCN}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center pt-1">
                <div
                  className={`p-1.5 rounded-xl ${
                    isSelected ? 'bg-white/10' : 'bg-[#FAF8F4]'
                  }`}
                >
                  <span
                    className={`text-[9px] block ${
                      isSelected ? 'text-white/70' : 'text-[#8C8577]'
                    }`}
                  >
                    品类SKU
                  </span>
                  <span className="font-mono text-xs font-bold">{cat.totalSkus}</span>
                </div>
                <div
                  className={`p-1.5 rounded-xl ${
                    isSelected ? 'bg-white/10' : 'bg-[#FAF8F4]'
                  }`}
                >
                  <span
                    className={`text-[9px] block ${
                      isSelected ? 'text-white/70' : 'text-[#8C8577]'
                    }`}
                  >
                    在库件数
                  </span>
                  <span className="font-mono text-xs font-bold">{cat.totalUnits}</span>
                </div>
                <div
                  className={`p-1.5 rounded-xl ${
                    isSelected ? 'bg-white/10' : 'bg-[#FAF8F4]'
                  }`}
                >
                  <span
                    className={`text-[9px] block ${
                      isSelected ? 'text-white/70' : 'text-[#8C8577]'
                    }`}
                  >
                    紧急告罄
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      cat.criticalCount > 0
                        ? isSelected
                          ? 'text-[#FF9E96]'
                          : 'text-[#A63429]'
                        : ''
                    }`}
                  >
                    {cat.criticalCount}
                  </span>
                </div>
              </div>

              {hasAlerts && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTriggerBatchReplenish(catKey);
                  }}
                  className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-oriental-serif font-bold flex items-center justify-center gap-1 transition-colors ${
                    isSelected
                      ? 'bg-[#D8C496] text-[#1E2320] hover:bg-white'
                      : 'bg-[#FAF5E8] hover:bg-[#EFE3C6] text-[#8F733E] border border-[#E3D3B2]'
                  }`}
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>一键补齐本类预警 ({cat.lowStockCount}款)</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Filter Bar: Category Tabs + Low-Stock Toggle + Search + Sort */}
      <div className="bg-white rounded-3xl p-4 border border-[#E7E0D2] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Category Segmented Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: `全部库区 (${summary.totalSkus})` },
              {
                id: 'Tea',
                label: `山场原叶 (${summary.byCategory.Tea.lowStockCount}/${summary.byCategory.Tea.totalSkus})`,
              },
              {
                id: 'Ceramics',
                label: `茗壶雅瓷 (${summary.byCategory.Ceramics.lowStockCount}/${summary.byCategory.Ceramics.totalSkus})`,
              },
              {
                id: 'Consignments',
                label: `典藏寄售 (${summary.byCategory.Consignments.lowStockCount}/${summary.byCategory.Consignments.totalSkus})`,
              },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as 'ALL' | InventoryCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-oriental-serif whitespace-nowrap transition-all border ${
                  selectedCategory === tab.id
                    ? 'bg-[#232B26] text-white border-[#232B26] font-bold'
                    : 'bg-[#FAF8F4] text-[#665F52] border-[#E5DEC9] hover:border-[#232B26]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Low Stock Only Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`px-3 py-1.5 rounded-xl text-xs font-oriental-serif border flex items-center gap-1.5 transition-all ${
                onlyLowStock
                  ? 'bg-[#FDF2F0] text-[#A63429] border-[#E6B8B2] font-bold'
                  : 'bg-[#FAF8F4] text-[#5E574B] border-[#E3DDD0]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{onlyLowStock ? '当前仅看低库存预警' : '全部库存状态'}</span>
            </button>
          </div>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C867A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="按 SKU 编码、茶品器物名称、产地或仓位检索..."
              className="w-full pl-9 pr-8 py-2 bg-[#FAF8F4] rounded-xl border border-[#E5DEC9] text-xs text-[#232B26] placeholder:text-[#A0998C] focus:outline-none focus:border-[#232B26]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#8C8577] hover:text-[#232B26]"
              >
                清除
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#6B6457] bg-[#FAF8F4] px-3 py-2 rounded-xl border border-[#E5DEC9] shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#8F733E]" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'alert-priority' | 'stock-asc' | 'value-desc'
                )
              }
              aria-label="库存排序方式"
              className="bg-transparent text-xs font-oriental-serif text-[#232B26] focus:outline-none cursor-pointer"
            >
              <option value="alert-priority">按预警紧急度优先</option>
              <option value="stock-asc">按库存余量从低到高</option>
              <option value="value-desc">按货值金额从高到低</option>
            </select>
          </div>
        </div>
      </div>

      {/* SKU Inventory List with Visual Alerts & Quick Replenishment Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#7D7668] px-1">
          <span className="font-mono text-[11px]">
            当前筛选共 {filteredRecords.length} 项 SKU 档案
          </span>
          <span className="text-[11px] font-oriental-serif text-[#8F733E]">
            点击右侧快捷按钮即可实时补货入仓
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <OrientalEmptyState
            variant="shop"
            compact
            title={
              onlyLowStock
                ? '当前筛选门类下无低库存预警商品'
                : '未检索到匹配的仓储 SKU 档案'
            }
            description="所有山场原叶、名家茶器与寄售孤品均处于充盈水位，您可切换查看全部在库 SKU 或重置检索词。"
            primaryActionLabel="查看全部在库 SKU"
            onPrimaryAction={() => {
              setOnlyLowStock(false);
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((item) => {
              const alertLevel = evaluateStockAlertLevel(
                item.stockQuantity,
                item.safetyThreshold
              );
              const fillRatio = Math.min(
                100,
                Math.round((item.stockQuantity / item.maxCapacity) * 100)
              );
              const neededForFull = Math.max(1, item.maxCapacity - item.stockQuantity);
              const isJustReplenished = justReplenishedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl p-4 bg-white border transition-all space-y-3 shadow-2xs ${
                    isJustReplenished
                      ? 'border-[#2F6740] ring-2 ring-[#2F6740]/20'
                      : alertLevel === 'critical'
                      ? 'border-[#E2ABA4] bg-gradient-to-r from-[#FFFDFC] to-[#FDF6F5]'
                      : alertLevel === 'low'
                      ? 'border-[#E6D4B2]'
                      : 'border-[#ECE6DB]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Thumbnail */}
                    <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-[#181E1A] shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_INV_IMG;
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 right-1 text-center py-0.5 rounded bg-black/65 text-[#E8D6B0] font-mono text-[8px]">
                        {item.category}
                      </span>
                    </div>

                    {/* Item Details & Stock Bar */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#F3EFE7] text-[#6B6355] font-bold">
                            {item.sku}
                          </span>
                          <span className="text-[10px] font-oriental-serif text-[#8F733E] bg-[#FAF5E8] px-2 py-0.5 rounded-md border border-[#E6D8BC]">
                            {item.subCategory}
                          </span>
                        </div>

                        {/* Visual Alert Pill */}
                        {alertLevel === 'critical' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#A63429] text-white text-[10px] font-oriental-serif font-bold flex items-center gap-1 shadow-2xs">
                            <ShieldAlert className="w-3 h-3 animate-bounce" />
                            <span>紧急告罄 · CRITICAL</span>
                          </span>
                        ) : alertLevel === 'low' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0D7] text-[#9A6B1F] border border-[#E5CE9B] text-[10px] font-oriental-serif font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>库存偏低 · LOW STOCK</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F6740] text-[10px] font-oriental-serif font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>备货充盈 · HEALTHY</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-oriental-serif text-sm font-bold text-[#1F2522] truncate">
                          {item.name}
                        </h3>
                        <span className="font-mono text-xs font-bold text-[#232B26] shrink-0">
                          ¥{item.unitPrice.toLocaleString()} / {item.unitLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#7A7366] flex-wrap gap-1">
                        <span>仓位：{item.storageZone}</span>
                        <span className="font-mono flex items-center gap-1 flex-wrap">
                          <span>当前余量：</span>
                          <strong
                            className={`mx-0.5 text-xs ${
                              alertLevel === 'critical'
                                ? 'text-[#A63429]'
                                : alertLevel === 'low'
                                ? 'text-[#9A6B1F]'
                                : 'text-[#2F6740]'
                            }`}
                          >
                            {item.stockQuantity} {item.unitLabel}
                          </strong>
                          <span>
                            (安全线 {item.safetyThreshold} / 满仓 {item.maxCapacity})
                          </span>
                          {onUpdateSafetyThreshold && (
                            <span className="inline-flex items-center gap-0.5 ml-1 bg-[#FAF6EC] px-1.5 py-0.5 rounded-md border border-[#232B26]/[0.08] leading-none shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateSafetyThreshold(
                                    item.id,
                                    Math.max(1, item.safetyThreshold - 1)
                                  )
                                }
                                className="px-1 text-[10px] font-bold text-[#8F733E] hover:text-[#232B26]"
                                title="下调安全水位线"
                              >
                                -
                              </button>
                              <span className="text-[9px] text-[#8F733E]">安全线</span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateSafetyThreshold(
                                    item.id,
                                    Math.min(item.maxCapacity - 1, item.safetyThreshold + 1)
                                  )
                                }
                                className="px-1 text-[10px] font-bold text-[#8F733E] hover:text-[#232B26]"
                                title="上调安全水位线"
                              >
                                +
                              </button>
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-[#EFEAE0] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(4, fillRatio)}%`,
                            backgroundColor:
                              alertLevel === 'critical'
                                ? '#A63429'
                                : alertLevel === 'low'
                                ? '#C58B2B'
                                : '#2F6740',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Replenishment Action Bar for Store Administrators */}
                  <div className="pt-2.5 border-t border-[#F2EFE8] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#8E8779] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8F733E]" />
                      <span>上次补仓：{item.lastReplenishedAt}</span>
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-oriental-serif text-[#5C5549] mr-0.5">
                        快捷补货：
                      </span>
                      {item.quickReplenishPresets.map((presetQty) => (
                        <button
                          type="button"
                          key={presetQty}
                          onClick={() =>
                            handleQuickReplenish(item.id, presetQty, item.name)
                          }
                          className="px-2.5 py-1 rounded-xl bg-[#FAF6EC] hover:bg-[#232B26] text-[#8F733E] hover:text-white border border-[#E2D4B7] hover:border-[#232B26] text-xs font-mono font-bold transition-all active:scale-95"
                        >
                          +{presetQty}
                          {item.unitLabel}
                        </button>
                      ))}

                      {item.stockQuantity < item.maxCapacity && (
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickReplenish(item.id, neededForFull, item.name)
                          }
                          className="px-3 py-1 rounded-xl bg-[#232B26] hover:bg-[#161C18] text-[#FAF8F5] text-xs font-oriental-serif font-medium flex items-center gap-1 transition-all active:scale-95 shadow-2xs"
                        >
                          <PackagePlus className="w-3.5 h-3.5 text-[#D8C496]" />
                          <span>补至满仓 (+{neededForFull})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Replenishment Audit Trail (近期补货与出入库台账) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E0D2] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#8F733E]" />
            <h3 className="font-oriental-serif text-sm font-bold text-[#232B26]">
              掌柜补货与出入库实时流水台账
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#8C8577]">
            共记录 {replenishLogs.length} 笔操作
          </span>
        </div>

        {replenishLogs.length === 0 ? (
          <p className="text-xs text-[#8A8376] font-oriental-serif py-2">
            当前会话尚无出入库操作记录。点击上方任意商品的「快捷补货」或在前台下单结算即可生成实时出入库流水。
          </p>
        ) : (
          <div className="divide-y divide-[#F2EFE8] text-xs max-h-56 overflow-y-auto no-scrollbar">
            {replenishLogs.slice(0, 12).map((log) => {
              const isOutbound = log.movementType === 'outbound' || log.addedQuantity < 0;
              return (
                <div
                  key={log.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {isOutbound ? (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FDF2F0] text-[#A63429] border border-[#A63429]/20 font-bold leading-none whitespace-nowrap shrink-0">
                          {log.addedQuantity} 出库
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EBF3ED] text-[#2F6740] border border-[#2F6740]/20 font-bold leading-none whitespace-nowrap shrink-0">
                          +{log.addedQuantity} 入库
                        </span>
                      )}
                      <span className="font-oriental-serif font-bold text-[#232B26] truncate">
                        {log.itemName}
                      </span>
                      <span className="text-[10px] font-mono text-[#948C7E]">
                        ({log.sku})
                      </span>
                    </div>
                    <span className="text-[10px] text-[#7D7669] block mt-0.5">
                      {log.operator} · 库存由 {log.previousStock} {isOutbound ? '降至' : '升至'}{' '}
                      <strong className={isOutbound ? 'text-[#A63429]' : 'text-[#2F6740]'}>
                        {log.newStock}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#948C7E] shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
        </>
      )}

      {/* MODULE 2: Order Fulfillment & Palate Review Monitor (订单履约与茶评监管台) */}
      {activeBackendTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E0D2] shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold block">
                  ORDER FULFILLMENT & PALATE SYNC · 订单履约与茶评中枢
                </span>
                <h2 className="font-oriental-serif text-base font-bold text-[#232B26] mt-0.5">
                  全馆茶礼订单调度与五维茶评归档
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-xl bg-[#FAF6EC] border border-[#E5D7B8] text-[#8F733E] font-bold">
                  累计营收 ¥{backendMetrics.totalGmvRevenue.toLocaleString()}
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#EBF3ED] text-[#2F6740] font-bold">
                  已归档茶评 {backendMetrics.reviewedOrdersCount}/{backendMetrics.totalOrdersCount}
                </span>
              </div>
            </div>

            {userOrders.length === 0 ? (
              <OrientalEmptyState
                variant="orders"
                compact
                title="当前尚无待履约茶礼订单"
                description="茶客在前台茶铺选购结算后，订单将自动同步至此履约台并扣减对应库区水位。"
              />
            ) : (
              <div className="space-y-3 pt-1">
                {userOrders.map((order) => {
                  const statusLabel = orderFulfillmentMap[order.id] ?? order.statusText;
                  const nextFulfillmentLabel =
                    statusLabel.includes('已签收')
                      ? '顺丰冷链已备妥 · 待揽收'
                      : statusLabel.includes('派送中')
                      ? '席主已签收 · 茶评归档'
                      : '顺丰茶礼专递 · 派送中';

                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E7E0D2] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#232B26]">
                            {order.id}
                          </span>
                          <span className="text-[10px] font-mono text-[#8C8577]">
                            {order.createdAt}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#232B26] text-[#EEDB9F] text-[10px] font-oriental-serif font-bold">
                          {statusLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#4A4439]">
                        <div className="space-y-0.5">
                          {order.items.map((it) => (
                            <div key={it.id} className="font-oriental-serif">
                              {it.name} <span className="font-mono text-[#8F733E]">×{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-sm font-bold text-[#1F2522] block">
                            ¥{order.totalAmount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#8F733E]">
                            +{order.pointsEarned} 叶值 / +{order.tokensEarned} 嘉叶币
                          </span>
                        </div>
                      </div>

                      {(order.reviewNote || (order.reviewTags && order.reviewTags.length > 0)) && (
                        <div className="p-2.5 rounded-xl bg-white border border-[#E6DEC8] text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-oriental-serif font-bold text-[#8F733E]">
                              席主品鉴手记 · 已同步五维茶性雷达
                            </span>
                            {order.syncedToTeaProfile && (
                              <span className="text-[9px] font-mono text-[#2F6740] bg-[#EBF3ED] px-2 py-0.5 rounded leading-none shrink-0 border border-[#2F6740]/20">
                                5D RADAR SYNCED
                              </span>
                            )}
                          </div>
                          {order.reviewNote && (
                            <p className="text-[#4E473B] italic">「{order.reviewNote}」</p>
                          )}
                          {order.reviewTags && order.reviewTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {order.reviewTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded bg-[#FAF5E8] text-[#8F733E] text-[10px] font-oriental-serif border border-[#8F733E]/20 leading-none shrink-0"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#ECE5D7] flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-[#847D6F]">
                          防伪溯源码：{order.antiCounterfeitCode || 'CCJY-AUTH-VERIFIED'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            zenAudio.playZenChime();
                            setOrderFulfillmentMap((prev) => ({
                              ...prev,
                              [order.id]: nextFulfillmentLabel,
                            }));
                            setBatchSuccessBanner(
                              `已更新订单 ${order.id} 履约状态为「${nextFulfillmentLabel}」`
                            );
                            setTimeout(() => setBatchSuccessBanner(null), 3000);
                          }}
                          className="px-3 py-1 rounded-xl bg-[#232B26] hover:bg-[#161C18] text-[#FAF8F5] text-[11px] font-oriental-serif flex items-center gap-1 transition-all"
                        >
                          <Truck className="w-3 h-3 text-[#D8C496]" />
                          <span>推进履约：{nextFulfillmentLabel.split(' · ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 3: Salon Reservation & Sommelier Dispatch (茶席排期与司茶调度) */}
      {activeBackendTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E0D2] shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold block">
                  SALON SCHEDULE & SOMMELIER DISPATCH · 茶席排期与司茶调度
                </span>
                <h2 className="font-oriental-serif text-base font-bold text-[#232B26] mt-0.5">
                  南山私享茶室预约席次与司茶师指派
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-xl bg-[#FAF6EC] border border-[#E5D7B8] text-[#8F733E] font-bold">
                  有效席位 {backendMetrics.activeBookingsCount} 席 · 共 {backendMetrics.totalBookedGuests} 位茶客
                </span>
              </div>
            </div>

            {activeBookings.length === 0 ? (
              <OrientalEmptyState
                variant="bookings"
                compact
                title="当前尚无待接待茶室预约"
                description="茶客在前台「私享茶室」预订席位后，可在此指派专属司茶师并触发 24h 临席关怀推送。"
              />
            ) : (
              <div className="space-y-3 pt-1">
                {activeBookings.map((booking) => {
                  const assignedSommelier =
                    bookingSommelierMap[booking.id] ?? booking.sommelier;
                  const isVerified = verifiedBookingMap[booking.id] ?? false;

                  return (
                    <div
                      key={booking.id}
                      className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E7E0D2] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-oriental-serif text-sm font-bold text-[#232B26]">
                              {booking.roomName}
                            </span>
                            {isVerified ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F6740] text-[10px] font-oriental-serif font-bold">
                                ✦ 已到店核销入席
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-[#FAF0D7] text-[#9A6B1F] text-[10px] font-oriental-serif font-bold">
                                待入席 · 备器中
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-[#7C7567] mt-0.5">
                            {booking.date} · {booking.timeSlot} · 宾客 {booking.guests} 位 · 钦定配茶：{booking.pairedTea}
                          </p>
                        </div>
                        <span className="font-mono text-sm font-bold text-[#8F733E]">
                          ¥{booking.finalPrice}
                        </span>
                      </div>

                      {/* Sommelier Assignment Selector */}
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-[#ECE5D7]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-oriental-serif text-[#645C4F]">
                            指派执壶司茶师：
                          </span>
                          {SOMMELIER_ROSTER.map((som) => (
                            <button
                              key={som}
                              type="button"
                              onClick={() => {
                                zenAudio.playZenChime();
                                setBookingSommelierMap((prev) => ({
                                  ...prev,
                                  [booking.id]: som,
                                }));
                                setBatchSuccessBanner(
                                  `已为「${booking.roomName}」指派首席司茶师：${som}`
                                );
                                setTimeout(() => setBatchSuccessBanner(null), 3000);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-oriental-serif border transition-all ${
                                assignedSommelier === som
                                  ? 'bg-[#232B26] text-white border-[#232B26] font-bold'
                                  : 'bg-white text-[#645C4F] border-[#E2D8C3] hover:border-[#232B26]'
                              }`}
                            >
                              {som}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {onTriggerCourtesyPush && (
                            <button
                              type="button"
                              onClick={() => {
                                zenAudio.playZenChime();
                                onTriggerCourtesyPush(booking);
                                setBatchSuccessBanner(
                                  `已向茶客推送「${booking.roomName}」24h 临席关怀提醒`
                                );
                                setTimeout(() => setBatchSuccessBanner(null), 3000);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF5E8] text-[#8F733E] border border-[#DECFA8] text-[11px] font-oriental-serif flex items-center gap-1"
                            >
                              <BellRing className="w-3 h-3" />
                              <span>推送临席关怀</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              zenAudio.playZenChime();
                              setVerifiedBookingMap((prev) => ({
                                ...prev,
                                [booking.id]: !isVerified,
                              }));
                              setBatchSuccessBanner(
                                !isVerified
                                  ? `已核销茶席预约码 ${booking.id}，茶席备水焚香完毕`
                                  : `已恢复预约码 ${booking.id} 为待入席状态`
                              );
                              setTimeout(() => setBatchSuccessBanner(null), 3000);
                            }}
                            className="px-3 py-1 rounded-xl bg-[#232B26] text-[#FAF8F5] text-[11px] font-oriental-serif flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3 text-[#D8C496]" />
                            <span>{isVerified ? '已核销' : '扫码核销入席'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 4: Consignment Appraisal, Regional Heatmap & Showcase Advisor */}
      {activeBackendTab === 'consignments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E0D2] shadow-2xs space-y-4">
            {/* Header & Metrics */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#F0EAE0] pb-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold block">
                  CONSIGNMENT HEATMAP & SHOWCASE ADVISOR · 典藏寄售热度与展示智库
                </span>
                <h2 className="font-oriental-serif text-base font-bold text-[#232B26] mt-0.5">
                  全国寄售热度地图 · 藏家优化展示建议与估价调控
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                <span className="px-3 py-1 rounded-xl bg-[#FAF6EC] border border-[#E5D7B8] text-[#8F733E] font-bold">
                  池内总估值 ¥{backendMetrics.consignmentPoolValuation.toLocaleString()}
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#EBF3ED] text-[#2F6740] font-bold">
                  预计服务佣金 ¥{backendMetrics.estimatedConsignmentCommission.toLocaleString()}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#232B26] text-[#EEDB9F] font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#EEDB9F]" />
                  <span>实时咨询 931次</span>
                </span>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex bg-[#EFECE3] p-1 rounded-2xl border border-[#DCD5C4]">
              <button
                type="button"
                onClick={() => setConsignmentSubTab('heatmap')}
                className={`flex-1 py-2 rounded-xl text-xs font-oriental-serif transition-all flex items-center justify-center gap-1.5 ${
                  consignmentSubTab === 'heatmap'
                    ? 'bg-[#232B26] text-[#FAF8F5] font-bold shadow-xs'
                    : 'text-[#6B6456] hover:text-[#232B26]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#EEDB9F]" />
                <span>全国寄售热度地图与咨询频率</span>
              </button>
              <button
                type="button"
                onClick={() => setConsignmentSubTab('advice')}
                className={`flex-1 py-2 rounded-xl text-xs font-oriental-serif transition-all flex items-center justify-center gap-1.5 ${
                  consignmentSubTab === 'advice'
                    ? 'bg-[#8F733E] text-white font-bold shadow-xs'
                    : 'text-[#6B6456] hover:text-[#232B26]'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#FFF2D6]" />
                <span>藏家优化展示建议 (AI Advisor)</span>
              </button>
              <button
                type="button"
                onClick={() => setConsignmentSubTab('desk')}
                className={`flex-1 py-2 rounded-xl text-xs font-oriental-serif transition-all flex items-center justify-center gap-1.5 ${
                  consignmentSubTab === 'desk'
                    ? 'bg-[#232B26] text-[#FAF8F5] font-bold shadow-xs'
                    : 'text-[#6B6456] hover:text-[#232B26]'
                }`}
              >
                <Warehouse className="w-3.5 h-3.5 text-[#EEDB9F]" />
                <span>寄售保真审定与估价台</span>
              </button>
            </div>

            {/* SUB-TAB 1: Regional Consignment Heatmap */}
            {consignmentSubTab === 'heatmap' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Heatmap Highlights Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFCC] space-y-0.5">
                    <span className="text-[10px] text-[#867F71] font-oriental-serif block">核心茶文化圈</span>
                    <span className="font-mono text-base font-bold text-[#232B26]">5 大核心重镇</span>
                    <p className="text-[10px] text-[#8F733E]">深港·潮汕·苏沪·京津·成渝</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFCC] space-y-0.5">
                    <span className="text-[10px] text-[#867F71] font-oriental-serif block">累计席主关注度</span>
                    <span className="font-mono text-base font-bold text-[#232B26]">16,660 次</span>
                    <p className="text-[10px] text-[#2F6740]">+18.4% 环比上升</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFCC] space-y-0.5">
                    <span className="text-[10px] text-[#867F71] font-oriental-serif block">认藏咨询总量</span>
                    <span className="font-mono text-base font-bold text-[#232B26]">931 次咨询</span>
                    <p className="text-[10px] text-[#8F733E]">平均转化率 15.6%</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFCC] space-y-0.5">
                    <span className="text-[10px] text-[#867F71] font-oriental-serif block">最快结缘周期</span>
                    <span className="font-mono text-base font-bold text-[#2F6740]">10 天平均</span>
                    <p className="text-[10px] text-[#786E5E]">潮州老朱泥手拉壶居首</p>
                  </div>
                </div>

                {/* Regional Heatmap Cards Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#787163]">
                    <span className="font-oriental-serif font-bold flex items-center gap-1.5 text-[#232B26]">
                      <MapPin className="w-3.5 h-3.5 text-[#8F733E]" />
                      <span>全国各地区会员关注与咨询频次热度</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#8C8577]">
                      点击区域查看藏家画像与适销品类
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {REGIONAL_CONSIGNMENT_HEAT_DATA.map((region) => {
                      const isSelected = selectedHeatRegionId === region.regionId;
                      return (
                        <div
                          key={region.regionId}
                          onClick={() => {
                            zenAudio.playZenChime();
                            setSelectedHeatRegionId(region.regionId);
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden space-y-2.5 ${
                            isSelected
                              ? 'bg-white border-[#232B26] shadow-sm ring-1 ring-[#232B26]'
                              : 'bg-[#FAF8F4] border-[#E8DFC9] hover:border-[#8F733E] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-oriental-serif font-bold text-xs text-[#222824]">
                              {region.regionName}
                            </span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  region.heatScore >= 90
                                    ? 'bg-[#B23A2B] animate-pulse'
                                    : 'bg-[#8F733E]'
                                }`}
                              />
                              <span className="font-mono text-xs font-bold text-[#8F733E]">
                                {region.heatScore}分
                              </span>
                            </div>
                          </div>

                          {/* Metric Indicators */}
                          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono py-1 border-y border-[#EDE6D6]">
                            <div>
                              <span className="text-[#898274] block">会员数</span>
                              <span className="font-bold text-[#232B26]">
                                {region.memberCount.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#898274] block">咨询量</span>
                              <span className="font-bold text-[#232B26]">
                                {region.inquiriesCount}次
                              </span>
                            </div>
                            <div>
                              <span className="text-[#898274] block">咨询频次</span>
                              <span className="font-bold text-[#8F733E]">
                                {region.inquiryFrequency}
                              </span>
                            </div>
                          </div>

                          {/* Preferred Categories */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#867E70] font-oriental-serif block">
                              最青睐名物类别：
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {region.preferredCategories.map((cat) => (
                                <span
                                  key={cat}
                                  className="text-[9px] font-oriental-serif px-2 py-0.5 rounded bg-[#EFE9DC] text-[#4A4337] border border-[#232B26]/[0.08] leading-none shrink-0"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Buyer preference excerpt */}
                          <p className="text-[10px] text-[#696153] font-light leading-relaxed line-clamp-2">
                            {region.featuredPreference}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-[#8C8578] font-mono pt-1">
                            <span>均结缘周期：{region.avgClosingCycleDays}天</span>
                            <span className="text-[#8F733E] font-oriental-serif">
                              {isSelected ? '✓ 当前已选中' : '点击查看'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Heat Ranking Bar */}
                <div className="p-3.5 rounded-2xl bg-[#F6F2E8] border border-[#E3D9C3] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-oriental-serif font-bold text-[#232B26]">
                      五大茶文化圈寄售关注热度梯队分布
                    </span>
                    <span className="text-[10px] font-mono text-[#8F733E]">
                      数据源于春城嘉叶全国会员查验与咨询网络
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {REGIONAL_CONSIGNMENT_HEAT_DATA.map((r) => (
                      <div key={r.regionId} className="flex items-center gap-2 text-xs">
                        <span className="w-16 font-oriental-serif text-[11px] text-[#4C4538] shrink-0 text-right">
                          {r.shortName}
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-[#E5DEC9] overflow-hidden relative">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#8F733E] to-[#232B26]"
                            style={{ width: `${r.heatScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-[#7C7566] w-14 shrink-0">
                          {r.heatScore}分 / {r.inquiriesCount}询
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: Showcase Optimization Advisor */}
            {consignmentSubTab === 'advice' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-[#7B7365] gap-2">
                  <span className="font-oriental-serif min-w-0 truncate">
                    结合地区会员关注偏好与历史真实成交案例，为藏家生成定向优化建议：
                  </span>
                  <span className="font-mono text-[10px] text-[#8F733E] whitespace-nowrap shrink-0">
                    共 {consignments.length} 件在架流转名物
                  </span>
                </div>

                {consignments.map((cItem) => {
                  const advice = generateConsignmentShowcaseAdvice(cItem);
                  const isApplied = !!appliedAdviceMap[cItem.id];
                  const isExpanded = expandedAdviceItemId === cItem.id;

                  return (
                    <div
                      key={cItem.id}
                      className="p-4 rounded-2xl bg-white border border-[#E7DFCC] shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cItem.image}
                            alt={cItem.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_INV_IMG;
                            }}
                            className="w-16 h-16 rounded-2xl object-cover bg-[#1C2420] shrink-0"
                          />
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#232B26] text-[#EEDB9F] whitespace-nowrap shrink-0">
                                {cItem.certificateNo}
                              </span>
                              <span className="text-[10px] font-oriental-serif font-bold text-[#8F733E] bg-[#FAF5E8] px-2 py-0.5 rounded border border-[#E3D4B6] whitespace-nowrap shrink-0">
                                展示评级分：{advice.overallDisplayScore}分 ({advice.ratingLabel})
                              </span>
                            </div>
                            <h3 className="font-oriental-serif text-sm font-bold text-[#1E2420] truncate">
                              {cItem.name}
                            </h3>
                            <p className="text-[11px] text-[#7A7365] font-mono truncate">
                              委托人：{cItem.sellerName} · 当前挂牌：¥{cItem.currentPrice.toLocaleString()} · 关注度：{cItem.views}次
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedAdviceItemId(isExpanded ? null : cItem.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE9DC] text-[#696152] text-xs font-oriental-serif flex items-center gap-1 border border-[#DDD3BC] transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>{isExpanded ? '收起建议' : '查看3条优化建议'}</span>
                        </button>
                      </div>

                      {/* Advice Bullet List */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                        {advice.adviceList.map((adv) => (
                          <div
                            key={adv.type}
                            className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE4D2] space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-oriental-serif font-bold text-[#232B26] text-[11px]">
                                {adv.title}
                              </span>
                              <span className="text-[9px] font-mono text-[#2F6740] bg-[#EAF2EC] px-2 py-0.5 rounded font-bold border border-[#2F6740]/20 leading-none shrink-0">
                                {adv.expectedUplift}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#5A5346] font-light leading-relaxed">
                              {adv.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Expanded Section with Historical Benchmark Sales */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-[#F0EAE0] space-y-2.5 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-oriental-serif font-bold text-[#232B26] flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5 text-[#8F733E]" />
                              <span>春城嘉叶历史可比流转成交案例参考</span>
                            </span>
                            <span className="text-[10px] font-mono text-[#8C8578]">
                              成交数据库已锚定
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {advice.historicalBenchmarks.map((bench) => (
                              <div
                                key={bench.id}
                                className="p-2.5 rounded-xl bg-[#F6F2E8] border border-[#E3D9C3] text-[11px] space-y-0.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-oriental-serif font-bold text-[#232B26] truncate">
                                    {bench.name}
                                  </span>
                                  <span className="font-mono font-bold text-[#8F733E]">
                                    ¥{bench.soldPrice.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-[#7A7264] font-mono">
                                  <span>成交地区：{bench.region}</span>
                                  <span>撮合周期：{bench.cycleDays}天</span>
                                </div>
                                <p className="text-[10px] text-[#635C4E] font-light">
                                  特征：{bench.keyCondition}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Quick Apply Action */}
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[10px] text-[#787163] font-oriental-serif">
                              ※ 采纳优化策略后，系统将自动向委托人推送展示优化指引。
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                zenAudio.playZenChime();
                                setAppliedAdviceMap((prev) => ({ ...prev, [cItem.id]: true }));
                                setBatchSuccessBanner(
                                  `已为藏品「${cItem.name}」采纳优化展示建议，并将图文优化指引推送给委托人！`
                                );
                                setTimeout(() => setBatchSuccessBanner(null), 3000);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-oriental-serif font-medium flex items-center gap-1 transition-all ${
                                isApplied
                                  ? 'bg-[#EBF3ED] text-[#2F6740] border border-[#BDD7C2]'
                                  : 'bg-[#8F733E] hover:bg-[#785E2F] text-white shadow-2xs'
                              }`}
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                              <span>{isApplied ? '✓ 已采纳展示优化策略' : '一键采纳并通知藏家'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* SUB-TAB 3: Appraisal & Custody Desk (Existing Price Adjustment Functionality) */}
            {consignmentSubTab === 'desk' && (
              <div className="space-y-3 pt-1">
                {consignments.length === 0 ? (
                  <OrientalEmptyState
                    variant="consign"
                    compact
                    title="寄售保真库尚无藏品"
                    description="当藏家提交老茶或名家壶寄售申请后，掌柜可在此核发防伪证号并调控流转挂牌价。"
                  />
                ) : (
                  consignments.map((cItem) => {
                    const isSold = cItem.status === 'sold';
                    return (
                      <div
                        key={cItem.id}
                        className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E7E0D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cItem.image}
                            alt={cItem.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_INV_IMG;
                            }}
                            className="w-14 h-14 rounded-2xl object-cover bg-[#1C2420] shrink-0"
                          />
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#232B26] text-[#EEDB9F]">
                                {cItem.certificateNo}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-oriental-serif font-bold ${
                                  isSold
                                    ? 'bg-[#EFEAE0] text-[#7D7567]'
                                    : 'bg-[#EBF3ED] text-[#2F6740]'
                                }`}
                              >
                                {isSold ? '已结缘售罄' : '保真在售流转'}
                              </span>
                            </div>
                            <h3 className="font-oriental-serif text-sm font-bold text-[#1F2522] truncate">
                              {cItem.name}
                            </h3>
                            <p className="text-[11px] text-[#7C7567] font-mono">
                              委托人：{cItem.sellerName} ({cItem.sellerTier}) · 鉴藏：{cItem.appraisalOrg} · 当前挂牌：
                              <strong className="text-[#8F733E] ml-1">
                                ¥{cItem.currentPrice.toLocaleString()}
                              </strong>
                            </p>
                          </div>
                        </div>

                        {onUpdateConsignmentItem && (
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                zenAudio.playZenChime();
                                const nextPrice = Math.max(200, cItem.currentPrice - 200);
                                onUpdateConsignmentItem(cItem.id, { currentPrice: nextPrice });
                                setBatchSuccessBanner(
                                  `已下调寄售藏品「${cItem.name}」审定挂牌价至 ¥${nextPrice.toLocaleString()}`
                                );
                                setTimeout(() => setBatchSuccessBanner(null), 3000);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF5E8] text-[#6B6355] border border-[#E2D6BE] text-xs font-mono"
                            >
                              -¥200
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                zenAudio.playZenChime();
                                const nextPrice = cItem.currentPrice + 200;
                                onUpdateConsignmentItem(cItem.id, { currentPrice: nextPrice });
                                setBatchSuccessBanner(
                                  `已上调寄售藏品「${cItem.name}」审定挂牌价至 ¥${nextPrice.toLocaleString()}`
                                );
                                setTimeout(() => setBatchSuccessBanner(null), 3000);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF5E8] text-[#8F733E] border border-[#E2D6BE] text-xs font-mono font-bold"
                            >
                              +¥200
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                zenAudio.playZenChime();
                                const nextStatus = isSold ? 'active' : 'sold';
                                onUpdateConsignmentItem(cItem.id, { status: nextStatus });
                                setBatchSuccessBanner(
                                  `已切换寄售藏品「${cItem.name}」状态为：${
                                    nextStatus === 'active' ? '保真在售流转' : '已结缘售罄'
                                  }`
                                );
                                setTimeout(() => setBatchSuccessBanner(null), 3000);
                              }}
                              className="px-3 py-1 rounded-xl bg-[#232B26] text-[#FAF8F5] text-xs font-oriental-serif"
                            >
                              {isSold ? '重新挂牌上架' : '标记已结缘'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

