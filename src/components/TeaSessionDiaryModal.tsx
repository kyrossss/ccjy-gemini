import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Cpu,
  Feather,
  Compass,
  ArrowRight,
  Send,
  Layers,
  Award,
  Flame,
  Scan,
} from 'lucide-react';
import {
  TeaSessionDiaryEntry,
  AITeaDiaryAnalysisResult,
  TEA_WARE_PRESETS,
  TEA_EXPERIENCE_TAG_SEEDS,
  evaluateTeaDiaryLocally,
  saveTeaDiaryEntry,
} from '../utils/teaDiaryLogic';
import { zenAudio } from '../utils/audioZen';

interface TeaSessionDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    roomName: string;
    date: string;
    timeSlot: string;
    guests: number;
    sommelier: string;
    pairedTea: string;
    finalPrice?: number;
  } | null;
  existingDiary?: TeaSessionDiaryEntry | null;
  onDiarySaved?: (diary: TeaSessionDiaryEntry) => void;
  onOpenTeaProfileDossier?: () => void;
}

export const TeaSessionDiaryModal: React.FC<TeaSessionDiaryModalProps> = ({
  isOpen,
  onClose,
  booking,
  existingDiary,
  onDiarySaved,
  onOpenTeaProfileDossier,
}) => {
  const [teaWare, setTeaWare] = useState('');
  const [teaName, setTeaName] = useState('');
  const [teaExperience, setTeaExperience] = useState('');

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AITeaDiaryAnalysisResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize or reset form when modal opens or booking changes
  useEffect(() => {
    if (!isOpen || !booking) return;

    if (existingDiary) {
      setTeaWare(existingDiary.teaWare);
      setTeaName(existingDiary.teaName);
      setTeaExperience(existingDiary.teaExperience);
      setAnalysisResult({
        extractedTags: existingDiary.extractedTags,
        radarDeltas: existingDiary.radarDeltas,
        terroirSummary: existingDiary.terroirSummary,
        sommelierNote: existingDiary.sommelierNote,
        source: 'curated-expert',
      });
      setIsSaved(true);
    } else {
      // Default to classical setup
      setTeaWare('潮州孟臣款·老梨皮朱泥手拉壶、橄榄炭潮汕红泥小火炉、双描金白瓷公道杯');
      setTeaName(booking.pairedTea || '沉芳·武夷岩茶（正岩）');
      setTeaExperience('');
      setAnalysisResult(null);
      setIsSaved(false);
    }
  }, [isOpen, booking, existingDiary]);

  if (!isOpen || !booking) return null;

  // AI-Assisted Sensory Interpretation
  const handleRunAiAnalysis = async () => {
    if (!teaExperience.trim() && !teaName.trim()) return;

    setIsAiAnalyzing(true);
    zenAudio.playZenChime();

    try {
      const res = await fetch('/api/tea-diary/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teaWare,
          teaName,
          teaExperience:
            teaExperience.trim() ||
            '炭火初沸蟹眼高冲，前三泡果木香浓郁入汤底，四泡后喉底泛起极清幽的兰花冷香，汤感稠滑如稠米汤，两颊生津久久不散。',
          roomName: booking.roomName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.analysis) {
          setAnalysisResult(data.analysis);
          setIsAiAnalyzing(false);
          return;
        }
      }
    } catch (e) {
      console.warn('AI diary analysis API failed, using fallback:', e);
    }

    const fallback = evaluateTeaDiaryLocally(
      teaWare,
      teaName,
      teaExperience || '炭火初沸高冲，岩骨花香入汤底，回甘生津迅疾。'
    );
    setAnalysisResult(fallback);
    setIsAiAnalyzing(false);
  };

  // Save diary and complete closed loop to personal terroir profile
  const handleSaveDiary = () => {
    zenAudio.playZenChime();

    const analysis =
      analysisResult ||
      evaluateTeaDiaryLocally(teaWare, teaName, teaExperience || '汤水清甜，回甘生津。');

    const newDiary: TeaSessionDiaryEntry = {
      id: existingDiary?.id || `diary-${Date.now()}`,
      bookingId: booking.id,
      roomName: booking.roomName,
      date: booking.date,
      timeSlot: booking.timeSlot,
      sommelier: booking.sommelier,
      teaWare: teaWare.trim() || '春城嘉叶宋韵茶器',
      teaName: teaName.trim() || booking.pairedTea,
      teaExperience: teaExperience.trim() || '初泡果木香高扬，喉底生津如泉，岩骨铮铮。',
      createdAt: `${booking.date} ${new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      extractedTags: analysis.extractedTags,
      radarDeltas: analysis.radarDeltas,
      terroirSummary: analysis.terroirSummary,
      sommelierNote: analysis.sommelierNote,
      syncedToTerroirProfile: true,
    };

    saveTeaDiaryEntry(newDiary);
    setIsSaved(true);
    onDiarySaved?.(newDiary);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#E4DEC9] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ECE7DD] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#232B26] text-[#EEDB9F] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <h3 className="font-oriental-serif text-base font-bold text-[#1E2320] whitespace-nowrap">
                  雅席茶事日记 · 风土存证
                </h3>
                <span className="text-[9px] font-mono bg-[#EBF3ED] text-[#2F6740] px-2 py-0.5 rounded border border-[#2F6740]/20 leading-none whitespace-nowrap shrink-0">
                  预约-品鉴-存档 闭环
                </span>
              </div>
              <p className="text-[10px] text-[#817A6C] font-mono whitespace-nowrap truncate">
                {booking.roomName} · {booking.date} · 掌席 {booking.sommelier}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 text-[#5A544A] shrink-0"
            aria-label="关闭茶事日记"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Closed Loop Concept Pill */}
          <div className="p-3 rounded-2xl bg-[#F4F0E6] border border-[#DDD5C2] flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 min-w-0">
              <span className="font-oriental-serif font-bold text-[#232B26] block cjk-title">
                席位已圆满结约 · 铭刻今日茶席心境
              </span>
              <p className="text-[10px] text-[#6E6759] font-light cjk-body leading-relaxed">
                记录器、茶、感，AI将自动研磨五维雷达并沉淀为您的「个人风土档案」。
              </p>
            </div>
            <span className="text-xl select-none text-[#8F733E] shrink-0">❧</span>
          </div>

          {/* Form Fields: 茶器、茶品、茶感 */}
          <div className="space-y-3">
            {/* 1. 茶器 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-oriental-serif font-bold text-[#29322D] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E]" />
                  <span>席上茶器 (器物选配)</span>
                </label>
                <span className="text-[10px] text-[#8C8578]">点选快捷器物：</span>
              </div>

              {/* Quick tea ware pills */}
              <div className="flex flex-wrap gap-1.5">
                {TEA_WARE_PRESETS.slice(0, 4).map((ware) => (
                  <button
                    type="button"
                    key={ware}
                    onClick={() => {
                      if (!teaWare.includes(ware)) {
                        setTeaWare(teaWare ? `${teaWare}、${ware}` : ware);
                      }
                    }}
                    className="text-[10px] font-oriental-serif px-2.5 py-1 rounded-lg bg-white border border-[#232B26]/10 text-[#5A5346] hover:border-[#232B26] hover:bg-[#FAF6EC] transition-all leading-none whitespace-nowrap shrink-0"
                  >
                    + {ware.split('·')[0]}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={teaWare}
                onChange={(e) => setTeaWare(e.target.value)}
                placeholder="例如：潮州孟臣老朱泥手拉壶、橄榄炭红泥火炉、双描金白瓷公道杯"
                className="w-full text-xs font-oriental-serif p-3 rounded-xl border border-[#232B26]/15 bg-white text-[#202723] focus:outline-none focus:border-[#232B26]"
              />
            </div>

            {/* 2. 茶品 */}
            <div className="space-y-1.5">
              <label className="font-oriental-serif font-bold text-xs text-[#29322D] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E]" />
                <span>品鉴茶品 (名山原叶)</span>
              </label>
              <input
                type="text"
                value={teaName}
                onChange={(e) => setTeaName(e.target.value)}
                placeholder="例如：沉芳·武夷岩茶（正岩）/ 水龙吟·正岩肉桂"
                className="w-full text-xs font-oriental-serif p-3 rounded-xl border border-[#232B26]/15 bg-white text-[#202723] focus:outline-none focus:border-[#232B26]"
              />
            </div>

            {/* 3. 茶感 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-oriental-serif font-bold text-[#29322D] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8F733E]" />
                  <span>茶感随笔 (香气·汤感·喉韵)</span>
                </label>
                <span className="text-[10px] text-[#8C8578]">点选感官种子词：</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {TEA_EXPERIENCE_TAG_SEEDS.map((seed) => (
                  <button
                    type="button"
                    key={seed}
                    onClick={() => {
                      if (!teaExperience.includes(seed)) {
                        setTeaExperience(teaExperience ? `${teaExperience}，${seed}` : seed);
                      }
                    }}
                    className="text-[10px] font-oriental-serif px-2.5 py-1 rounded-md bg-[#FAF6EC] border border-[#8F733E]/20 text-[#786638] hover:bg-[#232B26] hover:text-white transition-colors leading-none whitespace-nowrap shrink-0"
                  >
                    #{seed}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={teaExperience}
                onChange={(e) => setTeaExperience(e.target.value)}
                placeholder="记述今日冲瀹体感：炭火候汤蟹眼初沸，前三泡荔枝炭熟香沉入茶汤，中段喉底生津如鸣泉，冷杯留香持久不散..."
                className="w-full text-xs font-oriental-serif p-3 rounded-xl border border-[#232B26]/15 bg-white text-[#202723] focus:outline-none focus:border-[#232B26] resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* AI-Assisted Interpretation Trigger */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isAiAnalyzing}
              onClick={handleRunAiAnalysis}
              className="w-full py-2.5 px-3 rounded-xl bg-[#232B26] hover:bg-black text-[#FAF8F5] text-xs font-oriental-serif font-medium flex items-center justify-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 text-center whitespace-nowrap"
            >
              {isAiAnalyzing ? (
                <>
                  <Scan className="w-3.5 h-3.5 animate-spin text-[#EEDB9F] shrink-0" />
                  <span className="whitespace-nowrap">AI 宗师正在解析茶感风土与五维雷达...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-[#EEDB9F] shrink-0" />
                  <span className="whitespace-nowrap">AI 智能研磨品评 · 提取风土标签与五维增量</span>
                </>
              )}
            </button>
          </div>

          {/* AI Analysis Result & Radar Impact Output */}
          {analysisResult && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#DDD3BC] space-y-3 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-1.5 gap-2">
                <span className="font-oriental-serif font-bold text-xs text-[#232B26] flex items-center gap-1.5 whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6740] shrink-0" />
                  <span>风土感官解析 · 沉淀标签</span>
                </span>
                <span className="text-[10px] font-mono text-[#8F733E] whitespace-nowrap shrink-0">
                  已锚定个人风土五维
                </span>
              </div>

              {/* Extracted Tags */}
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.extractedTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-oriental-serif px-2.5 py-1 rounded-md bg-[#FAF1EE] text-[#A3382D] border border-[#A3382D]/25 whitespace-nowrap shrink-0 leading-none"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Radar Delta Progression Bars */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#232B26]/[0.06] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-oriental-serif text-[#6D6555]">
                  <span className="whitespace-nowrap">对个人风土雷达的增量赋能：</span>
                  <span className="text-[10px] font-mono text-[#2F6740] whitespace-nowrap">动态反哺演进</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
                  <div className="p-1.5 rounded-lg bg-white border border-[#232B26]/[0.06]">
                    <span className="text-[#847D70] block whitespace-nowrap text-[9px]">焙火</span>
                    <strong className="text-[#8F733E]">+{analysisResult.radarDeltas.roast}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-[#232B26]/[0.06]">
                    <span className="text-[#847D70] block whitespace-nowrap text-[9px]">香气</span>
                    <strong className="text-[#8F733E]">+{analysisResult.radarDeltas.aroma}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-[#232B26]/[0.06]">
                    <span className="text-[#847D70] block whitespace-nowrap text-[9px]">回甘</span>
                    <strong className="text-[#8F733E]">+{analysisResult.radarDeltas.sweetness}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-[#232B26]/[0.06]">
                    <span className="text-[#847D70] block whitespace-nowrap text-[9px]">稠厚</span>
                    <strong className="text-[#8F733E]">+{analysisResult.radarDeltas.mouthfeel}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-[#232B26]/[0.06]">
                    <span className="text-[#847D70] block whitespace-nowrap text-[9px]">喉韵</span>
                    <strong className="text-[#8F733E]">+{analysisResult.radarDeltas.throatCharm}</strong>
                  </div>
                </div>
              </div>

              {/* Terroir & Sommelier commentary */}
              <div className="space-y-1.5 text-xs">
                <p className="text-[11px] text-[#4A4337] font-oriental-serif leading-relaxed italic bg-[#F7F3EA] p-3 rounded-xl border border-[#8F733E]/10 cjk-body">
                  「{analysisResult.terroirSummary}」
                </p>
                <div className="text-[10px] text-[#867E70] flex items-center justify-between font-mono pt-0.5 gap-2">
                  <span className="min-w-0 truncate">掌席题记：{analysisResult.sommelierNote}</span>
                  <span className="text-[#A3382D] font-oriental-serif border border-[#A3382D]/25 px-2 py-0.5 rounded-xs select-none whitespace-nowrap shrink-0 leading-none">
                    嘉叶存证
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleSaveDiary}
              className="w-full h-11 px-3 rounded-xl bg-[#8F733E] hover:bg-[#785E2F] text-white font-oriental-serif text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm text-center whitespace-nowrap"
            >
              <Award className="w-4 h-4 text-[#FFF2D6] shrink-0" />
              <span className="truncate">
                {isSaved
                  ? '✓ 茶事日记已封存 · 归档入个人风土档案'
                  : '封存茶事日记 · 归档入个人风土档案'}
              </span>
            </button>

            {isSaved && onOpenTeaProfileDossier && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTeaProfileDossier();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF6EC] border border-[#D5CABB] text-[#222824] text-xs font-oriental-serif flex items-center justify-center gap-1.5 transition-colors text-center whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 text-[#8F733E] shrink-0" />
                <span>前往「个人风土档案」查验雷达演变</span>
                <ArrowRight className="w-3 h-3 text-[#8F733E] shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
