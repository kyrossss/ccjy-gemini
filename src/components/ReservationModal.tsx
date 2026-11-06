import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Calendar as CalIcon,
  Users,
  Clock,
  CheckCircle2,
  QrCode,
  Sparkles,
  Leaf,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { TeaRoom, SOMMELIERS } from '../data/mockData';
import {
  MemberTierLevel,
  calculateDiscountedPrice,
  validateReservation,
  TIER_CONFIGS,
} from '../utils/teaLogic';
import { buildAvailableSalonTeas } from '../utils/orderResumeLogic';
import { zenAudio } from '../utils/audioZen';
import { BookingInvitationData } from './TeaInvitationModal';
import { OrientalScrollTimePicker } from './OrientalScrollTimePicker';

export interface TimeSlotOptionConfig {
  key: 'morning' | 'afternoon' | 'evening';
  name: string;
  iconText: string;
  subTitle: string;
  standardTime: string;
  charcoalTime: string;
  standardPoetic: string;
  charcoalPoetic: string;
  standardSlot: string;
  charcoalSlot: string;
  teaSuggestion: string;
}

export const TIME_SLOT_CAROUSEL_OPTIONS: TimeSlotOptionConfig[] = [
  {
    key: 'morning',
    name: '晨席',
    iconText: '晨',
    subTitle: '清和初醒',
    standardTime: '09:30 - 12:00',
    charcoalTime: '09:00 - 12:00',
    standardPoetic: '清和早茗 · 醒神回甘',
    charcoalPoetic: '生火候汤 · 榄炭初沸',
    standardSlot: '晨席 (09:30 - 12:00 · 清和早茗)',
    charcoalSlot: '晨席 (09:00 - 12:00 · 炭火备水·生火候汤)',
    teaSuggestion: '宜白茶、明前龙井、清香乌龙',
  },
  {
    key: 'afternoon',
    name: '午席',
    iconText: '午',
    subTitle: '浮生半日',
    standardTime: '14:00 - 17:00',
    charcoalTime: '13:30 - 17:00',
    standardPoetic: '浮生半日 · 慢品沉香',
    charcoalPoetic: '慢火烹泉 · 活泉微沸',
    standardSlot: '午席 (14:00 - 17:00 · 浮生半日)',
    charcoalSlot: '午席 (13:30 - 17:00 · 炭火备水·慢火烹泉)',
    teaSuggestion: '宜武夷岩茶、老枞水仙、陈年普洱',
  },
  {
    key: 'evening',
    name: '暮席',
    iconText: '暮',
    subTitle: '幽玄围炉',
    standardTime: '18:30 - 21:30',
    charcoalTime: '18:00 - 21:30',
    standardPoetic: '幽玄夜席 · 静夜闲话',
    charcoalPoetic: '围炉夜候 · 银壶生汤',
    standardSlot: '暮席 (18:30 - 21:30 · 幽玄夜席)',
    charcoalSlot: '暮席 (18:00 - 21:30 · 炭火备水·围炉夜候)',
    teaSuggestion: '宜熟普、老白茶、古树红茶',
  },
];

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: TeaRoom | null;
  userTier: MemberTierLevel;
  initialDate?: string;
  initialTimeSlot?: string | null;
  preselectedTea?: string | null;
  initialIsCharcoalPrep?: boolean;
  onOpenInvitation?: (booking: BookingInvitationData) => void;
  onOpenPosterModal?: (booking: BookingInvitationData) => void;
  onConfirmBooking: (booking: {
    id: string;
    roomName: string;
    date: string;
    timeSlot: string;
    guests: number;
    sommelier: string;
    pairedTea: string;
    finalPrice: number;
    bookingCode?: string;
  }) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  room,
  userTier,
  initialDate,
  initialTimeSlot,
  preselectedTea,
  initialIsCharcoalPrep,
  onOpenInvitation,
  onOpenPosterModal,
  onConfirmBooking,
}) => {
  // Tomorrow as fallback date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(initialDate || defaultDateStr);
  const [isCharcoalPrep, setIsCharcoalPrep] = useState<boolean>(() => {
    if (initialIsCharcoalPrep !== undefined) return initialIsCharcoalPrep;
    if (initialTimeSlot) {
      return (
        initialTimeSlot.includes('炭火') ||
        initialTimeSlot.includes('09:00') ||
        initialTimeSlot.includes('13:30') ||
        initialTimeSlot.includes('18:00')
      );
    }
    return true;
  });

  const [timeSlot, setTimeSlot] = useState(() => {
    if (initialTimeSlot) return initialTimeSlot;
    return isCharcoalPrep
      ? TIME_SLOT_CAROUSEL_OPTIONS[1].charcoalSlot
      : TIME_SLOT_CAROUSEL_OPTIONS[1].standardSlot;
  });

  const [guests, setGuests] = useState(2);
  const [selectedSommelier, setSelectedSommelier] = useState(SOMMELIERS[0].name);
  const [selectedTea, setSelectedTea] = useState(
    preselectedTea || room?.recommendedTeas[0] || '老枞水仙'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPass, setCreatedPass] = useState<string | null>(null);
  const [lastBookingData, setLastBookingData] = useState<BookingInvitationData | null>(null);
  const [isFlickering, setIsFlickering] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate, isOpen]);

  useEffect(() => {
    if (initialTimeSlot) {
      setTimeSlot(initialTimeSlot);
      if (
        initialTimeSlot.includes('炭火') ||
        initialTimeSlot.includes('09:00') ||
        initialTimeSlot.includes('13:30') ||
        initialTimeSlot.includes('18:00')
      ) {
        setIsCharcoalPrep(true);
      }
    }
  }, [initialTimeSlot, isOpen]);

  useEffect(() => {
    if (initialIsCharcoalPrep !== undefined) {
      setIsCharcoalPrep(initialIsCharcoalPrep);
    }
  }, [initialIsCharcoalPrep, isOpen]);

  useEffect(() => {
    if (isOpen && room) {
      setIsSuccess(false);
      setErrorMsg('');
      const available = buildAvailableSalonTeas(room.recommendedTeas, preselectedTea);
      setSelectedTea(available[0] || '老枞水仙');
      setGuests((prev) => Math.min(prev, room.maxGuests));
    }
  }, [isOpen, room, preselectedTea]);

  const handleToggleCharcoalPrep = () => {
    zenAudio.playZenChime();
    setIsFlickering(true);
    setTimeout(() => setIsFlickering(false), 1200);

    const nextMode = !isCharcoalPrep;
    setIsCharcoalPrep(nextMode);

    // Synchronize currently selected slot to corresponding duration
    const matched = TIME_SLOT_CAROUSEL_OPTIONS.find(
      (c) =>
        timeSlot === c.standardSlot ||
        timeSlot === c.charcoalSlot ||
        timeSlot.includes(c.name)
    ) || TIME_SLOT_CAROUSEL_OPTIONS[1];

    setTimeSlot(nextMode ? matched.charcoalSlot : matched.standardSlot);
  };

  const handleSelectSlotOption = (option: TimeSlotOptionConfig, index: number) => {
    zenAudio.playZenChime();
    const newSlot = isCharcoalPrep ? option.charcoalSlot : option.standardSlot;
    setTimeSlot(newSlot);
    setErrorMsg('');

    // Smoothly scroll selected card toward center
    cardRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const isSlotOptionActive = (option: TimeSlotOptionConfig) => {
    return (
      timeSlot === option.standardSlot ||
      timeSlot === option.charcoalSlot ||
      timeSlot.startsWith(option.name)
    );
  };

  const activeSlotIndex = TIME_SLOT_CAROUSEL_OPTIONS.findIndex(isSlotOptionActive);

  const scrollSlots = (direction: 'left' | 'right') => {
    zenAudio.playZenChime();
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isOpen || !room) return null;

  const availableTeas = buildAvailableSalonTeas(room.recommendedTeas, preselectedTea);
  const discountedPrice = calculateDiscountedPrice(room.basePrice, userTier);
  const tierConfig = TIER_CONFIGS[userTier];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateReservation(date, timeSlot, guests, room.maxGuests);
    if (!validation.valid) {
      setErrorMsg(validation.reason || '预约信息有误');
      return;
    }

    zenAudio.playZenChime();
    const passId = `YUN-SEAT-${Math.floor(100000 + Math.random() * 900000)}`;
    setCreatedPass(passId);

    const payload: BookingInvitationData = {
      id: passId,
      roomName: room.name,
      date,
      timeSlot,
      guests,
      sommelier: selectedSommelier,
      pairedTea: selectedTea,
      finalPrice: discountedPrice,
      bookingCode: passId,
    };

    setLastBookingData(payload);
    onConfirmBooking(payload);

    setIsSuccess(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#E4DEC9] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#29322D] flex items-center justify-center transition-colors"
          aria-label="关闭预约"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#EBF3ED] text-[#2F6740] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-oriental-serif text-xl font-bold text-[#1E2320]">
                茶席预约成功
              </h3>
              <p className="text-xs text-[#6F695E] mt-1 font-light">
                已为您留存席位与名茶，请于约定吉时莅临。
              </p>
            </div>

            {/* Traditional Boarding Pass Card */}
            <div className="bg-[#F2EEE4] rounded-2xl p-5 border border-[#DDD5C0] text-left space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#DDD5C0] pb-2">
                <span className="font-oriental-serif text-xs font-bold text-[#232B26]">
                  {room.name}
                </span>
                <span className="font-mono text-xs font-semibold text-[#8F733E]">
                  席号: {createdPass}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#868074] block">日期时段</span>
                  <span className="font-medium text-[#202723]">
                    {date} · {timeSlot.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#868074] block">入席人数</span>
                  <span className="font-medium text-[#202723]">{guests} 位贵宾</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#868074] block">执壶侍茶</span>
                  <span className="font-medium text-[#8F733E]">主理人亲泡</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#868074] block">开席选茶</span>
                  <span className="font-medium text-[#202723]">{selectedTea}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/70 border border-[#DDD5C0] text-[11px] text-[#635A4B] space-y-0.5">
                <span className="font-oriental-serif font-bold text-[#8F733E] block">
                  ✦ 炭火慢烹 · 全舍独席礼遇
                </span>
                <p>
                  主理人将于入席前红泥炉生炭候汤，以天然橄榄炭慢烧活泉，静候雅步。
                </p>
              </div>

              <div className="pt-2 border-t border-[#DDD5C0] flex items-center justify-between text-xs text-[#7B7569]">
                <span>实付金额：¥{discountedPrice}</span>
                <div className="flex items-center gap-1 font-mono text-[11px] text-[#232B26]">
                  <QrCode className="w-4 h-4" />
                  <span>到店扫码入席</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {onOpenPosterModal && (
                <button
                  type="button"
                  onClick={() => {
                    if (lastBookingData) {
                      onOpenPosterModal(lastBookingData);
                    }
                    onClose();
                  }}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#8F733E] via-[#A48548] to-[#8F733E] hover:opacity-95 text-white font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFF0D0]" />
                  <span>生成精美微信邀约海报 (AI 诗画合璧)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (lastBookingData && onOpenInvitation) {
                    onOpenInvitation(lastBookingData);
                  }
                  onClose();
                }}
                className="w-full h-11 rounded-xl bg-[#1E2320] text-[#E7D2A7] font-oriental-serif text-xs font-bold tracking-wider hover:bg-black flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E7D2A7]" />
                <span>查看茶席邀请函 · 保存至手机日历</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-10 rounded-xl bg-transparent border border-[#DDD3C2] text-[#5A5346] font-oriental-serif text-xs font-medium tracking-widest hover:bg-[#EFEAE2]"
              >
                完成并查看日程
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 space-y-4">
            {/* Header info */}
            <div>
              <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block">
                TEA SALON RESERVATION
              </span>
              <h3 className="font-oriental-serif text-lg font-bold text-[#202723] tracking-wide">
                预约 {room.name}
              </h3>
              <p className="text-xs text-[#7A7469] mt-0.5 font-light">
                {room.theme} · 容纳 {room.capacity}
              </p>
            </div>

            {errorMsg && (
              <div className="text-xs text-[#B23A2B] bg-[#FDF0EE] p-2.5 rounded-xl border border-[#F5D3CD]">
                {errorMsg}
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                预约日期
              </label>
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[#DBD4C5]">
                <CalIcon className="w-4 h-4 text-[#8F733E]" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full text-xs text-[#2A322D] focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Oriental Scroll Time-Picker (东方美学卷轴滚动时间选择器) */}
            <OrientalScrollTimePicker
              options={TIME_SLOT_CAROUSEL_OPTIONS}
              selectedSlotKey={
                TIME_SLOT_CAROUSEL_OPTIONS.find(isSlotOptionActive)?.key ||
                TIME_SLOT_CAROUSEL_OPTIONS[1].key
              }
              onSelectSlot={(opt) => {
                const newSlot = isCharcoalPrep ? opt.charcoalSlot : opt.standardSlot;
                setTimeSlot(newSlot);
                setErrorMsg("");
              }}
              isCharcoalPrep={isCharcoalPrep}
              onToggleCharcoalPrep={handleToggleCharcoalPrep}
              roomBasePrice={room.basePrice}
            />

            {/* Service & Salon Protocol Details (服务时长、专车与取消规则) */}
            <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8DFC9] space-y-1.5 text-[11px] text-[#554D3F]">
              <div className="flex items-center justify-between">
                <span className="font-oriental-serif font-bold text-[#232B26]">
                  {room.name} · 入席规制
                </span>
                <span className="font-mono text-[10px] text-[#8F733E] bg-white px-2 py-0.5 rounded border border-[#E2D5BA]">
                  {room.noticeAdvance || "提前 1 天预约"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                <div>• 时长：{room.duration || "2-3小时"}</div>
                <div>• 人数：{room.capacity}</div>
                <div>• 地点：深圳·北站附近（私人茶室不对外）</div>
                <div>• 用器：全程逐泡换器 · 榄炭候汤</div>
              </div>
              {room.basePrice === 2680 && (
                <div className="text-[10px] text-[#8F733E] font-medium bg-[#FAF4E6] p-1.5 rounded-lg border border-[#EADBBD]">
                  ✦ 顶级茶席礼遇：时间由您定，可安排专车接送，主理人自用 5w 起步手拉壶与万元杯盏。
                </div>
              )}
              <div className="pt-1 border-t border-[#EFE8D8] text-[10px] text-[#8C8372]">
                统一取消规则：开席前 24 小时取消，全额退还；24 小时内取消，可改期一次。
              </div>
            </div>

            {/* Tea Selection (Closed Loop with Tea Profile Dossier & Terroir Explorer) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-oriental-serif text-[#333C36] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#2F6740]" />
                  <span>随席预点佳茗</span>
                </label>
                {preselectedTea && selectedTea === preselectedTea && (
                  <span className="text-[10px] font-oriental-serif text-[#8F733E] bg-[#FAF5E8] px-2 py-0.5 rounded-md border border-[#E5D6B8]">
                    ✦ 已自动锁定您预选的试饮茗茶
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableTeas.map((teaName) => {
                  const isChosen = selectedTea === teaName;
                  const isPreselected = preselectedTea === teaName;
                  return (
                    <button
                      type="button"
                      key={teaName}
                      onClick={() => setSelectedTea(teaName)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-oriental-serif border transition-all text-left flex items-center justify-between gap-1 ${
                        isChosen
                          ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26] font-bold shadow-2xs'
                          : 'bg-white text-[#4A443A] border-[#DED7C7] hover:border-[#232B26]'
                      }`}
                    >
                      <span className="truncate">{teaName}</span>
                      {isPreselected && (
                        <span
                          className={`text-[9px] shrink-0 px-1 rounded ${
                            isChosen ? 'bg-[#8F733E] text-white' : 'bg-[#FAF5E8] text-[#8F733E]'
                          }`}
                        >
                          预选
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                入席人数 (上限 {room.maxGuests} 人)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#DCD5C4] rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-9 flex items-center justify-center hover:bg-[#F3EFE7] text-sm"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-mono font-medium">
                    {guests} 人
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(room.maxGuests, guests + 1))}
                    className="w-8 h-9 flex items-center justify-center hover:bg-[#F3EFE7] text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#868074]">
                  配备相应套数宋代天青品茗杯与茶席手巾
                </span>
              </div>
            </div>

            {/* Host & Charcoal Water Commitment */}
            <div className="bg-[#FAF5E8] p-3 rounded-2xl border border-[#E4D7BD] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-oriental-serif font-bold text-[#232B26]">
                  <Sparkles className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>主理人亲泡 · 榄炭活泉</span>
                </div>
                <span className="text-[10px] text-[#8F733E] font-oriental-serif font-medium bg-white px-2 py-0.2 rounded-full border border-[#DFCEAD]">
                  全舍独席
                </span>
              </div>
              <p className="text-[11px] text-[#5C5344] leading-relaxed">
                案前红泥炉生天然榄炭，慢候甘泉，主理人一人执壶，细品茶真。
              </p>
            </div>

            {/* Pricing and Submit */}
            <div className="pt-3 border-t border-[#ECE7DD] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#7A7468] block">
                  席费 ({tierConfig.name}享 {Math.round((1 - tierConfig.discountRate) * 10)}折)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-xl font-bold text-[#1E2320]">
                    ¥{discountedPrice}
                  </span>
                  {discountedPrice < room.basePrice && (
                    <span className="text-xs line-through text-[#9A9488] font-mono">
                      ¥{room.basePrice}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 h-11 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
              >
                <Users className="w-3.5 h-3.5" />
                <span>确认预留茶席</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
