export interface UserStateForSuggest {
  hp: number;
  maxHp: number;
  producerJob?: string;
  level?: number;
  dong?: number;
}

export function getContextSuggestions(state: UserStateForSuggest): string {
  const hints: string[] = [];

  // 1. Kiểm tra HP
  if (state.hp < state.maxHp * 0.4) {
    hints.push('`vkl use potion_01a` (Bơm HP)')
    hints.push('`vkl duongthuong` (Hồi máu)');
  }

  // 2. Kiểm tra Producer Job
  if (state.producerJob === 'miner') {
    hints.push('`vkl mine` (Đào quặng)');
    hints.push('`vkl vlt dep` (Cất quặng)');
  } else if (state.producerJob === 'alchemist') {
    hints.push('`vkl brew` (Luyện thuốc)');
    hints.push('`vkl vlt dep` (Cất thuốc)');
  } else if (state.producerJob === 'blacksmith') {
    hints.push('`vkl craft` (Rèn đồ)');
    hints.push('`vkl cuonghoa` (Đập đồ)');
  }

  // 3. Tiến trình chung
  if (state.level && state.level >= 10) {
    hints.push('`vkl d 1` (Ngục tối Tầng 1)');
  }

  if (hints.length === 0) {
    hints.push('`vkl w` (Combo nghề)');
    hints.push('`vkl h` (Săn quái)');
  }

  return `💡 **Gợi ý bước tiếp theo:** ${hints.slice(0, 3).join(' • ')}`;
}
