/**
 * Minimalist Song-style Tea Gift Manifest (雅席礼单) PDF Generator
 * Combines reservation details, paired tea dossier, and '慢火烹泉' cultural note.
 * Exports as an exquisite printable / shareable A4 PDF using jsPDF.
 */

import { jsPDF } from 'jspdf';
import { BookingInvitationData } from '../components/TeaInvitationModal';
import { PRODUCTS } from '../data/mockData';

export interface TeaDossierInfo {
  name: string;
  origin: string;
  year: string;
  tagline: string;
  description: string;
  vessel: string;
  waterTemp: string;
}

/**
 * Retrieve curated tea dossier information based on tea name
 */
export function getTeaDossier(teaName: string): TeaDossierInfo {
  const normalized = (teaName || '').trim();
  const match = PRODUCTS.find(
    (p) =>
      p.category === 'tea' &&
      (p.name === normalized ||
        p.name.includes(normalized) ||
        normalized.includes(p.name.split('·')[0]) ||
        normalized.includes(p.name.slice(0, 4)))
  );

  if (match) {
    const vesselMatch = match.brewingGuide?.ratio?.split(' ')?.[1] || '吴瑞全手拉朱泥壶';
    return {
      name: match.name,
      origin: match.origin || '中国名山名产区 · 核心山场原叶',
      year: match.year || '2024 甲辰春采',
      tagline: match.tagline || '山场气韵清高，回甘悠长生津',
      description: match.description || '精选高山原叶，慢火轻焙，汤色明亮，稠厚温润。',
      vessel: vesselMatch,
      waterTemp: match.brewingGuide?.temp || '100°C 刚沸纯净山泉',
    };
  }

  return {
    name: teaName || '诸心·凤凰单丛',
    origin: '名山名产区 · 核心山场原叶',
    year: '2024 特选年份原叶',
    tagline: '单丛清气，兰香幽邃，回甘悠长',
    description: '春城嘉叶特选核心山场名茶，慢火轻焙，气韵深沉，适合细品慢酌。',
    vessel: '吴瑞全手拉朱泥老壶 / 官窑描金品茗盏',
    waterTemp: '100°C 榄炭慢烧高山活泉',
  };
}

/**
 * Draw a classical cinnabar seal (朱砂印) on canvas
 */
function drawCinnabarSeal(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number = 56
) {
  ctx.save();
  ctx.strokeStyle = '#B23A2B';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, size, size);

  // Outer border subtle corner wear
  ctx.fillStyle = '#B23A2B';
  ctx.font = 'bold 15px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // If 4 characters, 2x2 seal layout
  if (text.length === 4) {
    // Traditional right-to-left, top-to-bottom seal order
    ctx.fillText(text[0], x + size * 0.72, y + size * 0.32);
    ctx.fillText(text[1], x + size * 0.72, y + size * 0.72);
    ctx.fillText(text[2], x + size * 0.28, y + size * 0.32);
    ctx.fillText(text[3], x + size * 0.28, y + size * 0.72);
  } else {
    ctx.fillText(text, x + size / 2, y + size / 2);
  }
  ctx.restore();
}

/**
 * Generate offscreen high-DPI canvas of the Song-style Gift Manifest
 */
