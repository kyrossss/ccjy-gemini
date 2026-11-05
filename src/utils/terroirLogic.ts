import * as d3 from 'd3';
import type { TeaItem } from '../data/mockData';

/**
 * Terroir & Sensory Aroma Map business logic for "寻味茶山" (Explore Tea Mountains)
 */

export interface TerroirRegion {
  id: string;
  name: string;
  province: string;
  pinyin: string;
  altitude: string;
  soil: string;
  climate: string;
  signatureTea: string;
  characterSummary: string;
  matchedProductId?: string;
  coverImage: string;
  defaultProfile: TerroirSensoryProfile;
}

export interface TerroirSensoryProfile {
  regionId: string;
  regionName: string;
  teaType: string;
  tagline: string;
  poeticVision: string;
  terroirEssence: string;
  radarScores: {
    aroma: number; // 0 - 100
    mineralBody: number; // 0 - 100
    sweetness: number; // 0 - 100
    mouthfeel: number; // 0 - 100
    throatDepth: number; // 0 - 100
  };
  notes: {
    top: string; // 迎鼻初香
    heart: string; // 啜饮落水香
    base: string; // 杯底冷香与喉韵
  };
  keyAromaDescriptors: string[];
  brewingImpression: string;
}

export const TEA_REGIONS: TerroirRegion[] = [
  {
    id: 'wuyi',
    name: '武夷山 · 正岩三坑两涧',
    province: '福建 · 南平',
    pinyin: 'WUYI MOUNTAIN',
    altitude: '650m - 1200m 丹霞幽谷',
    soil: '烂石砾质红砂岩 · 富含钾锌微量矿质',
    climate: '九曲回环 · 日照短促 · 岚气常凝',
    signatureTea: '正岩老枞水仙 & 坑涧肉桂',
    characterSummary: '岩骨花香，炭火沉香，老枞青苔木质味。',
    matchedProductId: 'tea-wuyi-01',
    coverImage: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
    defaultProfile: {
      regionId: 'wuyi',
      regionName: '武夷山 · 正岩三坑两涧',
      teaType: '正岩老枞水仙 & 坑涧肉桂',
      tagline: '「臻山川精英秀气所钟，岩骨花香深藏谷壑。」',
      poeticVision: '丹霞绝壁之间，泉水自风化红砂岩渗漉滴落。古树老枞根系深扎石罅，经春风与炭火淬炼，骨力劲挺，如深谷松柏之风骨。',
      terroirEssence: '独特的丹霞地貌与两涧冷泉造就极佳的酸性富钾砾土，日光漫射柔和，造就岩茶无可替代的“岩骨花香”与清冷苍苔底蕴。',
      radarScores: {
        aroma: 92,
        mineralBody: 98,
        sweetness: 88,
        mouthfeel: 95,
        throatDepth: 96,
      },
      notes: {
        top: '焙火焦糖香 · 辛锐桂皮幽香',
        heart: '熟成水蜜桃 · 百年青苔木质香 · 幽兰落水',
        base: '冷杯深沉熟果香 · 挂杯岩矿泉韵久留',
      },
      keyAromaDescriptors: ['岩骨花香', '老枞青苔', '炭火沉芳', '辛锐肉桂', '砂岩冷泉'],
      brewingImpression: '第一泡沸水激荡，炭火香与兰香四溢；三泡之后，老枞木质之骨韵尽显，喉间清凉生津如含幽谷清泉。',
    },
  },
  {
    id: 'wudong',
    name: '潮州 · 凤凰山乌岽顶',
    province: '广东 · 潮州',
    pinyin: 'WUDONG PEAK',
    altitude: '1000m - 1392m 天池高岗',
    soil: '火山凝灰岩黄红壤 · 土层深厚腐殖质富集',
    climate: '高山云雾漫漫 · 昼夜温差大 · 晨曦凝露',
    signatureTea: '凤凰单丛（诸心 / 鸭屎香 / 水栀子）',
    characterSummary: '天然花香百变，山韵清绝，高锐透顶。',
    matchedProductId: 'tea-dancong-01',
    coverImage: '/assets/aistudio/IMG_6486_3fb9fe71.JPG',
    defaultProfile: {
      regionId: 'wudong',
      regionName: '潮州 · 凤凰山乌岽顶',
      teaType: '凤凰单丛（乌岽高山单株）',
      tagline: '「云岫之颠孕高香，冷泉激石发天籁。」',
      poeticVision: '近邻凤凰天池古火山口，晨昏常有云海吐纳。山风掠过千年茶树苍劲枝叶，激荡出如栀子如幽兰之绝伦奇香。',
      terroirEssence: '高海拔强紫外光与大温差促进了单丛挥发性芳香酯类物质的极致累积，火山岩母质土壤赋予其独特的“山韵”与通透高扬感。',
      radarScores: {
        aroma: 99,
        mineralBody: 89,
        sweetness: 92,
        mouthfeel: 90,
        throatDepth: 94,
      },
      notes: {
        top: '水栀子初绽 · 蜜兰清芬直冲鼻端',
        heart: '金银花落水 · 杏仁甜果香 · 冰糖清甘',
        base: '冷杯含幽兰奇香 · 喉底通透明澈山韵',
      },
      keyAromaDescriptors: ['栀子初绽', '蜜兰通透', '天池山韵', '冰糖甜润', '高锐花芬'],
      brewingImpression: '滚水高冲瞬息出汤，满室兰花栀子争艳；汤感醇滑带微苦，旋即化作漫长甘冽山泉之息。',
    },
  },
  {
    id: 'xihu',
    name: '西湖 · 狮峰翁家山',
    province: '浙江 · 杭州',
    pinyin: 'WEST LAKE SHIFENG',
    altitude: '150m - 350m 湖山抱翠',
    soil: '石英白砂岩风化微酸土壤',
    climate: '暖湿气流顺钱塘江而上 · 湖光山色润养',
    signatureTea: '狮峰龙井 · 头春手工特级',
    characterSummary: '鲜嫩豆香与炒蚕豆香，嫩栗清甘，色如糙米糙黄。',
    matchedProductId: 'tea-xihu-01',
    coverImage: '/assets/aistudio/IMG_6491_1582fce7.JPG',
    defaultProfile: {
      regionId: 'xihu',
      regionName: '西湖 · 狮峰翁家山',
      teaType: '狮峰龙井（头春群体种）',
      tagline: '「天下名茶数龙井，狮峰绝顶见芳华。」',
      poeticVision: '春分谷雨之间，狮子峰下朝露未晞。铁锅手炒十法起落翻飞，片片翠带糙黄，尽收江南三月最纯粹的生机与秀雅。',
      terroirEssence: '狮峰独特的石英砂土透气保肥，东南向阳山坡避寒聚气，氨基酸含量极高，赋予茶汤嫩栗香与鲜爽甘醇的黄金平衡。',
      radarScores: {
        aroma: 93,
        mineralBody: 82,
        sweetness: 96,
        mouthfeel: 88,
        throatDepth: 86,
      },
      notes: {
        top: '炒青嫩蚕豆香 · 烘烤清甜板栗香',
        heart: '初春嫩竹笋鲜气 · 甜花清露落水',
        base: '清雅甘冽豆奶甜香 · 留齿生津绵长',
      },
      keyAromaDescriptors: ['嫩栗清甘', '炒青豆香', '江南鲜爽', '幽柔兰香', '初春秀雅'],
      brewingImpression: '85℃清泉慢瀹，芽叶翩跹如雀舌沉浮；啜之鲜若晨露，甘润如饮初春山泉，舌底鸣泉回甘悠悠。',
    },
  },
  {
    id: 'menghai',
    name: '勐海 · 布朗山老班章',
    province: '云南 · 西双版纳',
    pinyin: 'MENGHAI BULANG',
    altitude: '1600m - 1900m 原始密林',
    soil: '原始热带雨林红壤与厚层落叶腐殖土',
    climate: '冬无严寒夏无酷暑 · 雾锁千山 · 生态共生',
    signatureTea: '古树纯料普洱生茶',
    characterSummary: '霸悍气韵，苦涩秒化，野蜜花香与樟香悠长。',
    matchedProductId: 'tea-menghai-01',
    coverImage: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    defaultProfile: {
      regionId: 'menghai',
      regionName: '勐海 · 布朗山老班章',
      teaType: '老班章古树纯料生普',
      tagline: '「原始幽林蕴霸气，回甘如潮荡胸怀。」',
      poeticVision: '澜沧江流域热带季雨林中，百年古茶树与古木苔藓藤蔓共生。粗壮肥硕的茶芽凝结着天地野性，茶气刚烈澎湃，落喉化甘。',
      terroirEssence: '千百年来深厚森林落叶积攒的腐殖质，造就了茶多酚与咖啡碱的极致充盈，展现出“霸道刚劲、回甘猛烈、气韵入丹田”的王者气象。',
      radarScores: {
        aroma: 91,
        mineralBody: 96,
        sweetness: 97,
        mouthfeel: 98,
        throatDepth: 99,
      },
      notes: {
        top: '山野森林气 · 苍劲干松与野兰花香',
        heart: '浓酽蜜糖香 · 药香樟香若隐若现',
        base: '空杯冷凝深沉蜜蜡香 · 喉韵深沉持久不退',
      },
      keyAromaDescriptors: ['霸气回甘', '野蜜深芳', '原始樟香', '粘稠饱满', '苍茫气韵'],
      brewingImpression: '入口略带猛烈苦涩，瞬间在口腔与喉间化作奔涌回甘，体感温热微汗，茶气通畅无匹。',
    },
  },
  {
    id: 'fuding',
    name: '福鼎 · 太姥山荒野高山',
    province: '福建 · 宁德',
    pinyin: 'FUDING TAIMU',
    altitude: '600m - 900m 海上仙都',
    soil: '花岗岩风化黄红壤 · 富含有机质',
    climate: '山海交汇 · 暖湿多雾 · 日照柔和',
    signatureTea: '荒野头春白毫银针 & 陈年老白茶',
    characterSummary: '毫香清鲜如蜜，野性清芬，陈年转药香枣香。',
    matchedProductId: 'tea-fuding-01',
    coverImage: '/assets/aistudio/IMG_6492_3fd88e0f.JPG',
    defaultProfile: {
      regionId: 'fuding',
      regionName: '福鼎 · 太姥山荒野高山',
      teaType: '高山荒野白毫银针',
      tagline: '「山海相拥凝白毫，自然萎凋见真淳。」',
      poeticVision: '太姥山奇峰怪石之间，荒芜茶园经数十年野化。春分初阳晒青，不炒不揉，将海风山岚与阳光气息悉数封存于密密白毫中。',
      terroirEssence: '海雾弥漫与花岗岩土壤使茶树富含茶氨酸，纯日光自然萎凋最大限度保留了活性酶，造就清透如玉、毫香与野性蜜韵并存的纯净质感。',
      radarScores: {
        aroma: 90,
        mineralBody: 86,
        sweetness: 98,
        mouthfeel: 93,
        throatDepth: 91,
      },
      notes: {
        top: '晒干芦苇草香 · 初春绒毛鲜甜毫香',
        heart: '野花蜜清露 · 鲜杏浆果香',
        base: '清雅甘草甜香 · 喉底丝丝凉韵',
      },
      keyAromaDescriptors: ['纯净毫香', '日晒鲜甜', '野花蜜韵', '太姥山海', '温润如玉'],
      brewingImpression: '茶汤清澄如杏黄美玉，满杯白毫浮动如银雪；入口鲜爽甘甜，如吮吸高山春晨花瓣上的清露。',
    },
  },
];

