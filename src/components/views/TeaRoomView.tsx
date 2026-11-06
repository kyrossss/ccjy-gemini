import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Sparkles,
  Check,
  Feather,
  BellRing,
  Leaf,
  X,
  ArrowRight,
  Trash2,
  Flame,
  Volume2,
  Waves,
  ChevronDown,
  ChevronUp,
  Clock,
  Car,
  MapPin,
  BookOpen,
  Compass,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { TEA_ROOMS, TeaRoom, SOMMELIERS } from '../../data/mockData';
import { MemberTierLevel, calculateDiscountedPrice, TIER_CONFIGS } from '../../utils/teaLogic';
import { getTeaDifferentiatedScheduleAdvice } from '../../utils/calendarLogic';
import { zenAudio } from '../../utils/audioZen';
import { TeaRoomCalendar } from '../TeaRoomCalendar';
import { TeaRoomWeeklySchedule } from '../TeaRoomWeeklySchedule';
import { OrientalEmptyState } from '../OrientalEmptyState';
import { CharcoalBrewProgress } from '../CharcoalBrewProgress';
import { CharcoalHearthCanvas } from '../CharcoalHearthCanvas';
import { SongRitualStepsGuide } from '../SongRitualStepsGuide';
import { TeaSessionDiaryModal } from '../TeaSessionDiaryModal';
import {
  getAllTeaDiaries,
  TeaSessionDiaryEntry,
} from '../../utils/teaDiaryLogic';

interface TeaRoomViewProps {
  onSelectRoom: (
    room: TeaRoom,
    options?: { dateStr?: string; timeSlot?: string; pairedTea?: string; isCharcoalPrep?: boolean }
  ) => void;
  userTier: MemberTierLevel;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  preselectedTea?: string | null;
  onSelectPreselectedTea?: (teaName: string) => void;
  onClearPreselectedTea?: () => void;
  onOpenInvitation?: (booking: any) => void;
  onOpenPosterModal?: (booking: any) => void;
  onOpenMoodMemo?: (booking: any) => void;
  onTriggerCourtesyPush?: (booking: any) => void;
  onCancelBooking?: (bookingId: string) => void;
  onGoToHomeTerroir?: () => void;
  onOpenTeaProfileDossier?: () => void;
  onSaveTeaDiary?: (diary: TeaSessionDiaryEntry) => void;
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
}

const FALLBACK_ROOM_IMG = '/assets/aistudio/IMG_6488_a1ec8e50.JPG';

