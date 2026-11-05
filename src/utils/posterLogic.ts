/**
 * Pure business logic and data models for
 * 「茶室预约 · 雅席邀约海报」 (Tea Salon Invitation Poster & Sensory Synthesis)
 */

import { BookingInvitationData } from '../components/TeaInvitationModal';

export interface PosterTheme {
  id: 'ink' | 'xuan' | 'gold';
  name: string;
  enName: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  sealColor: string;
  borderColor: string;
  bgTextureClass: string;
}

export const POSTER_THEMES: PosterTheme[] = [
  {
    id: 'ink',
    name: '幽玄墨韵',
    enName: 'Deep Ink & Mist',
    bgColor: '#161F1A',
    cardBg: '#1D2721',
    textColor: '#FAF8F5',
    accentColor: '#D8C496',
    sealColor: '#C44133',
    borderColor: '#394B3F',
    bgTextureClass: 'from-[#141C18] via-[#1C2620] to-[#121A15]',
  },
  {
    id: 'xuan',
    name: '素绢竹影',
    enName: 'Raw Silk & Bamboo',
    bgColor: '#F5EFE3',
    cardBg: '#FFFDF9',
    textColor: '#232B26',
    accentColor: '#8F733E',
    sealColor: '#B23A2B',
    borderColor: '#D8C7A5',
    bgTextureClass: 'from-[#FBF7EE] via-[#F4EDE0] to-[#EBE2D1]',
  },
  {
    id: 'gold',
    name: '宋锦沉金',
    enName: 'Song Brocade Gold',
    bgColor: '#2B2319',
    cardBg: '#352C1F',
    textColor: '#FDFBF7',
    accentColor: '#E6C687',
    sealColor: '#D14836',
    borderColor: '#544633',
    bgTextureClass: 'from-[#292117] via-[#382D20] to-[#221A12]',
  },
];

export interface TeaSensoryGraphData {
  teaName: string;
  category: string;
  radarScores: {
    aroma: number;      // 0 - 100 香扬高扬
    roast: number;      // 0 - 100 焙火火候
    sweetness: number;  // 0 - 100 回甘生津
    body: number;       // 0 - 100 稠滑厚度
    throatCharm: number;// 0 - 100 喉韵岩气
  };
  keyDescriptors: string[];
  topNote: string;
  heartNote: string;
  baseNote: string;
}

export interface SalonPosterSynthesisData {
  poeticTitle: string;
  invitationVerse: string[]; // 4 lines of poetry
  sealText: string;
  teaSensory: TeaSensoryGraphData;
  brewingRitual: string;
  hostSignature: string;
  generatedAt: string;
}

/**
 * Standard Curated Tea Sensories by Tea Name keywords
 */