/**
 * Find region by ID
 */
export function getRegionById(id: string): TerroirRegion {
  return TEA_REGIONS.find((r) => r.id === id) || TEA_REGIONS[0];
}

/**
 * Format score into level description
 */
export function getScoreLevelCN(score: number): string {
  if (score >= 95) return '极品至境';
  if (score >= 90) return '超卓优异';
  if (score >= 85) return '醇正充沛';
  return '清雅宜人';
}

export interface TerroirRadarAxisMeta {
  key: keyof TerroirSensoryProfile['radarScores'];
  label: string;
  shortLabel: string;
  poeticSubtitle: string;
  spectrumDesc: string;
}

export const TERROIR_RADAR_AXES: TerroirRadarAxisMeta[] = [
  {
    key: 'aroma',
    label: '高锐清芳度',
    shortLabel: '清芳扬香',
    poeticSubtitle: '西湖清芳 · 乌岽花芬',
    spectrumDesc: '衡量干茶与初沸迎鼻时的挥发性芳香酯浓度，体现花香、嫩栗香与毫香的扬散张力。',
  },
  {
    key: 'mineralBody',
    label: '山场岩骨韵',
    shortLabel: '武夷岩韵',
    poeticSubtitle: '丹霞烂石 · 骨力劲挺',
    spectrumDesc: '源于风化砾岩与火山腐殖土的钾、锌、镁微量矿质，赋予茶汤独特的砂岩冷泉感与骨架。',
  },
  {
    key: 'throatDepth',
    label: '喉韵幽长度',
    shortLabel: '幽谷喉韵',
    poeticSubtitle: '挂杯冷香 · 气入丹田',
    spectrumDesc: '茶汤吞咽后在喉底留存的清凉感、木质枞味与冷杯余香持久度。',
  },
  {
    key: 'mouthfeel',
    label: '汤感稠厚度',
    shortLabel: '汤感稠滑',
    poeticSubtitle: '茶胶饱满 · 顺滑如绢',
    spectrumDesc: '水浸出物与果胶多糖带来的包裹感，决定茶汤入口是清冽灵动还是酽润如浆。',
  },
  {
    key: 'sweetness',
    label: '回甘生津度',
    shortLabel: '鸣泉回甘',
    poeticSubtitle: '舌底鸣泉 · 冰糖甜润',
    spectrumDesc: '茶多酚与游离氨基酸协同激发的两颊生津速度及口腔持久冰糖甜意。',
  },
];

