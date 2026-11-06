/**
 * Pure logic for the Oriental Tea Reservation Calendar
 * Handles month day grid generation, auspicious days, availability status, and solar term annotations.
 */

export interface CalendarDayInfo {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  status: 'available' | 'auspicious' | 'booked';
  statusText: string;
  solarTerm?: string;
  availableRoomsCount: number;
}

/**
 * Known traditional lunar/solar terms or auspicious tea gathering days for reference
 */
export const SOLAR_TERMS_MAP: Record<string, string> = {
  '11-07': '立冬',
  '11-08': '吉日',
  '11-12': '初雪试茶',
  '11-15': '望月雅集',
  '11-20': '松风煮泉',
  '11-22': '小雪',
  '11-28': '暖炉啜茗',
};

/**
 * Format date as YYYY-MM-DD with zero-padding
 */
export function formatDateStr(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

/**
 * Calculate the availability and auspicious status for a given date
 */
export function calculateDateTeaStatus(
  dateStr: string,
  todayStr: string = new Date().toISOString().split('T')[0]
): {
  status: 'available' | 'auspicious' | 'booked';
  statusText: string;
  solarTerm?: string;
  availableRoomsCount: number;
} {
  const mmDd = dateStr.slice(5); // MM-DD
  const solarTerm = SOLAR_TERMS_MAP[mmDd];

  // Specific dates marked as fully booked for realistic feel
  const fullyBookedDates = ['11-04', '11-09', '11-16', '11-23'];
  if (fullyBookedDates.includes(mmDd)) {
    return {
      status: 'booked',
      statusText: '席满',
      solarTerm,
      availableRoomsCount: 0,
    };
  }

  // Auspicious days
  if (solarTerm) {
    return {
      status: 'auspicious',
      statusText: '吉日',
      solarTerm,
      availableRoomsCount: 3,
    };
  }

  return {
    status: 'available',
    statusText: '宜茶',
    availableRoomsCount: 2,
  };
}

/**
 * Generate full 35 or 42 grid matrix for a calendar month
 */
export function generateMonthDays(
  year: number,
  monthIndex: number, // 0-based
  todayStr: string = new Date().toISOString().split('T')[0]
): CalendarDayInfo[] {
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 for Sunday
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const days: CalendarDayInfo[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    const dateStr = formatDateStr(prevYear, prevMonthIdx, dayNum);

    days.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isPast: dateStr < todayStr,
      isToday: dateStr === todayStr,
      status: 'available',
      statusText: '余席',
      availableRoomsCount: 1,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateStr(year, monthIndex, d);
    const isPast = dateStr < todayStr;
    const teaStatus = calculateDateTeaStatus(dateStr, todayStr);

    days.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isPast,
      isToday: dateStr === todayStr,
      status: isPast ? 'booked' : teaStatus.status,
      statusText: isPast ? '已过' : teaStatus.statusText,
      solarTerm: teaStatus.solarTerm,
      availableRoomsCount: isPast ? 0 : teaStatus.availableRoomsCount,
    });
  }

  // Next month leading days to complete full grid
  const remainingSlots = 7 - (days.length % 7);
  if (remainingSlots < 7) {
    for (let nextDay = 1; nextDay <= remainingSlots; nextDay++) {
      const nextMonthIdx = monthIndex === 11 ? 0 : monthIndex + 1;
      const nextYear = monthIndex === 11 ? year + 1 : year;
      const dateStr = formatDateStr(nextYear, nextMonthIdx, nextDay);

      days.push({
        dateStr,
        dayNumber: nextDay,
        isCurrentMonth: false,
        isPast: false,
        isToday: false,
        status: 'available',
        statusText: '余席',
        availableRoomsCount: 2,
      });
    }
  }

  return days;
}

export type SalonSlotKey = 'morning' | 'afternoon' | 'evening';

export interface SalonSlotStatus {
  slotKey: SalonSlotKey;
  slotLabel: string;
  fullTimeSlot: string;
  timeRange: string;
  poeticSub: string;
  isAvailable: boolean;
  isRecommendedForTea: boolean;
  occupiedByUser: boolean;
  occupancyLabel: string;
  remainingRooms: number;
}

export interface RoomDailySchedule {
  roomId: string;
  roomName: string;
  shortName: string;
  capacity: string;
  slots: SalonSlotStatus[];
}

