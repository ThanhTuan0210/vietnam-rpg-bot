"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDong = formatDong;
exports.formatKimBao = formatKimBao;
exports.renderProgressBar = renderProgressBar;
exports.renderHpBar = renderHpBar;
function formatDong(amount) {
    return `🪙 **${amount.toLocaleString('vi-VN')}** Đồng`;
}
function formatKimBao(amount) {
    return `💎 **${amount.toLocaleString('vi-VN')}** Kim Bảo`;
}
function renderProgressBar(current, max, length = 10, fillChar = '🟩', emptyChar = '⬛') {
    const safeCurrent = Math.max(0, current);
    const percentage = Math.min(1, safeCurrent / max);
    const filledLength = Math.round(length * percentage);
    const emptyLength = length - filledLength;
    return fillChar.repeat(filledLength) + emptyChar.repeat(emptyLength) + ` (${safeCurrent}/${max})`;
}
function renderHpBar(current, max, length = 10) {
    const percentage = current / max;
    let fillChar = '🟩';
    if (percentage <= 0.25)
        fillChar = '🟥';
    else if (percentage <= 0.5)
        fillChar = '🟨';
    return renderProgressBar(current, max, length, fillChar, '⬛');
}