export interface RegionThemeMeta {
  regionId: string;
  signatureCharm: string; // e.g. 武夷岩韵 / 西湖清芳
  strokeColor: string;
  fillColor: string;
  badgeBg: string;
  badgeText: string;
}

export const REGION_THEME_MAP: Record<string, RegionThemeMeta> = {
  wuyi: {
    regionId: 'wuyi',
    signatureCharm: '武夷岩韵 · 岩骨花香',
    strokeColor: '#8F4B2D',
    fillColor: 'rgba(143, 75, 45, 0.26)',
    badgeBg: '#FAF0EB',
    badgeText: '#8F4B2D',
  },
  wudong: {
    regionId: 'wudong',
    signatureCharm: '乌岽山韵 · 天池高香',
    strokeColor: '#8F733E',
    fillColor: 'rgba(143, 115, 62, 0.25)',
    badgeBg: '#FAF5E8',
    badgeText: '#8F733E',
  },
  xihu: {
    regionId: 'xihu',
    signatureCharm: '西湖清芳 · 嫩栗春露',
    strokeColor: '#2E6840',
    fillColor: 'rgba(46, 104, 64, 0.24)',
    badgeBg: '#EBF4EE',
    badgeText: '#2E6840',
  },
  menghai: {
    regionId: 'menghai',
    signatureCharm: '布朗霸韵 · 原始野气',
    strokeColor: '#5C3A21',
    fillColor: 'rgba(92, 58, 33, 0.26)',
    badgeBg: '#F4EFEA',
    badgeText: '#5C3A21',
  },
  fuding: {
    regionId: 'fuding',
    signatureCharm: '太姥毫韵 · 日晒清甜',
    strokeColor: '#3A5F6F',
    fillColor: 'rgba(58, 95, 111, 0.24)',
    badgeBg: '#EDF3F6',
    badgeText: '#3A5F6F',
  },
};

