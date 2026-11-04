import React, { useState } from 'react';
import { Search, Plus, Sparkles, Filter } from 'lucide-react';
import { PRODUCTS, TeaItem } from '../../data/mockData';
import { MemberTierLevel, calculateDiscountedPrice } from '../../utils/teaLogic';

interface ShopViewProps {
  onOpenProduct: (item: TeaItem) => void;
  onAddToCart: (item: TeaItem, quantity: number) => void;
  userTier: MemberTierLevel;
}

export const ShopView: React.FC<ShopViewProps> = ({
  onOpenProduct,
  onAddToCart,
  userTier,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tea' | 'teapot' | 'teaware' | 'yao'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const filteredItems = PRODUCTS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-5 px-5 pb-12">
      {/* Editorial Header */}
      <div className="pt-3">
        <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block">
          CHUN CHENG JIA YE · FOUR PRODUCT SYSTEMS
        </span>
        <h1 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1F2522] tracking-wider mt-0.5">
          器物与茗茶 · 一器一叶
        </h1>
        <p className="text-xs text-[#7B7569] font-light mt-1">
          山场原叶（凤凰单丛/武夷岩茶）、手作茗壶（吴瑞全/谢华）、赏瓷雅器与爻 YÁO 便携茶简。
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C867A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索凤凰单丛、武夷岩茶、吴瑞全手拉壶、白杯、爻·茶简..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#ECE6DB] text-xs text-[#262D29] placeholder:text-[#A09A8F] focus:outline-none focus:border-[#232B26] shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8C867A] hover:text-[#232B26]"
          >
            清除
          </button>
        )}
      </div>

      {/* Category Segmented Tabs (Compliant with Frontend Design: functional buttons, clean segmented styles) */}
      <div className="flex items-center gap-1 p-1 bg-[#F0EDE6] rounded-2xl border border-[#E3DDD1] overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: '全部' },
          { key: 'tea', label: '山场原叶' },
          { key: 'teapot', label: '手作茗壶' },
          { key: 'teaware', label: '赏瓷雅器' },
          { key: 'yao', label: '爻 YÁO' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key as 'all' | 'tea' | 'teapot' | 'teaware' | 'yao')}
            className={`flex-1 py-1.5 px-2 text-xs font-oriental-serif tracking-tight whitespace-nowrap rounded-xl transition-all ${
              activeCategory === tab.key
                ? 'bg-white text-[#232B26] font-bold shadow-xs'
                : 'text-[#6C665A] hover:text-[#232B26]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort / Filter Bar */}
      <div className="flex items-center justify-between text-xs text-[#868073]">
        <span className="font-mono text-[11px]">共计 {filteredItems.length} 件东方器物</span>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#868073]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc')}
            className="bg-transparent text-xs text-[#4F493E] font-oriental-serif focus:outline-none cursor-pointer"
          >
            <option value="default">默认推荐排序</option>
            <option value="price-asc">价格由低到高</option>
            <option value="price-desc">价格由高到低</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const discounted = calculateDiscountedPrice(item.price, userTier);
          const hasDiscount = discounted < item.price;
          return (
            <div
              key={item.id}
              onClick={() => onOpenProduct(item)}
              className="bg-white rounded-3xl p-3.5 border border-[#ECE6DB] shadow-xs cursor-pointer group hover:border-[#232B26] transition-all flex gap-3.5"
            >
              {/* Product Image */}
              <div className="relative w-28 sm:w-32 aspect-square rounded-2xl overflow-hidden bg-[#161B18] shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-[9px] text-[#EFEAE1] font-mono">
                  {item.subCategory}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                <div>
                  <div className="text-[10px] text-[#938C7F] font-mono tracking-wider flex items-center gap-1.5">
                    <span>{item.origin}</span>
                    {item.year && (
                      <>
                        <span>·</span>
                        <span>{item.year}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-oriental-serif text-sm font-bold text-[#232B26] tracking-wide mt-0.5 truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#797265] font-light line-clamp-2 mt-1 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F2EEE6] flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-base font-bold text-[#1E2320]">
                        ¥{discounted.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] text-[#A09A8F] line-through font-mono">
                          ¥{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <span className="text-[9px] text-[#8F733E] flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>会员专享价</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item, 1);
                    }}
                    className="w-8 h-8 rounded-full bg-[#232B26] hover:bg-[#181E1A] text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
                    aria-label={`将 ${item.name} 加入茶囊`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
