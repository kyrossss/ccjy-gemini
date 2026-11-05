/**
 * Pure business logic and data structures for
 * 「雅席礼遇」通知系统 (Salon Courtesy Notification System) &
 * 「赴约心境」备忘录 (Tea Rendezvous Mood Memo)
 */

import { BookingInvitationData } from '../components/TeaInvitationModal';
import { parseBookingTargetDate } from './calendarExport';

export interface MoodArchetype {
  id: string;
  label: string;
  enLabel: string;
  subtitle: string;
  defaultVerse: string;
  incensePairing: string;
  attireTip: string;
}

export const MOOD_ARCHETYPES: MoodArchetype[] = [
  {
    id: 'pine-leisure',
    label: '听松偷闲',
    enLabel: 'Pine Wind & Leisure',
    subtitle: '偷得浮生半日闲，静听松风沸水声',
    defaultVerse: '尘案劳形久，今朝入翠微。竹炉汤初沸，松风吹客衣。惟愿半日闲，伴此一瓯晖。',
    incensePairing: '海南沉水香 · 鹅梨帐中香',
    attireTip: '宜着亚麻或素色棉麻宽衣，卸下腕表束缚，轻装赴席。',
  },
  {
    id: 'cleanse-heart',
    label: '涤尘澄心',
    enLabel: 'Clarifying Mind',
    subtitle: '拂去尘嚣烦扰，唯余一盏清茗照本心',
    defaultVerse: '市声喧不尽，一步入幽玄。澄心观白水，茗香起紫烟。万虑随汤散，清凉自在天。',
    incensePairing: '天然老山檀 · 静心冷香',
    attireTip: '宜净手敛神，忌施浓烈香水，以免掩盖高山原叶之幽兰冷韵。',
  },
  {
    id: 'bosom-talk',
    label: '知己清谈',
    enLabel: 'Bosom Conversation',
    subtitle: '烹泉候知音，对坐忘机，茶罢意犹长',
    defaultVerse: '佳茗须佳客，幽轩待故人。三巡花蜜澈，七椀肺腑亲。不道世间事，唯有座上春。',
    incensePairing: '奇楠沉香线香 · 温润木质调',
    attireTip: '可携一二私藏小杯与挚友共赏，席间主客同欢。',
  },
  {
    id: 'solitary-zen',
    label: '独坐观山',
    enLabel: 'Solitary Contemplation',
    subtitle: '独坐枯山水庭前，观青苔竹影，以茶内观',
    defaultVerse: '独坐幽庭里，苔痕上阶青。一壶吞山海，孤啜入杳冥。天地何寥廓，茶烟一缕轻。',
    incensePairing: '芽庄白奇楠 · 空谷幽苔香',
    attireTip: '宜提前一刻钟静默入席，听侍茶师温杯洁具、高冲低斟。',
  },
];

export interface CourtesyChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export const DEFAULT_COURTESY_CHECKLIST: CourtesyChecklistItem[] = [
  {
    id: 'scent-free',
    text: '勿施浓烈香水或护手霜，留纯粹嗅觉鉴赏原叶初香',
    checked: true,
  },
  {
    id: 'arrive-early',
    text: '提前 10 分钟抵达南山茶舍，净手静息，平复呼吸',
    checked: true,
  },
  {
    id: 'palate-ready',
    text: '赴席前两小时宜清淡饮食，保持舌本敏锐以察回甘',
    checked: false,
  },
];

export interface CourtesyMoodMemo {
  id: string;
  bookingId: string;
  roomName: string;
  date: string;
  timeSlot: string;
  sommelier: string;
  pairedTea: string;
  moodId: string;
  moodLabel: string;
  poeticNote: string;
  incensePairing: string;
  attireTip: string;
  checklist: string[];
  createdAt: string;
}

export interface ImminentBookingCheckResult {
  isImminent: boolean;
  hoursRemaining: number;
  booking: BookingInvitationData | null;
  notificationTitle: string;
  notificationMessage: string;
}