export function getRegionThemeMeta(regionId: string): RegionThemeMeta {
  return (
    REGION_THEME_MAP[regionId] || {
      regionId,
      signatureCharm: '东方山场风土',
      strokeColor: '#8F733E',
      fillColor: 'rgba(143, 115, 62, 0.24)',
      badgeBg: '#FAF5E8',
      badgeText: '#8F733E',
    }
  );
}

/**
 * Compare primary terroir profile with an optional secondary profile for dual-region D3 radar overlay
 */
export function compareTerroirProfiles(
  primary: TerroirSensoryProfile,
  secondary?: TerroirSensoryProfile | null
): {
  dominantAxis: TerroirRadarAxisMeta;
  comparisonSummary: string;
} {
  const sortedAxes = [...TERROIR_RADAR_AXES].sort(
    (a, b) => primary.radarScores[b.key] - primary.radarScores[a.key]
  );
  const dominantAxis = sortedAxes[0];

  if (!secondary || secondary.regionId === primary.regionId) {
    return {
      dominantAxis,
      comparisonSummary: `${primary.regionName}以「${dominantAxis.label} (${primary.radarScores[dominantAxis.key]}分)」冠绝群伦，尽显${getRegionThemeMeta(primary.regionId).signatureCharm}。`,
    };
  }

  const diffAxis = [...TERROIR_RADAR_AXES].sort(
    (a, b) =>
      Math.abs(primary.radarScores[b.key] - secondary.radarScores[b.key]) -
      Math.abs(primary.radarScores[a.key] - secondary.radarScores[a.key])
  )[0];

  const pScore = primary.radarScores[diffAxis.key];
  const sScore = secondary.radarScores[diffAxis.key];
  const leaderName = pScore >= sScore ? primary.regionName : secondary.regionName;

  return {
    dominantAxis,
    comparisonSummary: `双山场风土对照：「${primary.regionName.split(' ')[0]}」与「${secondary.regionName.split(' ')[0]}」在【${diffAxis.shortLabel}】维度分野最为鲜明（${pScore} vs ${sScore}），${leaderName.split(' ')[0]}在此维度更显突出。`,
  };
}