export interface WeeklyDaySchedule {
  dateStr: string;
  dayNumber: number;
  monthDayLabel: string;
  weekdayCN: string;
  isToday: boolean;
  solarTerm?: string;
  status: 'available' | 'auspicious' | 'booked';
  statusText: string;
  availableSlotsCount: number;
  totalSlotsCount: number;
  rooms: RoomDailySchedule[];
}

export interface TeaDifferentiatedScheduleAdvice {
  teaName: string;
  teaCategory: 'dancong' | 'wuyi' | 'aged_puer' | 'yao';
  categoryLabel: string;
  recommendedSlotKey: SalonSlotKey;
  recommendedTimeSlot: string;
  recommendedRoomId: string;
  recommendedRoomName: string;
  recommendedSommelier: string;
  vesselPairing: string;
  waterTempNote: string;
  scheduleHeadline: string;
  differentiatedReason: string;
  slotSuitability: Record<SalonSlotKey, { badge: string; score: number; note: string }>;
}

export const SALON_TIME_SLOTS: {
  slotKey: SalonSlotKey;
  slotLabel: string;
  fullTimeSlot: string;
  timeRange: string;
  poeticSub: string;
}[] = [
  {
    slotKey: 'morning',
    slotLabel: '晨席',
    fullTimeSlot: '晨席 (09:30 - 12:00 · 清和早茗)',
    timeRange: '09:30 - 12:00',
    poeticSub: '清和早茗 · 鼻端清气',
  },
  {
    slotKey: 'afternoon',
    slotLabel: '午席',
    fullTimeSlot: '午席 (14:00 - 17:00 · 浮生半日)',
    timeRange: '14:00 - 17:00',
    poeticSub: '浮生半日 · 岩骨慢火',
  },
  {
    slotKey: 'evening',
    slotLabel: '暮席',
    fullTimeSlot: '暮席 (18:30 - 21:30 · 幽玄夜席)',
    timeRange: '18:30 - 21:30',
    poeticSub: '幽玄夜席 · 围炉陈韵',
  },
];

/**
 * 炭火备水模式下的时段拓展（延长30分钟，体验红泥小火炉榄炭起火与生火候汤仪式）
 */
export const CHARCOAL_EXTENDED_TIME_SLOTS: Record<
  SalonSlotKey,
  { fullTimeSlot: string; timeRange: string; ritualSub: string }
> = {
  morning: {
    fullTimeSlot: '晨席 (09:00 - 12:00 · 炭火备水·生火候汤)',
    timeRange: '09:00 - 12:00',
    ritualSub: '前30分生火候汤 · 榄炭初沸',
  },
  afternoon: {
    fullTimeSlot: '午席 (13:30 - 17:00 · 炭火备水·慢火烹泉)',
    timeRange: '13:30 - 17:00',
    ritualSub: '前30分生火候汤 · 活泉微沸',
  },
  evening: {
    fullTimeSlot: '暮席 (18:00 - 21:30 · 炭火备水·围炉夜候)',
    timeRange: '18:00 - 21:30',
    ritualSub: '前30分生火候汤 · 银壶围炉',
  },
};

/**
 * Convert any timeSlot string to charcoal preparation extended slot if enabled
 */
export function resolveCharcoalTimeSlot(
  baseTimeSlot: string,
  isCharcoalPrepEnabled: boolean
): string {
  if (!isCharcoalPrepEnabled) return baseTimeSlot;
  if (baseTimeSlot.includes('晨席')) {
    return CHARCOAL_EXTENDED_TIME_SLOTS.morning.fullTimeSlot;
  }
  if (baseTimeSlot.includes('午席')) {
    return CHARCOAL_EXTENDED_TIME_SLOTS.afternoon.fullTimeSlot;
  }
  if (baseTimeSlot.includes('暮席')) {
    return CHARCOAL_EXTENDED_TIME_SLOTS.evening.fullTimeSlot;
  }
  return baseTimeSlot.replace(')', ' · 炭火备水延长30分)');
}

/**
 * Compute differentiated salon scheduling recommendations based on the selected tea's terroir, roasting, and aroma profile.
 */
