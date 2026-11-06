import { ConsignmentItem } from '../data/mockData';

export type LifecycleStageKey =
  | 'intake_appraisal' // 鉴真确权
  | 'warehouse_custody' // 母仓存护
  | 'exhibition_interest' // 巡展关注
  | 'negotiation_settlement'; // 结缘流转 / 圆满交割

export interface ConsignmentLifecycleEvent {
  id: string;
  stage: LifecycleStageKey;
  stageName: string;
  stageShortName: string;
  date: string;
  title: string;
  handler: string;
  sealLabel: string;
  location?: string;
  detail: string;
  status: 'completed' | 'current' | 'upcoming';
  metric?: {
    label: string;
    value: string;
  };
}

export interface ConsignmentLifecycleSummary {
  currentStageName: string;
  currentStageKey: LifecycleStageKey;
  completedNodesCount: number;
  totalNodesCount: number;
  daysInCustody: number;
  interestHeatLevel: '极高' | '活跃' | '稳健';
  isSettled: boolean;
}

/**
 * Detailed provenance records for pre-seeded items
 */
const PRESET_LIFECYCLES: Record<string, ConsignmentLifecycleEvent[]> = {
  'csg-001': [
    {
      id: 'csg-001-evt-1',
      stage: 'intake_appraisal',
      stageName: '鉴真确权',
      stageShortName: '实物初验',
      date: '2023.10.12',
      title: '一器一档鉴真出具 · 纯干仓定级',
      handler: '春城嘉叶名物鉴藏委员会 · 首席品鉴师',
      sealLabel: '嘉叶鉴真',
      location: '春城嘉叶深圳鉴藏室',
      detail:
        '经无损探伤、笋壳外封检查与取样开汤品评，茶样条索乌润紧结，开汤梅子香转沉厚老木香，定级为9.8品纯干仓标杆茶，配发区块链存证证书。',
      status: 'completed',
      metric: { label: '品相定级', value: '9.8品 纯干仓' },
    },
    {
      id: 'csg-001-evt-2',
      stage: 'warehouse_custody',
      stageName: '母仓存护',
      stageShortName: '恒温封存',
      date: '2023.10.15',
      title: '入存恒温恒湿专业母仓 (A-12席位)',
      handler: '春城嘉叶母仓干仓管护组',
      sealLabel: '母仓入籍',
      location: '春城嘉叶恒温恒湿专业母仓 (深圳南山A-12)',
      detail:
        '原封笋壳置入定制原木避光陈化箱，全天候物联网温湿度传感器监控（恒温22℃±1℃，相对湿度65%±3%），定期进行温湿度巡检与微通风。',
      status: 'completed',
      metric: { label: '母仓温湿', value: '22℃ / 65%RH' },
    },
    {
      id: 'csg-001-evt-3',
      stage: 'exhibition_interest',
      stageName: '巡展品鉴',
      stageShortName: '席主关注',
      date: '2024.01.20',
      title: '登席春城嘉叶会员专席 · 巡展鉴赏',
      handler: '春城嘉叶藏家服务中心',
      sealLabel: '巡展存证',
      location: '春城嘉叶典藏流转专席',
      detail:
        '上线二级流转专席鉴赏，累计获 1,842 次席主查验，先后有 6 位雅集与尊享会员申请开汤见证与意向认藏。',
      status: 'completed',
      metric: { label: '席主热度', value: '1,842次查验 / 6次意向' },
    },
    {
      id: 'csg-001-evt-4',
      stage: 'negotiation_settlement',
      stageName: '结缘流转',
      stageShortName: '专席结缘',
      date: '2024.03.18',
      title: '开放尊享席位意向认藏 · 现正流转中',
      handler: '春城嘉叶流转交割专席',
      sealLabel: '流转待结',
      location: '春城嘉叶官方流转平台',
      detail:
        '当前席位开放全等级会员认藏，支持使用嘉叶币储值抵扣或茶器置换以旧换新；认藏成功后可随时选择母仓托管或顺丰特安防震交割。',
      status: 'current',
      metric: { label: '结席席价', value: '¥48,000' },
    },
  ],
  'csg-002': [
    {
      id: 'csg-002-evt-1',
      stage: 'intake_appraisal',
      stageName: '鉴真确权',
      stageShortName: '古器初验',
      date: '2023.08.18',
      title: '潮州古陶瓷鉴藏研究所实测鉴真',
      handler: '潮州古陶瓷鉴藏研究所专家组',
      sealLabel: '古陶瓷验',
      location: '潮州古陶瓷鉴藏研究所',
      detail:
        '实测胎质含天然梨皮粗砂颗粒，底款「荆溪惠孟臣制」，包浆莹润老气十足，全品无冲无磕，确认为清末潮汕世家藏器真品。',
      status: 'completed',
      metric: { label: '泥料胎骨', value: '老梨皮朱泥' },
    },
    {
      id: 'csg-002-evt-2',
      stage: 'warehouse_custody',
      stageName: '母仓存护',
      stageShortName: '文人润养',
      date: '2023.08.22',
      title: '春城嘉叶茶器专柜定制软囊封存',
      handler: '春城嘉叶器物管护专员',
      sealLabel: '嘉叶器籍',
      location: '春城嘉叶茶器与寄售专柜',
      detail:
        '配发定制锦缎软囊与特制梧桐木盒，由驻地高级茶艺师以武夷正岩大红袍文火温润洗润，器表光泽温润内敛。',
      status: 'completed',
      metric: { label: '包浆评级', value: '温润老包浆' },
    },
    {
      id: 'csg-002-evt-3',
      stage: 'exhibition_interest',
      stageName: '巡展品鉴',
      stageShortName: '席主热鉴',
      date: '2023.11.05',
      title: '春季名家古器雅集巡展 · 11次意向商洽',
      handler: '春城嘉叶掌席服务组',
      sealLabel: '雅席巡展',
      location: '春城嘉叶私享品鉴室',
      detail:
        '累计 2,310 位茶友登席鉴赏，收到 11 次认藏意向，出水流畅七寸不散，备受壶友与紫砂藏家青睐。',
      status: 'completed',
      metric: { label: '鉴赏热度', value: '2,310次查验 / 11次意向' },
    },
    {
      id: 'csg-002-evt-4',
      stage: 'negotiation_settlement',
      stageName: '结缘流转',
      stageShortName: '专席结缘',
      date: '2024.02.10',
      title: '当前流转活跃 · 支持茶器置换以旧换新',
      handler: '春城嘉叶流转交割专席',
      sealLabel: '流转待结',
      location: '春城嘉叶官方流转平台',
      detail:
        '当前处于最优结缘窗口期，会员可直接认藏，或申请名下闲置茶器经评估 100% 嘉叶币置换折抵。',
      status: 'current',
      metric: { label: '流转席价', value: '¥22,000' },
    },
  ],
  'csg-003': [
    {
      id: 'csg-003-evt-1',
      stage: 'intake_appraisal',
      stageName: '鉴真确权',
      stageShortName: '老砖审评',
      date: '2024.01.08',
      title: '春城嘉叶老茶品鉴中心审评立档',
      handler: '春城嘉叶老茶品鉴专家组',
      sealLabel: '嘉叶鉴真',
      location: '春城嘉叶老茶品鉴室',
      detail:
        '经20年自然陈化，砖身硬朗，金毫内敛；取样审评汤色红浓透亮，入口即化，樟木香与熟药香沉着，确认为2003年经典昆明茶厂老配方。',
      status: 'completed',
      metric: { label: '陈化期', value: '21年自然陈化' },
    },
    {
      id: 'csg-003-evt-2',
      stage: 'warehouse_custody',
      stageName: '母仓存护',
      stageShortName: '干仓陈化',
      date: '2024.01.11',
      title: '进驻春城嘉叶干仓 B-04 避光陈化架',
      handler: '春城嘉叶母仓管理团队',
      sealLabel: '干仓封存',
      location: '春城嘉叶干仓B-04',
      detail:
        '采用紫砂缸内胆加透气绵纸封存，恒温避光隔绝异味，实时温湿曲线符合昆明天然干仓陈化最优区间。',
      status: 'completed',
      metric: { label: '仓储环境', value: '纯干仓避光' },
    },
    {
      id: 'csg-003-evt-3',
      stage: 'exhibition_interest',
      stageName: '巡展品鉴',
      stageShortName: '席友关注',
      date: '2024.02.28',
      title: '上线名老茶专区 · 4次席位认藏商询',
      handler: '春城嘉叶藏品顾问',
      sealLabel: '名茶在席',
      location: '春城嘉叶典藏流转专席',
      detail:
        '累计 940 位茶客浏览查验，获得 4 位老茶客认藏意向，适合作为口粮老普洱或继续陈化增值。',
      status: 'completed',
      metric: { label: '关注热度', value: '940次查验 / 4次意向' },
    },
    {
      id: 'csg-003-evt-4',
      stage: 'negotiation_settlement',
      stageName: '结缘流转',
      stageShortName: '结席待认',
      date: '2024.03.01',
      title: '开放各级席位直接认藏',
      handler: '春城嘉叶流转交割专席',
      sealLabel: '流转待结',
      location: '春城嘉叶官方流转平台',
      detail:
        '支持使用嘉叶币全额或部分抵扣，成交后即刻出库，享受顺丰特安保价包邮。',
      status: 'current',
      metric: { label: '流转席价', value: '¥6,800' },
    },
  ],
  'csg-004': [
    {
      id: 'csg-004-evt-1',
      stage: 'intake_appraisal',
      stageName: '鉴真确权',
      stageShortName: '特展收官',
      date: '2023.09.02',
      title: '景德镇名家特展收官 · 一器一档归档',
      handler: '春城嘉叶器物鉴藏部',
      sealLabel: '孤品确权',
      location: '春城嘉叶景德镇工作室',
      detail:
        '当代名家手工拉胚与双层描金孤品，胎薄如纸，釉白如玉，纯金描饰温润饱满，归档登记证书编号 CCJY-POT-202209。',
      status: 'completed',
      metric: { label: '品相状态', value: '特展孤品 纯手工' },
    },
    {
      id: 'csg-004-evt-2',
      stage: 'warehouse_custody',
      stageName: '母仓存护',
      stageShortName: '专柜特展',
      date: '2023.09.15',
      title: '春城嘉叶沉香雅集特展席位陈列',
      handler: '春城嘉叶雅席典藏师',
      sealLabel: '雅席陈列',
      location: '春城嘉叶茶器与寄售专柜',
      detail:
        '在秋季沉香雅集特展中作为示范公道杯陈列，累计 3,120 位席主观摩鉴赏，器型断水干脆利落。',
      status: 'completed',
      metric: { label: '观摩人次', value: '3,120次' },
    },
    {
      id: 'csg-004-evt-3',
      stage: 'exhibition_interest',
      stageName: '巡展品鉴',
      stageShortName: '专席认藏',
      date: '2023.10.20',
      title: '雅集席主出价锁定席位 · 意向达成',
      handler: '春城嘉叶流转交割专席',
      sealLabel: '席位锁定',
      location: '春城嘉叶官方流转平台',
      detail:
        '由掌席会员静水流深出价 ¥4,200 全额认领，系统锁定该器物并启动交割核验流程。',
      status: 'completed',
      metric: { label: '成交出价', value: '¥4,200' },
    },
    {
      id: 'csg-004-evt-4',
      stage: 'negotiation_settlement',
      stageName: '圆满交割',
      stageShortName: '传世入籍',
      date: '2023.10.22',
      title: '顺丰特安交割完毕 · 谱系入籍新主档案',
      handler: '春城嘉叶交割审核处',
      sealLabel: '圆满交割',
      location: '已交付流转 (闲鱼/专席渠道)',
      detail:
        '器物经专用防震恒温箱顺丰特安交割至买家；原货款已以 100% 嘉叶币转入委托人账户，鉴藏证书所有权人正式更名归档。',
      status: 'completed',
      metric: { label: '最终状态', value: '已圆满结藏' },
    },
  ],
};

