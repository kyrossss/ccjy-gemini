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
    matchedProductId: 'tea-02',
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
    matchedProductId: 'tea-01',
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
    matchedProductId: 'tea-02',
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
    matchedProductId: 'tea-02',
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
    matchedProductId: 'tea-02',
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