export function getTeaDifferentiatedScheduleAdvice(
  teaName?: string | null,
  isCharcoalPrepEnabled: boolean = false
): TeaDifferentiatedScheduleAdvice {
  const normalized = (teaName || '诸心·凤凰单丛').trim();

  // 1. 武夷岩茶系
  if (
    normalized.includes('岩茶') ||
    normalized.includes('沉芳') ||
    normalized.includes('水龙吟') ||
    normalized.includes('肉桂') ||
    normalized.includes('老枞') ||
    normalized.includes('水仙') ||
    normalized.includes('兰芷') ||
    normalized.includes('大红袍')
  ) {
    return {
      teaName: normalized,
      teaCategory: 'wuyi',
      categoryLabel: '武夷正岩 · 炭焙足火',
      recommendedSlotKey: 'afternoon',
      recommendedTimeSlot: isCharcoalPrepEnabled
        ? CHARCOAL_EXTENDED_TIME_SLOTS.afternoon.fullTimeSlot
        : '午席 (14:00 - 17:00 · 浮生半日)',
      recommendedRoomId: 'room-01',
      recommendedRoomName: '春城嘉叶 · 独幅独席',
      recommendedSommelier: '主理人',
      vesselPairing: '紫砂厚壁老壶 / 吴瑞全手拉朱泥壶',
      waterTempNote: isCharcoalPrepEnabled
        ? '已启炭火备水 · 提前30分钟橄榄炭起火慢候活水初沸'
        : '红泥炉橄榄炭火慢炖 · 鼎沸山泉二沸水',
      scheduleHeadline: isCharcoalPrepEnabled
        ? '已开启【炭火备水】时段延长30分：首推「午席 13:30-17:00」，主理人生火候汤·慢火烹泉'
        : '宜选「午席 14:00-17:00」独享一席，由主理人亲自炭火烹泉，细品足火岩骨三叠韵',
      differentiatedReason:
        '正岩茶经传统炭焙文火慢炖，午后体感沉静，主理人全程炭火慢烧天然活泉，从容坐杯，细辨头道炭香、中道花果香与尾水木质沉香。',
      slotSuitability: {
        morning: { badge: '次选 · 醒神', score: 78, note: '晨间空腹宜轻啜，主理人将佐以茶点配饮' },
        afternoon: { badge: '首推 · 绝配', score: 98, note: '午后独席充裕，炭火活泉激发出正岩三道层次' },
        evening: { badge: '尚可 · 减量', score: 82, note: '暮席饮正岩主理人将适度减投茶量，防夜深茶气过旺' },
      },
    };
  }

  // 2. 干仓年份老茶 / 普洱系
  if (
    normalized.includes('普') ||
    normalized.includes('1996') ||
    normalized.includes('2003') ||
    normalized.includes('八八青') ||
    normalized.includes('老茶') ||
    normalized.includes('白茶') ||
    normalized.includes('寿眉')
  ) {
    return {
      teaName: normalized,
      teaCategory: 'aged_puer',
      categoryLabel: '岁月干仓 · 陈化老茶',
      recommendedSlotKey: 'evening',
      recommendedTimeSlot: isCharcoalPrepEnabled
        ? CHARCOAL_EXTENDED_TIME_SLOTS.evening.fullTimeSlot
        : '暮席 (18:30 - 21:30 · 幽玄夜席)',
      recommendedRoomId: 'room-01',
      recommendedRoomName: '春城嘉叶 · 独幅独席',
      recommendedSommelier: '主理人',
      vesselPairing: '纯银急须银壶煮水 + 清代老朱泥壶',
      waterTempNote: isCharcoalPrepEnabled
        ? '已启炭火备水 · 提前30分钟红泥风炉橄榄炭围炉起火'
        : '橄榄炭火小风炉 · 滚水沸透，尾水转银壶慢煮',
      scheduleHeadline: isCharcoalPrepEnabled
        ? '已开启【炭火备水】时段延长30分：首推「暮席 18:00-21:30」，主理人围炉起炭生火候汤'
        : '宜选「暮席 18:30-21:30」独享一席，主理人围炉炭火慢煮老生普',
      differentiatedReason:
        '岁月陈茶茶性温厚绵长，暮色四合时独享整座茶舍，主理人于案前以橄榄炭火慢烧纯银急须，前六泡品干仓樟香，后段围炉炭火慢煮，暖胃安神而不扰清梦。',
      slotSuitability: {
        morning: { badge: '温和 · 润胃', score: 80, note: '晨起温饮老茶平顺，但难尽显夜煮围炉之幽趣' },
        afternoon: { badge: '宜叙 · 雅聚', score: 90, note: '适合挚友围炉细辨干仓年份之转化' },
        evening: { badge: '首推 · 幽玄', score: 99, note: '全舍独席炭火暖炉，老茶温润茶气最契合静夜清谈' },
      },
    };
  }

  // 3. 爻 YÁO 当代便携系
  if (normalized.includes('爻') || normalized.includes('YÁO') || normalized.includes('茶简')) {
    return {
      teaName: normalized,
      teaCategory: 'yao',
      categoryLabel: '爻 YÁO · 当代简雅茶席',
      recommendedSlotKey: 'morning',
      recommendedTimeSlot: isCharcoalPrepEnabled
        ? CHARCOAL_EXTENDED_TIME_SLOTS.morning.fullTimeSlot
        : '晨席 (09:30 - 12:00 · 清和早茗)',
      recommendedRoomId: 'room-01',
      recommendedRoomName: '春城嘉叶 · 独幅独席',
      recommendedSommelier: '主理人',
      vesselPairing: '景德镇双描金白杯 + 爻·穿孔金属茶棒',
      waterTempNote: isCharcoalPrepEnabled
        ? '已启炭火备水 · 提前30分钟文火候泉至初沸'
        : '炭火初沸泉水 · 92°C-95°C 提壶静候45秒',
      scheduleHeadline: isCharcoalPrepEnabled
        ? '已开启【炭火备水】时段延长30分：首推「晨席 09:00-12:00」，主理人慢火烹泉待雅客'
        : '宜选「晨席 09:30-12:00」独席静坐，晨光天光中由主理人备泉冲泡',
      differentiatedReason:
        '「方便一点，标准不轻。」晨间茶舍天光清透，主理人以炭火烧水至初沸，配景德镇甜白釉赏瓷杯，最能映照茶简澄明汤色与轻盈回甘。',
      slotSuitability: {
        morning: { badge: '首推 · 澄明', score: 96, note: '晨光枯山水与白瓷茶简相得益彰，开启清醒一日' },
        afternoon: { badge: '优选 · 案头', score: 92, note: '午后静心相谈或独处阅读皆宜' },
        evening: { badge: '轻饮 · 柔和', score: 85, note: '夜间可缩短茶简浸润至25秒，清甜无负担' },
      },
    };
  }

  // 4. 默认：潮州凤凰单丛系（诸心、清风挂怀、水栀子、东方不败、桃花仙等）
  return {
    teaName: normalized,
    teaCategory: 'dancong',
    categoryLabel: '乌岽山场 · 凤凰单丛',
    recommendedSlotKey: 'morning',
    recommendedTimeSlot: isCharcoalPrepEnabled
      ? CHARCOAL_EXTENDED_TIME_SLOTS.morning.fullTimeSlot
      : '晨席 (09:30 - 12:00 · 清和早茗)',
    recommendedRoomId: 'room-01',
    recommendedRoomName: '春城嘉叶 · 独幅独席',
    recommendedSommelier: '主理人',
    vesselPairing: '潮州手拉朱泥小品壶 (110ml) + 景德镇薄胎白瓷杯',
    waterTempNote: isCharcoalPrepEnabled
      ? '已启炭火备水 · 提前30分钟红泥炉引燃橄榄炭候大滚水'
      : '传统橄榄炭红泥炉 · 大滚水刚沸，3-5秒滚水急冲',
    scheduleHeadline: isCharcoalPrepEnabled
      ? '已开启【炭火备水】时段延长30分：首推「晨席 09:00-12:00」，主理人生火候汤·慢火烹泉'
      : '宜选「晨席 09:30-12:00」或「午席初段」独享一席，主理人以炭火大滚水冲出高锐山场气',
    differentiatedReason:
      '「单丛清气，先在鼻端，后在回甘。」晨间嗅觉最为澄澈，主理人一人执壶，以橄榄炭火烧至松风蟹眼大滚水，潮州工夫法快冲急出，栀子与兰花冷香纤毫毕现。',
    slotSuitability: {
      morning: { badge: '首推 · 赏香', score: 97, note: '晨间嗅觉清敏，炭火大滚水冲出单丛高扬花蜜香与山场冷韵' },
      afternoon: { badge: '并推 · 慢酌', score: 94, note: '午席从容连冲十余水，细赏乌岽山场尾水甜润' },
      evening: { badge: '清雅 · 浅泡', score: 79, note: '单丛茶气高扬提神，夜席主理人建议选熟香型「香如故」' },
    },
  };
}

