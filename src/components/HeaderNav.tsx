import React from 'react';
import { ShoppingBag, Flame, Warehouse } from 'lucide-react';

interface HeaderNavProps {
  onOpenCart: () => void;
  cartCount: number;
  onOpenRitual: () => void;
  onToggleBackend?: () => void;
  isBackendActive?: boolean;
  lowStockAlertCount?: number;
  isValuationShortageAlert?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenCart,
  cartCount,
  onOpenRitual,
  onToggleBackend,
  isBackendActive = false,
  lowStockAlertCount = 0,
  isValuationShortageAlert = false,
}) => {
  return (
    <header className="px-5 py-3.5 flex items-center justify-between border-b border-[#ECE8DE] bg-[#FAF8F5]/90 backdrop-blur-xs sticky top-0 z-30">
      {/* Brand & Editorial Calligraphy Logo (Top-Left Transparent Brushwork) */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/________0147c3e4.png"
              alt="春城嘉叶书法题字 Logo"
              className="h-6 sm:h-7 w-auto object-contain select-none mix-blend-multiply"
            />
            <span className="hidden sm:inline-block font-display-serif text-[9px] tracking-widest text-[#8F733E] uppercase font-medium border-l border-[#DED7C8] pl-2">
              CHUN CHENG JIA YE
            </span>
          </div>
          <p className="text-[9px] text-[#8C867B] tracking-wider font-light mt-0.5 pl-0.5">
            一叶有来处 · 一器有分寸
          </p>
        </div>
      </div>

      {/* Action Affordances */}
      <div className="flex items-center gap-1.5">
        {/* Store Admin Backend Toggle Button with Valuation Shortage Alert */}
        {onToggleBackend && (
          <button
            type="button"
            onClick={onToggleBackend}
            className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-all border ${
              isBackendActive
                ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26] font-bold shadow-xs'
                : isValuationShortageAlert
                ? 'bg-[#FDF2F0] hover:bg-[#FBE8E5] text-[#A63429] border-[#E8A59C] font-bold shadow-xs ring-2 ring-[#A63429]/20 animate-pulse'
                : 'bg-[#F5F1E8] hover:bg-[#EAE3D3] text-[#4E473B] border-[#DFD5C0]'
            }`}
            title="掌柜中枢 · 仓储与低库存补货后台"
          >
            <Warehouse
              className={`w-3.5 h-3.5 ${
                isValuationShortageAlert ? 'text-[#A63429]' : 'text-[#8F733E]'
              }`}
            />
            <span className="text-[11px] font-oriental-serif tracking-tight whitespace-nowrap">
              {isBackendActive ? '返回茶舍' : isValuationShortageAlert ? '货值告警' : '掌柜后台'}
            </span>
            {lowStockAlertCount > 0 && !isBackendActive && (
              <span className="px-1.2 py-0.1 bg-[#A63429] text-white text-[9px] font-mono font-bold rounded-full leading-tight shrink-0">
                {lowStockAlertCount}
              </span>
            )}
          </button>
        )}

        {/* Daily Tea Ritual Button */}
        <button
          type="button"
          onClick={onOpenRitual}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#EFECE3] hover:bg-[#E5E1D5] text-[#3D3A34] text-xs transition-colors whitespace-nowrap shrink-0"
          title="朝夕点茶 · 每日静心"
        >
          <Flame className="w-3.5 h-3.5 text-[#B23A2B] shrink-0" />
          <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">朝夕点茶</span>
        </button>

        {/* Shopping Cart Button */}
        <button
          type="button"
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
