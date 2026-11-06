import React, { useState } from 'react';
import { ShieldCheck, Plus, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { CONSIGNMENT_ITEMS, ConsignmentItem } from '../../data/mockData';
import { MemberTierLevel, TIER_CONFIGS } from '../../utils/teaLogic';
import { OrientalEmptyState } from '../OrientalEmptyState';
import { ConsignmentLifecycleTimeline } from '../ConsignmentLifecycleTimeline';

interface ConsignViewProps {
  consignments?: ConsignmentItem[];
  onOpenConsignmentModal: (item: ConsignmentItem | null, mode: 'view' | 'submit') => void;
  onGoToShop?: () => void;
  userTier: MemberTierLevel;
}

const FALLBACK_CONSIGN_IMG = '/assets/aistudio/IMG_6487_f774f6f1.JPG';

export const ConsignView: React.FC<ConsignViewProps> = ({
  consignments = CONSIGNMENT_ITEMS,
  onOpenConsignmentModal,
  onGoToShop,
  userTier,
}) => {
  const tierConfig = TIER_CONFIGS[userTier];
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'teapot' | 'tea' | 'antique' | 'incense'
  >('all');

  const filteredItems = consignments.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  return (
    <div className="space-y-5 px-5 pb-12">
      {/* Editorial Header */}
      <div className="pt-3">
        <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block whitespace-nowrap">
          SECONDARY MARKET & PROVENANCE
        </span>
        <h1 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1F2522] tracking-wider mt-0.5 cjk-title">
          器物茶叶 · 典藏流转
        </h1>
        <p className="text-xs text-[#7B7569] font-light mt-1 cjk-body leading-relaxed">
          为爱茶与藏器之人搭建的去中心化流转鉴藏平台，每件老茶与古陶均经专家实物验真并入仓保管。
        </p>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F2EDE1] border border-[#8F733E]/15 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-[#8F733E] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#2E6840] shrink-0" />
          <span className="font-oriental-serif font-bold text-[#232B26] whitespace-nowrap">
            春城嘉叶茶器与寄售四重守护
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 text-[11px] text-[#696254]">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E] shrink-0"></span>
            <span className="truncate">实物一器一档鉴藏证书</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E] shrink-0"></span>
            <span className="truncate">恒温恒湿干仓安全存储</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E] shrink-0"></span>
            <span className="truncate">成交流转空投嘉叶币</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E] shrink-0"></span>
            <span className="truncate">
              {tierConfig.name}享仅 {Math.round(tierConfig.consignmentFeeRate * 100)}% 极低服务费
            </span>
          </div>
        </div>
      </div>

      {/* Brand Manifesto Quote */}
      <div className="py-3 px-4 rounded-2xl bg-[#FAF6EC] border border-[#8F733E]/15 flex items-center justify-between text-xs text-[#6F6452] font-oriental-serif shadow-2xs gap-3">
        <span className="italic truncate leading-relaxed">「认真喝每一杯茶，也认真对待每一段长期关系。」</span>
        <span className="text-[10px] font-mono text-[#8F733E] bg-white px-2.5 py-0.5 rounded-full border border-[#8F733E]/20 shrink-0 whitespace-nowrap leading-none">
          春城嘉叶会籍准则
        </span>
      </div>

      {/* Action CTAs: Dual track for Consignment & Tea Utensil Exchange */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onOpenConsignmentModal(null, 'submit')}
          className="h-11 px-3 rounded-2xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-[#D8C496] shrink-0" />
          <span>我要寄售名物 (二级流转)</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenConsignmentModal(null, 'submit')}
          className="h-11 px-3 rounded-2xl bg-[#8F733E] hover:bg-[#7D6434] text-white font-oriental-serif text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-[#FFF2D6] shrink-0" />
          <span>茶器置换以旧换新 (返嘉叶币)</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
        {[
          { id: 'all', label: `全部典藏 (${consignments.length})` },
          { id: 'teapot', label: '名家手拉壶' },
          { id: 'tea', label: '干仓年份茶' },
          { id: 'antique', label: '传世古器物' },
          { id: 'incense', label: '竹木香器' },
        ].map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() =>
              setSelectedCategory(
                cat.id as 'all' | 'teapot' | 'tea' | 'antique' | 'incense'
              )
            }
            className={`px-3.5 py-1.5 rounded-xl text-xs font-oriental-serif shrink-0 border transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26] font-bold shadow-2xs'
                : 'bg-white text-[#665F53] border-[#232B26]/[0.08] hover:border-[#232B26]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Consignment Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#868073]">
          <span className="font-mono text-[11px]">
            当前鉴藏流转专席 ({filteredItems.length})
          </span>
          <span className="text-[10px] text-[#8F733E] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>支持收入茶囊或直接专席认藏</span>
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <OrientalEmptyState
            variant="consign"
            onPrimaryAction={() => onOpenConsignmentModal(null, 'submit')}
            onSecondaryAction={() => {
              if (selectedCategory !== 'all') {
                setSelectedCategory('all');
              } else {
                onGoToShop?.();
              }
            }}
            secondaryActionLabel={
              selectedCategory !== 'all' ? '查看全部流转中典藏' : '前往茶铺品鉴全系器物'
            }
            onSmartRecommendationClick={(rec) => {
              if (rec.targetTab === 'shop' && onGoToShop) {
                onGoToShop();
              } else if (rec.targetCategory === 'teapot' || rec.targetCategory === 'tea') {
                setSelectedCategory(rec.targetCategory);
              } else {
                setSelectedCategory('all');
              }
            }}
          />
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenConsignmentModal(item, 'view')}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-[#232B26]/[0.06] shadow-xs cursor-pointer group hover:border-[#232B26]/30 transition-all space-y-3.5"
            >
              <div className="flex gap-3.5">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#161B18] shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_CONSIGN_IMG;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest ${
                      item.status === 'sold'
                        ? 'bg-black/75 text-[#D8C496]'
                        : 'bg-[#25382B]/90 text-[#D8E6DC]'
                    }`}
                  >
                    {item.status === 'sold' ? '已结藏' : '流转中'}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#918B7E] font-mono">
                      <span>{item.certificateNo}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views}</span>
                      </span>
                    </div>
                    <h3 className="font-oriental-serif text-sm font-bold text-[#232B26] mt-0.5 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#7A7468] font-light mt-0.5 line-clamp-1">
                      品相：{item.condition}
                    </p>
                  </div>

                  <div className="text-[10px] text-[#8F733E] flex items-center justify-between">
                    <span>
                      委托人：{item.sellerName} ({item.sellerTier})
                    </span>
                    {(item.bidsCount ?? 0) > 0 && (
                      <span className="font-mono text-[#6E675B]">{item.bidsCount} 次认藏意向</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Provenance & Circulating Lifecycle Visual Timeline */}
              <div className="pt-0.5">
                <ConsignmentLifecycleTimeline item={item} userTier={userTier} />
              </div>

              <div className="pt-2 border-t border-[#F2EEE6] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-[#8C867B] block whitespace-nowrap">流转席价</span>
                  <div className="flex items-baseline gap-2 whitespace-nowrap price-nowrap">
                    <span className="font-mono text-base font-bold text-[#1E2320]">
                      ¥{item.currentPrice.toLocaleString()}
                    </span>
                    <span className="font-mono text-[11px] text-[#A6A092] line-through">
                      估价 ¥{item.originalEstimate.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-[#F3EFE7] group-hover:bg-[#232B26] group-hover:text-white text-[#29322D] text-xs font-oriental-serif font-medium tracking-wider transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>{item.status === 'sold' ? '查阅流转档案' : '查验鉴藏证书 · 认藏'}</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
