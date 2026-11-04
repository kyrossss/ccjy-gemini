import React from 'react';
import { ShoppingBag, Flame } from 'lucide-react';

interface HeaderNavProps {
  onOpenCart: () => void;
  cartCount: number;
  onOpenRitual: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenCart,
  cartCount,
  onOpenRitual,
}) => {
  return (
    <header className="px-5 py-3.5 flex items-center justify-between border-b border-[#ECE8DE] bg-[#FAF8F5]/90 backdrop-blur-xs sticky top-0 z-30">
      {/* Brand & Editorial Wordmark */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-sm bg-[#232B26] text-[#EFEAE1] flex items-center justify-center font-oriental-serif font-bold text-xs shadow-xs">
          嘉
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-oriental-serif text-base font-bold tracking-wider text-[#1E2320]">
              春城嘉叶
            </span>
            <span className="font-display-serif text-[10px] tracking-widest text-[#8F733E] uppercase font-medium">
              CHUN CHENG JIA YE
            </span>
          </div>
          <p className="text-[9px] text-[#8C867B] tracking-wider font-light">
            一叶有来处 · 一器有分寸
          </p>
        </div>
      </div>

      {/* Action Affordances */}
      <div className="flex items-center gap-2">
        {/* Daily Tea Ritual Button */}
        <button
          onClick={onOpenRitual}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#EFECE3] hover:bg-[#E5E1D5] text-[#3D3A34] text-xs transition-colors"
          title="朝夕点茶 · 每日静心"
        >
          <Flame className="w-3.5 h-3.5 text-[#B23A2B]" />
          <span className="text-[11px] font-medium tracking-tight">朝夕点茶</span>
        </button>

        {/* Shopping Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative p-2 rounded-full hover:bg-black/5 text-[#242A27] transition-colors"
          aria-label={`购物车中有 ${cartCount} 件物品`}
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#B23A2B] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-xs">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
