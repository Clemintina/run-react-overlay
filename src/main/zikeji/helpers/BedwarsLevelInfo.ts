/**
 * This portion of code was ported from the [hypixel-php](https://github.com/Plancke/hypixel-php) library.
 *
 * Copyright (c) 2020 Zikeji
 * Copyright (c) 2017 Aäron Plancke
 *
 * For the original full copyright and license information, please view the LICENSE-HYPIXEL-PHP.md that was distributed with this source code.
 */

import { Components } from "../types/api";
import { MinecraftColourAsHex, MinecraftFormatting } from "@main/zikeji";

/** @internal */
enum BEDWARS_LEVEL_CONSTANTS {
	EL = 4,
	XPP = 96 * 5000 + 7000,
	LPP = 100,
	HP = 10,
}

/**
 * Describes the results of the {@link getBedwarsLevelInfo} helper.
 */
export interface BedwarsLevelInfo {
	level: number;
	prestige: number;
	prestigeName: string;
	prestigeColour: string;
	prestigeColourHex: string;
	levelInCurrentPrestige: number;
}

/**
 * Calculates the BedWars prestige and level of a player and returns a {@link BedwarsLevelInfo} interface.
 * @category Helper
 */
export const getBedwarsLevelInfo = (data: Components.Schemas.Player | number): BedwarsLevelInfo => {
	const currentExp = typeof data === "number" ? data : data.stats?.Bedwars?.Experience ?? data.stats?.Bedwars?.Experience_new ?? 0;
	if (typeof currentExp !== "number" || Number.isNaN(currentExp)) {
		const prestigeColour = MinecraftFormatting.GRAY;
		return {
			level: 0,
			prestige: 0,
			prestigeName: "None",
			prestigeColour,
			prestigeColourHex: MinecraftColourAsHex[prestigeColour],
			levelInCurrentPrestige: 0,
		};
	}
	const prestiges = Math.floor(currentExp / BEDWARS_LEVEL_CONSTANTS.XPP);
	let level = prestiges * BEDWARS_LEVEL_CONSTANTS.LPP;
	let expWithoutPrestiges = currentExp - prestiges * BEDWARS_LEVEL_CONSTANTS.XPP;
	for (let i = 1; i <= BEDWARS_LEVEL_CONSTANTS.EL; i += 1) {
		let elExp = 500;
		const rL = i % BEDWARS_LEVEL_CONSTANTS.LPP;
		for (let ii = 0; ii < rL; ii += 1) {
			elExp += ii * 500;
		}
		if (expWithoutPrestiges < elExp) {
			break;
		}
		level += 1;
		expWithoutPrestiges -= elExp;
	}
	level += Math.floor(expWithoutPrestiges / 5000);
	let prestige = Math.floor(level / BEDWARS_LEVEL_CONSTANTS.LPP);
	if (prestige > BEDWARS_LEVEL_CONSTANTS.HP) {
		prestige = BEDWARS_LEVEL_CONSTANTS.HP;
	}
	let prestigeName = "None";
	let prestigeColour = MinecraftFormatting.GRAY;
	switch (prestige) {
		case 1:
			prestigeName = "Iron";
			prestigeColour = MinecraftFormatting.WHITE;
			break;
		case 2:
			prestigeName = "Gold";
			prestigeColour = MinecraftFormatting.GOLD;
			break;
		case 3:
			prestigeName = "Diamond";
			prestigeColour = MinecraftFormatting.AQUA;
			break;
		case 4:
			prestigeName = "Emerald";
			prestigeColour = MinecraftFormatting.DARK_GREEN;
			break;
		case 5:
			prestigeName = "Sapphire";
			prestigeColour = MinecraftFormatting.DARK_AQUA;
			break;
		case 6:
			prestigeName = "Ruby";
			prestigeColour = MinecraftFormatting.DARK_RED;
			break;
		case 7:
			prestigeName = "Crystal";
			prestigeColour = MinecraftFormatting.LIGHT_PURPLE;
			break;
		case 8:
			prestigeName = "Opal";
			prestigeColour = MinecraftFormatting.BLUE;
			break;
		case 9:
			prestigeName = "Amethyst";
			prestigeColour = MinecraftFormatting.DARK_PURPLE;
			break;
		case 10:
			prestigeName = "Rainbow";
			prestigeColour = MinecraftFormatting.WHITE;
			break;
		default:
		// noop
	}
	const levelInCurrentPrestige = level - prestige * BEDWARS_LEVEL_CONSTANTS.LPP;
	return {
		level,
		prestige,
		prestigeName,
		prestigeColour,
		prestigeColourHex: MinecraftColourAsHex[prestigeColour],
		levelInCurrentPrestige,
	};
};

