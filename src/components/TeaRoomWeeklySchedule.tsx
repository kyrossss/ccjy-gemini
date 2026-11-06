import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Leaf,
  CheckCircle2,
  User,
  Flame,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';
import {
  generateWeeklySchedule,
  getTeaDifferentiatedScheduleAdvice,
  SALON_TIME_SLOTS,
  SalonSlotKey,
  predictSmartRecommendedSalonSlot,
  SmartSlotPrediction,
} from '../utils/calendarLogic';
import { TEA_ROOMS, TeaRoom } from '../data/mockData';
import { zenAudio } from '../utils/audioZen';

interface TeaRoomWeeklyScheduleProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  selectedTea: string;
  onSelectTea: (teaName: string) => void;
  isCharcoalPrepEnabled: boolean;
  onToggleCharcoalPrep: (enabled: boolean) => void;
  activeBookings: {
    id: string;
    roomName: string;
    date: string;
    timeSlot: string;
    guests: number;
    sommelier: string;
    pairedTea: string;
    finalPrice: number;
  }[];
  onBookRoomSlot: (room: TeaRoom, dateStr: string, preferredTimeSlot?: string, pairedTea?: string) => void;
}

const CURATED_SCHEDULE_TEAS = [
  { name: '诸心·凤凰单丛', tag: '单丛花蜜香' },
  { name: '沉芳·武夷岩茶', tag: '正岩足火' },
  { name: '水龙吟·正岩肉桂', tag: '岩骨辛锐' },
  { name: '1996年·中茶牌八八青饼', tag: '干仓老普' },
  { name: '爻·茶简', tag: '当代简雅' },
];

