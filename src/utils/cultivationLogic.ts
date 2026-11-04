/**
 * Cultivation Logic (茶道修行五重境界)
 * Pure business logic for tracking tea mindfulness progress, stages, and badges.
 *
 * 境界阶梯：
 * 1. 初芽 (Chū Yá) - 涉世初识草木清
 * 2. 问茗 (Wèn Míng) - 辨山场、识炭火
 * 3. 识器 (Shí Qì) - 一壶事一茶，手拉朱泥与白瓷
 * 4. 承艺 (Chéng Yì) - 关公巡城、韩信点兵，得工夫正统
 * 5. 宗师 (Zōng Shī) - 太虚归朴，万物静观皆自得
 */

export type CultivationStageKey = 'chouya' | 'wenming' | 'shiqi' | 'chengyi' | 'zongshi';

export interface CultivationBadge {
  id: CultivationStageKey;
  order: number;
  name: string;
  pinyin: string;
  title: string;
  enTitle: string;
  sealChar: string;
  minPoints: number;
  minBookings: number;
  poeticQuote: string;
  lore: string;
  privilegeSummary: string;
  perks: string[];
  themeColor: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    sealBorder: string;
    gradient: string;
  };
}

export const CULTIVATION_STAGES: Record<CultivationStageKey, CultivationBadge> = {
  chouya: {
    id: 'chouya',
    order: 1,
    name: '初芽',
    pinyin: 'Chū Yá',
    title: '嫩芽初绽 · 始发春意',
    enTitle: 'Tender Sprout',
    sealChar: '芽',
    minPoints: 0,
    minBookings: 0,
    poeticQuote: '涉世初识草木清，案头初焙一枝春。',
    lore: '茶道始于草木之初，取高山原叶之一抹苍翠，以纯净之心体悟甘苦之始。',
    privilegeSummary: '解锁《春城嘉叶入门茶艺手记》与初阶席主印记',
    perks: ['正品山场溯源专属标记', '每日朝夕点茶打卡权益', '入门茶艺心法全量品读'],
    themeColor: {
      bg: '#F2F7F4',
      border: '#D3E2D8',
      text: '#234430',
      accent: '#3E7B54',
      sealBorder: '#3E7B54',
      gradient: 'from-[#2C4A38] to-[#1F3629]',
    },
  },
  wenming: {
    id: 'wenming',
    order: 2,
    name: '问茗',
    pinyin: 'Wèn Míng',
    title: '冷泉激香 · 辨风识味',
    enTitle: 'Tea Inquirer',
    sealChar: '茗',
    minPoints: 1000,
    minBookings: 1,
    poeticQuote: '辨单丛诸心山场，识武夷炭火骨香。',
    lore: '出离粗浅啜饮，知晓凤凰山乌岽水栀子之高锐花香，识得武夷三坑两涧炭火老枞之深沉骨韵。',
    privilegeSummary: '解锁山场风土原叶图谱与专属季度尝鲜小泡礼',
    perks: ['每月获赠当季特选手选茶样', '茶室预订立减与专属侍茶位', '朝夕点茶茗元代币额外加成'],
    themeColor: {
      bg: '#F5F5EC',
      border: '#E1DECA',
      text: '#44422B',
      accent: '#7D7644',
      sealBorder: '#7D7644',
      gradient: 'from-[#423F27] to-[#2B291A]',
    },
  },
  shiqi: {
    id: 'shiqi',
    order: 3,
    name: '识器',
    pinyin: 'Shí Qì',
    title: '紫泥丹火 · 一器分寸',
    enTitle: 'Vessel Connoisseur',
    sealChar: '器',
    minPoints: 3500,
    minBookings: 2,
    poeticQuote: '一壶事一茶，手拉孟臣，金口玉言有分寸。',
    lore: '深入领悟器物与茶汤相辅之妙，明晰潮州名师吴瑞全手拉薄壁朱泥与景德镇凝脂白杯出汤之分寸。',
    privilegeSummary: '潮州非遗手拉壶与名家紫砂专属优先认购权',
    perks: ['名家手拉朱泥壶限量发售优先席', '春城嘉叶官方名器免费养护服务', '器物寄售流转享超低手续费'],
    themeColor: {
      bg: '#FAF4EF',
      border: '#EAD9CB',
      text: '#583626',
      accent: '#9A4D2E',
      sealBorder: '#9A4D2E',
      gradient: 'from-[#5A2C1C] to-[#3B190E]',
    },
  },
  chengyi: {
    id: 'chengyi',
    order: 4,
    name: '承艺',
    pinyin: 'Chéng Yì',
    title: '雅席传炉 · 工夫圆融',
    enTitle: 'Craft Bearer',
    sealChar: '艺',
    minPoints: 8000,
    minBookings: 4,
    poeticQuote: '关公巡城汤自均，韩信点兵滴尽甘。',
    lore: '纳茶、高冲、巡城、点兵，手法沉静从容，一席之间宾主尽欢，深得东方茶道温良敦厚之精髓。',
    privilegeSummary: '私享茶室专属定制雅集与首席侍茶师同席研讨',
    perks: ['定制主题茶席（含私享空间置换）', '春城嘉叶年度尊荣茶礼配额', '雅席柬帖金石专属印记定制'],
    themeColor: {
      bg: '#F6F3EB',
      border: '#E2DAC8',
      text: '#473E29',
      accent: '#967B45',
      sealBorder: '#967B45',
      gradient: 'from-[#3A3222] to-[#251F14]',
    },
  },
  zongshi: {
    id: 'zongshi',
    order: 5,
    name: '宗师',
    pinyin: 'Zōng Shī',
    title: '太虚归朴 · 万物自得',
    enTitle: 'Tea Grandmaster',
    sealChar: '宗',
    minPoints: 18000,
    minBookings: 8,
    poeticQuote: '山水归于杯盏，万物静观皆自得。',
    lore: '融会贯通，技进乎道。繁华落尽见真淳，不论粗陶细瓷、名峰野茶，皆能化为胸中山水。',
    privilegeSummary: '春城嘉叶母仓私家封坛专属权与殿堂传世茶器终身鉴藏礼遇',
    perks: ['私家定制古树封坛专属仓位', '春城嘉叶茶舍全席位免预约留席', '专属定制曜变玄金至尊实体印章'],
    themeColor: {
      bg: '#F8F6F0',
      border: '#D9C8A5',
      text: '#1E2320',
      accent: '#BFA15F',
      sealBorder: '#BFA15F',
      gradient: 'from-[#1E2320] via-[#2A342D] to-[#121614]',
    },
  },
};

