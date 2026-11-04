/**
 * Pure business logic and types for Orders, Bookings, and Consignment Resumes
 */

export interface OrderItemRecord {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface UserOrderRecord {
  id: string;
  createdAt: string;
  items: OrderItemRecord[];
  totalAmount: number;
  pointsEarned: number;
  tokensEarned: number;
  tokensUsed: number;
  shippingCompany: string;
  trackingNumber: string;
  status: 'shipping' | 'delivered' | 'completed';
  statusText: string;
  antiCounterfeitCode: string;
}

/**
 * Generate a simulated unique order record after checkout
 */
export function createOrderRecord(params: {
  items: OrderItemRecord[];
  total: number;
  pointsEarned: number;
  tokensEarned: number;
  tokensUsed: number;
}): UserOrderRecord {
  const timestamp = Date.now();
  const dateStr = new Date().toISOString().slice(0, 10);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `CCJY-ORD-${dateStr.replace(/-/g, '')}-${randomSuffix}`;
  const trackingNumber = `SF${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  const antiCounterfeitCode = `CHUN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id: orderId,
    createdAt: `${dateStr} ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`,
    items: params.items,
    totalAmount: params.total,
    pointsEarned: params.pointsEarned,
    tokensEarned: params.tokensEarned,
    tokensUsed: params.tokensUsed,
    shippingCompany: '顺丰速运 · 雅器恒温冷链特快',
    trackingNumber,
    status: 'shipping',
    statusText: '已备茶出库 · 顺丰特快在途',
    antiCounterfeitCode,
  };
}

/**
 * Format countdown seconds into MM:SS
 */
export function formatTimerSeconds(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safeSec / 60);
  const s = safeSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Default initial mock orders for demo
 */
export const INITIAL_USER_ORDERS: UserOrderRecord[] = [
  {
    id: 'CCJY-ORD-20261102-8392',
    createdAt: '2026-11-02 16:45',
    items: [
      {
        id: 'tea-02',
        name: '丛味百年·老枞水仙',
        price: 980,
        quantity: 1,
        image: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
      },
    ],
    totalAmount: 882,
    pointsEarned: 1323,
    tokensEarned: 13,
    tokensUsed: 0,
    shippingCompany: '顺丰速运 · 雅器特快',
    trackingNumber: 'SF193820491038',
    status: 'shipping',
    statusText: '运输中 · 预计明日送达',
    antiCounterfeitCode: 'CHUN-WUYI-8392',
  },
  {
    id: 'CCJY-ORD-20261028-4912',
    createdAt: '2026-10-28 11:20',
    items: [
      {
        id: 'pot-01',
        name: '吴瑞全手拉朱泥梨形壶',
        price: 4200,
        quantity: 1,
        image: '/assets/aistudio/IMG_6487_f774f6f1.JPG',
      },
    ],
    totalAmount: 3780,
    pointsEarned: 5670,
    tokensEarned: 56,
    tokensUsed: 50,
    shippingCompany: '顺丰速运 · 贵重名品专送',
    trackingNumber: 'SF182930192840',
    status: 'completed',
    statusText: '已签收 · 证书与金石印章已入阁',
    antiCounterfeitCode: 'CHUN-WRQ-4912',
  },
];
