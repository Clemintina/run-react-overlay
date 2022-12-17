import { Components } from "../types/api";
import { MinecraftColourAsHex, MinecraftFormatting } from "@common/zikeji";

/** @internal */
export enum PlayerRanks {
	NON_DONOR = 1,
	VIP = 2,
	VIP_PLUS = 3,
	MVP = 4,
	MVP_PLUS = 5,
	SUPERSTAR = 6,
	YOUTUBER = 60,
	JR_HELPER = 70,
	HELPER = 80,
	MODERATOR = 90,
	ADMIN = 100,
}

/**
 * Describes the results from the {@link getPlayerRank} helper.
 */
export interface PlayerRank {
	/**
	 * The priority of this rank as it relates to other ranks.
	 */
	priority: number;
	/**
	 * Name of the rank as it appears in the data.
	 */
	name: string;
	/**
	 * Cleaned up version of the name.
	 */
	cleanName: string;
	/**
	 * The chat prefix with Minecraft formatting codes.
	 */
	prefix: string;
	/**
	 * The chat prefix _without_ Minecraft formatting codes.
	 */
	cleanPrefix: string;
	/**
	 * The Minecraft formatting Colour code of this rank.
	 */
	colourCode: MinecraftFormatting;
	/**
	 * The hex value of the Colour code.
	 */
	colourHex: MinecraftColourAsHex;
	/**
	 * If they have a custom Colour for their rank.
	 * **Note:** this can be set when the player isn't MVP++. If you want to use this value, be sure to check if the rank is SUPERSTAR (MVP++).
	 */
	customRankColour?: MinecraftFormatting;
	/**
	 * Same as customRankColour, but the hex version of the Colour.
	 */
	customRankColourHex?: MinecraftColourAsHex;
	/**
	 * If they have a custom Colour for the pluses in their rank (++).
	 * **Note:** this can be set when the player isn't MVP++. If you want to use this value, be sure to check if the rank is SUPERSTAR (MVP++).
	 */
	customPlusColour?: MinecraftFormatting;
	/**
	 * Same as customPlusColour, but the hex version of the Colour.
	 */
	customPlusColourHex?: MinecraftColourAsHex;
	/**
	 * Whether or not this is a staff only rank.
	 */
	staff: boolean;
	/**
	 * Formatted name in HTML
	 */
	rankHtml: string;
}

/**
 * Get a {@link PlayerRank} object describing the player's rank in more detail without the need to figure out how to parse it yourself.
 * @param player The result of `client.player.uuid()`.
 * @param onlyPackages Whether to ignore their staff / youtube rank and only get their donor rank.
 * @category Helper
 */
