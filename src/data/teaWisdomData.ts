export interface BrewingStep {
  step: number;
  name: string;
  action: string;
  detail: string;
  proTip: string;
}

export interface TeaWisdomItem {
  id: string;
  title: string;
  subtitle: string;
  category: '单丛工夫' | '武夷岩韵' | '朱泥养器' | '老茶慢煮' | '当代茶简';
  categoryEn: string;
  brief: string;
  badge: string;
  temperature: string;
  waterLeafRatio: string;
  recommendedVessel: string;
  steepTimes: number[]; // In seconds for steeps 1..N
  mindquote: string;
  mindquoteAuthor: string;
  coverImage?: string;
  steps: BrewingStep[];
  culturalNotes: string[];
}

export const TEA_WISDOM_ITEMS: TeaWisdomItem[] = [
  {
    id: 'dancong-gongfu',
    title: '潮州工夫茶 · 滚水急出',
    subtitle: '凤凰单丛 · 诸心与水栀子之香',
    category: '单丛工夫',
    categoryEn: 'FENghUANG DANCONG',
    brief: '高冲低斟，滚水急入，急出不闷。唤醒山场原叶的蜜香、丛味与清甘。',
    badge: '工夫正统',
    temperature: '100℃ 纯净山泉滚沸',
    waterLeafRatio: '1 : 18 ~ 1 : 20 (7-8g : 130ml)',
    recommendedVessel: '吴瑞全手拉朱泥「孟臣小品」或景德镇赏瓷白杯',
    steepTimes: [5, 5, 8, 12, 15, 20, 30],
    mindquote: '一叶有来处，一器有分寸。单丛尤喜高沸，稍闷则涩，急出则醇。',
    mindquoteAuthor: '春城嘉叶 · 茶事手记',
    coverImage: '/assets/aistudio/IMG_6486_3fb9fe71.JPG',
    culturalNotes: [
      '潮州工夫茶讲究「二十四宜」，其中以孟臣罐、若深杯、玉书煨、红泥炉为四宝。',
      '冲泡凤凰单丛切忌盖碗久闷，沸水悬壶高冲，沿壶边顺势环绕，瞬间激发花香。',
      '关公巡城保证每一杯茶汤浓度纯和，韩信点兵则将壶底最精萃的茶膏滴落杯中。',
    ],
    steps: [
      {
        step: 1,
        name: '孟臣温烫',
        action: '滚水荡壶温杯',
        detail: '将100℃沸水注入朱泥小壶与若深杯中，快速淋浇器表，使壶身通体受热温热。',
        proTip: '壶热则茶香易发，温杯亦能使第一口茶汤入口不寒。',
      },
      {
        step: 2,
        name: '纳茶摇香',
        action: '置入条索单丛',
        detail: '投入约7至8克凤凰单丛（如诸心或水栀子），合上壶盖轻轻上下摇荡三回。',
        proTip: '揭盖倾鼻轻嗅干茶香气，此时花香、蜜香与山场清韵最为清晰。',
      },
      {
        step: 3,
        name: '悬壶高冲',
        action: '沸水环注入壶',
        detail: '水壶提至尺高，使滚沸的山泉水借重力冲击茶叶翻滚，迅速刮去壶口微浮之白沫。',
        proTip: '冲水务必一气呵成满至壶口，利用水流自然翻卷茶叶。',
      },
      {
        step: 4,
        name: '关公巡城',
        action: '低斟巡回出汤',
        detail: '出汤不可直冲一杯，壶嘴放低贴近杯面，依次均匀巡回倾注于三个若深杯中。',
        proTip: '初泡出汤控制在5秒以内，做到急冲急出，茶汤清澈金黄。',
      },
      {
        step: 5,
        name: '韩信点兵',
        action: '点尽末滴精华',
        detail: '最后茶汤分尽时，将壶中最后几滴浓厚茶液依序点入各杯，至滴水不漏。',
        proTip: '每一滴都是茶韵集聚之精华，三杯滋味方得均停。',
      },
    ],
  },
  {
    id: 'wuyi-rock-tea',
    title: '武夷岩茶 · 悬壶激香',
    subtitle: '老枞水仙与肉桂 · 岩骨花香',
    category: '武夷岩韵',
    categoryEn: 'WUYI ROCK TEA',
    brief: '开汤如刀劈斧削，沉芳兰芷，活甘清香。炭焙之火与岩石灵气融于杯盏。',
    badge: '岩骨花香',
    temperature: '100℃ 刚沸大滚水',
    waterLeafRatio: '1 : 15 ~ 1 : 18 (8g : 120-140ml)',
    recommendedVessel: '吴瑞全大彬虚扁紫砂壶 或 金口玉言公道杯',
    steepTimes: [5, 8, 12, 18, 25, 35, 50],
    mindquote: '武夷岩茶不惧重沸，非大滚之水无以逼出炭焙真味与百年枞韵。',
    mindquoteAuthor: '春城嘉叶 · 丛味录',
    coverImage: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
    culturalNotes: [
      '武夷岩茶之美在乎「岩韵」——不仅是焙火的沉香，更是三坑两涧的岩砂底蕴。',
      '老枞水仙以木质味、青苔味、棕叶味为三大标志，坐杯节奏随泡数稳步延展。',
      '春城嘉叶严选三坑两涧名坑原料，以「黛」、「馡」、「水龙吟」呈现不同焙火层次。',
    ],
    steps: [
      {
        step: 1,
        name: '厚胎温器',
        action: '紫砂大火温淋',
        detail: '岩茶喜厚胎器皿，先以沸水通体淋透大彬虚扁壶，保持壶腔内深层恒温。',
        proTip: '紫砂双气孔结构能吸附杂味、柔化火气。',
      },
      {
        step: 2,
        name: '干茶鉴赏',
        action: '识乌褐紧结条索',
        detail: '置茶入茶荷，观其叶色乌褐带霜、砂绿隐现，闻火香内蕴之焦糖与坚果香。',
        proTip: '好的岩茶干茶闻之不呛，炭火香与花香层叠交融。',
      },
      {
        step: 3,
        name: '定点激荡',
        action: '定点粗流注入',
        detail: '水沸如鱼眼，持水壶定点高冲入壶心，让水流深切叶底，瞬间翻涌。',
        proTip: '1-3泡不需坐杯，注水完毕即刻倾壶出汤，出汤干净利落。',
      },
      {
        step: 4,
        name: '公道观色',
        action: '金口玉言匀汤',
        detail: '茶汤出入公道杯，观其橙红明澈、金圈闪烁，挂杯香持久不退。',
        proTip: '自第4泡起，每泡递增5-10秒坐杯时间，静待木质青苔香渗出。',
      },
    ],
  },
  {
    id: 'zhuni-pot-care',
    title: '手作茗壶 · 一壶事一茶',
    subtitle: '潮州手拉朱泥 · 吴瑞全与思婷形制',
    category: '朱泥养器',
    categoryEn: 'ZHUNI POT CARE',
    brief: '赵庄朱泥与潮州手拉技艺，微米气孔呼吸吐纳。以茶润壶，日久则生如玉温光。',
    badge: '器物分寸',
    temperature: '常温浸润至沸水开壶',
    waterLeafRatio: '专器专用 · 专一事茶',
    recommendedVessel: '吴瑞全 孟臣梨壶 / 谢华 思婷壶',
    steepTimes: [0], // Care guide
    mindquote: '一器有分寸，器物既值得欣赏，更需在真实的冲泡出汤与持握中长久相伴。',
    mindquoteAuthor: '春城嘉叶 · 器物理念',
    coverImage: '/assets/aistudio/IMG_6488_a1ec8e50.JPG',
    culturalNotes: [
      '潮州手拉壶以高岭朱泥手拉成型，泥料极细，收缩率大，对匠人手感要求极严。',
      '朱泥壶因结晶度高、致密且透气，最宜冲泡高香型凤凰单丛与清香乌龙。',
      '养壶重在自然洁净，不可用洗涤剂，每次茶毕以清水冲净、纯棉茶巾轻拭。',
    ],
    steps: [
      {
        step: 1,
        name: '净水开壶',
        action: '清水煮透去土气',
        detail: '新壶以纯净水煮沸文火慢煨约30分钟，自然冷却，使微细气孔舒张洁净。',
        proTip: '开壶切忌添加豆腐或甘蔗等民间杂法，纯净清水慢煨最为天然。',
      },
      {
        step: 2,
        name: '专一事茶',
        action: '固定茶类滋养',
        detail: '一把朱泥壶专泡一种茶类（如专泡单丛），使壶体内壁吸附纯净茶气。',
        proTip: '若杂泡岩茶与普洱，茶香交杂反而失却纯粹。',
      },
      {
        step: 3,
        name: '淋沸润表',
        action: '茶毕沸水复淋',
        detail: '泡茶过程中以沸水淋拭壶表，茶汤溢出时以养壶笔或软布均匀拂拭。',
        proTip: '避免茶垢长期积结成黑斑，保持温润如玉的天然水光。',
      },
      {
        step: 4,
        name: '倾尽阴干',
        action: '开盖风干收纳',
        detail: '品茗完毕掏净茶渣，沸水冲刷壶内，掀开壶盖置于通风干爽处自然阴干。',
        proTip: '潮湿环境易生闷味，保持干爽是朱泥壶日久生玉质包浆的关键。',
      },
    ],
  },
  {
    id: 'aged-tea-boiling',
    title: '高山荒野老白茶 · 慢煮出泉',
    subtitle: '十年陈韵 · 枣香药香与高山蜜意',
    category: '老茶慢煮',
    categoryEn: 'AGED TEA BOILING',
    brief: '先泡后煮，茶水交融。炭火红泥慢煮，将山野阳光与岁月沉淀转化为稠滑甜浆。',
    badge: '时光陈酿',
    temperature: '95℃冲泡转100℃文火慢煮',
    waterLeafRatio: '1 : 35 ~ 1 : 50 (5g : 200-300ml 煮水)',
    recommendedVessel: '纯银急须 或 景德镇耐热玻璃炭火提梁壶',
    steepTimes: [10, 15, 20, 120, 180, 240],
    mindquote: '荒野老茶如陈年故友，经得起沸水淬炼，亦耐得住文火长候。',
    mindquoteAuthor: '春城嘉叶 · 白茶论',
    coverImage: '/assets/aistudio/IMG_6490_7c61932b.JPG',
    culturalNotes: [
      '福鼎荒野老白茶历经岁月自然陈化，茶多酚转化为茶黄素与茶红素，性转温润。',
      '前几道以沸水冲泡品其毫香花韵，后几道入壶文火慢煮，激发深层枣香药香。',
      '煮茶宜用高山软水或天然弱碱矿泉水，汤感更加绵密丝滑。',
    ],
    steps: [
      {
        step: 1,
        name: '前段冲泡',
        action: '盖碗冲泡前三道',
        detail: '先用盖碗正常冲泡3至4道，充分品味老白茶的鲜甜与花果冷香。',
        proTip: '直接生煮容易茶汤涩口，先泡展叶后煮风味更清甜。',
      },
      {
        step: 2,
        name: '投叶入壶',
        action: '叶底移入煮茶器',
        detail: '将已舒展的叶底滤入煮茶壶中，注入约400ml温度在85℃左右的温泉水。',
        proTip: '避免直接注入冷水，温水能平缓升温，防止茶单宁剧烈析出。',
      },
      {
        step: 3,
        name: '文火咕嘟',
        action: '大火烧开转微沸',
        detail: '大火煮沸后迅速调至文火，保持茶汤微沸状态慢煨约3至5分钟。',
        proTip: '听壶内水声如松涛细浪，茶汤渐呈琥珀红亮。',
      },
      {
        step: 4,
        name: '留根续水',
        action: '留取三分之一母汤',
        detail: '出汤时倒出约三分之二茶汤，留三分之一原汤在壶中，续入开水继续慢煮。',
        proTip: '留根法能保证前后各巡茶汤浓度始终如一，温润甜润不减。',
      },
    ],
  },
  {
    id: 'yao-portable-tea',
    title: '爻 YÁO · 案头当代净心',
    subtitle: '爻·茶简 SINGLE INFUSION · 凡入爻皆有据',
    category: '当代茶简',
    categoryEn: 'CONTEMPORARY INFUSION',
    brief: '方便一点，标准不轻。穿孔金属概念茶棒，随身单支独立，案头出行即刻成席。',
    badge: '现代探索',
    temperature: '90℃ - 95℃ 办公热水或直饮温水',
    waterLeafRatio: '单简 3.5g : 250-350ml 个人马克杯',
    recommendedVessel: '品牌限定白杯套组 或 双层高硼硅玻璃杯',
    steepTimes: [45, 60, 90, 120],
    mindquote: '凡入爻，皆有据。让传统茶事经验与当代生活方式无界相连。',
    mindquoteAuthor: '春城嘉叶 · 爻 YÁO 探索',
    coverImage: '/assets/aistudio/IMG_6491_1582fce7.JPG',
    culturalNotes: [
      '「爻 YÁO」面向案头、夜读、差旅及赠礼场景，探索便携饮茶的新形态。',
      '突破传统茶包的纸浆碎末缺陷，采用完整高山原叶置于精密微孔结构中。',
      '随时搅拌控浓，提取出汤随心自如，让一杯好茶进入持续发生的当代日常。',
    ],
    steps: [
      {
        step: 1,
        name: '启封纳简',
        action: '取单支独立茶简',
        detail: '撕开密封铝箔护套，取出爻·茶简，轻置于案头品茗白杯或随行杯中。',
        proTip: '单支独立充氮包装，锁住新鲜花香与山场清冽。',
      },
      {
        step: 2,
        name: '温水注杯',
        action: '90-95℃注入杯中',
        detail: '注入约280ml纯净热水，水流沿茶简金属管壁自然渗入内部茶仓。',
        proTip: '稍待10秒，微孔结构即有原叶香气与金黄茶汤缓缓弥散。',
      },
      {
        step: 3,
        name: '轻转调浓度',
        action: '手持茶简顺向搅动',
        detail: '根据个人浓淡喜好，轻轻转动茶简2-3圈，观察茶汤汤色深浅。',
        proTip: '静置约45秒即可享用首杯甘泉，随时取出沥干，浓淡由心掌控。',
      },
    ],
  },
];
