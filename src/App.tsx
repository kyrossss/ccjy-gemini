/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WechatShell } from './components/WechatShell';
import { HeaderNav } from './components/HeaderNav';
import { TabBar, TabKey } from './components/TabBar';
import { HomeView } from './components/views/HomeView';
import { ShopView, ShopCategoryFilter } from './components/views/ShopView';
import { ConsignView } from './components/views/ConsignView';
import { TeaRoomView } from './components/views/TeaRoomView';
import { MemberView } from './components/views/MemberView';

import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ConsignmentModal } from './components/ConsignmentModal';
import { ReservationModal } from './components/ReservationModal';
import { PointsRedeemModal } from './components/PointsRedeemModal';
import { DailyTeaRitual } from './components/DailyTeaRitual';
import { BrewingGuideModal } from './components/BrewingGuideModal';
import { NotificationBanner, NotificationData } from './components/NotificationBanner';
import { TeaInvitationModal, BookingInvitationData } from './components/TeaInvitationModal';
import { TeaResumeModal, ResumeTabType } from './components/TeaResumeModal';
import { TeaProfileDossierModal } from './components/TeaProfileDossierModal';
import { SalonInvitationPosterModal } from './components/SalonInvitationPosterModal';
import { CourtesyMoodMemoModal } from './components/CourtesyMoodMemoModal';
import { InventoryManagementDashboard } from './components/InventoryManagementDashboard';