export const CULTIVATION_STAGE_ORDER: CultivationStageKey[] = [
  'chouya',
  'wenming',
  'shiqi',
  'chengyi',
  'zongshi',
];

export interface StageBadgeStatus extends CultivationBadge {
  isUnlocked: boolean;
  isCurrent: boolean;
  unlockRequirementText: string;
}

export interface CultivationProgress {
  currentStage: CultivationBadge;
  currentStageKey: CultivationStageKey;
  nextStage: CultivationBadge | null;
  isMaxStage: boolean;
  overallProgressPercent: number; // 0 - 100
  pointsCurrent: number;
  bookingsCurrent: number;
  nextPointsRequired: number;
  nextBookingsRequired: number;
  pointsMet: boolean;
  bookingsMet: boolean;
  pointsRemaining: number;
  bookingsRemaining: number;
  stageBadges: StageBadgeStatus[];
  summaryHint: string;
}

/**
 * Calculates current cultivation stage and progress details.
 */
export function calculateCultivationProgress(
  leafPoints: number,
  salonBookingsCount: number
): CultivationProgress {
  const points = Math.max(0, leafPoints);
  const bookings = Math.max(0, salonBookingsCount);

  // Determine highest unlocked stage in order
  let currentKey: CultivationStageKey = 'chouya';
  for (const key of CULTIVATION_STAGE_ORDER) {
    const stage = CULTIVATION_STAGES[key];
    if (points >= stage.minPoints && bookings >= stage.minBookings) {
      currentKey = key;
    }
  }

  const currentStage = CULTIVATION_STAGES[currentKey];
  const currentIndex = CULTIVATION_STAGE_ORDER.indexOf(currentKey);
  const isMaxStage = currentIndex === CULTIVATION_STAGE_ORDER.length - 1;
  const nextStage = isMaxStage ? null : CULTIVATION_STAGES[CULTIVATION_STAGE_ORDER[currentIndex + 1]];

  let nextPointsRequired = 0;
  let nextBookingsRequired = 0;
  let pointsRemaining = 0;
  let bookingsRemaining = 0;
  let pointsMet = true;
  let bookingsMet = true;
  let overallProgressPercent = 100;
  let summaryHint = '已臻茶道至高境界，太虚归朴，万物自得。';

  if (nextStage) {
    nextPointsRequired = nextStage.minPoints;
    nextBookingsRequired = nextStage.minBookings;
    pointsRemaining = Math.max(0, nextStage.minPoints - points);
    bookingsRemaining = Math.max(0, nextStage.minBookings - bookings);
    pointsMet = pointsRemaining === 0;
    bookingsMet = bookingsRemaining === 0;

    // Calculate progression between currentStage and nextStage
    const pointsSpan = Math.max(1, nextStage.minPoints - currentStage.minPoints);
    const pointsAchieved = Math.min(pointsSpan, Math.max(0, points - currentStage.minPoints));
    const pointsRatio = pointsAchieved / pointsSpan;

    const bookingsSpan = Math.max(1, nextStage.minBookings - currentStage.minBookings);
    const bookingsAchieved = Math.min(bookingsSpan, Math.max(0, bookings - currentStage.minBookings));
    const bookingsRatio = bookingsAchieved / bookingsSpan;

    // Both criteria contribute equally to stage advancement
    const rawProgress = (pointsRatio * 0.5 + bookingsRatio * 0.5) * 100;
    overallProgressPercent = Math.min(99, Math.max(1, Math.round(rawProgress)));

    if (!pointsMet && !bookingsMet) {
      summaryHint = `距离晋阶【${nextStage.name}】：尚需 ${pointsRemaining.toLocaleString()} 积分，及 ${bookingsRemaining} 次茶室预约`;
    } else if (!pointsMet) {
      summaryHint = `距离晋阶【${nextStage.name}】：茶室预约已达成，尚需 ${pointsRemaining.toLocaleString()} 积分`;
    } else if (!bookingsMet) {
      summaryHint = `距离晋阶【${nextStage.name}】：积分已达成，尚需 ${bookingsRemaining} 次茶室预约`;
    } else {
      summaryHint = `已达成【${nextStage.name}】晋阶条件`;
    }
  }

  // Build badge status array
  const stageBadges: StageBadgeStatus[] = CULTIVATION_STAGE_ORDER.map((key) => {
    const stage = CULTIVATION_STAGES[key];
    const isUnlocked = points >= stage.minPoints && bookings >= stage.minBookings;
    const isCurrent = key === currentKey;
    const unlockRequirementText =
      stage.order === 1
        ? '初始启蒙解锁'
        : `累计 ${stage.minPoints.toLocaleString()} 积分 + ${stage.minBookings} 次茶室预约`;

    return {
      ...stage,
      isUnlocked,
      isCurrent,
      unlockRequirementText,
    };
  });

  return {
    currentStage,
    currentStageKey: currentKey,
    nextStage,
    isMaxStage,
    overallProgressPercent,
    pointsCurrent: points,
    bookingsCurrent: bookings,
    nextPointsRequired,
    nextBookingsRequired,
    pointsMet,
    bookingsMet,
    pointsRemaining,
    bookingsRemaining,
    stageBadges,
    summaryHint,
  };
}
