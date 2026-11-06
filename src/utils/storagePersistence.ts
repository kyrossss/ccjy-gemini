import { ConsignmentItem, CONSIGNMENT_ITEMS, PRODUCTS } from '../data/mockData';
import { MemberTierLevel, CartItem } from './teaLogic';
import { UserOrderRecord, INITIAL_USER_ORDERS } from './orderResumeLogic';
import { CourtesyMoodMemo } from './courtesyNotificationLogic';
import {
  InventoryRecord,
  ReplenishLogEntry,
  buildInitialInventoryRecords,
  DEFAULT_VALUATION_THRESHOLD,
} from './inventoryLogic';

export const APP_STORAGE_KEY = 'ccjy_app_state_v1';

export interface ActiveBookingRecord {
  id: string;
  roomName: string;
  date: string;
  timeSlot: string;
  guests: number;
  sommelier: string;
  pairedTea: string;
  finalPrice: number;
  bookingCode?: string;
}

export interface PersistedAppState {
  userTier: MemberTierLevel;
  leafPoints: number;
  chaTokens: number;
  hasCheckedInToday: boolean;
  cartItems: (CartItem & { image?: string })[];
  consignments: ConsignmentItem[];
  activeBookings: ActiveBookingRecord[];
  userOrders: UserOrderRecord[];
  savedMoodMemo: CourtesyMoodMemo | null;
  preselectedSalonTea: string | null;
  customPalateTags?: string[] | null;
  inventoryRecords?: InventoryRecord[];
  replenishLogs?: ReplenishLogEntry[];
  valuationThreshold?: number;
}

export function getDefaultPersistedState(): PersistedAppState {
  const defaultConsignments = CONSIGNMENT_ITEMS.map((item) => ({ ...item }));
  return {
    userTier: 'MASTER',
    leafPoints: 6850,
    chaTokens: 320,
    hasCheckedInToday: false,
    cartItems: [
      {
        id: 'tea-02',
        name: '丛味百年·老枞水仙',
        price: 980,
        quantity: 1,
        image: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
      },
    ],
    consignments: defaultConsignments,
    activeBookings: [
      {
        id: 'YUN-SEAT-892104',
        roomName: "「月藏」THE MOON'S SILENT RETREAT",
        date: '2026-11-06',
        timeSlot: '午席 (14:00 - 17:00)',
        guests: 2,
        sommelier: '苏婉',
        pairedTea: '荒野头春白毫银针',
        finalPrice: 612,
        bookingCode: 'YUN-SEAT-892104',
      },
    ],
    userOrders: INITIAL_USER_ORDERS.map((order) => ({
      ...order,
      items: order.items.map((it) => ({ ...it })),
    })),
    savedMoodMemo: null,
    preselectedSalonTea: null,
    customPalateTags: null,
    inventoryRecords: buildInitialInventoryRecords(PRODUCTS, defaultConsignments),
    replenishLogs: [],
    valuationThreshold: DEFAULT_VALUATION_THRESHOLD,
  };
}

const VALID_TIERS: MemberTierLevel[] = ['GUEST', 'ENTHUSIAST', 'MASTER', 'YINSHAN'];

/**
 * Safely hydrate persisted application state from storage with field-level fallbacks
 */
export function loadPersistedAppState(
  storage?: Pick<Storage, 'getItem'> | null
): PersistedAppState {
  const defaults = getDefaultPersistedState();
  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined' && window.localStorage
      ? window.localStorage
      : null;

  if (!targetStorage) return defaults;

  try {
    const raw = targetStorage.getItem(APP_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<PersistedAppState>;
    if (!parsed || typeof parsed !== 'object') return defaults;

    return {
      userTier:
        parsed.userTier && VALID_TIERS.includes(parsed.userTier)
          ? parsed.userTier
          : defaults.userTier,
      leafPoints:
        typeof parsed.leafPoints === 'number' && Number.isFinite(parsed.leafPoints)
          ? Math.max(0, parsed.leafPoints)
          : defaults.leafPoints,
      chaTokens:
        typeof parsed.chaTokens === 'number' && Number.isFinite(parsed.chaTokens)
          ? Math.max(0, parsed.chaTokens)
          : defaults.chaTokens,
      hasCheckedInToday:
        typeof parsed.hasCheckedInToday === 'boolean'
          ? parsed.hasCheckedInToday
          : defaults.hasCheckedInToday,
      cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : defaults.cartItems,
      consignments:
        Array.isArray(parsed.consignments) && parsed.consignments.length > 0
          ? parsed.consignments
          : defaults.consignments,
      activeBookings: Array.isArray(parsed.activeBookings)
        ? parsed.activeBookings
        : defaults.activeBookings,
      userOrders:
        Array.isArray(parsed.userOrders) && parsed.userOrders.length > 0
          ? parsed.userOrders
          : defaults.userOrders,
      savedMoodMemo: parsed.savedMoodMemo ?? defaults.savedMoodMemo,
      preselectedSalonTea:
        typeof parsed.preselectedSalonTea === 'string'
          ? parsed.preselectedSalonTea
          : defaults.preselectedSalonTea,
      customPalateTags: Array.isArray(parsed.customPalateTags)
        ? parsed.customPalateTags
        : defaults.customPalateTags,
      inventoryRecords:
        Array.isArray(parsed.inventoryRecords) && parsed.inventoryRecords.length > 0
          ? parsed.inventoryRecords
          : defaults.inventoryRecords,
      replenishLogs: Array.isArray(parsed.replenishLogs)
        ? parsed.replenishLogs
        : defaults.replenishLogs,
      valuationThreshold:
        typeof parsed.valuationThreshold === 'number' &&
        Number.isFinite(parsed.valuationThreshold) &&
        parsed.valuationThreshold > 0
          ? parsed.valuationThreshold
          : defaults.valuationThreshold,
    };
  } catch {
    return defaults;
  }
}

/**
 * Persist full application state to storage safely
 */
export function savePersistedAppState(
  state: PersistedAppState,
  storage?: Pick<Storage, 'setItem'> | null
): boolean {
  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined' && window.localStorage
      ? window.localStorage
      : null;

  if (!targetStorage) return false;

  try {
    targetStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/**
 * Reset persisted state back to clean initial demo defaults
 */
export function resetPersistedAppState(
  storage?: Pick<Storage, 'removeItem'> | null
): PersistedAppState {
  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined' && window.localStorage
      ? window.localStorage
      : null;

  try {
    targetStorage?.removeItem(APP_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }

  return getDefaultPersistedState();
}
