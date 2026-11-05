import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarPlus,
  Clock,
  Check,
  Sparkles,
  User,
  Coffee,
  Calendar,
  ChevronRight,
  Feather,
  BellRing,
} from 'lucide-react';
import {
  CalendarEventData,
  downloadCalendarEvent,
  parseBookingTargetDate,
  calculateCountdownParts,
} from '../utils/calendarExport';
import { BookingInvitationData } from './TeaInvitationModal';
import { CourtesyMoodMemo } from '../utils/courtesyNotificationLogic';
import { zenAudio } from '../utils/audioZen';
import { OrientalEmptyState } from './OrientalEmptyState';

interface UpcomingSeatCountdownCardProps {
  bookings: BookingInvitationData[];
  onOpenInvitation?: (booking: BookingInvitationData) => void;
  onOpenPosterModal?: (booking: BookingInvitationData) => void;
  onOpenMoodMemo?: (booking: BookingInvitationData) => void;
  onTriggerCourtesyPush?: (booking: BookingInvitationData) => void;
  savedMemo?: CourtesyMoodMemo | null;
  onOpenAllBookings?: () => void;
  onGoToBookRoom?: () => void;
  compact?: boolean;
}

export const UpcomingSeatCountdownCard: React.FC<UpcomingSeatCountdownCardProps> = ({
  bookings,
  onOpenInvitation,
  onOpenPosterModal,
  onOpenMoodMemo,
  onTriggerCourtesyPush,
  savedMemo,
  onOpenAllBookings,
  onGoToBookRoom,
  compact = false,
}) => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [calendarAddedId, setCalendarAddedId] = useState<string | null>(null);

  // Pick the nearest upcoming booking (or the most recent active booking)
  const upcomingBooking = useMemo(() => {
    if (!bookings || bookings.length === 0) return null;
    const sorted = [...bookings].sort((a, b) => {
      const da = parseBookingTargetDate(a.date, a.timeSlot).getTime();
      const db = parseBookingTargetDate(b.date, b.timeSlot).getTime();
      return da - db;
    });
    const futureOne = sorted.find(
      (b) => parseBookingTargetDate(b.date, b.timeSlot).getTime() > Date.now()
    );
    return futureOne || bookings[0];
  }, [bookings]);

  // Anchor fallback target if browser clock is past the mock date so live countdown always ticks
  const fallbackTarget = useMemo(() => {
    return new Date(Date.now() + (2 * 86400 + 6 * 3600 + 42 * 60 + 18) * 1000);
  }, [upcomingBooking?.id]);

  useEffect(() => {
    if (!upcomingBooking) return;
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [upcomingBooking]);

  if (!upcomingBooking) {
    return (
      <OrientalEmptyState
        variant="bookings"
        compact
        title="我的茶席 · 尚无即将到来的预留茶席"
        onPrimaryAction={onGoToBookRoom}
        onSecondaryAction={onOpenAllBookings}
        secondaryActionLabel="查阅茶事履历档案"
      />
    );
  }

  const parsedTarget = parseBookingTargetDate(upcomingBooking.date, upcomingBooking.timeSlot);
  const effectiveTarget =
    parsedTarget.getTime() > now.getTime() ? parsedTarget : fallbackTarget;
  const countdown = calculateCountdownParts(effectiveTarget, now);

  const pad2 = (n: number) => n.toString().padStart(2, '0');
  const bookingCode =
    upcomingBooking.bookingCode || `YUN-${upcomingBooking.id.slice(-6).toUpperCase()}`;

  const handleAddToNativeCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    zenAudio.playZenChime();

    const eventData: CalendarEventData = {
      roomName: upcomingBooking.roomName,
      date: upcomingBooking.date,
      timeSlot: upcomingBooking.timeSlot,
      guests: upcomingBooking.guests,
      sommelier: upcomingBooking.sommelier,
      pairedTea: upcomingBooking.pairedTea,
      bookingCode,
      location: '春城嘉叶 · 潮州工夫茶舍（深圳市南山区）',
    };

    const ok = downloadCalendarEvent(eventData);
    if (ok) {
      setCalendarAddedId(upcomingBooking.id);
      setTimeout(() => setCalendarAddedId(null), 4500);
    }
  };

  const isAdded = calendarAddedId === upcomingBooking.id;

  return (
    <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#1E2722] via-[#24302A] to-[#18201B] text-[#FAF8F5] border border-[#3B4A40] shadow-md space-y-4 relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#D8C496]/10 blur-2xl pointer-events-none" />

      {/* Header Row: Title & Live Status Tag */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-[#D8C496] uppercase font-bold">
              UPCOMING TEA SESSION · 席次预热倒计时
            </span>
          </div>
          <h3 className="font-oriental-serif text-base font-bold text-white tracking-wide mt-0.5">
            我的茶席 · {upcomingBooking.roomName}
          </h3>
        </div>

        {onOpenAllBookings && !compact && (
          <button
            onClick={onOpenAllBookings}
            className="text-[11px] font-oriental-serif text-[#D8C496] hover:text-white flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white/10 border border-white/15 transition-colors shrink-0"
          >
            <span>全部席次 ({bookings.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dynamic Countdown Flipping/Ticking Grid */}
      <div className="p-3.5 rounded-2xl bg-black/25 border border-white/12 space-y-2.5 relative z-10">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#D8C496] font-oriental-serif flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#D8C496]" />
            <span>距离吉时入席尚余</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#8F733E]/30 border border-[#D8C496]/30 text-[#EEDB9F] text-[10px] font-oriental-serif">
            {countdown.stageTag}
          </span>
        </div>

        {/* 4-Unit Time Blocks */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { value: pad2(countdown.days), label: '日 / DAYS' },
            { value: pad2(countdown.hours), label: '时 / HRS' },
            { value: pad2(countdown.minutes), label: '分 / MIN' },
            { value: pad2(countdown.seconds), label: '秒 / SEC', highlight: true },
          ].map((unit, idx) => (
            <div
              key={idx}
              className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center ${
                unit.highlight
                  ? 'bg-[#8F733E]/25 border-[#D8C496]/50 text-[#F3E2B8]'
                  : 'bg-white/8 border-white/15 text-white'
              }`}
            >
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider leading-none">
                {unit.value}
              </span>
              <span className="text-[9px] font-mono text-[#B7B0A2] mt-1 tracking-wider">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-oriental-serif text-[#C9C2B4] italic text-center pt-0.5">
          「{countdown.poeticHint}」
        </p>
      </div>

      {/* Reservation Meta Pills */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-white/6 p-3 rounded-2xl border border-white/10 relative z-10">
        <div className="flex items-center gap-1.5 text-[#E5DFD3]">
          <Calendar className="w-3.5 h-3.5 text-[#D8C496] shrink-0" />
          <span className="font-mono truncate">{upcomingBooking.date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#E5DFD3]">
          <Clock className="w-3.5 h-3.5 text-[#D8C496] shrink-0" />
          <span className="truncate">{upcomingBooking.timeSlot.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#E5DFD3]">
          <User className="w-3.5 h-3.5 text-[#D8C496] shrink-0" />
          <span className="truncate">执席侍茶：{upcomingBooking.sommelier}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#E5DFD3]">
          <Coffee className="w-3.5 h-3.5 text-[#D8C496] shrink-0" />
          <span className="truncate">茶礼：{upcomingBooking.pairedTea}</span>
        </div>
      </div>

      {/* Saved Mood Memo Preview (if user created one) */}
      {savedMemo && savedMemo.bookingId === upcomingBooking.id && (
        <div
          onClick={() => onOpenMoodMemo?.(upcomingBooking)}
          className="p-3 rounded-2xl bg-[#8F733E]/20 border border-[#D8C496]/35 text-xs space-y-1 cursor-pointer hover:bg-[#8F733E]/30 transition-colors relative z-10"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#EEDB9F] flex items-center gap-1 font-bold">
              <Feather className="w-3 h-3" />
              <span>已备赴约心境 · 【{savedMemo.moodLabel}】</span>
            </span>
            <span className="text-[10px] text-[#C8BFA8]">点击编辑 &rarr;</span>
          </div>
          <p className="text-[11px] font-oriental-serif text-[#EFECE4] line-clamp-2 leading-relaxed">
            {savedMemo.poeticNote}
          </p>
        </div>
      )}

      {/* Primary Native Calendar Action + Secondary Invitation/Poster/MoodMemo */}
      <div className="flex flex-col gap-2 pt-0.5 relative z-10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={handleAddToNativeCalendar}
            className={`flex-1 py-2.5 px-3.5 rounded-2xl font-oriental-serif text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98 ${
              isAdded
                ? 'bg-emerald-700 text-white border border-emerald-400/40'
                : 'bg-gradient-to-r from-[#D8C496] via-[#E5D3A7] to-[#CFAF75] text-[#1C241F] hover:brightness-105'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>已生成并唤起系统原生日历 (.ics)</span>
              </>
            ) : (
              <>
                <CalendarPlus className="w-4 h-4 text-[#1C241F] shrink-0" />
                <span>一键添加至系统原生日历</span>
              </>
            )}
          </button>

          {onOpenMoodMemo && (
            <button
              type="button"
              onClick={() => onOpenMoodMemo(upcomingBooking)}
              className="py-2.5 px-3.5 rounded-2xl bg-[#8F733E]/35 hover:bg-[#8F733E]/50 border border-[#D8C496]/50 text-[#F5E6C0] text-xs font-oriental-serif font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>赴约心境备忘</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {onOpenInvitation && (
              <button
                type="button"
                onClick={() => onOpenInvitation(upcomingBooking)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[#EFECE6] text-[11px] font-oriental-serif transition-colors"
              >
                席位柬帖
              </button>
            )}
            {onOpenPosterModal && (
              <button
                type="button"
                onClick={() => onOpenPosterModal(upcomingBooking)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[#EEDB9F] text-[11px] font-oriental-serif flex items-center justify-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>邀约海报</span>
              </button>
            )}
          </div>

          {onTriggerCourtesyPush && (
            <button
              type="button"
              onClick={() => onTriggerCourtesyPush(upcomingBooking)}
              className="py-2 px-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-[#D8C496] text-[10px] font-oriental-serif flex items-center gap-1 transition-colors shrink-0"
              title="模拟临席24小时系统礼遇通知推送"
            >
              <BellRing className="w-3 h-3" />
              <span>临席礼遇提醒</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