/**
 * Generate dynamic lifecycle events for newly submitted user consignments or fallback
 */
export function generateConsignmentLifecycle(item: ConsignmentItem): ConsignmentLifecycleEvent[] {
  if (PRESET_LIFECYCLES[item.id]) {
    return PRESET_LIFECYCLES[item.id];
  }

  const isSold = item.status === 'sold';
  const isTea = item.category === 'tea';
  const createdDate = '2024.03.15';
  const custodyDate = '2024.03.16';
  const exhibitDate = '2024.03.20';
  const currentDate = '2024.03.25';

  return [
    {
      id: `${item.id}-evt-1`,
      stage: 'intake_appraisal',
      stageName: '鉴真确权',
      stageShortName: '实物初验',
      date: createdDate,
      title: `${item.appraisalOrg || '春城嘉叶名物鉴藏组'} · 实物鉴真`,
      handler: `${item.appraisalOrg || '春城嘉叶鉴藏组'} · 审核专员`,
      sealLabel: '嘉叶验讫',
      location: item.warehouseLocation.includes('深圳') ? '深圳南山鉴藏室' : '春城嘉叶中心库',
      detail: `对「${item.name}」进行品相查验与源流核实。评级判定为【${item.condition}】，出具唯一鉴藏证书号 ${item.certificateNo}。`,
      status: 'completed',
      metric: { label: '鉴真定级', value: item.condition.slice(0, 8) || '合规上席' },
    },
    {
      id: `${item.id}-evt-2`,
      stage: 'warehouse_custody',
      stageName: '母仓存护',
      stageShortName: '入仓封存',
      date: custodyDate,
      title: `入存 ${item.warehouseLocation}`,
      handler: '春城嘉叶专业仓储管理处',
      sealLabel: '母仓入籍',
      location: item.warehouseLocation,
      detail: isTea
        ? '采用原封透气绵纸加紫砂干仓封存，全天候恒温恒湿监控，阻绝异味与强光陈化。'
        : '配发专业锦缎软囊与梧桐木盒，器身由专业茶艺师清洁润养封存。',
      status: 'completed',
      metric: { label: '存储仓位', value: item.warehouseLocation.slice(0, 10) },
    },
    {
      id: `${item.id}-evt-3`,
      stage: 'exhibition_interest',
      stageName: '巡展品鉴',
      stageShortName: '专席展示',
      date: exhibitDate,
      title: `上线会员专席鉴赏 · 累计 ${item.views} 次查验`,
      handler: '春城嘉叶藏友交流中心',
      sealLabel: '巡展在席',
      location: '春城嘉叶二级流转专席',
      detail: `上线二级流转专区展出，委托人【${item.sellerName} · ${item.sellerTier}】发起流转，累计获得 ${item.views} 位茶人查验，产生 ${item.bidsCount ?? 0} 次认藏意向。`,
      status: 'completed',
      metric: { label: '关注意向', value: `${item.views}次 / ${item.bidsCount ?? 0}意向` },
    },
    {
      id: `${item.id}-evt-4`,
      stage: 'negotiation_settlement',
      stageName: isSold ? '圆满交割' : '结缘流转',
      stageShortName: isSold ? '传世入籍' : '专席结缘',
      date: currentDate,
      title: isSold
        ? '顺丰特安防震交割完成 · 名器入籍新主档案'
        : '当前处于活跃流转期 · 支持全额嘉叶币抵扣',
      handler: isSold ? '春城嘉叶交割审核处' : '春城嘉叶流转交割专席',
      sealLabel: isSold ? '圆满交割' : '流转待结',
      location: isSold ? '交割完毕 (流转档案已锁入区块链)' : '春城嘉叶二级流转专席',
      detail: isSold
        ? `该典藏名物已圆满成交，结算款项已全额转为嘉叶币打入委托人账户，鉴藏证书物权已更新。`
        : `当前席位开放全等级会员认藏结席，享原估价 ¥${item.originalEstimate.toLocaleString()} 之专席结缘价 ¥${item.currentPrice.toLocaleString()}。`,
      status: isSold ? 'completed' : 'current',
      metric: { label: isSold ? '交割状态' : '当前席价', value: isSold ? '已结藏' : `¥${item.currentPrice.toLocaleString()}` },
    },
  ];
}

