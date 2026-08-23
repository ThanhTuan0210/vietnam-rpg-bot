export interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string; // '2'..'10', 'J', 'Q', 'K', 'A'
  weight: number;
}

export type HandType = 'NORMAL' | 'XI_BANG' | 'XI_DACH' | 'NGU_LINH' | 'QUAC';

export interface HandStatus {
  total: number;
  type: HandType;
  cards: Card[];
  isBust: boolean;
}

export class BlackjackEngine {
  private deck: Card[] = [];

  constructor() {
    this.resetDeck();
  }

  /**
   * Tạo mới và xáo trộn bộ bài 52 lá
   */
  public resetDeck(): void {
    const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.deck = [];

    for (const suit of suits) {
      for (const val of values) {
        let weight = parseInt(val, 10);
        if (['J', 'Q', 'K'].includes(val)) weight = 10;
        if (val === 'A') weight = 11; // Mặc định A = 11, tính linh hoạt sau

        this.deck.push({ suit, value: val, weight });
      }
    }

    // Xáo bài (Fisher-Yates Shuffle)
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  /**
   * Rút 1 lá bài từ bộ bài
   */
  public drawCard(): Card {
    if (this.deck.length === 0) {
      this.resetDeck();
    }
    return this.deck.pop()!;
  }

  /**
   * Tính toán điểm số và loại thế bài (Normal, Xì Bàng, Xì Dách, Ngũ Linh, Quắc)
   */
  public static evaluateHand(cards: Card[]): HandStatus {
    if (cards.length === 0) {
      return { total: 0, type: 'NORMAL', cards, isBust: false };
    }

    // Kiểm tra Xì Bàng (2 lá A)
    if (cards.length === 2 && cards[0].value === 'A' && cards[1].value === 'A') {
      return { total: 22, type: 'XI_BANG', cards, isBust: false };
    }

    // Kiểm tra Xì Dách (1 lá A + 1 lá 10/J/Q/K)
    if (cards.length === 2) {
      const hasAce = cards.some((c) => c.value === 'A');
      const hasTen = cards.some((c) => ['10', 'J', 'Q', 'K'].includes(c.value));
      if (hasAce && hasTen) {
        return { total: 21, type: 'XI_DACH', cards, isBust: false };
      }
    }

    // Tính tổng điểm linh hoạt cho lá Ace
    let total = 0;
    let aceCount = 0;

    for (const card of cards) {
      if (card.value === 'A') {
        aceCount++;
        total += 11;
      } else {
        total += card.weight;
      }
    }

    // Nếu tổng > 21 và có lá A, chuyển A từ 11 thành 1
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }

    const isBust = total > 21;

    // Kiểm tra Ngũ Linh (Rút đủ 5 lá mà không quắc)
    if (cards.length === 5 && !isBust) {
      return { total, type: 'NGU_LINH', cards, isBust: false };
    }

    if (isBust) {
      return { total, type: 'QUAC', cards, isBust: true };
    }

    return { total, type: 'NORMAL', cards, isBust: false };
  }

  /**
   * Định dạng bài thành chuỗi hiển thị đẹp mắt (VD: `[🂡 A♠] [🂮 K♥]`)
   */
  public static formatCards(cards: Card[], hideSecondCard = false): string {
    if (hideSecondCard && cards.length >= 2) {
      return `\`[ ${cards[0].value}${cards[0].suit} ]\` \`[ 🎴 Ẩn ]\``;
    }
    return cards.map((c) => `\`[ ${c.value}${c.suit} ]\``).join(' ');
  }

