import React, { useEffect } from 'react';
import { Bell, ChevronRight, X, Calendar, Sparkles } from 'lucide-react';
import { zenAudio } from '../utils/audioZen';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  roomName: string;
  date: string;
  timeSlot: string;
}

interface NotificationBannerProps {
  notification: NotificationData | null;
  onClose: () => void;
  onClick: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onClose,
  onClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    // Play subtle bell chime on arrival
    zenAudio.playZenChime();

    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="absolute top-12 left-3 right-3 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div
        onClick={onClick}
        className="w-full bg-[#1F2522]/95 backdrop-blur-md text-[#FAF8F5] p-3.5 rounded-2xl shadow-2xl border border-[#8F733E]/40 cursor-pointer group hover:bg-[#151A17] transition-all flex items-start gap-3"
        role="alert"
        aria-live="assertive"
      >
        {/* App Icon / Seal badge */}
        <div className="w-9 h-9 rounded-xl bg-[#2A332E] border border-[#8F733E]/50 flex items-center justify-center shrink-0 text-[#E7D2A7] relative shadow-inner">
          <span className="font-oriental-serif font-bold text-xs text-[#E7D2A7]">嘉</span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#B23A2B] ring-2 ring-[#1F2522]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-[#D8C7A3] uppercase flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#B23A2B]" />
              {notification.title}
            </span>
            <span className="text-[10px] text-[#8C867B] font-mono">
              刚刚
            </span>
          </div>

          <p className="text-xs font-oriental-serif font-bold text-white tracking-wide truncate mt-0.5">
            您已成功预留 {notification.roomName}
          </p>

          <p className="text-[11px] text-[#C2BCB0] font-light truncate mt-0.5">
            {notification.date} · {notification.timeSlot.split(' ')[0]} · 点击展开茶席邀请函
          </p>
        </div>

        {/* Right Arrow & Close */}
        <div className="flex items-center gap-1 shrink-0 self-center">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#E7D2A7] group-hover:bg-[#8F733E] group-hover:text-white transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#8C867B] hover:text-white transition-colors ml-1"
            aria-label="关闭通知"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