export interface D3RadarVertexPoint {
  key: keyof TerroirSensoryProfile['radarScores'];
  axis: TerroirRadarAxisMeta;
  idx: number;
  score: number;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  angle: number;
}

export interface D3RadarGeometryResult {
  svgPathD: string;
  vertices: D3RadarVertexPoint[];
  gridRings: { level: number; points: string }[];
  maxRadius: number;
}

/**
 * Pure D3.js polar coordinate & radial path calculation for the 5-axis Terroir Radar Chart
 */
export function computeD3RadarGeometry(
  profile: TerroirSensoryProfile,
  options?: {
    maxRadius?: number;
    smoothCurve?: boolean;
  }
): D3RadarGeometryResult {
  const maxRadius = options?.maxRadius ?? 82;
  const smoothCurve = options?.smoothCurve ?? true;
  const numAxes = TERROIR_RADAR_AXES.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  const rScale = d3.scaleLinear().domain([0, 100]).range([0, maxRadius]).clamp(true);

  const radarLine = d3
    .lineRadial<number>()
    .radius((d) => rScale(d))
    .angle((_, i) => i * angleSlice)
    .curve(smoothCurve ? d3.curveCardinalClosed.tension(0.65) : d3.curveLinearClosed);

  const scores = TERROIR_RADAR_AXES.map((a) => profile.radarScores[a.key]);
  const svgPathD = radarLine(scores) || '';

  const vertices: D3RadarVertexPoint[] = TERROIR_RADAR_AXES.map((axis, idx) => {
    const score = Math.max(0, Math.min(100, profile.radarScores[axis.key] ?? 0));
    const angle = idx * angleSlice - Math.PI / 2;
    const r = rScale(score);
    const labelR = maxRadius + 24;
    return {
      key: axis.key,
      axis,
      idx,
      score,
      x: Number((r * Math.cos(angle)).toFixed(2)),
      y: Number((r * Math.sin(angle)).toFixed(2)),
      labelX: Number((labelR * Math.cos(angle)).toFixed(2)),
      labelY: Number((labelR * Math.sin(angle)).toFixed(2)),
      angle,
    };
  });

  const levels = [25, 50, 75, 100];
  const gridRings = levels.map((level) => {
    const r = rScale(level);
    const points = TERROIR_RADAR_AXES.map((_, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      return `${(r * Math.cos(angle)).toFixed(2)},${(r * Math.sin(angle)).toFixed(2)}`;
    }).join(' ');
    return { level, points };
  });

  return {
    svgPathD,
    vertices,
    gridRings,
    maxRadius,
  };
}

