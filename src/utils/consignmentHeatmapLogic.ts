import { ConsignmentItem } from '../data/mockData';
import {
  HISTORICAL_CONSIGNMENT_SALES,
  HistoricalConsignmentSale,
} from './aiConsignmentAppraisal';

export interface RegionalConsignmentHeat {
  regionId: string;
  regionName: string;
  shortName: string;
  memberCount: number;
  totalViews: number;
  inquiriesCount: number;
  inquiryFrequency: string; // e.g. "每小时 4.8 次"
  heatScore: number; // 0 - 100
  trend: 'up' | 'stable';
  preferredCategories: string[];
  avgClosingCycleDays: number;
  featuredPreference: string;
  coordinates: { x: number; y: number }; // Relative percentage on SVG map
}

export interface ShowcaseAdviceSection {
  type: 'visual' | 'narrative' | 'pricing';
  title: string;
  currentStatus: string;
  recommendation: string;
  expectedUplift: string; // e.g. "咨询率 +32%"
  priority: 'high' | 'medium' | 'normal';
}

export interface ConsignmentShowcaseAdvice {
  itemId: string;
  itemName: string;
  itemImage: string;
  currentPrice: number;
  status: 'active' | 'in_review' | 'sold';
  overallDisplayScore: number; // 0 - 100
  ratingLabel: '极佳' | '良好' | '需优化';
  adviceList: ShowcaseAdviceSection[];
  historicalBenchmarks: HistoricalConsignmentSale[];
  appliedSuccess?: boolean;
}

/**
 * Regional member activity and tea utensil secondary market inquiries across China
 */
export const REGIONAL_CONSIGNMENT_HEAT_DATA: RegionalConsignmentHeat[] = [
  {
    regionId: 'greater_bay',
    regionName: '粤港澳大湾区 (深圳 · 香港 · 广州)',
    shortName: '大湾区',
    memberCount: 2850,
    totalViews: 6420,
    inquiriesCount: 268,
    inquiryFrequency: '每小时 5.6 次',
    heatScore: 98,
    trend: 'up',
    preferredCategories: ['纯干仓老生普', '潮州老梨皮朱泥壶', '八八青饼'],
    avgClosingCycleDays: 12,
    featuredPreference: '对纯干仓仓储履历极其看重，偏好配有区块链鉴真证书的老茶与名器。',
    coordinates: { x: 68, y: 78 },
  },
  {
    regionId: 'minnan_chaoshan',
    regionName: '闽南与潮汕工夫茶圈 (厦门 · 潮州 · 泉州)',
    shortName: '闽南潮汕',
    memberCount: 1680,
    totalViews: 4180,
    inquiriesCount: 196,
    inquiryFrequency: '每小时 4.2 次',
    heatScore: 94,
    trend: 'up',
    preferredCategories: ['名家手拉朱泥壶', '清末孟臣古器', '正岩大红袍与肉桂'],
    avgClosingCycleDays: 10,
    featuredPreference: '工夫茶核心原产地，对朱泥含砂率、出水孔道与器型出水断水极为挑剔。',
    coordinates: { x: 74, y: 72 },
  },
  {
    regionId: 'yangtze_delta',
    regionName: '长三角文人茶圈 (上海 · 杭州 · 苏州)',
    shortName: '长三角',
    memberCount: 2240,
    totalViews: 5120,
    inquiriesCount: 215,
    inquiryFrequency: '每小时 4.5 次',
    heatScore: 92,
    trend: 'up',
    preferredCategories: ['建盏天目', '景德镇文人描金白瓷', '高端明前单丛'],
    avgClosingCycleDays: 15,
    featuredPreference: '极度注重器物的文人审美、孤品特质与得器背后的文案叙事故事。',
    coordinates: { x: 78, y: 55 },
  },
  {
    regionId: 'beijing_tianjin',
    regionName: '京津冀核心藏家区 (北京 · 天津)',
    shortName: '京津冀',
    memberCount: 1420,
    totalViews: 3260,
    inquiriesCount: 140,
    inquiryFrequency: '每小时 2.8 次',
    heatScore: 86,
    trend: 'stable',
    preferredCategories: ['原野樟香熟普老砖', '陈年老白茶', '大容量紫砂老壶'],
    avgClosingCycleDays: 18,
    featuredPreference: '偏好醇厚、暖胃耐泡的年份茶品，重视母仓恒温恒湿出库保障。',
    coordinates: { x: 65, y: 35 },
  },
  {
    regionId: 'southwest_chongqing',
    regionName: '西南成渝茶馆圈 (成都 · 重庆 · 昆明)',
    shortName: '西南成渝',
    memberCount: 1180,
    totalViews: 2680,
    inquiriesCount: 112,
    inquiryFrequency: '每小时 2.1 次',
    heatScore: 82,
    trend: 'stable',
    preferredCategories: ['云南古树老生普', '滇红金针', '竹木香器'],
    avgClosingCycleDays: 16,
    featuredPreference: '推崇自然悠闲的茶馆生活，对以旧换新置换茶器接受度极高。',
    coordinates: { x: 45, y: 62 },
  },
];

/**
 * Generate showcase display optimization advice for a specific consignment item
 */