export const TeaRoomWeeklySchedule: React.FC<TeaRoomWeeklyScheduleProps> = ({
  selectedDate,
  onSelectDate,
  selectedTea,
  onSelectTea,
  isCharcoalPrepEnabled,
  onToggleCharcoalPrep,
  activeBookings,
  onBookRoomSlot,
}) => {
  const [weekStartStr, setWeekStartStr] = useState('2026-11-05');

  // Keep selectedDate visible within the 7-day strip when selectedDate changes externally
  useEffect(() => {
    if (!selectedDate) return;
    const [sy, sm, sd] = weekStartStr.split('-').map(Number);
    const [ty, tm, td] = selectedDate.split('-').map(Number);
    const startMs = Date.UTC(sy || 2026, (sm || 11) - 1, sd || 5);
    const targetMs = Date.UTC(ty || 2026, (tm || 11) - 1, td || 5);
    const diffDays = Math.round((targetMs - startMs) / 86400000);
    if (diffDays < 0 || diffDays >= 7) {
      setWeekStartStr(selectedDate);
    }
  }, [selectedDate, weekStartStr]);

  const weeklyDays = generateWeeklySchedule(
    weekStartStr,
    activeBookings,
    selectedTea,
    '2026-11-04',
    isCharcoalPrepEnabled
  );
  const activeDaySchedule =
    weeklyDays.find((d) => d.dateStr === selectedDate) || weeklyDays[0];
  const teaAdvice = getTeaDifferentiatedScheduleAdvice(selectedTea, isCharcoalPrepEnabled);

  const shiftWeek = (deltaDays: number) => {
    zenAudio.playZenChime();
    const [y, m, d] = weekStartStr.split('-').map(Number);
    const nextDate = new Date(Date.UTC(y || 2026, (m || 11) - 1, d || 5) + deltaDays * 86400000);
    const ny = nextDate.getUTCFullYear();
    const nm = String(nextDate.getUTCMonth() + 1).padStart(2, '0');
    const nd = String(nextDate.getUTCDate()).padStart(2, '0');
    const newStart = `${ny}-${nm}-${nd}`;
    setWeekStartStr(newStart);
    onSelectDate(newStart);
  };

  const handleQuickBookRecommended = () => {
    zenAudio.playZenChime();
    const targetRoom =
      TEA_ROOMS.find((r) => r.id === teaAdvice.recommendedRoomId) || TEA_ROOMS[0];
    onBookRoomSlot(
      targetRoom,
      activeDaySchedule.dateStr,
      teaAdvice.recommendedTimeSlot,
      selectedTea
    );
  };

  const [isFlickering, setIsFlickering] = useState(false);

  // 智能推荐茶席时间算法：结合用户历史预约时段/周末偏好与当前席位空置率
  const smartPrediction = predictSmartRecommendedSalonSlot(
    activeDaySchedule.dateStr,
    weeklyDays,
    activeBookings.map((b) => ({ date: b.date, timeSlot: b.timeSlot })),
    selectedTea,
    isCharcoalPrepEnabled
  );

  const handleToggleCharcoal = () => {
    zenAudio.playZenChime();
    setIsFlickering(true);
    setTimeout(() => setIsFlickering(false), 1400);
    onToggleCharcoalPrep(!isCharcoalPrepEnabled);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ECE6DB] shadow-xs space-y-4">
      {/* Top Bar: Weekly Strip Header & Navigation */}
      <div className="flex items-center justify-between border-b border-[#F0EBE0] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-oriental-serif font-bold text-sm text-[#1E2320] tracking-wider">
              独席周历 · 亲泡实况
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase px-2 py-0.5 rounded-full bg-[#FAF5E8] border border-[#EADBBD]">
              SOLE SANCTUARY
            </span>
          </div>
          <p className="text-[11px] text-[#868074] font-light mt-0.5">
            全舍独席 · 每日仅奉晨、午、暮三席，榄炭慢烹活泉
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => shiftWeek(-7)}
            className="px-2 py-1 rounded-lg border border-[#E5DEC9] hover:bg-[#F5EFE4] text-[#5C5549] text-[11px] font-oriental-serif flex items-center gap-0.5 transition-colors"
            aria-label="上一周"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>前七日</span>
          </button>
          <button
            type="button"
            onClick={() => shiftWeek(7)}
            className="px-2 py-1 rounded-lg border border-[#E5DEC9] hover:bg-[#F5EFE4] text-[#5C5549] text-[11px] font-oriental-serif flex items-center gap-0.5 transition-colors"
            aria-label="下一周"
          >
            <span>后七日</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Charcoal Water Preparation Switch Banner with Micro-Interaction Charcoal Glow & Sparks */}
      <div
        className={`relative overflow-hidden p-3.5 rounded-2xl border transition-all duration-500 flex items-center justify-between gap-3 ${
          isCharcoalPrepEnabled
            ? 'bg-gradient-to-r from-[#221813] via-[#321F17] to-[#251914] border-[#A85B3D] text-white shadow-md'
            : 'bg-[#FAF7F0] border-[#E8DFC9] text-[#2D261D]'
        }`}
      >
        {/* Animated Ember Background Glow when active */}
        {isCharcoalPrepEnabled && (
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FF5722]/20 via-[#FF9800]/10 to-transparent ${
              isFlickering ? 'animate-pulse opacity-100' : 'opacity-60'
            }`}
          />
        )}

        {/* Ambient Ember Sparks during toggle animation */}
        {isFlickering && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-around opacity-75">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7043] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#FFA726] animate-pulse delay-75" />
            <span className="w-1 h-1 rounded-full bg-[#FFAB91] animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-ping delay-200" />
          </div>
        )}

        <div className="relative z-10 flex items-center gap-2.5 min-w-0">
          {/* Flame Icon with Pulsing Ember Glow */}
          <div
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
              isCharcoalPrepEnabled
                ? 'bg-gradient-to-br from-[#E64A19] to-[#BF360C] text-white shadow-[0_0_15px_rgba(230,74,25,0.6)]'
                : 'bg-[#EDE4CE] text-[#8F733E]'
            } ${isFlickering ? 'scale-110 rotate-3' : 'scale-100'}`}
          >
            <Flame
              className={`w-5 h-5 transition-transform duration-300 ${
                isCharcoalPrepEnabled ? 'animate-bounce text-[#FFE0B2]' : ''
              }`}
            />
            {isCharcoalPrepEnabled && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFD54F] animate-ping" />
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-oriental-serif text-xs font-bold tracking-wide flex items-center gap-1.5">
                <span>「炭火备水」候汤慢饮模式</span>
                {isFlickering && (
                  <span className="text-[10px] text-[#FFCC80] animate-pulse font-mono font-normal">
                    ✦ 橄榄炭起火中...
                  </span>
                )}
              </span>
              <span
                className={`text-[9px] font-oriental-serif px-2 py-0.5 rounded-full border transition-all leading-none whitespace-nowrap shrink-0 ${
                  isCharcoalPrepEnabled
                    ? 'bg-[#B23A2B]/40 text-[#FFD6C9] border-[#FF9E80]/40 shadow-[0_0_8px_rgba(255,112,67,0.3)]'
                    : 'bg-[#FAF5E8] text-[#8F733E] border-[#8F733E]/20'
                }`}
              >
                {isCharcoalPrepEnabled ? '已自动延长30分钟' : '可一键开启'}
              </span>
            </div>
            <p
              className={`text-[11px] font-light leading-snug transition-colors ${
                isCharcoalPrepEnabled ? 'text-[#E5D7CB]' : 'text-[#6E6454]'
              }`}
            >
              {isCharcoalPrepEnabled
                ? '席前30分生火候汤，各时段已前延，静候活火烹泉仪式。'
                : '开启后席前30分生火候汤，时段自动前延，体验榄炭活泉微沸。'}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={handleToggleCharcoal}
          className={`relative z-10 px-3 py-1.5 rounded-xl font-oriental-serif text-xs font-bold tracking-wider shrink-0 transition-all active:scale-95 flex items-center gap-1.5 ${
            isCharcoalPrepEnabled
              ? 'bg-[#D8C496] text-[#231B15] hover:bg-[#E8D6AC] shadow-md border border-[#F5E6BE]'
              : 'bg-[#232B26] text-white hover:bg-black'
          }`}
        >
          <Flame
            className={`w-3.5 h-3.5 transition-colors ${
              isCharcoalPrepEnabled ? 'text-[#B23A2B] animate-pulse' : 'text-[#D8C496]'
            }`}
          />
          <span>{isCharcoalPrepEnabled ? '炭火微沸中' : '开启炭火备水'}</span>
        </button>
      </div>

      {/* 7-Day Visual Interactive Strip */}
      <div className="grid grid-cols-7 gap-1.5">
        {weeklyDays.map((day) => {
          const isSelected = day.dateStr === activeDaySchedule.dateStr;
          const isFull = day.availableSlotsCount === 0;
          const occupancyRatio = Math.round(
            ((day.totalSlotsCount - day.availableSlotsCount) / day.totalSlotsCount) * 100
          );

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => {
                zenAudio.playZenChime();
                onSelectDate(day.dateStr);
              }}
              className={`rounded-2xl p-2 flex flex-col items-center justify-between border transition-all ${
                isSelected
                  ? 'bg-[#232B26] text-white border-[#232B26] shadow-md scale-[1.02]'
                  : isFull
                  ? 'bg-[#F6F3EC] text-[#A8A195] border-[#EAE4D7]'
                  : day.solarTerm
                  ? 'bg-[#FCF8EE] text-[#232B26] border-[#E5D6B8] hover:border-[#8F733E]'
                  : 'bg-[#FAF8F5] text-[#232B26] border-[#ECE6DB] hover:border-[#8F733E]'
              }`}
            >
              <span
                className={`text-[10px] font-oriental-serif ${
                  isSelected ? 'text-[#D8C496]' : 'text-[#868074]'
                }`}
              >
                {day.weekdayCN}
              </span>

              <span className="font-mono text-sm font-bold my-0.5">{day.dayNumber}</span>

              <span
                className={`text-[9px] font-oriental-serif truncate max-w-full px-1 rounded ${
                  isSelected
                    ? 'bg-white/15 text-[#FAF5E8]'
                    : day.solarTerm
                    ? 'text-[#8F733E] font-semibold'
                    : isFull
                    ? 'text-[#B23A2B]'
                    : 'text-[#3D6846]'
                }`}
              >
                {day.statusText}
              </span>

              {/* Visual Occupancy Bar */}
              <div className="w-full h-1 rounded-full bg-black/10 overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full transition-all ${
                    isSelected
                      ? 'bg-[#D8C496]'
                      : isFull
                      ? 'bg-[#B23A2B]'
                      : 'bg-[#3D6846]'
                  }`}
                  style={{ width: `${Math.max(15, 100 - occupancyRatio)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Tea Selection & Differentiated Scheduling Recommendation Card */}
      <div className="bg-gradient-to-br from-[#FAF6EC] via-[#F6EFE0] to-[#F1E7D2] rounded-2xl p-4 border border-[#E2D3B5] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-[#2F6740]" />
            <span className="font-oriental-serif text-xs font-bold text-[#1E2320]">
              随席佳茗 · 排期建议
            </span>
            <span className="text-[10px] font-mono text-[#8F733E] bg-white/80 px-2 py-0.5 rounded-full border border-[#E2D3B5]">
              {teaAdvice.categoryLabel}
            </span>
          </div>
        </div>

        {/* Interactive Tea Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {CURATED_SCHEDULE_TEAS.map((item) => {
            const isChosen =
              selectedTea.includes(item.name.split('·')[0]) || selectedTea === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  zenAudio.playZenChime();
                  onSelectTea(item.name);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-oriental-serif shrink-0 border transition-all flex items-center gap-1.5 ${
                  isChosen
                    ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26] font-bold shadow-2xs'
                    : 'bg-white/85 text-[#4E473B] border-[#DFD5C3] hover:border-[#232B26]'
                }`}
              >
                <span>{item.name}</span>
                <span
                  className={`text-[9px] px-1 rounded ${
                    isChosen ? 'bg-[#8F733E] text-white' : 'bg-[#F3EFE6] text-[#867E70]'
                  }`}
                >
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Differentiated Advice Details */}
        <div className="bg-white/90 rounded-xl p-3 border border-[#E8DEC8] space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-oriental-serif font-bold text-[#232B26]">
                <Sparkles className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                <span>{teaAdvice.scheduleHeadline}</span>
              </div>
              <p className="text-[11px] text-[#5E574B] leading-relaxed">
                {teaAdvice.differentiatedReason}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1.5 border-t border-[#F2ECE0] text-[11px]">
            <div className="flex items-center gap-1.5 text-[#4E473B]">
              <Flame className="w-3.5 h-3.5 text-[#B23A2B] shrink-0" />
              <span className="truncate" title={teaAdvice.waterTempNote}>
                水温：{teaAdvice.waterTempNote}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#4E473B]">
              <Clock className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
              <span className="truncate" title={teaAdvice.vesselPairing}>
                席器：{teaAdvice.vesselPairing}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#4E473B]">
              <User className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
              <span>执壶：主理人亲泡</span>
            </div>
          </div>

          {/* 3-Time-Slot Suitability Comparison Bar */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
            {SALON_TIME_SLOTS.map((slot) => {
              const suit = teaAdvice.slotSuitability[slot.slotKey as SalonSlotKey];
              const isBest = teaAdvice.recommendedSlotKey === slot.slotKey;
              return (
                <div
                  key={slot.slotKey}
                  className={`p-2 rounded-xl border text-[10px] space-y-0.5 ${
                    isBest
                      ? 'bg-[#FAF5E8] border-[#C9AD75] text-[#232B26]'
                      : 'bg-[#FAF8F5] border-[#ECE6DB] text-[#6E675B]'
                  }`}
                >
                  <div className="flex items-center justify-between font-oriental-serif font-bold">
                    <span>{slot.slotLabel}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] leading-none whitespace-nowrap shrink-0 ${
                        isBest
                          ? 'bg-[#8F733E] text-white'
                          : 'bg-[#EAE4D8] text-[#6E675B]'
                      }`}
                    >
                      {suit.badge} {suit.score}%
                    </span>
                  </div>
                  <p className="text-[9px] leading-snug opacity-90 truncate">{suit.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Room x TimeSlot Reservation Matrix */}
      <div className="space-y-2.5">
        {/* Smart Slot Recommendation Prediction Banner */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF6EE] via-[#F7F1E4] to-[#F1E8D5] border border-[#C9B68F]/30 text-xs text-[#3E382E] flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#8F733E]/15 border border-[#8F733E]/30 flex items-center justify-center text-[#8F733E] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#8F733E]" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-oriental-serif font-bold text-xs text-[#202723] whitespace-nowrap">
                  智能时段测算 · 契合度 {smartPrediction.fitScore}%
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8F733E] text-white leading-none whitespace-nowrap">
                  推荐时段：{smartPrediction.recommendedSlotLabel}
                </span>
                <span className="text-[9px] font-mono text-[#2F6740] bg-[#EBF3ED] px-2 py-0.5 rounded-md border border-[#2F6740]/20 leading-none whitespace-nowrap">
                  茶席空置率 {Math.round(smartPrediction.vacancyRate * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-[#6E675B] font-light leading-relaxed">
                {smartPrediction.matchReason}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              zenAudio.playZenChime();
              const targetRoom = TEA_ROOMS.find((r) => r.id === teaAdvice.recommendedRoomId) || TEA_ROOMS[0];
              onBookRoomSlot(
                targetRoom,
                activeDaySchedule.dateStr,
                smartPrediction.fullTimeSlot,
                selectedTea
              );
            }}
            className="px-3 py-1.5 rounded-xl bg-[#232B26] hover:bg-black text-[#EEDB9F] font-oriental-serif text-xs font-bold shrink-0 transition-all shadow-xs leading-none whitespace-nowrap"
          >
            <span>一键锁定推荐</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[#8F733E]" />
            <h3 className="font-oriental-serif text-xs font-bold text-[#232B26]">
              {activeDaySchedule.dateStr} ({activeDaySchedule.weekdayCN}) 当日雅席预订实况
            </h3>
            {activeDaySchedule.solarTerm && (
              <span className="text-[10px] font-oriental-serif bg-[#FAF5E8] text-[#8F733E] px-2 py-0.5 rounded-full border border-[#E5D6B8]">
                节气雅集 · {activeDaySchedule.solarTerm}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#6E675B]">
            当日可用：{activeDaySchedule.availableSlotsCount}/{activeDaySchedule.totalSlotsCount} 席段
          </span>
        </div>

        <div className="space-y-2">
          {activeDaySchedule.rooms.map((rm) => {
            const roomObj = TEA_ROOMS.find((r) => r.id === rm.roomId) || TEA_ROOMS[0];
            const isRecommendedRoom = rm.roomId === teaAdvice.recommendedRoomId;

            return (
              <div
                key={rm.roomId}
                className={`p-3 rounded-2xl border transition-all ${
                  isRecommendedRoom
                    ? 'bg-[#FFFDF8] border-[#D8C496] shadow-2xs'
                    : 'bg-[#FAF8F5] border-[#ECE6DB]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-oriental-serif text-xs font-bold text-[#1E2320]">
                      {rm.shortName}
                    </span>
                    <span className="text-[10px] text-[#868074] font-mono">
                      ({rm.capacity})
                    </span>
                    {isRecommendedRoom && (
                      <span className="text-[9px] font-oriental-serif bg-[#FAF2DE] text-[#8F733E] px-1.5 py-0.5 rounded border border-[#E2CFA5] font-bold">
                        ✦ 「{selectedTea.slice(0, 6)}」契合茶席
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onBookRoomSlot(
                        roomObj,
                        activeDaySchedule.dateStr,
                        teaAdvice.recommendedTimeSlot,
                        selectedTea
                      )
                    }
                    className="text-[10px] font-oriental-serif text-[#8F733E] hover:underline flex items-center gap-0.5"
                  >
                    <span>选此席位</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {rm.slots.map((slot) => {
                    return (
                      <button
                        key={slot.slotKey}
                        type="button"
                        disabled={!slot.isAvailable && !slot.occupiedByUser}
                        onClick={() => {
                          zenAudio.playZenChime();
                          onBookRoomSlot(
                            roomObj,
                            activeDaySchedule.dateStr,
                            slot.fullTimeSlot,
                            selectedTea
                          );
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          slot.occupiedByUser
                            ? 'bg-[#EBF3ED] border-[#9AC4A6] text-[#285E37]'
                            : slot.isRecommendedForTea
                            ? 'bg-[#232B26] border-[#232B26] text-white shadow-xs hover:bg-black'
                            : slot.isAvailable
                            ? 'bg-white border-[#E2DBD0] text-[#232B26] hover:border-[#8F733E]'
                            : 'bg-[#F2EFE8] border-[#E6E0D4] text-[#B0A99C] cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-oriental-serif text-[11px] font-bold">
                            {slot.slotLabel}
                          </span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-oriental-serif leading-none whitespace-nowrap shrink-0 ${
                              slot.occupiedByUser
                                ? 'bg-[#285E37] text-white'
                                : slot.isRecommendedForTea
                                ? 'bg-[#D8C496] text-[#1E2320] font-bold'
                                : slot.isAvailable
                                ? 'bg-[#EBF3ED] text-[#2F6740]'
                                : 'bg-[#E5DFD3] text-[#9E978B]'
                            }`}
                          >
                            {slot.occupancyLabel}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-[9px] opacity-85 font-mono">
                          <span>{slot.timeRange}</span>
                          {slot.occupiedByUser && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* One-Click Smart Booking CTA for Recommended Tea + Slot */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#7A7264] font-light">
            点击上方任一「可预约 / 佳茗首推」时段格，即可直达对应茶席与时段锁定。
          </span>
          <button
            type="button"
            onClick={handleQuickBookRecommended}
            className="px-4 py-2 rounded-xl bg-[#232B26] hover:bg-black text-[#FAF8F5] text-xs font-oriental-serif font-bold tracking-wider shrink-0 flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D8C496]" />
            <span>一键按荐排期预约</span>
          </button>
        </div>
      </div>
    </div>
  );
};
