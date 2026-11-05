/**
 * Authentic Official Website Data from https://www.chunchengjiaye.com
 * 春城嘉叶（深圳）茶业有限公司 · 茶与器品牌官网
 * 包含：
 * 1. 品牌理念与八段品牌历程 (01. 理念 / 02. 历程)
 * 2. 爻 YÁO · 茶简 三大产品系统与六大真实日常场景 (03. 爻 YÁO)
 * 3. 茶与器三章全谱系：山场原叶 30 款、赏瓷雅器 5 款、手作茗壶 7 款 (04. 茶与器)
 * 4. 品牌动态 4 篇官方专栏与企业备案信息 (05. 联系 & 品牌动态)
 */

export const OFFICIAL_SITE_ORIGIN = 'https://www.chunchengjiaye.com';

export interface BrandHistoryMilestone {
  step: string;
  phase: string;
  description: string;
}

export const BRAND_HISTORY_MILESTONES: BrandHistoryMilestone[] = [
  {
    step: '01',
    phase: '缘起',
    description: '潮州人与茶的日常，从凤凰单丛与潮州手拉壶开始。',
  },
  {
    step: '02',
    phase: '深耕',
    description: '长期经营、收藏手拉壶，也持续理解茶汤与器物之间的关系。',
  },
  {
    step: '03',
    phase: '转型',
    description: '市场变化之后重新梳理品牌，正式启用“春城嘉叶”并完成品牌注册。',
  },
  {
    step: '04',
    phase: '革新',
    description: '把传统单丛从罐装转为便于携带的泡袋装，让一泡好茶更从容地进入日常。',
  },
  {
    step: '05',
    phase: '设计',
    description: '以鲜明命名与包装重塑产品表达，保留传统底色，也增加当代趣味。',
  },
  {
    step: '06',
    phase: '拓展',
    description: '从凤凰单丛延伸至联名武夷岩茶，逐步形成更完整的山场原叶脉络。',
  },
  {
    step: '07',
    phase: '器物',
    description: '在潮州手拉壶之外，陆续纳入宜兴紫砂手拍壶与景德镇瓷器，持续寻找与茶相宜之器。',
  },
  {
    step: '08',
    phase: '当下',
    description: '以茶、器与长期会员关系为核心，记录来源、品鉴与每一次真实选择。',
  },
];

export interface YaoSystemPillar {
  code: string;
  enTitle: string;
  title: string;
  image: string;
}

export const OFFICIAL_YAO_PILLARS: YaoSystemPillar[] = [
  {
    code: '01',
    enTitle: 'PRODUCT SYSTEM',
    title: '产品、开盒与单支形态',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/yao-concept.jpg`,
  },
  {
    code: '02',
    enTitle: 'PROTECTION',
    title: '独立保护，清楚看见结构',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/yao-single-stick.jpg`,
  },
  {
    code: '03',
    enTitle: 'IN USE',
    title: '直接入杯，动作不遮住产品',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/yao-steeping.jpg`,
  },
];

export interface YaoDailyScenario {
  index: string;
  title: string;
  description: string;
  image: string;
}

export const OFFICIAL_YAO_SCENARIOS: YaoDailyScenario[] = [
  {
    index: '01',
    title: '清晨 / 日常不降级',
    description: '一支入杯，减少器具负担，但保留对茶汤的观察。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/morning.jpg`,
  },
  {
    index: '02',
    title: '夜读 / 留下判断',
    description: '饮用与记录同时发生，让一次选择有迹可循。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/reading.jpg`,
  },
  {
    index: '03',
    title: '案头 / 忙中有序',
    description: '工作间隙仍能清楚看见茶简与茶汤，不让步骤占据注意力。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/office.jpg`,
  },
  {
    index: '04',
    title: '相谈 / 一杯有据',
    description: '两杯并置，让共同品饮回到滋味与当下的交流。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/sharing.jpg`,
  },
  {
    index: '05',
    title: '赠礼 / 克制表达',
    description: '以完整包装承载心意，具体内容仍以正式量产信息为准。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/gifting.jpg`,
  },
  {
    index: '06',
    title: '出行 / 随行有度',
    description: '在临时停留处保持简洁使用，不把场景包装成产地或批次证明。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/yao/travel.jpg`,
  },
];

