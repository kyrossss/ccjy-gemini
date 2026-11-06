/**
 * Tea Session Diary & Personal Terroir Profile Sync Logic
 * 春城嘉叶 · 茶事日记与个人风土档案闭环引擎
 */

import { PersonalTeaRadar } from './teaProfileLogic';

export interface TeaSessionDiaryEntry {
  id: string;
  bookingId: string;
  roomName: string;
  date: string;
  timeSlot: string;
  sommelier: string;
  // Core three dimensions requested by user
  teaWare: string;      // 茶器 (e.g. 潮州孟臣老朱泥手拉壶 / 橄榄炭红泥火炉)
  teaName: string;      // 茶品 (e.g. 沉芳·武夷正岩大红袍 / 水龙吟正岩肉桂)
  teaExperience: string;// 茶感随笔 (e.g. 蟹眼沸水高冲，前三泡果木香浓郁，喉底生津如泉)
  createdAt: string;
  // AI-analyzed terroir & sensory outputs
  extractedTags: string[];
  radarDeltas: {
    roast: number;
    aroma: number;
    sweetness: number;
    mouthfeel: number;
    throatCharm: number;
  };
  terroirSummary: string;
  sommelierNote: string;
  syncedToTerroirProfile: boolean;
}

export interface AITeaDiaryAnalysisResult {
  extractedTags: string[];
  radarDeltas: {
    roast: number;
    aroma: number;
    sweetness: number;
    mouthfeel: number;
    throatCharm: number;
  };
  terroirSummary: string;
  sommelierNote: string;
  source: 'gemini-ai' | 'curated-expert';
}

/**
 * Common classical tea ware presets in Chuncheng Jiaye rooms
 */
export const TEA_WARE_PRESETS = [
  '潮州孟臣款·老梨皮朱泥手拉壶',
  '景德镇宋白瓷三件套盖碗',
  '橄榄炭潮汕红泥小火炉',
  '当代大师双描金纯白瓷公道杯',
  '越窑秘色青瓷品茗杯',
  '宜兴底槽清原矿紫砂石瓢壶',
  '粗陶金砂侧把煮水急须',
] as const;

/**
 * Sensorial tasting tag presets
 */
export const TEA_EXPERIENCE_TAG_SEEDS = [
  '重焙老火',
  '冷杯留香',
  '米汤稠滑',
  '喉底生津',
  '岩骨厚实',
  '青苔幽兰',
  '熟果蜜韵',
  '回甘鸣泉',
  '清凉冷矿',
  '松风蟹眼',
] as const;

/**
 * Pre-seeded sample diaries for demo continuity
 */
export const INITIAL_TEA_DIARIES: Record<string, TeaSessionDiaryEntry> = {
  'demo-booking-01': {
    id: 'diary-demo-01',
    bookingId: 'demo-booking-01',
    roomName: '听竹 · 越窑秘色席',
    date: '2024.03.10',
    timeSlot: '14:00 - 16:00',
    sommelier: '苏婉',
    teaWare: '潮州孟臣款·老梨皮朱泥手拉壶、橄榄炭红泥火炉、景德镇描金白瓷公道杯',
    teaName: '沉芳·武夷岩茶（正岩）',
    teaExperience:
      '炭火候汤至蟹眼初沸，注水高冲。前两泡荔枝炭木质熟香沉入茶汤，第四泡喉底泛起极清幽的兰花冷香，汤质饱满如稠米汤，两颊生津久久不散。',
    createdAt: '2024.03.10 16:30',
    extractedTags: ['重焙老火', '岩骨厚实', '米汤稠滑', '喉底生津'],
    radarDeltas: {
      roast: 8,
      aroma: 6,
      sweetness: 12,
      mouthfeel: 10,
      throatCharm: 14,
    },
    terroirSummary: '正岩慧苑坑深谷微气候显著，炭火与岩矿茶骨交融，喉韵深邃凝练。',
    sommelierNote: '客官气定神闲，于四泡后体会到正岩之真骨，品味纯正，与此器极合。',
    syncedToTerroirProfile: true,
  },
};

const STORAGE_KEY = 'ccjy_user_tea_diaries';

/**
 * Local evaluation fallback when server or API key is not ready
 */
export function evaluateTeaDiaryLocally(
  teaWare: string,
  teaName: string,
  experience: string
): AITeaDiaryAnalysisResult {
  const combined = (teaWare + ' ' + teaName + ' ' + experience).toLowerCase();

  const extractedTags: string[] = [];
  const deltas = {
    roast: 5,
    aroma: 5,
    sweetness: 5,
    mouthfeel: 5,
    throatCharm: 5,
  };

  // Rule-based heuristic extraction
  if (combined.includes('岩') || combined.includes('肉桂') || combined.includes('大红袍') || combined.includes('焙火') || combined.includes('火')) {
    extractedTags.push('岩骨厚实', '重焙老火');
    deltas.roast += 6;
    deltas.throatCharm += 8;
  }
  if (combined.includes('单丛') || combined.includes('香') || combined.includes('兰') || combined.includes('花')) {
    extractedTags.push('冷杯留香', '幽兰暗香');
    deltas.aroma += 8;
    deltas.sweetness += 5;
  }
  if (combined.includes('普洱') || combined.includes('青饼') || combined.includes('干仓') || combined.includes('稠') || combined.includes('滑')) {
    extractedTags.push('米汤稠滑', '熟药樟香');
    deltas.mouthfeel += 8;
    deltas.sweetness += 6;
  }
  if (combined.includes('甘') || combined.includes('生津') || combined.includes('泉') || combined.includes('润')) {
    extractedTags.push('喉底生津', '回甘鸣泉');
    deltas.sweetness += 8;
    deltas.throatCharm += 6;
  }

  // Ensure at least 3 distinct tags
  if (extractedTags.length < 3) {
    extractedTags.push('喉底生津', '冷杯留香', '岩骨厚实');
  }

  const uniqueTags = Array.from(new Set(extractedTags)).slice(0, 4);

  return {
    extractedTags: uniqueTags,
    radarDeltas: deltas,
    terroirSummary: `器物选配【${teaWare.slice(0, 10)}...】温润得当，充分激发【${teaName}】山场天然风骨，茶汤质感与喉韵兼备。`,
    sommelierNote: '茶人与茶器心神合一，慢品细啜，已将当日雅席体感完美化入个人风土谱系。',
    source: 'curated-expert',
  };
}

/**
 * Retrieve all tea diaries from localStorage with pre-seeded fallback
 */
export function getAllTeaDiaries(): Record<string, TeaSessionDiaryEntry> {
  if (typeof window === 'undefined') return INITIAL_TEA_DIARIES;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...INITIAL_TEA_DIARIES, ...parsed };
    }
  } catch {
    // fallback
  }

  return INITIAL_TEA_DIARIES;
}

/**
 * Save or update a tea diary entry, and persist to localStorage
 */
export function saveTeaDiaryEntry(diary: TeaSessionDiaryEntry): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getAllTeaDiaries();
    const updated = {
      ...existing,
      [diary.bookingId]: diary,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save tea diary to localStorage:', e);
  }
}

/**
 * Merge newly extracted tasting tags into user's overall custom palate tags
 */
export function mergeDiaryTagsIntoPalateTags(
  currentTags: string[],
  newDiaryTags: string[]
): string[] {
  const set = new Set([...newDiaryTags, ...currentTags]);
  return Array.from(set).slice(0, 8);
}