/**
 * Resolves the state transitions when a user clicks a tea mountain region card
 */
export function resolveRegionSelectionState(
  regionId: string,
  currentCompareRegionId: string | null = 'xihu'
): {
  selectedRegion: TerroirRegion;
  profile: TerroirSensoryProfile;
  topAxisKey: keyof TerroirSensoryProfile['radarScores'];
  nextCompareRegionId: string | null;
} {
  const selectedRegion = getRegionById(regionId);
  const profile = selectedRegion.defaultProfile;

  const sortedAxes = [...TERROIR_RADAR_AXES].sort(
    (a, b) => profile.radarScores[b.key] - profile.radarScores[a.key]
  );
  const topAxisKey = sortedAxes[0].key;

  let nextCompareRegionId = currentCompareRegionId;
  if (currentCompareRegionId === selectedRegion.id) {
    const fallbackCompare = TEA_REGIONS.find((r) => r.id !== selectedRegion.id);
    nextCompareRegionId = fallbackCompare ? fallbackCompare.id : null;
  }

  return {
    selectedRegion,
    profile,
    topAxisKey,
    nextCompareRegionId,
  };
}

/**
 * Maps a selected terroir region to its representative product and filtered product list from the catalog
 */
export function mapRegionToCatalogProducts(
  regionId: string,
  catalog: TeaItem[]
): {
  region: TerroirRegion;
  searchKeyword: string;
  representativeProduct: TeaItem | null;
  filteredProducts: TeaItem[];
} {
  const region = getRegionById(regionId);
  const searchKeyword = region.name.split(' ')[0].replace('·', '').trim();

  const representativeProduct =
    (region.matchedProductId
      ? catalog.find((item) => item.id === region.matchedProductId)
      : undefined) || null;

  const q = searchKeyword.toLowerCase();
  const filteredProducts = catalog.filter((item) => {
    if (item.category !== 'tea') return false;
    return (
      item.id === region.matchedProductId ||
      item.name.toLowerCase().includes(q) ||
      item.subCategory.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q)
    );
  });

  return {
    region,
    searchKeyword,
    representativeProduct,
    filteredProducts,
  };
}

export type TerroirShopCategory = 'all' | 'tea' | 'teapot' | 'teaware' | 'yao';
export type TerroirBeltFilter =
  | 'all'
  | 'wuyi'
  | 'wudong'
  | 'xihu'
  | 'menghai'
  | 'fuding'
  | 'uncharted';

/**
 * Filters visible tea mountain regions by terroir belt filter
 */
export function filterVisibleTerroirRegions(
  beltFilter: TerroirBeltFilter = 'all'
): TerroirRegion[] {
  if (beltFilter === 'all') return [...TEA_REGIONS];
  if (beltFilter === 'uncharted') return [];
  return TEA_REGIONS.filter((r) => r.id === beltFilter);
}

/**
 * Pure shop catalog filter & sort function used by ShopView and terroir-to-shop integration tests
 */
export function filterShopCatalog(
  catalog: TeaItem[],
  params: {
    category?: TerroirShopCategory;
    searchQuery?: string;
    sortBy?: 'default' | 'price-asc' | 'price-desc';
  }
): TeaItem[] {
  const activeCategory = params.category ?? 'all';
  const q = (params.searchQuery ?? '').trim().toLowerCase();
  const sortBy = params.sortBy ?? 'default';

  return catalog
    .filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
}

