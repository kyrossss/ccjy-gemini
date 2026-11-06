import React, { useEffect } from 'react';
import { ChevronRight, X, Sparkles, Feather, BellRing } from 'lucide-react';
import { zenAudio } from '../utils/audioZen';
import { BookingInvitationData } from './TeaInvitationModal';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  roomName: string;
  date: string;
  timeSlot: string;
  kind?: 'booking' | 'courtesy-24h' | 'valuation-shortage';
  booking?: BookingInvitationData;
  valuationMeta?: {
    currentValuation: number;
    threshold: number;
    deficit: number;
  };
}

interface NotificationBannerProps {
  notification: NotificationData | null;
  onClose: () => void;
  onClick: () => void;
  onOpenMoodMemo?: (booking?: BookingInvitationData) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onClose,
  onClick,
  onOpenMoodMemo,
}) => {
  useEffect(() => {
    if (!notification) return;
    // Play subtle bell chime on arrival
    zenAudio.playZenChime();

    // Auto-dismiss after 11 seconds so user has ample time to click the Mood Memo shortcut
    const timer = setTimeout(() => {
      onClose();
    }, 11000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isCourtesyReminder = notification.kind === 'courtesy-24h';
  const isValuationShortage = notification.kind === 'valuation-shortage';

  return (
    <div className="absolute top-12 left-3 right-3 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div
        onClick={onClick}
        className={`w-full backdrop-blur-md text-[#FAF8F5] p-3.5 rounded-2xl shadow-2xl border cursor-pointer group transition-all space-y-2.5 ${
          isValuationShortage
            ? 'bg-[#29120F]/96 border-[#E26D5C]/60 hover:bg-[#200D0B]'
            : 'bg-[#1C2420]/96 border-[#D8C496]/45 hover:bg-[#161D19]'
        }`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start gap-3">
          {/* App Icon / Seal badge */}
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 relative shadow-inner mt-0.5 ${
              isValuationShortage
                ? 'bg-[#7A2117] border-[#FFAEA4]/60 text-[#FFE7E3]'
                : 'bg-[#2A352F] border-[#D8C496]/50 text-[#E7D2A7]'
            }`}
          >
            {isValuationShortage ? (
              <BellRing className="w-4 h-4 text-[#FFD5D0] animate-bounce" />
            ) : isCourtesyReminder ? (
              <BellRing className="w-4 h-4 text-[#EEDB9F] animate-bounce" />
            ) : (
              <span className="font-oriental-serif font-bold text-xs text-[#E7D2A7]">嘉</span>
            )}
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-[#1F2522] ${
                isValuationShortage ? 'bg-[#FF4D4D]' : 'bg-[#B23A2B]'
              }`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[11px] font-mono tracking-wider uppercase flex items-center gap-1 font-bold truncate ${
                  isValuationShortage ? 'text-[#FFD5D0]' : 'text-[#EEDB9F]'
                }`}
              >
                <Sparkles className="w-3 h-3 shrink-0" />
                <span className="truncate">{notification.title}</span>
              </span>
              <span className="text-[10px] text-[#9E978B] font-mono shrink-0">
                {notification.timestamp || '刚刚'}
              </span>
            </div>

            <p className="text-xs font-oriental-serif font-bold text-white tracking-wide mt-0.5">
              {isValuationShortage
                ? `掌柜货值告警 · ${notification.roomName}`
                : isCourtesyReminder
                ? `临席提醒 · ${notification.roomName}`
                : `您已成功预留 ${notification.roomName}`}
            </p>

            <p className="text-[11px] text-[#CEC7B9] font-light leading-relaxed mt-0.5 line-clamp-2">
              {notification.message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#9E978B] hover:text-white transition-colors shrink-0"
            aria-label="关闭通知"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Action Shortcut Bar for Courtesy 24h Reminder or Valuation Shortage */}
        {isValuationShortage ? (
          <div className="pt-2 border-t border-white/12 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#E57368] via-[#D35244] to-[#B2382C] text-white font-oriental-serif text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 transition-all"
            >
              <BellRing className="w-3.5 h-3.5 text-white" />
              <span>立即进入掌柜后台补仓</span>
            </button>
          </div>
        ) : onOpenMoodMemo ? (
          <div className="pt-2 border-t border-white/12 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMoodMemo(notification.booking);
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#D8C496] via-[#E5D3A7] to-[#CFAF75] text-[#1A221D] font-oriental-serif text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 transition-all"
            >
              <Feather className="w-3.5 h-3.5 text-[#1A221D]" />
              <span>快速生成「赴约心境」备忘录</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#E5DFD3] font-oriental-serif text-[11px] flex items-center gap-1 transition-colors shrink-0"
            >
              <span>席位详情</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
