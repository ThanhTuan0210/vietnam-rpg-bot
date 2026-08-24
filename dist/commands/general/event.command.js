"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventTestCommand = eventTestCommand;
const HourlyEventService_1 = require("../../game/services/HourlyEventService");
async function eventTestCommand(message, args) {
    const hourArg = parseInt(args[0]) || 20;
    await message.reply(`⚡ **Kích hoạt Thử Nghiệm Sự Kiện Giờ Vàng (Khung ${hourArg}H)...**`);
    await HourlyEventService_1.HourlyEventService.broadcastHourlyEvent(message.client, hourArg, message);
}
