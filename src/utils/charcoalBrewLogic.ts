/**
 * Charcoal Water Preparation Logic & Ritual Stages
 * Handles the 30-minute '生火候汤' countdown and 4 oriental brewing water stages.
 */

export const TOTAL_CHARCOAL_BREW_SECONDS = 1800; // 30 minutes

export interface CharcoalBrewStageInfo {
  index: number;
  name: string;
  poeticTitle: string;
  startSecond: number;
  endSecond: number;
  tempRange: string;
  description: string;
  waterSign: string;
}

export const CHARCOAL_BREW_STAGES: CharcoalBrewStageInfo[] = [
  {
    index: 0,
    name: '榄炭引火',
    poeticTitle: '木香初隐 · 榄炭初红',
    startSecond: 0,
    endSecond: 480, // 0 - 8 mins
    tempRange: '室温 ~ 45°C',
    description: '案前红泥炉中码放橄榄炭，引火起炭，炭火渐透。',
    waterSign: '清泉初入铫，静波未动',
  },
  {
    index: 1,
    name: '陶铫温炉',
    poeticTitle: '活泉微润 · 器气相融',
    startSecond: 480,
    endSecond: 960, // 8 - 16 mins
    tempRange: '45°C ~ 75°C',
    description: '银壶/陶铫置于炭火之上，器身渐暖，温养泉水。',
    waterSign: '铫底微起细气，如缀碎玉',
  },
  {
    index: 2,
    name: '蟹眼微沸',
    poeticTitle: '松风过竹 · 蟹眼初鸣',
    startSecond: 960,
    endSecond: 1440, // 16 - 24 mins
    tempRange: '75°C ~ 92°C',
    description: '泉水泛起蟹眼微泡，声如松涛竹韵，水性渐活。',
    waterSign: '蟹眼微沸，松风之声初作',
  },
  {
    index: 3,
    name: '候汤吉时',
    poeticTitle: '腾波合度 · 引泉瀹茗',
    startSecond: 1440,
    endSecond: 1800, // 24 - 30 mins
    tempRange: '95°C ~ 98°C',
    description: '炭火纯青，活水已成二沸吉时，主理人即刻迎客入席。',
    waterSign: '鱼目腾波，活火开瀹',
  },
];

/**
 * Return current stage by elapsed seconds
 */
export function getCharcoalBrewStage(elapsedSeconds: number): CharcoalBrewStageInfo {
  const clamped = Math.max(0, Math.min(TOTAL_CHARCOAL_BREW_SECONDS, elapsedSeconds));
  const found = CHARCOAL_BREW_STAGES.find(
    (s) => clamped >= s.startSecond && clamped < s.endSecond
  );
  return found || CHARCOAL_BREW_STAGES[CHARCOAL_BREW_STAGES.length - 1];
}

/**
 * Format remaining seconds into MM:SS
 */
export function formatBrewTime(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Calculate progress ratio from 0 to 1
 */
export function calculateBrewProgressRatio(elapsedSeconds: number): number {
  return Math.max(0, Math.min(1, elapsedSeconds / TOTAL_CHARCOAL_BREW_SECONDS));
}