export interface OfficialArchiveItem {
  index: string;
  name: string;
  subCategory: '凤凰单丛' | '武夷岩茶' | '景德镇赏瓷' | '潮州手拉壶' | '宜兴手拍壶';
  chapter: 'tea' | 'porcelain' | 'teapot';
  artisan?: string;
  caption: string;
  image: string;
  matchedProductId: string;
}

/**
 * Chapter 01: 山场原叶 01 — 30 (凤凰单丛 · 武夷岩茶)
 */
export const OFFICIAL_TEA_ARCHIVE: OfficialArchiveItem[] = [
  {
    index: '01',
    name: '沉芳',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '古人以芳寄清赏，今人把片刻从容留给一盏；名字含蓄，饮茶亦可不急。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/001-chenfang-wide.jpg`,
    matchedProductId: 'tea-wuyi-01',
  },
  {
    index: '02',
    name: '东方不败（金）',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '旧日茶席讲功夫，今日独饮讲节奏；金色写在包装上，分寸仍要回到杯中。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/002-dongfang-gold-wide.jpg`,
    matchedProductId: 'tea-dancong-04',
  },
  {
    index: '03',
    name: '黛',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '黛色曾被用来写远山，今天落在一款茶的名字里；古意不远，只需静坐一泡。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/003-dai-wide.jpg`,
    matchedProductId: 'tea-wuyi-04',
  },
  {
    index: '04',
    name: '东方不败（蓝金）',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '蓝与金把传统名字带入当下；茶可以有鲜明外观，入口的判断仍归自己。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/004-dongfang-blue-gold-wide.jpg`,
    matchedProductId: 'tea-dancong-04',
  },
  {
    index: '05',
    name: '东方不败（新版）',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '同一名字也会随时代换一身表达；包装更新，认真泡茶的心意不必改变。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/005-dongfang-new-wide.jpg`,
    matchedProductId: 'tea-dancong-04',
  },
  {
    index: '06',
    name: '馡',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '馡，香气芬芳之意；岩韵与焙火交叠，余香缓缓展开，在茶汤中留下一段清润回甘。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/006-fei-wide.jpg`,
    matchedProductId: 'tea-wuyi-05',
  },
  {
    index: '07',
    name: '兰芷',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '兰芷自古寄托清雅，今天不必只在诗里；一席茶、一段闲时，便能让古意落地。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/007-lanzhi-wide.jpg`,
    matchedProductId: 'tea-wuyi-03',
  },
  {
    index: '08',
    name: '霝',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '古字留有雨意，今日读来仍有余韵；一盏茶把陌生的字，慢慢变成熟悉的时刻。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/008-ling-wide.jpg`,
    matchedProductId: 'tea-wuyi-05',
  },
  {
    index: '09',
    name: '南罗清（甲辰年）',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '干支纪年连接旧历与今日，南罗清把时间写进名字；年份是坐标，杯中感受仍在当下。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/009-nanluoqing-jiachen-wide.jpg`,
    matchedProductId: 'tea-wuyi-06',
  },
  {
    index: '10',
    name: '南罗清（十年陈）',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '古人以岁月观物，今人也懂得等待；十年陈写明时间，品饮仍从当下这一泡开始。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/010-nanluoqing-aged-wide.jpg`,
    matchedProductId: 'tea-wuyi-06',
  },
  {
    index: '11',
    name: '沁',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '一个沁字，古今都写清意入心；茶事不必繁复，让片刻清醒回到日常。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/011-qin-wide.jpg`,
    matchedProductId: 'tea-wuyi-03',
  },
  {
    index: '12',
    name: '清风挂怀',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '古诗中的清风常寄怀抱，今日一盏也能安放心绪；风过无形，茶意有声。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/012-qingfeng-guahuai-wide.jpg`,
    matchedProductId: 'tea-dancong-02',
  },
  {
    index: '13',
    name: '如来',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '名字取一分静定，不必把茶说得玄远；从前人的静坐到今日书桌，先安住这一刻。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/013-rulai-wide.jpg`,
    matchedProductId: 'tea-dancong-02',
  },
  {
    index: '14',
    name: '叒清',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '叠字成趣，旧字新用；清不只是滋味想象，也是一种删繁就简的饮茶态度。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/014-ruoqing-wide.jpg`,
    matchedProductId: 'tea-wuyi-06',
  },
  {
    index: '15',
    name: '十方莲华（1000）',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '十方莲华承接东方意象，数字则辨识当代版本；意境可以辽阔，落杯仍是一人一盏。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/015-shifang-lianhua-wide.jpg`,
    matchedProductId: 'tea-wuyi-07',
  },
  {
    index: '16',
    name: '水龙吟',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '古词牌名穿过岁月，今日又成为茶名；吟咏有长短句，冲泡也有自己的起承转合。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/016-shuilongyin-wide.jpg`,
    matchedProductId: 'tea-wuyi-02',
  },
  {
    index: '17',
    name: '水栀子',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '栀子入诗入画，水意添了轻盈；旧日花事到了今天，化成茶桌上一句清雅题名。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/017-shuizhizi-wide.jpg`,
    matchedProductId: 'tea-dancong-03',
  },
  {
    index: '18',
    name: '水漫津山',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '山水意象自古入画，今天也进入茶名；一泡之间，不妨从忙碌回到开阔。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/018-shuimanjinshan-wide.jpg`,
    matchedProductId: 'tea-dancong-03',
  },
  {
    index: '19',
    name: '桃花仙',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '桃花从古典诗境走到当代茶席，仍带几分洒脱；饮茶不问仙境，只借一刻自在。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/019-taohuaxian-wide.jpg`,
    matchedProductId: 'tea-dancong-05',
  },
  {
    index: '20',
    name: '桃花仙（甲辰年）',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '桃花意象遇上干支纪年，浪漫与时间同在；名字记住一岁，茶席留住此刻。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/020-taohuaxian-jiachen-wide.jpg`,
    matchedProductId: 'tea-dancong-05',
  },
  {
    index: '21',
    name: '香如故',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '如故写的是时间之后仍可相认；古人借香寄情，今人以一盏重逢熟悉的日常。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/021-xiangrugu-wide.jpg`,
    matchedProductId: 'tea-dancong-06',
  },
  {
    index: '22',
    name: '辛玉',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '辛与玉，一刚一润，像古人命名时的留白；今日读来仍利落，也为茶席添一分个性。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/022-xinyu-wide.jpg`,
    matchedProductId: 'tea-wuyi-02',
  },
  {
    index: '23',
    name: '崟',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '崟写山势高峻，古字简短而有骨；放到今天，茶名也可以安静却有力量。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/023-yin-wide.jpg`,
    matchedProductId: 'tea-wuyi-01',
  },
  {
    index: '24',
    name: '隐无名',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '古人重藏锋，今人也需要远离喧闹；无名不是无物，而是把判断留给亲自品饮。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/024-yinwuming-wide.jpg`,
    matchedProductId: 'tea-dancong-06',
  },
  {
    index: '25',
    name: '玥',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '一字常被赋予明珠之意，今日成为简洁茶名；珍重不必张扬，一盏认真对待便已足够。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/025-yue-wide.jpg`,
    matchedProductId: 'tea-wuyi-04',
  },
  {
    index: '26',
    name: '珠落',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '珠落有声，是古典意象里的清脆一笔；来到今日茶席，名字先开一境，滋味再由杯中回答。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/026-zhuluo-wide.jpg`,
    matchedProductId: 'tea-wuyi-03',
  },
  {
    index: '27',
    name: '诸心',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '诸心把目光从一味茶转向万般心境；古人以茶会友，今人也在一盏之间照见自己。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/027-zhuxin-wide.jpg`,
    matchedProductId: 'tea-dancong-01',
  },
  {
    index: '28',
    name: '诸心（限量版）',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '限量是当代的版本语言，诸心仍是古老命题；数量有界，品饮的感受不必相同。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/028-zhuxin-limited-wide.jpg`,
    matchedProductId: 'tea-dancong-01',
  },
  {
    index: '29',
    name: '诸心（银）',
    subCategory: '凤凰单丛',
    chapter: 'tea',
    caption: '银色为当代包装定下清简秩序，诸心延续向内观照；外在有别，茶席仍归于真切。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/029-zhuxin-silver-wide.jpg`,
    matchedProductId: 'tea-dancong-01',
  },
  {
    index: '30',
    name: '南罗清',
    subCategory: '武夷岩茶',
    chapter: 'tea',
    caption: '三字音韵以清收束，古意含蓄；今日品茶，先不设答案，让一泡慢慢展开。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea/030-nanluoqing-wide.jpg`,
    matchedProductId: 'tea-wuyi-06',
  },
];

