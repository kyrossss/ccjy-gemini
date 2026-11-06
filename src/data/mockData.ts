/**
 * Curated data for 春城嘉叶 (CHUN CHENG JIA YE)
 * 品牌主张：「一叶有来处，一器有分寸。」
 * 涵盖：山场原叶（凤凰单丛与武夷岩茶）、赏瓷雅器（景德镇脉络）、手作茗壶（潮州手拉与宜兴手拍）、当代便携（爻 YÁO）。
 */

export interface TeaItem {
  id: string;
  name: string;
  enName: string;
  category: 'tea' | 'teapot' | 'teaware' | 'yao';
  subCategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  tagline: string;
  description: string;
  origin: string;
  year?: string;
  specs: { label: string; value: string }[];
  brewingGuide?: {
    temp: string;
    ratio: string;
    duration: string;
    pours: number;
  };
  artisan?: {
    name: string;
    title: string;
    bio: string;
  };
  inStock: boolean;
  featured?: boolean;
}

export const PRODUCTS: TeaItem[] = [
  // 1. 山场原叶 (凤凰单丛与武夷岩茶 · 同步 chunchengjiaye.com 官网原图与档案)
  {
    id: 'tea-dancong-01',
    name: '诸心·凤凰单丛（便携泡袋装）',
    enName: 'Zhu Xin · Fenghuang Dancong (Single Infusion Bag)',
    category: 'tea',
    subCategory: '凤凰单丛',
    price: 680,
    originalPrice: 780,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/003-zhuxin-wide.jpg',
    tagline: '单丛清气，先在鼻端，后在回甘 · 便携泡袋装',
    description: '源于潮州凤凰山乌岽核心山场，精选高山原叶。单丛清气，先在鼻端，后在回甘；滚水急出不闷，花蜜香高扬持久，喉韵清润。',
    origin: '广东 · 潮州凤凰山乌岽核心山场',
    year: '2024 甲辰春采',
    specs: [
      { label: '规格', value: '40g (5g x 8包便携泡袋装)' },
      { label: '官网谱系', value: '山场原叶 03 / 20 · 诸心' },
      { label: '风味特征', value: '栀子花香、山野蜜韵、冷杯留香' },
      { label: '包装形态', value: '充氮保鲜独立泡袋' },
    ],
    brewingGuide: {
      temp: '100°C 刚沸纯净山泉',
      ratio: '5g : 110ml 朱泥小品',
      duration: '第1-3泡急冲即出 (3-5秒)',
      pours: 12,
    },
    inStock: true,
    featured: true,
  },
  {
    id: 'tea-dancong-02',
    name: '清风挂怀·凤凰单丛（便携泡袋装）',
    enName: 'Qing Feng Gua Huai · Fenghuang Dancong',
    category: 'tea',
    subCategory: '凤凰单丛',
    price: 880,
    originalPrice: 980,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/004-qingfeng-guahuai-wide.jpg',
    tagline: '高香见骨，回甘收束得干净 · 独立单泡',
    description: '高海拔老丛单株精采，山场日照充足，云雾缭绕。高香见骨，回甘收束得干净；茶气清亮，开汤便见凤凰山场的分明轮廓。',
    origin: '广东 · 潮州凤凰山高山林区',
    year: '2024 春茶',
    specs: [
      { label: '规格', value: '50g (5g x 10包独立袋)' },
      { label: '官网谱系', value: '山场原叶 04 / 21 · 清风挂怀' },
      { label: '香型', value: '自然兰花香、清雅冷香' },
    ],
    brewingGuide: {
      temp: '100°C 大滚水高冲',
      ratio: '5g : 120ml 盖碗或手拉壶',
      duration: '快速出汤，勿久闷',
      pours: 14,
    },
    inStock: true,
    featured: true,
  },
  {
    id: 'tea-dancong-03',
    name: '水栀子·凤凰单丛',
    enName: 'Shui Zhi Zi · Fenghuang Dancong Special Reserve',
    category: 'tea',
    subCategory: '凤凰单丛',
    price: 760,
    originalPrice: 860,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/011-shuizhizi-wide.jpg',
    tagline: '栀子花香清扬，入口轻盈鲜活',
    description: '凤凰单丛传统名丛之一，栀子花香清扬，入口轻盈鲜活。茶汤澄黄明亮，稠厚温润，每一泡香气随温度变化层叠展开。',
    origin: '广东 · 潮州凤凰山',
    year: '2024 特选',
    specs: [
      { label: '净含量', value: '60g 便携盒装' },
      { label: '官网谱系', value: '山场原叶 11 · 水栀子' },
      { label: '焙火', value: '中轻火手工焙' },
    ],
    brewingGuide: {
      temp: '100°C 沸水',
      ratio: '6g : 110ml',
      duration: '前4泡 5秒，后逐泡递增',
      pours: 10,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-dancong-04',
    name: '东方不败（金/蓝金）·凤凰单丛',
    enName: 'Dong Fang Bu Bai · Fenghuang Dancong Reserve',
    category: 'tea',
    subCategory: '凤凰单丛',
    price: 1680,
    originalPrice: 1980,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/005-dongfang-bubai-gold-wide.jpg',
    tagline: '气势外放，花蜜香与山场气并举',
    description: '春城嘉叶官网核心单丛代表作。气势外放，花蜜香与山场气并举；高扬之中见沉稳，尾水依旧清亮有骨，兼具金装与蓝金双规制。',
    origin: '广东 · 潮州凤凰山乌岽核心山场',
    year: '2024 甲辰春茶',
    specs: [
      { label: '规格', value: '60g 典藏礼盒装（金装 / 蓝金）' },
      { label: '官网谱系', value: '山场原叶 05 / 22 · 东方不败' },
      { label: '风味特征', value: '霸气花蜜香、乌岽山韵、尾水清亮' },
    ],
    brewingGuide: {
      temp: '100°C 刚沸山泉水',
      ratio: '6g : 110ml 吴瑞全手拉朱泥壶',
      duration: '前5泡即冲即出，第6泡起微坐5秒',
      pours: 16,
    },
    inStock: true,
    featured: true,
  },
  {
    id: 'tea-dancong-05',
    name: '桃花仙（甲辰年）·凤凰单丛',
    enName: 'Tao Hua Xian (Jiachen Vintage) · Fenghuang Dancong',
    category: 'tea',
    subCategory: '凤凰单丛',
    price: 1180,
    originalPrice: 1380,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/013-taohuaxian-jiachen-wide.jpg',
    tagline: '花果香灵动，尾韵带一丝山桃清甜',
    description: '甲辰年春采高山老丛，花果香灵动，尾韵带一丝山桃清甜。香气与甜润并行，适合细品慢酌，杯底蜜桃兰香久聚不散。',
    origin: '广东 · 潮州凤凰山',
    year: '2024 甲辰年',
    specs: [
      { label: '规格', value: '50g (5g x 10包独立泡袋)' },
      { label: '官网谱系', value: '山场原叶 13 / 28 · 桃花仙' },
      { label: '香型', value: '山桃蜜香、自然花果韵' },
    ],
    brewingGuide: {
      temp: '100°C 沸水高冲',
      ratio: '5g : 110ml 景德镇白瓷盖碗',
      duration: '快进快出，忌闷泡',
      pours: 13,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-dancong-06',
    name: '香如故 / 隐无名·凤凰单丛品鉴合集',
    enName: 'Xiang Ru Gu & Yin Wu Ming · Fenghuang Dancong',
    category: 'tea',
    subCategory: '凤凰单丛',
    price: 960,
    originalPrice: 1120,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/014-xiangrugu-wide.jpg',
    tagline: '熟香温润，杯底余韵持久如故 · 不以浮名夺人',
    description: '收录春城嘉叶官网「香如故」「隐无名」「云峰顶」三大风骨单丛。熟香温润，杯底余韵持久如故；不以浮名夺人，但凭山场真味立身。',
    origin: '广东 · 潮州凤凰山高山云雾带',
    year: '2024 精选',
    specs: [
      { label: '规格', value: '60g (5g x 12袋 便携品鉴装)' },
      { label: '官网谱系', value: '山场原叶 14 / 15 / 19 / 29 · 香如故·隐无名·云峰顶' },
      { label: '风味特征', value: '熟果木质香、冷杯留香、喉底甘泽' },
    ],
    brewingGuide: {
      temp: '100°C 沸水',
      ratio: '5g : 110ml 朱泥壶或白瓷盖碗',
      duration: '前4泡5秒出汤，逐泡顺延',
      pours: 14,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-wuyi-01',
    name: '沉芳·武夷岩茶（正岩）',
    enName: 'Chen Fang · Wuyi Rock Tea Authentic Reserve',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 1380,
    originalPrice: 1580,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/001-chenfang-wide.jpg',
    tagline: '火功内敛，幽香沉入汤底 · 岩骨花香',
    description: '源于武夷山三坑两涧正岩山场，春城嘉叶官网 01 号首推原叶。火功内敛，幽香沉入汤底；汤感沉稳，回味里慢慢浮出木质与花香。',
    origin: '福建 · 武夷山慧苑坑正岩核心山场',
    year: '2023 癸卯足火炭焙',
    specs: [
      { label: '规格', value: '64g (8g x 8泡礼匣)' },
      { label: '官网谱系', value: '山场原叶 01 / 17 · 沉芳' },
      { label: '焙火', value: '传统足火荔枝炭焙' },
    ],
    brewingGuide: {
      temp: '100°C 鼎沸泉水',
      ratio: '8g : 120ml 紫砂厚壁壶',
      duration: '快速出汤，第5泡起坐杯10秒',
      pours: 15,
    },
    inStock: true,
    featured: true,
  },
  {
    id: 'tea-wuyi-02',
    name: '水龙吟·正岩肉桂',
    enName: 'Shui Long Yin · Zhengyan Rougui Rock Tea',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 1980,
    originalPrice: 2280,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/010-shuilongyin-wide.jpg',
    tagline: '岩韵深长，茶气在喉底徐徐展开',
    description: '牛栏坑与天心岩核心向阳山场肉桂。岩韵深长，茶气在喉底徐徐展开；汤色金黄透亮，入口有沉静力量，春城嘉叶岩茶旗舰。',
    origin: '福建 · 武夷山天心岩核心场',
    year: '2024 甲辰特采',
    specs: [
      { label: '规格', value: '60g 桐木黑金礼盒' },
      { label: '官网谱系', value: '山场原叶 10 / 26 · 水龙吟' },
      { label: '火工', value: '中度火 传统竹笼文火炭焙' },
    ],
    brewingGuide: {
      temp: '100°C 悬壶高冲',
      ratio: '8g : 110ml 朱泥小品',
      duration: '即冲即出，前3泡不坐杯',
      pours: 16,
    },
    inStock: true,
    featured: true,
  },
  {
    id: 'tea-wuyi-03',
    name: '兰芷·武夷岩茶',
    enName: 'Lan Zhi · Wuyi Elegant Floral Rock Tea',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 880,
    originalPrice: 1080,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/002-lanzhi-wide.jpg',
    tagline: '兰香清雅，汤面细润而有筋骨',
    description: '春城嘉叶官网 02 号原叶。兰香清雅，汤面细润而有筋骨；兰韵不躁，入口温润，余香久留，兼具清新花香与正岩醇滑。',
    origin: '福建 · 武夷山正岩',
    year: '2024 春茶',
    specs: [
      { label: '规格', value: '64g (8g x 8泡)' },
      { label: '官网谱系', value: '山场原叶 02 / 18 · 兰芷' },
      { label: '等级', value: '正岩精选' },
    ],
    brewingGuide: {
      temp: '100°C 沸水',
      ratio: '8g : 120ml',
      duration: '出汤5-8秒',
      pours: 12,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-wuyi-04',
    name: '黛 / 玥·武夷岩茶（正岩单字系列）',
    enName: 'Dai & Yue · Wuyi Zhengyan Monogram Series',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 1580,
    originalPrice: 1800,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/006-dai-wide.jpg',
    tagline: '岩骨幽深，焙火与山场层次徐徐铺开',
    description: '春城嘉叶单字哲学岩茶代表作「黛」与「玥」。「黛」岩骨幽深，色与味皆偏沉静，耐泡度尤为出色；「玥」温润内敛，茶汤柔中带骨。',
    origin: '福建 · 武夷山三坑两涧正岩山场',
    year: '2024 传统炭焙',
    specs: [
      { label: '规格', value: '64g (8g x 8泡 单字典藏匣)' },
      { label: '官网谱系', value: '山场原叶 06 / 16 / 23 · 黛 · 玥' },
      { label: '风土特征', value: '丹霞岩壁砾壤 · 炭火沉香 · 汤稠如脂' },
    ],
    brewingGuide: {
      temp: '100°C 鼎沸山泉',
      ratio: '8g : 110ml 宜兴紫砂或潮州朱泥壶',
      duration: '前4泡5秒快出，后段闷泡激发老木丛香',
      pours: 15,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-wuyi-05',
    name: '馡 / 霝·武夷岩茶（正岩单字系列）',
    enName: 'Fei & Ling · Wuyi Zhengyan Monogram Series',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 1480,
    originalPrice: 1680,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/007-fei-wide.jpg',
    tagline: '香气细密，入汤后更见温润厚度',
    description: '春城嘉叶单字岩茶「馡」与「霝」。「馡」香气细密，不张扬，却能在数泡之后持续回返；「霝」清气如雨后山岚，入口鲜爽回润。',
    origin: '福建 · 武夷山正岩幽谷山场',
    year: '2024 春茶',
    specs: [
      { label: '规格', value: '64g (8g x 8泡 单字典藏匣)' },
      { label: '官网谱系', value: '山场原叶 07 / 12 / 24 / 27 · 馡 · 霝' },
      { label: '风味特征', value: '幽谷兰花香、山岚清气、细密棉柔' },
    ],
    brewingGuide: {
      temp: '100°C 沸水环壁注水',
      ratio: '8g : 115ml 景德镇白瓷盖碗',
      duration: '第1-4泡即入即出，细嗅盖香',
      pours: 14,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-wuyi-06',
    name: '南罗清（甲辰年 / 十年陈）·武夷岩茶',
    enName: 'Nan Luo Qing (Jiachen & 10-Year Aged) · Wuyi Rock Tea',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 2180,
    originalPrice: 2580,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/008-nanluoqing-jiachen-wide.jpg',
    tagline: '年份新茶与十年陈藏对举 · 汤感醇厚而沉静',
    description: '涵盖春城嘉叶官网「南罗清（甲辰年）」与「南罗清（十年）」。新茶山场气清晰，清冽与厚重并存；十年陈茶经岁月打磨火气，只留温润醇和与悠长药木沉香。',
    origin: '福建 · 武夷山正岩核心山场 & 深圳恒温母仓',
    year: '2014 十年陈 / 2024 甲辰年',
    specs: [
      { label: '规格', value: '64g 年份对比品鉴礼盒' },
      { label: '官网谱系', value: '山场原叶 08 / 25 / 30 · 南罗清' },
      { label: '仓储工艺', value: '传统复焙 + 十年恒温干仓转化' },
    ],
    brewingGuide: {
      temp: '100°C 滚水高温冲瀹',
      ratio: '8g : 120ml 许广发宜兴手拍紫砂壶',
      duration: '首泡温润，前5泡5秒，尾水可闷泡品陈韵',
      pours: 18,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-wuyi-07',
    name: '十方莲华（1000）·武夷岩茶殿堂级',
    enName: 'Shi Fang Lian Hua (1000) · Grand Master Wuyi Rock Tea',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 3280,
    originalPrice: 3680,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/009-shifang-lianhua-1000-wide.jpg',
    tagline: '层次开阔，花香、果韵与火功彼此托举',
    description: '春城嘉叶官网 09 号重器茶品。层次开阔，花香、果韵与火功彼此托举；三坑两涧百年老丛单采，每一道茶汤如莲华次第绽放，气韵恢弘。',
    origin: '福建 · 武夷山三坑两涧核心古岩茶园',
    year: '2024 殿堂级监制',
    specs: [
      { label: '规格', value: '80g 编号限量收藏版' },
      { label: '官网谱系', value: '山场原叶 09 · 十方莲华（1000）' },
      { label: '风味特征', value: '复合花果香、老丛青苔韵、十方开阔感' },
    ],
    brewingGuide: {
      temp: '100°C 鼎沸活水',
      ratio: '8.5g : 110ml 名家手拉朱泥壶',
      duration: '前6泡秒出，7泡后逐泡递增5秒',
      pours: 20,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-xihu-01',
    name: '狮峰翁家山·明前特级手炒龙井',
    enName: 'Shifeng Wengjiashan · Pre-Qingming Hand-Fired Longjing',
    category: 'tea',
    subCategory: '西湖龙井',
    price: 1580,
    originalPrice: 1880,
    image: '/assets/aistudio/IMG_6491_1582fce7.JPG',
    tagline: '西湖清芳 · 糙米色泽 · 嫩栗豆花香',
    description: '采自西湖龙井一级核心保护区狮峰山麓翁家山群体种老茶蓬。铁锅手炒十法辉锅定型，色泽糙米黄润，汤清味鲜，炒蚕豆香与幽兰清芳交织，回甘生津如饮初春甘泉。',
    origin: '浙江 · 杭州西湖狮峰翁家山核心产区',
    year: '2026 丙午明前头采',
    specs: [
      { label: '规格', value: '50g 手工锡罐封藏' },
      { label: '品种', value: '西湖群体种（老茶蓬）' },
      { label: '风土特征', value: '白砂岩微酸土 · 嫩栗香与豆花鲜爽' },
    ],
    brewingGuide: {
      temp: '85°C 山泉水（切忌沸水直冲）',
      ratio: '3.5g : 150ml 水晶玻璃杯或白瓷盖碗',
      duration: '中投法浸润35秒出汤',
      pours: 5,
    },
    inStock: true,
    featured: true,
  },
  {
    id: 'tea-menghai-01',
    name: '布朗山老班章·古树纯料春茶青饼',
    enName: 'Bulang Lao Banzhang · Ancient Tree Raw Pu-erh Cake',
    category: 'tea',
    subCategory: '普洱生茶',
    price: 2680,
    originalPrice: 2980,
    image: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    tagline: '布朗霸韵 · 苦涩秒化 · 野蜜兰樟香入骨',
    description: '甄选勐海布朗山海拔1750米原始雨林百年古茶树头春单采。条索肥壮披毫，石磨手工压饼。入口茶气霸悍澎湃，三秒化作满口狂澜般的冰糖回甘与原始野兰樟香。',
    origin: '云南 · 西双版纳勐海布朗山核心古茶园',
    year: '2024 甲辰头春古树',
    specs: [
      { label: '规格', value: '200g 传统石磨手工青饼（绵纸笋壳装）' },
      { label: '树龄区间', value: '200年以上混生雨林古茶树' },
      { label: '风土特征', value: '深厚腐殖红壤 · 霸气回甘 · 气达丹田' },
    ],
    brewingGuide: {
      temp: '98°C - 100°C 高温沸水',
      ratio: '7g : 130ml 宜兴紫砂或高白瓷盖碗',
      duration: '首泡润茶，前6泡即冲即出',
      pours: 18,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-fuding-01',
    name: '太姥山荒野·头春特级白毫银针',
    enName: 'Mount Taimu Wild · First Flush Silver Needle White Tea',
    category: 'tea',
    subCategory: '福鼎白茶',
    price: 1180,
    originalPrice: 1380,
    image: '/assets/aistudio/IMG_6492_3fd88e0f.JPG',
    tagline: '太姥毫韵 · 日光自然萎凋 · 毫香蜜韵如玉',
    description: '源自福鼎太姥山海拔800米山海交汇处荒野化古茶园。仅采早春肥壮单芽，日光竹匾自然萎凋七十二小时，九成干文火足干。芽头肥壮挺直如银针，茶汤杏黄清澈，毫香与野花蜜甜交融。',
    origin: '福建 · 宁德福鼎太姥山高岗荒野茶园',
    year: '2025 乙巳头春',
    specs: [
      { label: '规格', value: '45g 双层覆锡防潮罐' },
      { label: '工艺', value: '传统日光自然萎凋 · 零揉捻零炒制' },
      { label: '风土特征', value: '花岗岩风化砾土 · 海雾润养 · 毫香清甜' },
    ],
    brewingGuide: {
      temp: '90°C 清冽山泉',
      ratio: '4g : 120ml 景德镇薄胎白瓷盖碗',
      duration: '环壁注水，首泡15秒，观白毫林立',
      pours: 10,
    },
    inStock: true,
    featured: false,
  },

  // 2. 手作茗壶 (潮州手拉与宜兴手拍 · 同步 chunchengjiaye.com 01—07 官网实拍图)
  {
    id: 'pot-01',
    name: '潮州非遗手拉朱泥壶·吴瑞全「孟臣梨壶」',
    enName: 'Chaozhou Intangible Heritage · Wu Ruiquan Mengchen Pear Pot',
    category: 'teapot',
    subCategory: '潮州手拉朱泥壶',
    price: 3600,
    originalPrice: 4200,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/teapot/002-wu-ruiquan-mengchen-lihu-wide.jpg',
    tagline: '梨形饱满，重心沉稳，出水利落 · 吴瑞全亲制',
    description: '名家吴瑞全手拉成型，梨形饱满，重心沉稳，出水利落。朱泥收缩率高达25%，壶壁薄而致密，颗粒隐现，聚香聚气，冲泡凤凰单丛与武夷岩茶之圣器。',
    origin: '广东 · 潮州枫溪手拉壶工坊',
    year: '2024 手工制',
    artisan: {
      name: '吴瑞全',
      title: '潮州手拉朱泥壶代表名家 / 非遗制壶大师',
      bio: '从艺数十载，恪守经典孟臣规制，线条洗练温润，泥料精炼陈腐数年，作品深受国内外茶人藏家珍视。',
    },
    specs: [
      { label: '容量', value: '110ml (标准工夫茶席)' },
      { label: '官网谱系', value: '手作茗壶 02 · 吴瑞全 孟臣梨壶' },
      { label: '泥料', value: '原矿赵庄精炼老朱泥' },
      { label: '窑温', value: '1160°C 还原气氛烧结' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'pot-02',
    name: '潮州非遗手拉朱泥壶·吴瑞全「大彬虚扁」',
    enName: 'Wu Ruiquan · Dabin Xubian Hand-Pulled Pot',
    category: 'teapot',
    subCategory: '潮州手拉朱泥壶',
    price: 4200,
    originalPrice: 4800,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/teapot/003-wu-ruiquan-dabin-xubian-wide.jpg',
    tagline: '扁腹舒展，骨肉停匀，聚香尤为出色',
    description: '春城嘉叶官网手作茗壶 03 号。扁腹舒展，骨肉停匀，聚香尤为出色。全凭匠人十指纯熟分寸感，使壶腹极扁而骨力充沛，极利聚香发茶。',
    origin: '广东 · 潮州',
    artisan: {
      name: '吴瑞全',
      title: '潮州手拉朱泥壶代表名家',
      bio: '以精准线条与器型张力著称，将潮汕茶席实战经验融入每件器物分寸之中。',
    },
    specs: [
      { label: '容量', value: '125ml' },
      { label: '官网谱系', value: '手作茗壶 03 · 吴瑞全 大彬虚扁' },
      { label: '泥料', value: '天然原矿陈腐老朱泥' },
      { label: '证书', value: '作者亲笔签署鉴藏证书' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'pot-03',
    name: '潮州非遗手拉朱泥壶·吴瑞全「乾隆盖壶」',
    enName: 'Wu Ruiquan · Qianlong Lid Zhuni Teapot',
    category: 'teapot',
    subCategory: '潮州手拉朱泥壶',
    price: 3800,
    originalPrice: 4300,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/teapot/005-wu-ruiquan-qianlong-gaihu-wide.jpg',
    tagline: '盖线端严，气度沉稳，收放有法',
    description: '春城嘉叶官网手作茗壶 05 号。盖线端严，气度沉稳，收放有法。复刻清代宫廷用壶形制，融入潮州手拉壶灵动之气，截盖平整严密。',
    origin: '广东 · 潮州',
    artisan: {
      name: '吴瑞全',
      title: '潮州手拉朱泥名家',
      bio: '一生沉浸于泥性与火候的交融，器物皆可经受数十年茶汤浸润。',
    },
    specs: [
      { label: '容量', value: '120ml' },
      { label: '官网谱系', value: '手作茗壶 05 · 吴瑞全 乾隆盖壶' },
      { label: '泥料', value: '精炼老朱泥' },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'pot-04',
    name: '名家潮州手拉朱泥·谢华「思婷壶」',
    enName: 'Master Xie Hua · Siting Zhuni Teapot',
    category: 'teapot',
    subCategory: '名家手拉朱泥壶',
    price: 6800,
    originalPrice: 7500,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/teapot/007-xie-hua-siting-wide.jpg',
    tagline: '器身修长婉转，线条轻盈而有筋骨',
    description: '春城嘉叶官网手作茗壶 07 号，中国工艺美术大师谢华之标志性形制「思婷」。器身修长婉转，线条轻盈而有筋骨，出水流畅劲爽，收藏级名物。',
    origin: '广东 · 潮州谢华名师工作室',
    artisan: {
      name: '谢华',
      title: '中国工艺美术大师 / 国家级非遗代表性传承人',
      bio: '潮州手拉壶一代巨擘，作品被中国国家博物馆等多家权威机构永久收藏。',
    },
    specs: [
      { label: '容量', value: '115ml' },
      { label: '官网谱系', value: '手作茗壶 07 · 谢华 思婷' },
      { label: '泥料', value: '特选原矿泥料' },
      { label: '收藏配置', value: '大师签名证书、特制锦盒' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'pot-05',
    name: '名家宜兴手拍·许广发「八角乾坤壶」',
    enName: 'Xu Guangfa · Octagonal Qiankun Teapot',
    category: 'teapot',
    subCategory: '宜兴手拍紫砂壶',
    price: 5200,
    originalPrice: 5800,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/teapot/006-xu-guangfa-bajiao-qiankun-wide.jpg',
    tagline: '方器见骨，八面转折分明而气脉贯通',
    description: '春城嘉叶官网手作茗壶 06 号，名家许广发精作。方器见骨，八面转折分明而气脉贯通；泥质古朴厚重，专为老生普与足火岩茶养润而作。',
    origin: '江苏 · 宜兴',
    artisan: {
      name: '许广发',
      title: '名家紫砂制壶师',
      bio: '长于方器与筋纹器，工艺精绝严谨。',
    },
    specs: [
      { label: '容量', value: '180ml' },
      { label: '官网谱系', value: '手作茗壶 06 · 许广发 八角乾坤' },
      { label: '泥料', value: '宜兴黄龙山原矿底槽清' },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'pot-06',
    name: '潮州非遗手拉朱泥壶·吴瑞全「小壶大器」',
    enName: 'Wu Ruiquan · Xiao Hu Da Qi Hand-Pulled Zhuni Pot',
    category: 'teapot',
    subCategory: '潮州手拉朱泥壶',
    price: 3900,
    originalPrice: 4500,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/teapot/001-wu-ruiquan-xiaohu-daqi-wide.jpg',
    tagline: '小器见大度，线条收束干净，握感轻巧',
    description: '春城嘉叶官网手作茗壶 01 号首推名作。小器见大度，线条收束干净，握感轻巧；以潮州工夫小品规制容天地大观，逼香扬味立竿见影。',
    origin: '广东 · 潮州枫溪手拉壶工坊',
    year: '2024 手工制',
    artisan: {
      name: '吴瑞全',
      title: '潮州手拉朱泥壶代表名家',
      bio: '深谙潮汕工夫茶席之道，器虽小而气局宏阔。',
    },
    specs: [
      { label: '容量', value: '95ml (精巧独酌 / 双人对饮)' },
      { label: '官网谱系', value: '手作茗壶 01 · 吴瑞全 小壶大器' },
      { label: '泥料', value: '原矿陈腐手拉朱泥' },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'pot-07',
    name: '潮州非遗手拉朱泥壶·吴瑞全「水平壶」',
    enName: 'Wu Ruiquan · Classic Shuiping Hand-Pulled Zhuni Pot',
    category: 'teapot',
    subCategory: '潮州手拉朱泥壶',
    price: 3500,
    originalPrice: 4000,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/teapot/004-wu-ruiquan-shuiping-wide.jpg',
    tagline: '经典水平形制，流把呼应，端正耐看',
    description: '春城嘉叶官网手作茗壶 04 号。经典水平形制，流把呼应，端正耐看；壶嘴、壶口、壶把三点齐平，淋水汤淋不偏不倚，乃潮州工夫茶席标准母型。',
    origin: '广东 · 潮州',
    year: '2024 手工制',
    artisan: {
      name: '吴瑞全',
      title: '潮州手拉朱泥壶代表名家',
      bio: '坚守传统潮汕工夫茶水平标准器制作。',
    },
    specs: [
      { label: '容量', value: '105ml' },
      { label: '官网谱系', value: '手作茗壶 04 · 吴瑞全 水平' },
      { label: '泥料', value: '潮州原矿黄朱泥调配老红泥' },
    ],
    inStock: true,
    featured: false,
  },

  // 3. 赏瓷雅器 (景德镇脉络 · 同步 chunchengjiaye.com 01—05 官网实拍图)
  {
    id: 'ware-01',
    name: '景德镇双描金白杯套组（一席四客）',
    enName: 'Jingdezhen Double Gold-Rim White Porcelain Cups (Set of 4)',
    category: 'teaware',
    subCategory: '景德镇雅瓷',
    price: 1280,
    originalPrice: 1480,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/porcelain-01.jpg',
    tagline: '白釉温润，细金线收束杯口，端雅克制',
    description: '春城嘉叶官网赏瓷雅器 01 号。白釉温润，细金线收束杯口，端雅克制。选用景德镇高白泥还原烧制，白如凝脂，茶汤注入如泛金光，聚香极佳。',
    origin: '江西 · 景德镇手工窑',
    specs: [
      { label: '套组配置', value: '品茗白杯 4客 (每客 45ml)' },
      { label: '官网谱系', value: '赏瓷雅器 01 · 双描金白杯套组' },
      { label: '工艺标准', value: '景德镇传统手工拉坯 + 手工描金二次烧结' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'ware-02',
    name: '景德镇金口玉言公道杯',
    enName: 'Golden Rim Porcelain Gongdao Serving Pitcher',
    category: 'teaware',
    subCategory: '景德镇雅瓷',
    price: 680,
    originalPrice: 780,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/porcelain-05.jpg',
    tagline: '金口微敛，出汤顺畅，分茶有度',
    description: '春城嘉叶官网赏瓷雅器 05 号。金口微敛，出汤顺畅，分茶有度。流口经数十次微调，出水圆润成线，断水利落不挂杯。',
    origin: '江西 · 景德镇',
    specs: [
      { label: '容量', value: '160ml' },
      { label: '官网谱系', value: '赏瓷雅器 05 · 金口玉言公道杯' },
      { label: '装饰', value: '杯口手工本金描饰' },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'ware-03',
    name: '春城嘉叶品牌限定白杯套组',
    enName: 'Chun Cheng Jia Ye Brand Limited White Cup Set',
    category: 'teaware',
    subCategory: '景德镇雅瓷',
    price: 980,
    originalPrice: 1180,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/porcelain-03.jpg',
    tagline: '品牌限定形制，比例舒展，适合成套陈设与待客',
    description: '春城嘉叶官网赏瓷雅器 03 号。品牌限定形制，比例舒展，适合成套陈设与待客。器底手工落款「春城嘉叶」，呈现沉静克制的东方气质。',
    origin: '江西 · 景德镇',
    specs: [
      { label: '规格', value: '一席3客 (各 50ml)' },
      { label: '官网谱系', value: '赏瓷雅器 03 · 品牌限定白杯套组' },
      { label: '底款', value: '春城嘉叶定制款识' },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'ware-04',
    name: '景德镇九秋杯套组',
    enName: 'Jingdezhen Jiuqiu Porcelain Tasting Cups',
    category: 'teaware',
    subCategory: '景德镇雅瓷',
    price: 860,
    originalPrice: 990,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/porcelain-04.jpg',
    tagline: '杯壁轻薄，聚香与观汤兼顾，适合细品',
    description: '春城嘉叶官网赏瓷雅器 04 号。杯壁轻薄，聚香与观汤兼顾，适合细品。胎薄如纸，击声如罄，专为细品高山单丛高锐香气而作。',
    origin: '江西 · 景德镇',
    specs: [
      { label: '容量', value: '55ml x 2客' },
      { label: '官网谱系', value: '赏瓷雅器 04 · 九秋杯套组' },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'ware-05',
    name: '景德镇赏瓷白杯套组（素面衬汤）',
    enName: 'Jingdezhen Pure White Porcelain Cup Set',
    category: 'teaware',
    subCategory: '景德镇雅瓷',
    price: 780,
    originalPrice: 920,
    image: 'https://www.chunchengjiaye.com/images/craftsmanship/porcelain-02.jpg',
    tagline: '素面净白，映茶汤本色，日常与茶席皆宜',
    description: '春城嘉叶官网赏瓷雅器 02 号。素面净白，映茶汤本色，日常与茶席皆宜。不施彩绘金饰，纯粹以景德镇高白泥釉光映衬单丛蜜黄与岩茶琥珀汤色。',
    origin: '江西 · 景德镇手工窑',
    specs: [
      { label: '套组配置', value: '素白品茗杯 4客 (每客 48ml)' },
      { label: '官网谱系', value: '赏瓷雅器 02 · 赏瓷白杯套组' },
      { label: '胎釉特征', value: '甜白釉感 · 映汤本色' },
    ],
    inStock: true,
    featured: false,
  },

  // 4. 爻 YÁO (便携饮茶探索 · 同步 chunchengjiaye.com 官网实拍图)
  {
    id: 'yao-01',
    name: '爻·茶简 / YÁO SINGLE INFUSION 便携金属茶棒概念礼盒',
    enName: 'YÁO SINGLE INFUSION Metal Tea Wand Concept Box',
    category: 'yao',
    subCategory: '爻 YÁO 当代便携',
    price: 498,
    originalPrice: 580,
    image: 'https://www.chunchengjiaye.com/images/yao/scene-gift.jpg',
    tagline: '「方便一点，标准不轻」 · 凡入爻，皆有据',
    description: '爻 YÁO 是春城嘉叶面向当下日常场景的便携饮茶探索。包含茶简（单支入杯）、单泡装（一袋一泡）与礼盒装。把好茶带回日常，让方便也有分寸。',
    origin: '春城嘉叶 · 爻 YÁO 产品体系',
    year: '2026 概念与日常系列',
    specs: [
      { label: '产品理念', value: '方便一点，标准不轻；凡入爻，皆有据' },
      { label: '三大构成', value: '01 茶简 · 02 单泡装 · 03 礼盒装' },
      { label: '六大场景', value: '清晨、夜读、案头、相谈、赠礼、出行' },
      { label: '标准承诺', value: '茶源与制作标准与主品牌一致，尚未定型绝不贸然上市' },
    ],
    brewingGuide: {
      temp: '90°C - 95°C 热水',
      ratio: '单支 : 250-350ml 随手杯',
      duration: '入杯浸润45秒，轻轻转动调节浓淡',
      pours: 3,
    },
    inStock: true,
    featured: true,
  },
];

/**
 * Consignment Secondary Market Items (器物茶叶寄售流转)
 */
export interface ConsignmentItem {
  id: string;
  name: string;
  enName: string;
  category: 'tea' | 'teapot' | 'antique';
  currentPrice: number;
  originalEstimate: number;
  sellerName: string;
  sellerTier: string;
  appraisalOrg: string;
  certificateNo: string;
  status: 'active' | 'in_review' | 'sold';
  warehouseLocation: string;
  condition: string;
  image: string;
  provenance: string;
  views: number;
  bidsCount?: number;
}

export const CONSIGNMENT_ITEMS: ConsignmentItem[] = [
  {
    id: 'csg-001',
    name: '1996年·中茶牌八八青饼（纯干仓）',
    enName: '1996 Zhongcha 88 Qingbing · Dry Warehouse',
    category: 'tea',
    currentPrice: 48000,
    originalEstimate: 52000,
    sellerName: '藏家·林墨客',
    sellerTier: '隐山会员',
    appraisalOrg: '春城嘉叶名物鉴藏委员会',
    certificateNo: 'CCJY-TC-9608821',
    status: 'active',
    warehouseLocation: '春城嘉叶恒温恒湿专业母仓 (深圳南山A-12)',
    condition: '9.8品（外包笋壳原封，条索分明，无仓味）',
    image: '/assets/aistudio/IMG_6492_3fd88e0f.JPG',
    provenance: '1996年勐海茶厂首批出厂，2004年由香港资深藏家整提入藏，2018年转入春城嘉叶专业母仓陈化。开汤梅子香转老木香，汤质极稠。',
    views: 1842,
    bidsCount: 6,
  },
  {
    id: 'csg-002',
    name: '清晚期·潮州老朱泥梨形梨皮手拉壶',
    enName: 'Late Qing Chaozhou Antique Pear Zhuni Teapot',
    category: 'teapot',
    currentPrice: 22000,
    originalEstimate: 25000,
    sellerName: '古砚草堂主人',
    sellerTier: '掌席会员',
    appraisalOrg: '潮州古陶瓷鉴藏研究所',
    certificateNo: 'CCJY-POT-189201',
    status: 'active',
    warehouseLocation: '春城嘉叶茶器与寄售专柜',
    condition: '全品无冲无磕，包浆莹润老气十足',
    image: '/assets/aistudio/IMG_6487_f774f6f1.JPG',
    provenance: '潮汕望族世家旧藏，底款「荆溪惠孟臣制」，泥料含天然粗砂颗粒，俗称梨皮朱泥，手感温存。',
    views: 2310,
    bidsCount: 11,
  },
  {
    id: 'csg-003',
    name: '2003年·原野樟香熟普砖茶（1000g）',
    enName: '2003 Aged Camphor Aroma Cooked Pu\'er Brick',
    category: 'tea',
    currentPrice: 6800,
    originalEstimate: 7500,
    sellerName: '南山茶客',
    sellerTier: '茶人会员',
    appraisalOrg: '春城嘉叶老茶品鉴中心',
    certificateNo: 'CCJY-TC-030914',
    status: 'active',
    warehouseLocation: '春城嘉叶干仓B-04',
    condition: '砖身硬朗，金毫内敛，红浓透亮',
    image: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
    provenance: '早期经典昆明茶厂老配方熟砖，经20年自然陈化，樟木香与熟药香沉着，入口即化。',
    views: 940,
    bidsCount: 4,
  },
  {
    id: 'csg-004',
    name: '当代大师手工·双描金白瓷公道杯（特展孤品）',
    enName: 'Master Handcrafted Gold-Rim Fair Cup',
    category: 'antique',
    currentPrice: 4200,
    originalEstimate: 4500,
    sellerName: '静水流深',
    sellerTier: '掌席会员',
    appraisalOrg: '春城嘉叶器物鉴藏部',
    certificateNo: 'CCJY-POT-202209',
    status: 'sold',
    warehouseLocation: '已交付流转 (闲鱼渠道成交)',
    condition: '完美品，纯金手工描饰温润',
    image: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    provenance: '景德镇名家特展参展器物，春城嘉叶茶器与寄售专线流转。',
    views: 3120,
  },
];

/**
 * Points Exchange Items (积分兑换中心)
 */
export interface PointsItem {
  id: string;
  name: string;
  enName: string;
  pointsRequired: number;
  tokenOffsetAllowed: number; // Max tokens you can use to substitute points
  stock: number;
  image: string;
  marketValue: number;
  description: string;
}

export const POINTS_ITEMS: PointsItem[] = [
  {
    id: 'pnt-01',
    name: '诸心·凤凰单丛便携品鉴尝鲜礼包',
    enName: 'Zhu Xin Dancong Tasting Set (Single Infusion)',
    pointsRequired: 1200,
    tokenOffsetAllowed: 20,
    stock: 28,
    image: '/assets/aistudio/IMG_6492_3fd88e0f.JPG',
    marketValue: 180,
    description: '包含诸心、清风挂怀、水栀子三款乌岽核心山场单丛原叶，独立充氮便携泡袋装。',
  },
  {
    id: 'pnt-02',
    name: '爻·茶简 YÁO SINGLE INFUSION 概念体验装',
    enName: 'YÁO SINGLE INFUSION Concept Tasting Wand',
    pointsRequired: 800,
    tokenOffsetAllowed: 15,
    stock: 45,
    image: '/assets/aistudio/IMG_6491_1582fce7.JPG',
    marketValue: 128,
    description: '穿孔金属概念茶棒单支入，方便一点，标准不轻。案头夜读随身直接入杯。',
  },
  {
    id: 'pnt-03',
    name: '景德镇赏瓷双描金白杯（单客）',
    enName: 'Jingdezhen Gold-Rim White Porcelain Tasting Cup',
    pointsRequired: 2500,
    tokenOffsetAllowed: 50,
    stock: 12,
    image: '/assets/aistudio/IMG_6486_3fb9fe71.JPG',
    marketValue: 360,
    description: '景德镇窑高温凝脂白瓷，双道纯金手工描饰，春城嘉叶会员专属兑换。',
  },
  {
    id: 'pnt-04',
    name: '《一叶有来处，一器有分寸》品牌典藏图录',
    enName: 'Chun Cheng Jia Ye Brand Monograph & Tea Ware Art Book',
    pointsRequired: 1600,
    tokenOffsetAllowed: 30,
    stock: 19,
    image: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    marketValue: 240,
    description: '收录吴瑞全手拉壶经典器型、凤凰单丛山场风土考及景德镇白瓷审美手记。',
  },
  {
    id: 'pnt-05',
    name: '春城嘉叶私享茶室双人品茗体验券',
    enName: 'Chun Cheng Jia Ye Tea Salon Voucher (2 Pax)',
    pointsRequired: 4000,
    tokenOffsetAllowed: 80,
    stock: 8,
    image: '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
    marketValue: 680,
    description: '包含两小时深圳市南山区私享茶舍使用权、专属侍茶师冲泡单丛及岩茶特选席。',
  },
];

/**
 * Tea Room Reservation Spaces (茶室预约)
 * 纯粹私享：全舍仅设一室一席，由主理人一人亲自侍茶执壶，古法橄榄炭炭火慢烧山泉水。
 */
export interface TeaSalonDetailedCopy {
  lead: string;
  roundsTitle?: string;
  teaRounds: { round: string; tea: string; pricePerJin: string; desc: string }[];
  vessels: { title: string; desc: string };
  charcoalNotes: string;
  scheduleNotes: string;
  snacks: string;
  notice: string;
}

export interface TeaRoom {
  id: string;
  name: string;
  enName: string;
  capacity: string;
  maxGuests: number;
  basePrice: number;
  image: string;
  theme: string;
  description: string;
  facilities: string[];
  recommendedTeas: string[];
  tierOrder?: number;
  duration?: string;
  noticeAdvance?: string;
  serviceType?: string;
  cancellationRule?: string;
  locationNote?: string;
  detailedCopy?: TeaSalonDetailedCopy;
}

export const TEA_ROOMS: TeaRoom[] = [
  {
    id: 'room-01',
    name: '主理人一对一 · 顶级茶席',
    enName: 'Private Master Sanctuary · Top-Tier Tea Salon',
    capacity: '1 人（可携 1 位同伴）',
    maxGuests: 2,
    basePrice: 2680,
    image: '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
    theme: '一对一专席 · 顶级岩茶与单丛 · 专车接送',
    tierOrder: 1,
    duration: '3–5 小时，时间由客户定',
    noticeAdvance: '提前 2 天预约',
    serviceType: '元/次',
    locationNote: '深圳·北站附近，私人茶室，不对外开放',
    cancellationRule: '开席前 24 小时取消，全额退还；24 小时内取消，可改期一次',
    description:
      '这一席，只为一个人开（可携一位同伴）。主理人全程亲自冲泡。他只守三样：凤凰单丛、武夷岩茶、潮州手拉壶。三泡茶，一泡比一泡往上走：1.28w/斤天花板凤凰单丛开味蕾；3.8w/斤高端武夷岩茶中足火入岩韵；8.8w/斤顶级武夷岩茶压轴登顶。好茶须用炭火，全程炭火候汤，炭煮活水直取茶汤。时间你定，提前两天私信沟通，时长 3–5 小时，不赶时间，茶喝透，话聊完为止。主理人自用 5w 起步手拉壶与万元级杯盏逐泡换器。店内藏器皆可上手。可安排专车接送。',
    facilities: [
      '一场只接待一人（可携一位同伴）',
      '主理人全程亲自冲泡 · 全程炭火候汤',
      '三泡茶逐级登顶（8.8w/斤 压轴登顶）',
      '主理人自用 5w 起步潮州手拉壶',
      '万元级柴窑公道壶与闻香杯 · 逐泡换器',
      '时长 3–5 小时 · 可安排专车接送',
    ],
    recommendedTeas: [
      '1.28w/斤｜天花板凤凰单丛（开味蕾）',
      '3.8w/斤｜高端武夷岩茶·中足火（入岩韵）',
      '8.8w/斤｜顶级武夷岩茶·中足火（压轴登顶）',
    ],
    detailedCopy: {
      lead: '这一席，只为一个人开（可携一位同伴）。主理人全程亲自冲泡。他只守三样：凤凰单丛、武夷岩茶、潮州手拉壶。',
      roundsTitle: '三泡茶，一泡比一泡往上走',
      teaRounds: [
        {
          round: '第一泡',
          tea: '天花板凤凰单丛',
          pricePerJin: '1.28w/斤',
          desc: '开味蕾，山韵通透，花蜜幽兰。',
        },
        {
          round: '第二泡',
          tea: '高端武夷岩茶',
          pricePerJin: '3.8w/斤',
          desc: '中足火，入岩韵，骨鲠沉郁，回甘悠长。',
        },
        {
          round: '第三泡',
          tea: '顶级武夷岩茶',
          pricePerJin: '8.8w/斤',
          desc: '中足火，压轴登顶——这一泡茶，即值这一席。',
        },
      ],
      vessels: {
        title: '主泡器：主理人自用（5w起步）',
        desc: '茶汤的风味，不只在茶——水、器、茶，三者缺一不可。换一件器，香和汤都跟着变——这一席三泡茶，逐泡换器，喝的就是这个变化。主理人日常喝茶在用的"潮州手拉壶"，不是摆着看的藏品——5w起步；出汤的公道壶，万元级别；配套的闻香杯，万元级别；三泡茶，逐泡换器。店内藏器皆可上手，慢慢看。',
      },
      charcoalNotes: '好茶须用炭火，全程炭火候汤。炭煮活水，直取茶汤。开哪款，按当季库存同级现场定。',
      scheduleNotes: '时间你定，提前两天私信沟通。时长 3–5 小时，不赶时间，茶喝透，话聊完为止。',
      snacks: '席间配茶食（三泡各配一味、随泡上）。',
      notice: '私人茶室在深圳·北站附近，提前2天私信预约，可安排专车接送。如需改期请提前24小时沟通；开席前24小时取消，全额退还，24小时内取消，可改期一次；一场只接待一人（可携一位同伴）。',
    },
  },
  {
    id: 'room-02',
    name: '主理人亲泡 · 炭火茶席（包场，可携3位）',
    enName: 'Private Charcoal Tea Salon · Exclusive Master Host',
    capacity: '一组（可携最多 3 位同伴，不拼席）',
    maxGuests: 4,
    basePrice: 1280,
    image: '/assets/aistudio/IMG_6486_3fb9fe71.JPG',
    theme: '独立包场 · 榄炭活泉 · 逐泡换器',
    tierOrder: 2,
    duration: '每场 3 小时（双时段任选）',
    noticeAdvance: '提前 1 天预约',
    serviceType: '元/次',
    locationNote: '深圳·北站附近，私人茶室，不对外开放',
    cancellationRule: '开席前 24 小时取消，全额退还；24 小时内取消，可改期一次',
    description:
      '深圳·北站附近，私人茶室，不对外开放。主理人亲泡，只守三样：凤凰单丛、武夷岩茶、潮州手拉壶。人少，茶才喝得安静。一场只接待一组，可携最多3位同伴，不与外人拼席。两个时间段任选，先约先得：下午场 14:00–17:00 / 夜晚场 20:00–23:00，每场 3 小时。炭煮活水，直取茶汤。三款茶（1.28w/斤清香型天花板、1.38w/斤浓香型天花板、2.28w/斤高端纯料中足火老枞），一泡十五冲，香不落，汤不薄。万元级潮州手拉壶、柴窑天花板公道杯与青花杯逐泡换器。煮水用砂铫，炭火现烧，件件可上手细看。带上你的人，安安静静喝好茶。',
    facilities: [
      '一场只接待一组（可携最多3位同伴，不拼席）',
      '下午场 14:00–17:00 ／ 夜晚场 20:00–23:00',
      '每场 3 小时 · 炭煮活水直取茶汤',
      '三款好茶（1.28w/斤、1.38w/斤、2.28w/斤纯料老枞）',
      '主泡器万元级潮州手拉壶 · 逐泡换器',
      '煮水用砂铫炭火现烧 · 席间配茶食',
    ],
    recommendedTeas: [
      '1.28w/斤｜凤凰单丛·清香型天花板（打开味蕾）',
      '1.38w/斤｜凤凰单丛·浓香型天花板（浓而不烈）',
      '2.28w/斤｜武夷岩茶·高端纯料老枞（收官见真章）',
    ],
    detailedCopy: {
      lead: '深圳·北站附近，私人茶室，不对外开放。主理人亲泡，只守三样：凤凰单丛、武夷岩茶、潮州手拉壶。人少，茶才喝得安静。一场只接待一组，可携最多3位同伴，不与外人拼席。',
      roundsTitle: '三款茶 · 一泡十五冲，香不落，汤不薄',
      teaRounds: [
        {
          round: '第一款',
          tea: '凤凰单丛·清香型天花板',
          pricePerJin: '1.28w/斤',
          desc: '打开味蕾，高扬花香，清冽回甘。',
        },
        {
          round: '第二款',
          tea: '凤凰单丛·浓香型天花板',
          pricePerJin: '1.38w/斤',
          desc: '浓而不烈，醇厚饱满，韵味深长。',
        },
        {
          round: '第三款',
          tea: '武夷岩茶·高端纯料中足火老枞',
          pricePerJin: '2.28w/斤',
          desc: '收官见真章，枞味入骨，兰香耐寻。',
        },
      ],
      vessels: {
        title: '主泡器：万元级别',
        desc: '茶汤的风味，不只在茶——水、器、茶，三者缺一不可。换一件器，香和汤都跟着变——这一席三泡茶，逐泡换器，喝的就是这个变化。主泡器用"潮州手拉壶"——按当天的茶选壶出汤；出汤的公道杯（柴窑天花板）万元级别；配套的闻香杯（柴窑青花杯）大千元级别；三泡茶，逐泡换器。煮水用砂铫，炭火现烧。件件可上手细看。',
      },
      charcoalNotes: '炭煮活水，直取茶汤。砂铫榄炭现烧，火候合度。',
      scheduleNotes: '两个时间段任选，先约先得：下午场 14:00–17:00；夜晚场 20:00–23:00。每场 3 小时。',
      snacks: '席间配茶食（一干一鲜两小碟）。',
      notice: '请至少提前1天私信约时间；如需改期，请提前1天沟通；开席前24小时取消，全额退还，24小时内取消，可改期一次。',
    },
  },
  {
    id: 'room-03',
    name: '主理人亲泡 · 初席',
    enName: 'Master Host Debut Tea Salon',
    capacity: '2–3 位（一场只接待两三位）',
    maxGuests: 3,
    basePrice: 598,
    image: '/assets/aistudio/IMG_6487_f774f6f1.JPG',
    theme: '初席正饮 · 炭火候汤 · 兴至添原茶',
    tierOrder: 3,
    duration: '2–3 小时，全程炭火候汤',
    noticeAdvance: '提前 1 天预约',
    serviceType: '元/场',
    locationNote: '深圳·北站附近，私人茶室，不对外开放',
    cancellationRule: '开席前 24 小时取消，全额退还；24 小时内取消，可改期一次',
    description:
      '深圳·北站附近，私人茶室，不对外开放。主理人亲泡，只守三样：凤凰单丛、武夷岩茶、潮州手拉壶。这一席，是为"第一次"正经坐下来喝茶的人开的。一场只接待两三位，时长2-3小时，全程炭火候汤。主理人亲泡两款凤凰单丛：第一泡清香型天花板 1.28w/斤开味蕾；第二泡浓香型天花板 1.38w/斤浓而不烈。炭煮活水，直取茶汤。两泡是规矩，规矩之外看兴致：聊得尽兴、喝得投机，主理人兴致到了，会再添一泡自己存着的原茶；你若带了好茶来，也摆上桌一起喝。这一泡不写在规格里——茶桌上的人情从来不是靠写的。席上用器求干净利落，配套盖碗冲泡，玻璃公道杯出汤，白瓷杯品饮，器不抢茶风头。席间配茶食。',
    facilities: [
      '为"第一次"正经坐下来喝茶的人开',
      '一场只接待两三位 · 时长 2–3 小时',
      '全程炭火候汤 · 炭煮活水直取茶汤',
      '两款天花板凤凰单丛（1.28w/斤 与 1.38w/斤）',
      '规矩之外看兴致 · 尽兴可添主理人私藏原茶',
      '盖碗冲泡与白瓷盏 · 席间配茶食',
    ],
    recommendedTeas: [
      '1.28w/斤｜凤凰单丛·清香型天花板（开味蕾）',
      '1.38w/斤｜凤凰单丛·浓香型天花板（浓而不烈）',
    ],
    detailedCopy: {
      lead: '深圳·北站附近，私人茶室，不对外开放。主理人亲泡，只守三样：凤凰单丛、武夷岩茶、潮州手拉壶。这一席，是为"第一次"正经坐下来喝茶的人开的。一场只接待两三位，时长2-3小时，全程炭火候汤。',
      roundsTitle: '主理人亲泡 · 两款凤凰单丛',
      teaRounds: [
        {
          round: '第一泡',
          tea: '清香型·天花板',
          pricePerJin: '1.28w/斤',
          desc: '开味蕾，活泉生香，喉韵甘润。',
        },
        {
          round: '第二泡',
          tea: '浓香型·天花板',
          pricePerJin: '1.38w/斤',
          desc: '浓而不烈，中火焙香，醇厚绵长。',
        },
      ],
      vessels: {
        title: '席上用器：求干净利落',
        desc: '配套盖碗冲泡，玻璃公道杯出汤，白瓷杯品饮——器不抢茶的风头。席间配茶食。',
      },
      charcoalNotes: '炭煮活水，直取茶汤。全程炭火候汤。',
      scheduleNotes: '两泡是规矩，规矩之外，看兴致：聊得尽兴、喝得投机，主理人兴致到了，会再添一泡自己存着的原茶；你若带了好茶来，也摆上桌，一起喝。这一泡，不写在规格里——茶桌上的人情，从来不是靠写的。',
      snacks: '席间配茶食（原味坚果一小碟）。',
      notice: '请至少提前1天私信约时间；如需改期，请提前24小时沟通；开席前24小时取消，全额退还，24小时内取消，可改期一次。',
    },
  },
];

export interface Sommelier {
  id: string;
  name: string;
  title: string;
  experience: string;
  avatar: string;
  specialty: string;
}

export const SOMMELIERS: Sommelier[] = [
  {
    id: 'som-host',
    name: '主理人',
    title: '春城嘉叶茶舍主理人',
    experience: '行茶十五载',
    avatar: '叶',
    specialty: '古法红泥炉炭火候汤 · 潮州工夫原法 · 正岩与单丛亲泡',
  },
];