/**
 * Checks whether any active booking is within the 24-hour courtesy reminder window
 * (or returns the nearest active booking when forceCourtesyPreview is true).
 */
export function evaluateImminentBookingCourtesy(
  bookings: BookingInvitationData[],
  now: Date = new Date(),
  forceCourtesyPreview: boolean = false
): ImminentBookingCheckResult {
  if (!bookings || bookings.length === 0) {
    return {
      isImminent: false,
      hoursRemaining: 0,
      booking: null,
      notificationTitle: '',
      notificationMessage: '',
    };
  }

  // Sort bookings by start time ascending
  const sorted = [...bookings].sort((a, b) => {
    const da = parseBookingTargetDate(a.date, a.timeSlot).getTime();
    const db = parseBookingTargetDate(b.date, b.timeSlot).getTime();
    return da - db;
  });

  // Find a booking within (0, 24] hours, or nearest future booking
  for (const b of sorted) {
    const target = parseBookingTargetDate(b.date, b.timeSlot);
    const diffHours = (target.getTime() - now.getTime()) / (1000 * 3600);
    if (diffHours > 0 && diffHours <= 24) {
      const roundedHours = Math.max(1, Math.round(diffHours));
      return {
        isImminent: true,
        hoursRemaining: roundedHours,
        booking: b,
        notificationTitle: `雅席礼遇 · 距开席约 ${roundedHours} 小时`,
        notificationMessage: `您预订的${b.roomName}（${b.timeSlot.split(' ')[0]}）即将开启，侍茶师${b.sommelier}已为您备妥「${b.pairedTea}」，点击记录您的赴约心境。`,
      };
    }
  }

  if (forceCourtesyPreview) {
    const primary = sorted[0];
    const target = parseBookingTargetDate(primary.date, primary.timeSlot);
    const rawHours = (target.getTime() - now.getTime()) / (1000 * 3600);
    const displayHours = rawHours > 0 && rawHours <= 24 ? Math.max(1, Math.round(rawHours)) : 24;

    return {
      isImminent: true,
      hoursRemaining: displayHours,
      booking: primary,
      notificationTitle: `雅席礼遇 · 临席 ${displayHours} 小时赴约提醒`,
      notificationMessage: `侍茶师${primary.sommelier}已为您温器醒茶（「${primary.pairedTea}」），${primary.roomName}静候雅步，点击快速生成「赴约心境」备忘录。`,
    };
  }

  return {
    isImminent: false,
    hoursRemaining: 0,
    booking: sorted[0],
    notificationTitle: '',
    notificationMessage: '',
  };
}

/**
 * Generates a curated poetic mood memo based on booking and selected mood archetype
 */
export function generateCuratedMoodMemo(
  booking: BookingInvitationData,
  moodId: string = 'pine-leisure',
  customReflection?: string
): CourtesyMoodMemo {
  const mood = MOOD_ARCHETYPES.find((m) => m.id === moodId) || MOOD_ARCHETYPES[0];

  const defaultNote = `${mood.defaultVerse}\n明日将赴「${booking.roomName}」之约，由侍茶师${booking.sommelier}执壶冲泡「${booking.pairedTea}」。暂歇俗务，以清净心赴此一席山场真味。`;

  return {
    id: `MEMO-${Date.now().toString(36).toUpperCase()}`,
    bookingId: booking.id,
    roomName: booking.roomName,
    date: booking.date,
    timeSlot: booking.timeSlot,
    sommelier: booking.sommelier,
    pairedTea: booking.pairedTea,
    moodId: mood.id,
    moodLabel: mood.label,
    poeticNote: customReflection && customReflection.trim().length > 0 ? customReflection.trim() : defaultNote,
    incensePairing: mood.incensePairing,
    attireTip: mood.attireTip,
    checklist: DEFAULT_COURTESY_CHECKLIST.filter((c) => c.checked).map((c) => c.text),
    createdAt: new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}