/**
 * Chapter 02: 赏瓷雅器 01 — 05 (器形 · 釉色 · 席间分寸)
 */
export const OFFICIAL_PORCELAIN_ARCHIVE: OfficialArchiveItem[] = [
  {
    index: '01',
    name: '赏瓷白杯（品牌限定）套组',
    subCategory: '景德镇赏瓷',
    chapter: 'porcelain',
    caption: '器身收腰，口沿微敞，带着古杯含蓄的起承；一笔金线落在素白之间，为今日茶席添一分郑重。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/porcelain-01.jpg`,
    matchedProductId: 'ware-03',
  },
  {
    index: '02',
    name: '赏瓷白杯（双描金）套组',
    subCategory: '景德镇赏瓷',
    chapter: 'porcelain',
    caption: '青白釉色如雨后初晴，双描金为传统杯式添上两道清晰边界；静处有古意，入席不显旧。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/porcelain-02.jpg`,
    matchedProductId: 'ware-01',
  },
  {
    index: '03',
    name: '赏瓷白杯套组',
    subCategory: '景德镇赏瓷',
    chapter: 'porcelain',
    caption: '素净不等于寡淡。杯身舒展、托沿开阔，承接古人尚素之心，也适合当代茶席的轻与简。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/porcelain-03.jpg`,
    matchedProductId: 'ware-05',
  },
  {
    index: '04',
    name: '赏瓷金口玉言公道杯',
    subCategory: '景德镇赏瓷',
    chapter: 'porcelain',
    caption: '圆腹蓄势，短流利落，借古器丰润的轮廓安住一席茶汤；金口轻轻收边，把分茶写得从容。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/porcelain-04.jpg`,
    matchedProductId: 'ware-02',
  },
  {
    index: '05',
    name: '赏瓷九秋杯',
    subCategory: '景德镇赏瓷',
    chapter: 'porcelain',
    caption: '花影绕杯，如秋圃入画，延续文人赏物的意趣；落到今天，是一杯茶间可触、可用的四时风景。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/porcelain-05.jpg`,
    matchedProductId: 'ware-04',
  },
];

