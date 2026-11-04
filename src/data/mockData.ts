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
  // 1. 山场原叶 (凤凰单丛与武夷岩茶)
  {
    id: 'tea-dancong-01',
    name: '诸心·凤凰单丛（便携泡袋装）',
    enName: 'Zhu Xin · Fenghuang Dancong (Single Infusion Bag)',
    category: 'tea',
    subCategory: '凤凰单丛',
    price: 680,
    originalPrice: 780,
    image: '/assets/aistudio/IMG_6486_3fb9fe71.JPG',
    tagline: '山场原叶 · 便携泡袋 · 蜜兰清韵',
    description: '源于潮州凤凰山乌岽核心山场，精选高山原叶。轻焙微透，干茶条索紧结乌褐。滚水急出不闷，花蜜香高扬持久，回甘极快，喉韵清润回甘。',
    origin: '广东 · 潮州凤凰山乌岽核心山场',
    year: '2024 甲辰春采',
    specs: [
      { label: '规格', value: '40g (5g x 8包便携泡袋装)' },
      { label: '工艺标准', value: '传统炭火文火轻焙' },
      { label: '风味特征', value: '栀子花香、山野蜜韵' },
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
    image: '/assets/aistudio/IMG_6487_f774f6f1.JPG',
    tagline: '清风过岭 · 幽香入骨 · 独立单泡',
    description: '高海拔老丛单株精采，山场日照充足，云雾缭绕。香气高锐而含蓄，入口甘泉涌现，微涩瞬化，回甘如清风拂面，经久不散。',
    origin: '广东 · 潮州凤凰山高山林区',
    year: '2024 春茶',
    specs: [
      { label: '规格', value: '50g (5g x 10包独立袋)' },
      { label: '茶树类型', value: '半乔木型老丛' },
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
    image: '/assets/aistudio/IMG_6492_3fd88e0f.JPG',
    tagline: '经典栀子香型 · 汤质醇滑如绢',
    description: '凤凰单丛传统名丛之一，栀子花香入骨，茶汤澄黄明亮，稠厚温润。每一泡香气随温度变化层叠展开，甘韵绵长。',
    origin: '广东 · 潮州',
    year: '2024 特选',
    specs: [
      { label: '净含量', value: '60g 便携盒装' },
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
    id: 'tea-wuyi-01',
    name: '沉芳·武夷岩茶（正岩）',
    enName: 'Chen Fang · Wuyi Rock Tea Authentic Reserve',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 1380,
    originalPrice: 1580,
    image: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
    tagline: '丛味百年 · 沉香内敛 · 岩骨花香',
    description: '源于武夷山三坑两涧正岩山场，春城嘉叶联名监制。传统炭焙文火慢炖，青苔与棕叶香沉着，茶汤厚重如果冻，十泡余香不绝。',
    origin: '福建 · 武夷山慧苑坑正岩核心山场',
    year: '2023 癸卯足火炭焙',
    specs: [
      { label: '规格', value: '64g (8g x 8泡礼匣)' },
      { label: '山场', value: '正岩慧苑坑老枞' },
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
    image: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    tagline: '诗时拾食 · 骨力刚劲 · 辛锐霸气',
    description: '牛栏坑与天心岩核心向阳山场肉桂，干茶紧结乌亮。开汤辛锐桂皮香与焦糖奶油香并起，汤感稠滑霸气，生津极其迅猛，春城嘉叶岩茶旗舰。',
    origin: '福建 · 武夷山天心岩核心场',
    year: '2024 甲辰特采',
    specs: [
      { label: '规格', value: '60g 桐木黑金礼盒' },
      { label: '火工', value: '中度火 传统竹笼文火炭焙' },
    ],
    brewingGuide: {
      temp: '100°C 悬壶高冲',
      ratio: '8g : 110ml 朱泥小品',
      duration: '即冲即出，前3泡不坐杯',
      pours: 16,
    },
    inStock: true,
    featured: false,
  },
  {
    id: 'tea-wuyi-03',
    name: '兰芷·武夷岩茶',
    enName: 'Lan Zhi · Wuyi Elegant Floral Rock Tea',
    category: 'tea',
    subCategory: '武夷岩茶',
    price: 880,
    originalPrice: 1080,
    image: '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
    tagline: '幽兰生幽谷 · 木质清甜 · 柔美悠长',
    description: '以幽兰花香与木质底蕴见长，焙火恰到好处，既保留清新幽雅的花香，又具备正岩的醇滑温润。',
    origin: '福建 · 武夷山正岩',
    year: '2024 春茶',
    specs: [
      { label: '规格', value: '64g (8g x 8泡)' },
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

  // 2. 手作茗壶 (潮州手拉与宜兴手拍)
  {
    id: 'pot-01',
    name: '潮州非遗手拉朱泥壶·吴瑞全「孟臣梨壶」',
    enName: 'Chaozhou Intangible Heritage · Wu Ruiquan Mengchen Pear Pot',
    category: 'teapot',
    subCategory: '潮州手拉朱泥壶',
    price: 3600,
    originalPrice: 4200,
    image: '/assets/aistudio/IMG_6487_f774f6f1.JPG',
    tagline: '吴瑞全大师亲制 · 潮州百年手拉技艺 · 110ml 功夫绝配',
    description: '名家吴瑞全手拉成型，壶壁薄而致密，颗粒隐现。朱泥收缩率高达25%，成型难度极高。出水如柱，断水利落，聚香聚气，冲泡凤凰单丛与武夷岩茶之圣器。',
    origin: '广东 · 潮州枫溪手拉壶工坊',
    year: '2024 手工制',
    artisan: {
      name: '吴瑞全',
      title: '潮州手拉朱泥壶代表名家 / 非遗制壶大师',
      bio: '从艺数十载，恪守经典孟臣规制，线条洗练温润，泥料精炼陈腐数年，作品深受国内外茶人藏家珍视。',
    },
    specs: [
      { label: '容量', value: '110ml (标准工夫茶席)' },
      { label: '泥料', value: '原矿赵庄精炼老朱泥' },
      { label: '出水孔', value: '单孔配精制梅花滤' },
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
    image: '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
    tagline: '扁而不塌 · 气度端凝 · 吴瑞全手拉代表作',
    description: '虚扁极难拉制，全凭匠人十指纯熟分寸感，使壶腹极扁而骨力充沛。极利聚香发茶，尤适合冲泡条索紧结之武夷岩茶。',
    origin: '广东 · 潮州',
    artisan: {
      name: '吴瑞全',
      title: '潮州手拉朱泥壶代表名家',
      bio: '以精准线条与器型张力著称，将潮汕茶席实战经验融入每件器物分寸之中。',
    },
    specs: [
      { label: '容量', value: '125ml' },
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
    image: '/assets/aistudio/IMG_6491_1582fce7.JPG',
    tagline: '器度雍容 · 子母线严丝合缝 · 手握温存',
    description: '复刻清代宫廷用壶形制，融入潮州手拉壶灵动之气。截盖平整严密，出水利落如引弦。',
    origin: '广东 · 潮州',
    artisan: {
      name: '吴瑞全',
      title: '潮州手拉朱泥名家',
      bio: '一生沉浸于泥性与火候的交融，器物皆可经受数十年茶汤浸润。',
    },
    specs: [
      { label: '容量', value: '120ml' },
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
    image: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
    tagline: '中国工艺美术大师谢华力作 · 婀娜俊秀 · 传世经典',
    description: '中国工艺美术大师谢华之标志性形制「思婷」。器型如俊俏佳人，梨形身筒线条柔美上收，出水流畅劲爽，收藏级名物。',
    origin: '广东 · 潮州谢华名师工作室',
    artisan: {
      name: '谢华',
      title: '中国工艺美术大师 / 国家级非遗代表性传承人',
      bio: '潮州手拉壶一代巨擘，作品被中国国家博物馆等多家权威机构永久收藏。',
    },
    specs: [
      { label: '容量', value: '115ml' },
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
    image: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    tagline: '八方端庄 · 手工镶接打磨 · 刚柔并济',
    description: '名家许广发精作，八角面面俱到，线面交界锋芒内敛。泥质古朴厚重，专为老生普与足火岩茶养润而作。',
    origin: '江苏 · 宜兴',
    artisan: {
      name: '许广发',
      title: '名家紫砂制壶师',
      bio: '长于方器与筋纹器，工艺精绝严谨。',
    },
    specs: [
      { label: '容量', value: '180ml' },
      { label: '泥料', value: '宜兴黄龙山原矿底槽清' },
    ],
    inStock: true,
    featured: false,
  },

  // 3. 赏瓷雅器 (景德镇脉络)
  {
    id: 'ware-01',
    name: '景德镇双描金白杯套组（一席四客）',
    enName: 'Jingdezhen Double Gold-Rim White Porcelain Cups (Set of 4)',
    category: 'teaware',
    subCategory: '景德镇雅瓷',
    price: 1280,
    originalPrice: 1480,
    image: '/assets/aistudio/IMG_6486_3fb9fe71.JPG',
    tagline: '景德镇脉络 · 高温凝脂白瓷 · 双道纯金描金',
    description: '春城嘉叶瓷器产品植根景德镇脉络。选用高白泥还原烧制，白如凝脂，胎质细腻致密。杯口手工勾勒双道本金金边，茶汤注入如泛金光，聚香极佳。',
    origin: '江西 · 景德镇手工窑',
    specs: [
      { label: '套组配置', value: '品茗白杯 4客 (每客 45ml)' },
      { label: '工艺标准', value: '景德镇传统手工拉坯 + 手工描金二次烧结' },
      { label: '胎质', value: '特级高白泥 1330°C 高温还原烧' },
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
    image: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    tagline: '金口玉言 · 出汤如线 · 断水干净利落',
    description: '流口经数十次开模微调，出水圆润汇聚成线，回汤不倒流滴沥。杯壁洁白通透，观单丛金黄或岩茶橙红格外纯正。',
    origin: '江西 · 景德镇',
    specs: [
      { label: '容量', value: '160ml' },
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
    image: '/assets/aistudio/IMG_6492_3fd88e0f.JPG',
    tagline: '品牌限定 · 羊脂玉温润质感 · 杯底落款',
    description: '专为春城嘉叶会员定制的席主白杯，器型微侈，唇感温润舒适。器底手工落款「春城嘉叶」，呈现沉静克制的东方气质。',
    origin: '江西 · 景德镇',
    specs: [
      { label: '规格', value: '一席3客 (各 50ml)' },
      { label: '底款', value: '春城嘉叶行草青花款' },
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
    image: '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
    tagline: '九秋清意 · 薄胎微透 · 聚香散气相宜',
    description: '取九秋旷达空灵之意，胎薄如纸，击声如罄。专为细品高山单丛高锐香气而作。',
    origin: '江西 · 景德镇',
    specs: [
      { label: '容量', value: '55ml x 2客' },
    ],
    inStock: true,
    featured: false,
  },

  // 4. 爻 YÁO (便携饮茶探索)
  {
    id: 'yao-01',
    name: '爻·茶简 / YÁO SINGLE INFUSION 便携金属茶棒概念礼盒',
    enName: 'YÁO SINGLE INFUSION Metal Tea Wand Concept Box',
    category: 'yao',
    subCategory: '爻 YÁO 当代便携',
    price: 498,
    originalPrice: 580,
    image: '/assets/aistudio/IMG_6491_1582fce7.JPG',
    tagline: '「方便一点，标准不轻」 · 凡入爻，皆有据',
    description: '爻 YÁO 面向当代案头、夜读、出行、相谈及赠礼场景。采用穿孔金属茶棒概念结构，单支独立密封保护，可直接入杯冲泡。高山原叶在微孔中自然舒展，搅拌控浓随心，告别碎末茶包。',
    origin: '春城嘉叶 · 爻 YÁO 实验室',
    year: '2026 开发概念限定',
    specs: [
      { label: '产品理念', value: '方便一点，标准不轻；凡入爻，皆有据' },
      { label: '规格配置', value: '穿孔金属茶简 6支入 (每支单泡完整原叶)' },
      { label: '适用场景', value: '案头工作、夜读沉思、差旅随行、相谈赠礼' },
      { label: '材质说明', value: '食品级精密打孔合金管 + 充氮独立护套' },
    ],
    brewingGuide: {
      temp: '90°C - 95°C 热水',
      ratio: '单支 : 250-350ml 随手杯',
      duration: '入杯浸润45秒，转动2-3圈调节浓淡',
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
 */
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
}

export const TEA_ROOMS: TeaRoom[] = [
  {
    id: 'room-01',
    name: '「月藏」THE MOON\'S SILENT RETREAT',
    enName: 'Moon Silent Mountain Retreat',
    capacity: '2 - 6 人',
    maxGuests: 6,
    basePrice: 680,
    image: '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
    theme: '月藏山水 · 幽玄枯山水庭院',
    description: '春城嘉叶（深圳南山）旗舰茶舍核心席位。依窗眺望私家枯山水庭院与青苔竹影，配备纯银急须与吴瑞全手拉朱泥壶，远离都市尘嚣的深沉冥想空间。',
    facilities: ['独立枯山水庭院', '潮州工夫茶四宝席', '吴瑞全手拉朱泥壶', '专业级茶席恒温矿泉水', '专属侍茶师'],
    recommendedTeas: ['诸心·凤凰单丛', '沉芳·武夷岩茶', '水栀子·单丛'],
  },
  {
    id: 'room-02',
    name: '「竹寂」BAMBOO SILENCE',
    enName: 'Bamboo Silence Pavilion',
    capacity: '1 - 4 人',
    maxGuests: 4,
    basePrice: 480,
    image: '/assets/aistudio/IMG_6491_1582fce7.JPG',
    theme: '竹影婆娑 · 慢生活哲学',
    description: '竹林环抱的素朴空间，微风吹拂竹叶沙沙作响。柔和天光洒落长条老木茶桌，适合挚友小叙或一人静心品味山场原叶。',
    facilities: ['全景观竹格栅', '天然草木线香', '景德镇双描金白杯套组', '静音纯净水系统'],
    recommendedTeas: ['清风挂怀·单丛', '兰芷·武夷岩茶', '爻·茶简'],
  },
  {
    id: 'room-03',
    name: '「裕唐」SHIN TANG CEREMONY',
    enName: 'Shin Tang Grand Poetry Chamber',
    capacity: '4 - 10 人',
    maxGuests: 10,
    basePrice: 1280,
    image: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    theme: '诗时拾食 · 沉香墨韵大雅集',
    description: '宽阔的东方黑金墨韵殿堂级茶室，陈设明代古董案几与名家水墨立轴，专为高规格商务茶叙、名家壶友鉴赏会及高端私宴量身打造。',
    facilities: ['独立 VIP 专属通道', '恒温恒湿母仓展柜', '双侍茶师席位', '投屏与雅集录音设备', '茶点定制服务'],
    recommendedTeas: ['水龙吟·正岩肉桂', '沉芳·武夷岩茶', '1996年老生普'],
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
    id: 'som-01',
    name: '苏婉',
    title: '首席潮州工夫侍茶师',
    experience: '行茶十一年',
    avatar: '婉',
    specialty: '潮州工夫茶法（关公巡城/韩信点兵） · 凤凰单丛滚水急出',
  },
  {
    id: 'som-02',
    name: '陈默',
    title: '武夷岩茶与器物顾问',
    experience: '行茶十四年',
    avatar: '默',
    specialty: '正岩山场气韵辨识 · 潮州手拉与宜兴手拍壶养器',
  },
  {
    id: 'som-03',
    name: '何清晏',
    title: '爻 YÁO 创新茶事研习师',
    experience: '行茶八年',
    avatar: '晏',
    specialty: '当代茶简冲泡调控 · 景德镇赏瓷白杯茶席美学',
  },
];
