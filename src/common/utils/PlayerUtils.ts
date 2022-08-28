import {Blacklist, IPCResponse, LunarAPIResponse} from "./externalapis/RunApi";
import {Components} from "@common/zikeji";
import {BoomzaAntisniper, KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {PlayerDB} from "@common/utils/externalapis/PlayerDB";
import {MetricsObject, TagArray, TagObject} from "@common/utils/Schemas";
import {RUNElectronStoreTagsTyped} from "@main/appWindow";
import jsonLogic from "json-logic-js";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import useTagStore from "@renderer/store/zustand/TagStore";

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
    private readonly formatPlayerInstance: FormatPlayer;
    private readonly playerHypixelUtils: PlayerHypixelUtils;

    constructor(stores?: {config: object; tags: object}) {
        this.formatPlayerInstance = new FormatPlayer();
        this.playerHypixelUtils = new PlayerHypixelUtils();
        if (stores != undefined) {
            this.formatPlayerInstance.setConfig(stores);
        } else {
            this.formatPlayerInstance.setConfig({config: useConfigStore.getState(), tags: useTagStore.getState()});
        }
    }

    public getFormatPlayerInstance() {
        return this.formatPlayerInstance;
    }

    public getPlayerHypixelUtils() {
        return this.playerHypixelUtils;
    }
}

export class FormatPlayer {
    private isOverlayStats = false;
    private starterDivider = `<span class="${this.isOverlayStats ? "flex" : ""} text-left">`;
    private tagStore;
    private configStore;

    public setConfig = (stores: {config: object; tags: object}, options?: {subMenu?: boolean}) => {
        this.tagStore = stores.tags;
        this.configStore = stores.config;
        this.isOverlayStats = options?.subMenu ?? false;
    };

    public getTagsFromConfig = (tagDisplayPath: RUNElectronStoreTagsTyped | string, value?: number) => {
        const tag: TagObject | undefined = tagDisplayPath.split(".").reduce((o, i) => o[i], this.tagStore);
        const tagDisplayIcon: string | undefined = tag?.display ?? "?";
        const tagArray: string | Array<TagArray> | undefined = tag?.colour ?? "FF5555";
        if (tagDisplayPath == "run.blacklist") {
            return this.getPlayerTagDivider(value, `#${tagArray}`);
        } else if (Array.isArray(tagArray) && value != undefined) {
            const tempArray = [...tagArray];
            const arr = tempArray.sort((a, b) => b.requirement - a.requirement);
            for (const {colour, requirement} of arr) {
                if (value >= requirement) {
                    return this.getPlayerTagDivider(tagDisplayIcon, `#${colour}`);
                }
            }
        } else {
            return this.getPlayerTagDivider(tagDisplayIcon, `#${tagArray?.toString()}`);
        }
        return this.getPlayerTagDivider(tagDisplayIcon, "amber");
    };

    public getCoreFromConfig = (tagDisplayPath: RUNElectronStoreTagsTyped | string, value: number) => {
        try {
            const coreMetric: MetricsObject | undefined = tagDisplayPath.split(".").reduce((o, i) => o[i], this.tagStore) ?? 0;
            const coreArray = coreMetric?.colours ?? "FF5555";

            if (!isFinite(value)) value = ~~Number((((0 - 18) / 0) * 100).toFixed(2));

            if (Array.isArray(coreArray) && value != undefined) {
                const tempArray = [...coreArray];
                const arr = tempArray.sort((a, b) => a.requirement - b.requirement);
                for (const {colour, requirement, operator} of arr) {
                    if (jsonLogic.apply({[operator]: [value, requirement]})) {
                        return this.getPlayerTagDivider(value, `#${colour}`);
                    }
                }
                return this.getPlayerTagDivider(value, `#555555`);
            } else {
                return this.getPlayerTagDivider(value, `#${coreArray}`);
            }
        } catch (e) {
            return this.getPlayerTagDivider(tagDisplayPath, "FF5555");
        }
    };

    private getPlayerTagDivider = (tag: string | number | unknown, colour: string, player?: Player) => {
        let htmlResponse = ``,
            styleString = `color: ${colour};`,
            classNameData = ``;
        if (typeof tag === "number" && !Number.isInteger(tag) && tag != 0) tag = tag.toFixed(2);
        if (colour === "white") {
            styleString += `opacity: 75%;`;
        }
        if (player?.sources.runApi?.data.data.blacklist.tagged) {
            styleString += `font-bold`;
        }
        if (tag !== undefined) {
            if (typeof tag === "string") {
                if (tag.length == 1) {
                    // Makes tags have spaces
                    classNameData += `pl-1 `;
                }
            } else if (typeof tag === "number") {
                classNameData += `justify-center w-full`;
                if (this.isOverlayStats) classNameData += ` flex`;
            }
            htmlResponse += `<span class="${classNameData}" style="${styleString}">${tag}</span>`;
            return htmlResponse;
        }
        return htmlResponse;
    };
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