/**
 * Chapter 03: 手作茗壶 01 — 07 (潮州手拉 · 宜兴手拍)
 */
export const OFFICIAL_TEAPOT_ARCHIVE: OfficialArchiveItem[] = [
  {
    index: '01',
    name: '吴瑞全 · 孟臣梨壶',
    subCategory: '潮州手拉壶',
    chapter: 'teapot',
    artisan: '吴瑞全',
    caption: '梨形丰润，朱红温厚，壶嘴与壶把在圆势中彼此照应。古人爱它的含蓄与亲手，放到今日，依然是一把不张扬、却耐看的日用之器。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/teapot/001-wu-ruiquan-mengchen-li-wide.jpg`,
    matchedProductId: 'pot-01',
  },
  {
    index: '02',
    name: '吴瑞全 · 乾隆盖壶',
    subCategory: '潮州手拉壶',
    chapter: 'teapot',
    artisan: '吴瑞全',
    caption: '高盖提神，圆腹稳重，栗红色泽让器形多一分端凝。旧式壶的仪度被收进利落比例里，既有堂上观器的庄重，也能安然进入当代茶席。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/teapot/002-wu-ruiquan-qianlong-gai-wide.jpg`,
    matchedProductId: 'pot-03',
  },
  {
    index: '03',
    name: '吴瑞全 · 大彬虚扁',
    subCategory: '潮州手拉壶',
    chapter: 'teapot',
    artisan: '吴瑞全',
    caption: '身筒低伏而横向舒展，朱色在宽阔轮廓上更显明快。扁器讲究收与放，这把壶把古典的沉着转成今日桌面上清晰、克制的线条。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/teapot/003-wu-ruiquan-dabin-xubian-wide.jpg`,
    matchedProductId: 'pot-02',
  },
  {
    index: '04',
    name: '谢华 · 思婷',
    subCategory: '潮州手拉壶',
    chapter: 'teapot',
    artisan: '谢华',
    caption: '深栗色沉静，腰身起伏柔和，高钮与长把拉出秀雅身姿。它不复刻旧器的肃穆，而是把传统曲线化成更轻盈、更贴近当代生活的表达。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/teapot/004-xie-hua-siting-wide.jpg`,
    matchedProductId: 'pot-04',
  },
  {
    index: '05',
    name: '吴瑞全 · 小壶大器',
    subCategory: '潮州手拉壶',
    chapter: 'teapot',
    artisan: '吴瑞全',
    caption: '圆腹饱满，短流爽利，朱红之中自有暖意。器不以尺寸争气势，而以比例见分寸；古人所谓小中见大，在今日仍落在一注一斟的从容里。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/teapot/005-wu-ruiquan-xiaohu-daqi-wide.jpg`,
    matchedProductId: 'pot-06',
  },
  {
    index: '06',
    name: '许广发 · 八角乾坤壶',
    subCategory: '宜兴手拍壶',
    chapter: 'teapot',
    artisan: '许广发',
    caption: '八角成面，深褐如木，方折的身筒与圆转的把手相互平衡。方圆相济的旧意，在这里化为鲜明几何感，古法精神也因此有了当代轮廓。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/teapot/006-xu-guangfa-bajiao-qiankun-wide.jpg`,
    matchedProductId: 'pot-05',
  },
  {
    index: '07',
    name: '吴瑞全 · 水平',
    subCategory: '潮州手拉壶',
    chapter: 'teapot',
    artisan: '吴瑞全',
    caption: '壶身圆正，流、把舒展，朱红色泽把均衡感衬得更温润。水平之美不在奇巧，而在处处安稳；从旧日功夫茶席到今天，都是一把顺手耐用的尺度。',
    image: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/teapot/007-wu-ruiquan-shuiping-wide.jpg`,
    matchedProductId: 'pot-07',
  },
];

export interface OfficialBrandUpdate {
  id: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
  targetShopCategory: 'tea' | 'teaware' | 'teapot' | 'yao';
}

export const OFFICIAL_BRAND_UPDATES: OfficialBrandUpdate[] = [
  {
    id: 'shanchang-yuanye',
    category: '山场原叶',
    date: '2026-09-14',
    title: '凤凰单丛与武夷岩茶的来源与风味',
    summary:
      '山场原叶是春城嘉叶“叶、瓷、壶”三章中的第一章，涵盖凤凰单丛与武夷岩茶。这一章从茶名读意，从品种与山场识其来路，最后把判断交还给当下这一泡。',
    sections: [
      {
        heading: '山场原叶包含哪些茶？',
        body: '涵盖凤凰单丛与武夷岩茶，是春城嘉叶“叶、瓷、壶”三章中的第一章。这一章记录茶的来源，以及来源与风味之间的关系。',
      },
      {
        heading: '凤凰单丛与武夷岩茶',
        body: '品牌叙事从凤凰单丛与潮州手拉壶的日常出发，并在凤凰单丛之外延伸至武夷岩茶，与凤凰单丛并列构成这一章的茶类范围。',
      },
      {
        heading: '判断方式',
        body: '从茶名读意，从品种与山场识其来路，最后把判断交还给当下这一泡。名称提供入口，不替代对具体一泡茶的判断。',
      },
    ],
    targetShopCategory: 'tea',
  },
  {
    id: 'shangci-yaqi',
    category: '赏瓷雅器',
    date: '2026-09-14',
    title: '器形、釉色与席间分寸',
    summary:
      '赏瓷雅器关注器形、釉色与席间使用，是“叶、瓷、壶”三章中的第二章。不只看釉色，也看器形、留白与纹样如何进入今天的茶席。',
    sections: [
      {
        heading: '赏瓷雅器关注什么？',
        body: '关注器形、釉色与席间使用。不只看釉色，也看器形、留白与纹样如何进入今天的茶席，最终仍要回到手中，承住一杯茶的温度。',
      },
      {
        heading: '涵盖范围与茶席关系',
        body: '品牌叙事在茶之外延伸至景德镇瓷器，与凤凰单丛、武夷岩茶、潮州手拉、宜兴手拍并列，构成“叶、瓷、壶”三章里的“瓷”。器物的判断与茶席上的使用连在一起。',
      },
    ],
    targetShopCategory: 'teaware',
  },
  {
    id: 'shouzuo-minghu',
    category: '手作茗壶',
    date: '2026-09-14',
    title: '潮州手拉与宜兴手拍的器作与使用',
    summary:
      '手作茗壶作为潮州手拉与宜兴手拍的上位品类，是“叶、瓷、壶”三章中的第三章。从潮州手拉到宜兴手拍，在圆与方、收与放之间理解一把壶的使用分寸。',
    sections: [
      {
        heading: '手作茗壶包含哪些工艺？',
        body: '涵盖潮州手拉（吴瑞全、谢华等名家作品）与宜兴手拍（许广发八角乾坤壶等）。圆与方、收与放、朱红与栗褐，共同回到器形、手感与茶席中的分寸。',
      },
      {
        heading: '器形与使用',
        body: '古意不只供人远观。真正的好壶，会在每天的开盖、注水与收水之间，把时间慢慢养成手感。来源、风味、器形与使用彼此印证。',
      },
    ],
    targetShopCategory: 'teapot',
  },
  {
    id: 'yao-chajian',
    category: '爻 YÁO',
    date: '2026-09-14',
    title: '茶简的产品开发记录与量产信息边界',
    summary:
      '爻 YÁO 是春城嘉叶旗下重要产品线。爻·茶简把独立保护、便携和入杯使用收进一支简洁形态；对来源、加工与本批品鉴的判断，并不因此被省略。',
    sections: [
      {
        heading: '产品名与穿孔金属茶棒结构',
        body: '消费者产品名统一使用“爻·茶简 / YÁO SINGLE INFUSION”。采用独立保护与穿孔金属茶棒结构，直接入杯，减少器具负担，但保留对茶汤的观察。',
      },
      {
        heading: '凡入爻，皆有据 · 信息边界',
        body: '品牌母句指向筛选、记录与复查，不暗示第三方认证，也不替代量产测试。页面所示为产品开发概念样张，实际材料、尺寸与批次以正式批准文件为准。',
      },
    ],
    targetShopCategory: 'yao',
  },
];

export const OFFICIAL_ENTERPRISE_INFO = {
  brandName: '春城嘉叶',
  enName: 'CHUN CHENG JIA YE',
  legalName: '春城嘉叶（深圳）茶业有限公司',
  slogan: '一叶有来处，一器有分寸。',
  subSlogan: '从山场原叶与手作茗壶出发。认真对待每一泡茶，也认真选择与茶相宜的器。',
  yaoSlogan: '方便一点，标准不轻。凡入爻，皆有据。',
  address: '深圳市南山区桃源街道平山社区留仙大道4088号博林天瑞花园3号楼40B',
  telephone: '13825293242',
  website: 'https://www.chunchengjiaye.com',
  icpFiling: '粤ICP备2026111187号-1',
  publicSecurityFiling: '粤公网安备44030002015862号',
  logoInkUrl: `${OFFICIAL_SITE_ORIGIN}/images/brand/ccjy-lockup-ink.png`,
  logoReverseUrl: `${OFFICIAL_SITE_ORIGIN}/images/brand/ccjy-lockup-reverse.png`,
  wechatMiniProgramQrUrl: `${OFFICIAL_SITE_ORIGIN}/images/contact/wechat-mini-program.jpg`,
  heroDesktopUrl: `${OFFICIAL_SITE_ORIGIN}/images/hero/01.jpg`,
  messageBannerUrl: `${OFFICIAL_SITE_ORIGIN}/images/message/message.jpg`,
  craftsmanshipOverviewUrl: `${OFFICIAL_SITE_ORIGIN}/images/craftsmanship/tea-ware-overview.jpg`,
  douyinUrl:
    'https://www.douyin.com/user/MS4wLjABAAAAwFDyJyshSdI246Eg3xFfNJb-iwnCD99y-XhuXfOh7QWseJUIM-9S1Vkp-znhqdZx?from_tab_name=main',
  goofishUrl:
    'https://www.goofish.com/personal?spm=a21ybx.item.itemHeader.1.1a613da6vDPh4u&userId=60009661',
};