/**
 * Returns summary stats for displaying badges on cards
 */
export function getConsignmentLifecycleSummary(item: ConsignmentItem): ConsignmentLifecycleSummary {
  const events = generateConsignmentLifecycle(item);
  const completedNodesCount = events.filter((e) => e.status === 'completed').length;
  const currentEvent = events.find((e) => e.status === 'current') || events[events.length - 1];
  const isSettled = item.status === 'sold';

  let interestHeatLevel: '极高' | '活跃' | '稳健' = '稳健';
  if ((item.bidsCount ?? 0) >= 8 || item.views > 2000) {
    interestHeatLevel = '极高';
  } else if ((item.bidsCount ?? 0) >= 3 || item.views > 800) {
    interestHeatLevel = '活跃';
  }

  // Calculate simulated days in custody based on ID or views
  const daysInCustody = 30 + Math.min(200, Math.floor(item.views / 15));

  return {
    currentStageName: currentEvent.stageName,
    currentStageKey: currentEvent.stage,
    completedNodesCount,
    totalNodesCount: events.length,
    daysInCustody,
    interestHeatLevel,
    isSettled,
  };
}

/**
 * Affinity Story / Lore (结缘故事 · 藏家雅趣)
 */
export interface AffinityStory {
  id: string;
  itemId: string;
  author: string;
  authorRole: string;
  date: string;
  content: string;
  tag: string;
  likesCount: number;
}