export function generateConsignmentShowcaseAdvice(
  item: ConsignmentItem
): ConsignmentShowcaseAdvice {
  const isSold = item.status === 'sold';
  const relevantBenchmarks = HISTORICAL_CONSIGNMENT_SALES.filter(
    (s) => s.category === item.category
  );

  const adviceList: ShowcaseAdviceSection[] = [];
  let score = 80;

  // 1. Visual optimization assessment
  if (item.category === 'teapot') {
    adviceList.push({
      type: 'visual',
      title: '视觉呈现 · 建议补拍底款与胎土微距',
      currentStatus: '当前仅有侧身全景图，缺少底款「孟臣/名家」阴刻印与出水孔特写。',
      recommendation:
        '在自然柔光下拍摄壶底款识微距与七孔直流出水倒流特写，展现梨皮细砂反光，可显著打消闽南及大湾区工夫茶席主疑虑。',
      expectedUplift: '买家查验后留存咨询率预估提升 +32%',
      priority: 'high',
    });
    score += 5;
  } else if (item.category === 'tea') {
    adviceList.push({
      type: 'visual',
      title: '视觉呈现 · 建议补充开汤汤色对比图',
      currentStatus: '当前以茶饼原封为主，缺少沸水冲泡后 1-3 泡汤色与叶底鲜活度实拍。',
      recommendation:
        '建议上传一张 100°C 沸水瀹泡后的琥珀透亮汤色与油润叶底照片，有力佐证纯干仓无白霜特质。',
      expectedUplift: '席主开汤意向申请率提升 +28%',
      priority: 'high',
    });
    score += 6;
  } else {
    adviceList.push({
      type: 'visual',
      title: '视觉呈现 · 增加透光度光影展示',
      currentStatus: '单色光线下描金与胎质玉质感呈现不足。',
      recommendation:
        '拍摄迎光透光图与茶水注入杯中的通透色泽，凸显大师孤品的材质温润感。',
      expectedUplift: '长三角文人藏家关注度提升 +25%',
      priority: 'medium',
    });
  }

  // 2. Narrative optimization assessment
  if (item.provenance.length < 50) {
    adviceList.push({
      type: 'narrative',
      title: '源流文案 · 建议丰富得器故事与伴席光阴',
      currentStatus: '流转文案偏技术参数，缺少藏家得器因缘与冲瀹故事。',
      recommendation:
        '利用「结缘故事」输入框补充器物随您度过的茶席光阴，叙述冲瀹哪款茶品、包浆如何养成，文人情感共鸣是促成转藏的关键。',
      expectedUplift: '藏家深度互动与出价意向提升 +38%',
      priority: 'high',
    });
    score -= 8;
  } else {
    adviceList.push({
      type: 'narrative',
      title: '源流文案 · 提炼金石印章与大师谱系关键词',
      currentStatus: '文案底蕴深厚，建议在标题前置标注出厂/鉴真年号。',
      recommendation:
        '在文案首段提炼【纯干仓标杆 / 大师孤品】，突出春城嘉叶恒温母仓入库封存天数，强化权威背书。',
      expectedUplift: '整体鉴藏信任分评级保持 96+',
      priority: 'medium',
    });
    score += 4;
  }

  // 3. Pricing strategy assessment
  const avgComparable =
    relevantBenchmarks.length > 0
      ? relevantBenchmarks.reduce((sum, b) => sum + b.soldPrice, 0) / relevantBenchmarks.length
      : item.currentPrice;

  const priceDiffRatio = (item.currentPrice - avgComparable) / avgComparable;

  if (priceDiffRatio > 0.15) {
    adviceList.push({
      type: 'pricing',
      title: '席价策略 · 挂牌价略高于历史成交中位线',
      currentStatus: `当前挂牌 ¥${item.currentPrice.toLocaleString()}，历史同品类成交均价约为 ¥${Math.round(
        avgComparable
      ).toLocaleString()}。`,
      recommendation: `建议适度微调至 ¥${Math.round(
        item.currentPrice * 0.95
      ).toLocaleString()} 黄金流转区间，并开启「支持全额嘉叶币抵扣」，可大幅缩短流转等待天数。`,
      expectedUplift: '预计撮合结缘周期缩短约 35%',
      priority: 'high',
    });
  } else {
    adviceList.push({
      type: 'pricing',
      title: '席价策略 · 定价稳健契合二级市场行情',
      currentStatus: `挂牌价 ¥${item.currentPrice.toLocaleString()} 处于春城嘉叶历史估值公允区间。`,
      recommendation:
        '维持当前席价。可主动向大湾区与长三角的白金/黑金终身会员定向推送「优先鉴藏私函」。',
      expectedUplift: '有望在 7-10 天内达成定向认藏',
      priority: 'normal',
    });
    score += 5;
  }

  const finalScore = Math.max(65, Math.min(98, isSold ? 98 : score));

  return {
    itemId: item.id,
    itemName: item.name,
    itemImage: item.image,
    currentPrice: item.currentPrice,
    status: item.status,
    overallDisplayScore: finalScore,
    ratingLabel: finalScore >= 90 ? '极佳' : finalScore >= 80 ? '良好' : '需优化',
    adviceList,
    historicalBenchmarks: relevantBenchmarks.slice(0, 3),
  };
}
