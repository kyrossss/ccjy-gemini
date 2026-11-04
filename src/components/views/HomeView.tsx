import React from 'react';
import { ArrowRight, Sparkles, Feather, ShieldCheck } from 'lucide-react';
import { PRODUCTS, TeaItem, TEA_ROOMS } from '../../data/mockData';
import { MemberTierLevel, calculateDiscountedPrice } from '../../utils/teaLogic';
import { TabKey } from '../TabBar';
import { TeaWisdomSection } from '../TeaWisdomSection';
import { TeaWisdomItem } from '../../data/teaWisdomData';
import { TeaTerroirExplorer } from '../TeaTerroirExplorer';

interface HomeViewProps {
  onSelectTab: (tab: TabKey) => void;
  onOpenProduct: (item: TeaItem) => void;
  onOpenRitual: () => void;
  onOpenWisdom: (item: TeaWisdomItem) => void;
  userTier: MemberTierLevel;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenProduct,
  onOpenRitual,
  onOpenWisdom,
  userTier,
}) => {
  const featuredTeas = PRODUCTS.filter((p) => p.featured);

  const handleOpenProductById = (productId: string) => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) {
      onOpenProduct(found);
    } else {
      onSelectTab('shop');
    }
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Editorial Hero Banner (Using Reference IMG_6488 - 悦 MOON / 月藏山水) */}
      <section className="relative w-full aspect-16/10 bg-[#16231C] overflow-hidden text-white flex flex-col justify-end p-6 select-none shadow-sm">
        <img
          src="/assets/aistudio/IMG_6488_a1ec8e50.JPG"
          alt="月藏山水 THE MOON'S SILENT RETREAT"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85 brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121B16]/95 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#E4D1A0]">
            <span>春城嘉叶 · 甲辰季选</span>
            <span>·</span>
            <span>ORIENTAL TEA & WARES</span>
          </div>
          <h1 className="font-oriental-serif text-2xl sm:text-3xl font-bold tracking-widest text-[#FBF9F5] leading-tight">
            一叶有来处 · 一器有分寸
          </h1>
          <p className="font-display-serif text-xs text-[#CBC3B0] tracking-wider font-light">
            CHUN CHENG JIA YE · 山场原叶 · 手作茗壶 · 赏瓷雅器
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onSelectTab('shop')}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] text-[#1E2320] text-xs font-oriental-serif font-semibold tracking-wider hover:bg-white transition-transform active:scale-95 shadow-sm"
            >
              品鉴器物与茶
            </button>
            <button
              onClick={() => onSelectTab('room')}
              className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-xs border border-white/30 text-white text-xs font-oriental-serif tracking-wider hover:bg-white/25 transition-transform active:scale-95"
            >
              预约私享茶室
            </button>
          </div>
        </div>
      </section>

      {/* Quick Category Pillars */}
      <section className="px-5">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: '潮州手拉', en: 'ZHUNI POT', icon: '壶', tab: 'shop' as TabKey },
            { label: '凤凰单丛', en: 'DANCONG', icon: '丛', tab: 'shop' as TabKey },
            { label: '武夷正岩', en: 'WUYI ROCK', icon: '岩', tab: 'shop' as TabKey },
            { label: '爻·茶简', en: 'YÁO WAND', icon: '爻', tab: 'shop' as TabKey },
          ].map((cat, i) => (
            <button
              key={i}
              onClick={() => onSelectTab(cat.tab)}
              className="p-3 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs hover:border-[#232B26] transition-all group flex flex-col items-center"
            >
              <div className="w-9 h-9 rounded-full bg-[#F5F2EB] group-hover:bg-[#232B26] group-hover:text-white transition-colors flex items-center justify-center font-oriental-serif text-sm font-bold text-[#303833] mb-1.5">
                {cat.icon}
              </div>
              <span className="text-xs font-oriental-serif font-semibold text-[#202723] tracking-tight">
                {cat.label}
              </span>
              <span className="text-[8px] font-mono tracking-wider text-[#A09A8F] uppercase mt-0.5">
                {cat.en}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Daily Mindful Ritual Banner */}
      <section className="px-5">
        <div
          onClick={onOpenRitual}
          className="p-4 rounded-2xl bg-gradient-to-r from-[#202924] to-[#2E3B33] text-white flex items-center justify-between cursor-pointer shadow-md border border-[#3C4A41] hover:brightness-105 transition-all"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#E4D1A0] text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-mono tracking-widest text-[10px] uppercase">
                DAILY MINDFUL CEREMONY
              </span>
            </div>
            <h3 className="font-oriental-serif text-sm font-bold tracking-wide">
              今日朝夕点茶 · 凝神片刻
            </h3>
            <p className="text-[11px] text-[#C4BDB0] font-light">
              静候沸水浸泡，完成签到即享 +50 叶值与 2 茗元
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            <ArrowRight className="w-4 h-4 text-[#E4D1A0]" />
          </div>
        </div>
      </section>

      {/* Featured Teas & Hand-Pulled Pots (Gallery Grid) */}
      <section className="px-5 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-oriental-serif text-base font-bold text-[#1E2320] tracking-wide">
              馆藏精选 · 匠心相传
            </h2>
            <p className="text-[10px] text-[#868074] font-mono tracking-wider uppercase mt-0.5">
              CURATED MASTERPIECES
            </p>
          </div>
          <button
            onClick={() => onSelectTab('shop')}
            className="text-xs text-[#8F733E] font-medium flex items-center gap-1 hover:underline"
          >
            <span>全部器物</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featuredTeas.slice(0, 4).map((item) => {
            const discounted = calculateDiscountedPrice(item.price, userTier);
            return (
              <div
                key={item.id}
                onClick={() => onOpenProduct(item)}
                className="bg-white rounded-2xl overflow-hidden border border-[#ECE6DB] shadow-xs cursor-pointer group hover:border-[#232B26] transition-all flex flex-col"
              >
                <div className="relative aspect-4/3 w-full bg-[#181D1A] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[10px] text-[#EFEAE1] font-mono tracking-widest">
                    {item.subCategory}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-oriental-serif text-xs font-bold text-[#232B26] line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-[#878175] line-clamp-1 mt-0.5 font-light">
                      {item.tagline}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#F2EEE6] flex items-baseline justify-between">
                    <span className="font-mono text-xs font-bold text-[#1E2320]">
                      ¥{discounted.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-[#8F733E] font-medium">
                      专席礼遇
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tea Wisdom & Mindful Brewing Principles (茶艺心法 · 闻香识器) */}
      <div className="px-5">
        <TeaWisdomSection onSelectWisdom={onOpenWisdom} />
      </div>

      {/* Explore Tea Mountains Terroir & AI Sensory Aroma Map (寻味茶山 · AI 感官香气图谱) */}
      <section className="px-5">
        <TeaTerroirExplorer
          onOpenProductById={handleOpenProductById}
          onExploreShop={() => onSelectTab('shop')}
        />
      </section>

      {/* Editorial Story Section (Reference IMG_6489 & IMG_6490) */}
      <section className="px-5">
        <div className="bg-[#F3EFE7] rounded-3xl p-5 border border-[#E3DCCB] space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#8F733E] font-mono tracking-widest uppercase">
            <Feather className="w-3.5 h-3.5" />
            <span>TEA AESTHETICS · 一叶有来处，一器有分寸</span>
          </div>

          <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black">
            <img
              src="/assets/aistudio/IMG_6490_7c61932b.JPG"
              alt="春城嘉叶 诗时拾食"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <p className="font-oriental-serif text-xs text-[#F2ECE1] italic leading-relaxed">
                「一叶有来处，一器有分寸。认真对待每一泡茶，也认真选择与茶相宜的器。」
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 bg-white/80 rounded-xl border border-[#E4DDD0]">
              <span className="font-bold text-[#232B26] block font-oriental-serif mb-1">
                手作茗壶 · 潮州手拉
              </span>
              <p className="text-[11px] text-[#736C60] font-light leading-relaxed">
                吴瑞全与谢华名家亲制，孟臣梨壶与思婷形制，微米气孔专为单丛工夫茶而生。
              </p>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-[#E4DDD0]">
              <span className="font-bold text-[#232B26] block font-oriental-serif mb-1">
                茶器寄售 · 保真流转
              </span>
              <p className="text-[11px] text-[#736C60] font-light leading-relaxed">
                春城嘉叶茶器与寄售平台（含闲鱼专营），实物一器一档鉴藏与恒温母仓管护。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tea Chamber Preview */}
      <section className="px-5 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-oriental-serif text-base font-bold text-[#1E2320] tracking-wide">
              私享茶室 · 幽玄雅集
            </h2>
            <p className="text-[10px] text-[#868074] font-mono tracking-wider uppercase mt-0.5">
              PRIVATE TEA SANCTUARY
            </p>
          </div>
          <button
            onClick={() => onSelectTab('room')}
            className="text-xs text-[#8F733E] font-medium flex items-center gap-1 hover:underline"
          >
            <span>全部茶席</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-[#ECE6DB] shadow-xs">
          <div className="relative aspect-16/9 w-full bg-[#1A221E]">
            <img
              src={TEA_ROOMS[0].image}
              alt={TEA_ROOMS[0].name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#1C2620]/80 backdrop-blur-xs text-[#E8D6B0] px-3 py-1 rounded-full text-xs font-mono">
              枯山水景观专席
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-oriental-serif text-sm font-bold text-[#232B26]">
                  {TEA_ROOMS[0].name}
                </h3>
                <p className="text-xs text-[#7B7468] mt-0.5 font-light">
                  {TEA_ROOMS[0].theme} · {TEA_ROOMS[0].capacity}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-base font-bold text-[#1F2522]">
                  ¥{TEA_ROOMS[0].basePrice}
                </span>
                <span className="text-[10px] text-[#8F887C] block">/ 席</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('room')}
              className="w-full h-10 rounded-xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-medium tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>预约今日或后日席位</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