/**
 * Generate a 7-day visual weekly schedule starting from `startDateStr`,
 * 全舍仅设一间孤品茶席（独幅独席），每日仅开放晨/午/暮三席，由主理人一人亲侍。
 */
export function generateWeeklySchedule(
  startDateStr: string = '2026-11-05',
  activeBookings: {
    date: string;
    timeSlot: string;
    roomName: string;
  }[] = [],
  selectedTeaName?: string | null,
  todayStr: string = '2026-11-04',
  isCharcoalPrepEnabled: boolean = false
): WeeklyDaySchedule[] {
  const weekdaysCN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const advice = getTeaDifferentiatedScheduleAdvice(selectedTeaName, isCharcoalPrepEnabled);

  // 全舍仅设一室一席
  const roomsMeta = [
    {
      id: 'room-01',
      name: '春城嘉叶 · 独幅独席',
      shortName: '全舍独席 · 主理人炭火亲泡',
      capacity: '1-6人（独享全舍）',
    },
  ];

  const [y, m, d] = startDateStr.split('-').map(Number);
  const baseDate = new Date(Date.UTC(y || 2026, (m || 11) - 1, d || 5));

  const schedule: WeeklyDaySchedule[] = [];

  for (let offset = 0; offset < 7; offset++) {
    const cur = new Date(baseDate.getTime() + offset * 86400000);
    const year = cur.getUTCFullYear();
    const monthIdx = cur.getUTCMonth();
    const dayNum = cur.getUTCDate();
    const weekdayIdx = cur.getUTCDay();
    const dateStr = formatDateStr(year, monthIdx, dayNum);
    const monthDayLabel = `${String(monthIdx + 1).padStart(2, '0')}/${String(dayNum).padStart(2, '0')}`;

    const dayTeaStatus = calculateDateTeaStatus(dateStr, todayStr);
    const isFullDayBooked = dayTeaStatus.status === 'booked';

    let availableSlotsCount = 0;
    const totalSlotsCount = roomsMeta.length * SALON_TIME_SLOTS.length; // 3 slots per day

    const rooms: RoomDailySchedule[] = roomsMeta.map((rm, rIdx) => {
      const slots: SalonSlotStatus[] = SALON_TIME_SLOTS.map((slotMeta, sIdx) => {
        const extendedConfig = CHARCOAL_EXTENDED_TIME_SLOTS[slotMeta.slotKey];
        const displayFullTimeSlot = isCharcoalPrepEnabled
          ? extendedConfig.fullTimeSlot
          : slotMeta.fullTimeSlot;
        const displayTimeRange = isCharcoalPrepEnabled
          ? extendedConfig.timeRange
          : slotMeta.timeRange;
        const displayPoeticSub = isCharcoalPrepEnabled
          ? `${extendedConfig.ritualSub} · 慢火烹泉`
          : slotMeta.poeticSub;

        const occupiedByUser = activeBookings.some(
          (b) =>
            b.date === dateStr &&
            (b.timeSlot.startsWith(slotMeta.slotLabel) || b.timeSlot.includes(slotMeta.slotLabel))
        );

        // Deterministic busy pattern for single-room solitary tea house
        const hash = (dayNum * 7 + rIdx * 3 + sIdx * 5) % 7;
        const deterministicallyTaken = isFullDayBooked || hash === 0 || (hash === 2 && sIdx === 1);
        const isAvailable = !occupiedByUser && !deterministicallyTaken && dateStr >= todayStr;

        if (isAvailable) {
          availableSlotsCount += 1;
        }

        const isRecommendedForTea =
          isAvailable &&
          slotMeta.slotKey === advice.recommendedSlotKey;

        return {
          slotKey: slotMeta.slotKey,
          slotLabel: slotMeta.slotLabel,
          fullTimeSlot: displayFullTimeSlot,
          timeRange: displayTimeRange,
          poeticSub: displayPoeticSub,
          isAvailable,
          isRecommendedForTea,
          occupiedByUser,
          occupancyLabel: occupiedByUser
            ? '我的已约'
            : isAvailable
            ? isRecommendedForTea
              ? '推荐时段'
              : '可约'
            : '已订满',
          remainingRooms: isAvailable ? 1 : 0,
        };
      });

      return {
        roomId: rm.id,
        roomName: rm.name,
        shortName: rm.shortName,
        capacity: rm.capacity,
        slots,
      };
    });

    schedule.push({
      dateStr,
      dayNumber: dayNum,
      monthDayLabel,
      weekdayCN: weekdaysCN[weekdayIdx],
      isToday: dateStr === todayStr,
      solarTerm: dayTeaStatus.solarTerm,
      status: availableSlotsCount === 0 ? 'booked' : dayTeaStatus.status,
      statusText:
        availableSlotsCount === 0
          ? '满席'
          : dayTeaStatus.solarTerm
          ? dayTeaStatus.solarTerm
          : `余 ${availableSlotsCount} 席`,
      availableSlotsCount,
      totalSlotsCount,
      rooms,
    });
  }

  return schedule;
}

