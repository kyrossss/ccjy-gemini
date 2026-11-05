import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Feather,
  Check,
  Copy,
  CalendarPlus,
  RefreshCw,
  Flame,
  Shirt,
  CheckSquare,
  Square,
  BookmarkCheck,
} from 'lucide-react';
import { BookingInvitationData } from './TeaInvitationModal';
import {
  MOOD_ARCHETYPES,
  DEFAULT_COURTESY_CHECKLIST,
  CourtesyChecklistItem,
  CourtesyMoodMemo,
  generateCuratedMoodMemo,
} from '../utils/courtesyNotificationLogic';
import { downloadCalendarEvent } from '../utils/calendarExport';
import { zenAudio } from '../utils/audioZen';

interface CourtesyMoodMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingInvitationData | null;
  existingMemo?: CourtesyMoodMemo | null;
  onSaveMemo: (memo: CourtesyMoodMemo) => void;
}

export const CourtesyMoodMemoModal: React.FC<CourtesyMoodMemoModalProps> = ({
  isOpen,
  onClose,
  booking,
  existingMemo,
  onSaveMemo,
}) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>('pine-leisure');
  const [poeticNote, setPoeticNote] = useState<string>('');
  const [incensePairing, setIncensePairing] = useState<string>('');
  const [attireTip, setAttireTip] = useState<string>('');
  const [checklist, setChecklist] = useState<CourtesyChecklistItem[]>(DEFAULT_COURTESY_CHECKLIST);
  const [isPolishing, setIsPolishing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calendarExported, setCalendarExported] = useState(false);

  useEffect(() => {
    if (!isOpen || !booking) return;
    if (existingMemo && existingMemo.bookingId === booking.id) {
      setSelectedMoodId(existingMemo.moodId);
      setPoeticNote(existingMemo.poeticNote);
      setIncensePairing(existingMemo.incensePairing);
      setAttireTip(existingMemo.attireTip);
    } else {
      const initial = generateCuratedMoodMemo(booking, 'pine-leisure');
      setSelectedMoodId(initial.moodId);
      setPoeticNote(initial.poeticNote);
      setIncensePairing(initial.incensePairing);
      setAttireTip(initial.attireTip);
    }
    setSavedSuccess(false);
  }, [isOpen, booking, existingMemo]);

  if (!isOpen || !booking) return null;

  const handleSelectMood = (moodId: string) => {
    zenAudio.playZenChime();
    setSelectedMoodId(moodId);
    const updated = generateCuratedMoodMemo(booking, moodId);
    setPoeticNote(updated.poeticNote);
    setIncensePairing(updated.incensePairing);
    setAttireTip(updated.attireTip);
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAIPolish = async () => {
    setIsPolishing(true);
    zenAudio.playZenChime();
    try {
      const res = await fetch('/api/salon/mood-memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking,
          moodId: selectedMoodId,
          userNote: poeticNote,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setPoeticNote(json.data.poeticNote);
          setIncensePairing(json.data.incensePairing);
          setAttireTip(json.data.attireTip);
          setIsPolishing(false);
          return;
        }
      }
      const fallback = generateCuratedMoodMemo(booking, selectedMoodId);
      setPoeticNote(fallback.poeticNote);
    } catch {
      const fallback = generateCuratedMoodMemo(booking, selectedMoodId);
      setPoeticNote(fallback.poeticNote);
    } finally {
      setIsPolishing(false);
    }
  };

  const buildMemoObject = (): CourtesyMoodMemo => {
    const moodObj = MOOD_ARCHETYPES.find((m) => m.id === selectedMoodId) || MOOD_ARCHETYPES[0];
    return {
      id: existingMemo?.id || `MEMO-${Date.now().toString(36).toUpperCase()}`,
      bookingId: booking.id,
      roomName: booking.roomName,
      date: booking.date,
      timeSlot: booking.timeSlot,
      sommelier: booking.sommelier,
      pairedTea: booking.pairedTea,
      moodId: moodObj.id,
      moodLabel: moodObj.label,
      poeticNote,
      incensePairing,
      attireTip,
      checklist: checklist.filter((c) => c.checked).map((c) => c.text),
      createdAt: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const handleSave = () => {
    zenAudio.playZenChime();
    const memo = buildMemoObject();
    onSaveMemo(memo);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const handleCopyMemo = () => {
    zenAudio.playZenChime();
    const memo = buildMemoObject();
    const text = [
      `【春城嘉叶 · 雅席礼遇 · 赴约心境备忘录】`,
      `预约茶席：${memo.roomName}`,
      `入席吉时：${memo.date} · ${memo.timeSlot}`,
      `侍茶师：${memo.sommelier} | 开席茶礼：${memo.pairedTea}`,
      `赴约心境：【${memo.moodLabel}】`,
      ``,
      `${memo.poeticNote}`,
      ``,
      `· 席间焚香：${memo.incensePairing}`,
      `· 行前雅训：${memo.attireTip}`,
    ].join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportToCalendarWithMemo = () => {
    zenAudio.playZenChime();
    const memo = buildMemoObject();
    const bookingCode = booking.bookingCode || `YUN-${booking.id.slice(-6).toUpperCase()}`;
    const ok = downloadCalendarEvent({
      title: `春城嘉叶雅席【${memo.moodLabel}】· ${booking.roomName}`,
      roomName: booking.roomName,
      date: booking.date,
      timeSlot: booking.timeSlot,
      guests: booking.guests,
      sommelier: booking.sommelier,
      pairedTea: `${booking.pairedTea}（心境：${memo.moodLabel}）`,
      bookingCode,
      location: '春城嘉叶 · 潮州工夫茶舍（深圳市南山区）',
    });
    if (ok) {
      setCalendarExported(true);
      setTimeout(() => setCalendarExported(false), 3500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] bg-[#FAF8F3] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#D8C7A5] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#1E2722] via-[#26332C] to-[#1A221E] text-[#FAF8F5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8F733E]/30 border border-[#D8C496]/40 flex items-center justify-center text-[#EEDB9F]">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono tracking-widest text-[#D8C496] uppercase">
                  SALON COURTESY · 雅席礼遇
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#B23A2B] text-white text-[9px] font-mono">
                  临席 24H 备忘
                </span>
              </div>
              <h2 className="font-oriental-serif text-base sm:text-lg font-bold text-white tracking-wider">
                「赴约心境」行前备忘录
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#E5DFD3] flex items-center justify-center transition-colors"
            aria-label="关闭备忘录"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* Booking Summary Strip */}
          <div className="p-3.5 rounded-2xl bg-[#F3EFE6] border border-[#E2D9C5] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-[#8F733E] block">
                即将赴约席次 · 侍茶师 {booking.sommelier} 恭候
              </span>
              <h3 className="font-oriental-serif font-bold text-[#1E2320] text-sm">
                {booking.roomName}
              </h3>
              <span className="text-[11px] text-[#6E6759] block">
                {booking.date} · {booking.timeSlot.split(' ')[0]} · 开席茶礼：{booking.pairedTea}
              </span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-white border border-[#DCD2BE] text-center shrink-0">
              <span className="text-[9px] font-mono text-[#8C8578] block">入席宾客</span>
              <span className="font-oriental-serif font-bold text-xs text-[#232B26]">
                {booking.guests} 位雅士
              </span>
            </div>
          </div>

          {/* 1. Mood Archetype Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-oriental-serif text-xs font-bold text-[#232B26]">
                一、择定赴席心境基调
              </label>
              <span className="text-[10px] text-[#8C8578] font-mono">
                点击切换心境意象
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {MOOD_ARCHETYPES.map((m) => {
                const isSelected = selectedMoodId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMood(m.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26] shadow-sm'
                        : 'bg-white text-[#232B26] border-[#E6DFD1] hover:border-[#8F733E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-oriental-serif font-bold text-xs tracking-wide">
                        {m.label}
                      </span>
                      <span
                        className={`text-[9px] font-mono ${
                          isSelected ? 'text-[#D8C496]' : 'text-[#8C8578]'
                        }`}
                      >
                        {m.enLabel}
                      </span>
                    </div>
                    <p
                      className={`text-[10px] mt-1 line-clamp-1 ${
                        isSelected ? 'text-[#D0C9B8]' : 'text-[#787163]'
                      }`}
                    >
                      {m.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Poetic Mood Note Editor + AI Polish */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-oriental-serif text-xs font-bold text-[#232B26]">
                二、赴约心境随笔手记
              </label>
              <button
                type="button"
                onClick={handleAIPolish}
                disabled={isPolishing}
                className="px-2.5 py-1 rounded-xl bg-[#FAF3E3] hover:bg-[#F2E6CE] border border-[#E2CFA8] text-[#8F733E] text-[11px] font-oriental-serif font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isPolishing ? 'animate-spin' : ''}`} />
                <span>{isPolishing ? 'AI 雅言润色中...' : 'AI 雅言润色'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={poeticNote}
                onChange={(e) => setPoeticNote(e.target.value)}
                placeholder="记录您此刻赴约前的心境与期待..."
                className="w-full rounded-2xl bg-white border border-[#DED6C6] p-3.5 text-xs font-oriental-serif text-[#2B261F] leading-relaxed focus:outline-none focus:border-[#8F733E] resize-none"
              />
            </div>
          </div>

          {/* 3. Curated Incense & Attire Etiquette Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white border border-[#ECE5D7] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-oriental-serif font-bold text-[#8F733E]">
                <Flame className="w-3.5 h-3.5" />
                <span>席间司香预配</span>
              </div>
              <p className="text-xs font-oriental-serif text-[#232B26] font-medium">
                {incensePairing}
              </p>
              <span className="text-[10px] text-[#8A8375] block">
                侍茶师将于入席前 15 分钟为您燃香净室
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#ECE5D7] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-oriental-serif font-bold text-[#2F6740]">
                <Shirt className="w-3.5 h-3.5" />
                <span>赴席衣冠雅训</span>
              </div>
              <p className="text-[11px] text-[#4A4439] leading-snug">
                {attireTip}
              </p>
            </div>
          </div>

          {/* 4. Pre-Arrival Courtesy Checklist */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#ECE5D7] space-y-2">
            <span className="font-oriental-serif text-xs font-bold text-[#232B26] block">
              三、临席行前礼遇自检
            </span>
            <div className="space-y-1.5">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleChecklist(item.id)}
                  className="w-full py-1.5 px-2 rounded-xl hover:bg-[#FAF8F4] flex items-center gap-2 text-left text-xs transition-colors"
                >
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-[#2F6740] shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#B5AEA0] shrink-0" />
                  )}
                  <span
                    className={
                      item.checked ? 'text-[#232B26] font-medium' : 'text-[#847D70]'
                    }
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Toast */}
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-[#EBF3ED] border border-[#C7E0CE] text-[#285E37] text-xs flex items-center gap-2 animate-in fade-in">
              <BookmarkCheck className="w-4 h-4 shrink-0" />
              <span>
                <strong>「赴约心境」备忘录已镌刻保存！</strong> 已关联至您的茶席预约卡片，侍茶师将按此为您布置席面。
              </span>
            </div>
          )}

          {calendarExported && (
            <div className="p-3 rounded-xl bg-[#FAF3E3] border border-[#E5D3B3] text-[#7D6230] text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>已将「赴约心境」备忘录一并写入系统日历日程 (.ics)！</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#ECE5D7] flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#232B26] hover:bg-black text-white font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#D8C496]" />
              <span>保存「赴约心境」备忘录</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMemo}
              className="py-3 px-3.5 rounded-2xl bg-[#F5F1E8] hover:bg-[#EAE3D5] border border-[#DED5C3] text-[#4E473B] font-oriental-serif text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制手记</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportToCalendarWithMemo}
            className="w-full py-2 px-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-[#E5DEC9] text-[#6B6354] font-oriental-serif text-[11px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-[#8F733E]" />
            <span>携此心境备忘同步至系统原生日历 (.ics)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