export function getSensoryForPairedTea(pairedTea: string): TeaSensoryGraphData {
  const lower = (pairedTea || '').toLowerCase();

  if (lower.includes('水仙') || lower.includes('老枞') || lower.includes('慧苑')) {
    return {
      teaName: pairedTea || '三坑两涧 · 老枞水仙',
      category: '正岩武夷岩茶',
      radarScores: { aroma: 88, roast: 92, sweetness: 90, body: 96, throatCharm: 98 },
      keyDescriptors: ['百年老苔藓', '三坑岩骨', '木质冷香', '稠滑若凝脂'],
      topNote: '初沸迎面炭火熟果与老木苍苔香',
      heartNote: '茶汤入喉若米汤般滑润，棕叶香沉着',
      baseNote: '冷杯底持久留宿矿泉甘冽与岩韵',
    };
  }

  if (lower.includes('肉桂') || lower.includes('水龙吟') || lower.includes('天心岩')) {
    return {
      teaName: pairedTea || '牛栏坑 · 正岩肉桂',
      category: '正岩武夷岩茶',
      radarScores: { aroma: 96, roast: 90, sweetness: 92, body: 94, throatCharm: 95 },
      keyDescriptors: ['辛锐桂皮', '焦糖奶油', '骨力雄健', '生津极其迅猛'],
      topNote: '辛香扑鼻直冲天灵，透出焦糖与桂花蜜意',
      heartNote: '汤感刚劲霸气，落喉如泉涌般回甘',
      baseNote: '挂杯岩韵历久不散，喉底长留清凉',
    };
  }

  if (lower.includes('单丛') || lower.includes('诸心') || lower.includes('清风') || lower.includes('栀子')) {
    return {
      teaName: pairedTea || '乌岽顶 · 凤凰单丛',
      category: '高山老丛单丛',
      radarScores: { aroma: 98, roast: 82, sweetness: 94, body: 90, throatCharm: 92 },
      keyDescriptors: ['幽兰水栀', '高山蜜韵', '通顶冷香', '舌底鸣泉'],
      topNote: '开盖栀子花香与山野蜜香高锐四溢',
      heartNote: '滚水急出不闷，清甜如吮甘泉，微涩瞬化',
      baseNote: '两颊清风徐来，杯底冷香经久不绝',
    };
  }

  if (lower.includes('白茶') || lower.includes('银针') || lower.includes('白鸡冠')) {
    return {
      teaName: pairedTea || '荒野高山 · 头春白毫银针',
      category: '高山荒野白茶',
      radarScores: { aroma: 94, roast: 60, sweetness: 96, body: 88, throatCharm: 90 },
      keyDescriptors: ['毫香馥郁', '淡竹清凉', '野花蜜韵', '清澈甘泉'],
      topNote: '清新毫香如深山初春晨露',
      heartNote: '茶汤澄澈如玉，入口极甜润清冽',
      baseNote: '喉底清爽怡人，通体生凉意',
    };
  }

  // Default Puer / Aged Tea
  return {
    teaName: pairedTea || '春城嘉叶 · 传世经典老茶',
    category: '纯干仓老陈茶',
    radarScores: { aroma: 86, roast: 88, sweetness: 94, body: 96, throatCharm: 95 },
    keyDescriptors: ['沉香老木', '温润如玉', '经年陈韵', '体感通达'],
    topNote: '药香沉稳，伴随岁月陈化自然木质香',
    heartNote: '入口即化，稠厚温顺，腹中微温',
    baseNote: '长久喉韵留甘，气走百脉',
  };
}

/**
 * Curated Deterministic Poster Synthesis Generator
 */
export function generateCuratedPosterData(
  booking: BookingInvitationData,
  themeId: 'ink' | 'xuan' | 'gold' = 'ink'
): SalonPosterSynthesisData {
  const sensory = getSensoryForPairedTea(booking.pairedTea);

  // Generate tailored 4-line poem depending on room theme
  let poeticTitle = '月藏幽席 · 烹泉候君';
  let invitationVerse = [
    '幽篁深院月盈轩，',
    '一缕岩香落古源。',
    '水沸松风尘事远，',
    '候君秉烛共清言。',
  ];
  let brewingRitual = '鼎沸纯净山泉，潮州手拉朱泥急出三巡，候客踏露而来。';

  const roomName = booking.roomName || '';
  if (roomName.includes('竹寂')) {
    poeticTitle = '竹影风清 · 素心茶聚';
    invitationVerse = [
      '修竹摇翠日初长，',
      '素壁清风透暗香。',
      '客至心闲无俗累，',
      '慢煨山骨对虚堂。',
    ];
    brewingRitual = '竹炉初沸，景德镇描金白杯分汤，细品清欢一刻。';
  } else if (roomName.includes('裕唐')) {
    poeticTitle = '墨韵唐风 · 雅集盛席';
    invitationVerse = [
      '古案金石聚雅客，',
      '紫泥凝雪试新泉。',
      '一瓯沉水通灵气，',
      '谈笑浮生胜列仙。',
    ];
    brewingRitual = '双侍茶师执席，深坑母仓珍藏老茶连啜十二巡。';
  }

  return {
    poeticTitle,
    invitationVerse,
    sealText: '春城雅席',
    teaSensory: sensory,
    brewingRitual,
    hostSignature: '春城嘉叶 · 敬邀',
    generatedAt: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
  };
}