import {
  PRODUCTS,
  TeaItem,
  ConsignmentItem,
  TeaRoom,
  PointsItem,
  TEA_ROOMS,
} from './data/mockData';
import { TeaWisdomItem } from './data/teaWisdomData';
import {
  MemberTierLevel,
  CartItem,
  calculateDiscountedPrice,
  calculateEarnedPoints,
  calculateTokenReward,
  resolveUpgradedTier,
  TIER_CONFIGS,
} from './utils/teaLogic';
import {
  UserOrderRecord,
  OrderItemRecord,
  createOrderRecord,
  createPointsRedeemOrderRecord,
  createConsignmentPurchaseOrderRecord,
  updateOrderReview,
  extractAggregatedOrderReviews,
  syncOrderReviewToCustomPalateTags,
} from './utils/orderResumeLogic';
import { generateCuratedTeaProfile, NICHE_TEA_CATALOG } from './utils/teaProfileLogic';
import {
  evaluateImminentBookingCourtesy,
  CourtesyMoodMemo,
} from './utils/courtesyNotificationLogic';
import {
  loadPersistedAppState,
  savePersistedAppState,
  resetPersistedAppState,
} from './utils/storagePersistence';
import {
  InventoryRecord,
  InventoryCategory,
  ReplenishLogEntry,
  buildInitialInventoryRecords,
  computeInventorySummary,
  replenishInventoryItem,
  batchReplenishLowStock,
  deductInventoryOnOrderWithAudit,
  updateItemSafetyThreshold,
  evaluateInventoryValuationStatus,
  DEFAULT_VALUATION_THRESHOLD,
} from './utils/inventoryLogic';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [isBackendViewOpen, setIsBackendViewOpen] = useState<boolean>(false);

  // Cross-view Shop Filter State (from Home 4 Pillars, D3 Mountain Terroir & Brewing Guide)
  const [shopFilter, setShopFilter] = useState<{
    category: ShopCategoryFilter;
    keyword: string;
  }>({
    category: 'all',
    keyword: '',
  });

  // Hydrate initial state from localStorage (Round 1 Persistence Closed Loop)
  const [initialPersisted] = useState(() => loadPersistedAppState());

  // Store Backend Inventory State (Tea, Ceramics, Consignments)
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>(
    () =>
      initialPersisted.inventoryRecords ??
      buildInitialInventoryRecords(PRODUCTS, initialPersisted.consignments)
  );
  const [replenishLogs, setReplenishLogs] = useState<ReplenishLogEntry[]>(
    () => initialPersisted.replenishLogs ?? []
  );
  const [valuationThreshold, setValuationThreshold] = useState<number>(
    () => initialPersisted.valuationThreshold ?? DEFAULT_VALUATION_THRESHOLD
  );

  // Member State
  const [userTier, setUserTier] = useState<MemberTierLevel>(initialPersisted.userTier);
  const [leafPoints, setLeafPoints] = useState<number>(initialPersisted.leafPoints);
  const [chaTokens, setChaTokens] = useState<number>(initialPersisted.chaTokens);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(
    initialPersisted.hasCheckedInToday
  );

  // Cart State
  const [cartItems, setCartItems] = useState<(CartItem & { image?: string })[]>(
    initialPersisted.cartItems
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Consignment List State
  const [consignments, setConsignments] = useState<ConsignmentItem[]>(
    initialPersisted.consignments
  );

  // Bookings State
  const [activeBookings, setActiveBookings] = useState<BookingInvitationData[]>(
    initialPersisted.activeBookings
  );

  // User Orders State
  const [userOrders, setUserOrders] = useState<UserOrderRecord[]>(initialPersisted.userOrders);

  // Salon Courtesy & Mood Memo State
  const [moodMemoBooking, setMoodMemoBooking] = useState<BookingInvitationData | null>(null);
  const [isMoodMemoOpen, setIsMoodMemoOpen] = useState(false);
  const [savedMoodMemo, setSavedMoodMemo] = useState<CourtesyMoodMemo | null>(
    initialPersisted.savedMoodMemo
  );

  // Preselected Tea for Salon Reservation (Closed Loop from Tea Profile Dossier / Terroir Explorer / Brewing Guide)
  const [preselectedSalonTea, setPreselectedSalonTea] = useState<string | null>(
    initialPersisted.preselectedSalonTea
  );

  // Persisted Custom Palate Tags (Closed Loop between TeaProfileDossierModal & MemberView 5D Radar)
  const [customPalateTags, setCustomPalateTags] = useState<string[] | null>(
    initialPersisted.customPalateTags ?? null
  );

  // Reservation Calendar Selected Date & TimeSlot State
  const [selectedReservationDate, setSelectedReservationDate] = useState<string>('2026-11-08');
  const [selectedReservationTimeSlot, setSelectedReservationTimeSlot] = useState<string | null>(
    null
  );
  const [isCharcoalPrepActive, setIsCharcoalPrepActive] = useState<boolean>(true);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<TeaItem | null>(null);
  const [consignModalState, setConsignModalState] = useState<{
    isOpen: boolean;
    item: ConsignmentItem | null;
    mode: 'view' | 'submit';
  }>({
    isOpen: false,
    item: null,
    mode: 'view',
  });
  const [reservationRoom, setReservationRoom] = useState<TeaRoom | null>(null);
  const [isPointsRedeemOpen, setIsPointsRedeemOpen] = useState(false);
  const [isDailyRitualOpen, setIsDailyRitualOpen] = useState(false);
  const [selectedWisdom, setSelectedWisdom] = useState<TeaWisdomItem | null>(null);
  const [activeNotification, setActiveNotification] = useState<NotificationData | null>(null);
  const [invitationBooking, setInvitationBooking] = useState<BookingInvitationData | null>(null);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [posterBooking, setPosterBooking] = useState<BookingInvitationData | null>(null);
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  // Resume Modal State
  const [resumeModalState, setResumeModalState] = useState<{
    isOpen: boolean;
    initialTab: ResumeTabType;
  }>({
    isOpen: false,
    initialTab: 'orders',
  });

  // Tea Character Dossier Modal State
  const [isTeaProfileOpen, setIsTeaProfileOpen] = useState(false);

  // Automatically persist state changes to localStorage
  useEffect(() => {
    savePersistedAppState({
      userTier,
      leafPoints,
      chaTokens,
      hasCheckedInToday,
      cartItems,
      consignments,
      activeBookings,
      userOrders,
      savedMoodMemo,
      preselectedSalonTea,
      customPalateTags,
      inventoryRecords,
      replenishLogs,
      valuationThreshold,
    });
  }, [
    userTier,
    leafPoints,
    chaTokens,
    hasCheckedInToday,
    cartItems,
    consignments,
    activeBookings,
    userOrders,
    savedMoodMemo,
    preselectedSalonTea,
    customPalateTags,
    inventoryRecords,
    replenishLogs,
    valuationThreshold,
  ]);

  // Global ESC key support to close topmost active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isPosterOpen) setIsPosterOpen(false);
      else if (isInvitationOpen) setIsInvitationOpen(false);
      else if (isMoodMemoOpen) setIsMoodMemoOpen(false);
      else if (isTeaProfileOpen) setIsTeaProfileOpen(false);
      else if (resumeModalState.isOpen)
        setResumeModalState((prev) => ({ ...prev, isOpen: false }));
      else if (reservationRoom) setReservationRoom(null);
      else if (consignModalState.isOpen)
        setConsignModalState({ isOpen: false, item: null, mode: 'view' });
      else if (isPointsRedeemOpen) setIsPointsRedeemOpen(false);
      else if (isDailyRitualOpen) setIsDailyRitualOpen(false);
      else if (selectedWisdom) setSelectedWisdom(null);
      else if (selectedProduct) setSelectedProduct(null);
      else if (isCartOpen) setIsCartOpen(false);
      else if (isBackendViewOpen) setIsBackendViewOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPosterOpen,
    isInvitationOpen,
    isMoodMemoOpen,
    isTeaProfileOpen,
    resumeModalState.isOpen,
    reservationRoom,
    consignModalState.isOpen,
    isPointsRedeemOpen,
    isDailyRitualOpen,
    selectedWisdom,
    selectedProduct,
    isCartOpen,
    isBackendViewOpen,
  ]);

  // Unified helper to award leafPoints and automatically promote userTier if crossing threshold
  const awardLeafPointsWithTierCheck = (earnedPoints: number) => {
    if (earnedPoints <= 0) return;
    const nextTotal = leafPoints + earnedPoints;
    setLeafPoints(nextTotal);
    const tierCheck = resolveUpgradedTier(userTier, nextTotal);
    if (tierCheck.upgraded) {
      setUserTier(tierCheck.nextTier);
    }
  };

  // Store Backend Inventory Replenishment Handlers
  const handleReplenishInventoryItem = (itemId: string, addQuantity: number) => {
    const timestamp = new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const result = replenishInventoryItem(inventoryRecords, itemId, addQuantity, timestamp);
    setInventoryRecords(result.updatedRecords);
    if (result.logEntry) {
      setReplenishLogs((prev) => [result.logEntry!, ...prev]);
    }
  };

  const handleBatchReplenishInventory = (categoryFilter: 'ALL' | InventoryCategory = 'ALL') => {
    const timestamp = new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const result = batchReplenishLowStock(inventoryRecords, categoryFilter, timestamp);
    setInventoryRecords(result.updatedRecords);
    if (result.logs.length > 0) {
      setReplenishLogs((prev) => [...result.logs, ...prev]);
    }
  };

  const handleResetInventory = () => {
    setInventoryRecords(buildInitialInventoryRecords(PRODUCTS, consignments));
    setReplenishLogs([]);
  };

  const handleUpdateSafetyThreshold = (itemId: string, newThreshold: number) => {
    setInventoryRecords((prev) => updateItemSafetyThreshold(prev, itemId, newThreshold));
  };

  const handleUpdateConsignmentItem = (
    itemId: string,
    patch: Partial<Pick<ConsignmentItem, 'currentPrice' | 'status'>>
  ) => {
    setConsignments((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, ...patch } : c))
    );
    setInventoryRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== itemId) return rec;
        return {
          ...rec,
          unitPrice: patch.currentPrice ?? rec.unitPrice,
          stockQuantity:
            patch.status === 'sold'
              ? 0
              : patch.status === 'active' && rec.stockQuantity === 0
              ? 1
              : rec.stockQuantity,
        };
      })
    );
  };

  const handleTriggerValuationShortagePush = (status?: {
    currentValuation: number;
    threshold: number;
    deficit: number;
  }) => {
    const activeSummary = computeInventorySummary(inventoryRecords);
    const currVal = status ? status.currentValuation : activeSummary.totalValuation;
    const thresh = status ? status.threshold : valuationThreshold;
    const def = status ? status.deficit : Math.max(0, thresh - currVal);

    setActiveNotification({
      id: `valuation-shortage-${Date.now()}`,
      title: '春城嘉叶 · 掌柜货值告警推送',
      message: `全品类总货值仅 ¥${(currVal / 10000).toFixed(1)}万，已跌破安全基线 ¥${(thresh / 10000).toFixed(1)}万 (缺口 ¥${(def / 10000).toFixed(1)}万)，请及时补仓`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      roomName: '全馆仓储库区',
      date: new Date().toLocaleDateString('zh-CN'),
      timeSlot: '供应链调度 · 实时告警',
      kind: 'valuation-shortage',
      valuationMeta: {
        currentValuation: currVal,
        threshold: thresh,
        deficit: def,
      },
    });
  };

  const handleResetDemoState = () => {
    const fresh = resetPersistedAppState();
    setUserTier(fresh.userTier);
    setLeafPoints(fresh.leafPoints);
    setChaTokens(fresh.chaTokens);
    setHasCheckedInToday(fresh.hasCheckedInToday);
    setCartItems(fresh.cartItems);
    setConsignments(fresh.consignments);
    setActiveBookings(fresh.activeBookings);
    setUserOrders(fresh.userOrders);
    setSavedMoodMemo(fresh.savedMoodMemo);
    setPreselectedSalonTea(fresh.preselectedSalonTea);
    setCustomPalateTags(fresh.customPalateTags ?? null);
    setShopFilter({ category: 'all', keyword: '' });
    setInventoryRecords(
      fresh.inventoryRecords ?? buildInitialInventoryRecords(PRODUCTS, fresh.consignments)
    );
    setReplenishLogs(fresh.replenishLogs ?? []);
    setValuationThreshold(fresh.valuationThreshold ?? DEFAULT_VALUATION_THRESHOLD);
  };

  // Cross-view Shop Filtering Handler (from Home 4 Pillars, D3 Mountain Terroir & Brewing Guide)
  const handleFilterShop = (category: ShopCategoryFilter, keyword: string) => {
    setShopFilter({ category, keyword });
    setCurrentTab('shop');
  };

  // Deep-link from TeaResumeModal Order Item to ProductDetailModal or ConsignmentModal
  const handleOpenOrderItemDetail = (orderItem: OrderItemRecord) => {
    // 1. Check if it matches a consignment item
    const matchedConsign = consignments.find(
      (c) => c.id === orderItem.id || orderItem.name.includes(c.name)
    );
    if (matchedConsign) {
      setConsignModalState({ isOpen: true, item: matchedConsign, mode: 'view' });
      return;
    }

    // 2. Check if it matches a standard catalog product
    const matchedProduct = PRODUCTS.find(
      (p) => p.id === orderItem.id || orderItem.name.includes(p.name)
    );
    if (matchedProduct) {
      setSelectedProduct(matchedProduct);
      return;
    }

    // 3. Check if it matches a niche tea recommendation
    const matchedNiche = NICHE_TEA_CATALOG.find(
      (n) => n.id === orderItem.id || orderItem.name.includes(n.name)
    );
    if (matchedNiche) {
      setSelectedProduct({
        id: matchedNiche.id,
        name: matchedNiche.name,
        enName: matchedNiche.subCategory,
        category: 'tea',
        subCategory: matchedNiche.subCategory,
        price: matchedNiche.price,
        image: matchedNiche.image,
        tagline: `${matchedNiche.origin} · ${matchedNiche.sampleSpec}`,
        description: matchedNiche.matchReason,
        origin: matchedNiche.origin,
        specs: [
          { label: '规格', value: matchedNiche.sampleSpec },
          { label: '稀缺度', value: matchedNiche.rarity },
          { label: '契合度', value: `${matchedNiche.matchScore}%` },
        ],
        inStock: true,
      });
      return;
    }

    // 4. Fallback: open Shop filtered by item name
    handleFilterShop('all', orderItem.name.split('（')[0]);
  };

  const handleTriggerCourtesyPush = (booking?: BookingInvitationData) => {
    const targetList = booking ? [booking] : activeBookings;
    const courtesy = evaluateImminentBookingCourtesy(targetList, new Date(), true);
    if (courtesy.booking) {
      setInvitationBooking(courtesy.booking);
      setActiveNotification({
        id: `courtesy-24h-${Date.now()}`,
        title: courtesy.notificationTitle,
        message: courtesy.notificationMessage,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        roomName: courtesy.booking.roomName,
        date: courtesy.booking.date,
        timeSlot: courtesy.booking.timeSlot,
        kind: 'courtesy-24h',
        booking: courtesy.booking,
      });
    }
  };

  const handleOpenMoodMemo = (booking?: BookingInvitationData) => {
    const target = booking || activeBookings[0] || null;
    if (target) {
      setMoodMemoBooking(target);
      setIsMoodMemoOpen(true);
      setActiveNotification(null);
    }
  };

  // Automatic 24-hour approaching reservation check on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const check = evaluateImminentBookingCourtesy(activeBookings, new Date(), true);
      if (check.isImminent && check.booking) {
        setInvitationBooking(check.booking);
        setActiveNotification({
          id: `courtesy-auto-${check.booking.id}`,
          title: check.notificationTitle,
          message: check.notificationMessage,
          timestamp: '临席提醒',
          roomName: check.booking.roomName,
          date: check.booking.date,
          timeSlot: check.booking.timeSlot,
          kind: 'courtesy-24h',
          booking: check.booking,
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Cart Handlers
  const handleAddToCart = (item: TeaItem, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        { id: item.id, name: item.name, price: item.price, quantity, image: item.image },
      ];
    });
  };

  const handleReorderItems = (items: OrderItemRecord[]) => {
    setCartItems((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        if (item.price <= 0) return;
        const existingIdx = next.findIndex((i) => i.id === item.id);
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + item.quantity,
          };
        } else {
          next.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          });
        }
      });
      return next;
    });
    setIsCartOpen(true);
  };

  const handleSaveOrderReview = (
    orderId: string,
    reviewNote: string,
    reviewTags: string[],
    syncToTeaProfile = true
  ) => {
    const nextOrders = updateOrderReview(
      userOrders,
      orderId,
      reviewNote,
      reviewTags,
      syncToTeaProfile
    );
    setUserOrders(nextOrders);

    const nextPalateTags = syncOrderReviewToCustomPalateTags(
      customPalateTags,
      nextOrders,
      reviewTags,
      reviewNote,
      syncToTeaProfile
    );
    setCustomPalateTags(nextPalateTags);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutSuccess = (orderInfo: {
    total: number;
    pointsEarned: number;
    tokensUsed: number;
    tokensEarned: number;
    itemCount: number;
    orderedItems: (CartItem & { image?: string })[];
  }) => {
    const newOrder = createOrderRecord({
      items: orderInfo.orderedItems.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
      })),
      total: orderInfo.total,
      pointsEarned: orderInfo.pointsEarned,
      tokensEarned: orderInfo.tokensEarned,
      tokensUsed: orderInfo.tokensUsed,
    });
    setUserOrders((prev) => [newOrder, ...prev]);

    // If any ordered item was a consignment item, mark it sold in consignments list
    const orderedIds = new Set(orderInfo.orderedItems.map((it) => it.id));
    setConsignments((prev) =>
      prev.map((c) =>
        orderedIds.has(c.id) ? { ...c, status: 'sold', bidsCount: (c.bidsCount ?? 0) + 1 } : c
      )
    );

    // Sync storefront purchase deduction to backend inventory records with outbound audit logs
    const timestamp = new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const deductResult = deductInventoryOnOrderWithAudit(
      inventoryRecords,
      orderInfo.orderedItems.map((it) => ({ id: it.id, quantity: it.quantity })),
      timestamp,
      '前台茶铺结算 · 自动出库'
    );
    setInventoryRecords(deductResult.updatedRecords);
    if (deductResult.outboundLogs.length > 0) {
      setReplenishLogs((prev) => [...deductResult.outboundLogs, ...prev]);
    }

    // Automatically trigger valuation shortage push if purchase drops total valuation below threshold
    const postOrderSummary = computeInventorySummary(deductResult.updatedRecords);
    if (postOrderSummary.totalValuation < valuationThreshold) {
      handleTriggerValuationShortagePush({
        currentValuation: postOrderSummary.totalValuation,
        threshold: valuationThreshold,
        deficit: Math.max(0, valuationThreshold - postOrderSummary.totalValuation),
      });
    }

    setChaTokens((prev) => Math.max(0, prev - orderInfo.tokensUsed + orderInfo.tokensEarned));
    awardLeafPointsWithTierCheck(orderInfo.pointsEarned);
  };

  // Consignment Submission & Purchase Closed-Loop Handlers
  const handleSubmitConsignment = (newItem: ConsignmentItem) => {
    setConsignments((prev) => [newItem, ...prev]);
    setInventoryRecords((prev) => [
      {
        id: newItem.id,
        sku: `CCJY-CON-${String(prev.filter((r) => r.category === 'Consignments').length + 1).padStart(3, '0')}`,
        name: newItem.name,
        category: 'Consignments',
        categoryLabelCN: '典藏寄售 · 保真孤品',
        subCategory: '新入库寄售',
        origin: `鉴藏证号 ${newItem.certificateNo}`,
        unitPrice: newItem.currentPrice,
        stockQuantity: 1,
        safetyThreshold: 2,
        maxCapacity: 6,
        unitLabel: '件',
        storageZone: '保真恒温保险库 · C区',
        image: newItem.image,
        lastReplenishedAt: '刚刚入库',
        quickReplenishPresets: [1, 2, 4],
      },
      ...prev,
    ]);
    setChaTokens((prev) => prev + Math.floor(newItem.currentPrice / 50));
  };

  const handleAddToCartConsignment = (item: ConsignmentItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev;
      return [
        ...prev,
        {
          id: item.id,
          name: `${item.name}（鉴藏孤品）`,
          price: item.currentPrice,
          quantity: 1,
          image: item.image,
        },
      ];
    });
  };

  const handleDirectAcquireConsignment = (item: ConsignmentItem) => {
    const discountedPrice = calculateDiscountedPrice(item.currentPrice, userTier);
    const pointsEarned = calculateEarnedPoints(discountedPrice, userTier);
    const tokensEarned = calculateTokenReward(discountedPrice, userTier);

    const newOrder = createConsignmentPurchaseOrderRecord({
      id: item.id,
      name: item.name,
      currentPrice: item.currentPrice,
      certificateNo: item.certificateNo,
      image: item.image,
      discountedPrice,
      pointsEarned,
      tokensEarned,
    });

    setUserOrders((prev) => [newOrder, ...prev]);
    setConsignments((prev) =>
      prev.map((c) =>
        c.id === item.id ? { ...c, status: 'sold', bidsCount: (c.bidsCount ?? 0) + 1 } : c
      )
    );
    const timestamp = new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const deductResult = deductInventoryOnOrderWithAudit(
      inventoryRecords,
      [{ id: item.id, quantity: 1 }],
      timestamp,
      '寄售孤品结缘 · 自动出库'
    );
    setInventoryRecords(deductResult.updatedRecords);
    if (deductResult.outboundLogs.length > 0) {
      setReplenishLogs((prev) => [...deductResult.outboundLogs, ...prev]);
    }
    setConsignModalState((prev) =>
      prev.item && prev.item.id === item.id
        ? {
            ...prev,
            item: {
              ...prev.item,
              status: 'sold',
              bidsCount: (prev.item.bidsCount ?? 0) + 1,
            },
          }
        : prev
    );
    awardLeafPointsWithTierCheck(pointsEarned);
    setChaTokens((prev) => prev + tokensEarned);
  };

  // Booking Confirmation & Cancellation Closed-Loop Handlers
  const handleConfirmBooking = (booking: BookingInvitationData) => {
    setActiveBookings((prev) => [booking, ...prev]);
    awardLeafPointsWithTierCheck(Math.floor((booking.finalPrice || 0) * 1.5));
    setPreselectedSalonTea(null);
    setActiveNotification({
      id: booking.id,
      title: '春城嘉叶 · 雅席钦定通知',
      message: `您已成功预留「${booking.roomName}」茶席（配茶：${booking.pairedTea}）`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      roomName: booking.roomName,
      date: booking.date,
      timeSlot: booking.timeSlot,
      booking,
    });
    setInvitationBooking(booking);
  };

  const handleCancelBooking = (bookingId: string) => {
    setActiveBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  // Preselect Salon Tea Handler (Closed Loop from Tea Profile Dossier, Terroir Explorer, ProductDetailModal & BrewingGuideModal)
  const handleSelectSalonTeaForReservation = (teaName: string, openModalImmediately = true) => {
    setPreselectedSalonTea(teaName);
    setIsBackendViewOpen(false);
    setCurrentTab('room');
    if (openModalImmediately) {
      setReservationRoom(TEA_ROOMS[0]);
    }
    setActiveNotification({
      id: `salon-tea-${Date.now()}`,
      title: '春城嘉叶 · 试饮茗茶已备妥',
      message: `已为您在私享茶室锁定「${teaName}」，可直接预留雅席`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      roomName: TEA_ROOMS[0].name,
      date: selectedReservationDate,
      timeSlot: '午席 (14:00 - 17:00)',
    });
  };

  // Quick Reserve Featured Room from HomeView
  const handleQuickReserveRoom = (room: TeaRoom) => {
    setIsBackendViewOpen(false);
    setCurrentTab('room');
    setReservationRoom(room);
  };

  // Points Redeem Closed-Loop Handler (Creates verifiable redemption order in userOrders)
  const handleRedeemPoints = (item: PointsItem, costPoints: number) => {
    setLeafPoints((prev) => Math.max(0, prev - costPoints));
    setChaTokens((prev) => prev + 1);
    const redeemOrder = createPointsRedeemOrderRecord(item);
    setUserOrders((prev) => [redeemOrder, ...prev]);
  };

  // Daily Ritual Checkin Handler
  const handleCheckInSuccess = (earnedPoints: number, earnedTokens: number) => {
    setHasCheckedInToday(true);
    awardLeafPointsWithTierCheck(earnedPoints);
    setChaTokens((prev) => prev + earnedTokens);
  };

  const userOwnedConsignments = consignments.filter((c) => c.sellerName === '当前会员');
  const inventorySummary = computeInventorySummary(inventoryRecords);
  const inventoryValuationStatus = evaluateInventoryValuationStatus(
    inventorySummary.totalValuation,
    valuationThreshold
  );

  // Compute live 5D Personal Tea Character Radar from orders, tasting reviews & persisted custom palate tags
  const aggregatedReviews = extractAggregatedOrderReviews(userOrders);
  const activePalateTags =
    customPalateTags && customPalateTags.length > 0
      ? customPalateTags
      : aggregatedReviews.reviewTags;
  const liveTeaProfile = generateCuratedTeaProfile(
    userOrders.flatMap((o) => o.items),
    aggregatedReviews.reviewNotes,
    activePalateTags
  );

  return (
    <WechatShell activeTab={currentTab}>
      {/* Simulated Local Push Notification Banner */}
      <NotificationBanner
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        onClick={() => {
          if (activeNotification?.kind === 'valuation-shortage') {
            setIsBackendViewOpen(true);
          } else if (activeNotification?.booking) {
            setInvitationBooking(activeNotification.booking);
            setIsInvitationOpen(true);
          } else if (activeBookings[0]) {
            setInvitationBooking(activeBookings[0]);
            setIsInvitationOpen(true);
          }
          setActiveNotification(null);
        }}
        onOpenMoodMemo={(b) => handleOpenMoodMemo(b)}
      />

      {/* Sticky Mini Program Header */}
      <HeaderNav
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenRitual={() => setIsDailyRitualOpen(true)}
        onToggleBackend={() => setIsBackendViewOpen((prev) => !prev)}
        isBackendActive={isBackendViewOpen}
        lowStockAlertCount={inventorySummary.lowStockTotalCount}
        isValuationShortageAlert={inventoryValuationStatus.isBelowThreshold}
      />

      {/* Main Tab Destination Views or Store Backend Inventory Management View */}
      <main className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
        {isBackendViewOpen ? (
          <InventoryManagementDashboard
            records={inventoryRecords}
            replenishLogs={replenishLogs}
            onReplenishItem={handleReplenishInventoryItem}
            onBatchReplenish={handleBatchReplenishInventory}
            onResetInventory={handleResetInventory}
            onBackToStorefront={() => setIsBackendViewOpen(false)}
            onTriggerValuationPush={handleTriggerValuationShortagePush}
            valuationThreshold={valuationThreshold}
            onUpdateValuationThreshold={setValuationThreshold}
            onUpdateSafetyThreshold={handleUpdateSafetyThreshold}
            userOrders={userOrders}
            activeBookings={activeBookings}
            consignments={consignments}
            onTriggerCourtesyPush={(b) => handleTriggerCourtesyPush(b)}
            onOpenInvitation={(b) => {
              setInvitationBooking(b);
              setIsInvitationOpen(true);
            }}
            onUpdateConsignmentItem={handleUpdateConsignmentItem}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeView
                onSelectTab={setCurrentTab}
                onOpenProduct={(item) => setSelectedProduct(item)}
                onOpenRitual={() => setIsDailyRitualOpen(true)}
                onOpenWisdom={(item) => setSelectedWisdom(item)}
                onReserveTeaInSalon={(teaName) => handleSelectSalonTeaForReservation(teaName, true)}
                onQuickReserveRoom={handleQuickReserveRoom}
                onFilterShop={handleFilterShop}
                userTier={userTier}
              />
            )}

            {currentTab === 'shop' && (
              <ShopView
                onOpenProduct={(item) => setSelectedProduct(item)}
                onAddToCart={handleAddToCart}
                userTier={userTier}
                initialCategory={shopFilter.category}
                initialSearchQuery={shopFilter.keyword}
                onGoToHomeTerroir={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'consign' && (
              <ConsignView
                consignments={consignments}
                onOpenConsignmentModal={(item, mode) =>
                  setConsignModalState({ isOpen: true, item, mode })
                }
                onGoToShop={() => setCurrentTab('shop')}
                userTier={userTier}
              />
            )}

            {currentTab === 'room' && (
              <TeaRoomView
                onSelectRoom={(room, options) => {
                  if (options?.dateStr) {
                    setSelectedReservationDate(options.dateStr);
                  }
                  if (options?.timeSlot) {
                    setSelectedReservationTimeSlot(options.timeSlot);
                  } else {
                    setSelectedReservationTimeSlot(null);
                  }
                  if (options?.pairedTea) {
                    setPreselectedSalonTea(options.pairedTea);
                  }
                  if (options?.isCharcoalPrep !== undefined) {
                    setIsCharcoalPrepActive(options.isCharcoalPrep);
                  }
                  setReservationRoom(room);
                }}
                userTier={userTier}
                selectedDate={selectedReservationDate}
                onSelectDate={setSelectedReservationDate}
                preselectedTea={preselectedSalonTea}
                onSelectPreselectedTea={(teaName) => setPreselectedSalonTea(teaName)}
                onClearPreselectedTea={() => setPreselectedSalonTea(null)}
                onOpenInvitation={(b) => {
                  setInvitationBooking(b);
                  setIsInvitationOpen(true);
                }}
                onOpenPosterModal={(b) => {
                  setPosterBooking(b);
                  setIsPosterOpen(true);
                }}
                onOpenMoodMemo={(b) => handleOpenMoodMemo(b)}
                onTriggerCourtesyPush={(b) => handleTriggerCourtesyPush(b)}
                onCancelBooking={handleCancelBooking}
                onGoToHomeTerroir={() => setCurrentTab('home')}
                activeBookings={activeBookings}
              />
            )}

            {currentTab === 'member' && (
              <MemberView
                userTier={userTier}
                setUserTier={setUserTier}
                leafPoints={leafPoints}
                chaTokens={chaTokens}
                onOpenPointsRedeem={() => setIsPointsRedeemOpen(true)}
                onOpenDailyRitual={() => setIsDailyRitualOpen(true)}
                onOpenConsignmentSubmit={() =>
                  setConsignModalState({ isOpen: true, item: null, mode: 'submit' })
                }
                recentOrdersCount={userOrders.length}
                activeBookingsCount={activeBookings.length}
                activeBookings={activeBookings}
                userConsignmentsCount={userOwnedConsignments.length}
                onOpenSalonReservation={() => setCurrentTab('room')}
                onOpenResume={(tab) => setResumeModalState({ isOpen: true, initialTab: tab })}
                onOpenTeaProfile={() => setIsTeaProfileOpen(true)}
                onOpenInvitation={(b) => {
                  setInvitationBooking(b);
                  setIsInvitationOpen(true);
                }}
                onOpenPosterModal={(b) => {
                  setPosterBooking(b);
                  setIsPosterOpen(true);
                }}
                onOpenMoodMemo={(b) => handleOpenMoodMemo(b)}
                onTriggerCourtesyPush={(b) => handleTriggerCourtesyPush(b)}
                savedMemo={savedMoodMemo}
                onResetDemoState={handleResetDemoState}
                onOpenInventoryBackend={() => setIsBackendViewOpen(true)}
                lowStockAlertCount={inventorySummary.lowStockTotalCount}
                liveCharacterTitle={liveTeaProfile.characterTitle}
                liveRadarScores={liveTeaProfile.radar}
              />
            )}
          </>
        )}
      </main>

      {/* Fixed Mini Program Tab Bar */}
      <TabBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setIsBackendViewOpen(false);
          setCurrentTab(tab);
        }}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onReserveTeaInSalon={(teaName) => handleSelectSalonTeaForReservation(teaName, true)}
        userTier={userTier}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        userTier={userTier}
        availableTokens={chaTokens}
        onCheckoutSuccess={handleCheckoutSuccess}
        onOpenResumeOrders={() => setResumeModalState({ isOpen: true, initialTab: 'orders' })}
        onGoToShop={() => setCurrentTab('shop')}
        onGoToConsign={() => setCurrentTab('consign')}
      />

      <ConsignmentModal
        isOpen={consignModalState.isOpen}
        onClose={() => setConsignModalState({ isOpen: false, item: null, mode: 'view' })}
        selectedItem={consignModalState.item}
        mode={consignModalState.mode}
        userTier={userTier}
        onSubmitConsignment={handleSubmitConsignment}
        onAddToCartConsignment={handleAddToCartConsignment}
        onDirectAcquireConsignment={handleDirectAcquireConsignment}
        onOpenResumeOrders={() => setResumeModalState({ isOpen: true, initialTab: 'orders' })}
      />

      <ReservationModal
        isOpen={reservationRoom !== null}
        onClose={() => {
          setReservationRoom(null);
          setSelectedReservationTimeSlot(null);
        }}
        room={reservationRoom}
        userTier={userTier}
        initialDate={selectedReservationDate}
        initialTimeSlot={selectedReservationTimeSlot}
        preselectedTea={preselectedSalonTea}
        initialIsCharcoalPrep={isCharcoalPrepActive}
        onOpenInvitation={(b) => {
          setInvitationBooking(b);
          setIsInvitationOpen(true);
        }}
        onOpenPosterModal={(b) => {
          setPosterBooking(b);
          setIsPosterOpen(true);
        }}
        onConfirmBooking={handleConfirmBooking}
      />

      <PointsRedeemModal
        isOpen={isPointsRedeemOpen}
        onClose={() => setIsPointsRedeemOpen(false)}
        leafPoints={leafPoints}
        chaTokens={chaTokens}
        onRedeem={handleRedeemPoints}
        onOpenResumeOrders={() => setResumeModalState({ isOpen: true, initialTab: 'orders' })}
      />

      <DailyTeaRitual
        isOpen={isDailyRitualOpen}
        onClose={() => setIsDailyRitualOpen(false)}
        onCheckInSuccess={handleCheckInSuccess}
        hasCheckedInToday={hasCheckedInToday}
      />

      <BrewingGuideModal
        item={selectedWisdom}
        onClose={() => setSelectedWisdom(null)}
        onExploreProducts={(category = 'all', keyword = '') => {
          setSelectedWisdom(null);
          handleFilterShop(category, keyword);
        }}
        onReserveSalonWithTea={(teaName) => {
          setSelectedWisdom(null);
          handleSelectSalonTeaForReservation(teaName, true);
        }}
      />

      {/* Elegant Tea Ceremony Invitation Card Modal with One-Click Calendar Export */}
      <TeaInvitationModal
        booking={invitationBooking}
        isOpen={isInvitationOpen}
        onClose={() => setIsInvitationOpen(false)}
        onOpenPosterModal={(b) => {
          setIsInvitationOpen(false);
          setPosterBooking(b);
          setIsPosterOpen(true);
        }}
      />

      {/* Tea Resume Archive Modal (Orders, Salon Bookings, and Consignment Heritage) */}
      <TeaResumeModal
        isOpen={resumeModalState.isOpen}
        onClose={() => setResumeModalState((prev) => ({ ...prev, isOpen: false }))}
        initialTab={resumeModalState.initialTab}
        orders={userOrders}
        bookings={activeBookings}
        consignments={userOwnedConsignments}
        customPalateTags={customPalateTags}
        onOpenInvitation={(b) => {
          setInvitationBooking(b);
          setIsInvitationOpen(true);
        }}
        onOpenPosterModal={(b) => {
          setPosterBooking(b);
          setIsPosterOpen(true);
        }}
        onOpenMoodMemo={(b) => handleOpenMoodMemo(b)}
        onCancelBooking={handleCancelBooking}
        onOpenConsignmentDetail={(item) => {
          setConsignModalState({ isOpen: true, item, mode: 'view' });
        }}
        onOpenNewConsignment={() => {
          setConsignModalState({ isOpen: true, item: null, mode: 'submit' });
        }}
        onGoToRooms={() => setCurrentTab('room')}
        onGoToShop={() => setCurrentTab('shop')}
        onSaveOrderReview={handleSaveOrderReview}
        onReorderItems={handleReorderItems}
        onOpenOrderItemDetail={handleOpenOrderItemDetail}
        onOpenTeaProfile={() => setIsTeaProfileOpen(true)}
      />

      <TeaProfileDossierModal
        isOpen={isTeaProfileOpen}
        onClose={() => setIsTeaProfileOpen(false)}
        userOrders={userOrders}
        customPalateTags={customPalateTags}
        onUpdateCustomPalateTags={(tags) => setCustomPalateTags(tags)}
        onAddToCart={handleAddToCart}
        onSelectSalonTea={(teaName) => handleSelectSalonTeaForReservation(teaName, true)}
        userName="林清羽"
        userTierTitle={TIER_CONFIGS[userTier].name}
      />

      {/* AI Tea Salon Invitation WeChat Poster Modal */}
      <SalonInvitationPosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
        booking={posterBooking}
      />

      {/* Salon Courtesy Pre-Arrival Mood Memo Modal */}
      <CourtesyMoodMemoModal
        isOpen={isMoodMemoOpen}
        onClose={() => setIsMoodMemoOpen(false)}
        booking={moodMemoBooking}
        existingMemo={savedMoodMemo}
        onSaveMemo={(memo) => setSavedMoodMemo(memo)}
      />
    </WechatShell>
  );
}

