import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Droplets,
  Clock,
  Flame,
  Award,
  ShieldCheck,
  Check,
  Calendar,
} from 'lucide-react';
import { TeaItem } from '../data/mockData';
import { MemberTierLevel, calculateDiscountedPrice } from '../utils/teaLogic';
import { zenAudio } from '../utils/audioZen';
import { JiayeCoinIcon } from './JiayeCoinIcon';

interface ProductDetailModalProps {
  item: TeaItem | null;
  onClose: () => void;
  onAddToCart: (item: TeaItem, quantity: number) => void;
  onReserveTeaInSalon?: (teaName: string) => void;
  userTier: MemberTierLevel;
}

const FALLBACK_DETAIL_IMG = '/assets/aistudio/IMG_6489_3dbe7626.JPG';

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
  onReserveTeaInSalon,
  userTier,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!item) return null;

  const discountedPrice = calculateDiscountedPrice(item.price, userTier);
  const hasDiscount = discountedPrice < item.price;
  const isTastableTea = item.category === 'tea' || item.category === 'yao';

  const handleAdd = () => {
    onAddToCart(item, quantity);
    zenAudio.playZenChime();
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#E4DEC9] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          aria-label="关闭详情"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Visual Asset */}
        <div className="relative aspect-4/3 w-full bg-[#181C1A] overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_DETAIL_IMG;
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141716]/90 via-transparent to-black/30 pointer-events-none" />

          {/* Subcategory & Origin Stamp */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 text-xs tracking-widest text-[#E8D4A8] font-mono mb-1">
              <span>{item.subCategory}</span>
              <span>·</span>
              <span>{item.origin}</span>
            </div>
            <h2 className="font-oriental-serif text-xl sm:text-2xl font-bold tracking-wide">
              {item.name}
            </h2>
            <p className="font-display-serif text-xs text-[#CDC6B6] italic tracking-wider mt-0.5">
              {item.enName}
            </p>
          </div>
        </div>

        {/* Content Body with Eastern Negative Space */}
        <div className="p-6 space-y-6">
          {/* Price & Member Privilege */}
          <div className="flex items-baseline justify-between border-b border-[#ECE7DC] pb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-[#1F2522]">
                  ¥{discountedPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-[#9B9589] line-through font-mono">
                    ¥{item.price.toLocaleString()}
                  </span>
                )}
                {item.originalPrice && !hasDiscount && (
                  <span className="text-xs text-[#9B9589] line-through font-mono">
                    ¥{item.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#8F733E]">
                <JiayeCoinIcon size={13} variant="gold" />
                <span>春城嘉叶储值礼遇 · 支持嘉叶币 100% 全额直接购买</span>
              </div>
            </div>

            {/* In Stock Status */}
            <div className="flex items-center gap-1 text-xs text-[#3E6148] font-medium bg-[#E8EFE9] px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>正品现存</span>
            </div>
          </div>

          {/* Tagline & Story */}
          <div>
            <h3 className="text-xs font-mono tracking-widest text-[#8E877B] uppercase mb-1.5">
              PHILOSOPHY / 席物物语
            </h3>
            <p className="font-oriental-serif text-sm font-semibold text-[#303833] tracking-wide mb-2">
              「{item.tagline}」
            </p>
            <p className="text-xs leading-relaxed text-[#565046] font-light">
              {item.description}
            </p>
          </div>

          {/* Artisan Profile (If Teapot) */}
          {item.artisan && (
            <div className="bg-[#F2EFE8] rounded-2xl p-4 border border-[#E3DDD0] space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#8F733E]" />
                <span className="font-oriental-serif text-xs font-bold text-[#232B26]">
                  名家造物 · {item.artisan.name}
                </span>
                <span className="text-[10px] text-[#7E776C] font-light">
                  {item.artisan.title}
                </span>
              </div>
              <p className="text-xs text-[#5E574D] leading-relaxed font-light">
                {item.artisan.bio}
              </p>
            </div>
          )}

          {/* Brewing Guide / Parameters */}
          {item.brewingGuide && (
            <div>
              <h3 className="text-xs font-mono tracking-widest text-[#8E877B] uppercase mb-3">
                BREWING GUIDE / 冲泡度量衡
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#F5F2EB] p-2.5 rounded-xl border border-[#E8E3D5] flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#B23A2B]" />
                  <div>
                    <span className="text-[10px] text-[#938C7F] block">建议水温</span>
                    <span className="font-medium text-[#29322D]">{item.brewingGuide.temp}</span>
                  </div>
                </div>
                <div className="bg-[#F5F2EB] p-2.5 rounded-xl border border-[#E8E3D5] flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-[#376B8E]" />
                  <div>
                    <span className="text-[10px] text-[#938C7F] block">茶水比例</span>
                    <span className="font-medium text-[#29322D]">{item.brewingGuide.ratio}</span>
                  </div>
                </div>
                <div className="bg-[#F5F2EB] p-2.5 rounded-xl border border-[#E8E3D5] flex items-center gap-2 col-span-2">
                  <Clock className="w-3.5 h-3.5 text-[#8F733E]" />
                  <div>
                    <span className="text-[10px] text-[#938C7F] block">注水出汤节奏</span>
                    <span className="font-medium text-[#29322D]">
                      {item.brewingGuide.duration} · 可续冲 {item.brewingGuide.pours} 泡
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specifications Table */}
          <div>
            <h3 className="text-xs font-mono tracking-widest text-[#8E877B] uppercase mb-2">
              SPECIFICATIONS / 规制指标
            </h3>
            <div className="divide-y divide-[#EBE6DC] border-t border-b border-[#EBE6DC] text-xs">
              {item.specs.map((spec, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <span className="text-[#898377]">{spec.label}</span>
                  <span className="text-[#232B26] font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-[#FAF8F5]/95 backdrop-blur-md p-4 border-t border-[#ECE7DD] flex items-center gap-2.5">
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#DCD5C4] rounded-xl overflow-hidden bg-white shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-10 flex items-center justify-center hover:bg-[#F3EFE7] text-sm text-[#4E483F]"
            >
              -
            </button>
            <span className="w-7 text-center text-xs font-mono font-medium text-[#1E2320]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-10 flex items-center justify-center hover:bg-[#F3EFE7] text-sm text-[#4E483F]"
            >
              +
            </button>
          </div>

          {/* Direct Salon Tasting Reservation CTA (For Tea & YÁO items) */}
          {isTastableTea && onReserveTeaInSalon && (
            <button
              type="button"
              onClick={() => {
                zenAudio.playZenChime();
                const teaTitle = item.name.split('（')[0];
                onClose();
                onReserveTeaInSalon(teaTitle);
              }}
              className="px-3 h-10 rounded-xl bg-[#FAF5E8] hover:bg-[#F2E6CC] text-[#8F733E] border border-[#E3D3B2] font-oriental-serif text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-[0.98]"
              title="预约私享茶室试饮此茶"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>茶席试饮</span>
            </button>
          )}

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={addedNotice}
            className="flex-1 h-10 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-[#FAF8F5] font-oriental-serif text-xs font-medium tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm disabled:bg-[#3C5A44]"
          >
            {addedNotice ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>已纳入手囊</span>
              </>
            ) : (
              <span>纳入手囊 · ¥{(discountedPrice * quantity).toLocaleString()}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
