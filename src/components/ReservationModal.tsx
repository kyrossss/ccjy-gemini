import React, { useState } from 'react';
import { X, Calendar as CalIcon, Users, Clock, CheckCircle2, QrCode, Sparkles } from 'lucide-react';
import { TeaRoom, SOMMELIERS } from '../data/mockData';
import { MemberTierLevel, calculateDiscountedPrice, validateReservation, TIER_CONFIGS } from '../utils/teaLogic';
import { zenAudio } from '../utils/audioZen';
import { BookingInvitationData } from './TeaInvitationModal';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: TeaRoom | null;
  userTier: MemberTierLevel;
  initialDate?: string;
  onOpenInvitation?: (booking: BookingInvitationData) => void;
  onConfirmBooking: (booking: {
    id: string;
    roomName: string;
    date: string;
    timeSlot: string;
    guests: number;
    sommelier: string;
    pairedTea: string;
    finalPrice: number;
  }) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  room,
  userTier,
  initialDate,
  onOpenInvitation,
  onConfirmBooking,
}) => {
  // Tomorrow as fallback date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(initialDate || defaultDateStr);
  const [timeSlot, setTimeSlot] = useState('午席 (14:00 - 17:00 · 浮生半日)');

  React.useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate, isOpen]);
  const [guests, setGuests] = useState(2);
  const [selectedSommelier, setSelectedSommelier] = useState(SOMMELIERS[0].name);
  const [selectedTea, setSelectedTea] = useState(room?.recommendedTeas[0] || '老枞水仙');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPass, setCreatedPass] = useState<string | null>(null);
  const [lastBookingData, setLastBookingData] = useState<BookingInvitationData | null>(null);

  if (!isOpen || !room) return null;

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#E4DEC9] flex flex-col relative">
        {/* Close Button */}
        <button
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
                  <span className="font-medium text-[#202723]">{date} · {timeSlot.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#868074] block">入席人数</span>
                  <span className="font-medium text-[#202723]">{guests} 位贵宾</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#868074] block">专属侍茶师</span>
                  <span className="font-medium text-[#8F733E]">{selectedSommelier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#868074] block">开席选茶</span>
                  <span className="font-medium text-[#202723]">{selectedTea}</span>
                </div>
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
          <form onSubmit={handleBooking} className="p-6 space-y-5">
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

            {/* Time Slot */}
            <div>
              <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                茶席时段
              </label>
              <div className="space-y-1.5">
                {[
                  '晨席 (09:30 - 12:00 · 清和早茗)',
                  '午席 (14:00 - 17:00 · 浮生半日)',
                  '暮席 (18:30 - 21:30 · 幽玄夜席)',
                ].map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`w-full py-2 px-3 rounded-xl text-xs flex items-center justify-between border transition-all text-left ${
                      timeSlot === slot
                        ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26]'
                        : 'bg-white text-[#575044] border-[#DED7C7] hover:border-[#232B26]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 opacity-80" />
                      <span>{slot}</span>
                    </div>
                    {timeSlot === slot && <span className="text-[10px] text-[#D8C496]">已选</span>}
                  </button>
                ))}
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

            {/* Sommelier Selection */}
            <div>
              <label className="text-xs font-oriental-serif text-[#333C36] block mb-1">
                钦点专属侍茶师
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SOMMELIERS.map((som) => (
                  <button
                    type="button"
                    key={som.id}
                    onClick={() => setSelectedSommelier(som.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedSommelier === som.name
                        ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26]'
                        : 'bg-white text-[#4A443A] border-[#DED7C7] hover:border-[#232B26]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-oriental-serif">{som.name}</span>
                      <span className="text-[9px] opacity-75">{som.experience}</span>
                    </div>
                    <p className="text-[9px] line-clamp-2 leading-tight opacity-80">
                      {som.specialty}
                    </p>
                  </button>
                ))}
              </div>
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
                className="px-6 h-11 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-widest flex items-center gap-2 transition-all active:scale-[0.98] shadow-sm"
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