export interface BedwarsPrestigeFormats {
	prestige: number;
	format: [MinecraftFormatting, MinecraftFormatting, MinecraftFormatting, MinecraftFormatting];
	bracketColour: {
		beginning: MinecraftFormatting;
		end: MinecraftFormatting;
		star?: MinecraftFormatting;
	};
}

export const getHighLevelPrestigeColour = (data: BedwarsLevelInfo) => {
	const colourFormat: Array<BedwarsPrestigeFormats> = getColourFormats();
	const level = data.level;
	let starIcon = "✫";
	if (level >= 1100 && level < 2100) starIcon = "✪";
	if (level >= 2100) starIcon = "❀";
	if (level >= 1000) {
		for (const { format, bracketColour, prestige } of colourFormat) {
			if (prestige <= level) {
				const levelSplit: Array<number> = Array.from(level.toString()).map(Number);
				let html = `<span style="color: #${MinecraftColourAsHex[bracketColour.beginning]}">[</span>`;
				for (let i = 0; i < levelSplit.length; i++) {
					html += `<span style="color: #${MinecraftColourAsHex[format[i]]}">${levelSplit[i]}</span>`;
				}
				if (bracketColour.star != undefined) html += `<span style="color: #${MinecraftColourAsHex[bracketColour.star]}">${starIcon}</span>`;
				else html += `<span style="color: #${MinecraftColourAsHex[format[3]]}">${starIcon}</span>`;
				html += `<span style="color: #${MinecraftColourAsHex[bracketColour.end]}">]</span>`;
				return html;
			}
		}
	}
	return "";
};

