/**
 * Pure business logic and data structures for
 * 「茶性档案」 (Personal Tea Character Dossier & Palate Radar)
 * 东方工夫茶五维感官体系与冷门小众茶叶推荐算法
 */

export interface TeaTasteDimension {
  key: 'roast' | 'aroma' | 'sweetness' | 'mouthfeel' | 'throatCharm';
  name: string;
  enName: string;
  description: string;
}

export const TEA_DIMENSIONS: TeaTasteDimension[] = [
  {
    key: 'roast',
    name: '焙火火候',
    enName: 'Fire Roast Level',
    description: '炭火慢焙所融蕴的木炭焦糖香与熟化透度，考较茶骨的耐火与内敛程度。',
  },
  {
    key: 'aroma',
    name: '香扬高扬',
    enName: 'Aroma Lift',
    description: '挥发性芳香分子在初沸冲泡时的扬度与冷杯留香，涵盖幽兰、水栀与山野蜜香。',
  },
  {
    key: 'sweetness',
    name: '回甘生津',
    enName: 'Salivation & Sweetness',
    description: '茶汤过喉后舌底两颊生津鸣泉的迅速程度与清甜持久力。',
  },
  {
    key: 'mouthfeel',
    name: '稠滑醇厚',
    enName: 'Body & Texture',
    description: '茶多酚、果胶质与氨基酸交织的汤感粘稠度，柔滑若绢，饱满不寡淡。',
  },
  {
    key: 'throatCharm',
    name: '喉韵岩气',
    enName: 'Throat Resonance & Terroir',
    description: '深山岩隙矿物质赋予的深邃喉底余韵与通体温润的清凉体感。',
  },
];

export interface PersonalTeaRadar {
  roast: number;        // 0 - 100 焙火火候
  aroma: number;        // 0 - 100 香扬高扬
  sweetness: number;    // 0 - 100 回甘生津
  mouthfeel: number;    // 0 - 100 稠滑醇厚
  throatCharm: number;  // 0 - 100 喉韵岩气
}

export interface NicheTeaRecommendation {
  id: string;
  name: string;
  subCategory: string;
  origin: string;
  rarity: string;
  matchScore: number;
  matchReason: string;
  price: number;
  sampleSpec: string;
  tastingNotes: string[];
  image: string;
  brewingTip: string;
}

export interface TeaProfileResult {
  characterTitle: string;
  characterBadge: string;
  philosophy: string;
  radar: PersonalTeaRadar;
  recentTastingTags: string[];
  recommendedTeas: NicheTeaRecommendation[];
  tastingAdvice: string;
}

/**
 * Curated Niche Rare Teas Catalog (冷门小众名枞与珍罕单株品鉴库)
 */
