import React, { useState, useRef } from 'react';
import {
  X,
  Calendar,
  Download,
  Check,
  Copy,
  Share2,
  Sparkles,
  MapPin,
  User,
  Clock,
  Coffee,
  ShieldCheck,
  ImageDown,
  FileDown,
  ScrollText,
} from 'lucide-react';
import { downloadCalendarEvent, CalendarEventData } from '../utils/calendarExport';
import { downloadTeaGiftManifestPdf } from '../utils/teaGiftManifestPdf';
import { zenAudio } from '../utils/audioZen';

export interface BookingInvitationData {
  id: string;
  roomName: string;
  date: string;
  timeSlot: string;
  guests: number;
  sommelier: string;
  pairedTea: string;
  finalPrice: number;
  bookingCode?: string;
}

interface TeaInvitationModalProps {
  booking: BookingInvitationData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPosterModal?: (booking: BookingInvitationData) => void;
}

export const TeaInvitationModal: React.FC<TeaInvitationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onOpenPosterModal,
}) => {
  const [calendarSaved, setCalendarSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterDataUrl, setPosterDataUrl] = useState<string | null>(null);
  const [posterSavedToast, setPosterSavedToast] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [pdfSavedToast, setPdfSavedToast] = useState(false);
  const invitationCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const bookingCode = booking.bookingCode || `YUN-${booking.id.slice(-6).toUpperCase()}`;

  const eventData: CalendarEventData = {
    roomName: booking.roomName,
    date: booking.date,
    timeSlot: booking.timeSlot,
    guests: booking.guests,
    sommelier: booking.sommelier,
    pairedTea: booking.pairedTea,
    bookingCode,
    location: '春城嘉叶 · 潮州工夫茶舍（深圳市南山区）',
  };

  const handleSaveToCalendar = () => {
    zenAudio.playZenChime();
    const success = downloadCalendarEvent(eventData);
    if (success) {
      setCalendarSaved(true);
      setTimeout(() => setCalendarSaved(false), 5000);
    }
  };

  const handleCopyInvitation = () => {
    zenAudio.playZenChime();
    const text = [
      `【春城嘉叶 · 雅席雅集邀约函】`,
      `奉呈：贵宾雅鉴`,
      `席所：${booking.roomName}`,
      `吉日：${booking.date}`,
      `时段：${booking.timeSlot}`,
      `侍茶师：${booking.sommelier}`,
      `开席茶礼：${booking.pairedTea}`,
      `入席席号：${bookingCode}`,
      `雅址：春城嘉叶 · 潮州工夫茶舍（深圳市南山区）`,
      ``,
      `「一叶有来处，一器有分寸。烹泉以待，静候雅步。」`,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  /**
   * 利用高分倍率 HTML5 Canvas (HTML2Canvas 等效离屏合成方案) 渲染当前雅席预约邀请函海报
   * 方便用户一键保存到手机相册或直接分享至微信朋友圈
   */
  const handleSavePoster = async () => {
    if (isGeneratingPoster) return;
    zenAudio.playZenChime();
    setIsGeneratingPoster(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 760;
      const height = 1140;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingPoster(false);
        return;
      }

      // 1. 宣纸底纹背景与金石外框
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#F6F1E7');
      bgGrad.addColorStop(0.5, '#FFFDF9');
      bgGrad.addColorStop(1, '#F2EBDD');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 外层宋锦细框
      ctx.strokeStyle = '#D8C8A5';
      ctx.lineWidth = 4;
      ctx.strokeRect(28, 28, width - 56, height - 56);

      // 内层描金细框
      ctx.strokeStyle = '#E6DAC1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // 四角东方折角纹饰
      const cornerSize = 18;
      ctx.strokeStyle = '#8F733E';
      ctx.lineWidth = 2.5;
      const corners = [
        [40, 40, 1, 1],
        [width - 40, 40, -1, 1],
        [40, height - 40, 1, -1],
        [width - 40, height - 40, -1, -1],
      ];
      corners.forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + dy * cornerSize);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + dx * cornerSize, cy);
        ctx.stroke();
      });

      // 2. 尝试加载顶部透明底「春城嘉叶」书法 Logo
      try {
        const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = '/assets/aistudio/________0147c3e4.png';
        });
        const logoW = 160;
        const logoH = (logoImg.height / logoImg.width) * logoW;
        ctx.drawImage(logoImg, (width - logoW) / 2, 68, logoW, logoH);
      } catch {
        // Fallback text if logo image fails
        ctx.fillStyle = '#1E2320';
        ctx.font = 'bold 22px "Noto Serif SC", "Songti SC", serif';
        ctx.textAlign = 'center';
        ctx.fillText('春 城 嘉 叶', width / 2, 95);
      }

      // 3. 朱砂闲章「春城嘉叶 · 雅席」
      const sealW = 156;
      const sealH = 34;
      const sealX = (width - sealW) / 2;
      const sealY = 132;
      ctx.save();
      ctx.strokeStyle = '#B23A2B';
      ctx.lineWidth = 2;
      ctx.strokeRect(sealX, sealY, sealW, sealH);
      ctx.fillStyle = '#B23A2B';
      ctx.font = 'bold 14px "Noto Serif SC", "Songti SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('春城嘉叶 · 雅席', width / 2, sealY + 23);
      ctx.restore();

      // 4. 主标题「茶 席 邀 约 函」
      ctx.fillStyle = '#1E2320';
      ctx.font = 'bold 38px "Noto Serif SC", "Songti SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('茶 席 邀 约 函', width / 2, 218);

      ctx.fillStyle = '#8C8476';
      ctx.font = '13px monospace';
      ctx.fillText('TEA SALON INVITATION & CEREMONY PASS', width / 2, 246);

      // 5. 诗意卷首语卡片
      const quoteBoxX = 72;
      const quoteBoxY = 274;
      const quoteBoxW = width - 144;
      const quoteBoxH = 118;
      ctx.fillStyle = '#FAF7F0';
      ctx.fillRect(quoteBoxX, quoteBoxY, quoteBoxW, quoteBoxH);
      ctx.strokeStyle = '#ECE3D4';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(quoteBoxX, quoteBoxY, quoteBoxW, quoteBoxH);

      ctx.fillStyle = '#4A4337';
      ctx.font = 'bold 16px "Noto Serif SC", "Songti SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('奉呈 · 尊贵席主雅鉴：', width / 2, quoteBoxY + 34);

      ctx.fillStyle = '#6E6657';
      ctx.font = '14px "Noto Serif SC", "Songti SC", serif';
      ctx.fillText('一叶有来处，一器有分寸。烹泉听沸如松风，春城嘉叶特备', width / 2, quoteBoxY + 66);
      ctx.fillText('山场原叶、名家手拉朱泥与幽玄席位，恭候阁下携友莅临，共品浮生闲适。', width / 2, quoteBoxY + 94);

      // 6. 雅席预约明细表
      const details: Array<{ label: string; value: string; highlight?: boolean }> = [
        { label: '预约席所', value: booking.roomName, highlight: true },
        { label: '入席吉日', value: booking.date },
        { label: '茶席时段', value: booking.timeSlot },
        { label: '同行茶友', value: `${booking.guests} 位贵宾` },
        { label: '专属侍茶师', value: booking.sommelier },
        { label: '开席特选茶', value: booking.pairedTea },
        { label: '入席席号', value: bookingCode, highlight: true },
        { label: '茶舍雅址', value: '春城嘉叶 · 潮州工夫茶舍（深圳市南山区）' },
      ];

      let currentY = 434;
      const rowHeight = 56;
      const leftX = 82;
      const rightX = width - 82;

      details.forEach((item, idx) => {
        // 细分割线
        if (idx < details.length - 1) {
          ctx.strokeStyle = '#EFE7DA';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(leftX, currentY + 18);
          ctx.lineTo(rightX, currentY + 18);
          ctx.stroke();
        }

        // 左侧标签
        ctx.fillStyle = '#867F73';
        ctx.font = '16px "Noto Serif SC", "Songti SC", serif';
        ctx.textAlign = 'left';
        ctx.fillText(`◆  ${item.label}`, leftX, currentY);

        // 右侧数值
        ctx.fillStyle = item.highlight ? '#8F733E' : '#1E2320';
        ctx.font = item.highlight
          ? 'bold 18px "Noto Serif SC", "Songti SC", monospace'
          : 'bold 16px "Noto Serif SC", "Songti SC", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(item.value, rightX, currentY);

        currentY += rowHeight;
      });

      // 7. 底部到店核验码与微信朋友圈分享脚标（增加「慢火烹泉」文化注脚）
      const passBoxX = 72;
      const passBoxY = 886;
      const passBoxW = width - 144;
      const passBoxH = 152;

      ctx.fillStyle = '#FAF7F0';
      ctx.fillRect(passBoxX, passBoxY, passBoxW, passBoxH);
      ctx.strokeStyle = '#E2D6BE';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(passBoxX, passBoxY, passBoxW, passBoxH);

      ctx.fillStyle = '#8C8476';
      ctx.font = '13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('VERIFICATION PASS · 到店出示核验', passBoxX + 26, passBoxY + 34);

      ctx.fillStyle = '#1E2320';
      ctx.font = 'bold 18px "Noto Serif SC", "Songti SC", serif';
      ctx.fillText(`凭此邀请函及席号 [${bookingCode}] 直接入席`, passBoxX + 26, passBoxY + 64);

      // 文化注脚：慢火烹泉
      ctx.fillStyle = '#8F733E';
      ctx.font = 'bold 13px "Noto Serif SC", "Songti SC", serif';
      ctx.fillText('【慢火烹泉 · 文化注脚】', passBoxX + 26, passBoxY + 94);

      ctx.fillStyle = '#6E6454';
      ctx.font = '12px "Noto Serif SC", "Songti SC", serif';
      ctx.fillText('全舍独设一席，主理人提前以橄榄炭生火候汤。红泥炉慢火烹活泉，不负山场原叶。', passBoxX + 26, passBoxY + 118);
      ctx.fillText('长按保存海报至手机相册，亦可分享至微信朋友圈。', passBoxX + 26, passBoxY + 138);

      // 右侧 SEAT PASS 印鉴二维码块
      const qrSize = 92;
      const qrX = passBoxX + passBoxW - qrSize - 20;
      const qrY = passBoxY + (passBoxH - qrSize) / 2;
      ctx.fillStyle = '#1E2320';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);

      ctx.strokeStyle = '#D8C496';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(qrX + 6, qrY + 6, qrSize - 12, qrSize - 12);

      ctx.fillStyle = '#FAF8F5';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SEAT', qrX + qrSize / 2, qrY + 38);
      ctx.fillText('PASS', qrX + qrSize / 2, qrY + 58);
      ctx.fillStyle = '#D8C496';
      ctx.font = '10px monospace';
      ctx.fillText(bookingCode.slice(-6), qrX + qrSize / 2, qrY + 76);

      // 8. 底部东方题跋
      ctx.fillStyle = '#9B9283';
      ctx.font = '13px "Noto Serif SC", "Songti SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('春城嘉叶 · 一叶有来处，一器有分寸 · 慢火烹泉', width / 2, height - 52);

      const dataUrl = canvas.toDataURL('image/png');
      setPosterDataUrl(dataUrl);

      // 触发浏览器自动下载保存海报图片
      const link = document.createElement('a');
      link.download = `春城嘉叶-茶席邀约函-${bookingCode}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPosterSavedToast(true);
      setTimeout(() => setPosterSavedToast(false), 6000);
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  /**
   * 极简宋体风格布局导出标准 A4 雅席礼单 PDF
   * 包含雅席预约信息、所选茗茶说明（名茶考略）、以及「慢火烹泉」文化注脚
   */
  const handleExportGiftManifestPdf = async () => {
    if (isGeneratingPdf) return;
    zenAudio.playZenChime();
    setIsGeneratingPdf(true);

    try {
      const result = await downloadTeaGiftManifestPdf({
        ...booking,
        bookingCode,
      });

      if (result?.dataUrl) {
        setPdfDataUrl(result.dataUrl);
      }
      setPdfSavedToast(true);
      setTimeout(() => setPdfSavedToast(false), 6000);
    } catch (err) {
      console.error('Failed to export tea gift manifest PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] bg-[#FAF8F5] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D8C7A5] animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#ECE3D5] bg-[#F4EDE2]/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B23A2B]" />
            <span className="font-oriental-serif text-xs font-bold text-[#1E2320] tracking-widest">
              春城嘉叶 · 雅席柬帖
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#DCD3C4] flex items-center justify-center text-[#5E574B] hover:text-[#1E2320] transition-colors"
            aria-label="关闭邀请函"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Traditional Gold Foil Letter Scroll Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {/* Letter Inner Container with ornate border */}
          <div
            ref={invitationCardRef}
            className="relative bg-[#FFFDF9] rounded-2xl p-5 border-2 border-[#D8C8A5] shadow-xs space-y-4 overflow-hidden"
          >
            {/* Top Vermilion Seal & Title */}
            <div className="text-center space-y-1.5 relative">
              {/* Traditional Red Seal Stamp */}
              <div className="inline-block p-1 border-2 border-[#B23A2B] rounded-md rotate-2 mb-1">
                <span className="text-[10px] font-oriental-serif font-bold text-[#B23A2B] tracking-widest block px-1">
                  春城嘉叶 · 雅席
                </span>
              </div>

              <h2 className="font-oriental-serif text-xl sm:text-2xl font-bold text-[#1E2320] tracking-widest">
                茶 席 邀 约 函
              </h2>
              <span className="text-[10px] font-mono text-[#8C8476] tracking-widest uppercase block">
                TEA SALON INVITATION & CEREMONY PASS
              </span>
            </div>

            {/* Poetic Inscription */}
            <div className="py-2 px-3 bg-[#FAF7F0] rounded-xl border border-[#ECE3D4] text-xs font-oriental-serif text-[#4A4337] leading-relaxed text-center font-light">
              <p>奉呈 · 尊贵席主雅鉴：</p>
              <p className="mt-1 text-[11px] text-[#6E6657]">
                一叶有来处，一器有分寸。烹泉听沸如松风，春城嘉叶特备山场原叶、名家手拉朱泥与幽玄席位，恭候阁下携友莅临，共品浮生闲适。
              </p>
            </div>

            {/* Chamber & Reservation Details */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>预约席所</span>
                </span>
                <span className="font-oriental-serif font-bold text-[#1E2320] text-right">
                  {booking.roomName}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>入席吉日</span>
                </span>
                <span className="font-mono font-bold text-[#1E2320]">
                  {booking.date}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>茶席时段</span>
                </span>
                <span className="text-[#2B322D] font-medium text-right">
                  {booking.timeSlot}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>专属侍茶师</span>
                </span>
                <span className="font-oriental-serif font-medium text-[#1E2320]">
                  {booking.sommelier}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>开席特选茶</span>
                </span>
                <span className="font-oriental-serif font-medium text-[#1E2320]">
                  {booking.pairedTea}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 border-b border-[#F0E8DC]">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>入席席号</span>
                </span>
                <span className="font-mono font-bold text-[#8F733E]">
                  {bookingCode}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5">
                <span className="text-[#867F73] font-oriental-serif flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8F733E]" />
                  <span>茶舍雅址</span>
                </span>
                <span className="text-[11px] text-[#4F493E] text-right max-w-[260px]">
                  春城嘉叶 · 潮州工夫茶舍（深圳市南山区）
                </span>
              </div>
            </div>

            {/* Charcoal Fire Water Cultural Note */}
            <div className="bg-[#FAF6EC] p-3 rounded-xl border border-[#E8DFC9] flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-[#B23A2B]/10 text-[#B23A2B] shrink-0 mt-0.5">
                <Coffee className="w-4 h-4 text-[#B23A2B]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-oriental-serif font-bold text-[#8F733E] block">
                  慢火烹泉 · 文化注脚
                </span>
                <p className="text-[11px] text-[#695F4F] leading-relaxed">
                  春城嘉叶全舍仅此一席，主理人行茶十五载亲泡。案前红泥小风炉以天然橄榄炭慢烧活泉，生火候汤，活火煮活泉，方得山场真香真味。
                </p>
              </div>
            </div>

            {/* QR Verification Badge */}
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E9E0CE] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#8C8476] font-mono block">
                  VERIFICATION PASS · 到店出示
                </span>
                <p className="text-xs font-oriental-serif font-bold text-[#1E2320]">
                  凭此函及席号直接入席
                </p>
              </div>

              <div className="w-12 h-12 bg-white p-1 rounded-lg border border-[#DDD3C2] flex items-center justify-center">
                <div className="w-full h-full bg-[#1E2320] flex items-center justify-center text-white text-[9px] font-mono text-center leading-none">
                  SEAT<br />PASS
                </div>
              </div>
            </div>
          </div>

          {/* Generated Poster Preview & WeChat Share Card */}
          {posterDataUrl && (
            <div className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#D8C8A5] space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-oriental-serif font-bold text-[#285E37]">
                  <Check className="w-4 h-4 text-[#285E37] shrink-0" />
                  <span>雅席邀约函海报已生成并保存！</span>
                </div>
                <a
                  href={posterDataUrl}
                  download={`春城嘉叶-茶席邀约函-${bookingCode}.png`}
                  className="text-[11px] font-oriental-serif text-[#8F733E] underline hover:opacity-80"
                >
                  重新下载图片
                </a>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={posterDataUrl}
                  alt="茶席邀约函海报预览"
                  className="w-20 h-28 object-cover rounded-lg border border-[#E2D6BE] shadow-xs shrink-0"
                />
                <div className="space-y-1.5 text-[11px] text-[#5E574B] leading-relaxed">
                  <p>
                    已为您导出高清宣纸金石质感邀约函（<span className="font-mono">{bookingCode}</span>）。
                  </p>
                  <p className="text-[#8F733E] font-medium flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span>可长按左侧海报保存至手机相册，或直接转发至微信朋友圈 / 茶友群。</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Poster Saved Toast Banner */}
          {posterSavedToast && !posterDataUrl && (
            <div className="p-3 bg-[#EBF3ED] text-[#285E37] rounded-xl border border-[#CDE3D3] text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#285E37] shrink-0" />
              <span>已生成高清雅席预约邀请函图片，方便分享至微信朋友圈或保存到相册。</span>
            </div>
          )}

          {/* Generated PDF Manifest Preview & Download Card */}
          {pdfDataUrl && (
            <div className="p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#D8C8A5] space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-oriental-serif font-bold text-[#285E37]">
                  <Check className="w-4 h-4 text-[#285E37] shrink-0" />
                  <span>极简宋体雅席礼单 (PDF) 已生成！</span>
                </div>
                <a
                  href={pdfDataUrl}
                  download={`春城嘉叶-雅席礼单-${bookingCode}.pdf`}
                  className="text-[11px] font-oriental-serif text-[#8F733E] underline hover:opacity-80 flex items-center gap-1"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>下载电子礼单</span>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-28 bg-[#FAF6EE] rounded-lg border border-[#D8C8A5] flex flex-col items-center justify-center p-2 text-center shadow-xs shrink-0">
                  <ScrollText className="w-6 h-6 text-[#8F733E] mb-1" />
                  <span className="text-[10px] font-oriental-serif font-bold text-[#1E2320]">
                    雅席礼单
                  </span>
                  <span className="text-[8px] font-mono text-[#8C8476] mt-0.5">
                    A4 · 极简宋体
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#5E574B] leading-relaxed">
                  <p>
                    已为您排版并导出宋代文人风格雅席礼单（<span className="font-mono">{bookingCode}</span>）。
                  </p>
                  <p className="text-[#8F733E] font-medium">
                    涵盖雅席吉日席所、{booking.pairedTea}考略、茶器水温，以及「橄榄炭慢火烹泉」注脚，可直接发送给同席雅友或打印留念。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PDF Saved Toast Banner */}
          {pdfSavedToast && !pdfDataUrl && (
            <div className="p-3 bg-[#EBF3ED] text-[#285E37] rounded-xl border border-[#CDE3D3] text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#285E37] shrink-0" />
              <span>已成功生成极简宋体雅席礼单 PDF，方便作为精致电子礼单发送给茶友。</span>
            </div>
          )}

          {/* Calendar Saved Feedback Banner */}
          {calendarSaved && (
            <div className="p-3 bg-[#EBF3ED] text-[#285E37] rounded-xl border border-[#CDE3D3] text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#285E37] shrink-0" />
              <span>
                <strong>已成功生成手机日历日程文件！</strong> 支持 iOS 日历、Google Calendar、华为/小米日历直接导入。
              </span>
            </div>
          )}

          {/* Copied Feedback */}
          {copied && (
            <div className="p-3 bg-[#FAF2E6] text-[#8F733E] rounded-xl border border-[#E8DCC8] text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#8F733E] shrink-0" />
              <span>邀请函文案已复制到剪贴板，可直接发送给同席茶友。</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#ECE3D5] bg-white/95 flex flex-col gap-2.5">
          {/* Top Main Export Actions: Poster & PDF Gift Manifest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSavePoster}
              disabled={isGeneratingPoster}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-[#232B26] hover:bg-[#151B17] text-[#FAF8F5] font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-60"
            >
              <ImageDown className="w-4 h-4 text-[#D8C496]" />
              <span>{isGeneratingPoster ? '正在渲染海报...' : '保存海报 (相册/朋友圈)'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportGiftManifestPdf}
              disabled={isGeneratingPdf}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-[#362E23] hover:bg-[#251F17] text-[#FAF8F5] font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-60"
            >
              <ScrollText className="w-4 h-4 text-[#E5D5B8]" />
              <span>{isGeneratingPdf ? '正在排版宋体礼单...' : '礼单打印版 (PDF)'}</span>
            </button>
          </div>

          {/* Secondary AI & Utilities Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            {onOpenPosterModal && (
              <button
                type="button"
                onClick={() => onOpenPosterModal(booking)}
                className="py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-[#8F733E] via-[#A48548] to-[#8F733E] hover:opacity-95 text-white font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFF2D6]" />
                <span>AI 诗画海报</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveToCalendar}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-[#F4EFE6] border border-[#D8C8A5] text-[#232B26] hover:bg-[#EAE2D3] font-oriental-serif text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <Download className="w-3.5 h-3.5 text-[#8F733E]" />
              <span>加入日历 (iCal)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyInvitation}
              className="py-2.5 px-3 rounded-2xl bg-[#F6F1E9] border border-[#DDD3C2] text-[#4E473B] hover:bg-[#ECE4D6] font-oriental-serif text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>复制邀友</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