  /**
   * So sánh kết quả giữa Người Chơi và Nhà Cái
   * @returns multiplier tiền trả thưởng (0: Thua, 1: Hòa hoàn tiền, 2: Thắng x1, 2.5: Thắng Xì Dách x1.5, 3: Thắng Xì Bàng/Ngũ Linh x2)
   */
  public static compareHands(
    playerHand: HandStatus,
    dealerHand: HandStatus
  ): { result: 'WIN' | 'LOSE' | 'TIE'; multiplier: number; reason: string } {
    // 1. Cả 2 cùng Quắc -> Nhà cái ăn (Quy tắc sòng bài)
    if (playerHand.type === 'QUAC' && dealerHand.type === 'QUAC') {
      return { result: 'LOSE', multiplier: 0, reason: 'Cả hai cùng Quắc (>21 điểm), Nhà cái thắng!' };
    }

    // 2. Người chơi Quắc -> Thua
    if (playerHand.type === 'QUAC') {
      return { result: 'LOSE', multiplier: 0, reason: 'Bạn bị Quắc (>21 điểm)!' };
    }

    // 3. Nhà cái Quắc -> Người chơi thắng
    if (dealerHand.type === 'QUAC') {
      return { result: 'WIN', multiplier: 2, reason: 'Nhà cái bị Quắc (>21 điểm), Bạn thắng!' };
    }

    // 4. Xì Bàng
    if (playerHand.type === 'XI_BANG' && dealerHand.type === 'XI_BANG') {
      return { result: 'TIE', multiplier: 1, reason: 'Cả hai cùng ra Xì Bàng! Hòa tiền cược.' };
    }
    if (playerHand.type === 'XI_BANG') {
      return { result: 'WIN', multiplier: 3, reason: '🔥 Bạn ra **Xì Bàng** tối cao (2 lá A)! Thắng gấp 2 lần cược!' };
    }
    if (dealerHand.type === 'XI_BANG') {
      return { result: 'LOSE', multiplier: 0, reason: 'Nhà cái ra **Xì Bàng** (2 lá A), Bạn thua!' };
    }

    // 5. Xì Dách
    if (playerHand.type === 'XI_DACH' && dealerHand.type === 'XI_DACH') {
      return { result: 'TIE', multiplier: 1, reason: 'Cả hai cùng ra Xì Dách! Hòa tiền cược.' };
    }
    if (playerHand.type === 'XI_DACH') {
      return { result: 'WIN', multiplier: 2.5, reason: '✨ Bạn ra **Xì Dách**! Thắng 1.5 lần cược!' };
    }
    if (dealerHand.type === 'XI_DACH') {
      return { result: 'LOSE', multiplier: 0, reason: 'Nhà cái ra **Xì Dách**, Bạn thua!' };
    }

    // 6. Ngũ Linh
    if (playerHand.type === 'NGU_LINH' && dealerHand.type === 'NGU_LINH') {
      if (playerHand.total < dealerHand.total) {
        return { result: 'WIN', multiplier: 3, reason: '🌟 Cả hai Ngũ Linh, điểm bạn thấp hơn nên Thắng x2!' };
      } else if (playerHand.total > dealerHand.total) {
        return { result: 'LOSE', multiplier: 0, reason: 'Cả hai Ngũ Linh, điểm bạn cao hơn nên Thua!' };
      } else {
        return { result: 'TIE', multiplier: 1, reason: 'Cả hai Ngũ Linh cùng điểm! Hòa tiền.' };
      }
    }
    if (playerHand.type === 'NGU_LINH') {
      return { result: 'WIN', multiplier: 3, reason: '🌟 Bạn đạt **Ngũ Linh** (5 lá $\\le 21$ điểm)! Thắng gấp 2 lần cược!' };
    }
    if (dealerHand.type === 'NGU_LINH') {
      return { result: 'LOSE', multiplier: 0, reason: 'Nhà cái đạt **Ngũ Linh**, Bạn thua!' };
    }

    // 7. So điểm Normal
    if (playerHand.total > dealerHand.total) {
      return { result: 'WIN', multiplier: 2, reason: `Bạn (${playerHand.total} điểm) lớn hơn Nhà cái (${dealerHand.total} điểm)!` };
    } else if (playerHand.total < dealerHand.total) {
      return { result: 'LOSE', multiplier: 0, reason: `Nhà cái (${dealerHand.total} điểm) lớn hơn Bạn (${playerHand.total} điểm)!` };
    } else {
      return { result: 'TIE', multiplier: 1, reason: `Cả hai cùng ${playerHand.total} điểm! Hòa tiền cược.` };
    }
  }
}
