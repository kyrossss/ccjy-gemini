import React, { useState } from 'react';
import { X, Trash2, Coins, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { CartItem, MemberTierLevel, calculateCartSummary, TIER_CONFIGS } from '../utils/teaLogic';
import { zenAudio } from '../utils/audioZen';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: (CartItem & { image?: string })[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  userTier: MemberTierLevel;
  availableTokens: number;
  onCheckoutSuccess: (orderInfo: {
    total: number;
    pointsEarned: number;
    tokensUsed: number;
    tokensEarned: number;
    itemCount: number;
    orderedItems: (CartItem & { image?: string })[];
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  userTier,
  availableTokens,
  onCheckoutSuccess,
}) => {
  const [tokensToUse, setTokensToUse] = useState(0);
  const [address, setAddress] = useState('深圳市南山区华侨城创意文化园 春城嘉叶茶舍 7号席');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const summary = calculateCartSummary(cartItems, userTier, tokensToUse, availableTokens);
  const tierConfig = TIER_CONFIGS[userTier];

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    zenAudio.playZenChime();
    setIsOrdered(true);
    onCheckoutSuccess({
      total: summary.finalTotal,
      pointsEarned: summary.earnedPoints,
      tokensUsed: summary.tokensUsed,
      tokensEarned: summary.earnedTokens,
      itemCount: cartItems.reduce((acc, i) => acc + i.quantity, 0),
      orderedItems: [...cartItems],
    });
    setTimeout(() => {
      setIsOrdered(false);
      onClearCart();
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[#E5DFCE] relative animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#ECE7DD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-oriental-serif font-bold text-base text-[#1E2320]">
              茶囊选物
            </span>
            <span className="text-xs text-[#8E887E] font-mono">
              ({cartItems.length} 款)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#5A544A]"
            aria-label="关闭购物车"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isOrdered ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#EBF3ED] text-[#2F6740] flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-oriental-serif text-xl font-bold text-[#1E2320]">
              结席完成 · 敬呈雅物
            </h3>
            <p className="text-xs text-[#6F695E] leading-relaxed max-w-xs">
              我们将以传统棉麻与手工木匣精心妥帖包扎，附带防伪追溯证书顺丰专呈。
            </p>
            <div className="p-3 bg-[#F2EFE8] rounded-xl text-xs text-[#8F733E] font-mono mt-2">
              获得叶值积分 +{summary.earnedPoints} · 赠茗元 +{summary.earnedTokens}
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8C867B] space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#EFECE3] flex items-center justify-center font-oriental-serif text-lg text-[#A09A8D]">
              空
            </div>
            <p className="text-xs font-light tracking-wide">
              茶囊尚空，寻觅心仪茶席之物
            </p>
            <button
              onClick={onClose}
              className="text-xs text-[#242A27] font-medium underline underline-offset-4"
            >
              浏览器物与茗茶
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DC] shadow-xs"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-[#171A19] shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-[#202623] truncate">
                      {item.name}
                    </h4>
                    <span className="font-mono text-sm font-semibold text-[#1E2320] block mt-1">
                      ¥{item.price.toLocaleString()}
                    </span>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#DCD5C4] rounded-lg overflow-hidden bg-[#FAF8F5]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#EBE6DC] text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#EBE6DC] text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#969083] hover:text-[#B23A2B] p-1 transition-colors"
                        title="移出"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Address */}
              <div className="bg-[#F4F1E9] p-3.5 rounded-2xl border border-[#E3DDD0] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#524B40] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>品鉴奉茶地址</span>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs bg-white rounded-lg px-2.5 py-1.5 border border-[#DBD4C5] text-[#29322D] focus:outline-none focus:border-[#242A27]"
                />
              </div>

              {/* CHÁ Token Offset Selector */}
              {availableTokens > 0 && summary.maxTokenDeduction > 0 && (
                <div className="bg-[#FAF6EC] p-3.5 rounded-2xl border border-[#E8DFCA] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#735A2A] font-medium">
                      <Coins className="w-3.5 h-3.5 text-[#BFA15F]" />
                      <span>使用茗元代币抵扣 (1茗元 = 1元)</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#8C7649]">
                      可用: {availableTokens} 茗元
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={Math.min(availableTokens, summary.maxTokenDeduction)}
                      value={tokensToUse}
                      onChange={(e) => setTokensToUse(Number(e.target.value))}
                      className="flex-1 accent-[#8F733E]"
                    />
                    <span className="font-mono text-xs font-semibold text-[#8F733E] w-12 text-right">
                      -{tokensToUse}元
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A6977B]">
                    根据规则，代币最高可抵扣折后总额的20% (上限 ¥{summary.maxTokenDeduction})
                  </p>
                </div>
              )}
            </div>

            {/* Price Calculations & Bottom Sticky CTA */}
            <div className="p-5 border-t border-[#ECE7DD] bg-[#FAF8F5] space-y-2 text-xs">
              <div className="flex justify-between text-[#7E786E]">
                <span>商品总计</span>
                <span className="font-mono">¥{summary.rawSubtotal.toLocaleString()}</span>
              </div>

              {summary.memberDiscount > 0 && (
                <div className="flex justify-between text-[#8F733E]">
                  <span>{tierConfig.name}身份礼遇 ({Math.round(tierConfig.discountRate * 100)}% 折扣)</span>
                  <span className="font-mono">-¥{summary.memberDiscount.toLocaleString()}</span>
                </div>
              )}

              {summary.tokenDeductionAmount > 0 && (
                <div className="flex justify-between text-[#786134]">
                  <span>茗元代币抵扣</span>
                  <span className="font-mono">-¥{summary.tokenDeductionAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#ECE7DD] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#524B40] block">结席实付</span>
                  <span className="font-mono text-xl font-bold text-[#1F2522]">
                    ¥{summary.finalTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="px-6 h-11 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-widest flex items-center gap-2 transition-all active:scale-[0.98] shadow-sm"
                >
                  <span>立即结席出仓</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