export const NICHE_TEA_CATALOG: NicheTeaRecommendation[] = [
  {
    id: 'niche-baijiguan',
    name: '武夷四大名枞 · 白鸡冠（止止庵隐岩）',
    subCategory: '武夷岩茶 · 孤品名枞',
    origin: '福建武夷山 · 止止庵隐岩幽谷',
    rarity: '传世四大名枞之首 · 年产量仅百余斤',
    matchScore: 97,
    matchReason: '根据您对深邃喉韵与稠滑汤感的偏爱，白鸡冠茶汤清亮如淡金，入口若米汤般滑润，淡竹叶幽香入髓，不争不抢却岩骨铮铮。',
    price: 360,
    sampleSpec: '16g (8g x 2泡 典藏品鉴装)',
    tastingNotes: ['淡竹叶香', '米汤稠滑', '喉底清凉冷矿韵'],
    image: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
    brewingTip: '沸水高冲，不宜久闷，5秒出汤，细品其道家出尘之幽气。',
  },
  {
    id: 'niche-tongtianxiang',
    name: '乌岽顶 · 通天香老丛单丛（单株孤树）',
    subCategory: '凤凰单丛 · 极稀奇香',
    origin: '广东潮州 · 凤凰山乌岽海拔1250米',
    rarity: '80年古树独株采制 · 极冷香型',
    matchScore: 95,
    matchReason: '契合您对高扬香气与冷杯留香的敏锐鉴赏力。通天香香气直透天灵，姜花与乳香暗隐，入口微苦秒化，生津迅猛如山泉。',
    price: 420,
    sampleSpec: '20g (5g x 4包 充氮便携装)',
    tastingNotes: ['通顶姜花香', '冷香入骨', '迅猛回甘生津'],
    image: '/assets/aistudio/IMG_6487_f774f6f1.JPG',
    brewingTip: '大滚水极速急出（关公巡城），切忌坐杯，观汤色浅金为上品。',
  },
  {
    id: 'niche-tianmenshan',
    name: '易武曼腊 · 天门山高杆野生古树茶',
    subCategory: '普洱生茶 · 秘境高杆',
    origin: '云南西双版纳 · 易武天门山秘境林区',
    rarity: '二十米树高采摘 · 原始雨林混生',
    matchScore: 92,
    matchReason: '精准契合您对原始山场野气与强盛生津的要求。汤感厚如凝脂，山野森林气韵磅礴，喉间留甘长达数小时。',
    price: 580,
    sampleSpec: '28g (7g x 4饼 迷你手工紧压饼)',
    tastingNotes: ['热带野兰香', '森林苔藓气', '极致鸣泉生津'],
    image: '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
    brewingTip: '95°C 山泉水冲泡，首泡润茶舒展，随后每泡递增3秒，体感通达百脉。',
  },
  {
    id: 'niche-wild-black',
    name: '桐木关 · 荒野野生老树红茶（无烟奇种）',
    subCategory: '武夷红茶 · 荒原遗珍',
    origin: '福建武夷山 · 国家自然保护区内山峡谷',
    rarity: '荒野失管古茶丛 · 零人工干预',
    matchScore: 90,
    matchReason: '适合喜爱适度火候与温润稠度的高阶茶友。带有高山野果酸甜与深谷冷杉清凉，温润养胃且喉韵悠长。',
    price: 298,
    sampleSpec: '25g (5g x 5泡 独立小匣)',
    tastingNotes: ['山野野果酸甜', '深谷松针冷香', '稠滑温润'],
    image: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    brewingTip: '92°C 温润出汤，静观金圈荡漾，入口甘冽饱满。',
  },
];

/**
 * Standard Taste Preference Tag Library
 */
export const AVAILABLE_TASTE_TAGS: string[] = [
  '重焙老火',
  '幽兰暗香',
  '舌底生津',
  '岩骨厚实',
  '冷杯留香',
  '青苔野韵',
  '栀子清甜',
  '回味甘冽',
  '稠滑如胶',
  '山野气韵',
  '轻火鲜灵',
  '沉水老木',
];

/**
 * Radar Math calculation for 5-axis polygon
 */
export function calculateRadarCoordinates(
  radar: PersonalTeaRadar,
  center: { x: number; y: number },
  radius: number
): {
  pointsString: string;
  axisPoints: {
    key: keyof PersonalTeaRadar;
    label: string;
    value: number;
    axisEnd: { x: number; y: number };
    dataPoint: { x: number; y: number };
  }[];
} {
  const keys: (keyof PersonalTeaRadar)[] = ['roast', 'aroma', 'sweetness', 'mouthfeel', 'throatCharm'];
  const labels: Record<keyof PersonalTeaRadar, string> = {
    roast: '焙火火候',
    aroma: '香扬高扬',
    sweetness: '回甘生津',
    mouthfeel: '稠滑醇厚',
    throatCharm: '喉韵岩气',
  };

  const angleStep = (Math.PI * 2) / keys.length;
  // Start from top (-PI / 2)
  const startAngle = -Math.PI / 2;

  const axisPoints = keys.map((key, index) => {
    const angle = startAngle + index * angleStep;
    const value = Math.max(10, Math.min(100, radar[key] || 50));
    const scoreRatio = value / 100;

    const axisEnd = {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    };

    const dataPoint = {
      x: center.x + (radius * scoreRatio) * Math.cos(angle),
      y: center.y + (radius * scoreRatio) * Math.sin(angle),
    };

    return {
      key,
      label: labels[key],
      value,
      axisEnd,
      dataPoint,
    };
  });

  const pointsString = axisPoints.map((p) => `${p.dataPoint.x.toFixed(1)},${p.dataPoint.y.toFixed(1)}`).join(' ');

  return { pointsString, axisPoints };
}

/**
 * Curated Fallback Algorithm: Computes personal tea profile deterministically
 * based on user's order history, review snippets, and selected tags.
 */
