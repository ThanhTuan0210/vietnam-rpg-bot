"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEMS = exports.CUSTOM_EMOJIS = void 0;
exports.getItemIcon = getItemIcon;
exports.CUSTOM_EMOJIS = {};
function getItemIcon(itemId, defaultIcon = '📦') {
    if (exports.CUSTOM_EMOJIS[itemId]) {
        return exports.CUSTOM_EMOJIS[itemId];
    }
    const item = exports.ITEMS[itemId];
    return item?.icon || defaultIcon;
}
exports.ITEMS = {
    "sword_01a": {
        "id": "sword_01a",
        "name": "Thép Kiếm Gothic Tier 1",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 5.",
        "statBonus": {
            "satThuong": 55,
            "chiMang": 0.07
        },
        "requiredLevel": 5,
        "sellPrice": 700,
        "icon": "⚔️"
    },
    "sword_01b": {
        "id": "sword_01b",
        "name": "Kiếm Trung Cổ Tier 1.2",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 10.",
        "statBonus": {
            "satThuong": 85,
            "chiMang": 0.1
        },
        "requiredLevel": 10,
        "sellPrice": 1200,
        "icon": "🗡️"
    },
    "sword_01c": {
        "id": "sword_01c",
        "name": "Kiếm Trung Cổ Tier 1.3",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 15.",
        "statBonus": {
            "satThuong": 115,
            "chiMang": 0.13
        },
        "requiredLevel": 15,
        "sellPrice": 1700,
        "icon": "⚔️"
    },
    "sword_01d": {
        "id": "sword_01d",
        "name": "Kiếm Trung Cổ Tier 1.4",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 20.",
        "statBonus": {
            "satThuong": 145,
            "chiMang": 0.16
        },
        "requiredLevel": 20,
        "sellPrice": 2200,
        "icon": "💥"
    },
    "sword_01e": {
        "id": "sword_01e",
        "name": "Kiếm Trung Cổ Tier 1.5",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 25.",
        "statBonus": {
            "satThuong": 175,
            "chiMang": 0.19
        },
        "requiredLevel": 25,
        "sellPrice": 2700,
        "icon": "⚔️"
    },
    "sword_02a": {
        "id": "sword_02a",
        "name": "Bảo Kiếm Hoàng Gia Tier 2",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 30.",
        "statBonus": {
            "satThuong": 205,
            "chiMang": 0.09
        },
        "requiredLevel": 30,
        "sellPrice": 3200,
        "icon": "⚔️"
    },
    "sword_02b": {
        "id": "sword_02b",
        "name": "Kiếm Trung Cổ Tier 2.2",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 35.",
        "statBonus": {
            "satThuong": 235,
            "chiMang": 0.12
        },
        "requiredLevel": 35,
        "sellPrice": 3700,
        "icon": "🗡️"
    },
    "sword_02c": {
        "id": "sword_02c",
        "name": "Kiếm Trung Cổ Tier 2.3",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 40.",
        "statBonus": {
            "satThuong": 265,
            "chiMang": 0.15
        },
        "requiredLevel": 40,
        "sellPrice": 4200,
        "icon": "⚔️"
    },
    "sword_02d": {
        "id": "sword_02d",
        "name": "Kiếm Trung Cổ Tier 2.4",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 45.",
        "statBonus": {
            "satThuong": 295,
            "chiMang": 0.18
        },
        "requiredLevel": 45,
        "sellPrice": 4700,
        "icon": "💥"
    },
    "sword_02e": {
        "id": "sword_02e",
        "name": "Kiếm Trung Cổ Tier 2.5",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 50.",
        "statBonus": {
            "satThuong": 325,
            "chiMang": 0.21
        },
        "requiredLevel": 50,
        "sellPrice": 5200,
        "icon": "⚔️"
    },
    "sword_03a": {
        "id": "sword_03a",
        "name": "Kiếm Trung Cổ Tier 3.1",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 55.",
        "statBonus": {
            "satThuong": 355,
            "chiMang": 0.11
        },
        "requiredLevel": 55,
        "sellPrice": 5700,
        "icon": "⚔️"
    },
    "sword_03b": {
        "id": "sword_03b",
        "name": "Kiếm Trung Cổ Tier 3.2",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 60.",
        "statBonus": {
            "satThuong": 385,
            "chiMang": 0.14
        },
        "requiredLevel": 60,
        "sellPrice": 6200,
        "icon": "🗡️"
    },
    "sword_03c": {
        "id": "sword_03c",
        "name": "Kiếm Trung Cổ Tier 3.3",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 65.",
        "statBonus": {
            "satThuong": 415,
            "chiMang": 0.17
        },
        "requiredLevel": 65,
        "sellPrice": 6700,
        "icon": "⚔️"
    },
    "sword_03d": {
        "id": "sword_03d",
        "name": "Kiếm Trung Cổ Tier 3.4",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 70.",
        "statBonus": {
            "satThuong": 445,
            "chiMang": 0.2
        },
        "requiredLevel": 70,
        "sellPrice": 7200,
        "icon": "💥"
    },
    "sword_03e": {
        "id": "sword_03e",
        "name": "Kiếm Trung Cổ Tier 3.5",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 75.",
        "statBonus": {
            "satThuong": 475,
            "chiMang": 0.23
        },
        "requiredLevel": 75,
        "sellPrice": 7700,
        "icon": "⚔️"
    },
    "sword_04a": {
        "id": "sword_04a",
        "name": "Kiếm Trung Cổ Tier 4.1",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 80.",
        "statBonus": {
            "satThuong": 505,
            "chiMang": 0.13
        },
        "requiredLevel": 80,
        "sellPrice": 8200,
        "icon": "⚔️"
    },
    "sword_04b": {
        "id": "sword_04b",
        "name": "Kiếm Trung Cổ Tier 4.2",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 85.",
        "statBonus": {
            "satThuong": 535,
            "chiMang": 0.16
        },
        "requiredLevel": 85,
        "sellPrice": 8700,
        "icon": "🗡️"
    },
    "sword_04c": {
        "id": "sword_04c",
        "name": "Kiếm Trung Cổ Tier 4.3",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 90.",
        "statBonus": {
            "satThuong": 565,
            "chiMang": 0.19
        },
        "requiredLevel": 90,
        "sellPrice": 9200,
        "icon": "⚔️"
    },
    "sword_04d": {
        "id": "sword_04d",
        "name": "Kiếm Trung Cổ Tier 4.4",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 95.",
        "statBonus": {
            "satThuong": 595,
            "chiMang": 0.22
        },
        "requiredLevel": 95,
        "sellPrice": 9700,
        "icon": "💥"
    },
    "sword_04e": {
        "id": "sword_04e",
        "name": "Bảo Kiếm Excalibur ENDGAME",
        "type": "vukhi",
        "description": "Thanh kiếm thép Kyrise Gothic cấp 100.",
        "statBonus": {
            "satThuong": 625,
            "chiMang": 0.25
        },
        "requiredLevel": 100,
        "sellPrice": 10200,
        "icon": "⚔️"
    },
    "staff_01a": {
        "id": "staff_01a",
        "name": "Trượng Gỗ Rừng Tier 1",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 5.",
        "statBonus": {
            "satThuong": 65,
            "manaToiDa": 100
        },
        "requiredLevel": 5,
        "sellPrice": 850,
        "icon": "🪄"
    },
    "staff_01b": {
        "id": "staff_01b",
        "name": "Trượng Ma Pháp Tier 1.2",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 10.",
        "statBonus": {
            "satThuong": 100,
            "manaToiDa": 150
        },
        "requiredLevel": 10,
        "sellPrice": 1450,
        "icon": "🔮"
    },
    "staff_01c": {
        "id": "staff_01c",
        "name": "Trượng Ma Pháp Tier 1.3",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 15.",
        "statBonus": {
            "satThuong": 135,
            "manaToiDa": 200
        },
        "requiredLevel": 15,
        "sellPrice": 2050,
        "icon": "🪄"
    },
    "staff_01d": {
        "id": "staff_01d",
        "name": "Trượng Ma Pháp Tier 1.4",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 20.",
        "statBonus": {
            "satThuong": 170,
            "manaToiDa": 250
        },
        "requiredLevel": 20,
        "sellPrice": 2650,
        "icon": "🔮"
    },
    "staff_01e": {
        "id": "staff_01e",
        "name": "Trượng Ma Pháp Tier 1.5",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 25.",
        "statBonus": {
            "satThuong": 205,
            "manaToiDa": 300
        },
        "requiredLevel": 25,
        "sellPrice": 3250,
        "icon": "🪄"
    },
    "staff_02a": {
        "id": "staff_02a",
        "name": "Trượng Ma Pháp Tier 2.1",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 30.",
        "statBonus": {
            "satThuong": 240,
            "manaToiDa": 350
        },
        "requiredLevel": 30,
        "sellPrice": 3850,
        "icon": "🪄"
    },
    "staff_02b": {
        "id": "staff_02b",
        "name": "Trượng Ma Pháp Tier 2.2",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 35.",
        "statBonus": {
            "satThuong": 275,
            "manaToiDa": 400
        },
        "requiredLevel": 35,
        "sellPrice": 4450,
        "icon": "🔮"
    },
    "staff_02c": {
        "id": "staff_02c",
        "name": "Trượng Ma Pháp Tier 2.3",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 40.",
        "statBonus": {
            "satThuong": 310,
            "manaToiDa": 450
        },
        "requiredLevel": 40,
        "sellPrice": 5050,
        "icon": "🪄"
    },
    "staff_02d": {
        "id": "staff_02d",
        "name": "Trượng Ma Pháp Tier 2.4",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 45.",
        "statBonus": {
            "satThuong": 345,
            "manaToiDa": 500
        },
        "requiredLevel": 45,
        "sellPrice": 5650,
        "icon": "🔮"
    },
    "staff_02e": {
        "id": "staff_02e",
        "name": "Trượng Ma Pháp Tier 2.5",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 50.",
        "statBonus": {
            "satThuong": 380,
            "manaToiDa": 550
        },
        "requiredLevel": 50,
        "sellPrice": 6250,
        "icon": "🪄"
    },
    "staff_03a": {
        "id": "staff_03a",
        "name": "Trượng Ma Pháp Tier 3.1",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 55.",
        "statBonus": {
            "satThuong": 415,
            "manaToiDa": 600
        },
        "requiredLevel": 55,
        "sellPrice": 6850,
        "icon": "🪄"
    },
    "staff_03b": {
        "id": "staff_03b",
        "name": "Trượng Ma Pháp Tier 3.2",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 60.",
        "statBonus": {
            "satThuong": 450,
            "manaToiDa": 650
        },
        "requiredLevel": 60,
        "sellPrice": 7450,
        "icon": "🔮"
    },
    "staff_03c": {
        "id": "staff_03c",
        "name": "Trượng Ma Pháp Tier 3.3",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 65.",
        "statBonus": {
            "satThuong": 485,
            "manaToiDa": 700
        },
        "requiredLevel": 65,
        "sellPrice": 8050,
        "icon": "🪄"
    },
    "staff_03d": {
        "id": "staff_03d",
        "name": "Trượng Ma Pháp Tier 3.4",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 70.",
        "statBonus": {
            "satThuong": 520,
            "manaToiDa": 750
        },
        "requiredLevel": 70,
        "sellPrice": 8650,
        "icon": "🔮"
    },
    "staff_03e": {
        "id": "staff_03e",
        "name": "Trượng Ma Pháp Tier 3.5",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 75.",
        "statBonus": {
            "satThuong": 555,
            "manaToiDa": 800
        },
        "requiredLevel": 75,
        "sellPrice": 9250,
        "icon": "🪄"
    },
    "staff_04a": {
        "id": "staff_04a",
        "name": "Trượng Ma Pháp Tier 4.1",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 80.",
        "statBonus": {
            "satThuong": 590,
            "manaToiDa": 850
        },
        "requiredLevel": 80,
        "sellPrice": 9850,
        "icon": "🪄"
    },
    "staff_04b": {
        "id": "staff_04b",
        "name": "Trượng Ma Pháp Tier 4.2",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 85.",
        "statBonus": {
            "satThuong": 625,
            "manaToiDa": 900
        },
        "requiredLevel": 85,
        "sellPrice": 10450,
        "icon": "🔮"
    },
    "staff_04c": {
        "id": "staff_04c",
        "name": "Trượng Ma Pháp Tier 4.3",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 90.",
        "statBonus": {
            "satThuong": 660,
            "manaToiDa": 950
        },
        "requiredLevel": 90,
        "sellPrice": 11050,
        "icon": "🪄"
    },
    "staff_04d": {
        "id": "staff_04d",
        "name": "Trượng Ma Pháp Tier 4.4",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 95.",
        "statBonus": {
            "satThuong": 695,
            "manaToiDa": 1000
        },
        "requiredLevel": 95,
        "sellPrice": 11650,
        "icon": "🔮"
    },
    "staff_04e": {
        "id": "staff_04e",
        "name": "Trượng Linh Hồn Rồng ENDGAME",
        "type": "vukhi",
        "description": "Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp 100.",
        "statBonus": {
            "satThuong": 730,
            "manaToiDa": 1050
        },
        "requiredLevel": 100,
        "sellPrice": 12250,
        "icon": "🪄"
    },
    "bow_01a": {
        "id": "bow_01a",
        "name": "Cung Tinh Linh Tier 1",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 5.",
        "statBonus": {
            "satThuong": 50,
            "chiMang": 0.1
        },
        "requiredLevel": 5,
        "sellPrice": 770,
        "icon": "🏹"
    },
    "bow_01b": {
        "id": "bow_01b",
        "name": "Cung Tinh Linh Tier 1.2",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 10.",
        "statBonus": {
            "satThuong": 80,
            "chiMang": 0.12
        },
        "requiredLevel": 10,
        "sellPrice": 1320,
        "icon": "🏹"
    },
    "bow_01c": {
        "id": "bow_01c",
        "name": "Cung Tinh Linh Tier 1.3",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 15.",
        "statBonus": {
            "satThuong": 110,
            "chiMang": 0.14
        },
        "requiredLevel": 15,
        "sellPrice": 1870,
        "icon": "🏹"
    },
    "bow_01d": {
        "id": "bow_01d",
        "name": "Cung Tinh Linh Tier 1.4",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 20.",
        "statBonus": {
            "satThuong": 140,
            "chiMang": 0.16
        },
        "requiredLevel": 20,
        "sellPrice": 2420,
        "icon": "🏹"
    },
    "bow_01e": {
        "id": "bow_01e",
        "name": "Cung Tinh Linh Tier 1.5",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 25.",
        "statBonus": {
            "satThuong": 170,
            "chiMang": 0.18
        },
        "requiredLevel": 25,
        "sellPrice": 2970,
        "icon": "🏹"
    },
    "bow_02a": {
        "id": "bow_02a",
        "name": "Cung Tinh Linh Tier 2.1",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 30.",
        "statBonus": {
            "satThuong": 200,
            "chiMang": 0.12
        },
        "requiredLevel": 30,
        "sellPrice": 3520,
        "icon": "🏹"
    },
    "bow_02b": {
        "id": "bow_02b",
        "name": "Cung Tinh Linh Tier 2.2",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 35.",
        "statBonus": {
            "satThuong": 230,
            "chiMang": 0.14
        },
        "requiredLevel": 35,
        "sellPrice": 4070,
        "icon": "🏹"
    },
    "bow_02c": {
        "id": "bow_02c",
        "name": "Cung Tinh Linh Tier 2.3",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 40.",
        "statBonus": {
            "satThuong": 260,
            "chiMang": 0.16
        },
        "requiredLevel": 40,
        "sellPrice": 4620,
        "icon": "🏹"
    },
    "bow_02d": {
        "id": "bow_02d",
        "name": "Cung Tinh Linh Tier 2.4",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 45.",
        "statBonus": {
            "satThuong": 290,
            "chiMang": 0.18
        },
        "requiredLevel": 45,
        "sellPrice": 5170,
        "icon": "🏹"
    },
    "bow_02e": {
        "id": "bow_02e",
        "name": "Cung Tinh Linh Tier 2.5",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 50.",
        "statBonus": {
            "satThuong": 320,
            "chiMang": 0.2
        },
        "requiredLevel": 50,
        "sellPrice": 5720,
        "icon": "🏹"
    },
    "bow_03a": {
        "id": "bow_03a",
        "name": "Cung Tinh Linh Tier 3.1",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 55.",
        "statBonus": {
            "satThuong": 350,
            "chiMang": 0.14
        },
        "requiredLevel": 55,
        "sellPrice": 6270,
        "icon": "🏹"
    },
    "bow_03b": {
        "id": "bow_03b",
        "name": "Cung Tinh Linh Tier 3.2",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 60.",
        "statBonus": {
            "satThuong": 380,
            "chiMang": 0.16
        },
        "requiredLevel": 60,
        "sellPrice": 6820,
        "icon": "🏹"
    },
    "bow_03c": {
        "id": "bow_03c",
        "name": "Cung Tinh Linh Tier 3.3",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 65.",
        "statBonus": {
            "satThuong": 410,
            "chiMang": 0.18
        },
        "requiredLevel": 65,
        "sellPrice": 7370,
        "icon": "🏹"
    },
    "bow_03d": {
        "id": "bow_03d",
        "name": "Cung Tinh Linh Tier 3.4",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 70.",
        "statBonus": {
            "satThuong": 440,
            "chiMang": 0.2
        },
        "requiredLevel": 70,
        "sellPrice": 7920,
        "icon": "🏹"
    },
    "bow_03e": {
        "id": "bow_03e",
        "name": "Cung Tinh Linh Tier 3.5",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 75.",
        "statBonus": {
            "satThuong": 470,
            "chiMang": 0.22
        },
        "requiredLevel": 75,
        "sellPrice": 8470,
        "icon": "🏹"
    },
    "bow_04a": {
        "id": "bow_04a",
        "name": "Cung Tinh Linh Tier 4.1",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 80.",
        "statBonus": {
            "satThuong": 500,
            "chiMang": 0.16
        },
        "requiredLevel": 80,
        "sellPrice": 9020,
        "icon": "🏹"
    },
    "bow_04b": {
        "id": "bow_04b",
        "name": "Cung Tinh Linh Tier 4.2",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 85.",
        "statBonus": {
            "satThuong": 530,
            "chiMang": 0.18
        },
        "requiredLevel": 85,
        "sellPrice": 9570,
        "icon": "🏹"
    },
    "bow_04c": {
        "id": "bow_04c",
        "name": "Cung Tinh Linh Tier 4.3",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 90.",
        "statBonus": {
            "satThuong": 560,
            "chiMang": 0.2
        },
        "requiredLevel": 90,
        "sellPrice": 10120,
        "icon": "🏹"
    },
    "bow_04d": {
        "id": "bow_04d",
        "name": "Cung Tinh Linh Tier 4.4",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 95.",
        "statBonus": {
            "satThuong": 590,
            "chiMang": 0.22
        },
        "requiredLevel": 95,
        "sellPrice": 10670,
        "icon": "🏹"
    },
    "bow_04e": {
        "id": "bow_04e",
        "name": "Cung Vương Phủ Rồng ENDGAME",
        "type": "vukhi",
        "description": "Cung bão tên Kyrise Gothic cấp 100.",
        "statBonus": {
            "satThuong": 620,
            "chiMang": 0.24
        },
        "requiredLevel": 100,
        "sellPrice": 11220,
        "icon": "🏹"
    },
    "shield_01a": {
        "id": "shield_01a",
        "name": "Khiên Thép Gothic Tier 1",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 5.",
        "statBonus": {
            "phongThu": 40,
            "sinhLucToiDa": 155
        },
        "requiredLevel": 5,
        "sellPrice": 650,
        "icon": "🛡️"
    },
    "shield_01b": {
        "id": "shield_01b",
        "name": "Khiên Giáp Tier 1.2",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 10.",
        "statBonus": {
            "phongThu": 60,
            "sinhLucToiDa": 230
        },
        "requiredLevel": 10,
        "sellPrice": 1100,
        "icon": "🛡️"
    },
    "shield_01c": {
        "id": "shield_01c",
        "name": "Khiên Giáp Tier 1.3",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 15.",
        "statBonus": {
            "phongThu": 80,
            "sinhLucToiDa": 305
        },
        "requiredLevel": 15,
        "sellPrice": 1550,
        "icon": "🛡️"
    },
    "shield_01d": {
        "id": "shield_01d",
        "name": "Khiên Giáp Tier 1.4",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 20.",
        "statBonus": {
            "phongThu": 100,
            "sinhLucToiDa": 380
        },
        "requiredLevel": 20,
        "sellPrice": 2000,
        "icon": "🛡️"
    },
    "shield_01e": {
        "id": "shield_01e",
        "name": "Khiên Giáp Tier 1.5",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 25.",
        "statBonus": {
            "phongThu": 120,
            "sinhLucToiDa": 455
        },
        "requiredLevel": 25,
        "sellPrice": 2450,
        "icon": "🛡️"
    },
    "shield_02a": {
        "id": "shield_02a",
        "name": "Khiên Giáp Tier 2.1",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 30.",
        "statBonus": {
            "phongThu": 140,
            "sinhLucToiDa": 530
        },
        "requiredLevel": 30,
        "sellPrice": 2900,
        "icon": "🛡️"
    },
    "shield_02b": {
        "id": "shield_02b",
        "name": "Khiên Giáp Tier 2.2",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 35.",
        "statBonus": {
            "phongThu": 160,
            "sinhLucToiDa": 605
        },
        "requiredLevel": 35,
        "sellPrice": 3350,
        "icon": "🛡️"
    },
    "shield_02c": {
        "id": "shield_02c",
        "name": "Khiên Giáp Tier 2.3",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 40.",
        "statBonus": {
            "phongThu": 180,
            "sinhLucToiDa": 680
        },
        "requiredLevel": 40,
        "sellPrice": 3800,
        "icon": "🛡️"
    },
    "shield_02d": {
        "id": "shield_02d",
        "name": "Khiên Giáp Tier 2.4",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 45.",
        "statBonus": {
            "phongThu": 200,
            "sinhLucToiDa": 755
        },
        "requiredLevel": 45,
        "sellPrice": 4250,
        "icon": "🛡️"
    },
    "shield_02e": {
        "id": "shield_02e",
        "name": "Khiên Giáp Tier 2.5",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 50.",
        "statBonus": {
            "phongThu": 220,
            "sinhLucToiDa": 830
        },
        "requiredLevel": 50,
        "sellPrice": 4700,
        "icon": "🛡️"
    },
    "shield_03a": {
        "id": "shield_03a",
        "name": "Khiên Giáp Tier 3.1",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 55.",
        "statBonus": {
            "phongThu": 240,
            "sinhLucToiDa": 905
        },
        "requiredLevel": 55,
        "sellPrice": 5150,
        "icon": "🛡️"
    },
    "shield_03b": {
        "id": "shield_03b",
        "name": "Khiên Giáp Tier 3.2",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 60.",
        "statBonus": {
            "phongThu": 260,
            "sinhLucToiDa": 980
        },
        "requiredLevel": 60,
        "sellPrice": 5600,
        "icon": "🛡️"
    },
    "shield_03c": {
        "id": "shield_03c",
        "name": "Khiên Giáp Tier 3.3",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 65.",
        "statBonus": {
            "phongThu": 280,
            "sinhLucToiDa": 1055
        },
        "requiredLevel": 65,
        "sellPrice": 6050,
        "icon": "🛡️"
    },
    "shield_03d": {
        "id": "shield_03d",
        "name": "Khiên Giáp Tier 3.4",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 70.",
        "statBonus": {
            "phongThu": 300,
            "sinhLucToiDa": 1130
        },
        "requiredLevel": 70,
        "sellPrice": 6500,
        "icon": "🛡️"
    },
    "shield_03e": {
        "id": "shield_03e",
        "name": "Khiên Giáp Tier 3.5",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 75.",
        "statBonus": {
            "phongThu": 320,
            "sinhLucToiDa": 1205
        },
        "requiredLevel": 75,
        "sellPrice": 6950,
        "icon": "🛡️"
    },
    "shield_04a": {
        "id": "shield_04a",
        "name": "Khiên Giáp Tier 4.1",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 80.",
        "statBonus": {
            "phongThu": 340,
            "sinhLucToiDa": 1280
        },
        "requiredLevel": 80,
        "sellPrice": 7400,
        "icon": "🛡️"
    },
    "shield_04b": {
        "id": "shield_04b",
        "name": "Khiên Giáp Tier 4.2",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 85.",
        "statBonus": {
            "phongThu": 360,
            "sinhLucToiDa": 1355
        },
        "requiredLevel": 85,
        "sellPrice": 7850,
        "icon": "🛡️"
    },
    "shield_04c": {
        "id": "shield_04c",
        "name": "Khiên Giáp Tier 4.3",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 90.",
        "statBonus": {
            "phongThu": 380,
            "sinhLucToiDa": 1430
        },
        "requiredLevel": 90,
        "sellPrice": 8300,
        "icon": "🛡️"
    },
    "shield_04d": {
        "id": "shield_04d",
        "name": "Khiên Giáp Tier 4.4",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 95.",
        "statBonus": {
            "phongThu": 400,
            "sinhLucToiDa": 1505
        },
        "requiredLevel": 95,
        "sellPrice": 8750,
        "icon": "🛡️"
    },
    "shield_04e": {
        "id": "shield_04e",
        "name": "Khiên Thánh Hoàng Gia ENDGAME",
        "type": "aogiap",
        "description": "Khiên giáp thép Kyrise Gothic cấp 100.",
        "statBonus": {
            "phongThu": 420,
            "sinhLucToiDa": 1580
        },
        "requiredLevel": 100,
        "sellPrice": 9200,
        "icon": "🛡️"
    },
    "helmet_01a": {
        "id": "helmet_01a",
        "name": "Mũ Kị Sĩ Tier 1.1",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 5.",
        "statBonus": {
            "phongThu": 27,
            "sinhLucToiDa": 100
        },
        "requiredLevel": 5,
        "sellPrice": 550,
        "icon": "🪖"
    },
    "helmet_01b": {
        "id": "helmet_01b",
        "name": "Mũ Kị Sĩ Tier 1.2",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 10.",
        "statBonus": {
            "phongThu": 42,
            "sinhLucToiDa": 150
        },
        "requiredLevel": 10,
        "sellPrice": 950,
        "icon": "🪖"
    },
    "helmet_01c": {
        "id": "helmet_01c",
        "name": "Mũ Kị Sĩ Tier 1.3",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 15.",
        "statBonus": {
            "phongThu": 57,
            "sinhLucToiDa": 200
        },
        "requiredLevel": 15,
        "sellPrice": 1350,
        "icon": "🪖"
    },
    "helmet_01d": {
        "id": "helmet_01d",
        "name": "Mũ Kị Sĩ Tier 1.4",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 20.",
        "statBonus": {
            "phongThu": 72,
            "sinhLucToiDa": 250
        },
        "requiredLevel": 20,
        "sellPrice": 1750,
        "icon": "🪖"
    },
    "helmet_01e": {
        "id": "helmet_01e",
        "name": "Mũ Kị Sĩ Tier 1.5",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 25.",
        "statBonus": {
            "phongThu": 87,
            "sinhLucToiDa": 300
        },
        "requiredLevel": 25,
        "sellPrice": 2150,
        "icon": "🪖"
    },
    "helmet_02a": {
        "id": "helmet_02a",
        "name": "Mũ Kị Sĩ Tier 2.1",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 35.",
        "statBonus": {
            "phongThu": 117,
            "sinhLucToiDa": 400
        },
        "requiredLevel": 35,
        "sellPrice": 2950,
        "icon": "🪖"
    },
    "helmet_02b": {
        "id": "helmet_02b",
        "name": "Mũ Kị Sĩ Tier 2.2",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 40.",
        "statBonus": {
            "phongThu": 132,
            "sinhLucToiDa": 450
        },
        "requiredLevel": 40,
        "sellPrice": 3350,
        "icon": "🪖"
    },
    "helmet_02c": {
        "id": "helmet_02c",
        "name": "Mũ Kị Sĩ Tier 2.3",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 45.",
        "statBonus": {
            "phongThu": 147,
            "sinhLucToiDa": 500
        },
        "requiredLevel": 45,
        "sellPrice": 3750,
        "icon": "🪖"
    },
    "helmet_02d": {
        "id": "helmet_02d",
        "name": "Mũ Kị Sĩ Tier 2.4",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 50.",
        "statBonus": {
            "phongThu": 162,
            "sinhLucToiDa": 550
        },
        "requiredLevel": 50,
        "sellPrice": 4150,
        "icon": "🪖"
    },
    "helmet_02e": {
        "id": "helmet_02e",
        "name": "Mũ Kị Sĩ Tier 2.5",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 55.",
        "statBonus": {
            "phongThu": 177,
            "sinhLucToiDa": 600
        },
        "requiredLevel": 55,
        "sellPrice": 4550,
        "icon": "🪖"
    },
    "helmet_03a": {
        "id": "helmet_03a",
        "name": "Mũ Kị Sĩ Tier 3.1",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 65.",
        "statBonus": {
            "phongThu": 207,
            "sinhLucToiDa": 700
        },
        "requiredLevel": 65,
        "sellPrice": 5350,
        "icon": "🪖"
    },
    "helmet_03b": {
        "id": "helmet_03b",
        "name": "Mũ Kị Sĩ Tier 3.2",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 70.",
        "statBonus": {
            "phongThu": 222,
            "sinhLucToiDa": 750
        },
        "requiredLevel": 70,
        "sellPrice": 5750,
        "icon": "🪖"
    },
    "helmet_03c": {
        "id": "helmet_03c",
        "name": "Mũ Kị Sĩ Tier 3.3",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 75.",
        "statBonus": {
            "phongThu": 237,
            "sinhLucToiDa": 800
        },
        "requiredLevel": 75,
        "sellPrice": 6150,
        "icon": "🪖"
    },
    "helmet_03d": {
        "id": "helmet_03d",
        "name": "Mũ Kị Sĩ Tier 3.4",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 80.",
        "statBonus": {
            "phongThu": 252,
            "sinhLucToiDa": 850
        },
        "requiredLevel": 80,
        "sellPrice": 6550,
        "icon": "🪖"
    },
    "helmet_03e": {
        "id": "helmet_03e",
        "name": "Mũ Kị Sĩ Tier 3.5",
        "type": "mu",
        "description": "Mũ chiến bảo vệ kị sĩ cấp 85.",
        "statBonus": {
            "phongThu": 267,
            "sinhLucToiDa": 900
        },
        "requiredLevel": 85,
        "sellPrice": 6950,
        "icon": "🪖"
    },
    "armor_01a": {
        "id": "armor_01a",
        "name": "Áo Giáp Thép Kị Sĩ Tier 1",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 5.",
        "statBonus": {
            "phongThu": 50,
            "sinhLucToiDa": 200
        },
        "requiredLevel": 5,
        "sellPrice": 900,
        "icon": "🛡️"
    },
    "armor_01b": {
        "id": "armor_01b",
        "name": "Áo Giáp Thép Tier 1.2",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 10.",
        "statBonus": {
            "phongThu": 75,
            "sinhLucToiDa": 300
        },
        "requiredLevel": 10,
        "sellPrice": 1500,
        "icon": "🛡️"
    },
    "armor_01c": {
        "id": "armor_01c",
        "name": "Áo Giáp Thép Tier 1.3",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 15.",
        "statBonus": {
            "phongThu": 100,
            "sinhLucToiDa": 400
        },
        "requiredLevel": 15,
        "sellPrice": 2100,
        "icon": "🛡️"
    },
    "armor_01d": {
        "id": "armor_01d",
        "name": "Áo Giáp Thép Tier 1.4",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 20.",
        "statBonus": {
            "phongThu": 125,
            "sinhLucToiDa": 500
        },
        "requiredLevel": 20,
        "sellPrice": 2700,
        "icon": "🛡️"
    },
    "armor_01e": {
        "id": "armor_01e",
        "name": "Áo Giáp Thép Tier 1.5",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 25.",
        "statBonus": {
            "phongThu": 150,
            "sinhLucToiDa": 600
        },
        "requiredLevel": 25,
        "sellPrice": 3300,
        "icon": "🛡️"
    },
    "armor_02a": {
        "id": "armor_02a",
        "name": "Áo Giáp Thép Tier 2.1",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 30.",
        "statBonus": {
            "phongThu": 175,
            "sinhLucToiDa": 700
        },
        "requiredLevel": 30,
        "sellPrice": 3900,
        "icon": "🛡️"
    },
    "armor_02b": {
        "id": "armor_02b",
        "name": "Áo Giáp Thép Tier 2.2",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 35.",
        "statBonus": {
            "phongThu": 200,
            "sinhLucToiDa": 800
        },
        "requiredLevel": 35,
        "sellPrice": 4500,
        "icon": "🛡️"
    },
    "armor_02c": {
        "id": "armor_02c",
        "name": "Áo Giáp Thép Tier 2.3",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 40.",
        "statBonus": {
            "phongThu": 225,
            "sinhLucToiDa": 900
        },
        "requiredLevel": 40,
        "sellPrice": 5100,
        "icon": "🛡️"
    },
    "armor_02d": {
        "id": "armor_02d",
        "name": "Áo Giáp Thép Tier 2.4",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 45.",
        "statBonus": {
            "phongThu": 250,
            "sinhLucToiDa": 1000
        },
        "requiredLevel": 45,
        "sellPrice": 5700,
        "icon": "🛡️"
    },
    "armor_02e": {
        "id": "armor_02e",
        "name": "Áo Giáp Thép Tier 2.5",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 50.",
        "statBonus": {
            "phongThu": 275,
            "sinhLucToiDa": 1100
        },
        "requiredLevel": 50,
        "sellPrice": 6300,
        "icon": "🛡️"
    },
    "armor_03a": {
        "id": "armor_03a",
        "name": "Áo Giáp Thép Tier 3.1",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 55.",
        "statBonus": {
            "phongThu": 300,
            "sinhLucToiDa": 1200
        },
        "requiredLevel": 55,
        "sellPrice": 6900,
        "icon": "🛡️"
    },
    "armor_03b": {
        "id": "armor_03b",
        "name": "Áo Giáp Thép Tier 3.2",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 60.",
        "statBonus": {
            "phongThu": 325,
            "sinhLucToiDa": 1300
        },
        "requiredLevel": 60,
        "sellPrice": 7500,
        "icon": "🛡️"
    },
    "armor_03c": {
        "id": "armor_03c",
        "name": "Áo Giáp Thép Tier 3.3",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 65.",
        "statBonus": {
            "phongThu": 350,
            "sinhLucToiDa": 1400
        },
        "requiredLevel": 65,
        "sellPrice": 8100,
        "icon": "🛡️"
    },
    "armor_03d": {
        "id": "armor_03d",
        "name": "Áo Giáp Thép Tier 3.4",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 70.",
        "statBonus": {
            "phongThu": 375,
            "sinhLucToiDa": 1500
        },
        "requiredLevel": 70,
        "sellPrice": 8700,
        "icon": "🛡️"
    },
    "armor_03e": {
        "id": "armor_03e",
        "name": "Áo Giáp Thép Tier 3.5",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 75.",
        "statBonus": {
            "phongThu": 400,
            "sinhLucToiDa": 1600
        },
        "requiredLevel": 75,
        "sellPrice": 9300,
        "icon": "🛡️"
    },
    "armor_04a": {
        "id": "armor_04a",
        "name": "Áo Giáp Thép Tier 4.1",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 80.",
        "statBonus": {
            "phongThu": 425,
            "sinhLucToiDa": 1700
        },
        "requiredLevel": 80,
        "sellPrice": 9900,
        "icon": "🛡️"
    },
    "armor_04b": {
        "id": "armor_04b",
        "name": "Áo Giáp Thép Tier 4.2",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 85.",
        "statBonus": {
            "phongThu": 450,
            "sinhLucToiDa": 1800
        },
        "requiredLevel": 85,
        "sellPrice": 10500,
        "icon": "🛡️"
    },
    "armor_04c": {
        "id": "armor_04c",
        "name": "Áo Giáp Thép Tier 4.3",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 90.",
        "statBonus": {
            "phongThu": 475,
            "sinhLucToiDa": 1900
        },
        "requiredLevel": 90,
        "sellPrice": 11100,
        "icon": "🛡️"
    },
    "armor_04d": {
        "id": "armor_04d",
        "name": "Áo Giáp Thép Tier 4.4",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 95.",
        "statBonus": {
            "phongThu": 500,
            "sinhLucToiDa": 2000
        },
        "requiredLevel": 95,
        "sellPrice": 11700,
        "icon": "🛡️"
    },
    "armor_04e": {
        "id": "armor_04e",
        "name": "Áo Giáp Thần Rồng ENDGAME",
        "type": "aogiap",
        "description": "Áo giáp thép Kyrise Gothic cấp 100.",
        "statBonus": {
            "phongThu": 525,
            "sinhLucToiDa": 2100
        },
        "requiredLevel": 100,
        "sellPrice": 12300,
        "icon": "🛡️"
    },
    "potion_01a": {
        "id": "potion_01a",
        "name": "Thuốc Hồi Máu HP Tier 1.1",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 50,
        "icon": "🧪"
    },
    "potion_01b": {
        "id": "potion_01b",
        "name": "Thuốc Hồi Máu HP Tier 1.2",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 70,
        "icon": "🧪"
    },
    "potion_01c": {
        "id": "potion_01c",
        "name": "Thuốc Hồi Máu HP Tier 1.3",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 90,
        "icon": "🧪"
    },
    "potion_01d": {
        "id": "potion_01d",
        "name": "Thuốc Hồi Máu HP Tier 1.4",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 110,
        "icon": "🧪"
    },
    "potion_01e": {
        "id": "potion_01e",
        "name": "Thuốc Hồi Máu HP Tier 1.5",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 130,
        "icon": "🧪"
    },
    "potion_02a": {
        "id": "potion_02a",
        "name": "Thuốc Hồi Mana MP Tier 2.1",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 100,
        "icon": "🧪"
    },
    "potion_02b": {
        "id": "potion_02b",
        "name": "Thuốc Hồi Mana MP Tier 2.2",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 120,
        "icon": "🧪"
    },
    "potion_02c": {
        "id": "potion_02c",
        "name": "Thuốc Hồi Mana MP Tier 2.3",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 140,
        "icon": "🧪"
    },
    "potion_02d": {
        "id": "potion_02d",
        "name": "Thuốc Hồi Mana MP Tier 2.4",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 160,
        "icon": "🧪"
    },
    "potion_02e": {
        "id": "potion_02e",
        "name": "Thuốc Hồi Mana MP Tier 2.5",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 180,
        "icon": "🧪"
    },
    "potion_03a": {
        "id": "potion_03a",
        "name": "Ma Dược Kích Rèn Tier 3.1",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 150,
        "icon": "🧪"
    },
    "potion_03b": {
        "id": "potion_03b",
        "name": "Ma Dược Kích Rèn Tier 3.2",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 170,
        "icon": "🧪"
    },
    "potion_03c": {
        "id": "potion_03c",
        "name": "Ma Dược Kích Rèn Tier 3.3",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 190,
        "icon": "🧪"
    },
    "potion_03d": {
        "id": "potion_03d",
        "name": "Ma Dược Kích Rèn Tier 3.4",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 210,
        "icon": "🧪"
    },
    "potion_03e": {
        "id": "potion_03e",
        "name": "Ma Dược Kích Rèn Tier 3.5",
        "type": "duoclieu",
        "description": "Dược liệu phép thuật Kyrise Gothic.",
        "sellPrice": 230,
        "icon": "🧪"
    },
    "ingot_01a": {
        "id": "ingot_01a",
        "name": "Thỏi Kim Loại Tier 1.1",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 100,
        "icon": "🧱"
    },
    "crystal_01a": {
        "id": "crystal_01a",
        "name": "Tinh Thạch Ma Thuật Tier 1.1",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 150,
        "icon": "🔮"
    },
    "gem_01a": {
        "id": "gem_01a",
        "name": "Hồng Ngọc Khảm Giáp Tier 1.1",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 200,
        "icon": "💎"
    },
    "ingot_01b": {
        "id": "ingot_01b",
        "name": "Thỏi Kim Loại Tier 1.2",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 150,
        "icon": "🧱"
    },
    "crystal_01b": {
        "id": "crystal_01b",
        "name": "Tinh Thạch Ma Thuật Tier 1.2",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 210,
        "icon": "🔮"
    },
    "gem_01b": {
        "id": "gem_01b",
        "name": "Hồng Ngọc Khảm Giáp Tier 1.2",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 280,
        "icon": "💎"
    },
    "ingot_01c": {
        "id": "ingot_01c",
        "name": "Thỏi Kim Loại Tier 1.3",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 200,
        "icon": "🧱"
    },
    "crystal_01c": {
        "id": "crystal_01c",
        "name": "Tinh Thạch Ma Thuật Tier 1.3",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 270,
        "icon": "🔮"
    },
    "gem_01c": {
        "id": "gem_01c",
        "name": "Hồng Ngọc Khảm Giáp Tier 1.3",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 360,
        "icon": "💎"
    },
    "ingot_01d": {
        "id": "ingot_01d",
        "name": "Thỏi Kim Loại Tier 1.4",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 250,
        "icon": "🧱"
    },
    "crystal_01d": {
        "id": "crystal_01d",
        "name": "Tinh Thạch Ma Thuật Tier 1.4",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 330,
        "icon": "🔮"
    },
    "gem_01d": {
        "id": "gem_01d",
        "name": "Hồng Ngọc Khảm Giáp Tier 1.4",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 440,
        "icon": "💎"
    },
    "ingot_01e": {
        "id": "ingot_01e",
        "name": "Thỏi Kim Loại Tier 1.5",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 300,
        "icon": "🧱"
    },
    "crystal_01e": {
        "id": "crystal_01e",
        "name": "Tinh Thạch Ma Thuật Tier 1.5",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 390,
        "icon": "🔮"
    },
    "gem_01e": {
        "id": "gem_01e",
        "name": "Hồng Ngọc Khảm Giáp Tier 1.5",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 520,
        "icon": "💎"
    },
    "ingot_02a": {
        "id": "ingot_02a",
        "name": "Thỏi Kim Loại Tier 2.1",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 200,
        "icon": "🧱"
    },
    "crystal_02a": {
        "id": "crystal_02a",
        "name": "Tinh Thạch Ma Thuật Tier 2.1",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 300,
        "icon": "🔮"
    },
    "gem_02a": {
        "id": "gem_02a",
        "name": "Hồng Ngọc Khảm Giáp Tier 2.1",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 400,
        "icon": "💎"
    },
    "ingot_02b": {
        "id": "ingot_02b",
        "name": "Thỏi Kim Loại Tier 2.2",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 250,
        "icon": "🧱"
    },
    "crystal_02b": {
        "id": "crystal_02b",
        "name": "Tinh Thạch Ma Thuật Tier 2.2",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 360,
        "icon": "🔮"
    },
    "gem_02b": {
        "id": "gem_02b",
        "name": "Hồng Ngọc Khảm Giáp Tier 2.2",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 480,
        "icon": "💎"
    },
    "ingot_02c": {
        "id": "ingot_02c",
        "name": "Thỏi Kim Loại Tier 2.3",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 300,
        "icon": "🧱"
    },
    "crystal_02c": {
        "id": "crystal_02c",
        "name": "Tinh Thạch Ma Thuật Tier 2.3",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 420,
        "icon": "🔮"
    },
    "gem_02c": {
        "id": "gem_02c",
        "name": "Hồng Ngọc Khảm Giáp Tier 2.3",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 560,
        "icon": "💎"
    },
    "ingot_02d": {
        "id": "ingot_02d",
        "name": "Thỏi Kim Loại Tier 2.4",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 350,
        "icon": "🧱"
    },
    "crystal_02d": {
        "id": "crystal_02d",
        "name": "Tinh Thạch Ma Thuật Tier 2.4",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 480,
        "icon": "🔮"
    },
    "gem_02d": {
        "id": "gem_02d",
        "name": "Hồng Ngọc Khảm Giáp Tier 2.4",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 640,
        "icon": "💎"
    },
    "ingot_02e": {
        "id": "ingot_02e",
        "name": "Thỏi Kim Loại Tier 2.5",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 400,
        "icon": "🧱"
    },
    "crystal_02e": {
        "id": "crystal_02e",
        "name": "Tinh Thạch Ma Thuật Tier 2.5",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 540,
        "icon": "🔮"
    },
    "gem_02e": {
        "id": "gem_02e",
        "name": "Hồng Ngọc Khảm Giáp Tier 2.5",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 720,
        "icon": "💎"
    },
    "ingot_03a": {
        "id": "ingot_03a",
        "name": "Thỏi Kim Loại Tier 3.1",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 300,
        "icon": "🧱"
    },
    "crystal_03a": {
        "id": "crystal_03a",
        "name": "Tinh Thạch Ma Thuật Tier 3.1",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 450,
        "icon": "🔮"
    },
    "gem_03a": {
        "id": "gem_03a",
        "name": "Hồng Ngọc Khảm Giáp Tier 3.1",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 600,
        "icon": "💎"
    },
    "ingot_03b": {
        "id": "ingot_03b",
        "name": "Thỏi Kim Loại Tier 3.2",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 350,
        "icon": "🧱"
    },
    "crystal_03b": {
        "id": "crystal_03b",
        "name": "Tinh Thạch Ma Thuật Tier 3.2",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 510,
        "icon": "🔮"
    },
    "gem_03b": {
        "id": "gem_03b",
        "name": "Hồng Ngọc Khảm Giáp Tier 3.2",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 680,
        "icon": "💎"
    },
    "ingot_03c": {
        "id": "ingot_03c",
        "name": "Thỏi Kim Loại Tier 3.3",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 400,
        "icon": "🧱"
    },
    "crystal_03c": {
        "id": "crystal_03c",
        "name": "Tinh Thạch Ma Thuật Tier 3.3",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 570,
        "icon": "🔮"
    },
    "gem_03c": {
        "id": "gem_03c",
        "name": "Hồng Ngọc Khảm Giáp Tier 3.3",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 760,
        "icon": "💎"
    },
    "ingot_03d": {
        "id": "ingot_03d",
        "name": "Thỏi Kim Loại Tier 3.4",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 450,
        "icon": "🧱"
    },
    "crystal_03d": {
        "id": "crystal_03d",
        "name": "Tinh Thạch Ma Thuật Tier 3.4",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 630,
        "icon": "🔮"
    },
    "gem_03d": {
        "id": "gem_03d",
        "name": "Hồng Ngọc Khảm Giáp Tier 3.4",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 840,
        "icon": "💎"
    },
    "ingot_03e": {
        "id": "ingot_03e",
        "name": "Thỏi Kim Loại Tier 3.5",
        "type": "nguyenlieu",
        "description": "Thỏi kim loại rèn đồ Kyrise.",
        "sellPrice": 500,
        "icon": "🧱"
    },
    "crystal_03e": {
        "id": "crystal_03e",
        "name": "Tinh Thạch Ma Thuật Tier 3.5",
        "type": "nguyenlieu",
        "description": "Tinh thạch ma thuật Kyrise.",
        "sellPrice": 690,
        "icon": "🔮"
    },
    "gem_03e": {
        "id": "gem_03e",
        "name": "Hồng Ngọc Khảm Giáp Tier 3.5",
        "type": "ngoc",
        "description": "Viên ngọc quý dùng khảm nạm.",
        "sellPrice": 920,
        "icon": "💎"
    },
    "wood_01a": {
        "id": "wood_01a",
        "name": "Gỗ Sồi Cổ Tier 1.1",
        "type": "nguyenlieu",
        "description": "Gỗ chế tác.",
        "sellPrice": 50,
        "icon": "🪵"
    },
    "arrow_01a": {
        "id": "arrow_01a",
        "name": "Mũi Tên Độc Tier 1.1",
        "type": "nguyenlieu",
        "description": "Tên bắn cung.",
        "sellPrice": 30,
        "icon": "🏹"
    },
    "key_01a": {
        "id": "key_01a",
        "name": "Chìa Khóa Ngục Tối Tier 1.1",
        "type": "nguyenlieu",
        "description": "Chìa khóa ngục.",
        "sellPrice": 300,
        "icon": "🗝️"
    },
    "gift_01a": {
        "id": "gift_01a",
        "name": "Rương Báu Thượng Cổ Tier 1.1",
        "type": "ruong",
        "description": "Rương báu chứa đồ.",
        "sellPrice": 800,
        "icon": "🧰"
    },
    "wood_01b": {
        "id": "wood_01b",
        "name": "Gỗ Sồi Cổ Tier 1.2",
        "type": "nguyenlieu",
        "description": "Gỗ chế tác.",
        "sellPrice": 70,
        "icon": "🪵"
    },
    "arrow_01b": {
        "id": "arrow_01b",
        "name": "Mũi Tên Độc Tier 1.2",
        "type": "nguyenlieu",
        "description": "Tên bắn cung.",
        "sellPrice": 40,
        "icon": "🏹"
    },
    "key_01b": {
        "id": "key_01b",
        "name": "Chìa Khóa Ngục Tối Tier 1.2",
        "type": "nguyenlieu",
        "description": "Chìa khóa ngục.",
        "sellPrice": 400,
        "icon": "🗝️"
    },
    "gift_01b": {
        "id": "gift_01b",
        "name": "Rương Báu Thượng Cổ Tier 1.2",
        "type": "ruong",
        "description": "Rương báu chứa đồ.",
        "sellPrice": 1000,
        "icon": "🧰"
    },
    "wood_01c": {
        "id": "wood_01c",
        "name": "Gỗ Sồi Cổ Tier 1.3",
        "type": "nguyenlieu",
        "description": "Gỗ chế tác.",
        "sellPrice": 90,
        "icon": "🪵"
    },
    "arrow_01c": {
        "id": "arrow_01c",
        "name": "Mũi Tên Độc Tier 1.3",
        "type": "nguyenlieu",
        "description": "Tên bắn cung.",
        "sellPrice": 50,
        "icon": "🏹"
    },
    "key_01c": {
        "id": "key_01c",
        "name": "Chìa Khóa Ngục Tối Tier 1.3",
        "type": "nguyenlieu",
        "description": "Chìa khóa ngục.",
        "sellPrice": 500,
        "icon": "🗝️"
    },
    "gift_01c": {
        "id": "gift_01c",
        "name": "Rương Báu Thượng Cổ Tier 1.3",
        "type": "ruong",
        "description": "Rương báu chứa đồ.",
        "sellPrice": 1200,
        "icon": "🧰"
    },
    "wood_01d": {
        "id": "wood_01d",
        "name": "Gỗ Sồi Cổ Tier 1.4",
        "type": "nguyenlieu",
        "description": "Gỗ chế tác.",
        "sellPrice": 110,
        "icon": "🪵"
    },
    "arrow_01d": {
        "id": "arrow_01d",
        "name": "Mũi Tên Độc Tier 1.4",
        "type": "nguyenlieu",
        "description": "Tên bắn cung.",
        "sellPrice": 60,
        "icon": "🏹"
    },
    "key_01d": {
        "id": "key_01d",
        "name": "Chìa Khóa Ngục Tối Tier 1.4",
        "type": "nguyenlieu",
        "description": "Chìa khóa ngục.",
        "sellPrice": 600,
        "icon": "🗝️"
    },
    "gift_01d": {
        "id": "gift_01d",
        "name": "Rương Báu Thượng Cổ Tier 1.4",
        "type": "ruong",
        "description": "Rương báu chứa đồ.",
        "sellPrice": 1400,
        "icon": "🧰"
    },
    "wood_01e": {
        "id": "wood_01e",
        "name": "Gỗ Sồi Cổ Tier 1.5",
        "type": "nguyenlieu",
        "description": "Gỗ chế tác.",
        "sellPrice": 130,
        "icon": "🪵"
    },
    "arrow_01e": {
        "id": "arrow_01e",
        "name": "Mũi Tên Độc Tier 1.5",
        "type": "nguyenlieu",
        "description": "Tên bắn cung.",
        "sellPrice": 70,
        "icon": "🏹"
    },
    "key_01e": {
        "id": "key_01e",
        "name": "Chìa Khóa Ngục Tối Tier 1.5",
        "type": "nguyenlieu",
        "description": "Chìa khóa ngục.",
        "sellPrice": 700,
        "icon": "🗝️"
    },
    "gift_01e": {
        "id": "gift_01e",
        "name": "Rương Báu Thượng Cổ Tier 1.5",
        "type": "ruong",
        "description": "Rương báu chứa đồ.",
        "sellPrice": 1600,
        "icon": "🧰"
    },
    "scroll_reset_job": {
        "id": "scroll_reset_job",
        "name": "📜 Sách Xóa Nghề Trung Cổ",
        "type": "tinh_nang",
        "description": "Xóa bỏ ngay 24h chờ đổi nghề.",
        "sellPrice": 25000,
        "icon": "📜"
    },
    "giftopen_01f": {
        "id": "giftopen_01f",
        "name": "Rương Vô Địch Rồng ENDGAME",
        "type": "ruong",
        "description": "Rương báu chứa Thần Kiếm Excalibur.",
        "sellPrice": 20000,
        "icon": "🎁"
    },
    "coin_01a": {
        "id": "coin_01a",
        "name": "Tiền Vàng Cổ Trung Cổ",
        "type": "nguyenlieu",
        "description": "Vàng.",
        "sellPrice": 10,
        "icon": "🪙"
    },
    "fish_01a": {
        "id": "fish_01a",
        "name": "Cá Đầm Lầy Gothic",
        "type": "duoclieu",
        "description": "Cá nướng.",
        "sellPrice": 30,
        "icon": "🐟"
    }
};
