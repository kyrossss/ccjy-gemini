/**
 * Pure configuration and smart navigation logic for the unified "东方雅韵" (Oriental Elegance) Empty State system
 * (首页馆藏、首页山场模块、购物车、茶席预约列表、寄售中心、商城检索、订单履历统一水墨空状态兜底与智能跳转引导)
 */

export type OrientalEmptyStateVariant =
  | 'home'
  | 'terroir'
  | 'cart'
  | 'bookings'
  | 'consign'
  | 'shop'
  | 'orders';

export interface SmartJumpRecommendation {
  id: string;
  label: string;
  tag: string;
  targetTab: 'home' | 'shop' | 'room' | 'consign' | 'member';
  targetCategory?: 'all' | 'tea' | 'teapot' | 'teaware' | 'yao';
  searchKeyword?: string;
}

export interface EmptyStatePresetConfig {
  variant: OrientalEmptyStateVariant;
  themeTag: string;
  inkMotif: string;
  sealText: string;
  enKicker: string;
  title: string;
  poem: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  smartRecommendations: SmartJumpRecommendation[];
}

export const EMPTY_STATE_PRESETS: Record<OrientalEmptyStateVariant, EmptyStatePresetConfig> = {
  home: {
    variant: 'home',
    themeTag: '东方雅韵 · 虚室生白',
    inkMotif: '水墨设色 · 松月远山图',
    sealText: '静候',
    enKicker: 'ORIENTAL ELEGANCE · 馆藏静候',
    title: '此席佳器尚在焙火出窑中',
    poem: '松风吹解带，山月照弹琴',
    description:
      '当前馆藏分类暂未陈列对应孤品，匠人正于潮州枫溪与武夷正岩潜心监制，不妨先移步全系茶铺或流转专席寻味。',
    primaryActionLabel: '浏览茶铺全系器物',
    secondaryActionLabel: '前往寄售中心寻宝',
    smartRecommendations: [
      {
        id: 'rec-home-dancong',
        label: '凤凰单丛·诸心',
        tag: '山场原叶',
        targetTab: 'shop',
        targetCategory: 'tea',
        searchKeyword: '凤凰单丛',
      },
      {
        id: 'rec-home-teapot',
        label: '吴瑞全手拉朱泥壶',
        tag: '非遗名家',
        targetTab: 'shop',
        targetCategory: 'teapot',
        searchKeyword: '潮州',
      },
      {
        id: 'rec-home-yao',
        label: '爻 YÁO · 穿孔茶简',
        tag: '日常六境',
        targetTab: 'shop',
        targetCategory: 'yao',
        searchKeyword: '',
      },
    ],
  },
  terroir: {
    variant: 'terroir',
    themeTag: '东方雅韵 · 云深寻茗',
    inkMotif: '水墨设色 · 云岚灵芽图',
    sealText: '云深',
    enKicker: 'TERROIR IN MIST · 云深不知处',
    title: '云深岚雾锁千山 · 暂未收录此境风土',
    poem: '只在此山中，云深不知处',
    description:
      '当前山场风土带筛选下暂无匹配的产区感官图谱，寻茶人正深入秘境勘察水土，不妨重置筛选纵览五大名山风土光谱。',
    primaryActionLabel: '纵览五大名山风土',
    secondaryActionLabel: '前往茶铺寻味全系原叶',
    smartRecommendations: [
      {
        id: 'rec-terroir-wuyi',
        label: '武夷正岩·老枞水仙',
        tag: '岩骨花香',
        targetTab: 'shop',
        targetCategory: 'tea',
        searchKeyword: '武夷山',
      },
      {
        id: 'rec-terroir-wudong',
        label: '潮州乌岽·鸭屎香',
        tag: '天池山韵',
        targetTab: 'shop',
        targetCategory: 'tea',
        searchKeyword: '潮州',
      },
      {
        id: 'rec-terroir-xihu',
        label: '狮峰翁家山·明前龙井',
        tag: '嫩栗清甘',
        targetTab: 'shop',
        targetCategory: 'tea',
        searchKeyword: '西湖',
      },
    ],
  },
  cart: {
    variant: 'cart',
    themeTag: '东方雅韵 · 竹炉待沸',
    inkMotif: '水墨设色 · 孟臣烹茶图',
    sealText: '空囊',
    enKicker: 'EMPTY TEA POUCH · 茶囊尚虚',
    title: '茶囊尚空 · 静候佳茗入席',
    poem: '竹炉汤沸火初红，且待佳茗入囊中',
    description:
      '您的随行茶囊尚未收入心仪茶器与山场原叶。无论是大师手拉朱泥壶，抑或头春岩骨花香，皆可收入囊中慢品。',
    primaryActionLabel: '前往茶铺甄选器物与茶',
    secondaryActionLabel: '探访典藏寄售孤品',
    smartRecommendations: [
      {
        id: 'rec-cart-wuyi',
        label: '武夷正岩·坑涧肉桂',
        tag: '镇馆岩茶',
        targetTab: 'shop',
        targetCategory: 'tea',
        searchKeyword: '武夷',
      },
      {
        id: 'rec-cart-porcelain',
        label: '景德镇青花主人杯',
        tag: '赏瓷雅器',
        targetTab: 'shop',
        targetCategory: 'teaware',
        searchKeyword: '景德镇',
      },
      {
        id: 'rec-cart-consign',
        label: '藏家释出陈年老茶',
        tag: '保真寄售',
        targetTab: 'consign',
      },
    ],
  },
  bookings: {
    variant: 'bookings',
    themeTag: '东方雅韵 · 扫径迎客',
    inkMotif: '水墨设色 · 墨竹焚香图',
    sealText: '虚席',
    enKicker: 'SANCTUARY AWAITS · 虚席待客',
    title: '竹影扫阶 · 暂未预留私享茶席',
    poem: '扫来竹叶烹茶叶，劈碎松根煮菜根',
    description:
      '您当前尚无生效中的茶室预约日程。侍茶师已备妥山泉炭火与冷门孤枞，静候您择吉日良辰入席听风。',
    primaryActionLabel: '立即择吉预约私享茶席',
    secondaryActionLabel: '先赴山场风土选定试饮茶',
    smartRecommendations: [
      {
        id: 'rec-booking-songfeng',
        label: '松风 · 枯山水景观席',
        tag: '首推茶寮',
        targetTab: 'room',
      },
      {
        id: 'rec-booking-tingzhu',
        label: '听竹 · 幽篁炭火专席',
        tag: '围炉煮茶',
        targetTab: 'room',
      },
      {
        id: 'rec-booking-terroir',
        label: '按山场光谱选试饮茶',
        tag: 'D3寻味',
        targetTab: 'home',
      },
    ],
  },
  consign: {
    variant: 'consign',
    themeTag: '东方雅韵 · 博古待沽',
    inkMotif: '水墨设色 · 宣和博古图',
    sealText: '待藏',
    enKicker: 'PROVENANCE ARCHIVE · 虚库待藏',
    title: '该门类下暂无流转中藏品',
    poem: '器有分寸传百代，茶历岁月发幽香',
    description:
      '当前筛选门类暂未有藏家释出名物。您可发起自有老茶与名家手拉壶鉴定入库，或切换门类品鉴在库珍品。',
    primaryActionLabel: '提交我的藏品入库鉴藏',
    secondaryActionLabel: '查看全部流转中典藏',
    smartRecommendations: [
      {
        id: 'rec-consign-teapot',
        label: '鉴赏在库名家手拉壶',
        tag: '非遗孤品',
        targetTab: 'consign',
        targetCategory: 'teapot',
      },
      {
        id: 'rec-consign-vintage-tea',
        label: '品鉴干仓年份陈茶',
        tag: '岁月陈韵',
        targetTab: 'consign',
        targetCategory: 'tea',
      },
      {
        id: 'rec-consign-shop',
        label: '浏览官方42款新制器物',
        tag: '馆藏直供',
        targetTab: 'shop',
        targetCategory: 'all',
      },
    ],
  },
  shop: {
    variant: 'shop',
    themeTag: '东方雅韵 · 披沙拣金',
    inkMotif: '水墨设色 · 三才盖碗图',
    sealText: '寻味',
    enKicker: 'TERROIR SEARCH · 寻味无踪',
    title: '未寻得匹配的茶器或山场原叶',
    poem: '远上寒山石径斜，白云生处有人家',
    description:
      '不妨清空当前筛选词浏览全馆典藏，或前往首页「山场风土」通过 D3 感官光谱探索五大茶山代表茗茶。',
    primaryActionLabel: '重置筛选浏览全部馆藏',
    secondaryActionLabel: '前往山场风土图谱寻茶',
    smartRecommendations: [
      {
        id: 'rec-shop-dancong',
        label: '潮州凤凰单丛全系',
        tag: '30款原叶',
        targetTab: 'shop',
        targetCategory: 'tea',
        searchKeyword: '凤凰单丛',
      },
      {
        id: 'rec-shop-wuyi',
        label: '武夷正岩肉桂水仙',
        tag: '岩骨花香',
        targetTab: 'shop',
        targetCategory: 'tea',
        searchKeyword: '武夷',
      },
      {
        id: 'rec-shop-teapot',
        label: '潮州手拉与宜兴手拍壶',
        tag: '7款名家壶',
        targetTab: 'shop',
        targetCategory: 'teapot',
        searchKeyword: '',
      },
    ],
  },
  orders: {
    variant: 'orders',
    themeTag: '东方雅韵 · 素笺待墨',
    inkMotif: '水墨设色 · 晴窗分茶图',
    sealText: '素笺',
    enKicker: 'TEA ORDER ARCHIVE · 履历初开',
    title: '尚无已入囊的茶品与器物订单',
    poem: '晴窗细乳戏分茶，一纸素笺待墨华',
    description:
      '结缘任一山场茗茶或手作茶器后，均可在此查阅顺丰专呈单号、一物一码防伪溯源，并撰写茶评演化五维茶性雷达。',
    primaryActionLabel: '前往茶铺结缘首件雅物',
    secondaryActionLabel: '前往叶值中心兑换茶礼',
    smartRecommendations: [
      {
        id: 'rec-orders-tea',
        label: '结缘头春山场原叶',
        tag: '开启茶性雷达',
        targetTab: 'shop',
        targetCategory: 'tea',
        searchKeyword: '',
      },
      {
        id: 'rec-orders-yao',
        label: '体验爻 YÁO 便携茶简',
        tag: '入门甄选',
        targetTab: 'shop',
        targetCategory: 'yao',
        searchKeyword: '',
      },
    ],
  },
};

export function getEmptyStatePreset(
  variant: OrientalEmptyStateVariant,
  overrides?: Partial<EmptyStatePresetConfig>
): EmptyStatePresetConfig {
  const base = EMPTY_STATE_PRESETS[variant] || EMPTY_STATE_PRESETS.home;
  return {
    ...base,
    ...overrides,
    smartRecommendations: overrides?.smartRecommendations || base.smartRecommendations,
  };
}

/**
 * Resolves the target navigation payload when a user clicks a smart jump recommendation chip inside OrientalEmptyState
 */
export function resolveEmptyStateSmartNavigation(
  variant: OrientalEmptyStateVariant,
  recommendationId?: string
): SmartJumpRecommendation {
  const preset = getEmptyStatePreset(variant);
  if (recommendationId) {
    const found = preset.smartRecommendations.find((r) => r.id === recommendationId);
    if (found) return found;
  }
  return preset.smartRecommendations[0];
}