export function generateCuratedTeaProfile(
  orders: { name: string; price?: number }[] = [],
  _reviews: string[] = [],
  selectedTags: string[] = ['岩骨厚实', '重焙老火', '舌底生津']
): TeaProfileResult {
  // Base radar scores (calibrated so new tags & custom descriptor words visibly shift each axis)
  let roast = 74;
  let aroma = 78;
  let sweetness = 80;
  let mouthfeel = 80;
  let throatCharm = 82;

  // Adapt based on orders
  const hasWuyi = orders.some((o) => o.name.includes('水仙') || o.name.includes('肉桂') || o.name.includes('岩茶') || o.name.includes('沉芳') || o.name.includes('黛') || o.name.includes('馡'));
  const hasDancong = orders.some((o) => o.name.includes('单丛') || o.name.includes('诸心') || o.name.includes('栀子') || o.name.includes('东方不败') || o.name.includes('清风挂怀'));
  const hasPuer = orders.some((o) => o.name.includes('普洱') || o.name.includes('生普') || o.name.includes('熟砖') || o.name.includes('老班章') || o.name.includes('布朗'));
  const hasXihu = orders.some((o) => o.name.includes('龙井') || o.name.includes('狮峰'));
  const hasFuding = orders.some((o) => o.name.includes('白毫银针') || o.name.includes('太姥') || o.name.includes('白茶'));

  if (hasWuyi) {
    roast += 5;
    mouthfeel += 4;
    throatCharm += 5;
  }
  if (hasDancong) {
    aroma += 7;
    sweetness += 4;
  }
  if (hasPuer) {
    mouthfeel += 5;
    throatCharm += 5;
    sweetness += 4;
  }
  if (hasXihu) {
    aroma += 5;
    sweetness += 4;
  }
  if (hasFuding) {
    sweetness += 5;
    mouthfeel += 4;
  }

  // Adapt based on preset tags AND custom descriptor words in selectedTags & review notes
  const combinedCorpus = [...selectedTags, ..._reviews].join(' ');

  // 1. Preset tag contributions
  if (selectedTags.includes('重焙老火')) roast += 6;
  if (selectedTags.includes('沉水老木')) { roast += 4; mouthfeel += 4; }
  if (selectedTags.includes('轻火鲜灵')) { roast -= 8; aroma += 6; }
  if (selectedTags.includes('幽兰暗香')) aroma += 5;
  if (selectedTags.includes('冷杯留香')) aroma += 5;
  if (selectedTags.includes('栀子清甜')) { aroma += 4; sweetness += 4; }
  if (selectedTags.includes('舌底生津')) sweetness += 5;
  if (selectedTags.includes('回味甘冽')) sweetness += 5;
  if (selectedTags.includes('稠滑如胶')) mouthfeel += 6;
  if (selectedTags.includes('岩骨厚实')) { mouthfeel += 4; throatCharm += 5; }
  if (selectedTags.includes('青苔野韵')) throatCharm += 5;
  if (selectedTags.includes('山野气韵')) throatCharm += 5;

  // 2. Dynamic custom descriptor word evaluation (each matching custom descriptor boosts corresponding axis)
  for (const tag of selectedTags) {
    if (AVAILABLE_TASTE_TAGS.includes(tag)) continue;
    if (/炭|焙|火|焦糖|烟|熟香/.test(tag)) roast += 4;
    if (/香|兰|花|栀|蜜|芳|清|鲜|果/.test(tag)) aroma += 4;
    if (/甘|津|甜|冰糖|润|泉/.test(tag)) sweetness += 4;
    if (/稠|滑|醇|厚|胶|米汤|柔|脂/.test(tag)) mouthfeel += 4;
    if (/韵|岩|骨|苔|山|木|喉|丛|矿|气/.test(tag)) throatCharm += 4;
  }

  // 3. Review notes nuance
  if (/炭焙|足火|老火/.test(combinedCorpus)) roast += 2;
  if (/高扬|姜花|兰香|冷香/.test(combinedCorpus)) aroma += 2;
  if (/生津|鸣泉|冰糖/.test(combinedCorpus)) sweetness += 2;
  if (/醇厚|米汤|稠滑/.test(combinedCorpus)) mouthfeel += 2;
  if (/岩韵|喉底|青苔/.test(combinedCorpus)) throatCharm += 2;

  // Bound to 55 - 99
  const clamp = (val: number) => Math.min(99, Math.max(55, Math.round(val)));

  const finalRadar: PersonalTeaRadar = {
    roast: clamp(roast),
    aroma: clamp(aroma),
    sweetness: clamp(sweetness),
    mouthfeel: clamp(mouthfeel),
    throatCharm: clamp(throatCharm),
  };

  // Determine character persona
  let characterTitle = '深谷苍苔 · 岩骨清客';
  let characterBadge = '骨力深沉 · 韵致入髓';
  let philosophy =
    '您的舌尖深谙东方工夫茶的火功精髓，偏好三坑两涧的岩骨青苔之味。不逐轻浮初香，唯喜滚水急落后，深沉喉底鸣泉而起的绵长回甘。';

  if (finalRadar.aroma > finalRadar.roast && finalRadar.aroma >= 90) {
    characterTitle = '高山流云 · 探幽香客';
    characterBadge = '灵动高扬 · 冰心澈悟';
    philosophy =
      '您对高山原叶的挥发性冷香具有极敏锐的嗅觉直觉。偏好乌岽绝顶的孤高兰蜜香，汤过齿颊清风生，追求杯底冷香经久不散的出尘体验。';
  } else if (finalRadar.sweetness >= 92 && finalRadar.mouthfeel >= 90) {
    characterTitle = '甘霖漱玉 · 泉韵隐士';
    characterBadge = '如凝脂滑 · 舌底鸣泉';
    philosophy =
      '您钟爱汤感丰厚若米汤的醇和与温润，注重茶多酚与果胶交织的甘霖体感。入口柔滑无棱角，入腹通畅生津，温润悠远。';
  }

  // Sort and select top matching niche teas
  const recommendedTeas = NICHE_TEA_CATALOG.map((tea) => {
    let score = tea.matchScore;
    if (finalRadar.throatCharm >= 90 && tea.id === 'niche-baijiguan') score = 98;
    if (finalRadar.aroma >= 90 && tea.id === 'niche-tongtianxiang') score = 97;
    if (finalRadar.sweetness >= 90 && tea.id === 'niche-tianmenshan') score = 95;
    return { ...tea, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return {
    characterTitle,
    characterBadge,
    philosophy,
    radar: finalRadar,
    recentTastingTags: selectedTags,
    recommendedTeas: recommendedTeas.slice(0, 3),
    tastingAdvice: '建议使用潮州手拉朱泥壶或厚壁紫砂，以100°C大沸山泉水高冲，前三泡快出，更能契合您的品饮节奏。',
  };
}

export type TeaMoodPoetryTheme = 'pine-mist' | 'orchid-spring' | 'amber-hearth' | 'moon-zen';

export interface TeaMoodThemeOption {
  id: TeaMoodPoetryTheme;
  label: string;
  subtitle: string;
  sealText: string;
}

export const TEA_MOOD_THEMES: TeaMoodThemeOption[] = [
  {
    id: 'pine-mist',
    label: '松风听泉',
    subtitle: '清寂幽远 · 岩骨入怀',
    sealText: '松风鉴茶',
  },
  {
    id: 'orchid-spring',
    label: '幽谷寻兰',
    subtitle: '空谷冷香 · 旷达澄明',
    sealText: '兰芷清赏',
  },
  {
    id: 'amber-hearth',
    label: '围炉慢焙',
    subtitle: '炭火温存 · 岁月沉香',
    sealText: '炉火知音',
  },
  {
    id: 'moon-zen',
    label: '月藏山水',
    subtitle: '一叶知秋 · 见素抱朴',
    sealText: '月藏嘉叶',
  },
];

export interface TeaWhisperPosterData {
  moodId: TeaMoodPoetryTheme;
  moodLabel: string;
  poeticTitle: string;
  moodPoem: [string, string, string, string];
  moodReflection: string;
  sealText: string;
  dominantDimension: {
    key: keyof PersonalTeaRadar;
    label: string;
    score: number;
  };
  wechatShareCaption: string;
}

/**
 * Synthesize user's 5D Tea Character Radar with AI/Curated Mood Poetry for WeChat Social Poster
 */
export function generateCuratedTeaWhisperPoster(
  profile: TeaProfileResult,
  moodId: TeaMoodPoetryTheme = 'pine-mist',
  userName = '林清羽',
  userTierTitle = '掌席茶人 · MASTER'
): TeaWhisperPosterData {
  const dimensionEntries: { key: keyof PersonalTeaRadar; label: string; score: number }[] = [
    { key: 'throatCharm', label: '喉韵岩气', score: profile.radar.throatCharm },
    { key: 'aroma', label: '香扬高扬', score: profile.radar.aroma },
    { key: 'sweetness', label: '回甘生津', score: profile.radar.sweetness },
    { key: 'mouthfeel', label: '稠滑醇厚', score: profile.radar.mouthfeel },
    { key: 'roast', label: '焙火火候', score: profile.radar.roast },
  ];

  const sortedDims = [...dimensionEntries].sort((a, b) => b.score - a.score);
  const dominantDimension = sortedDims[0];
  const moodOption =
    TEA_MOOD_THEMES.find((m) => m.id === moodId) || TEA_MOOD_THEMES[0];

  const poemBank: Record<
    TeaMoodPoetryTheme,
    {
      title: string;
      poem: [string, string, string, string];
      reflection: string;
    }
  > = {
    'pine-mist': {
      title: '松风煮雪 · 岩韵入怀',
      poem: [
        '半壁丹崖宿雾收，',
        '竹炉初沸试新瓯。',
        '松风入喉生清籁，',
        '万里云山一盏留。',
      ],
      reflection: `以「${dominantDimension.label} ${dominantDimension.score}分」为骨，茶汤过喉如听松涛鸣泉，洗尽浮尘，只余山场真味。`,
    },
    'orchid-spring': {
      title: '幽谷寻兰 · 冷香满袖',
      poem: [
        '乌岽云深锁翠微，',
        '一瓯春雪映花飞。',
        '冷杯犹带幽兰气，',
        '笑看清风扣竹扉。',
      ],
      reflection: `契合您「${dominantDimension.label} ${dominantDimension.score}分」的敏锐感知，高香不夺茶骨，舌底甘泉随兰韵徐徐铺展。`,
    },
    'amber-hearth': {
      title: '围炉慢焙 · 岁月沉芳',
      poem: [
        '慢火深笼守夜阑，',
        'amber琥珀映白纨。'.replace('amber', '金汤'),
        '十巡犹觉喉间润，',
        '一器分寸天地宽。',
      ],
      reflection: `历经文火慢炖与时光收束，「${dominantDimension.label} ${dominantDimension.score}分」化作稠滑如绢的温润茶汤。`,
    },
    'moon-zen': {
      title: '月藏山水 · 澄明一味',
      poem: [
        '空山月色落茶烟，',
        '手拉朱泥聚碧泉。',
        '一叶来处皆有据，',
        '浮生半日作散仙。',
      ],
      reflection: `在「${profile.characterTitle}」的茶性底色之上，以「${dominantDimension.label} ${dominantDimension.score}分」定格此刻澄明心境。`,
    },
  };

  const selected = poemBank[moodOption.id];
  const topTea = profile.recommendedTeas[0];

  const wechatShareCaption = [
    `【春城嘉叶 · 雅致茶语海报】`,
    `席主：${userName}（${userTierTitle}）`,
    `茶性雅号：${profile.characterTitle} · ${selected.title}`,
    ``,
    ...selected.poem,
    ``,
    `✦ 五维茶性图谱：焙火${profile.radar.roast} / 香扬${profile.radar.aroma} / 回甘${profile.radar.sweetness} / 稠滑${profile.radar.mouthfeel} / 喉韵${profile.radar.throatCharm}`,
    `✦ 舌尖印记：${profile.recentTastingTags.map((t) => `#${t}`).join(' ')}`,
    `✦ 契合名枞：${topTea ? `${topTea.name}（契合度 ${topTea.matchScore}%）` : '武夷正岩老枞'}`,
    `「一叶有来处，一器有分寸。」`,
  ].join('\n');

  return {
    moodId: moodOption.id,
    moodLabel: `${moodOption.label} · ${moodOption.subtitle}`,
    poeticTitle: selected.title,
    moodPoem: selected.poem,
    moodReflection: selected.reflection,
    sealText: moodOption.sealText,
    dominantDimension,
    wechatShareCaption,
  };
}

