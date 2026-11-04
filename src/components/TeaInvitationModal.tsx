import React, { useState } from 'react';
import { X, Calendar, Download, Check, Copy, Share2, Sparkles, MapPin, User, Clock, Coffee, ShieldCheck } from 'lucide-react';
import { downloadCalendarEvent, CalendarEventData } from '../utils/calendarExport';
import { zenAudio } from '../utils/audioZen';

export interface BookingInvitationData {
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

interface TeaInvitationModalProps {
  booking: BookingInvitationData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TeaInvitationModal: React.FC<TeaInvitationModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [calendarSaved, setCalendarSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !booking) return null;

  const bookingCode = booking.bookingCode || `YUN-${booking.id.slice(-6).toUpperCase()}`;

  const eventData: CalendarEventData = {
    roomName: booking.roomName,
    date: booking.date,
    timeSlot: booking.timeSlot,
    guests: booking.guests,
    sommelier: booking.sommelier,
    pairedTea: booking.pairedTea,
    bookingCode,
    location: '春城嘉叶 · 潮州工夫茶舍（深圳市南山区）',
  };

  const handleSaveToCalendar = () => {
    zenAudio.playZenChime();
    const success = downloadCalendarEvent(eventData);
    if (success) {
      setCalendarSaved(true);
      setTimeout(() => setCalendarSaved(false), 5000);
    }
  };

  const handleCopyInvitation = () => {
    zenAudio.playZenChime();
    const text = [
      `【春城嘉叶 · 雅席雅集邀约函】`,
      `奉呈：贵宾雅鉴`,
      `席所：${booking.roomName}`,
      `吉日：${booking.date}`,
      `时段：${booking.timeSlot}`,
      `侍茶师：${booking.sommelier}`,
      `开席茶礼：${booking.pairedTea}`,
      `入席席号：${bookingCode}`,
      `雅址：春城嘉叶 · 潮州工夫茶舍（深圳市南山区）`,
      ``,
      `「一叶有来处，一器有分寸。烹泉以待，静候雅步。」`,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] bg-[#FAF8F5] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D8C7A5] animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#ECE3D5] bg-[#F4EDE2]/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B23A2B]" />
            <span className="font-oriental-serif text-xs font-bold text-[#1E2320] tracking-widest">
              春城嘉叶 · 雅席柬帖
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#DCD3C4] flex items-center justify-center text-[#5E574B] hover:text-[#1E2320] transition-colors"
            aria-label="关闭邀请函"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Traditional Gold Foil Letter Scroll Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {/* Letter Inner Container with ornate border */}
          <div className="relative bg-[#FFFDF9] rounded-2xl p-5 border-2 border-[#D8C8A5] shadow-xs space-y-4 overflow-hidden">
            {/* Top Vermilion Seal & Title */}
            <div className="text-center space-y-1.5 relative">
              {/* Traditional Red Seal Stamp */}
              <div className="inline-block p-1 border-2 border-[#B23A2B] rounded-md rotate-2 mb-1">
                <span className="text-[10px] font-oriental-serif font-bold text-[#B23A2B] tracking-widest block px-1">
                  春城嘉叶 · 雅席
                </span>
              </div>

              <h2 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1E2320] tracking-widest">
                茶 席 邀 约 函
              </h2>
              <span className="text-[10px] font-mono text-[#8C8476] tracking-widest uppercase block">
                TEA SALON INVITATION & CEREMONY PASS
              </span>
            </div>

            {/* Poetic Inscription */}
            <div className="py-2 px-3 bg-[#FAF7F0] rounded-xl border border-[#ECE3D4] text-xs font-oriental-serif text-[#4A4337] leading-relaxed text-center font-light">
              <p>奉呈 · 尊贵席主雅鉴：</p>
              <p className="mt-1 text-[11px] text-[#6E6657]">
                一叶有来处，一器有分寸。烹泉听沸如松风，春城嘉叶特备山场原叶、名家手拉朱泥与幽玄席位，恭候阁下携友莅临，共品浮生闲适。
              </p>
            </div>

            {/* Chamber & Reservation Details */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>预约席所</span>
                </span>
                <span className="font-oriental-serif font-bold text-[#1E2320] text-right">
                  {booking.roomName}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>入席吉日</span>
                </span>
                <span className="font-mono font-bold text-[#1E2320]">
                  {booking.date}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>茶席时段</span>
                </span>
                <span className="text-[#2B322D] font-medium text-right">
                  {booking.timeSlot}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>专属侍茶师</span>
                </span>
                <span className="font-oriental-serif font-medium text-[#1E2320]">
                  {booking.sommelier}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>开席特选茶</span>
                </span>
                <span className="font-oriental-serif font-medium text-[#1E2320]">
                  {booking.pairedTea}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>入席席号</span>
                </span>
                <span className="font-mono font-bold text-[#8F733E]">
                  {bookingCode}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>茶舍雅址</span>
                </span>
                <span className="text-[11px] text-[#4F493E] text-right max-w-[260px]">
                  春城嘉叶 · 潮州工夫茶舍（深圳市南山区）
                </span>
              </div>
            </div>

            {/* QR Verification Badge */}
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E9E0CE] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#8C8476] font-mono block">
                  VERIFICATION PASS · 到店出示
                </span>
                <p className="text-xs font-oriental-serif font-bold text-[#1E2320]">
                  凭此函及席号直接入席
                </p>
              </div>

              <div className="w-12 h-12 bg-white p-1 rounded-lg border border-[#DDD3C2] flex items-center justify-center">
                <div className="w-full h-full bg-[#1E2320] flex items-center justify-center text-white text-[9px] font-mono text-center leading-none">
                  SEAT<br />PASS
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Saved Feedback Banner */}
          {calendarSaved && (
            <div className="p-3 bg-[#EBF3ED] text-[#285E37] rounded-xl border border-[#CDE3D3] text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#285E37] shrink-0" />
              <span>
                <strong>已成功生成手机日历日程文件！</strong> 支持 iOS 日历、Google Calendar、华为/小米日历直接导入。
              </span>
            </div>
          )}

          {/* Copied Feedback */}
          {copied && (
            <div className="p-3 bg-[#FAF2E6] text-[#8F733E] rounded-xl border border-[#E8DCC8] text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#8F733E] shrink-0" />
              <span>邀请函文案已复制到剪贴板，可直接发送给同席茶友。</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#ECE3D5] bg-white/95 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleSaveToCalendar}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#1E2320] text-white hover:bg-black font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
          >
            <Download className="w-4 h-4 text-[#E7D2A7]" />
            <span>一键保存到手机日历 (iCal)</span>
          </button>

          <button
            onClick={handleCopyInvitation}
            className="py-3 px-4 rounded-2xl bg-[#F6F1E9] border border-[#DDD3C2] text-[#4E473B] hover:bg-[#ECE4D6] font-oriental-serif text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>复制邀友</span>
          </button>
        </div>
      </div>
    </div>
  );
};
