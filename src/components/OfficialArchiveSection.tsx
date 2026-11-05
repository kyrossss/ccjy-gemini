import React, { useState } from 'react';
import {
  BookOpen,
  Compass,
  ArrowRight,
  ChevronRight,
  Award,
  Flame,
  Calendar,
  ShoppingBag,
  Layers,
} from 'lucide-react';
import {
  BRAND_HISTORY_MILESTONES,
  OFFICIAL_YAO_PILLARS,
  OFFICIAL_YAO_SCENARIOS,
  OFFICIAL_TEA_ARCHIVE,
  OFFICIAL_PORCELAIN_ARCHIVE,
  OFFICIAL_TEAPOT_ARCHIVE,
  OFFICIAL_BRAND_UPDATES,
  OfficialArchiveItem,
  OfficialBrandUpdate,
} from '../data/officialWebsiteData';
import { ShopCategoryFilter } from './views/ShopView';
import { OrientalEmptyState } from './OrientalEmptyState';

interface OfficialArchiveSectionProps {
  onOpenProductById: (productId: string) => void;
  onFilterShop?: (category: ShopCategoryFilter, keyword: string) => void;
  onReserveTeaInSalon?: (teaName: string) => void;
}

type MainSectionTab = 'catalog' | 'yao' | 'chronicle';
type CatalogSubFilter = 'tea-all' | 'dancong' | 'wuyi' | 'porcelain' | 'teapot' | 'upcoming';

