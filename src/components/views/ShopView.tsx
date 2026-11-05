import React, { useState, useEffect } from 'react';
import { Search, Plus, Sparkles, Filter, RotateCcw } from 'lucide-react';
import { PRODUCTS, TeaItem } from '../../data/mockData';
import { MemberTierLevel, calculateDiscountedPrice } from '../../utils/teaLogic';
import { filterShopCatalog } from '../../utils/terroirLogic';
import { OrientalEmptyState } from '../OrientalEmptyState';

export type ShopCategoryFilter = 'all' | 'tea' | 'teapot' | 'teaware' | 'yao';

interface ShopViewProps {
  onOpenProduct: (item: TeaItem) => void;
  onAddToCart: (item: TeaItem, quantity: number) => void;
  userTier: MemberTierLevel;
  initialCategory?: ShopCategoryFilter;
  initialSearchQuery?: string;
  onGoToHomeTerroir?: () => void;
}

const FALLBACK_PRODUCT_IMG = '/assets/aistudio/IMG_6489_3dbe7626.JPG';

export const ShopView: React.FC<ShopViewProps> = ({
  onOpenProduct,
  onAddToCart,
  userTier,
  initialCategory = 'all',
  initialSearchQuery = '',
  onGoToHomeTerroir,
}) => {
  const [activeCategory, setActiveCategory] = useState<ShopCategoryFilter>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const filteredItems = filterShopCatalog(PRODUCTS, {
    category: activeCategory,
    searchQuery,
    sortBy,
  });

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('default');
  };

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
          五大山场原叶（单丛/岩茶/狮峰龙井/老班章/白毫银针）、手作茗壶、赏瓷雅器与爻 YÁO 茶简。
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C867A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索凤凰单丛、武夷岩茶、狮峰龙井、老班章、白毫银针、吴瑞全..."
          className="w-full pl-10 pr-12 py-2.5 bg-white rounded-2xl border border-[#ECE6DB] text-xs text-[#262D29] placeholder:text-[#A09A8F] focus:outline-none focus:border-[#232B26] shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8C867A] hover:text-[#232B26]"
          >
            清除
          </button>
        )}
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F0EDE6] rounded-2xl border border-[#E3DDD1] overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: '全部' },
          { key: 'tea', label: '山场原叶' },
          { key: 'teapot', label: '手作茗壶' },
          { key: 'teaware', label: '赏瓷雅器' },
          { key: 'yao', label: '爻 YÁO' },
        ].map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActiveCategory(tab.key as ShopCategoryFilter)}
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

      {/* Active Terroir / Keyword Filter Indicator */}
      {(searchQuery || activeCategory !== 'all') && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF5E8] border border-[#E6D7B9] text-xs">
          <div className="flex items-center gap-1.5 text-[#5E5443] font-oriental-serif">
            <Sparkles className="w-3.5 h-3.5 text-[#8F733E]" />
            <span>
              当前筛选：
              {activeCategory !== 'all' && (
                <strong className="mx-1 text-[#232B26]">
                  {activeCategory === 'tea'
                    ? '山场原叶'
                    : activeCategory === 'teapot'
                    ? '手作茗壶'
                    : activeCategory === 'teaware'
                    ? '赏瓷雅器'
                    : '爻 YÁO'}
                </strong>
              )}
              {searchQuery && <strong className="text-[#8F733E]">「{searchQuery}」</strong>}
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] font-oriental-serif text-[#8F733E] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置全部</span>
          </button>
        </div>
      )}

      {/* Sort / Filter Bar */}
      <div className="flex items-center justify-between text-xs text-[#868073]">
        <span className="font-mono text-[11px]">共计 {filteredItems.length} 件东方器物与茗茶</span>
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

      {/* Product List or Unified Oriental Empty State */}
      {filteredItems.length === 0 ? (
        <OrientalEmptyState
          variant="shop"
          title={
            searchQuery
              ? `未寻得匹配「${searchQuery}」的茶器或原叶`
              : '该门类下暂无匹配馆藏'
          }
          onPrimaryAction={handleResetFilters}
          onSecondaryAction={onGoToHomeTerroir}
          onSmartRecommendationClick={(rec) => {
            if (rec.targetCategory) {
              setActiveCategory(rec.targetCategory);
              setSearchQuery(rec.searchKeyword ?? '');
            } else {
              handleResetFilters();
            }
          }}
        />
      ) : (
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
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_PRODUCT_IMG;
                    }}
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
                      <span className="truncate">{item.origin}</span>
                      {item.year && (
                        <>
                          <span>·</span>
                          <span className="shrink-0">{item.year}</span>
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
                      type="button"
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
      )}
    </div>
  );
};