export const TeaRoomView: React.FC<TeaRoomViewProps> = ({
  onSelectRoom,
  userTier,
  selectedDate,
  onSelectDate,
  preselectedTea,
  onSelectPreselectedTea,
  onClearPreselectedTea,
  onOpenInvitation,
  onOpenPosterModal,
  onOpenMoodMemo,
  onTriggerCourtesyPush,
  onCancelBooking,
  onGoToHomeTerroir,
  onOpenTeaProfileDossier,
  onSaveTeaDiary,
  activeBookings,
}) => {
  const tierConfig = TIER_CONFIGS[userTier];
  const [calendarViewMode, setCalendarViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [isCharcoalPrepEnabled, setIsCharcoalPrepEnabled] = useState<boolean>(true);
  const [showWaterBoilingPrompt, setShowWaterBoilingPrompt] = useState<boolean>(false);
  const [isWaterAudioPlaying, setIsWaterAudioPlaying] = useState<boolean>(false);

  // Tea Session Diary State & Active Modal
  const [teaDiaries, setTeaDiaries] = useState<Record<string, TeaSessionDiaryEntry>>(() =>
    getAllTeaDiaries()
  );
  const [selectedBookingForDiary, setSelectedBookingForDiary] = useState<any | null>(null);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);

  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({
    'room-01': true, // 顶级茶席默认展开首泡明细以领略宋韵气象
  });
  const [focusedTea, setFocusedTea] = useState<string>(
    preselectedTea || '诸心·凤凰单丛'
  );

  useEffect(() => {
    if (preselectedTea) {
      setFocusedTea(preselectedTea);
    }
  }, [preselectedTea]);

  const activeTeaAdvice = getTeaDifferentiatedScheduleAdvice(focusedTea, isCharcoalPrepEnabled);

  const handleTeaChange = (teaName: string) => {
    setFocusedTea(teaName);
    onSelectPreselectedTea?.(teaName);
  };

  const toggleRoomExpand = (roomId: string) => {
    zenAudio.playZenChime();
    setExpandedRooms((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  /**
   * 触发基于 Web Audio API 的候汤之声（松风蟹眼沸水音效）
   * 伴随火候合度交互反馈，播放至预定节点后自动平滑淡出 (Auto fade out)
   */
  const triggerWaterBoilingSound = () => {
    zenAudio.stopContinuousSimmer(0.5);
    const started = zenAudio.startContinuousSimmer({ volume: 0.12 });
    setIsWaterAudioPlaying(true);
    setShowWaterBoilingPrompt(true);

    // 播放并在达到预定时间点（6.5秒）时自动平滑淡出
    setTimeout(() => {
      zenAudio.stopContinuousSimmer(2.2, () => {
        setIsWaterAudioPlaying(false);
      });
    }, 6500);

    setTimeout(() => {
      setShowWaterBoilingPrompt(false);
    }, 9500);
  };

  const handleToggleCharcoalPrep = (enable: boolean) => {
    setIsCharcoalPrepEnabled(enable);
    if (enable) {
      triggerWaterBoilingSound();
    } else {
      zenAudio.stopContinuousSimmer(1.2);
      setShowWaterBoilingPrompt(false);
      setIsWaterAudioPlaying(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-14 max-w-3xl mx-auto relative">
      {/* 基于全屏画布的碳火光晕背景 (Full-screen Canvas Charcoal Hearth Ambient Pulse) */}
      <CharcoalHearthCanvas enabled={isCharcoalPrepEnabled} intensity={1.0} />

      {/* Editorial Header */}
      <div className="pt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block whitespace-nowrap">
            PRIVATE TEA SANCTUARY · ONE ROOM ONE HOST
          </span>
          <h1 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1F2522] tracking-wider mt-0.5 cjk-title">
            春城嘉叶 · 私享独席
          </h1>
          <p className="text-xs text-[#7B7569] font-light mt-1 cjk-body leading-relaxed">
            全舍独设一室一席 · 主理人亲泡执壶 · 红泥榄炭慢候活泉
          </p>
        </div>

        {/* 候汤之声快捷试听按钮 */}
        {isCharcoalPrepEnabled && (
          <button
            type="button"
            onClick={triggerWaterBoilingSound}
            className={`px-3 py-1.5 rounded-2xl text-[11px] font-oriental-serif flex items-center gap-1.5 transition-all shadow-2xs shrink-0 whitespace-nowrap active:scale-95 ${
              isWaterAudioPlaying
                ? 'bg-[#C2410C] text-white border border-[#EA580C]'
                : 'bg-[#FAF2EB] text-[#BF360C] hover:bg-[#FBE5DA] border border-[#FFCCBC]'
            }`}
            title="聆听松风水沸声"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isWaterAudioPlaying ? 'animate-pulse' : ''}`} />
            <span className="whitespace-nowrap">{isWaterAudioPlaying ? '水沸生烟中...' : '候汤之声'}</span>
          </button>
        )}
      </div>

      {/* 候汤之声 · 简短交互反馈提示 (Acoustic Tea Simmer Floating Banner) */}
      {/* 候汤之声 · 简短交互反馈提示 (Acoustic Tea Simmer Floating Banner) */}
      {showWaterBoilingPrompt && (
        <div className="bg-gradient-to-r from-[#221A15] via-[#352118] to-[#1F1713] text-[#FAF6F0] p-3.5 px-4 rounded-2xl border border-[#EA580C]/25 shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EA580C]/20 border border-[#EA580C]/30 flex items-center justify-center shrink-0">
              <Volume2 className={`w-4 h-4 text-[#FB923C] ${isWaterAudioPlaying ? 'animate-bounce' : ''}`} />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-oriental-serif font-bold text-[#FED7AA] tracking-wide whitespace-nowrap">
                  候汤之声 · 松风蟹眼
                </span>
                <span className="text-[9px] font-mono text-[#F97316] bg-[#EA580C]/20 px-2 py-0.5 rounded-full border border-[#EA580C]/30 leading-none whitespace-nowrap shrink-0">
                  {isWaterAudioPlaying ? '活泉初沸中' : '火候合度'}
                </span>
              </div>
              <p className="text-[11px] text-[#D8CCC0] truncate font-light cjk-body leading-relaxed">
                「蟹眼已过鱼眼生，骤浪翻涛如松风」橄榄炭慢烧活泉，预约时段自动延长30分钟
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={triggerWaterBoilingSound}
              className="px-3 py-1.5 rounded-xl bg-[#EA580C]/25 hover:bg-[#EA580C]/40 border border-[#EA580C]/30 text-[#FED7AA] text-[11px] font-oriental-serif flex items-center gap-1 transition-all active:scale-95 whitespace-nowrap"
              title="重新播放候汤之声"
            >
              <Waves className="w-3 h-3 text-[#FDBA74] shrink-0" />
              <span>重听</span>
            </button>
            <button
              type="button"
              onClick={() => setShowWaterBoilingPrompt(false)}
              className="p-1 rounded-lg text-[#9C8F80] hover:text-[#FAF6F0] transition-colors"
              aria-label="关闭提示"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Charcoal Brewing Ritual Circular Progress Countdown Component */}
      <CharcoalBrewProgress
        isCharcoalPrepEnabled={isCharcoalPrepEnabled}
        onToggleCharcoalPrep={handleToggleCharcoalPrep}
      />

      {/* 宋式茶仪五序微观交互引导 (焚香、候汤、注水、出汤、审评) */}
      {isCharcoalPrepEnabled && (
        <SongRitualStepsGuide
          isCharcoalPrepEnabled={isCharcoalPrepEnabled}
          onTriggerWaterSound={triggerWaterBoilingSound}
        />
      )}

      {/* Preselected Tea Closed-Loop Banner (from Tea Profile Dossier or Terroir Explorer) */}
      {preselectedTea && (
        <div className="bg-[#FAF6EC] p-4 rounded-2xl border border-[#8F733E]/15 shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] border border-[#2F6740]/15 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-[#2F6740]" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-oriental-serif font-bold text-[#232B26] truncate">
                  已备试饮佳茗：「{preselectedTea}」
                </span>
                <span className="text-[9px] font-mono text-[#8F733E] bg-white px-2 py-0.5 rounded-full border border-[#8F733E]/20 leading-none whitespace-nowrap shrink-0">
                  温器醒茶
                </span>
              </div>
              <p className="text-[11px] text-[#665E50] truncate font-light leading-relaxed">
                {activeTeaAdvice.scheduleHeadline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const recommendedRoom =
                  TEA_ROOMS.find((r) => r.id === activeTeaAdvice.recommendedRoomId) || TEA_ROOMS[0];
                onSelectRoom(recommendedRoom, {
                  dateStr: selectedDate,
                  timeSlot: activeTeaAdvice.recommendedTimeSlot,
                  pairedTea: preselectedTea,
                });
              }}
              className="px-3 py-1.5 rounded-xl bg-[#232B26] hover:bg-black text-white text-xs font-oriental-serif flex items-center gap-1 transition-all shadow-2xs"
            >
              <span>锁定入席</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8C496]" />
            </button>
            {onClearPreselectedTea && (
              <button
                type="button"
                onClick={onClearPreselectedTea}
                className="p-1.5 rounded-xl hover:bg-black/5 text-[#7A7264] transition-colors"
                title="清除预选茶品"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Visual Tea Reservation Schedule (Weekly Interactive Matrix + Monthly Solar Term View) */}
      <section aria-label="茶室预约周历与月历">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#8F733E]" />
            <h2 className="font-oriental-serif text-xs font-bold text-[#232B26] tracking-wider">
              择吉入席 · 雅席可视化排期
            </h2>
          </div>

          <div className="flex items-center bg-[#EFECE3] p-0.5 rounded-xl border border-[#DDD5C4] shrink-0">
            <button
              type="button"
              onClick={() => setCalendarViewMode('weekly')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-oriental-serif transition-all whitespace-nowrap shrink-0 ${
                calendarViewMode === 'weekly'
                  ? 'bg-[#232B26] text-white font-bold shadow-2xs'
                  : 'text-[#6A6458] hover:text-[#232B26]'
              }`}
            >
              周历实况 · 茶性排期
            </button>
            <button
              type="button"
              onClick={() => setCalendarViewMode('monthly')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-oriental-serif transition-all whitespace-nowrap shrink-0 ${
                calendarViewMode === 'monthly'
                  ? 'bg-[#232B26] text-white font-bold shadow-2xs'
                  : 'text-[#6A6458] hover:text-[#232B26]'
              }`}
            >
              节气月历总览
            </button>
          </div>
        </div>

        {calendarViewMode === 'weekly' ? (
          <TeaRoomWeeklySchedule
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            selectedTea={focusedTea}
            onSelectTea={handleTeaChange}
            isCharcoalPrepEnabled={isCharcoalPrepEnabled}
            onToggleCharcoalPrep={handleToggleCharcoalPrep}
            activeBookings={activeBookings}
            onBookRoomSlot={(room, dateStr, preferredTimeSlot, pairedTea) => {
              onSelectDate(dateStr);
              onSelectRoom(room, {
                dateStr,
                timeSlot: preferredTimeSlot,
                pairedTea,
                isCharcoalPrep: isCharcoalPrepEnabled,
              });
            }}
          />
        ) : (
          <TeaRoomCalendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            onQuickBookRoom={() => {
              const recommendedRoom =
                TEA_ROOMS.find((r) => r.id === activeTeaAdvice.recommendedRoomId) || TEA_ROOMS[0];
              onSelectRoom(recommendedRoom, {
                dateStr: selectedDate,
                timeSlot: activeTeaAdvice.recommendedTimeSlot,
                pairedTea: focusedTea,
                isCharcoalPrep: isCharcoalPrepEnabled,
              });
            }}
          />
        )}
      </section>

      {/* Active User Bookings List or Unified Oriental Empty State */}
      <section aria-label="茶席预约列表" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-oriental-serif text-xs font-bold text-[#232B26] tracking-wider">
            我的近期已预约茶席 · 雅席礼遇
          </h2>
          <span className="font-mono text-[11px] text-[#868074]">
            {activeBookings.length > 0 ? `${activeBookings.length} 个席位已锁定` : '当前尚无预约'}
          </span>
        </div>

        {activeBookings.length === 0 ? (
          <OrientalEmptyState
            variant="bookings"
            compact
            onPrimaryAction={() => onSelectRoom(TEA_ROOMS[0])}
            onSecondaryAction={onGoToHomeTerroir}
            onSmartRecommendationClick={(rec) => {
              if (rec.id === 'rec-booking-tingzhu' && TEA_ROOMS[1]) {
                onSelectRoom(TEA_ROOMS[1]);
              } else if (rec.targetTab === 'home' && onGoToHomeTerroir) {
                onGoToHomeTerroir();
              } else {
                onSelectRoom(TEA_ROOMS[0]);
              }
            }}
          />
        ) : (
          <div className="bg-[#EBF3ED] p-4 rounded-3xl border border-[#CCE2D2] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#2A653B] font-medium">
              <span className="text-[11px] font-oriental-serif">已锁定专席凭证</span>
              <div className="flex items-center gap-2">
                {onTriggerCourtesyPush && activeBookings[0] && (
                  <button
                    type="button"
                    onClick={() => onTriggerCourtesyPush(activeBookings[0])}
                    className="text-[10px] font-oriental-serif text-[#8F733E] bg-[#FAF6EC] hover:bg-[#F2E8D2] border border-[#E2D3B3] px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
                  >
                    <BellRing className="w-3 h-3" />
                    <span>模拟 24h 临席礼遇通知</span>
                  </button>
                )}
              </div>
            </div>
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-4 rounded-2xl border border-[#2F6740]/20 text-xs space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-oriental-serif font-bold text-[#232B26] block truncate">
                      {b.roomName}
                    </span>
                    <span className="text-[11px] text-[#6E685C] mt-0.5 block truncate">
                      {b.date} · {b.timeSlot.split(' ')[0]} · {b.guests}位 · {b.pairedTea}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-[#EBF3ED] text-[#2F6740] px-2.5 py-0.5 rounded-full border border-[#2F6740]/20 shrink-0 leading-none whitespace-nowrap">
                    有效席位
                  </span>
                </div>

                {/* Tea Session Diary Section (茶器、茶品、茶感 · 个人风土档案闭环) */}
                {teaDiaries[b.id] ? (
                  <div className="p-3 rounded-xl bg-[#FAF6EC] border border-[#8F733E]/15 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <BookOpen className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                        <span className="font-oriental-serif font-bold text-xs text-[#242B27] whitespace-nowrap">
                          已存档茶事日记
                        </span>
                        <span className="text-[9px] font-mono bg-white text-[#2F6740] px-2 py-0.5 rounded-full border border-[#2F6740]/20 leading-none whitespace-nowrap shrink-0">
                          已归档至个人风土档案
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBookingForDiary(b);
                          setIsDiaryModalOpen(true);
                        }}
                        className="text-[10px] font-oriental-serif text-[#8F733E] hover:underline whitespace-nowrap shrink-0"
                      >
                        查阅/增补 ➔
                      </button>
                    </div>
                    <p className="text-[11px] text-[#5C5547] font-oriental-serif line-clamp-1 italic leading-relaxed">
                      「{teaDiaries[b.id].teaExperience}」
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {teaDiaries[b.id].extractedTags.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-oriental-serif px-2 py-0.5 rounded-md bg-white text-[#8F733E] border border-[#8F733E]/20 leading-none whitespace-nowrap"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#232B26]/[0.06] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                      <div className="space-y-0.5 min-w-0">
                        <span className="font-oriental-serif font-bold text-[#232B26] block truncate">
                          品鉴毕席 · 记录今日茶事日记
                        </span>
                        <span className="text-[10px] text-[#7A7365] block truncate font-light">
                          AI辅助解析器、茶、感，闭环反哺个人风土雷达
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingForDiary(b);
                        setIsDiaryModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#8F733E] hover:bg-[#785E2F] text-white text-[11px] font-oriental-serif font-medium shrink-0 shadow-2xs transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <Feather className="w-3 h-3 shrink-0" />
                      <span>记录茶事</span>
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-[#F0ECE3] flex items-center justify-between gap-2">
                  {onCancelBooking ? (
                    <button
                      type="button"
                      onClick={() => onCancelBooking(b.id)}
                      className="text-[11px] font-oriental-serif text-[#A34A3C] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>退约</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookingForDiary(b);
                        setIsDiaryModalOpen(true);
                      }}
                      className="h-8 px-2.5 rounded-xl text-xs font-oriental-serif text-[#8F733E] bg-[#FAF6EC] border border-[#EADBBD] hover:bg-[#F3EAD5] transition-colors flex items-center gap-1 font-medium whitespace-nowrap shrink-0"
                    >
                      <BookOpen className="w-3 h-3 text-[#8F733E]" />
                      <span>{teaDiaries[b.id] ? '茶事档案' : '录茶事日记'}</span>
                    </button>
                    {onOpenInvitation && (
                      <button
                        type="button"
                        onClick={() => onOpenInvitation(b)}
                        className="h-8 px-2.5 rounded-xl text-xs font-oriental-serif text-[#554E42] bg-[#FAF8F5] border border-[#DDD5C4] hover:bg-white transition-colors whitespace-nowrap shrink-0"
                      >
                        邀请函
                      </button>
                    )}
                    {onOpenPosterModal && (
                      <button
                        type="button"
                        onClick={() => onOpenPosterModal(b)}
                        className="h-8 px-3 rounded-xl text-xs font-oriental-serif text-white bg-[#232B26] hover:bg-black transition-all flex items-center gap-1.5 shadow-2xs font-bold active:scale-95 whitespace-nowrap shrink-0"
                      >
                        <Sparkles className="w-3 h-3 text-[#D8C496]" />
                        <span>邀约海报</span>
                      </button>
                    )}
                    {onOpenMoodMemo && (
                      <button
                        type="button"
                        onClick={() => onOpenMoodMemo(b)}
                        className="h-8 px-2.5 rounded-xl text-xs font-oriental-serif text-[#8F733E] bg-[#FAF6EC] border border-[#EADBBD] hover:bg-[#F3EAD5] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                      >
                        <Feather className="w-3 h-3" />
                        <span>心境</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sole Chamber Showcase */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8F733E]" />
            <h2 className="font-oriental-serif text-xs font-bold text-[#232B26] tracking-wide">
              全舍独席 · 雅席规格
            </h2>
          </div>
          <span className="text-[11px] text-[#8F733E] font-oriental-serif">
            {selectedDate ? `入席吉日：${selectedDate}` : '请先选定吉日'}
          </span>
        </div>

        {TEA_ROOMS.map((room, rIdx) => {
          const discounted = calculateDiscountedPrice(room.basePrice, userTier);
          const hasDiscount = discounted < room.basePrice;
          const isExpanded = !!expandedRooms[room.id];

          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#D8C7A5] shadow-xs flex flex-col group transition-all"
            >
              {/* Room Photography */}
              <div className="relative aspect-16/9 w-full bg-[#181F1B] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_ROOM_IMG;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between gap-2">
                  <div className="bg-[#B23A2B] text-white text-[10px] font-oriental-serif px-2.5 py-0.5 rounded-full shadow-xs tracking-wider flex items-center gap-1 whitespace-nowrap shrink-0">
                    <span>0{rIdx + 1} 席</span>
                    <span>·</span>
                    <span>{room.capacity}</span>
                  </div>
                  {room.basePrice === 2680 && (
                    <span className="bg-[#8F733E] text-white text-[10px] font-oriental-serif px-2.5 py-0.5 rounded-full shadow-xs tracking-wider flex items-center gap-1 whitespace-nowrap shrink-0">
                      <Car className="w-3 h-3" />
                      <span>可安排专车接送</span>
                    </span>
                  )}
                </div>

                {/* Bottom Overlay Title & Subtitle */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] tracking-widest text-[#E6D4AA] font-mono block whitespace-nowrap">
                    {room.theme}
                  </span>
                  <h3 className="font-oriental-serif text-base sm:text-lg font-bold tracking-wide cjk-title">
                    {room.name}
                  </h3>
                </div>
              </div>

              {/* Room Body */}
              <div className="p-4 space-y-3">
                {/* Meta Summary Pills: 时长、预约提前量、地点 */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="bg-[#FAF4E8] text-[#8F733E] px-2 py-0.5 rounded-lg border border-[#EADBBD] flex items-center gap-1 font-mono whitespace-nowrap shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{room.duration}</span>
                  </span>
                  <span className="bg-[#F4F1EA] text-[#554D3F] px-2 py-0.5 rounded-lg border border-[#DFD8C7] font-mono whitespace-nowrap shrink-0">
                    {room.noticeAdvance}
                  </span>
                  <span className="bg-[#F2ECE1] text-[#635A4B] px-2 py-0.5 rounded-lg border border-[#DDD3C0] flex items-center gap-1 whitespace-nowrap shrink-0">
                    <MapPin className="w-3 h-3 text-[#8F733E]" />
                    <span>深圳·北站附近私人茶室</span>
                  </span>
                </div>

                {/* Short Lead Description */}
                <p className="text-xs text-[#5D574C] font-light leading-relaxed cjk-body">
                  {room.description}
                </p>

                {/* Facilities - Clean grid pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#524B3F]">
                  {room.facilities.map((fac, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-[#FAF7F0] px-2.5 py-1.5 rounded-xl border border-[#ECE5D8]"
                    >
                      <Check className="w-3 h-3 text-[#2F6740] shrink-0" />
                      <span className="truncate">{fac}</span>
                    </div>
                  ))}
                </div>

                {/* Expandable Full Verbatim Copy Accordion (文案照录全录) */}
                {room.detailedCopy && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toggleRoomExpand(room.id)}
                      className="w-full py-2 px-3 rounded-xl bg-[#FAF6EC] hover:bg-[#F4EEDF] border border-[#EADBBD] text-xs font-oriental-serif text-[#8F733E] font-medium flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isExpanded ? '收起茶事与器皿文案全录' : '查看完整茶事文案与用器详情（逐泡名茗、主泡器与须知）'}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-[#8F733E]" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-[#8F733E]" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-3 text-xs text-[#4F473B] animate-in fade-in duration-200">
                        {/* Tea Rounds List */}
                        <div className="space-y-1.5">
                          <span className="font-oriental-serif font-bold text-[#232B26] block text-xs">
                            ✦ {room.detailedCopy.roundsTitle || '茶席三泡明细'}
                          </span>
                          <div className="space-y-1.5">
                            {room.detailedCopy.teaRounds.map((tr, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-white border border-[#232B26]/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]"
                              >
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-oriental-serif font-bold text-[#8F733E] whitespace-nowrap">
                                    {tr.round}：
                                  </span>
                                  <span className="font-medium text-[#232B26]">{tr.tea}</span>
                                </div>
                                <div className="flex items-baseline gap-2 text-[#6B6355]">
                                  <span className="font-mono text-[#BF360C] bg-[#FBEBE7] px-2 py-0.5 rounded-md border border-[#BF360C]/20 leading-none whitespace-nowrap">
                                    {tr.pricePerJin}
                                  </span>
                                  <span className="text-[10px] text-[#7A7264]">{tr.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Vessels */}
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-[#FAF3E6] border border-[#8F733E]/15 text-[11px]">
                          <span className="font-oriental-serif font-bold text-[#8F733E] block">
                            ✦ {room.detailedCopy.vessels.title}
                          </span>
                          <p className="text-[#5F5647] leading-relaxed cjk-body">
                            {room.detailedCopy.vessels.desc}
                          </p>
                        </div>

                        {/* Charcoal Water & Schedule */}
                        <div className="space-y-1 text-[11px] text-[#635A4B]">
                          <div><strong className="text-[#232B26]">炭煮活水：</strong>{room.detailedCopy.charcoalNotes}</div>
                          <div><strong className="text-[#232B26]">时间排期：</strong>{room.detailedCopy.scheduleNotes}</div>
                          <div><strong className="text-[#232B26]">茶食标准：</strong>{room.detailedCopy.snacks}</div>
                        </div>

                        {/* Notice & Cancellation */}
                        <div className="pt-2 border-t border-[#EFE8D8] text-[10px] text-[#8C8372] space-y-0.5">
                          <strong className="text-[#232B26]">入席须知：</strong>
                          <p>{room.detailedCopy.notice}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing & Capacity */}
                <div className="pt-2 border-t border-[#F2EEE6] flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1 text-[#868074] whitespace-nowrap shrink-0">
                    <Users className="w-3.5 h-3.5" />
                    <span>入席规模：{room.capacity}</span>
                  </div>

                  <div className="flex items-baseline gap-1.5 whitespace-nowrap price-nowrap shrink-0">
                    <span className="font-mono text-base font-bold text-[#1E2320]">
                      ¥{discounted}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-[#9B9588] line-through font-mono">
                        ¥{room.basePrice}
                      </span>
                    )}
                    <span className="text-[10px] text-[#868074]">/ {room.serviceType || '场'}</span>
                  </div>
                </div>

                {/* Reserve CTA */}
                <button
                  type="button"
                  onClick={() => onSelectRoom(room)}
                  className="w-full h-11 px-3 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xs text-center whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {preselectedTea
                      ? `携「${preselectedTea.slice(0, 8)}」入席 · 主理人亲泡`
                      : `预留 ${room.name} · 主理人亲泡`}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tea Master Host Showcase */}
      <div className="pt-1 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#8F733E]" />
          <h2 className="font-oriental-serif text-xs font-bold text-[#232B26] tracking-wide">
            茶舍主理人 · 亲泡执壶
          </h2>
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#232B26]/[0.06] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#232B26] text-[#FAF8F5] flex items-center justify-center font-oriental-serif font-bold text-base shrink-0 border border-[#8F733E]/30 shadow-xs">
            {SOMMELIERS[0].avatar}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold font-oriental-serif text-[#202723]">
                {SOMMELIERS[0].name}
              </h3>
              <span className="text-[10px] text-[#8F733E] font-oriental-serif bg-white px-2.5 py-0.5 rounded-full border border-[#8F733E]/20 leading-none whitespace-nowrap shrink-0">
                {SOMMELIERS[0].title}
              </span>
              <span className="text-[10px] text-[#8A8477] font-mono whitespace-nowrap shrink-0">
                {SOMMELIERS[0].experience}
              </span>
            </div>
            <p className="text-[11px] text-[#635B4E] leading-relaxed cjk-body">
              每场亲备红泥小炉与天然榄炭，慢候活泉，细辨山场气韵，静候知音雅步。
            </p>
          </div>
        </div>
      </div>

      {/* Tea Session Diary Modal (茶事日记 · 雅席风土存证) */}
      <TeaSessionDiaryModal
        isOpen={isDiaryModalOpen}
        onClose={() => setIsDiaryModalOpen(false)}
        booking={selectedBookingForDiary}
        existingDiary={selectedBookingForDiary ? teaDiaries[selectedBookingForDiary.id] : null}
        onDiarySaved={(savedDiary) => {
          setTeaDiaries((prev) => ({ ...prev, [savedDiary.bookingId]: savedDiary }));
          onSaveTeaDiary?.(savedDiary);
        }}
        onOpenTeaProfileDossier={onOpenTeaProfileDossier}
      />
    </div>
  );
};