export interface TerroirInteractiveState {
  terroirBeltFilter: TerroirBeltFilter;
  visibleRegions: TerroirRegion[];
  selectedRegionId: string;
  compareRegionId: string | null;
  activeAxisKey: keyof TerroirSensoryProfile['radarScores'];
  smoothCurve: boolean;
  currentProfile: TerroirSensoryProfile;
  shopFilterState: {
    category: TerroirShopCategory;
    keyword: string;
    sortBy: 'default' | 'price-asc' | 'price-desc';
  };
  filteredShopItems: TeaItem[];
  openedProduct: TeaItem | null;
  reservedSalonTea: string | null;
  d3Geometry: D3RadarGeometryResult;
}

export type TerroirInteractionAction =
  | { type: 'CLICK_REGION'; regionId: string }
  | { type: 'SET_BELT_FILTER'; beltFilter: TerroirBeltFilter }
  | { type: 'CLICK_AXIS'; axisKey: keyof TerroirSensoryProfile['radarScores'] }
  | { type: 'SET_COMPARE_REGION'; compareRegionId: string | null }
  | { type: 'TOGGLE_CURVE_MODE' }
  | { type: 'TRIGGER_SHOP_FILTER'; sortBy?: 'default' | 'price-asc' | 'price-desc' }
  | { type: 'OPEN_REPRESENTATIVE_PRODUCT' }
  | { type: 'RESERVE_SALON_TEA' }
  | { type: 'RESET_SHOP_FILTER' }
  | { type: 'RESET_TERROIR_STATE' };

/**
 * Creates the initial interactive state of the D3.js Mountain Terroir module
 */
export function createInitialTerroirInteractiveState(
  catalog: TeaItem[]
): TerroirInteractiveState {
  const initialResolved = resolveRegionSelectionState('wuyi', 'xihu');
  return {
    terroirBeltFilter: 'all',
    visibleRegions: filterVisibleTerroirRegions('all'),
    selectedRegionId: initialResolved.selectedRegion.id,
    compareRegionId: initialResolved.nextCompareRegionId,
    activeAxisKey: initialResolved.topAxisKey,
    smoothCurve: true,
    currentProfile: initialResolved.profile,
    shopFilterState: {
      category: 'all',
      keyword: '',
      sortBy: 'default',
    },
    filteredShopItems: filterShopCatalog(catalog, {
      category: 'all',
      searchQuery: '',
      sortBy: 'default',
    }),
    openedProduct: null,
    reservedSalonTea: null,
    d3Geometry: computeD3RadarGeometry(initialResolved.profile, { smoothCurve: true }),
  };
}

/**
 * Resets only the shop filter state (category, search keyword, sort order) while preserving the active D3 terroir region
 */
export function resetShopFilterState(
  prevState: TerroirInteractiveState,
  catalog: TeaItem[]
): TerroirInteractiveState {
  return {
    ...prevState,
    shopFilterState: {
      category: 'all',
      keyword: '',
      sortBy: 'default',
    },
    filteredShopItems: filterShopCatalog(catalog, {
      category: 'all',
      searchQuery: '',
      sortBy: 'default',
    }),
  };
}

/**
 * Resets the entire D3.js Mountain Terroir interactive state back to initial defaults
 */
export function resetTerroirInteractiveState(
  catalog: TeaItem[]
): TerroirInteractiveState {
  return createInitialTerroirInteractiveState(catalog);
}

/**
 * Simulates user click actions on the D3.js Mountain Terroir module and computes the resulting state,
 * D3 radar geometry, mapped product catalog filtering, and state reset transitions.
 */
