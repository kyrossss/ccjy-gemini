export interface CalendarEventData {
  title?: string;
  roomName: string;
  date: string; // 'YYYY-MM-DD'
  timeSlot: string; // e.g. '午席 (14:00 - 17:00 · 浮生半日)'
  guests: number;
  sommelier: string;
  pairedTea: string;
  bookingCode: string;
  location?: string;
}

/**
 * Parses timeSlot string and date into [startHour, startMin, endHour, endMin]
 */
export function parseSlotTimes(timeSlot: string): {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
} {
  if (timeSlot.includes('晨席') || timeSlot.includes('09:30')) {
    return { startHour: 9, startMinute: 30, endHour: 12, endMinute: 0 };
  }
  if (timeSlot.includes('暮席') || timeSlot.includes('18:30')) {
    return { startHour: 18, startMinute: 30, endHour: 21, endMinute: 30 };
  }
  // Default to afternoon (午席)
  return { startHour: 14, startMinute: 0, endHour: 17, endMinute: 0 };
}

/**
 * Formats a Date object or YYYY-MM-DD + hour/min into ICS datetime format: YYYYMMDDTHHmmss
 */
export function formatIcsDateTime(dateStr: string, hour: number, minute: number): string {
  const cleanDate = dateStr.replace(/[^0-9]/g, '').slice(0, 8); // e.g. 20261107
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${cleanDate}T${pad(hour)}${pad(minute)}00`;
}

/**
 * Generates RFC 5545 iCalendar format content string (.ics)
 */
export function generateIcsContent(event: CalendarEventData): string {
  const times = parseSlotTimes(event.timeSlot);
  const dtStart = formatIcsDateTime(event.date, times.startHour, times.startMinute);
  const dtEnd = formatIcsDateTime(event.date, times.endHour, times.endMinute);
  const location = event.location || '春城嘉叶 · 潮州工夫茶舍（深圳市南山区）';
  const summary = event.title || `春城嘉叶茶事 · 【${event.roomName}】雅席`;
  const description = [
    `【春城嘉叶 · 私享茶室预约】`,
    `茶席：${event.roomName}`,
    `席号：${event.bookingCode}`,
    `入席日期：${event.date}`,
    `时段：${event.timeSlot}`,
    `侍茶师：${event.sommelier}`,
    `开席茶礼：${event.pairedTea}`,
    `入席宾客：${event.guests} 位`,
    `雅址：${location}`,
    ``,
    `「一叶有来处，一器有分寸。烹泉以待，静候雅步。」`,
  ].join('\\n');

  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Chun Cheng Jia Ye//Tea Sanctuary Reservation//CN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:tea-event-${event.bookingCode}-${dtStart}@chunchengjiaye.com`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:茶席入席前 2 小时提醒：春城嘉叶恭迎莅临',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Trigger client-side download of the calendar file (.ics)
 */
export function downloadCalendarEvent(event: CalendarEventData): boolean {
  try {
    const icsContent = generateIcsContent(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `春城嘉叶茶席-${event.date}-${event.roomName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to download calendar event:', err);
    return false;
  }
}
