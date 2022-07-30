import {Blacklist, IPCResponse, LunarAPIResponse} from "./externalapis/RunApi";
import {Components, getBedwarsLevelInfo, getHighLevelPrestigeColour, getPlayerRank} from "@common/zikeji";
import {BoomzaAntisniper, KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {PlayerDB} from "@common/utils/externalapis/PlayerDB";
import destr from "destr";
import {MetricsObject, TagArray, TagObject} from "@common/utils/Schemas";
import {RUNElectronStoreTagsTyped} from "@main/appWindow";
import jsonLogic from "json-logic-js";

export interface Player {
    name: string;
    id: string | null;
    nicked: boolean | null;
    bot: boolean | null;
    denicked: boolean | null;
    hypixelPlayer: Components.Schemas.Player | null;
    hypixelGuild: Components.Schemas.Guild | null;
    sources: {
        runApi: IPCResponse<Blacklist> | null;
        boomza?: IPCResponse<BoomzaAntisniper> | null;
        keathiz?: IPCResponse<KeathizOverlayRun> | null;
        lunar?: IPCResponse<LunarAPIResponse> | null;
        playerDb?: IPCResponse<PlayerDB> | null;
    };
}

export class PlayerUtils {
    private readonly formatPlayerInstance: FormatPlayer;
    private readonly playerHypixelUtils: PlayerHypixelUtils;

    constructor(stores?: {config: object; tags: object}) {
        this.formatPlayerInstance = new FormatPlayer();
        this.playerHypixelUtils = new PlayerHypixelUtils();
        if (stores != undefined) {
            this.formatPlayerInstance.setConfig(stores);
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

    public renderTags = (player: Player) => {
        let tagRenderer: string = this.starterDivider;
        if (player.sources.runApi != null) {
            const runApi = player.sources.runApi.data.data;
            if (runApi.blacklist.tagged) {
                tagRenderer += this.getPlayerTagDivider("BLACKLISTED", "red", player);
            } else if (runApi.bot.tagged) {
                tagRenderer += this.getPlayerTagDivider("BOT", "green", player);
            } else {
                if (player.sources.boomza?.status === 200) {
                    const boomza = destr(player.sources.boomza.data);
                    if (boomza.sniper) {
                        tagRenderer += this.getPlayerTagDivider("S", "red");
                    }
                    if (boomza.report) {
                        tagRenderer += this.getPlayerTagDivider("H", "red");
                    }
                }
                if (runApi.safelist.tagged) {
                    tagRenderer += this.getTagsFromConfig("run.safelist", runApi.safelist.timesKilled);
                }
                if (runApi.safelist.personal) {
                    tagRenderer += this.getTagsFromConfig("run.personal_safelist");
                }
                if (runApi.annoylist.tagged) {
                    tagRenderer += this.getTagsFromConfig("run.annoylist");
                }
                if (runApi.statistics.encounters != 0) {
                    tagRenderer += this.getTagsFromConfig("run.encounters", runApi.statistics.encounters);
                }
                if (this.renderNameChangeTag(player) <= 10) {
                    tagRenderer += this.getTagsFromConfig("run.name_change");
                }
                if (player.hypixelPlayer?.channel == "PARTY") {
                    tagRenderer += this.getTagsFromConfig("hypixel.party");
                }
                if (player.sources.keathiz != null && this.configStore.settings.keathiz) {
                    tagRenderer += this.renderKeathizTags(player);
                }
            }
        } else {
            tagRenderer = this.getPlayerTagDivider("NICKED", "red");
        }
        tagRenderer += `</span>`;
        return tagRenderer;
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

    public renderStar = (player: Player) => {
        let starRenderer: string = this.starterDivider;
        if (!player.nicked && player.hypixelPlayer !== null) {
            const bwLevel = getBedwarsLevelInfo(player.hypixelPlayer);
            if (!player.sources.runApi?.data.data.blacklist.tagged) {
                if (bwLevel.level < 1000) starRenderer += this.getPlayerTagDivider(`[${bwLevel.level}✫]`, "#" + bwLevel.prestigeColourHex);
                else starRenderer += getHighLevelPrestigeColour(bwLevel);
            } else {
                starRenderer = this.getPlayerTagDivider(bwLevel.level ?? 0, "#" + this.tagStore.run.blacklist.colour);
            }
        } else {
            starRenderer += this.getPlayerTagDividerNicked();
        }
        starRenderer += `</span>`;
        return starRenderer;
    };

    public renderPlayerHead = (player: Player) => {
        let renderer = this.starterDivider;
        if (!player.nicked) {
            renderer += `<span class="inline flex">`;
            renderer += `<img src="https://crafatar.com/avatars/${player.hypixelPlayer?.uuid}?size=16&overlay=true" class="text-center" alt=""/>`;
            if (this.configStore.settings.lunar) {
                if (player.sources.lunar !== undefined && player.sources.lunar !== null && player.sources.lunar.status == 200) {
                    if (player.sources.lunar.data.player.online) {
                        renderer += `<span>`;
                        renderer += `<img width="18px" height="18px" src="https://img.icons8.com/nolan/512/ffffff/lunar-client.png" alt="lunar tag" />`;
                        renderer += `</span>`;
                    }
                }
            }
            renderer += `</span>`;
        }
        renderer += `</span>`;
        return renderer;
    };

    public renderName = (player: Player) => {
        let nameRenderer = this.starterDivider;
        if (!player.nicked) {
            nameRenderer += `<span class="justify-content-start">`;
            if (!player.sources.runApi?.data.data.blacklist.tagged) {
                if (player.hypixelPlayer !== null) {
                    const rank = getPlayerRank(player.hypixelPlayer, false);
                    nameRenderer += `${rank.rankHtml}&nbsp <span style="color: #${rank.colourHex};">${player.hypixelPlayer.displayname}</span>`;
                    if (player.denicked) {
                        nameRenderer += `<span style="color:darkred;"> (D) </span>`;
                    }
                } else {
                    nameRenderer += ``;
                }
            } else {
                nameRenderer = this.getPlayerTagDivider(player.hypixelPlayer?.displayname ?? "Unknown", "#" + this.tagStore.run.blacklist.colour);
            }
            nameRenderer += `</span>`;
        } else {
            nameRenderer = this.getPlayerTagDivider(player.name ?? "Unknown", "#" + this.tagStore.run.blacklist.colour);
        }
        nameRenderer += `</span>`;
        return nameRenderer;
    };

    public renderWinstreak = (player: Player) => {
        let renderer: string = this.starterDivider;
        if (!player.nicked) {
            let playerValue = player.hypixelPlayer?.stats.Bedwars?.winstreak ?? 0;
            if (player.sources.keathiz != null && this.configStore.settings.keathiz) {
                const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
                if (keathizTags.player?.winstreak != null && keathizTags.player?.winstreak?.accurate == false) {
                    playerValue = keathizTags.player.winstreak.estimates.overall_winstreak;
                }
            }
            if (player.sources.runApi?.data.data.blacklist.tagged) {
                renderer += this.getTagsFromConfig("run.blacklist", playerValue);
            } else {
                renderer += this.getCoreFromConfig(`core.winstreak`, playerValue);
            }
        } else {
            renderer += this.getPlayerTagDividerNicked();
        }
        renderer += `</span>`;
        return renderer;
    };

    public renderRatioColour = (player: Player, route: "wlr" | "bblr" | "kdr" | "fkdr") => {
        let renderer = this.starterDivider;
        let playerValue;
        if (!player.nicked) {
            switch (route) {
                case "wlr":
                    playerValue = (player.hypixelPlayer?.stats.Bedwars?.wins_bedwars ?? 0) / (player.hypixelPlayer?.stats.Bedwars?.losses_bedwars ?? 1);
                    break;
                case "bblr":
                    playerValue = (player.hypixelPlayer?.stats.Bedwars?.beds_broken_bedwars ?? 0) / (player.hypixelPlayer?.stats.Bedwars?.beds_lost_bedwars ?? 1);
                    break;
                case "kdr":
                    playerValue = (player.hypixelPlayer?.stats.Bedwars?.kills_bedwars ?? 0) / (player.hypixelPlayer?.stats.Bedwars?.deaths_bedwars ?? 1);
                    break;
                case "fkdr":
                    playerValue = (player.hypixelPlayer?.stats.Bedwars?.final_kills_bedwars ?? 0) / (player.hypixelPlayer?.stats.Bedwars?.final_deaths_bedwars ?? 1);
                    break;
            }

            if (player.sources.runApi?.data.data.blacklist.tagged) {
                renderer += this.getTagsFromConfig("run.blacklist", playerValue);
            } else {
                renderer += this.getCoreFromConfig(`core.${route}`, playerValue);
            }
        } else {
            renderer += this.getPlayerTagDividerNicked();
        }
        renderer += `</span>`;
        return renderer;
    };

    public renderCoreStatsColour = (player: Player, route: "wins" | "losses" | "finalKills" | "finalDeaths" | "bedsBroken" | "bedsLost" | "kills" | "deaths" | "gamesPlayed", mode?: "overall" | "solos" | "duos" | "threes" | "fours") => {
        let renderer = this.starterDivider;
        let playerValue;
        if (!player.nicked) {
            let modeObj = "";
            if (mode != undefined) {
                switch (mode) {
                    case "solos":
                        modeObj = "eight_one_";
                        break;
                    case "duos":
                        modeObj = "eight_two_";
                        break;
                    case "threes":
                        modeObj = "four_three_";
                        break;
                    case "fours":
                        modeObj = "four_four_";
                        break;
                }
            }

            switch (route) {
                case "wins":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "wins_bedwars"] ?? 0;
                    break;
                case "losses":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "losses_bedwars"] ?? 0;
                    break;
                case "finalKills":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "final_kills_bedwars"] ?? 0;
                    break;
                case "finalDeaths":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "final_deaths_bedwars"] ?? 0;
                    break;
                case "bedsBroken":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "beds_broken_bedwars"] ?? 0;
                    break;
                case "bedsLost":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "beds_lost_bedwars"] ?? 0;
                    break;
                case "kills":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "kills_bedwars"] ?? 0;
                    break;
                case "deaths":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "deaths_bedwars"] ?? 0;
                    break;
                default:
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.[modeObj + "games_played_bedwars"] ?? 0;
            }
            if (player.sources.runApi?.data.data.blacklist.tagged) {
                renderer += this.getPlayerTagDivider(playerValue, "red", player);
            } else if (playerValue <= 1000) {
                renderer += this.getPlayerTagDivider(playerValue, "gray", player);
            } else if (playerValue <= 2000) {
                renderer += this.getPlayerTagDivider(playerValue, "gray", player);
            } else if (playerValue <= 4000) {
                renderer += this.getPlayerTagDivider(playerValue, "white", player);
            } else if (playerValue <= 6000) {
                renderer += this.getPlayerTagDivider(playerValue, "goldenrod", player);
            } else if (playerValue <= 7000) {
                renderer += this.getPlayerTagDivider(playerValue, "darkgreen", player);
            } else if (playerValue <= 10000) {
                renderer += this.getPlayerTagDivider(playerValue, "red", player);
            } else if (playerValue <= 15000) {
                renderer += this.getPlayerTagDivider(playerValue, "darkred", player);
            } else if (playerValue <= 50000) {
                renderer += this.getPlayerTagDivider(playerValue, "deeppink", player);
            } else {
                renderer += this.getPlayerTagDivider(playerValue, "purple", player);
            }
        } else {
            renderer += this.getPlayerTagDividerNicked();
        }
        renderer += `</span>`;
        return renderer;
    };

    public renderKeathizTags = (player: Player) => {
        let renderer = `<span style="padding-left: 5px;">`;
        const keathizTagArray: Array<string> = [];
        if (player.sources.keathiz === null || player.sources.keathiz === undefined) {
            keathizTagArray.push(this.getPlayerTagDivider("ERROR", `#${MinecraftColours.DARK_RED.hex}`));
        } else {
            if (player?.sources?.keathiz?.data?.success && player?.sources?.keathiz?.status === 200) {
                const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
                if (keathizTags.player.exits.last_10_min >= 1) {
                    keathizTagArray.push(this.getPlayerTagDivider("E10", `#${MinecraftColours.GOLD.hex}`));
                }
                if (keathizTags.player.queues.total == 0) {
                    keathizTagArray.push(this.getPlayerTagDivider("ND", `#${MinecraftColours.GOLD.hex}`));
                }
                if (keathizTags.player.queues.last_3_min >= 1) {
                    const count = keathizTags.player.queues.last_3_min;
                    keathizTagArray.push(this.getPlayerTagDivider(`Q3-${count}`, `#${MinecraftColours.GOLD.hex}`));
                }
                if (keathizTags.player.queues.last_10_min >= 3) {
                    const count = keathizTags.player.queues.last_10_min;
                    keathizTagArray.push(this.getPlayerTagDivider(`Q10-${count}`, `#${MinecraftColours.GOLD.hex}`));
                }
                if (keathizTags.player.queues.last_30_min >= 6) {
                    const count = keathizTags.player.queues.last_30_min;
                    keathizTagArray.push(this.getPlayerTagDivider(`Q30-${count}`, `#${MinecraftColours.GOLD.hex}`));
                }
                if (keathizTags.player.queues.last_24_hours >= 75) {
                    keathizTagArray.push(this.getPlayerTagDivider("Q24", `#${MinecraftColours.GOLD.hex}`));
                }
                if (keathizTags.player.queues.consecutive_queue_checks.weighted["1_min_requeue"] >= 50) {
                    keathizTagArray.push(this.getPlayerTagDivider("Z", `#${MinecraftColours.RED.hex}`));
                }
                if (keathizTags.player.queues.consecutive_queue_checks.last_30_queues["1_min_requeue"] >= 15 ?? keathizTags.player.queues.consecutive_queue_checks.last_10_queues["1_min_requeue"] >= 5 ?? keathizTags.player.queues.consecutive_queue_checks.last_10_queues["2_min_requeue"] >= 6 ?? keathizTags.player.queues.consecutive_queue_checks.last_10_queues["3_min_requeue"] >= 8) {
                    keathizTagArray.push(this.getPlayerTagDivider("C", `#${MinecraftColours.RED.hex}`));
                }
            } else {
                if (this.configStore.settings.keathiz) keathizTagArray.push(this.getPlayerTagDivider("FAILED", `#${MinecraftColours.DARK_RED.hex}`));
            }
        }
        for (const tag of keathizTagArray) {
            renderer += tag;
        }
        renderer += `</span>`;
        return renderer;
    };

    private renderNameChangeTag = (player: Player) => {
        const unknownData = 11;
        if (player.sources.playerDb !== undefined && player.sources.playerDb !== null) {
            if (player.sources.playerDb.status === 200) {
                if (player.sources.playerDb.data.data.player.meta ?? false) {
                    const nameHistory = player.sources.playerDb.data.data.player.meta.name_history;
                    const nameChangeDates: Array<number> = [];
                    if (nameHistory.length != 1) {
                        for (const item of nameHistory) {
                            if (item.changedToAt !== undefined) {
                                const changedTo = item?.changedToAt;
                                if (changedTo !== undefined) nameChangeDates.push(changedTo);
                            }
                        }
                        nameChangeDates.sort();
                        const timeNow = Date.now();
                        const nameBefore = new Date(nameChangeDates[nameChangeDates.length - 1]);
                        const diffInMs = Math.abs(timeNow - nameBefore.getTime());
                        return diffInMs / (1000 * 60 * 60 * 24);
                    }
                    return unknownData;
                }
                console.log(player.name + " has no name history or failed the NOT NULL check");
                return unknownData;
            }
            // TODO Add handling for 500 / too many requests
            return unknownData;
        } else return unknownData;
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

    private getPlayerTagDividerNicked = () => {
        const styleString = `color: red; padding-left: 1px;`;
        let htmlResponse = `<div>`;
        htmlResponse += `<div style="${styleString}">?</div>`;
        htmlResponse += `</span>`;
        return htmlResponse;
    };

    public renderSessionTime = (player: Player) => {
        const values: [string, string][] = [];
        if (player.hypixelPlayer != null) {
            if (player.hypixelPlayer.lastLogin == null || player.hypixelPlayer.lastLogout == null) {
                values.push(["N/A", "ff0000"]);
            } else {
                const lastLoginDate: Date = new Date(0);
                lastLoginDate.setUTCMilliseconds(player.hypixelPlayer.lastLogin);
                const now_timezoned: Date = new Date();
                const now = new Date();
                now.setUTCMilliseconds(now_timezoned.getUTCMilliseconds());

                if (player.hypixelPlayer.lastLogin > player.hypixelPlayer.lastLogout) {
                    const timeDiff = new Date(now_timezoned.getTime() - lastLoginDate.getTime());
                    if ((timeDiff.getUTCHours() >= 3 && timeDiff.getUTCMinutes() >= 30) || timeDiff.getUTCHours() > 4) {
                        values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "00ff00"]);
                    } else if ((timeDiff.getUTCHours() >= 1 && timeDiff.getUTCMinutes() >= 30) || timeDiff.getUTCHours() > 2) {
                        values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "ffff00"]);
                    } else {
                        values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "ff0000"]);
                    }
                } else {
                    values.push(["Offline", "ff0000"]);
                }
            }
            let str = ``;
            for (const value of values) {
                str += `<span style="color: #${value[1]}">${value[0]}</span>`;
            }
            return `<span>${str}</span>`;
        }
        return `<span/>`;
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
                format = d.getDay().toLocaleString().padStart(2, "0");
                if (options.month ?? options.year) format += ".";
            }
            if (options.month) {
                const month = d.getMonth() + 1;
                const monthFormatted = month.toLocaleString().padStart(2, "0");
                format += monthFormatted;
                if (options.year) format += ".";
            }
            if (options.year) format = format + d.getFullYear().toLocaleString().replace(",", "").replace(".", "");
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