const getColourFormats = () => {
	const colourFormat: Array<BedwarsPrestigeFormats> = [];
	colourFormat.push({
		prestige: 1000,
		format: [MinecraftFormatting.GOLD, MinecraftFormatting.YELLOW, MinecraftFormatting.GREEN, MinecraftFormatting.AQUA],
		bracketColour: {
			beginning: MinecraftFormatting.RED,
			end: MinecraftFormatting.DARK_PURPLE,
			star: MinecraftFormatting.LIGHT_PURPLE,
		},
	});
	colourFormat.push({
		prestige: 1100,
		format: [MinecraftFormatting.WHITE, MinecraftFormatting.WHITE, MinecraftFormatting.WHITE, MinecraftFormatting.WHITE],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.DARK_GRAY,
		},
	});
	colourFormat.push({
		prestige: 1200,
		format: [MinecraftFormatting.YELLOW, MinecraftFormatting.YELLOW, MinecraftFormatting.YELLOW, MinecraftFormatting.YELLOW],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.GOLD,
		},
	});
	colourFormat.push({
		prestige: 1300,
		format: [MinecraftFormatting.AQUA, MinecraftFormatting.AQUA, MinecraftFormatting.AQUA, MinecraftFormatting.AQUA],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.DARK_AQUA,
		},
	});
	colourFormat.push({
		prestige: 1400,
		format: [MinecraftFormatting.DARK_GREEN, MinecraftFormatting.DARK_GREEN, MinecraftFormatting.DARK_GREEN, MinecraftFormatting.DARK_GREEN],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.DARK_GREEN,
		},
	});
	colourFormat.push({
		prestige: 1500,
		format: [MinecraftFormatting.DARK_AQUA, MinecraftFormatting.DARK_AQUA, MinecraftFormatting.DARK_AQUA, MinecraftFormatting.DARK_AQUA],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.BLUE,
		},
	});
	colourFormat.push({
		prestige: 1600,
		format: [MinecraftFormatting.DARK_RED, MinecraftFormatting.DARK_RED, MinecraftFormatting.DARK_RED, MinecraftFormatting.DARK_RED],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.DARK_RED,
		},
	});
	colourFormat.push({
		prestige: 1700,
		format: [MinecraftFormatting.LIGHT_PURPLE, MinecraftFormatting.LIGHT_PURPLE, MinecraftFormatting.LIGHT_PURPLE, MinecraftFormatting.LIGHT_PURPLE],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.DARK_PURPLE,
		},
	});
	colourFormat.push({
		prestige: 1800,
		format: [MinecraftFormatting.BLUE, MinecraftFormatting.BLUE, MinecraftFormatting.BLUE, MinecraftFormatting.BLUE],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.DARK_GRAY,
		},
	});
	colourFormat.push({
		prestige: 1900,
		format: [MinecraftFormatting.DARK_PURPLE, MinecraftFormatting.DARK_PURPLE, MinecraftFormatting.DARK_PURPLE, MinecraftFormatting.DARK_PURPLE],
		bracketColour: {
			beginning: MinecraftFormatting.GRAY,
			end: MinecraftFormatting.GRAY,
			star: MinecraftFormatting.DARK_GRAY,
		},
	});

	colourFormat.push({
		prestige: 2000,
		format: [MinecraftFormatting.GRAY, MinecraftFormatting.WHITE, MinecraftFormatting.WHITE, MinecraftFormatting.GRAY],
		bracketColour: {
			beginning: MinecraftFormatting.DARK_GRAY,
			end: MinecraftFormatting.DARK_GRAY,
			star: MinecraftFormatting.DARK_GRAY,
		},
	});
	colourFormat.push({
		prestige: 2100,
		format: [MinecraftFormatting.WHITE, MinecraftFormatting.YELLOW, MinecraftFormatting.YELLOW, MinecraftFormatting.GOLD],
		bracketColour: {
			beginning: MinecraftFormatting.WHITE,
			end: MinecraftFormatting.GOLD,
			star: MinecraftFormatting.GOLD,
		},
	});
	colourFormat.push({
		prestige: 2200,
		format: [MinecraftFormatting.GOLD, MinecraftFormatting.WHITE, MinecraftFormatting.WHITE, MinecraftFormatting.AQUA],
		bracketColour: {
			beginning: MinecraftFormatting.GOLD,
			end: MinecraftFormatting.DARK_AQUA,
			star: MinecraftFormatting.DARK_AQUA,
		},
	});
	colourFormat.push({
		prestige: 2300,
		format: [MinecraftFormatting.DARK_PURPLE, MinecraftFormatting.LIGHT_PURPLE, MinecraftFormatting.LIGHT_PURPLE, MinecraftFormatting.GOLD],
		bracketColour: {
			beginning: MinecraftFormatting.DARK_PURPLE,
			end: MinecraftFormatting.YELLOW,
			star: MinecraftFormatting.YELLOW,
		},
	});
	colourFormat.push({
		prestige: 2400,
		format: [MinecraftFormatting.AQUA, MinecraftFormatting.WHITE, MinecraftFormatting.WHITE, MinecraftFormatting.GRAY],
		bracketColour: {
			beginning: MinecraftFormatting.AQUA,
			end: MinecraftFormatting.DARK_GRAY,
			star: MinecraftFormatting.DARK_GRAY,
		},
	});
	colourFormat.push({
		prestige: 2500,
		format: [MinecraftFormatting.WHITE, MinecraftFormatting.GREEN, MinecraftFormatting.GREEN, MinecraftFormatting.DARK_GREEN],
		bracketColour: {
			beginning: MinecraftFormatting.WHITE,
			end: MinecraftFormatting.DARK_GREEN,
			star: MinecraftFormatting.DARK_GREEN,
		},
	});
	colourFormat.push({
		prestige: 2600,
		format: [MinecraftFormatting.DARK_RED, MinecraftFormatting.RED, MinecraftFormatting.RED, MinecraftFormatting.LIGHT_PURPLE],
		bracketColour: {
			beginning: MinecraftFormatting.DARK_RED,
			end: MinecraftFormatting.DARK_PURPLE,
			star: MinecraftFormatting.LIGHT_PURPLE,
		},
	});
	colourFormat.push({
		prestige: 2700,
		format: [MinecraftFormatting.YELLOW, MinecraftFormatting.WHITE, MinecraftFormatting.WHITE, MinecraftFormatting.DARK_GRAY],
		bracketColour: {
			beginning: MinecraftFormatting.YELLOW,
			end: MinecraftFormatting.DARK_GRAY,
			star: MinecraftFormatting.DARK_GRAY,
		},
	});
	colourFormat.push({
		prestige: 2800,
		format: [MinecraftFormatting.GREEN, MinecraftFormatting.DARK_GREEN, MinecraftFormatting.DARK_GREEN, MinecraftFormatting.GOLD],
		bracketColour: {
			beginning: MinecraftFormatting.GREEN,
			end: MinecraftFormatting.YELLOW,
			star: MinecraftFormatting.GOLD,
		},
	});
	colourFormat.push({
		prestige: 2900,
		format: [MinecraftFormatting.AQUA, MinecraftFormatting.DARK_AQUA, MinecraftFormatting.DARK_AQUA, MinecraftFormatting.BLUE],
		bracketColour: {
			beginning: MinecraftFormatting.AQUA,
			end: MinecraftFormatting.BLUE,
			star: MinecraftFormatting.BLUE,
		},
	});

	colourFormat.push({
		prestige: 3000,
		format: [MinecraftFormatting.YELLOW, MinecraftFormatting.GOLD, MinecraftFormatting.GOLD, MinecraftFormatting.RED],
		bracketColour: {
			beginning: MinecraftFormatting.YELLOW,
			end: MinecraftFormatting.DARK_RED,
			star: MinecraftFormatting.DARK_RED,
		},
	});

	return colourFormat.sort((a: BedwarsPrestigeFormats, b: BedwarsPrestigeFormats) => b.prestige - a.prestige);
};
