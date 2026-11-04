import React, { useState } from 'react';
import { BookOpen, Flame, Scale, Coffee, ArrowRight, Sparkles } from 'lucide-react';
import { TEA_WISDOM_ITEMS, TeaWisdomItem } from '../data/teaWisdomData';
import { filterTeaWisdom } from '../utils/brewingLogic';
import { zenAudio } from '../utils/audioZen';

interface TeaWisdomSectionProps {
  onSelectWisdom: (item: TeaWisdomItem) => void;
}

const CATEGORIES = [
  '全部',
  '单丛工夫',
  '武夷岩韵',
  '朱泥养器',
  '老茶慢煮',
  '当代茶简',
];

export const TeaWisdomSection: React.FC<TeaWisdomSectionProps> = ({ onSelectWisdom }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const filteredItems = filterTeaWisdom(
    TEA_WISDOM_ITEMS,
    selectedCategory === '全部' ? null : selectedCategory
  );

  const handleCategoryChange = (cat: string) => {
    zenAudio.playZenChime();
    setSelectedCategory(cat);
  };

  const handleCardClick = (item: TeaWisdomItem) => {
    zenAudio.playZenChime();
    onSelectWisdom(item);
  };

  return (
    <section aria-label="茶艺心法板块" className="space-y-4 pt-1">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B23A2B]" />
            <span className="text-[10px] tracking-widest text-[#857E71] font-mono uppercase block font-semibold">
              TEA WISDOM & BREWING RITUAL · 茶艺心法
            </span>
          </div>
          <h2 className="font-oriental-serif text-lg sm:text-xl font-bold text-[#1E2320] tracking-wider mt-0.5">
            茶艺心法 · 闻香识器
          </h2>
          <p className="text-xs text-[#7B7468] font-light mt-0.5">
            一叶有来处，一器有分寸。春城嘉叶精选冲泡要诀与器物相宜法门。
          </p>
        </div>

        <span className="text-[10px] text-[#8C8476] font-mono hidden sm:inline">
          共 {TEA_WISDOM_ITEMS.length} 篇心传
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-oriental-serif transition-all shrink-0 ${
                isActive
                  ? 'bg-[#1E2320] text-white shadow-xs'
                  : 'bg-white text-[#635B4E] border border-[#DDD4C4] hover:bg-[#F2ECE3]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#E7DFD2] hover:border-[#8F733E]/60 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between space-y-3 relative overflow-hidden"
          >
            {/* Subtle corner badge / category tag */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] tracking-widest font-mono text-[#8F733E] uppercase font-bold">
                    {item.categoryEn}
                  </span>
                  <span className="text-[10px] bg-[#F5EFE6] text-[#716859] px-2 py-0.5 rounded-full border border-[#E8DECf]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-oriental-serif text-base font-bold text-[#1E2320] group-hover:text-[#8F733E] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#7A7365] font-light mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2D8C7] flex items-center justify-center text-[#8C8375] group-hover:bg-[#1E2320] group-hover:text-white transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Brief Narrative Quote */}
            <p className="text-xs text-[#524B40] leading-relaxed font-light line-clamp-2 bg-[#F9F7F2] p-2.5 rounded-xl border border-[#ECE4D6]">
              {item.brief}
            </p>

            {/* Parameter Micro-Tags */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0E9DC]">
              <div className="flex items-center gap-1 text-[11px] text-[#554E42]">
                <Flame className="w-3 h-3 text-[#B23A2B] shrink-0" />
                <span className="truncate">{item.temperature.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#554E42]">
                <Scale className="w-3 h-3 text-[#8F733E] shrink-0" />
                <span className="truncate">{item.waterLeafRatio.split(' ')[0]}</span>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="flex items-center justify-between text-[11px] text-[#8F733E] pt-0.5 font-oriental-serif">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>点击阅览详尽冲泡指南</span>
              </span>
              <span className="text-[10px] text-[#9D9484] font-mono">
                {item.steps.length} 步法门
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