export function simulateTerroirUserInteraction(
  prevState: TerroirInteractiveState,
  action: TerroirInteractionAction,
  catalog: TeaItem[]
): TerroirInteractiveState {
  switch (action.type) {
    case 'CLICK_REGION': {
      const resolved = resolveRegionSelectionState(action.regionId, prevState.compareRegionId);
      const mapped = mapRegionToCatalogProducts(resolved.selectedRegion.id, catalog);
      return {
        ...prevState,
        selectedRegionId: resolved.selectedRegion.id,
        compareRegionId: resolved.nextCompareRegionId,
        activeAxisKey: resolved.topAxisKey,
        currentProfile: resolved.profile,
        shopFilterState: {
          category: 'tea',
          keyword: mapped.searchKeyword,
          sortBy: prevState.shopFilterState.sortBy,
        },
        filteredShopItems: mapped.filteredProducts,
        d3Geometry: computeD3RadarGeometry(resolved.profile, {
          smoothCurve: prevState.smoothCurve,
        }),
      };
    }

    case 'SET_BELT_FILTER': {
      const visibleRegions = filterVisibleTerroirRegions(action.beltFilter);
      if (action.beltFilter !== 'all' && action.beltFilter !== 'uncharted') {
        const resolved = resolveRegionSelectionState(
          action.beltFilter,
          prevState.compareRegionId
        );
        const mapped = mapRegionToCatalogProducts(resolved.selectedRegion.id, catalog);
        return {
          ...prevState,
          terroirBeltFilter: action.beltFilter,
          visibleRegions,
          selectedRegionId: resolved.selectedRegion.id,
          compareRegionId: resolved.nextCompareRegionId,
          activeAxisKey: resolved.topAxisKey,
          currentProfile: resolved.profile,
          shopFilterState: {
            category: 'tea',
            keyword: mapped.searchKeyword,
            sortBy: prevState.shopFilterState.sortBy,
          },
          filteredShopItems: mapped.filteredProducts,
          d3Geometry: computeD3RadarGeometry(resolved.profile, {
            smoothCurve: prevState.smoothCurve,
          }),
        };
      }
      return {
        ...prevState,
        terroirBeltFilter: action.beltFilter,
        visibleRegions,
      };
    }

    case 'CLICK_AXIS': {
      const isValidAxis = TERROIR_RADAR_AXES.some((a) => a.key === action.axisKey);
      const nextAxisKey = isValidAxis ? action.axisKey : prevState.activeAxisKey;
      return {
        ...prevState,
        activeAxisKey: nextAxisKey,
      };
    }

    case 'SET_COMPARE_REGION': {
      const validCompare =
        action.compareRegionId &&
        action.compareRegionId !== 'none' &&
        action.compareRegionId !== prevState.selectedRegionId &&
        TEA_REGIONS.some((r) => r.id === action.compareRegionId)
          ? action.compareRegionId
          : null;
      return {
        ...prevState,
        compareRegionId: validCompare,
      };
    }

    case 'TOGGLE_CURVE_MODE': {
      const nextSmooth = !prevState.smoothCurve;
      return {
        ...prevState,
        smoothCurve: nextSmooth,
        d3Geometry: computeD3RadarGeometry(prevState.currentProfile, {
          smoothCurve: nextSmooth,
        }),
      };
    }

    case 'TRIGGER_SHOP_FILTER': {
      const mapped = mapRegionToCatalogProducts(prevState.selectedRegionId, catalog);
      const nextSortBy = action.sortBy ?? prevState.shopFilterState.sortBy;
      const nextFilter = {
        category: 'tea' as TerroirShopCategory,
        keyword: mapped.searchKeyword,
        sortBy: nextSortBy,
      };
      return {
        ...prevState,
        shopFilterState: nextFilter,
        filteredShopItems: filterShopCatalog(catalog, {
          category: nextFilter.category,
          searchQuery: nextFilter.keyword,
          sortBy: nextFilter.sortBy,
        }),
      };
    }

    case 'OPEN_REPRESENTATIVE_PRODUCT': {
      const mapped = mapRegionToCatalogProducts(prevState.selectedRegionId, catalog);
      return {
        ...prevState,
        openedProduct: mapped.representativeProduct,
      };
    }

    case 'RESERVE_SALON_TEA': {
      const region = getRegionById(prevState.selectedRegionId);
      return {
        ...prevState,
        reservedSalonTea: region.signatureTea,
      };
    }

    case 'RESET_SHOP_FILTER': {
      return resetShopFilterState(prevState, catalog);
    }

    case 'RESET_TERROIR_STATE': {
      return resetTerroirInteractiveState(catalog);
    }

    default:
      return prevState;
  }
}