/**
 * 智能推荐茶席时间算法 (Smart Salon Slot Recommendation Algorithm)
 * 根据用户的历史预约偏好（如：倾向周末或工作日晚间）和当前茶室的空置率（空置越高得分越高），
 * 为用户提供每日最契合的预约时段预测，并将其标记为‘推荐时段’。
 */
export interface UserBookingHistoryItem {
  date: string;
  timeSlot: string;
}

export interface UserTastingPreferenceProfile {
  weekendPreferenceRatio: number;   // 0 - 1
  weekdayNightPreferenceRatio: number; // 0 - 1
  favoriteSlotKey: SalonSlotKey;
  totalPastBookings: number;
}

export interface SmartSlotPrediction {
  dateStr: string;
  weekdayCN: string;
  isWeekend: boolean;
  recommendedSlotKey: SalonSlotKey;
  recommendedSlotLabel: string;
  fullTimeSlot: string;
  fitScore: number;                 // 0 - 100
  matchReason: string;
  vacancyRate: number;              // 0 - 1 (空置率)
  isRecommendedSlot: boolean;
}

export function analyzeUserBookingHistory(
  history: UserBookingHistoryItem[] = []
): UserTastingPreferenceProfile {
  if (history.length === 0) {
    // Default cold-start preference: balanced towards weekend afternoon / evening
    return {
      weekendPreferenceRatio: 0.65,
      weekdayNightPreferenceRatio: 0.35,
      favoriteSlotKey: 'evening',
      totalPastBookings: 0,
    };
  }

  let weekendCount = 0;
  let weekdayNightCount = 0;
  const slotCount: Record<SalonSlotKey, number> = { morning: 0, afternoon: 0, evening: 0 };

  history.forEach((h) => {
    const d = new Date(h.date);
    const dayOfWeek = d.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const isWknd = dayOfWeek === 0 || dayOfWeek === 6;
    if (isWknd) weekendCount++;

    const isEvening = h.timeSlot.includes('暮席') || h.timeSlot.includes('evening');
    const isAfternoon = h.timeSlot.includes('午席') || h.timeSlot.includes('afternoon');

    if (!isWknd && isEvening) weekdayNightCount++;

    if (isEvening) slotCount.evening++;
    else if (isAfternoon) slotCount.afternoon++;
    else slotCount.morning++;
  });

  const total = history.length;
  let favoriteKey: SalonSlotKey = 'evening';
  if (slotCount.afternoon >= slotCount.evening && slotCount.afternoon >= slotCount.morning) {
    favoriteKey = 'afternoon';
  } else if (slotCount.morning >= slotCount.afternoon && slotCount.morning >= slotCount.evening) {
    favoriteKey = 'morning';
  }

  return {
    weekendPreferenceRatio: weekendCount / total,
    weekdayNightPreferenceRatio: weekdayNightCount / total,
    favoriteSlotKey: favoriteKey,
    totalPastBookings: total,
  };
}

