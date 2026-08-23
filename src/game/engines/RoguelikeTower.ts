export interface BoonOption {
  id: string;
  name: string;
  desc: string;
  effectType: 'HEAL' | 'ATK_BOOST' | 'CRIT_BOOST' | 'SHIELD';
}

export const TOWER_BOONS: BoonOption[] = [
  {
    id: 'boon_heal',
    name: '💚 Hồi Phục Thần Dược',
    desc: 'Hồi 20% Sinh Lực ngay lập tức sau mỗi ải',
    effectType: 'HEAL',
  },
  {
    id: 'boon_atk',
    name: '🗡️ Cuồng Sát Nhất Kích',
    desc: 'Tăng 30% Sát Thương nhưng mất 5% máu hiện tại',
    effectType: 'ATK_BOOST',
  },
  {
    id: 'boon_crit',
    name: '🎯 Thần Nhãn Chí Mạng',
    desc: 'Tăng +25% Tỷ Lệ Chí Mạng trong suốt lượt leo tháp',
    effectType: 'CRIT_BOOST',
  },
  {
    id: 'boon_shield',
    name: '🛡️ Kim Cang Bảo Hộ',
    desc: 'Giảm 25% Sát Thương gánh chịu từ quái tháp',
    effectType: 'SHIELD',
  },
];

export class RoguelikeTowerEngine {
  /**
   * Lấy ngẫu nhiên 3 Bùa Chúc Phúc (Boon Selection Buttons) sau mỗi 5 tầng
   */
  public static getRandomBoons(): BoonOption[] {
    const shuffled = [...TOWER_BOONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
}
