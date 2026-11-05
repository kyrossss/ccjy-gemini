import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Check,
  Download,
  Sparkles,
  RefreshCw,
  Palette,
  Feather,
  MessageCircle,
} from 'lucide-react';
import {
  TeaProfileResult,
  TEA_MOOD_THEMES,
  TeaMoodPoetryTheme,
  TeaWhisperPosterData,
  generateCuratedTeaWhisperPoster,
  calculateRadarCoordinates,
} from '../utils/teaProfileLogic';
import { POSTER_THEMES, PosterTheme } from '../utils/posterLogic';
import { TeaProfileRadar } from './TeaProfileRadar';
import { zenAudio } from '../utils/audioZen';

interface TeaShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeaProfileResult;
  userName?: string;
  userTierTitle?: string;
}

export const TeaShareCardModal: React.FC<TeaShareCardModalProps> = ({
  isOpen,
  onClose,
  profile,
  userName = '林清羽',
  userTierTitle = '掌席茶人 · MASTER',
}) => {
  const [selectedMood, setSelectedMood] = useState<TeaMoodPoetryTheme>('pine-mist');
  const [currentPaperTheme, setCurrentPaperTheme] = useState<PosterTheme>(POSTER_THEMES[1]); // Default Xuan paper
  const [whisperData, setWhisperData] = useState<TeaWhisperPosterData>(() =>
    generateCuratedTeaWhisperPoster(profile, 'pine-mist', userName, userTierTitle)
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [synthesizedImgUrl, setSynthesizedImgUrl] = useState<string | null>(null);
  const [showWechatMomentsPreview, setShowWechatMomentsPreview] = useState(false);

  // Sync poster data whenever profile or selectedMood changes
  useEffect(() => {
    if (!isOpen) return;
    const curated = generateCuratedTeaWhisperPoster(
      profile,
      selectedMood,
      userName,
      userTierTitle
    );
    setWhisperData(curated);
    setSynthesizedImgUrl(null);
  }, [isOpen, profile, selectedMood, userName, userTierTitle]);

  if (!isOpen) return null;

  const topTea = profile.recommendedTeas[0];

  // Request AI-tailored mood poetry from backend with instant fallback
  const handleGenerateAIMoodPoetry = async (targetMood: TeaMoodPoetryTheme = selectedMood) => {
    zenAudio.playZenChime();
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/tea-profile/whisper-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          moodId: targetMood,
          userName,
          userTierTitle,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setWhisperData(json.data);
          setIsGeneratingAI(false);
          return;
        }
      }
      setWhisperData(
        generateCuratedTeaWhisperPoster(profile, targetMood, userName, userTierTitle)
      );
    } catch {
      setWhisperData(
        generateCuratedTeaWhisperPoster(profile, targetMood, userName, userTierTitle)
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSelectMood = (moodId: TeaMoodPoetryTheme) => {
    zenAudio.playZenChime();
    setSelectedMood(moodId);
    handleGenerateAIMoodPoetry(moodId);
  };

  // Synthesize High-Resolution 750x1380 PNG Poster with 5D Polygon Radar & AI Mood Poem
  const renderHighResPosterCanvas = (): string | null => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = 750;
    const height = 1380;
    canvas.width = width;
    canvas.height = height;

    const isDark = currentPaperTheme.id !== 'xuan';

    // 1. Oriental Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (currentPaperTheme.id === 'ink') {
      bgGrad.addColorStop(0, '#151E19');
      bgGrad.addColorStop(0.5, '#1D2822');
      bgGrad.addColorStop(1, '#111714');
    } else if (currentPaperTheme.id === 'gold') {
      bgGrad.addColorStop(0, '#2B2218');
      bgGrad.addColorStop(0.5, '#372C1F');
      bgGrad.addColorStop(1, '#201912');
    } else {
      bgGrad.addColorStop(0, '#FAF8F2');
      bgGrad.addColorStop(0.5, '#F4EEE2');
      bgGrad.addColorStop(1, '#EDE4D3');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Double Border Frame
    ctx.strokeStyle = isDark ? '#4A5B4E' : '#D5C7AA';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.strokeRect(38, 38, width - 76, height - 76);

    // 3. Top Brand Header & Vermilion Seal
    ctx.textAlign = 'center';
    ctx.fillStyle = isDark ? '#D8C496' : '#8F733E';
    ctx.font = 'bold 18px "Songti SC", "Noto Serif SC", serif';
    ctx.fillText('春 城 嘉 叶 · 雅 致 茶 语 海 报', width / 2, 82);

    ctx.font = '12px "Courier New", monospace';
    ctx.fillStyle = isDark ? '#A39B8B' : '#867E70';
    ctx.fillText('CHUN CHENG JIA YE · 5D PALATE RADAR & MOOD POETRY', width / 2, 106);

    // Vermilion Seal Stamp
    ctx.strokeStyle = '#AF3828';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(width - 116, 58, 56, 56);
    ctx.fillStyle = '#AF3828';
    ctx.font = 'bold 15px "Songti SC", serif';
    const sealTop = whisperData.sealText.slice(0, 2);
    const sealBot = whisperData.sealText.slice(2, 4);
    ctx.fillText(sealTop, width - 88, 83);
    ctx.fillText(sealBot, width - 88, 103);

    // 4. User Persona & Poetic Title
    ctx.fillStyle = isDark ? '#FAF8F5' : '#1E2320';
    ctx.font = 'bold 30px "Songti SC", "Noto Serif SC", serif';
    ctx.fillText(`${profile.characterTitle}`, width / 2, 162);

    ctx.fillStyle = isDark ? '#D8C496' : '#8F733E';
    ctx.font = '15px "PingFang SC", sans-serif';
    ctx.fillText(`席主：${userName}（${userTierTitle}） · ${whisperData.poeticTitle}`, width / 2, 194);

    // 5. AI Mood Poetry Box (心境诗词)
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF';
    ctx.fillRect(60, 220, width - 120, 200);
    ctx.strokeStyle = isDark ? '#3A4A3E' : '#E2D8C3';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 220, width - 120, 200);

    ctx.fillStyle = isDark ? '#E8DFC9' : '#2C261E';
    ctx.font = '22px "Songti SC", "Noto Serif SC", serif';
    whisperData.moodPoem.forEach((line, idx) => {
      ctx.fillText(line, width / 2, 264 + idx * 32);
    });

    ctx.font = 'italic 13px "Songti SC", serif';
    ctx.fillStyle = isDark ? '#B7B0A2' : '#6E6658';
    ctx.fillText(whisperData.moodReflection.slice(0, 40), width / 2, 400);

    // 6. 5-Axis Radar Chart Polygon Synthesis (五维茶性雷达图)
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.22)' : '#FFFFFF';
    ctx.fillRect(60, 444, width - 120, 490);
    ctx.strokeStyle = isDark ? '#3A4A3E' : '#E2D8C3';
    ctx.strokeRect(60, 444, width - 120, 490);

    ctx.fillStyle = isDark ? '#D8C496' : '#8F733E';
    ctx.font = 'bold 17px "Songti SC", serif';
    ctx.fillText('东方工夫茶 · 五维茶性图谱', width / 2, 480);

    const radarCenter = { x: width / 2, y: 675 };
    const radarRadius = 130;
    const radarCoord = calculateRadarCoordinates(profile.radar, radarCenter, radarRadius);

    // Draw 4 concentric pentagon rings
    [0.25, 0.5, 0.75, 1].forEach((level) => {
      ctx.beginPath();
      radarCoord.axisPoints.forEach((_, idx) => {
        const angle = -Math.PI / 2 + idx * ((Math.PI * 2) / 5);
        const px = radarCenter.x + radarRadius * level * Math.cos(angle);
        const py = radarCenter.y + radarRadius * level * Math.sin(angle);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.strokeStyle = isDark ? 'rgba(216,196,150,0.2)' : '#E5DEC9';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw axis spokes
    radarCoord.axisPoints.forEach((pt) => {
      ctx.beginPath();
      ctx.moveTo(radarCenter.x, radarCenter.y);
      ctx.lineTo(pt.axisEnd.x, pt.axisEnd.y);
      ctx.strokeStyle = isDark ? 'rgba(216,196,150,0.25)' : '#DED5C0';
      ctx.stroke();
    });

    // Draw user's 5D data polygon
    ctx.beginPath();
    radarCoord.axisPoints.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.dataPoint.x, pt.dataPoint.y);
      else ctx.lineTo(pt.dataPoint.x, pt.dataPoint.y);
    });
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(216, 196, 150, 0.28)' : 'rgba(44, 95, 63, 0.20)';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#D8C496' : '#2C5F3F';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw vertices and axis labels
    radarCoord.axisPoints.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.dataPoint.x, pt.dataPoint.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#D8C496' : '#8F733E';
      ctx.fill();

      const angle = -Math.PI / 2 + idx * ((Math.PI * 2) / 5);
      const labelDist = radarRadius + 34;
      const lx = radarCenter.x + labelDist * Math.cos(angle);
      const ly = radarCenter.y + labelDist * Math.sin(angle);

      ctx.font = 'bold 14px "Songti SC", serif';
      ctx.fillStyle = isDark ? '#FAF8F5' : '#232B26';
      ctx.fillText(`${pt.label} ${pt.value}`, lx, ly);
    });

    // Draw active palate tags row inside radar card
    const tagsLine = profile.recentTastingTags
      .slice(0, 6)
      .map((t) => `#${t}`)
      .join('   ');
    ctx.font = '14px "Songti SC", serif';
    ctx.fillStyle = isDark ? '#D8C496' : '#7A6234';
    ctx.fillText(tagsLine, width / 2, 902);

    // 7. Recommended Rare Tea & Philosophy Box
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF';
    ctx.fillRect(60, 956, width - 120, 150);
    ctx.strokeStyle = isDark ? '#3A4A3E' : '#E2D8C3';
    ctx.strokeRect(60, 956, width - 120, 150);

    ctx.textAlign = 'left';
    ctx.fillStyle = isDark ? '#D8C496' : '#8F733E';
    ctx.font = 'bold 15px "Songti SC", serif';
    ctx.fillText(
      `✦ AI 寻味契合名枞：${topTea ? `${topTea.name}（契合度 ${topTea.matchScore}%）` : '武夷正岩老枞'}`,
      88,
      992
    );

    ctx.fillStyle = isDark ? '#CFC8B8' : '#4E473B';
    ctx.font = '14px "PingFang SC", sans-serif';
    ctx.fillText(profile.philosophy.slice(0, 36), 88, 1030);
    ctx.fillText(profile.philosophy.slice(36, 72), 88, 1056);
    ctx.fillText(`茶席雅训：${profile.tastingAdvice.slice(0, 32)}...`, 88, 1084);

    // 8. Bottom WeChat Mini Program Share Footer
    ctx.fillStyle = isDark ? '#141C17' : '#FFFFFF';
    ctx.fillRect(60, 1130, width - 120, 150);
    ctx.strokeStyle = isDark ? '#3A4A3E' : '#DCD2BF';
    ctx.strokeRect(60, 1130, width - 120, 150);

    ctx.fillStyle = isDark ? '#FAF8F5' : '#1E2320';
    ctx.font = 'bold 18px "Songti SC", serif';
    ctx.fillText('春城嘉叶 · 一叶有来处，一器有分寸', 88, 1175);

    ctx.fillStyle = isDark ? '#A8A092' : '#756E61';
    ctx.font = '13px "PingFang SC", sans-serif';
    ctx.fillText('微信扫码进入「春城嘉叶」小程序，测算您的五维茶性图谱', 88, 1208);
    ctx.fillText('深圳市南山区留仙大道4088号博林天瑞花园 · 13825293242', 88, 1236);

    // QR Code Seal Box
    ctx.fillStyle = isDark ? '#FAF8F5' : '#232B26';
    ctx.fillRect(width - 170, 1152, 84, 84);
    ctx.fillStyle = isDark ? '#232B26' : '#FAF8F5';
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('春城嘉叶', width - 128, 1190);
    ctx.fillText('茶性图谱', width - 128, 1212);

    ctx.fillStyle = isDark ? '#8A8275' : '#8F897D';
    ctx.font = '12px "Courier New", monospace';
    ctx.fillText('WWW.CHUNCHENGJIAYE.COM · ORIENTAL TEA ARCHIVE', width / 2, 1322);

    return canvas.toDataURL('image/png');
  };

  const handleSavePosterImage = () => {
    setIsDownloading(true);
    zenAudio.playZenChime();

    const dataUrl = renderHighResPosterCanvas();
    if (dataUrl) {
      setSynthesizedImgUrl(dataUrl);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `chuncheng_tea_whisper_${userName}_${selectedMood}.png`;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }
    setIsDownloading(false);
  };

  const handleShareToWechatCircle = async () => {
    zenAudio.playZenChime();
    const dataUrl = synthesizedImgUrl || renderHighResPosterCanvas();
    if (dataUrl && !synthesizedImgUrl) {
      setSynthesizedImgUrl(dataUrl);
    }

    navigator.clipboard?.writeText(whisperData.wechatShareCaption).catch(() => {});
    setCopied(true);
    setShowWechatMomentsPreview(true);
    setTimeout(() => setCopied(false), 3500);

    // Also invoke native Web Share API if available on mobile browser
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `春城嘉叶 · ${userName}的雅致茶语海报`,
          text: whisperData.wechatShareCaption,
        });
      } catch {
        // User dismissed native share sheet; WeChat Moments preview remains open
      }
    }
  };

  const isDarkTheme = currentPaperTheme.id !== 'xuan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F3] rounded-3xl overflow-hidden shadow-2xl border border-[#DCD5C4] flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#ECE5D7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8F733E]" />
            <h3 className="font-oriental-serif text-sm font-bold text-[#1E2320] tracking-wide">
              雅致茶语海报 · 五维图谱合璧
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF5E8] text-[#8F733E] border border-[#E8DFC9]">
              AI 诗画合成
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F3EFE7] hover:bg-[#EAE4D8] text-[#554E41] flex items-center justify-center transition-colors"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mood Selector & Paper Theme Bar */}
        <div className="px-4 py-2.5 bg-[#FAF6EE] border-b border-[#E8DFC8] space-y-2 shrink-0">
          {/* Row 1: 4 Poetic Moods + AI Poem Regenerate */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <Feather className="w-3.5 h-3.5 text-[#8F733E] shrink-0 mr-0.5" />
              {TEA_MOOD_THEMES.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleSelectMood(m.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-oriental-serif whitespace-nowrap transition-all ${
                    selectedMood === m.id
                      ? 'bg-[#232B26] text-white font-bold shadow-2xs'
                      : 'bg-white/80 text-[#645C4F] border border-[#E2D9C5] hover:border-[#232B26]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleGenerateAIMoodPoetry(selectedMood)}
              disabled={isGeneratingAI}
              className="px-2 py-1 rounded-lg bg-[#8F733E]/15 hover:bg-[#8F733E]/25 text-[#8F733E] text-[11px] font-oriental-serif font-bold flex items-center gap-1 shrink-0 transition-colors disabled:opacity-50"
              title="AI 依据五维茶性重新赋诗"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>AI 赋诗</span>
            </button>
          </div>

          {/* Row 2: Paper Background Theme Switcher */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#8F733E]" />
              <span className="text-[#6D6658] font-oriental-serif">海报笺纸：</span>
              <div className="flex items-center gap-1">
                {POSTER_THEMES.map((th) => (
                  <button
                    type="button"
                    key={th.id}
                    onClick={() => {
                      zenAudio.playZenChime();
                      setCurrentPaperTheme(th);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-oriental-serif transition-all ${
                      currentPaperTheme.id === th.id
                        ? 'bg-[#8F733E] text-white font-bold'
                        : 'text-[#6B6456] hover:bg-white/80'
                    }`}
                  >
                    {th.name}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#8A8274]">
              主轴：{whisperData.dominantDimension.label} {whisperData.dominantDimension.score}分
            </span>
          </div>
        </div>

        {/* Scrollable Synthesized Poster Canvas Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 select-none bg-[#EFEBE1] no-scrollbar">
          {/* Interactive WeChat Moments Share Simulation Card (When triggered) */}
          {showWechatMomentsPreview && (
            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2F6740] shadow-md space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-oriental-serif font-bold text-[#2F6740]">
                  <MessageCircle className="w-4 h-4" />
                  <span>微信朋友圈 · 茶语分享预览（配文已复制）</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWechatMomentsPreview(false)}
                  className="text-[10px] text-[#7D7567] hover:underline"
                >
                  收起
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#DCE8DF] text-[11px] text-[#2B332E] space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#232B26] text-[#E4D1A0] font-oriental-serif text-xs font-bold flex items-center justify-center">
                    {userName.slice(0, 1)}
                  </div>
                  <span className="font-bold font-oriental-serif text-xs">{userName}</span>
                  <span className="text-[9px] text-[#7E8780] font-mono">刚刚 · 深圳南山</span>
                </div>
                <p className="text-[11px] font-oriental-serif text-[#37403A] whitespace-pre-line leading-relaxed">
                  {whisperData.wechatShareCaption}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#2F6740]">
                <span>✦ 茶语配文已复制到剪贴板，保存海报图片即可发圈</span>
                <button
                  type="button"
                  onClick={handleSavePosterImage}
                  className="px-2.5 py-1 rounded-lg bg-[#2F6740] text-white font-oriental-serif font-bold"
                >
                  立即保存配图
                </button>
              </div>
            </div>
          )}

          {/* Synthesized Oriental Tea Whisper Poster Card */}
          <div
            className={`rounded-3xl p-5 shadow-xl border relative transition-all duration-300 space-y-4 ${
              currentPaperTheme.id === 'ink'
                ? 'bg-gradient-to-b from-[#151D18] via-[#1C2621] to-[#111713] text-[#FAF8F5] border-[#394B3F]'
                : currentPaperTheme.id === 'gold'
                ? 'bg-gradient-to-b from-[#2C2319] via-[#382D20] to-[#211A12] text-[#FDFBF7] border-[#544633]'
                : 'bg-gradient-to-b from-[#FAF8F2] via-[#F4EEE2] to-[#EDE4D3] text-[#1F2522] border-[#D8C7A5]'
            }`}
          >
            {/* Brand Header & Traditional Vermilion Seal */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-oriental-serif text-[11px] tracking-[0.22em] font-bold"
                    style={{ color: currentPaperTheme.accentColor }}
                  >
                    春城嘉叶 · 席主茶语笺
                  </span>
                </div>
                <span className="text-[9px] font-mono opacity-65 uppercase block mt-0.5">
                  5D PALATE RADAR & AI MOOD VERSE
                </span>
              </div>

              {/* Vermilion Seal Stamp */}
              <div className="w-11 h-11 border-2 border-[#AF3828] text-[#AF3828] rounded-sm flex flex-col items-center justify-center rotate-3 opacity-90 select-none bg-[#AF3828]/5">
                <span className="font-oriental-serif text-[9px] leading-tight font-bold">
                  {whisperData.sealText.slice(0, 2)}
                </span>
                <span className="font-oriental-serif text-[9px] leading-tight font-bold">
                  {whisperData.sealText.slice(2, 4)}
                </span>
              </div>
            </div>

            {/* User Persona & Mood Title */}
            <div className="text-center space-y-1 pt-1">
              <span className="text-[10px] font-mono opacity-75 block">
                席主：{userName} · {userTierTitle}
              </span>
              <h2 className="font-oriental-serif text-xl sm:text-2xl font-bold tracking-widest">
                {profile.characterTitle}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8F733E]/20 border border-[#8F733E]/40 text-xs font-oriental-serif">
                <Sparkles className="w-3 h-3 text-[#D8C496]" />
                <span>{whisperData.poeticTitle}</span>
              </div>
            </div>

            {/* AI Synthesized Mood Poetry Scroll (心情诗词) */}
            <div
              className="p-4 rounded-2xl border text-center space-y-2 relative overflow-hidden"
              style={{
                backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                borderColor: currentPaperTheme.borderColor,
              }}
            >
              <div className="text-[10px] font-mono tracking-widest opacity-65 uppercase">
                {whisperData.moodLabel}
              </div>

              <div className="space-y-1 font-oriental-serif text-sm sm:text-base tracking-widest leading-relaxed py-1">
                {whisperData.moodPoem.map((line, idx) => (
                  <p key={idx} className="font-semibold">
                    {line}
                  </p>
                ))}
              </div>

              <p className="text-[11px] font-oriental-serif italic opacity-85 leading-relaxed pt-2 border-t border-current/10">
                「{whisperData.moodReflection}」
              </p>
            </div>

            {/* Embedded 5-Axis Radar Chart & Palate Tags */}
            <div
              className="rounded-2xl p-3.5 border flex flex-col items-center"
              style={{
                backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.94)' : '#FFFFFF',
                borderColor: currentPaperTheme.borderColor,
                color: '#1F2522',
              }}
            >
              <div className="w-full flex items-center justify-between text-[10px] text-[#787163] mb-1 px-1">
                <span className="font-oriental-serif font-bold text-[#232B26]">
                  五维工夫茶骨图谱
                </span>
                <span className="font-mono text-[#8F733E]">
                  核心：{whisperData.dominantDimension.label} {whisperData.dominantDimension.score}分
                </span>
              </div>

              <TeaProfileRadar radar={profile.radar} size={220} interactive={false} />

              {/* Active Palate Tags */}
              <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                {profile.recentTastingTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#E2DBD0] text-[10px] font-oriental-serif text-[#635C50]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Matched Tea & Official WeChat Mini Program QR Footer */}
            <div
              className="p-3 rounded-2xl border flex items-center justify-between gap-3"
              style={{
                backgroundColor: isDarkTheme ? 'rgba(0,0,0,0.28)' : '#FFFFFF',
                borderColor: currentPaperTheme.borderColor,
              }}
            >
              <div className="space-y-0.5 min-w-0">
                <span
                  className="text-[9px] font-mono tracking-wider uppercase block"
                  style={{ color: currentPaperTheme.accentColor }}
                >
                  CHUN CHENG JIA YE · 寻味知音
                </span>
                <h4 className="font-oriental-serif font-bold text-xs truncate">
                  契合名枞：{topTea ? topTea.name : '武夷正岩老枞'}
                </h4>
                <p className="text-[10px] opacity-75">
                  微信扫码进入「春城嘉叶」小程序，定制您的五维茶性档案
                </p>
              </div>

              <img
                src="https://www.chunchengjiaye.com/images/contact/wechat-mini-program.jpg"
                alt="春城嘉叶小程序码"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-13 h-13 rounded-xl border border-[#DFD6C5] object-cover shrink-0 bg-white p-0.5"
              />
            </div>
          </div>
        </div>

        {/* Status Toast Banners */}
        {downloadSuccess && (
          <div className="px-4 py-2 bg-[#EBF3ED] text-[#285E37] text-xs flex items-center justify-center gap-1.5 border-t border-[#CDE3D3]">
            <Check className="w-4 h-4 text-[#285E37]" />
            <span>高清雅致茶语海报 (PNG) 已生成保存，可直接发至微信朋友圈！</span>
          </div>
        )}

        {copied && !downloadSuccess && (
          <div className="px-4 py-2 bg-[#FAF2E6] text-[#8F733E] text-xs flex items-center justify-center gap-1.5 border-t border-[#E8DCC8]">
            <Check className="w-4 h-4 text-[#8F733E]" />
            <span>茶语诗词与五维图谱配文已复制，快去微信朋友圈分享吧！</span>
          </div>
        )}

        {/* Bottom Action Buttons: Save PNG Poster & Share to WeChat Circle */}
        <div className="p-4 bg-white border-t border-[#ECE5D7] grid grid-cols-2 gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSavePosterImage}
            disabled={isDownloading}
            className="py-2.5 px-3 rounded-2xl bg-[#232B26] hover:bg-black text-white font-oriental-serif text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#E4D1A0]" />
            <span>{isDownloading ? '合成海报中...' : '一键保存海报 (PNG)'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareToWechatCircle}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#2F6740] to-[#234F31] hover:brightness-105 text-white font-oriental-serif text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#E4D1A0]" />
            <span>分享至微信朋友圈</span>
          </button>
        </div>
      </div>
    </div>
  );
};