export const OfficialArchiveSection: React.FC<OfficialArchiveSectionProps> = ({
  onOpenProductById,
  onFilterShop,
  onReserveTeaInSalon,
}) => {
  const [activeTab, setActiveTab] = useState<MainSectionTab>('catalog');
  const [catalogFilter, setCatalogFilter] = useState<CatalogSubFilter>('tea-all');
  const [showAllCatalogItems, setShowAllCatalogItems] = useState(false);
  const [selectedArchiveItem, setSelectedArchiveItem] = useState<OfficialArchiveItem>(
    OFFICIAL_TEA_ARCHIVE[0]
  );
  const [expandedUpdateId, setExpandedUpdateId] = useState<string>(
    OFFICIAL_BRAND_UPDATES[0].id
  );

  // Filter the 42 official items (30 Teas + 5 Porcelain + 7 Teapots)
  const getFilteredCatalogItems = (): OfficialArchiveItem[] => {
    switch (catalogFilter) {
      case 'tea-all':
        return OFFICIAL_TEA_ARCHIVE;
      case 'dancong':
        return OFFICIAL_TEA_ARCHIVE.filter((item) => item.subCategory === '凤凰单丛');
      case 'wuyi':
        return OFFICIAL_TEA_ARCHIVE.filter((item) => item.subCategory === '武夷岩茶');
      case 'porcelain':
        return OFFICIAL_PORCELAIN_ARCHIVE;
      case 'teapot':
        return OFFICIAL_TEAPOT_ARCHIVE;
      case 'upcoming':
        return [];
    }
  };

  const currentCatalogList = getFilteredCatalogItems();
  const visibleCatalogList = showAllCatalogItems
    ? currentCatalogList
    : currentCatalogList.slice(0, 8);

  const handleSelectCatalogFilter = (nextFilter: CatalogSubFilter) => {
    setCatalogFilter(nextFilter);
    setShowAllCatalogItems(false);
    const nextList =
      nextFilter === 'tea-all'
        ? OFFICIAL_TEA_ARCHIVE
        : nextFilter === 'dancong'
        ? OFFICIAL_TEA_ARCHIVE.filter((i) => i.subCategory === '凤凰单丛')
        : nextFilter === 'wuyi'
        ? OFFICIAL_TEA_ARCHIVE.filter((i) => i.subCategory === '武夷岩茶')
        : nextFilter === 'porcelain'
        ? OFFICIAL_PORCELAIN_ARCHIVE
        : nextFilter === 'teapot'
        ? OFFICIAL_TEAPOT_ARCHIVE
        : [];
    if (nextList.length > 0) {
      setSelectedArchiveItem(nextList[0]);
    }
  };

  const handleUpdateFilterAction = (update: OfficialBrandUpdate) => {
    if (!onFilterShop) return;
    if (update.targetShopCategory === 'teaware') {
      onFilterShop('teaware', '景德镇');
    } else if (update.targetShopCategory === 'teapot') {
      onFilterShop('teapot', '');
    } else if (update.targetShopCategory === 'tea') {
      onFilterShop('tea', '');
    } else {
      onFilterShop('yao', '');
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FAF8F3] via-[#F4EFE4] to-[#EFE8DA] rounded-3xl p-4 sm:p-5 border border-[#DFD6C5] shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#8F733E] uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>OFFICIAL ARCHIVE · CHUNCHENGJIAYE.COM</span>
          </div>
          <h2 className="font-oriental-serif text-base sm:text-lg font-bold text-[#1E2320] tracking-wide mt-0.5">
            春城嘉叶 · 官网全谱系典藏与品牌志
          </h2>
          <p className="text-[11px] text-[#756E61] font-light mt-0.5">
            同步官网 30 款山场原叶、5 款景德镇雅瓷、7 把名家手拉/手拍壶与「爻 YÁO」体系
          </p>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-[#232B26] text-[#E6D6B2] text-[9px] font-mono tracking-wider shrink-0">
          42 器物实录
        </span>
      </div>

      {/* 3 Primary Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#E8E0D0]/80 rounded-2xl border border-[#DCD2BF]">
        {[
          {
            id: 'catalog' as MainSectionTab,
            label: '叶·瓷·壶 42谱系',
            sub: '30茶 · 5瓷 · 7壶',
          },
          {
            id: 'yao' as MainSectionTab,
            label: '爻 YÁO · 六境',
            sub: '方便一点 标准不轻',
          },
          {
            id: 'chronicle' as MainSectionTab,
            label: '八段历程 · 动态',
            sub: '缘起至当下纪事',
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-2 rounded-xl text-center transition-all ${
                isActive
                  ? 'bg-[#232B26] text-white shadow-xs'
                  : 'text-[#5A5347] hover:bg-white/60'
              }`}
            >
              <span className="block font-oriental-serif text-xs font-bold tracking-tight">
                {tab.label}
              </span>
              <span
                className={`block text-[9px] font-mono mt-0.5 ${
                  isActive ? 'text-[#DFCFAF]' : 'text-[#8C8476]'
                }`}
              >
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 叶·瓷·壶 42款官网全谱系图鉴 */}
      {activeTab === 'catalog' && (
        <div className="space-y-3.5 animate-in fade-in duration-300">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { id: 'tea-all' as CatalogSubFilter, label: '山场原叶 (30)' },
              {
                id: 'dancong' as CatalogSubFilter,
                label: `凤凰单丛 (${
                  OFFICIAL_TEA_ARCHIVE.filter((i) => i.subCategory === '凤凰单丛').length
                })`,
              },
              {
                id: 'wuyi' as CatalogSubFilter,
                label: `武夷岩茶 (${
                  OFFICIAL_TEA_ARCHIVE.filter((i) => i.subCategory === '武夷岩茶').length
                })`,
              },
              { id: 'porcelain' as CatalogSubFilter, label: '赏瓷雅器 (05)' },
              { id: 'teapot' as CatalogSubFilter, label: '手作茗壶 (07)' },
              { id: 'upcoming' as CatalogSubFilter, label: '时令新窑·待录' },
            ].map((chip) => (
              <button
                type="button"
                key={chip.id}
                onClick={() => handleSelectCatalogFilter(chip.id)}
                className={`px-3 py-1 rounded-xl text-xs font-oriental-serif whitespace-nowrap shrink-0 border transition-all ${
                  catalogFilter === chip.id
                    ? 'bg-[#8F733E] text-white border-[#8F733E] font-bold shadow-2xs'
                    : 'bg-white/90 text-[#5E574B] border-[#DFD6C5] hover:border-[#232B26]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {currentCatalogList.length === 0 ? (
            <OrientalEmptyState
              variant="home"
              compact
              onPrimaryAction={() => handleSelectCatalogFilter('tea-all')}
              primaryActionLabel="返回查阅 42 款在馆实录"
              onSecondaryAction={() => onFilterShop?.('all', '')}
              secondaryActionLabel="前往茶铺甄选全系器物"
              onSmartRecommendationClick={(rec) => {
                if (rec.targetCategory && onFilterShop) {
                  onFilterShop(rec.targetCategory, rec.searchKeyword || '');
                } else {
                  handleSelectCatalogFilter('tea-all');
                }
              }}
            />
          ) : (
            <>
              {/* Spotlight Card for Currently Selected Official Archive Item */}
              {selectedArchiveItem && (
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E2D9C8] shadow-xs">
              <div className="relative aspect-16/9 w-full bg-[#19201C] overflow-hidden">
                <img
                  src={selectedArchiveItem.image}
                  alt={selectedArchiveItem.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/aistudio/IMG_6489_3dbe7626.JPG';
                  }}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#232B26]/90 backdrop-blur-xs text-[#E8D6B0] text-[10px] font-mono tracking-widest border border-white/15">
                    NO.{selectedArchiveItem.index}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-oriental-serif">
                    {selectedArchiveItem.subCategory}
                  </span>
                  {selectedArchiveItem.artisan && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8F733E]/90 text-white text-[10px] font-oriental-serif">
                      名家 · {selectedArchiveItem.artisan}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-oriental-serif text-base font-bold tracking-wide text-[#FAF8F5]">
                    {selectedArchiveItem.name}
                  </h3>
                  <p className="text-xs text-[#E4DEC9] font-oriental-serif mt-0.5 leading-relaxed">
                    「{selectedArchiveItem.caption}」
                  </p>
                </div>
              </div>

              <div className="p-3.5 flex flex-wrap items-center justify-between gap-2 bg-[#FAF8F4]">
                <div className="text-[11px] text-[#6B6457] font-oriental-serif">
                  <span>官网原叶与器物图谱直连 · </span>
                  <span className="text-[#8F733E] font-medium">支持专席品鉴与入囊</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedArchiveItem.chapter === 'tea' && onReserveTeaInSalon && (
                    <button
                      type="button"
                      onClick={() => onReserveTeaInSalon(selectedArchiveItem.name)}
                      className="px-3 py-1.5 rounded-xl bg-[#F3EFE7] hover:bg-[#E7E0D2] text-[#232B26] border border-[#D8C9B0] text-xs font-oriental-serif font-medium flex items-center gap-1 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#8F733E]" />
                      <span>约茶席试饮</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenProductById(selectedArchiveItem.matchedProductId)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#232B26] hover:bg-[#161C18] text-white text-xs font-oriental-serif font-medium flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E4D1A0]" />
                    <span>品鉴同款商品</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnail Grid of Archive Items */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {visibleCatalogList.map((item) => {
              const isSelected =
                selectedArchiveItem.index === item.index &&
                selectedArchiveItem.name === item.name;
              return (
                <button
                  type="button"
                  key={`${item.chapter}-${item.index}-${item.name}`}
                  onClick={() => setSelectedArchiveItem(item)}
                  className={`p-2 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#232B26] text-white border-[#232B26] shadow-xs'
                      : 'bg-white/90 text-[#232B26] border-[#E5DEC9] hover:border-[#8F733E]'
                  }`}
                >
                  <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden bg-[#181E1A] mb-1.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/aistudio/IMG_6486_3fb9fe71.JPG';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-black/60 text-[#E8D6B0] font-mono text-[9px]">
                      {item.index}
                    </span>
                  </div>
                  <div>
                    <div className="font-oriental-serif text-xs font-bold line-clamp-1">
                      {item.name}
                    </div>
                    <p
                      className={`text-[10px] line-clamp-1 mt-0.5 font-light ${
                        isSelected ? 'text-[#D8C496]' : 'text-[#7D7669]'
                      }`}
                    >
                      {item.caption}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Toggle Show All 30 Items Button */}
          {currentCatalogList.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllCatalogItems(!showAllCatalogItems)}
              className="w-full py-2 rounded-xl bg-white/80 hover:bg-white border border-[#DED5C4] text-xs font-oriental-serif text-[#5C5549] font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#8F733E]" />
              <span>
              {showAllCatalogItems
                ? '收起部分图谱'
                : `展开全部 ${currentCatalogList.length} 款官网实拍档案`}
            </span>
          </button>
        )}
            </>
          )}
        </div>
      )}

      {/* TAB 2: 爻 YÁO · 茶简与六大真实日常场景 */}
      {activeTab === 'yao' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Official YÁO Quote Banner */}
          <div className="p-3.5 rounded-2xl bg-[#202823] text-[#FAF8F5] border border-[#38453C] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#E4D1A0] uppercase">
                YÁO SINGLE INFUSION · 凡入爻，皆有据
              </span>
              <span className="text-[10px] font-oriental-serif px-2 py-0.5 rounded-full bg-white/10 text-[#DFCFAF]">
                方便一点，标准不轻
              </span>
            </div>
            <p className="text-xs font-oriental-serif text-[#E8E2D5] leading-relaxed">
              「把好茶带回日常，让方便也有分寸。把独立保护、便携和入杯使用收进一支穿孔金属茶棒简洁形态；对来源、加工与本批品鉴的判断，并不因此被省略。」
            </p>
          </div>

          {/* 3 YÁO Product System Pillars */}
          <div className="grid grid-cols-3 gap-2">
            {OFFICIAL_YAO_PILLARS.map((pillar) => (
              <div
                key={pillar.code}
                onClick={() => onOpenProductById('yao-01')}
                className="bg-white rounded-2xl overflow-hidden border border-[#E4DDD0] hover:border-[#232B26] transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-16/10 w-full bg-[#1C231F] overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/aistudio/IMG_6491_1582fce7.JPG';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded-md bg-black/65 text-[#E8D6B0] font-mono text-[9px]">
                    {pillar.code}
                  </span>
                </div>
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-[#8F733E] uppercase tracking-wider">
                    {pillar.enTitle}
                  </span>
                  <h4 className="font-oriental-serif text-xs font-bold text-[#1F2522] mt-0.5">
                    {pillar.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* 6 Daily Life Scenarios from chunchengjiaye.com */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-oriental-serif text-xs font-bold text-[#232B26]">
                把茶放回六个真实日常时刻（清晨 · 夜读 · 案头 · 相谈 · 赠礼 · 出行）
              </h4>
              <button
                type="button"
                onClick={() => onOpenProductById('yao-01')}
                className="text-[11px] text-[#8F733E] font-oriental-serif font-bold flex items-center gap-0.5 hover:underline"
              >
                <span>品鉴爻·茶简</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {OFFICIAL_YAO_SCENARIOS.map((scene) => (
                <div
                  key={scene.index}
                  onClick={() => onOpenProductById('yao-01')}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E5DEC9] hover:border-[#232B26] transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-16/10 w-full bg-[#1C231F] overflow-hidden">
                    <img
                      src={scene.image}
                      alt={scene.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/aistudio/IMG_6491_1582fce7.JPG';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-xs text-[9px] text-[#E8D6B0] font-mono">
                      {scene.index}
                    </div>
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <h5 className="font-oriental-serif text-xs font-bold text-[#232B26]">
                      {scene.title}
                    </h5>
                    <p className="text-[10px] text-[#756E61] mt-1 leading-relaxed line-clamp-2">
                      {scene.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 八段品牌历程与四大官方动态 */}
      {activeTab === 'chronicle' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* 8-Stage Brand History Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-oriental-serif text-xs font-bold text-[#232B26] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#8F733E]" />
                <span>一叶成器，步履有声 · 官网八段历程</span>
              </h3>
              <span className="text-[10px] font-mono text-[#8A8274]">01 缘起 — 08 当下</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {BRAND_HISTORY_MILESTONES.map((m) => (
                <div
                  key={m.step}
                  className="p-3 rounded-2xl bg-white/95 border border-[#E5DEC9] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded-md bg-[#F3EFE7] text-[#8F733E] font-mono text-[10px] font-bold">
                      {m.step} · {m.phase}
                    </span>
                    <Flame className="w-3 h-3 text-[#C4B598]" />
                  </div>
                  <p className="text-[11px] text-[#4E483E] leading-relaxed pt-0.5 font-oriental-serif">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Official Brand Updates (2026-09-14) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="font-oriental-serif text-xs font-bold text-[#232B26] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#8F733E]" />
                <span>品牌动态 · 茶事纪要（官网专栏实录）</span>
              </h3>
              <span className="text-[10px] font-mono text-[#8A8274]">2026-09-14 发布</span>
            </div>

            <div className="space-y-2">
              {OFFICIAL_BRAND_UPDATES.map((upd) => {
                const isExpanded = expandedUpdateId === upd.id;
                return (
                  <div
                    key={upd.id}
                    className="rounded-2xl bg-white border border-[#E4DDD0] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedUpdateId(isExpanded ? '' : upd.id)
                      }
                      className="w-full p-3 text-left flex items-center justify-between gap-3 hover:bg-[#FAF8F4]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-[#F3EFE7] text-[#8F733E] font-bold">
                            {upd.category}
                          </span>
                          <span className="text-[9px] font-mono text-[#9A9284]">
                            {upd.date}
                          </span>
                        </div>
                        <h4 className="font-oriental-serif text-xs font-bold text-[#202723] truncate mt-0.5">
                          {upd.title}
                        </h4>
                        <p className="text-[10px] text-[#787164] truncate mt-0.5">
                          {upd.summary}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-[#8F733E] shrink-0 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-2 border-t border-[#F2EFE8] bg-[#FAF8F4] space-y-2.5 text-xs text-[#544E43]">
                        {upd.sections.map((sec, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <h5 className="font-oriental-serif text-[11px] font-bold text-[#232B26]">
                              · {sec.heading}
                            </h5>
                            <p className="text-[11px] leading-relaxed font-light text-[#635C4F]">
                              {sec.body}
                            </p>
                          </div>
                        ))}
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleUpdateFilterAction(upd)}
                            className="px-3 py-1 rounded-lg bg-[#232B26] text-white text-[11px] font-oriental-serif flex items-center gap-1 hover:bg-[#161B18]"
                          >
                            <span>前往「{upd.category}」专席鉴赏</span>
                            <ArrowRight className="w-3 h-3 text-[#E4D1A0]" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
