import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Image as ImageIcon,
  Share2,
  Calendar,
  Clock,
  User,
  Coffee,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { BookingInvitationData } from './TeaInvitationModal';
import {
  POSTER_THEMES,
  PosterTheme,
  SalonPosterSynthesisData,
  generateCuratedPosterData,
} from '../utils/posterLogic';
import { zenAudio } from '../utils/audioZen';

interface SalonInvitationPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingInvitationData | null;
  roomImage?: string;
}

export const SalonInvitationPosterModal: React.FC<SalonInvitationPosterModalProps> = ({
  isOpen,
  onClose,
  booking,
  roomImage = '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
}) => {
  const [currentTheme, setCurrentTheme] = useState<PosterTheme>(POSTER_THEMES[0]);
  const [posterData, setPosterData] = useState<SalonPosterSynthesisData | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize poster data when modal opens
  useEffect(() => {
    if (!isOpen || !booking) return;

    // Set curated default
    const initialData = generateCuratedPosterData(booking, currentTheme.id);
    setPosterData(initialData);

    // Call AI to generate custom tailored poetry & sensory graph
    fetchAIPosterData(booking, currentTheme.id);
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const bookingCode = booking.bookingCode || `CCJY-${booking.id.slice(-6).toUpperCase()}`;

  // Fetch AI generated synthesis
  const fetchAIPosterData = async (b: BookingInvitationData, themeId: 'ink' | 'xuan' | 'gold') => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/salon/invitation-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: b, themeId }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setPosterData(json.data);
          setIsLoadingAI(false);
          return;
        }
      }
      setPosterData(generateCuratedPosterData(b, themeId));
    } catch {
      setPosterData(generateCuratedPosterData(b, themeId));
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSwitchTheme = (theme: PosterTheme) => {
    setCurrentTheme(theme);
    zenAudio.playZenChime();
  };

  const handleRegeneratePoem = () => {
    zenAudio.playZenChime();
    fetchAIPosterData(booking, currentTheme.id);
  };

  const handleCopyText = () => {
    zenAudio.playZenChime();
    if (!posterData) return;

    const shareText = [
      `【春城嘉叶 · 雅席邀约】`,
      `${posterData.poeticTitle}`,
      ``,
      ...posterData.invitationVerse,
      ``,
      `席所：${booking.roomName}`,
      `吉日：${booking.date} · ${booking.timeSlot}`,
      `特选开席茶：${booking.pairedTea}`,
      `侍茶师：${booking.sommelier}`,
      `雅席通关凭证：${bookingCode}`,
      `茶舍雅址：春城嘉叶 · 潮州工夫茶舍（深圳市南山区）`,
      ``,
      `「一叶有来处，一器有分寸。烹泉以待，静候雅步。」`,
    ].join('\n');

    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // High-resolution Canvas Render & Download
  const handleDownloadPosterImage = () => {
    if (!posterData) return;
    setIsDownloading(true);
    zenAudio.playZenChime();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // High-res retina canvas dimensions (750 x 1334 standard mobile ratio)
    const width = 750;
    const height = 1334;
    canvas.width = width;
    canvas.height = height;

    // Background Fill
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (currentTheme.id === 'ink') {
      bgGrad.addColorStop(0, '#151D18');
      bgGrad.addColorStop(0.5, '#1C2621');
      bgGrad.addColorStop(1, '#111713');
    } else if (currentTheme.id === 'gold') {
      bgGrad.addColorStop(0, '#2C2319');
      bgGrad.addColorStop(0.5, '#382D20');
      bgGrad.addColorStop(1, '#211A12');
    } else {
      bgGrad.addColorStop(0, '#FAF7EF');
      bgGrad.addColorStop(0.5, '#F3ECE0');
      bgGrad.addColorStop(1, '#ECE2D0');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.strokeStyle = currentTheme.id === 'xuan' ? '#D6C8AA' : '#4E5F52';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, width - 64, height - 64);
    ctx.strokeRect(38, 38, width - 76, height - 76);

    // Top Brand Text
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#8F733E' : '#D8C496';
    ctx.font = 'bold 18px "Songti SC", "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText('春 城 嘉 叶 · 潮 州 工 夫 茶 舍', width / 2, 80);

    ctx.font = '12px "Courier New", monospace';
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#847D70' : '#A8A092';
    ctx.fillText('PRIVATE TEA SANCTUARY · INVITATION POSTER', width / 2, 104);

    // Vermilion Seal
    ctx.strokeStyle = currentTheme.sealColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(width - 120, 60, 56, 56);
    ctx.fillStyle = currentTheme.sealColor;
    ctx.font = 'bold 15px "Songti SC", serif';
    ctx.fillText('春城', width - 92, 85);
    ctx.fillText('雅席', width - 92, 105);

    // Poetic Title
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#1F2522' : '#FAF8F5';
    ctx.font = 'bold 32px "Songti SC", "Noto Serif SC", serif';
    ctx.fillText(posterData.poeticTitle, width / 2, 175);

    // Classical Poetry Box
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#F7F3E9' : '#222D26';
    ctx.fillRect(60, 210, width - 120, 160);
    ctx.strokeStyle = currentTheme.id === 'xuan' ? '#E5DBC7' : '#394B3F';
    ctx.strokeRect(60, 210, width - 120, 160);

    ctx.fillStyle = currentTheme.id === 'xuan' ? '#3B3429' : '#E8DFC9';
    ctx.font = '22px "Songti SC", "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    posterData.invitationVerse.forEach((line, idx) => {
      ctx.fillText(line, width / 2, 255 + idx * 30);
    });

    // Room Info Card
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#FFFFFF' : '#1A231E';
    ctx.fillRect(60, 400, width - 120, 250);
    ctx.strokeStyle = currentTheme.id === 'xuan' ? '#E5DBC7' : '#394B3F';
    ctx.strokeRect(60, 400, width - 120, 250);

    ctx.textAlign = 'left';
    ctx.font = 'bold 22px "Songti SC", serif';
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#1F2522' : '#FAF8F5';
    ctx.fillText(booking.roomName, 90, 445);

    ctx.font = '16px "PingFang SC", sans-serif';
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#6E6759' : '#B8B0A0';
    ctx.fillText(`吉日：${booking.date} · ${booking.timeSlot}`, 90, 490);
    ctx.fillText(`雅客：${booking.guests} 位同行 · 执席：${booking.sommelier}`, 90, 528);
    ctx.fillText(`开席名茶：${booking.pairedTea}`, 90, 566);
    ctx.fillText(`席位凭证：${bookingCode}`, 90, 604);

    // Tea Sensory Radar Section
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#FBF9F4' : '#202A24';
    ctx.fillRect(60, 680, width - 120, 260);
    ctx.strokeStyle = currentTheme.id === 'xuan' ? '#E5DBC7' : '#394B3F';
    ctx.strokeRect(60, 680, width - 120, 260);

    ctx.textAlign = 'center';
    ctx.font = 'bold 18px "Songti SC", serif';
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#8F733E' : '#D8C496';
    ctx.fillText(`【${posterData.teaSensory.teaName}】感官图谱`, width / 2, 720);

    // Sensory Bars
    const scores = posterData.teaSensory.radarScores;
    const dims = [
      { label: '香扬高扬', val: scores.aroma },
      { label: '焙火火候', val: scores.roast },
      { label: '回甘生津', val: scores.sweetness },
      { label: '稠滑醇厚', val: scores.body },
      { label: '喉韵岩气', val: scores.throatCharm },
    ];

    dims.forEach((d, idx) => {
      const y = 760 + idx * 30;
      ctx.textAlign = 'left';
      ctx.font = '14px "PingFang SC", sans-serif';
      ctx.fillStyle = currentTheme.id === 'xuan' ? '#5A5346' : '#C8C0B2';
      ctx.fillText(d.label, 90, y);

      // Bar track
      ctx.fillStyle = currentTheme.id === 'xuan' ? '#EAE1CE' : '#334237';
      ctx.fillRect(180, y - 11, 400, 10);

      // Bar fill
      ctx.fillStyle = currentTheme.id === 'xuan' ? '#8F733E' : '#D8C496';
      ctx.fillRect(180, y - 11, (400 * d.val) / 100, 10);

      ctx.font = 'bold 14px monospace';
      ctx.fillText(`${d.val}分`, 600, y);
    });

    // Notes
    ctx.textAlign = 'center';
    ctx.font = 'italic 15px "Songti SC", serif';
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#5E574B' : '#C4BCAE';
    ctx.fillText(`「${posterData.brewingRitual}」`, width / 2, 975);

    // 慢火烹泉 文化注脚
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#8F733E' : '#D8C496';
    ctx.font = 'bold 13px "Songti SC", serif';
    ctx.fillText('【慢火烹泉 · 文化注脚】全舍独设一席 · 主理人红泥炉橄榄炭候汤 · 活火慢烹高山活泉', width / 2, 1000);

    // Bottom QR Pass
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#FFFFFF' : '#17201B';
    ctx.fillRect(60, 1025, width - 120, 165);
    ctx.strokeStyle = currentTheme.id === 'xuan' ? '#DCD3C0' : '#36473C';
    ctx.strokeRect(60, 1025, width - 120, 165);

    ctx.textAlign = 'left';
    ctx.font = 'bold 18px "Songti SC", serif';
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#1E2320' : '#FAF8F5';
    ctx.fillText('凭此柬海报及席号直接入席', 95, 1070);

    ctx.font = '13px "PingFang SC", sans-serif';
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#787163' : '#A69E90';
    ctx.fillText('茶舍雅址：春城嘉叶 · 潮州工夫茶舍（深圳市南山区）', 95, 1105);
    ctx.fillText('官方茶事专线：13825293242 · 恭候雅步', 95, 1135);

    // Mini QR square illustration
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#1E2320' : '#FAF8F5';
    ctx.fillRect(width - 170, 1050, 75, 75);
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#FFFFFF' : '#1E2320';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CCJY', width - 132, 1085);
    ctx.fillText('PASS', width - 132, 1105);

    // Footer copyright
    ctx.fillStyle = currentTheme.id === 'xuan' ? '#8F897D' : '#8A8275';
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CHUN CHENG JIA YE · TEA SALON ARCHIVE · 2026', width / 2, 1260);

    // Convert to Image and download
    const imgUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `chuncheng_yaxi_poster_${bookingCode}.png`;
    link.click();

    setIsDownloading(false);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-[#D8C7A5] flex flex-col max-h-[95vh]">
        {/* Top Floating Control Bar */}
        <div className="px-5 py-3.5 bg-white border-b border-[#ECE3D5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B23A2B]" />
            <h3 className="font-oriental-serif text-sm font-bold text-[#1E2320] tracking-wide">
              生成雅席邀约海报
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF5E8] text-[#8F733E] border border-[#E8DFC9]">
              AI 诗画合璧
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F3EFE7] hover:bg-[#EAE4D8] text-[#554E41] flex items-center justify-center transition-colors"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Switcher & AI Regenerate Tool Bar */}
        <div className="px-5 py-2.5 bg-[#FAF7F0] border-b border-[#E8DFC8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#8F733E]" />
            <span className="text-[#6D6658] font-oriental-serif">风雅色调：</span>
            <div className="flex items-center gap-1">
              {POSTER_THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => handleSwitchTheme(th)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-oriental-serif transition-all ${
                    currentTheme.id === th.id
                      ? 'bg-[#1E2320] text-white font-bold shadow-xs'
                      : 'text-[#6B6456] hover:bg-white/80'
                  }`}
                >
                  {th.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRegeneratePoem}
            disabled={isLoadingAI}
            className="flex items-center gap-1 text-[11px] font-oriental-serif text-[#8F733E] hover:text-[#735A2B] font-bold transition-colors disabled:opacity-50"
            title="请求 AI 为本席重新赋诗"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingAI ? 'animate-spin' : ''}`} />
            <span>AI 重新赋诗</span>
          </button>
        </div>

        {/* Poster Visual Body Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 select-none bg-[#EFEBE1]">
          {/* Main Simulated Poster Card */}
          <div
            className={`rounded-2xl p-5 shadow-xl border relative transition-all duration-300 space-y-4 ${
              currentTheme.id === 'ink'
                ? 'bg-gradient-to-b from-[#151D18] via-[#1C2621] to-[#111713] text-[#FAF8F5] border-[#394B3F]'
                : currentTheme.id === 'gold'
                ? 'bg-gradient-to-b from-[#2C2319] via-[#382D20] to-[#211A12] text-[#FDFBF7] border-[#544633]'
                : 'bg-gradient-to-b from-[#FAF7EF] via-[#F3ECE0] to-[#ECE2D0] text-[#232B26] border-[#D8C7A5]'
            }`}
          >
            {/* Top Brand & Calligraphy Seal */}
            <div className="flex items-start justify-between">
              <div>
                <span className="font-oriental-serif text-[11px] tracking-[0.2em] font-bold block" style={{ color: currentTheme.accentColor }}>
                  春城嘉叶 · 潮州工夫茶舍
                </span>
                <span className="text-[9px] font-mono opacity-60 uppercase block">
                  TEA SALON CEREMONY & TERROIR RADAR
                </span>
              </div>

              {/* Traditional Vermilion Seal Stamp */}
              <div
                className="w-10 h-10 border-2 rounded-sm flex flex-col items-center justify-center rotate-3 opacity-90"
                style={{ borderColor: currentTheme.sealColor, color: currentTheme.sealColor }}
              >
                <span className="font-oriental-serif text-[8px] font-bold leading-tight">春城</span>
                <span className="font-oriental-serif text-[8px] font-bold leading-tight">雅席</span>
              </div>
            </div>

            {/* Poster Poetic Header & Verse */}
            <div className="text-center space-y-2 pt-1">
              <h2
                className="font-oriental-serif text-xl sm:text-2xl font-bold tracking-widest"
                style={{ color: currentTheme.textColor }}
              >
                {posterData?.poeticTitle || '月藏幽席 · 烹泉候君'}
              </h2>

              {/* Classical Poetry Scroll */}
              <div
                className="p-3.5 rounded-xl border space-y-1 font-oriental-serif text-sm tracking-wider leading-relaxed text-center"
                style={{
                  backgroundColor: currentTheme.id === 'xuan' ? '#FFFDF8' : 'rgba(255,255,255,0.06)',
                  borderColor: currentTheme.borderColor,
                  color: currentTheme.id === 'xuan' ? '#3B3429' : '#E8DFC9',
                }}
              >
                {posterData?.invitationVerse.map((line, i) => (
                  <p key={i} className="font-medium">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Chamber Photography & Visual Atmosphere */}
            <div className="rounded-xl overflow-hidden border relative aspect-16/9" style={{ borderColor: currentTheme.borderColor }}>
              <img
                src={roomImage}
                alt={booking.roomName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <span className="text-[10px] font-mono tracking-wider text-[#D8C496] block">
                  CHAMBER AMBIENCE
                </span>
                <h4 className="font-oriental-serif font-bold text-sm tracking-wide">
                  {booking.roomName}
                </h4>
              </div>
            </div>

            {/* Booking Specifics Grid */}
            <div
              className="p-3.5 rounded-xl border text-xs space-y-2"
              style={{
                backgroundColor: currentTheme.id === 'xuan' ? '#FFFFFF' : 'rgba(0,0,0,0.25)',
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" style={{ color: currentTheme.accentColor }} />
                  <span className="opacity-80">吉日：</span>
                  <span className="font-mono font-bold">{booking.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" style={{ color: currentTheme.accentColor }} />
                  <span className="opacity-80">时段：</span>
                  <span className="font-medium">{booking.timeSlot.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" style={{ color: currentTheme.accentColor }} />
                  <span className="opacity-80">执席：</span>
                  <span className="font-oriental-serif font-bold">{booking.sommelier}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5" style={{ color: currentTheme.accentColor }} />
                  <span className="opacity-80">客座：</span>
                  <span className="font-bold">{booking.guests} 位雅士</span>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-[11px]" style={{ borderColor: currentTheme.borderColor }}>
                <span className="opacity-70 font-oriental-serif">开席特选茶品：</span>
                <span className="font-oriental-serif font-bold" style={{ color: currentTheme.accentColor }}>
                  {booking.pairedTea}
                </span>
              </div>
            </div>

            {/* Tea Sensory Flavor Graph (茶品感官图谱) */}
            {posterData?.teaSensory && (
              <div
                className="p-3.5 rounded-xl border space-y-2.5"
                style={{
                  backgroundColor: currentTheme.id === 'xuan' ? '#FAF8F3' : 'rgba(255,255,255,0.04)',
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.accentColor }} />
                    <span className="font-oriental-serif font-bold text-xs">
                      茶品感官图谱 · {posterData.teaSensory.category}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/10">
                    SENSORY DNA
                  </span>
                </div>

                {/* 5-axis Flavor Spectrum Bars */}
                <div className="space-y-1.5 text-[10px]">
                  {[
                    { label: '香扬高扬', val: posterData.teaSensory.radarScores.aroma },
                    { label: '焙火火候', val: posterData.teaSensory.radarScores.roast },
                    { label: '回甘生津', val: posterData.teaSensory.radarScores.sweetness },
                    { label: '稠滑醇厚', val: posterData.teaSensory.radarScores.body },
                    { label: '喉韵岩气', val: posterData.teaSensory.radarScores.throatCharm },
                  ].map((dim) => (
                    <div key={dim.label} className="flex items-center gap-2">
                      <span className="w-14 shrink-0 font-oriental-serif opacity-80">{dim.label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-black/15">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${dim.val}%`,
                            backgroundColor: currentTheme.accentColor,
                          }}
                        />
                      </div>
                      <span className="w-7 font-mono font-bold text-right">{dim.val}</span>
                    </div>
                  ))}
                </div>

                {/* Flavor Notes */}
                <div className="flex flex-wrap gap-1 pt-1 justify-center">
                  {posterData.teaSensory.keyDescriptors.map((desc) => (
                    <span
                      key={desc}
                      className="px-2 py-0.5 rounded-md text-[9px] font-oriental-serif border"
                      style={{
                        borderColor: currentTheme.borderColor,
                        backgroundColor: currentTheme.id === 'xuan' ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      #{desc}
                    </span>
                  ))}
                </div>

                {/* Brewing Ritual Quote */}
                <p className="text-[10px] font-oriental-serif italic text-center opacity-80 pt-1 leading-relaxed">
                  「{posterData.brewingRitual}」
                </p>
              </div>
            )}

            {/* Bottom Pass Barcode & QR Verification */}
            <div
              className="p-3 rounded-xl border flex items-center justify-between"
              style={{
                backgroundColor: currentTheme.id === 'xuan' ? '#FFFFFF' : '#141B17',
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="space-y-0.5 pr-2">
                <span className="text-[9px] font-mono tracking-widest opacity-60 uppercase block">
                  PASS CODE / 席号凭证
                </span>
                <span className="font-mono text-sm font-bold tracking-wider" style={{ color: currentTheme.accentColor }}>
                  {bookingCode}
                </span>
                <p className="text-[10px] font-oriental-serif opacity-80">
                  凭此海报到店直接入席 · 春城嘉叶敬候雅步
                </p>
              </div>

              {/* QR Token Stamp */}
              <div
                className="w-12 h-12 rounded-lg border flex flex-col items-center justify-center shrink-0 p-1 font-mono text-[9px] text-center"
                style={{
                  borderColor: currentTheme.borderColor,
                  backgroundColor: currentTheme.id === 'xuan' ? '#1E2320' : '#FAF8F5',
                  color: currentTheme.id === 'xuan' ? '#FFFFFF' : '#1E2320',
                }}
              >
                <span className="font-bold">CCJY</span>
                <span className="text-[8px] opacity-70">PASS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Banners */}
        {downloadSuccess && (
          <div className="px-5 py-2.5 bg-[#EBF3ED] text-[#285E37] text-xs flex items-center justify-center gap-1.5 border-t border-[#CDE3D3]">
            <Check className="w-4 h-4 text-[#285E37]" />
            <span>高清海报图片已生成并开始下载，可直接在微信发送给茶友！</span>
          </div>
        )}

        {copied && (
          <div className="px-5 py-2.5 bg-[#FAF2E6] text-[#8F733E] text-xs flex items-center justify-center gap-1.5 border-t border-[#E8DCC8]">
            <Check className="w-4 h-4 text-[#8F733E]" />
            <span>雅席邀约文案与诗词已复制到剪贴板。</span>
          </div>
        )}

        {/* Action Button Footer */}
        <div className="p-4 bg-white border-t border-[#ECE3D5] flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadPosterImage}
            disabled={isDownloading}
            className="flex-1 py-3 px-3 rounded-2xl bg-[#1E2320] hover:bg-black text-white font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#E7D2A7]" />
            <span>{isDownloading ? '正在渲染高清海报...' : '保存高清海报图片 (PNG)'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="py-3 px-3.5 rounded-2xl bg-[#F6F1E9] border border-[#DDD3C2] text-[#4E473B] hover:bg-[#ECE4D6] font-oriental-serif text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            title="复制诗文邀友"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>复制诗文</span>
          </button>
        </div>
      </div>
    </div>
  );
};
