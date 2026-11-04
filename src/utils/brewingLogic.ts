import { TEA_WISDOM_ITEMS, TeaWisdomItem } from '../data/teaWisdomData';

/**
 * Pure functions for tea brewing computations & card filtering
 */

/**
 * Calculate recommended steep time (in seconds) for a given steep count (1-indexed).
 * If item provides specific curve array, uses it; otherwise calculates a logarithmic curve.
 */
export function getSteepTimeForRound(item: TeaWisdomItem, round: number): number {
  if (round <= 0) return 0;
  if (item.steepTimes && item.steepTimes.length > 0) {
    const idx = round - 1;
    if (idx < item.steepTimes.length) {
      return item.steepTimes[idx];
    }
    // Beyond defined rounds, add 10 seconds per round
    const last = item.steepTimes[item.steepTimes.length - 1];
    return last + (round - item.steepTimes.length) * 10;
  }
  // Default fallback curve (5s base, +3s per round)
  return Math.min(180, 5 + (round - 1) * 5);
}

/**
 * Calculate recommended water ml for given leaf grams and ratio string
 */
export function calculateWaterAmount(leafGrams: number, ratioStr: string): number {
  if (leafGrams <= 0) return 0;
  // Parse ratio like "1 : 20" or "1 : 18 ~ 1 : 20"
  const matches = ratioStr.match(/1\s*:\s*(\d+)/);
  const ratio = matches ? parseInt(matches[1], 10) : 20;
  return Math.round(leafGrams * ratio);
}

/**
 * Filter tea wisdom items by category or keyword search
 */
export function filterTeaWisdom(
  items: TeaWisdomItem[],
  selectedCategory: string | null,
  searchQuery: string = ''
): TeaWisdomItem[] {
  return items.filter((item) => {
    const matchCategory = !selectedCategory || selectedCategory === '全部' || item.category === selectedCategory;
    if (!matchCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.brief.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.categoryEn.toLowerCase().includes(q) ||
      item.recommendedVessel.toLowerCase().includes(q)
    );
  });
}

/**
 * Formats seconds into Chinese time readout (e.g., 5秒 or 1分30秒)
 */
export function formatSteepDurationCN(seconds: number): string {
  if (seconds <= 0) return '秒出 (即出汤)';
  if (seconds < 60) return `${seconds} 秒`;
  const mins = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (remaining === 0) return `${mins} 分钟`;
  return `${mins} 分 ${remaining} 秒`;
}
