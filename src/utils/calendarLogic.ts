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
