import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Clock,
  Award,
  BookOpen,
  Send,
  Feather,
  Heart,
} from 'lucide-react';
import { ConsignmentItem } from '../data/mockData';
import {
  generateConsignmentLifecycle,
  getConsignmentLifecycleSummary,
  ConsignmentLifecycleEvent,
  getAffinityStories,
  addAffinityStory,
  AffinityStory,
  AFFINITY_STORY_TAGS,
} from '../utils/consignmentLifecycleLogic';
import { MemberTierLevel, TIER_CONFIGS } from '../utils/teaLogic';
import { zenAudio } from '../utils/audioZen';

interface ConsignmentLifecycleTimelineProps {
  item: ConsignmentItem;
  variant?: 'card' | 'modal';
  defaultExpanded?: boolean;
  className?: string;
  userTier?: MemberTierLevel;
}

export const ConsignmentLifecycleTimeline: React.FC<ConsignmentLifecycleTimelineProps> = ({
  item,
  variant = 'card',
  defaultExpanded = false,
  className = '',
  userTier = 'GUEST',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'timeline' | 'stories'>('timeline');
  const [stories, setStories] = useState<AffinityStory[]>(() => getAffinityStories(item.id));
  const [showStoryInput, setShowStoryInput] = useState(false);

  // Story Form State
  const tierName = (userTier && TIER_CONFIGS[userTier]?.name) || '知音';
  const [authorName, setAuthorName] = useState(tierName);
  const [selectedTag, setSelectedTag] = useState<string>('得器因缘');
  const [storyContent, setStoryContent] = useState('');
  const [storyFeedback, setStoryFeedback] = useState(false);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  const events = generateConsignmentLifecycle(item);
  const summary = getConsignmentLifecycleSummary(item);

  // Icon mapping for oriental stages
  const getStageIcon = (event: ConsignmentLifecycleEvent) => {
    switch (event.stage) {
      case 'intake_appraisal':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'warehouse_custody':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'exhibition_interest':
        return <Eye className="w-3.5 h-3.5" />;
      case 'negotiation_settlement':
        return event.status === 'completed' ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6840]" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-[#8F733E]" />
        );
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const handleToggleLike = (storyId: string) => {
    zenAudio.playZenChime();
    setLikedStories((prev) => {
      const isLiked = !!prev[storyId];
      return { ...prev, [storyId]: !isLiked };
    });
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const isLiked = !!likedStories[storyId];
          return { ...s, likesCount: s.likesCount + (isLiked ? -1 : 1) };
        }
        return s;
      })
    );
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyContent.trim()) return;

    zenAudio.playZenChime();
    const newStory = addAffinityStory(item.id, {
      author: authorName.trim() || tierName,
      authorRole: `${tierName}席主`,
      content: storyContent.trim(),
      tag: selectedTag,
    });

    setStories([newStory, ...stories]);
    setStoryContent('');
    setStoryFeedback(true);
    setShowStoryInput(false);

    setTimeout(() => {
      setStoryFeedback(false);
    }, 2800);
  };

  return (
    <div
      className={`rounded-2xl border border-[#E8DFC9] bg-[#FAF7F0] overflow-hidden transition-all duration-300 ${className}`}
      onClick={(e) => {
        // Stop bubbling so card click doesn't trigger modal unintentionally
        e.stopPropagation();
      }}
    >
      {/* Top Banner / Summary Bar */}
      <div className="px-3.5 py-2.5 bg-[#F2EDE1] border-b border-[#E4DEC9] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8F733E] animate-pulse shrink-0"></div>
          <span className="font-oriental-serif font-bold text-xs text-[#232B26] tracking-wide flex items-center gap-1.5 whitespace-nowrap">
            <span>流转生命周期轨迹</span>
            <span className="text-[10px] font-mono font-normal text-[#867E70] bg-white/70 px-2 py-0.5 rounded border border-[#232B26]/[0.08] leading-none whitespace-nowrap">
              一器一档存证
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-[#7D7668] hidden sm:inline whitespace-nowrap">
            已存护 {summary.daysInCustody} 天 · 热度 {summary.interestHeatLevel}
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] text-[#8F733E] hover:text-[#6E562B] font-oriental-serif font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <span>{isExpanded ? '收起流转脉络' : '展开流转脉络 · 结缘故事'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Horizontal Compact Flow Progress (Always Visible) */}
      <div className="px-3.5 py-3">
        <div className="relative flex items-center justify-between">
          {/* Background Progress Line */}
          <div className="absolute left-3 right-3 top-3 h-[1.5px] bg-[#DDD4C0] -z-0">
            <div
              className="h-full bg-[#8F733E] transition-all duration-500"
              style={{
                width: summary.isSettled
                  ? '100%'
                  : `${((summary.completedNodesCount - 0.5) / (summary.totalNodesCount - 1)) * 100}%`,
              }}
            />
          </div>

          {events.map((evt) => {
            const isCompleted = evt.status === 'completed';
            const isCurrent = evt.status === 'current';

            return (
              <div
                key={evt.id}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
                onClick={() => {
                  setIsExpanded(true);
                  setActiveTab('timeline');
                }}
              >
                {/* Node Indicator Dot / Icon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border ${
                    isCompleted
                      ? 'bg-[#232B26] text-[#E8DFC9] border-[#232B26] shadow-2xs'
                      : isCurrent
                      ? 'bg-[#FAF8F5] text-[#8F733E] border-[#8F733E] ring-2 ring-[#8F733E]/20 animate-pulse'
                      : 'bg-[#F2EDE1] text-[#9A9386] border-[#D6CDBC]'
                  }`}
                  title={`${evt.stageName}: ${evt.title}`}
                >
                  {getStageIcon(evt)}
                </div>

                {/* Node Label */}
                <span
                  className={`text-[10px] font-oriental-serif mt-1 tracking-tight text-center whitespace-nowrap ${
                    isCompleted || isCurrent
                      ? 'text-[#232B26] font-semibold'
                      : 'text-[#969083] font-normal'
                  }`}
                >
                  {evt.stageShortName}
                </span>

                {/* Node Date */}
                <span className="text-[9px] font-mono text-[#8C8578] scale-90 -mt-0.5 whitespace-nowrap">
                  {evt.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick hint for stories */}
        <div className="mt-2 pt-2 border-t border-[#ECE5D4] flex items-center justify-between text-[11px] text-[#7A7365]">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(true);
              setActiveTab('stories');
            }}
            className="flex items-center gap-1.5 hover:text-[#232B26] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8F733E]" />
            <span className="font-oriental-serif">
              藏家结缘雅趣 ({stories.length}则题记)
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsExpanded(true);
              setActiveTab('stories');
              setShowStoryInput(true);
            }}
            className="text-[10px] font-oriental-serif text-[#8F733E] hover:underline flex items-center gap-1"
          >
            <Feather className="w-3 h-3" />
            <span>分享雅趣故事</span>
          </button>
        </div>
      </div>

      {/* Expanded Section: Dual Tabs for Timeline & Affinity Stories */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#ECE5D4] bg-[#FAF8F5] space-y-3 animate-in fade-in duration-200">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-[#E7DFCC] pb-1.5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`text-xs font-oriental-serif pb-0.5 transition-all ${
                  activeTab === 'timeline'
                    ? 'border-b-2 border-[#232B26] font-bold text-[#1E2320]'
                    : 'text-[#878073] hover:text-[#232B26]'
                }`}
              >
                全链溯源时间轴 (4节点)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stories')}
                className={`text-xs font-oriental-serif pb-0.5 transition-all flex items-center gap-1 ${
                  activeTab === 'stories'
                    ? 'border-b-2 border-[#232B26] font-bold text-[#1E2320]'
                    : 'text-[#878073] hover:text-[#232B26]'
                }`}
              >
                <span>结缘故事与雅趣</span>
                <span className="font-mono text-[10px] bg-[#EFE9DC] text-[#7A7365] px-2 py-0.5 rounded-full leading-none shrink-0">
                  {stories.length}
                </span>
              </button>
            </div>

            <span className="font-mono text-[10px] text-[#8F733E] hidden sm:inline">
              证书号：{item.certificateNo}
            </span>
          </div>

          {/* Toast Notification after story submission */}
          {storyFeedback && (
            <div className="p-2.5 rounded-xl bg-[#FAF4E6] border border-[#E0D1B1] text-xs text-[#7F612B] font-oriental-serif flex items-center justify-between animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8F733E]" />
                <span>您的结缘雅趣题记已成功归档，将随此器物长存流传。</span>
              </div>
            </div>
          )}

          {/* TAB 1: Vertical Provenance Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#7A7365]">
                <span className="flex items-center gap-1 font-oriental-serif">
                  <Award className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>春城嘉叶官方名物鉴藏存证</span>
                </span>
                <span className="font-mono text-[10px] text-[#8C8578]">
                  区块链链上存证已锁定
                </span>
              </div>

              <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#DED4C0]">
                {events.map((evt) => {
                  const isCompleted = evt.status === 'completed';
                  const isCurrent = evt.status === 'current';

                  return (
                    <div key={evt.id} className="relative group">
                      {/* Timeline Dot with Seal Accent */}
                      <div
                        className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border transition-all ${
                          isCompleted
                            ? 'bg-[#232B26] border-[#FAF8F5]'
                            : isCurrent
                            ? 'bg-[#8F733E] border-[#FAF8F5] ring-2 ring-[#8F733E]/30 animate-pulse'
                            : 'bg-[#C5BDAF] border-[#FAF8F5]'
                        }`}
                      />

                      <div className="bg-white/90 rounded-2xl p-3.5 border border-[#232B26]/[0.06] space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-oriental-serif font-bold ${
                              isCompleted || isCurrent ? 'text-[#1E2420]' : 'text-[#878073]'
                            }`}
                          >
                            {evt.stageName} · {evt.title}
                          </span>

                          {/* Oriental Seal */}
                          <span className="text-[9px] font-oriental-serif text-[#A3382D] border border-[#A3382D]/25 bg-[#FAF1EE] px-2 py-0.5 rounded-xs shrink-0 select-none leading-none whitespace-nowrap">
                            {evt.sealLabel}
                          </span>
                        </div>

                        {/* Metadata: Date, Handler & Location */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#847D6F] font-mono">
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{evt.date}</span>
                          </span>
                          <span className="whitespace-nowrap">经办：{evt.handler}</span>
                          {evt.location && (
                            <span className="flex items-center gap-0.5 whitespace-nowrap">
                              <MapPin className="w-2.5 h-2.5 text-[#8F733E]" />
                              <span>{evt.location}</span>
                            </span>
                          )}
                        </div>

                        {/* Narrative Description */}
                        <p className="text-[11px] text-[#554F44] font-light leading-relaxed cjk-body">
                          {evt.detail}
                        </p>

                        {/* Metric Tag if present */}
                        {evt.metric && (
                          <div className="pt-1.5 flex items-center justify-between border-t border-[#F2ECE0] text-[10px] gap-2">
                            <span className="text-[#898274] truncate">{evt.metric.label}</span>
                            <span className="font-mono font-medium text-[#232B26] bg-[#F2EDE1] px-2 py-0.5 rounded border border-[#232B26]/[0.04] leading-none shrink-0 whitespace-nowrap">
                              {evt.metric.value}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Affinity Stories & Minimalist Story Input Box */}
          {activeTab === 'stories' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#787163] font-oriental-serif flex items-center gap-1">
                  <Feather className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>名物雅趣 · 历任席主心境题记</span>
                </span>

                <button
                  type="button"
                  onClick={() => setShowStoryInput(!showStoryInput)}
                  className="px-2.5 py-1 rounded-lg bg-[#232B26] hover:bg-black text-[#E8DFC9] text-[11px] font-oriental-serif flex items-center gap-1 transition-colors"
                >
                  <Feather className="w-3 h-3" />
                  <span>{showStoryInput ? '收起输入' : '撰写结缘故事'}</span>
                </button>
              </div>

              {/* Minimalist Story Input Box */}
              {showStoryInput && (
                <form
                  onSubmit={handleSubmitStory}
                  className="p-3.5 rounded-2xl bg-white border border-[#DCD3BE] shadow-xs space-y-2.5 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-oriental-serif font-bold text-[#232B26] flex items-center gap-1.5">
                      <span>题赠雅趣 · 结缘随笔</span>
                      <span className="text-[10px] text-[#8F733E] font-normal">
                        （流转新席主可永久查阅）
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-[#8C8577]">
                      署名：{authorName}
                    </span>
                  </div>

                  {/* Oriental Mood Tag Selector */}
                  <div className="flex flex-wrap gap-1.5">
                    {AFFINITY_STORY_TAGS.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`text-[10px] font-oriental-serif px-2 py-0.5 rounded-md border transition-all ${
                          selectedTag === tag
                            ? 'bg-[#232B26] text-[#FAF8F5] border-[#232B26]'
                            : 'bg-[#F7F3EB] text-[#6E6759] border-[#E3D9C4] hover:border-[#8F733E]'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  {/* Story Textarea */}
                  <textarea
                    rows={3}
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    placeholder="记昔年偶得此器，三载沸泉试茗，包浆渐润；写下它随您度过的茶席光阴，或给下任席主的寄语..."
                    className="w-full text-xs font-oriental-serif p-2.5 rounded-xl border border-[#DDD4C0] bg-[#FAF8F5] text-[#222824] placeholder-[#A49D90] focus:outline-hidden focus:border-[#232B26] focus:ring-1 focus:ring-[#232B26] resize-none leading-relaxed"
                  />

                  {/* Bottom bar with author input & submit button */}
                  <div className="flex items-center justify-between pt-1">
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="署名称谓 (如: 席主林客)"
                      className="text-[11px] font-oriental-serif px-2 py-1 rounded-lg border border-[#DDD4C0] bg-[#FAF8F5] text-[#232B26] w-32 focus:outline-hidden focus:border-[#232B26]"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowStoryInput(false)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-oriental-serif text-[#787163] hover:bg-black/5"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        disabled={!storyContent.trim()}
                        className="px-3 py-1 rounded-lg bg-[#8F733E] hover:bg-[#785E2F] disabled:opacity-40 text-white text-[11px] font-oriental-serif font-medium flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>题记入档 · 铭刻结缘</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Story Cards List */}
              <div className="space-y-2.5">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="p-3.5 rounded-2xl bg-white/90 border border-[#232B26]/[0.06] space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-oriental-serif text-[#A3382D] border border-[#A3382D]/25 bg-[#FAF1EE] px-2 py-0.5 rounded-xs select-none leading-none whitespace-nowrap shrink-0">
                          #{story.tag}
                        </span>
                        <span className="text-xs font-oriental-serif font-bold text-[#232B26]">
                          {story.author}
                        </span>
                        <span className="text-[10px] text-[#8C8578] font-mono">
                          ({story.authorRole})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#8C8578]">
                        <span>{story.date}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleLike(story.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            likedStories[story.id]
                              ? 'text-[#A3382D] font-bold'
                              : 'text-[#8C8578] hover:text-[#A3382D]'
                          }`}
                          title="点赞共鸣"
                        >
                          <Heart
                            className={`w-3 h-3 ${
                              likedStories[story.id] ? 'fill-[#A3382D]' : ''
                            }`}
                          />
                          <span>{story.likesCount}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#4A443A] font-oriental-serif font-light leading-relaxed pl-3 border-l border-[#8F733E]/30 italic cjk-body">
                      「{story.content}」
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Hint */}
          <div className="pt-1 text-[10px] text-[#8A8375] font-oriental-serif flex items-center justify-between gap-2">
            <span className="min-w-0 truncate">※ 实物仓储温湿记录与雅趣故事实时链上存证，支持随时预约驻地开汤品鉴。</span>
            <span className="text-[#8F733E] font-medium font-mono whitespace-nowrap shrink-0">春城嘉叶鉴藏院</span>
          </div>
        </div>
      )}
    </div>
  );
};