export async function renderSongGiftManifestCanvas(
  booking: BookingInvitationData
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  // A4 ratio 1:1.414, 1240 x 1754 px for crisp 150+ DPI printing
  const width = 1240;
  const height = 1754;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas 2d context');

  const teaDossier = getTeaDossier(booking.pairedTea);
  const bookingCode = booking.bookingCode || `YUN-${booking.id.slice(-6).toUpperCase()}`;

  // 1. Xuan Paper Background (米黄宣纸温润底色)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#FAF6EE');
  bgGrad.addColorStop(0.5, '#FFFDF8');
  bgGrad.addColorStop(1, '#F7F1E5');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle traditional paper grain dots
  ctx.fillStyle = 'rgba(143, 115, 62, 0.02)';
  for (let i = 0; i < 400; i++) {
    const rx = (i * 997) % width;
    const ry = (i * 1237) % height;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // 2. Song-style Double Border with Corner Accents (宋式外粗内细双线框)
  ctx.strokeStyle = '#D8C6A5';
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  ctx.strokeStyle = '#EADEC9';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(62, 62, width - 124, height - 124);

  // Corner floral marks
  const cornerLen = 24;
  ctx.strokeStyle = '#8F733E';
  ctx.lineWidth = 2.5;
  const corners = [
    [62, 62, 1, 1],
    [width - 62, 62, -1, 1],
    [62, height - 62, 1, -1],
    [width - 62, height - 62, -1, -1],
  ];
  corners.forEach(([cx, cy, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * cornerLen);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * cornerLen, cy);
    ctx.stroke();
  });

  // 3. Header: Spring City Calligraphy Logo
  try {
    const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = '/assets/aistudio/________0147c3e4.png';
    });
    const logoW = 220;
    const logoH = (logoImg.height / logoImg.width) * logoW;
    ctx.drawImage(logoImg, (width - logoW) / 2, 90, logoW, logoH);
  } catch {
    ctx.fillStyle = '#1E2320';
    ctx.font = 'bold 30px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
    ctx.textAlign = 'center';
    ctx.fillText('春 城 嘉 叶', width / 2, 125);
  }

  // Cinnabar Seal: 雅席特呈
  drawCinnabarSeal(ctx, '雅席特奉', width - 148, 92, 56);

  // Title: 雅席礼单
  ctx.fillStyle = '#1E2320';
  ctx.font = 'bold 36px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.textAlign = 'center';
  ctx.fillText('雅 席 礼 单', width / 2, 230);

  ctx.fillStyle = '#8F733E';
  ctx.font = '12px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('SOLEMN TEA SALON GIFT MANIFEST · SOLE SANCTUARY', width / 2, 258);
  ctx.letterSpacing = '0px';

  // Dividing decorative line
  ctx.strokeStyle = '#D8C6A5';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 160, 276);
  ctx.lineTo(width / 2 + 160, 276);
  ctx.stroke();

  // 4. Salutation Box (奉呈雅鉴)
  const salutationY = 300;
  ctx.fillStyle = '#4A4235';
  ctx.font = 'bold 18px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.textAlign = 'left';
  ctx.fillText('奉呈 · 雅宾尊鉴：', 110, salutationY);

  ctx.fillStyle = '#5A5143';
  ctx.font = '15px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText(
    '一叶有来处，一器见工夫。春城嘉叶全舍特辟此席，主理人焚香生火，敬候雅步亲临。',
    110,
    salutationY + 28
  );

  // 5. Section I: 雅席预约明细 (Reservation Details Table)
  const sec1Y = 370;
  ctx.fillStyle = '#8F733E';
  ctx.font = 'bold 16px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText('【 雅席所设 · 备要 】', 110, sec1Y);

  const reservationFields: Array<{ label: string; value: string; isBold?: boolean }> = [
    { label: '茶席所设', value: `${booking.roomName}（全舍独设一室一席）`, isBold: true },
    { label: '入席吉日', value: `${booking.date}` },
    { label: '茶席时段', value: `${booking.timeSlot}` },
    { label: '入席人数', value: `${booking.guests} 位雅宾贵宾` },
    { label: '执壶侍茶', value: `茶舍主理人一人亲泡（行茶十五载）`, isBold: true },
    { label: '入席席号', value: `${bookingCode}（到店凭单入席）`, isBold: true },
    { label: '茶舍雅址', value: '春城嘉叶 · 潮州工夫茶舍（深圳市南山区）' },
  ];

  let currentY = sec1Y + 30;
  const tableX = 110;
  const tableW = width - 220;

  // Background card for reservation particulars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(tableX, currentY - 14, tableW, reservationFields.length * 34 + 18);
  ctx.strokeStyle = '#E6DCBF';
  ctx.lineWidth = 1;
  ctx.strokeRect(tableX, currentY - 14, tableW, reservationFields.length * 34 + 18);

  reservationFields.forEach((item) => {
    ctx.fillStyle = '#7C7465';
    ctx.font = '14px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, tableX + 24, currentY + 12);

    ctx.fillStyle = item.isBold ? '#1E2320' : '#453E32';
    ctx.font = item.isBold
      ? 'bold 14px "Songti SC", "Noto Serif SC", SimSun, STSong, serif'
      : '14px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
    ctx.fillText(item.value, tableX + 130, currentY + 12);

    currentY += 34;
  });

  // 6. Section II: 所选茗茶详录 (Paired Tea Dossier)
  currentY += 36;
  ctx.fillStyle = '#8F733E';
  ctx.font = 'bold 16px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.textAlign = 'left';
  ctx.fillText('【 开席所选 · 佳茗考 】', 110, currentY);

  currentY += 30;
  const teaBoxH = 190;
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(tableX, currentY - 14, tableW, teaBoxH);
  ctx.strokeStyle = '#E0D4BA';
  ctx.lineWidth = 1;
  ctx.strokeRect(tableX, currentY - 14, tableW, teaBoxH);

  // Tea Name Large
  ctx.fillStyle = '#1E2320';
  ctx.font = 'bold 20px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText(teaDossier.name, tableX + 24, currentY + 18);

  // Tea Origin Tag
  ctx.fillStyle = '#8F733E';
  ctx.font = '13px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText(`产区山场：${teaDossier.origin} · ${teaDossier.year}`, tableX + 24, currentY + 44);

  // Tea Tagline
  ctx.fillStyle = '#4D4537';
  ctx.font = '14px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText(`气韵风味：${teaDossier.tagline}`, tableX + 24, currentY + 74);

  // Tea Description
  ctx.fillStyle = '#6E6657';
  ctx.font = '13px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText(`茶性述要：${teaDossier.description}`, tableX + 24, currentY + 104);

  // Pairing Vessels and Brewing Water
  ctx.fillStyle = '#8F733E';
  ctx.font = '13px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText(`所配茶器：${teaDossier.vessel} · 官窑描金双凤品茗盏`, tableX + 24, currentY + 134);
  ctx.fillText(`适水温度：${teaDossier.waterTemp} · 前沸生汤`, tableX + 24, currentY + 158);

  // 7. Section III: 「慢火烹泉」文化注脚 (Charcoal Fire Cultural Note)
  currentY += teaBoxH + 28;
  ctx.fillStyle = '#8F733E';
  ctx.font = 'bold 16px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText('【 慢火烹泉 · 文化注脚 】', 110, currentY);

  currentY += 28;
  const noteBoxH = 175;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillRect(tableX, currentY - 12, tableW, noteBoxH);
  ctx.strokeStyle = '#E8DFCD';
  ctx.lineWidth = 1;
  ctx.strokeRect(tableX, currentY - 12, tableW, noteBoxH);

  ctx.fillStyle = '#3E372B';
  ctx.font = '14px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  const ritualNotes = [
    '全舍独席，谢绝喧嚣流水侍茶。主理人于案前设红泥小风炉，以天然橄榄炭慢烧高山活泉。',
    '入席前三十分钟生火候汤：一沸榄炭引火，二沸陶铫温炉，三沸蟹眼初鸣，松风过竹。',
    '活火烹活泉，水沸合度方能尽发正岩与单丛之山场真骨。此谓「慢火烹泉」，特此附单，以答知音。',
  ];
  ritualNotes.forEach((line, i) => {
    ctx.fillText(line, tableX + 24, currentY + 22 + i * 30);
  });

  // Little quote line
  ctx.fillStyle = '#8F733E';
  ctx.font = 'italic 13px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText('——「山中何事，松花酿酒，春水煎茶。」', tableX + tableW - 320, currentY + 140);

  // 8. Sign-off & Seal (落款与印章)
  const footerY = height - 190;
  ctx.fillStyle = '#202723';
  ctx.font = 'bold 16px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.textAlign = 'left';
  ctx.fillText('春城嘉叶茶舍 主理人 敬具', tableX + 24, footerY + 24);

  ctx.fillStyle = '#7A7263';
  ctx.font = '13px "Songti SC", "Noto Serif SC", SimSun, STSong, serif';
  ctx.fillText('全舍独席 · 一期一会', tableX + 24, footerY + 50);

  // Master Seal
  drawCinnabarSeal(ctx, '嘉叶主理', tableX + 280, footerY - 4, 52);

  // Bottom Notice
  ctx.fillStyle = '#A39C8F';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CHUN CHENG JIA YE · CHAOZHOU GONGFU TEA SANCTUARY', width / 2, height - 76);
  ctx.fillText('席号有效凭证 · 请携此单或出示电子函入席', width / 2, height - 94);

  return canvas;
}

/**
 * Generate and trigger download of the Minimalist Song-style Tea Gift Manifest PDF
 */
export async function downloadTeaGiftManifestPdf(
  booking: BookingInvitationData
): Promise<{ success: boolean; filename: string; dataUrl: string }> {
  const canvas = await renderSongGiftManifestCanvas(booking);
  const dataUrl = canvas.toDataURL('image/png', 0.95);

  const bookingCode = booking.bookingCode || `YUN-${booking.id.slice(-6).toUpperCase()}`;
  const filename = `春城嘉叶-雅席礼单-${bookingCode}.pdf`;

  // Standard A4: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  pdf.save(filename);

  return {
    success: true,
    filename,
    dataUrl,
  };
}