export const AFFINITY_STORY_TAGS = [
  '得器因缘',
  '三载伴席',
  '茶席拾趣',
  '寄语新主',
  '煮水试汤',
] as const;

export const PRESET_AFFINITY_STORIES: Record<string, AffinityStory[]> = {
  'csg-001': [
    {
      id: 'story-001-1',
      itemId: 'csg-001',
      author: '藏家·林墨客',
      authorRole: '隐山席主',
      date: '2023.11.08',
      tag: '得器因缘',
      content:
        '当年初得此提八八青时，正值深秋初寒。在港岛老茶行试汤，入口梅香微带药韵，遂整提入藏封存。如今开汤汤质凝稠如蜜，茶气沉雄，愿得此饼者于清夜慢烹，方不负二十余载岁月沉香。',
      likesCount: 28,
    },
    {
      id: 'story-001-2',
      itemId: 'csg-001',
      author: '南山隐客',
      authorRole: '典藏席主',
      date: '2024.01.25',
      tag: '茶席拾趣',
      content:
        '曾赴深圳母仓查验实物，笋壳保存极佳，仓味全无。取碎茶试瀹，回甘直落喉底，是不可多得的纯干仓标杆。',
      likesCount: 14,
    },
  ],
  'csg-002': [
    {
      id: 'story-002-1',
      itemId: 'csg-002',
      author: '古砚草堂主人',
      authorRole: '掌席茶人',
      date: '2023.09.20',
      tag: '三载伴席',
      content:
        '这把梨皮朱泥手拉壶随我三年，专事冲瀹武夷正岩肉桂。出水如注，收水爽利。器身包浆已日渐温润如玉，每抚摩其梨皮天然粗砂肌理，心境自安。今有缘转入嘉叶雅席，留待识者共赏。',
      likesCount: 36,
    },
    {
      id: 'story-002-2',
      itemId: 'csg-002',
      author: '苏溪漫士',
      authorRole: '雅集茶客',
      date: '2023.12.04',
      tag: '煮水试汤',
      content:
        '在巡展雅席上有幸亲睹，泥胎通透，孟臣款极具清末古雅风韵，断水干脆，实为掌中至宝。',
      likesCount: 19,
    },
  ],
  'csg-003': [
    {
      id: 'story-003-1',
      itemId: 'csg-003',
      author: '南山茶客',
      authorRole: '茶人席位',
      date: '2024.01.18',
      tag: '茶席拾趣',
      content:
        '初饮只觉厚实，待到第五泡樟香与老熟药香层层漫出，冬日围炉瀹饮，暖彻肺腑。好茶不可独享，故出仓分与同道。',
      likesCount: 15,
    },
  ],
  'csg-004': [
    {
      id: 'story-004-1',
      itemId: 'csg-004',
      author: '静水流深',
      authorRole: '掌席会员',
      date: '2023.10.22',
      tag: '寄语新主',
      content:
        '特展上一眼相中这抹双描金的清雅，胎骨极薄，透光如玉。承蒙割爱，现已入籍鄙人茶席，每日晨起试水出汤，甚是欢喜。',
      likesCount: 42,
    },
  ],
};

