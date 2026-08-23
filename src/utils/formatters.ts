export function formatDong(amount: number): string {
  return `🪙 **${amount.toLocaleString('vi-VN')}** Đồng`;
}

export function formatKimBao(amount: number): string {
  return `💎 **${amount.toLocaleString('vi-VN')}** Kim Bảo`;
}

export function renderProgressBar(current: number, max: number, length = 10, fillChar = '🟩', emptyChar = '⬛'): string {
  const safeCurrent = Math.max(0, current);
  const percentage = Math.min(1, safeCurrent / max);
  const filledLength = Math.round(length * percentage);
  const emptyLength = length - filledLength;

  return fillChar.repeat(filledLength) + emptyChar.repeat(emptyLength) + ` (${safeCurrent}/${max})`;
}

export function renderHpBar(current: number, max: number, length = 10): string {
  const percentage = current / max;
  let fillChar = '🟩';
  if (percentage <= 0.25) fillChar = '🟥';
  else if (percentage <= 0.5) fillChar = '🟨';

  return renderProgressBar(current, max, length, fillChar, '⬛');
}
