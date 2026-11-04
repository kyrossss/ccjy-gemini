import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, Check, Clock } from 'lucide-react';
import { generateMonthDays, CalendarDayInfo, SOLAR_TERMS_MAP } from '../utils/calendarLogic';
import { zenAudio } from '../utils/audioZen';

interface TeaRoomCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  onQuickBookRoom?: () => void;
}

export const TeaRoomCalendar: React.FC<TeaRoomCalendarProps> = ({
  selectedDate,
  onSelectDate,
  onQuickBookRoom,
}) => {
  // Current calendar month view (default November 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // 10 = November

  const todayStr = '2026-11-04';
  const calendarDays = generateMonthDays(currentYear, currentMonthIndex, todayStr);

  const monthNamesCN = [
    '一月 · 孟春', '二月 · 仲春', '三月 · 季春',
    '四月 · 孟夏', '五月 · 仲夏', '六月 · 季夏',
    '七月 · 孟秋', '八月 · 仲秋', '九月 · 季秋',
    '十月 · 孟冬', '十一月 · 仲冬', '十二月 · 季冬',
  ];

  const handlePrevMonth = () => {
    zenAudio.playZenChime();
    if (currentMonthIndex === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonthIndex(11);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    zenAudio.playZenChime();
    if (currentMonthIndex === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonthIndex(0);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleDayClick = (day: CalendarDayInfo) => {
    if (day.isPast) return;
    zenAudio.playZenChime();
    onSelectDate(day.dateStr);
  };

  const selectedDayInfo = calendarDays.find((d) => d.dateStr === selectedDate);
  const selectedSolarTerm = selectedDate ? SOLAR_TERMS_MAP[selectedDate.slice(5)] : undefined;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ECE6DB] shadow-xs space-y-4">
      {/* Calendar Header with Oriental Typography & Month Nav */}
      <div className="flex items-center justify-between border-b border-[#F0EBE0] pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-oriental-serif font-bold text-base text-[#1E2320] tracking-wider">
              {currentYear}年 · {monthNamesCN[currentMonthIndex]}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase px-1.5 py-0.5 rounded-full bg-[#FAF5E8] border border-[#EADBBD]">
              TEA SALON CALENDAR
            </span>
          </div>
          <p className="text-[11px] text-[#868074] font-light mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#BFA15F]" />
            <span>节气霜降迎小雪 · 宜炭火慢煮、素心晤谈</span>
          </p>
        </div>

        {/* Month Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F2EEE4] text-[#605A4F] transition-colors"
            aria-label="上个月"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F2EEE4] text-[#605A4F] transition-colors"
            aria-label="下个月"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Grid Headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-oriental-serif text-[#918B7E]">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
      </div>

      {/* Calendar 7-Column Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map((day, idx) => {
          const isSelected = day.dateStr === selectedDate;
          const isAuspicious = day.status === 'auspicious';
          const isBooked = day.status === 'booked';
          const isClickable = !day.isPast && !isBooked;

          return (
            <button
              key={idx}
              type="button"
              disabled={day.isPast || isBooked}
              onClick={() => handleDayClick(day)}
              className={`relative h-15 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1 transition-all ${
                isSelected
                  ? 'bg-[#232B26] text-white shadow-md scale-[1.02] border border-[#232B26]'
                  : isBooked
                  ? 'bg-[#F6F4EE]/60 text-[#BAB4A7] cursor-not-allowed border border-transparent'
                  : day.isPast
                  ? 'bg-transparent text-[#C5BFB3] cursor-not-allowed'
                  : day.isCurrentMonth
                  ? isAuspicious
                    ? 'bg-[#FCF9F2] text-[#242A27] hover:bg-[#F5EEDF] border border-[#E9DFC8]'
                    : 'bg-[#FAF8F5] text-[#29322D] hover:bg-[#F2EFE8] border border-[#EDE7DB]'
                  : 'bg-transparent text-[#B8B2A6] hover:bg-[#F5F2EB]'
              }`}
            >
              {/* Day Number and Today Indicator */}
              <div className="flex items-center gap-0.5">
                <span
                  className={`font-mono text-xs font-semibold ${
                    isSelected ? 'text-white' : day.isPast ? 'text-[#BFB9AD]' : 'text-[#202723]'
                  }`}
                >
                  {day.dayNumber}
                </span>
                {day.isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-[#B23A2B]" />
                )}
              </div>

              {/* Solar Term or Status Tag */}
              <div className="w-full text-center">
                {day.solarTerm ? (
                  <span
                    className={`text-[9px] font-oriental-serif leading-none truncate block ${
                      isSelected ? 'text-[#D8C496]' : 'text-[#8F733E] font-medium'
                    }`}
                  >
                    {day.solarTerm}
                  </span>
                ) : (
                  <span
                    className={`text-[8px] font-oriental-serif scale-90 block leading-none ${
                      isSelected
                        ? 'text-[#C9C2B4]'
                        : isBooked
                        ? 'text-[#AFA89C]'
                        : 'text-[#847D70]'
                    }`}
                  >
                    {day.statusText}
                  </span>
                )}
              </div>

              {/* Micro Status Dot */}
              <div className="flex items-center justify-center">
                {isSelected ? (
                  <Check className="w-2.5 h-2.5 text-[#D8C496]" />
                ) : isBooked ? (
                  <span className="w-1 h-1 rounded-full bg-[#CDC6B8]" />
                ) : isAuspicious ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F] ring-2 ring-[#BFA15F]/20" />
                ) : isClickable ? (
                  <span className="w-1 h-1 rounded-full bg-[#3D6846]" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="pt-2 border-t border-[#F0EBE0] flex items-center justify-between text-[11px] text-[#7A7468]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3D6846]" />
            <span>宜茶可约</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#BFA15F]" />
            <span>雅集吉日</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#CDC6B8]" />
            <span>席满 / 过去</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[#A09A8E]">
          实时席位同步
        </span>
      </div>

      {/* Selected Date Summary & Booking Suggestion Bar */}
      {selectedDate && (
        <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#DDD5C2] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-[#8F733E]" />
              <span className="font-oriental-serif font-bold text-xs text-[#202723]">
                已选预约日期：{selectedDate}
              </span>
              {selectedSolarTerm && (
                <span className="text-[10px] font-oriental-serif bg-[#E8DFCD] text-[#7F6432] px-2 py-0.5 rounded-full font-medium">
                  {selectedSolarTerm}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#696357] font-light flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#8F733E]" />
              <span>当日茶室晨席 (09:30)、午席 (14:00)、暮席 (18:30) 均开放钦定</span>
            </p>
          </div>

          {onQuickBookRoom && (
            <button
              onClick={onQuickBookRoom}
              className="px-3.5 py-1.5 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white text-xs font-oriental-serif tracking-wider shrink-0 transition-transform active:scale-95 shadow-xs"
            >
              预留此日席位
            </button>
          )}
        </div>
      )}
    </div>
  );
};