const STORAGE_PREFIX = 'ccjy_affinity_stories_';

/**
 * Get all affinity stories for a consignment item (presets + user added)
 */
export function getAffinityStories(itemId: string): AffinityStory[] {
  const presets = PRESET_AFFINITY_STORIES[itemId] || [];
  if (typeof window === 'undefined') return presets;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${itemId}`);
    if (raw) {
      const userStories: AffinityStory[] = JSON.parse(raw);
      return [...userStories, ...presets];
    }
  } catch {
    // fallback to presets
  }

  return presets;
}

/**
 * Add a new affinity story for an item and persist to localStorage
 */
export function addAffinityStory(
  itemId: string,
  newStory: {
    author: string;
    authorRole?: string;
    content: string;
    tag?: string;
  }
): AffinityStory {
  const story: AffinityStory = {
    id: `story-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    itemId,
    author: newStory.author.trim() || '知音席客',
    authorRole: newStory.authorRole || '知音会员',
    date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    content: newStory.content.trim(),
    tag: newStory.tag || '茶席拾趣',
    likesCount: 1,
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${itemId}`);
      const list: AffinityStory[] = raw ? JSON.parse(raw) : [];
      list.unshift(story);
      localStorage.setItem(`${STORAGE_PREFIX}${itemId}`, JSON.stringify(list));
    } catch {
      // storage unavailable
    }
  }

  return story;
}

