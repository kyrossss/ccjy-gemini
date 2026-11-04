import React from 'react';
import { ShieldCheck, Plus, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { CONSIGNMENT_ITEMS, ConsignmentItem } from '../../data/mockData';
import { MemberTierLevel, TIER_CONFIGS } from '../../utils/teaLogic';

interface ConsignViewProps {
  onOpenConsignmentModal: (item: ConsignmentItem | null, mode: 'view' | 'submit') => void;
  userTier: MemberTierLevel;
}

export const ConsignView: React.FC<ConsignViewProps> = ({
  onOpenConsignmentModal,
  userTier,
}) => {
  const tierConfig = TIER_CONFIGS[userTier];

  return (
    <div className="space-y-5 px-5 pb-12">
      {/* Editorial Header */}
      <div className="pt-3">
        <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase block">
          SECONDARY MARKET & PROVENANCE
        </span>
        <h1 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1F2522] tracking-wider mt-0.5">
          器物茶叶 · 典藏流转
        </h1>
        <p className="text-xs text-[#7B7569] font-light mt-1">
          为爱茶与藏器之人搭建的去中心化流转鉴藏平台，每件老茶与古陶均经专家实物验真并入仓保管。
        </p>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-[#F2EDE1] border border-[#DFD6C3] space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#8F733E] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#2E6840]" />
          <span className="font-oriental-serif font-bold text-[#232B26]">
            春城嘉叶茶器与寄售四重守护
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#696254]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E]"></span>
            <span>实物一器一档鉴藏证书</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E]"></span>
            <span>恒温恒湿干仓安全存储</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E]"></span>
            <span>成交流转空投茗元代币</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E]"></span>
            <span>{tierConfig.name}享仅 {Math.round(tierConfig.consignmentFeeRate * 100)}% 极低服务费</span>
          </div>
        </div>
      </div>

      {/* Action CTA to submit consignment */}
      <button
        onClick={() => onOpenConsignmentModal(null, 'submit')}
        className="w-full h-12 rounded-2xl bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-semibold tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
      >
        <Plus className="w-4 h-4 text-[#D8C496]" />
        <span>我要寄售名物 / 老茶变现流转</span>
      </button>

      {/* Active Consignment Listings */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between text-xs text-[#868073]">
          <span className="font-mono text-[11px]">当前鉴藏流转专席 ({CONSIGNMENT_ITEMS.length})</span>
          <span className="text-[10px] text-[#8F733E] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>支持茗元参与认藏</span>
          </span>
        </div>

        {CONSIGNMENT_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => onOpenConsignmentModal(item, 'view')}
            className="bg-white rounded-3xl p-4 border border-[#ECE6DB] shadow-xs cursor-pointer group hover:border-[#232B26] transition-all space-y-3"
          >
            <div className="flex gap-3.5">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#161B18] shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest ${
                    item.status === 'sold'
                      ? 'bg-black/70 text-[#C7C2B6]'
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

                <div className="text-[10px] text-[#8F733E]">
                  委托人：{item.sellerName} ({item.sellerTier})
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F2EEE6] flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-[#8C867B] block">流转席价</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-bold text-[#1E2320]">
                    ¥{item.currentPrice.toLocaleString()}
                  </span>
                  <span className="font-mono text-[11px] text-[#A6A092] line-through">
                    估价 ¥{item.originalEstimate.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="px-3.5 py-1.5 rounded-xl bg-[#F3EFE7] hover:bg-[#232B26] hover:text-white text-[#29322D] text-xs font-oriental-serif font-medium tracking-wider transition-colors flex items-center gap-1"
              >
                <span>查验鉴藏证书</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
