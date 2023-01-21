import { IPCResponse } from "./externalapis/RunApi";
import { Components } from "@common/zikeji";
import { BoomzaAntisniper, KeathizOverlayRun } from "@common/utils/externalapis/BoomzaApi";
import { PlayerDB } from "@common/utils/externalapis/PlayerDB";
import { CustomFileJsonType } from "@common/utils/Schemas";
import { Session } from "@clemintina/seraph-library/lib/PolsuTypes";
import { Blacklist, LunarAPIResponse, SeraphResponse } from "@clemintina/seraph-library/lib/SeraphTypes";

export type Player = {
	name: string;
} & (
	| {
	id: string | null;
	bot: boolean | null;
	loaded: boolean;
	friended: boolean | null;
	denicked: boolean | null;
	nicked: false;
	last_updated: number;
	hypixelPlayer: Components.Schemas.Player;
	hypixelGuild: IPCResponse<Components.Schemas.Guild> | null;
	hypixelFriends: IPCResponse<{ _id: string; uuidSender: string; uuidReceiver: string; started: number }[]> | null;
	hypixelFriendsMutuals?: Array<string> | null;
	sources: {
		runApi: Blacklist | null;
		boomza?: IPCResponse<BoomzaAntisniper> | null;
		keathiz?: IPCResponse<KeathizOverlayRun> | null;
		lunar?: LunarAPIResponse | null;
		polsu?: {
			sessions?: IPCResponse<Session>;
				};
				playerDb?: IPCResponse<PlayerDB> | null;
				customFile?: CustomFileJsonType;
				customApi?: CustomFileJsonType;
			};
	  }
	| {
			nicked: true;
			last_nick_encountered: number
	  }
);

export class PlayerUtils {
	private readonly playerHypixelUtils: PlayerHypixelUtils;

	constructor() {
		this.playerHypixelUtils = new PlayerHypixelUtils();
	}

	public getPlayerHypixelUtils() {
		return this.playerHypixelUtils;
	}
}

export class PlayerHypixelUtils {
	public getDateFormatted = (epoch: number | undefined, locale?: Intl.LocalesArgument | undefined, options?: Intl.DateTimeFormatOptions | undefined) => {
		if (epoch === undefined || epoch === 0) return "N/A";
		const d = new Date(0);
		d.setUTCMilliseconds(epoch);
		return d.toLocaleString(locale ?? "en-GB", options ?? { hour12: false });
	};
}

export interface MinecraftColoursImpl {
	[colour: string]: { colour: string; hex: string };
}

export const MinecraftColours: MinecraftColoursImpl = {
	BLACK: { colour: "§0", hex: "000000" },
	DARK_BLUE: { colour: "§1", hex: "0000AA" },
	DARK_GREEN: { colour: "§2", hex: "00AA00" },
	DARK_AQUA: { colour: "§3", hex: "00AAAA" },
	DARK_RED: { colour: "§4", hex: "AA0000" },
	DARK_PURPLE: { colour: "§5", hex: "AA00AA" },
	GOLD: { colour: "§6", hex: "FFAA00" },
	GRAY: { colour: "§7", hex: "AAAAAA" },
	DARK_GRAY: { colour: "§7", hex: "AAAAAA" },
	GREY: { colour: "§8", hex: "555555" },
	DARK_GREY: { colour: "§8", hex: "555555" },
	BLUE: { colour: "§9", hex: "5555FF" },
	GREEN: { colour: "§a", hex: "55FF55" },
	AQUA: { colour: "§b", hex: "55FFFF" },
	CYAN: { colour: "§b", hex: "55FFFF" },
	RED: { colour: "§c", hex: "FF5555" },
	LIGHT_PURPLE: { colour: "§d", hex: "FF55FF" },
	YELLOW: { colour: "§e", hex: "FFFF55" },
	WHITE: { colour: "§f", hex: "FFFFFF" },
};
