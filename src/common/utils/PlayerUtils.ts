import {Blacklist, IPCResponse, LunarAPIResponse} from "./externalapis/RunApi";
import {Components} from "@common/zikeji";
import {BoomzaAntisniper, KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {PlayerDB} from "@common/utils/externalapis/PlayerDB";

export type Player = {
    name: string;
    id: string | null;
    nick?: string;
    nicked: boolean | null;
    bot: boolean | null;
    friended: boolean | null;
    denicked: boolean | null;
    hypixelPlayer: Components.Schemas.Player | null;
    hypixelGuild: Components.Schemas.Guild | null;
    hypixelFriends: IPCResponse<{_id: string; uuidSender: string; uuidReceiver: string; started: number}[]> | null;
    hypixelFriendsMutuals?: Array<string> | null;
    sources: {
        runApi: IPCResponse<Blacklist> | null;
        boomza?: IPCResponse<BoomzaAntisniper> | null;
        keathiz?: IPCResponse<KeathizOverlayRun> | null;
        lunar?: IPCResponse<LunarAPIResponse> | null;
        playerDb?: IPCResponse<PlayerDB> | null;
    };
};

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
    public getDateFormatted = (epoch: number | undefined, options?: {day: boolean; month: boolean; year: boolean} | undefined) => {
        if (epoch === undefined) return "Disabled";
        const d = new Date(0);
        d.setUTCMilliseconds(epoch);

        if (options != undefined) {
            let format = "";
            if (options.day) {
                format = d.getUTCDate().toLocaleString().padStart(2, "0");
                if (options.month ?? options.year) format += ".";
            }
            if (options.month) {
                const month = d.getUTCMonth() + 1;
                const monthFormatted = month.toLocaleString().padStart(2, "0");
                format += monthFormatted;
                if (options.year) format += ".";
            }
            if (options.year) format = format + d.getUTCFullYear().toLocaleString().replace(",", "").replace(".", "");
            return format.replaceAll(" ", "");
        } else {
            return d.toLocaleDateString();
        }
    };
}

export interface MinecraftColoursImpl {
    [colour: string]: {colour: string; hex: string};
}

export const MinecraftColours: MinecraftColoursImpl = {
    BLACK: {colour: "§0", hex: "000000"},
    DARK_BLUE: {colour: "§1", hex: "0000AA"},
    DARK_GREEN: {colour: "§2", hex: "00AA00"},
    DARK_AQUA: {colour: "§3", hex: "00AAAA"},
    DARK_RED: {colour: "§4", hex: "AA0000"},
    DARK_PURPLE: {colour: "§5", hex: "AA00AA"},
    GOLD: {colour: "§6", hex: "FFAA00"},
    GRAY: {colour: "§7", hex: "AAAAAA"},
    DARK_GRAY: {colour: "§7", hex: "AAAAAA"},
    GREY: {colour: "§8", hex: "555555"},
    DARK_GREY: {colour: "§8", hex: "555555"},
    BLUE: {colour: "§9", hex: "5555FF"},
    GREEN: {colour: "§a", hex: "55FF55"},
    AQUA: {colour: "§b", hex: "55FFFF"},
    CYAN: {colour: "§b", hex: "55FFFF"},
    RED: {colour: "§c", hex: "FF5555"},
    LIGHT_PURPLE: {colour: "§d", hex: "FF55FF"},
    YELLOW: {colour: "§e", hex: "FFFF55"},
    WHITE: {colour: "§f", hex: "FFFFFF"},
};
