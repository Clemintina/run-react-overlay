/**
 * This portion of code was ported from the [hypixel-php](https://github.com/Plancke/hypixel-php) library.
 *
 * Copyright (c) 2020 Zikeji
 * Copyright (c) 2017 Aäron Plancke
 *
 * For the original full copyright and license information, please view the LICENSE-HYPIXEL-PHP.md that was distributed with this source code.
 */

import {Components} from "../types/api";
import {MinecraftColourAsHex, MinecraftFormatting} from "@common/zikeji";

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
    const currentExp = typeof data === "number" ? data : data.stats.Bedwars?.Experience ?? data.stats.Bedwars?.Experience_new;
    if (typeof currentExp !== "number" || Number.isNaN(currentExp)) {
        throw new TypeError("Data supplied does not contain player Bedwars experience.");
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