export const getPlayerRank = (player: NonNullable<Components.Schemas.Player>, onlyPackages = false): PlayerRank => {
	let foundRank: PlayerRanks = PlayerRanks.NON_DONOR;
	if (onlyPackages) {
		if (player.monthlyPackageRank) {
			const rank = PlayerRanks[player.monthlyPackageRank as keyof typeof PlayerRanks];
			if (rank) {
				foundRank = rank;
			}
		}
		if (player.newPackageRank) {
			const rank = PlayerRanks[player.newPackageRank as keyof typeof PlayerRanks];
			if (rank && rank > foundRank) {
				foundRank = rank;
			}
		}
		if (player.packageRank) {
			const rank = PlayerRanks[player.packageRank as keyof typeof PlayerRanks];
			if (rank && rank > foundRank) {
				foundRank = rank;
			}
		}
	} else if (typeof player.rank !== "undefined" && player.rank !== "NORMAL") {
		const rank = PlayerRanks[player.rank as keyof typeof PlayerRanks];
		if (rank) {
			foundRank = rank;
		} else {
			return getPlayerRank(player, true);
		}
	} else {
		return getPlayerRank(player, true);
	}
	let out: PlayerRank;
	switch (foundRank) {
		case PlayerRanks.VIP:
			out = {
				priority: foundRank,
				name: "VIP",
				cleanName: "VIP",
				prefix: "§a[VIP]",
				cleanPrefix: "[VIP]",
				colourCode: MinecraftFormatting.GREEN,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.GREEN],
				staff: false,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.GREEN]}">[VIP]</span>`,
			};
			break;
		case PlayerRanks.VIP_PLUS:
			out = {
				priority: foundRank,
				name: "VIP_PLUS",
				cleanName: "VIP+",
				prefix: "§a[VIP§6+§a]",
				cleanPrefix: "[VIP+]",
				colourCode: MinecraftFormatting.GREEN,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.GREEN],
				staff: false,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.GREEN]}">[VIP<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.GOLD]}">+</span><span style="color: #${MinecraftColourAsHex[MinecraftFormatting.GREEN]}">]</span></span>`,
			};
			break;
		case PlayerRanks.MVP:
			out = {
				priority: foundRank,
				name: "MVP",
				cleanName: "MVP",
				prefix: "§b[MVP]",
				cleanPrefix: "[MVP]",
				colourCode: MinecraftFormatting.AQUA,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.AQUA],
				staff: false,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.AQUA]}">[MVP]</span>`,
			};
			break;
		case PlayerRanks.MVP_PLUS:
			out = {
				priority: foundRank,
				name: "MVP_PLUS",
				cleanName: "MVP+",
				prefix: "§b[MVP§c+§b]",
				cleanPrefix: "[MVP+]",
				colourCode: MinecraftFormatting.AQUA,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.AQUA],
				staff: false,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.AQUA]}">[MVP<span style="color: #${MinecraftColourAsHex[MinecraftFormatting[player.rankPlusColor != undefined ? player.rankPlusColor : "RED"]]}">+</span><span style="color: #${MinecraftColourAsHex[MinecraftFormatting.AQUA]};">]</span></span>`,
			};
			break;
		case PlayerRanks.SUPERSTAR:
			out = {
				priority: foundRank,
				name: "SUPERSTAR",
				cleanName: "MVP++",
				prefix: "§6[MVP§c++§6]",
				cleanPrefix: "[MVP++]",
				colourCode: MinecraftFormatting.GOLD,
				colourHex: MinecraftColourAsHex[MinecraftFormatting[player.monthlyRankColor != undefined ? player.monthlyRankColor : "GOLD"]],
				staff: false,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting[player.monthlyRankColor != undefined ? player.monthlyRankColor : "GOLD"]]}">[MVP<span style="color: #${MinecraftColourAsHex[MinecraftFormatting[player.rankPlusColor != undefined ? player.rankPlusColor : "RED"]]}">++</span><span style="color: #${
					MinecraftColourAsHex[MinecraftFormatting[player.monthlyRankColor != undefined ? player.monthlyRankColor : "GOLD"]]
				};">]</span></span>`,
			};
			break;
		case PlayerRanks.YOUTUBER:
			out = {
				priority: foundRank,
				name: "YOUTUBER",
				cleanName: "YOUTUBER",
				prefix: "§c[§fYOUTUBE§c]",
				cleanPrefix: "[YOUTUBE]",
				colourCode: MinecraftFormatting.RED,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.RED],
				staff: false,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.RED]}">[<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.WHITE]}">YOUTUBE</span><span style="color: #${MinecraftColourAsHex[MinecraftFormatting.RED]};">]</span></span>`,
			};
			break;
		case PlayerRanks.JR_HELPER:
			out = {
				priority: foundRank,
				name: "JR_HELPER",
				cleanName: "JR HELPER",
				prefix: "§9[JR HELPER]",
				cleanPrefix: "[JR HELPER]",
				colourCode: MinecraftFormatting.BLUE,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.BLUE],
				staff: true,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.BLUE]}">[JR HELPER]</span></span>`,
			};
			break;
		case PlayerRanks.HELPER:
			out = {
				priority: foundRank,
				name: "HELPER",
				cleanName: "HELPER",
				prefix: "§9[HELPER]",
				cleanPrefix: "[HELPER]",
				colourCode: MinecraftFormatting.BLUE,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.BLUE],
				staff: true,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.BLUE]}">[JR HELPER]</span></span>`,
			};
			break;
		case PlayerRanks.MODERATOR:
			out = {
				priority: foundRank,
				name: "MODERATOR",
				cleanName: "MODERATOR",
				prefix: "§2[MOD]",
				cleanPrefix: "[MOD]",
				colourCode: MinecraftFormatting.DARK_GREEN,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.DARK_GREEN],
				staff: true,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.GREEN]}">[MOD]</span>`,
			};
			break;
		case PlayerRanks.ADMIN:
			out = {
				priority: foundRank,
				name: "ADMIN",
				cleanName: "ADMIN",
				prefix: "§c[ADMIN]",
				cleanPrefix: "[ADMIN]",
				colourCode: MinecraftFormatting.RED,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.RED],
				staff: true,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.RED]}">[ADMIN]</span>`,
			};
			break;
		default:
			out = {
				priority: foundRank,
				name: "NON_DONOR",
				cleanName: "DEFAULT",
				prefix: "§7",
				cleanPrefix: "",
				colourCode: MinecraftFormatting.GRAY,
				colourHex: MinecraftColourAsHex[MinecraftFormatting.GRAY],
				staff: false,
				rankHtml: `<span style="color: #${MinecraftColourAsHex[MinecraftFormatting.GRAY]}"></span>`,
			};
			break;
	}
	if (player.monthlyRankColor || player.rankPlusColor) {
		const customRankColour = MinecraftFormatting[player.monthlyRankColor as keyof typeof MinecraftFormatting];
		const customPlusColour = MinecraftFormatting[player.rankPlusColor as keyof typeof MinecraftFormatting];
		if (customRankColour) {
			out.customRankColour = customRankColour;
			out.customRankColourHex = MinecraftColourAsHex[customRankColour as keyof typeof MinecraftColourAsHex];
		}
		if (customPlusColour) {
			out.customPlusColour = customPlusColour;
			out.customPlusColourHex = MinecraftColourAsHex[customPlusColour as keyof typeof MinecraftColourAsHex];
		}
		if (out.priority === PlayerRanks.SUPERSTAR) {
			out.prefix = `${customRankColour ?? "§6"}[MVP${customPlusColour ?? "§c"}++${customRankColour ?? "§6"}]`;
		}
	}
	return out;
};
