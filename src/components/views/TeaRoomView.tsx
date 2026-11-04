import React from 'react';
import { Calendar, Users, Sparkles, Check, ArrowRight } from 'lucide-react';
import { TEA_ROOMS, TeaRoom, SOMMELIERS } from '../../data/mockData';
import { MemberTierLevel, calculateDiscountedPrice, TIER_CONFIGS } from '../../utils/teaLogic';
import { TeaRoomCalendar } from '../TeaRoomCalendar';

interface TeaRoomViewProps {
  onSelectRoom: (room: TeaRoom) => void;
  userTier: MemberTierLevel;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onOpenInvitation?: (booking: any) => void;
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

export const TeaRoomView: React.FC<TeaRoomViewProps> = ({
  onSelectRoom,
  userTier,
  selectedDate,
  onSelectDate,
  onOpenInvitation,
  activeBookings,
}) => {
  const tierConfig = TIER_CONFIGS[userTier];

  return (
    <div className="space-y-6 px-5 pb-12">
      {/* Editorial Header */}
      <div className="pt-3">
        <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block">
          PRIVATE TEA SANCTUARY & SALON
        </span>
        <h1 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1F2522] tracking-wider mt-0.5">
          私享茶室 · 幽玄雅集
        </h1>
        <p className="text-xs text-[#7B7569] font-light mt-1">
          移步换景，枯山水与竹影相映。每一间茶室皆配有专属侍茶师与高山甘泉，为您安顿浮生浮躁。
        </p>
      </div>

      {/* Visual Tea Reservation Calendar (Added per user request) */}
      <section aria-label="茶室预约月历">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#8F733E]" />
            <h2 className="font-oriental-serif text-xs font-bold text-[#232B26] tracking-wider">
              择吉入席 · 雅席预约月历
            </h2>
          </div>
          <span className="text-[10px] text-[#868074] font-mono">
            点击日期即可选定吉时
          </span>
        </div>

        <TeaRoomCalendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onQuickBookRoom={() => onSelectRoom(TEA_ROOMS[0])}
        />
      </section>

      {/* Active User Bookings (If Any) */}
      {activeBookings.length > 0 && (
        <div className="bg-[#EBF3ED] p-4 rounded-3xl border border-[#CCE2D2] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#2A653B] font-medium">
            <span className="font-oriental-serif font-bold">我的近期已预约茶席</span>
            <span className="font-mono text-[11px]">{activeBookings.length} 个席位已锁定</span>
          </div>
          {activeBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-3 rounded-2xl border border-[#D5E6D9] text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-oriental-serif font-bold text-[#232B26] block">
                  {b.roomName}
                </span>
                <span className="text-[11px] text-[#6E685C]">
                  {b.date} · {b.timeSlot.split(' ')[0]} · {b.guests}人 · 侍茶师: {b.sommelier}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onOpenInvitation && (
                  <button
                    onClick={() => onOpenInvitation(b)}
                    className="text-[11px] font-oriental-serif text-[#8F733E] hover:underline px-2 py-1 rounded-md bg-[#FAF7F0] border border-[#E8DFC8]"
                  >
                    查看邀请函
                  </button>
                )}
                <span className="text-[10px] font-mono bg-[#EBF3ED] text-[#2F6740] px-2 py-1 rounded-md">
                  席位有效
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tea Chambers List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-oriental-serif text-sm font-bold text-[#232B26] tracking-wide">
            甄选茶室席位
          </h2>
          <span className="text-[11px] text-[#8F733E]">
            {selectedDate ? `已锁定预约日：${selectedDate}` : '请先选定入席吉日'}
          </span>
        </div>

        {TEA_ROOMS.map((room) => {
          const discounted = calculateDiscountedPrice(room.basePrice, userTier);
          const hasDiscount = discounted < room.basePrice;

          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#ECE6DB] shadow-xs flex flex-col group hover:border-[#232B26] transition-all"
            >
              {/* Room Photography */}
              <div className="relative aspect-16/9 w-full bg-[#181F1B] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] tracking-widest text-[#E6D4AA] font-mono block">
                    {room.theme}
                  </span>
                  <h3 className="font-oriental-serif text-lg font-bold tracking-wide">
                    {room.name}
                  </h3>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-4 space-y-4">
                <p className="text-xs text-[#5D574C] font-light leading-relaxed">
                  {room.description}
                </p>

                {/* Facilities */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#716A5E]">
                  {room.facilities.map((fac, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#2F6740] shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Teas */}
                <div className="pt-2 border-t border-[#F2EEE6] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#868074]">
                    <Users className="w-3.5 h-3.5" />
                    <span>入席规模：{room.capacity}</span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-base font-bold text-[#1E2320]">
                      ¥{discounted}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-[#9B9588] line-through font-mono">
                        ¥{room.basePrice}
                      </span>
                    )}
                    <span className="text-[10px] text-[#868074]">/ 场</span>
                  </div>
                </div>

                {/* Reserve CTA */}
                <button
                  onClick={() => onSelectRoom(room)}
                  className="w-full h-11 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>预约此席位 · {tierConfig.name}享特惠</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sommelier Showcase */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8F733E]" />
          <h2 className="font-oriental-serif text-sm font-bold text-[#232B26] tracking-wide">
            春城嘉叶驻席侍茶师团队
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {SOMMELIERS.map((som) => (
            <div
              key={som.id}
              className="bg-white p-3 rounded-2xl border border-[#ECE6DB] text-center space-y-1.5"
            >
              <div className="w-10 h-10 rounded-full bg-[#232B26] text-[#FAF8F5] flex items-center justify-center mx-auto font-oriental-serif font-bold text-sm">
                {som.avatar}
              </div>
              <h3 className="text-xs font-bold font-oriental-serif text-[#202723]">
                {som.name}
              </h3>
              <span className="text-[9px] text-[#8F733E] block">
                {som.title}
              </span>
              <p className="text-[8px] text-[#847E72] font-mono leading-tight">
                {som.experience}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