/**
 * Predict the optimal salon slot for a given date based on:
 * 1. User historical preference (weekend vs weekday night affinity)
 * 2. Current slot vacancy rate (空置率越高，越不拥挤，体验越尊贵)
 * 3. Selected tea compatibility
 */
export function predictSmartRecommendedSalonSlot(
  targetDateStr: string,
  weeklySchedule: WeeklyDaySchedule[],
  userHistory: UserBookingHistoryItem[] = [],
  selectedTeaName?: string | null,
  isCharcoalPrepEnabled: boolean = false
): SmartSlotPrediction {
  const userProfile = analyzeUserBookingHistory(userHistory);
  const daySchedule = weeklySchedule.find((d) => d.dateStr === targetDateStr) || weeklySchedule[0];
  const teaAdvice = getTeaDifferentiatedScheduleAdvice(selectedTeaName, isCharcoalPrepEnabled);

  const [y, m, d] = targetDateStr.split('-').map(Number);
  const targetDate = new Date(Date.UTC(y || 2026, (m || 11) - 1, d || 5));
  const dayOfWeek = targetDate.getUTCDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Evaluate candidate slots
  const roomSlots = daySchedule?.rooms?.[0]?.slots || [];
  let bestSlotKey: SalonSlotKey = 'afternoon';
  let highestScore = -1;
  let bestVacancy = 1.0;
  let matchRationale = '';

  const slotKeys: SalonSlotKey[] = ['morning', 'afternoon', 'evening'];

  slotKeys.forEach((key) => {
    const slotStatus = roomSlots.find((s) => s.slotKey === key);
    const isAvail = slotStatus?.isAvailable ?? true;
    if (!isAvail) return; // Unavailable slots cannot be recommended

    // Factor 1: Tea character affinity (30% weight)
    const teaSuit = teaAdvice.slotSuitability[key];
    const teaScore = teaSuit ? teaSuit.score : 80;

    // Factor 2: User behavioral preference (40% weight)
    let userPrefScore = 75;
    if (isWeekend) {
      userPrefScore += userProfile.weekendPreferenceRatio * 25;
      if (key === 'afternoon') userPrefScore += 10;
    } else {
      // Weekday
      if (key === 'evening') {
        userPrefScore += (userProfile.weekdayNightPreferenceRatio > 0.3 ? 20 : 15);
      }
    }
    if (key === userProfile.favoriteSlotKey) {
      userPrefScore += 10;
    }

    // Factor 3: Solitary Vacancy & Serenity (30% weight)
    // For a single room house, availability = 1.0 vacancy, plus deterministic tranquility
    const vacancyRate = daySchedule.availableSlotsCount / (daySchedule.totalSlotsCount || 3);
    const serenityScore = vacancyRate * 100;

    const totalComposite = Math.round(teaScore * 0.3 + userPrefScore * 0.4 + serenityScore * 0.3);

    if (totalComposite > highestScore) {
      highestScore = totalComposite;
      bestSlotKey = key;
      bestVacancy = vacancyRate;

      if (isWeekend) {
        matchRationale = `精准契合您周末偏好（空置率 ${Math.round(vacancyRate * 100)}% · 独席从容）；${teaSuit?.note || '宜全舍独享慢火烹泉'}`;
      } else if (key === 'evening') {
        matchRationale = `精准契合工作日暮席清谈习惯（空置率 ${Math.round(vacancyRate * 100)}% · 幽静安神）；${teaSuit?.note || '老茶与红泥火炉相宜'}`;
      } else {
        matchRationale = `当前茶席空置率高（${Math.round(vacancyRate * 100)}%）；${teaSuit?.note || '适宜晨间清和赏香'}`;
      }
    }
  });

  const slotMeta = SALON_TIME_SLOTS.find((s) => s.slotKey === bestSlotKey) || SALON_TIME_SLOTS[1];
  const extendedConfig = CHARCOAL_EXTENDED_TIME_SLOTS[bestSlotKey];
  const fullTimeSlot = isCharcoalPrepEnabled
    ? extendedConfig.fullTimeSlot
    : slotMeta.fullTimeSlot;

  return {
    dateStr: targetDateStr,
    weekdayCN: daySchedule?.weekdayCN || '周中',
    isWeekend,
    recommendedSlotKey: bestSlotKey,
    recommendedSlotLabel: slotMeta.slotLabel,
    fullTimeSlot,
    fitScore: Math.min(99, Math.max(85, highestScore)),
    matchReason: matchRationale,
    vacancyRate: bestVacancy,
    isRecommendedSlot: true,
  };
}

