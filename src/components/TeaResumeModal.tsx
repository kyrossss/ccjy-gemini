import React, { useState } from 'react';
import {
  X,
  Package,
  Calendar,
  Coins,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Truck,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  User,
} from 'lucide-react';
import { UserOrderRecord } from '../utils/orderResumeLogic';
import { ConsignmentItem } from '../data/mockData';
import { BookingInvitationData } from './TeaInvitationModal';
import { zenAudio } from '../utils/audioZen';

export type ResumeTabType = 'orders' | 'bookings' | 'consignments';

interface TeaResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ResumeTabType;
  orders: UserOrderRecord[];
  bookings: BookingInvitationData[];
  consignments: ConsignmentItem[];
  onOpenInvitation: (booking: BookingInvitationData) => void;
  onOpenConsignmentDetail: (item: ConsignmentItem) => void;
  onOpenNewConsignment: () => void;
  onGoToRooms: () => void;
  onGoToShop: () => void;
}

export const TeaResumeModal: React.FC<TeaResumeModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'orders',
  orders,
  bookings,
  consignments,
  onOpenInvitation,
  onOpenConsignmentDetail,
  onOpenNewConsignment,
  onGoToRooms,
  onGoToShop,
}) => {
  const [activeTab, setActiveTab] = useState<ResumeTabType>(initialTab);

  // Sync tab if initialTab changes when opened
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E4DEC9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#ECE7DD] bg-[#F4EFEA]/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#8F733E] uppercase font-bold">
              SPRING CHENG JIA YE · TEA RESUME
            </span>
            <h2 className="font-oriental-serif text-lg font-bold text-[#1E2320]">
              我的茶事履历档案
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#DCD3C4] flex items-center justify-center text-[#5E574B] hover:text-[#1E2320] transition-colors"
            aria-label="关闭茶事履历"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#ECE7DD] bg-[#FAF8F5] px-4 pt-2">
          {[
            { key: 'orders', label: '商品订单', count: orders.length, icon: Package },
            { key: 'bookings', label: '茶室日程', count: bookings.length, icon: Calendar },
            { key: 'consignments', label: '流转名物', count: consignments.length, icon: Coins },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  zenAudio.playZenChime();
                  setActiveTab(tab.key as ResumeTabType);
                }}
                className={`flex-1 py-3 text-xs font-oriental-serif flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  isActive
                    ? 'border-[#232B26] text-[#1E2320] font-bold'
                    : 'border-transparent text-[#8C867B] hover:text-[#232B26]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#232B26] text-white' : 'bg-[#EAE4D8] text-[#696256]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3.5">
              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-10 h-10 text-[#C2BBAE] mx-auto stroke-[1.2]" />
                  <p className="font-oriental-serif text-sm text-[#706A5F]">
                    尚无入囊茶品器物订单
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onGoToShop();
                    }}
                    className="px-5 py-2 rounded-xl bg-[#232B26] text-white text-xs font-oriental-serif"
                  >
                    前往品物选茶
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-4 border border-[#ECE6DB] shadow-xs space-y-3"
                  >
                    {/* Order Meta Header */}
                    <div className="flex items-center justify-between text-xs border-b border-[#F4EFE6] pb-2.5">
                      <div>
                        <span className="font-mono text-[10px] text-[#8C8578] block">
                          {order.createdAt}
                        </span>
                        <span className="font-mono font-medium text-[#232B26]">
                          {order.id}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-oriental-serif px-2.5 py-1 rounded-full ${
                          order.status === 'shipping'
                            ? 'bg-[#EBF3ED] text-[#2F6740] font-medium'
                            : 'bg-[#F2ECE1] text-[#7A7264]'
                        }`}
                      >
                        {order.statusText}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {it.image ? (
                            <img
                              src={it.image}
                              alt={it.name}
                              className="w-12 h-12 rounded-xl object-cover bg-[#EFEAE2] shrink-0 border border-[#E5DEC7]"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#F0EDE5] flex items-center justify-center shrink-0 text-[#8C8578]">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-oriental-serif text-xs font-bold text-[#1E2320] truncate">
                              {it.name}
                            </h4>
                            <div className="flex items-center justify-between text-[11px] text-[#7E776C] mt-0.5">
                              <span>数量：x{it.quantity}</span>
                              <span className="font-mono text-[#232B26]">
                                ¥{it.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Logistics and Anti-Counterfeit Bar */}
                    <div className="bg-[#FAF8F4] p-2.5 rounded-xl border border-[#EBE5D8] text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[#615B50]">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#2F6740]" />
                          <span>{order.shippingCompany}</span>
                        </div>
                        <span className="font-mono text-[#232B26] font-medium">
                          {order.trackingNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#8A8478] pt-1 border-t border-[#EFE9DF]">
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#8F733E]" />
                          <span>正品防伪溯源码</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#8F733E]">
                          {order.antiCounterfeitCode}
                        </span>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2 text-[10px] text-[#8F733E]">
                        <Sparkles className="w-3 h-3" />
                        <span>已累积 +{order.pointsEarned} 叶值</span>
                        {order.tokensEarned > 0 && (
                          <span>· 获赠 +{order.tokensEarned} 茗元</span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] text-[#7E776C]">实付：</span>
                        <span className="font-mono font-bold text-sm text-[#1E2320]">
                          ¥{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-3.5">
              {bookings.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Calendar className="w-10 h-10 text-[#C2BBAE] mx-auto stroke-[1.2]" />
                  <p className="font-oriental-serif text-sm text-[#706A5F]">
                    当前暂无生效中的茶室预约日程
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onGoToRooms();
                    }}
                    className="px-5 py-2 rounded-xl bg-[#232B26] text-white text-xs font-oriental-serif"
                  >
                    前往预约私享茶席
                  </button>
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-4 border border-[#ECE6DB] shadow-xs space-y-3 relative overflow-hidden"
                  >
                    {/* Watermark Seal */}
                    <div className="absolute top-3 right-3 w-14 h-14 rounded-full border border-[#B23A2B]/20 flex items-center justify-center text-[#B23A2B]/30 font-oriental-serif text-[10px] -rotate-12 pointer-events-none">
                      已留席
                    </div>

                    {/* Room and Date Info */}
                    <div className="border-b border-[#F4EFE6] pb-2.5">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#8F733E]">
                        <span>席位预约凭证</span>
                        <span>·</span>
                        <span>{b.id}</span>
                      </div>
                      <h4 className="font-oriental-serif text-sm font-bold text-[#1E2320] mt-0.5">
                        {b.roomName}
                      </h4>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-[#5E574B]">
                        <Calendar className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                        <span className="font-mono">{b.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5E574B]">
                        <Clock className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                        <span className="truncate">{b.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5E574B]">
                        <User className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                        <span>侍茶师：{b.sommelier}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5E574B]">
                        <MapPin className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                        <span>配茶：{b.pairedTea}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-between border-t border-[#F4EFE6]">
                      <span className="text-xs text-[#7B7569]">
                        已付订金：
                        <strong className="font-mono font-bold text-[#1E2320]">
                          ¥{b.finalPrice.toLocaleString()}
                        </strong>
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenInvitation(b);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white text-xs font-oriental-serif flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <span>查看茶席邀请函</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {bookings.length > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onGoToRooms();
                  }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-[#DDD5C5] text-xs font-oriental-serif text-[#6C665A] hover:border-[#232B26] hover:text-[#232B26] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>预订更多茶席</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* TAB 3: CONSIGNMENTS */}
          {activeTab === 'consignments' && (
            <div className="space-y-3.5">
              {consignments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-[#ECE6DB] shadow-xs space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-[#EFEAE2] shrink-0 border border-[#E5DEC7]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#8F733E] bg-[#FAF5E8] px-2 py-0.5 rounded-md">
                          {item.certificateNo}
                        </span>
                        <span className="text-[10px] text-[#2F6740] bg-[#EBF3ED] px-2 py-0.5 rounded-full font-medium">
                          {item.status === 'active' ? '流转展示中' : '已达成交'}
                        </span>
                      </div>
                      <h4 className="font-oriental-serif text-xs font-bold text-[#1E2320] mt-1 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#7A7468] truncate mt-0.5">
                        {item.condition}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F4] p-2.5 rounded-xl border border-[#EBE5D8] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#868074] block">
                        当前流转估值
                      </span>
                      <span className="font-mono font-bold text-sm text-[#1E2320]">
                        ¥{item.currentPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-[#696356]">
                      <span>{item.views} 人品鉴</span>
                      <span className="mx-1.5">·</span>
                      <span>{item.bidsCount} 次意向出价</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[11px] text-[#868074]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2F6740]" />
                      <span>春城嘉叶专业母仓保管</span>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenConsignmentDetail(item);
                      }}
                      className="text-xs font-oriental-serif text-[#232B26] hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>鉴藏证书</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  onClose();
                  onOpenNewConsignment();
                }}
                className="w-full py-3 rounded-2xl bg-[#232B26] hover:bg-[#181E1A] text-white text-xs font-oriental-serif flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Coins className="w-3.5 h-3.5 text-[#D8C496]" />
                <span>发起新茶物寄售鉴定</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
