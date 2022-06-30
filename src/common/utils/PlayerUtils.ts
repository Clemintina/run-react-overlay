import {Blacklist, IPCResponse, LunarAPIResponse} from "./externalapis/RunApi";
import {Components, getBedwarsLevelInfo, getPlayerRank} from "@common/zikeji";
import {BoomzaAntisniper, KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {PlayerDB} from "@common/utils/externalapis/PlayerDB";
import destr from "destr";

export interface Player {
    name: string;
    id: string | null;
    nicked: boolean | null;
    bot: boolean | null;
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

    constructor() {
        this.formatPlayerInstance = new FormatPlayer();
        this.playerHypixelUtils = new PlayerHypixelUtils();
    }

    public getFormatPlayerInstance() {
        return this.formatPlayerInstance;
    }

    public getPlayerHypixelUtils() {
        return this.playerHypixelUtils;
    }
}

export class FormatPlayer {
    private starterDivider = `<div style='margin: 0 auto;  display: flex;'>`;
    private utils = new PlayerHypixelUtils();

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
                if (runApi.migrated.tagged) {
                    tagRenderer += this.getPlayerTagDivider("M", "green");
                }
                if (runApi.safelist.tagged) {
                    tagRenderer += this.getPlayerTagDivider("✓", "green");
                }
                if (runApi.annoylist.tagged) {
                    tagRenderer += this.getPlayerTagDivider("A", "red");
                }
                if (runApi.statistics.encounters != 0) {
                    tagRenderer += this.getPlayerTagDivider(`E`, "red");
                }

                if (this.renderNameChangeTag(player) <= 10) {
                    tagRenderer += this.getPlayerTagDivider("NC", "#FF55FF");
                }

                if (player.sources.keathiz != null) {
                    tagRenderer += this.renderKeathizTags(player);
                }
            }
        } else {
            tagRenderer = this.getPlayerTagDivider("NICKED", "red");
        }
        tagRenderer += `</div>`;
        return tagRenderer;
    };

    public renderStar = (player: Player) => {
        let starRenderer: string = this.starterDivider;
        if (!player.nicked && player.hypixelPlayer !== null) {
            const bwLevel = getBedwarsLevelInfo(player.hypixelPlayer);
            if (!player.sources.runApi?.data.data.blacklist.tagged) {
                starRenderer += this.getPlayerTagDivider(bwLevel.level, "#" + bwLevel.prestigeColourHex);
            } else {
                starRenderer += this.getPlayerTagDivider(bwLevel.level || 0, "red", player);
            }
        } else {
            starRenderer += this.getPlayerTagDividerNicked();
        }
        starRenderer += `</div>`;
        return starRenderer;
    };

    public renderName = (player: Player) => {
        let nameRenderer = this.starterDivider;
        if (!player.nicked) {
            nameRenderer += `<span class='name-span'>`;
            if (window.config.get("general.tags.name.lunar")) {
                if (player.sources.lunar !== undefined && player.sources.lunar !== null) {
                    if (player.sources.lunar.data.player.online) {
                        nameRenderer += `<span class='lunar-client-image'>
                                       <img style='vertical-align:middle;' width='25px' height='25px' src='https://img.icons8.com/nolan/512/ffffff/lunar-client.png' alt='lunar tag'/>
                                     </span>`;
                    }
                }
            }

            if (!player.sources.runApi?.data.data.blacklist.tagged) {
                if (player.hypixelPlayer !== null) {
                    const rank = getPlayerRank(player.hypixelPlayer, false);
                    nameRenderer += `${rank.rankHtml}&nbsp <span style='color: #${rank.colourHex};'>${player.hypixelPlayer.displayname}</span>`;
                } else {
                    nameRenderer += ``;
                }
            } else {
                nameRenderer = this.getPlayerTagDivider(player.hypixelPlayer?.displayname, "red", player);
            }
            nameRenderer += `</span>`;
        } else {
            nameRenderer = this.getPlayerTagDivider(player.name, "red", player);
        }
        nameRenderer += `</div>`;
        return nameRenderer;
    };

    public renderWinstreak = (player: Player) => {
        let renderer: string = this.starterDivider;
        if (!player.nicked) {
            const playerValue = player.hypixelPlayer?.stats.Bedwars?.winstreak || 0;
            if (player.sources.runApi?.data.data.blacklist.tagged) {
                renderer += this.getPlayerTagDivider(playerValue, "red", player);
            } else if (playerValue === 0) {
                renderer += this.getPlayerTagDivider(playerValue, "gray", player);
            } else if (playerValue <= 50) {
                renderer += this.getPlayerTagDivider(playerValue, "gray", player);
            } else if (playerValue <= 200) {
                renderer += this.getPlayerTagDivider(playerValue, "white", player);
            } else if (playerValue <= 350) {
                renderer += this.getPlayerTagDivider(playerValue, "goldenrod", player);
            } else if (playerValue <= 500) {
                renderer += this.getPlayerTagDivider(playerValue, "darkgreen", player);
            } else if (playerValue <= 650) {
                renderer += this.getPlayerTagDivider(playerValue, "red", player);
            } else if (playerValue <= 800) {
                renderer += this.getPlayerTagDivider(playerValue, "darkred", player);
            } else if (playerValue <= 1000) {
                renderer += this.getPlayerTagDivider(playerValue, "deeppink", player);
            } else {
                renderer += this.getPlayerTagDivider(playerValue, "purple", player);
            }
        } else {
            renderer += this.getPlayerTagDividerNicked();
        }
        renderer += `</div>`;
        return renderer;
    };

    public renderRatioColour = (player: Player, route: "wlr" | "bblr") => {
        let renderer = this.starterDivider;
        let playerValue;
        if (!player.nicked) {
            if (route.toLowerCase() === "wlr") {
                playerValue = (player.hypixelPlayer?.stats.Bedwars?.wins_bedwars || 0) / (player.hypixelPlayer?.stats.Bedwars?.losses_bedwars || 0);
            } else if (route.toLowerCase() === "bblr") {
                playerValue = (player.hypixelPlayer?.stats.Bedwars?.beds_broken_bedwars || 0) / (player.hypixelPlayer?.stats.Bedwars?.beds_lost_bedwars || 0);
            }
            if (player.sources.runApi?.data.data.blacklist.tagged) {
                renderer += this.getPlayerTagDivider(playerValue, "red", player);
            } else if (playerValue === 1) {
                renderer += this.getPlayerTagDivider(playerValue, "gray", player);
            } else if (playerValue <= 2) {
                renderer += this.getPlayerTagDivider(playerValue, "gray", player);
            } else if (playerValue <= 4) {
                renderer += this.getPlayerTagDivider(playerValue, "white", player);
            } else if (playerValue <= 6) {
                renderer += this.getPlayerTagDivider(playerValue, "goldenrod", player);
            } else if (playerValue <= 7) {
                renderer += this.getPlayerTagDivider(playerValue, "darkgreen", player);
            } else if (playerValue <= 10) {
                renderer += this.getPlayerTagDivider(playerValue, "red", player);
            } else if (playerValue <= 15) {
                renderer += this.getPlayerTagDivider(playerValue, "darkred", player);
            } else if (playerValue <= 50) {
                renderer += this.getPlayerTagDivider(playerValue, "deeppink", player);
            } else {
                renderer += this.getPlayerTagDivider(playerValue, "purple", player);
            }
        } else {
            renderer += this.getPlayerTagDividerNicked();
        }
        renderer += `</div>`;
        return renderer;
    };

    public renderCoreStatsColour = (player: Player, route: "wins" | "losses" | "finalKills" | "finalDeaths" | "bedsBroken" | "bedsLost") => {
        let renderer = this.starterDivider;
        let playerValue;
        if (!player.nicked) {
            switch (route) {
                case "wins":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.wins_bedwars || 0;
                    break;
                case "losses":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.losses_bedwars || 0;
                    break;
                case "finalKills":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.final_kills_bedwars || 0;
                    break;
                case "finalDeaths":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.final_deaths_bedwars || 0;
                    break;
                case "bedsBroken":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.beds_broken_bedwars || 0;
                    break;
                case "bedsLost":
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.beds_lost_bedwars || 0;
                    break;
                default:
                    playerValue = player.hypixelPlayer?.stats.Bedwars?.games_played_bedwars || 0;
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
        renderer += `</div>`;
        return renderer;
    };

    public renderFKDRColour = (player: Player) => {
        let renderer = this.starterDivider;
        if (!player.nicked) {
            const playerValue = (player.hypixelPlayer?.stats.Bedwars?.final_kills_bedwars || 0) / (player.hypixelPlayer?.stats.Bedwars?.final_deaths_bedwars || 0);
            if (player.sources.runApi?.data.data.blacklist.tagged) {
                renderer += this.getPlayerTagDivider(playerValue, "red");
            } else if (playerValue === 1) {
                renderer += this.getPlayerTagDivider(playerValue, "gray");
            } else if (playerValue <= 3) {
                renderer += this.getPlayerTagDivider(playerValue, "gray");
            } else if (playerValue <= 10) {
                renderer += this.getPlayerTagDivider(playerValue, "white");
            } else if (playerValue <= 20) {
                renderer += this.getPlayerTagDivider(playerValue, "goldenrod");
            } else if (playerValue <= 35) {
                renderer += this.getPlayerTagDivider(playerValue, "darkgreen");
            } else if (playerValue <= 60) {
                renderer += this.getPlayerTagDivider(playerValue, "red");
            } else if (playerValue <= 100) {
                renderer += this.getPlayerTagDivider(playerValue, "darkred");
            } else if (playerValue <= 500) {
                renderer += this.getPlayerTagDivider(playerValue, "deeppink");
            } else {
                renderer += this.getPlayerTagDivider(playerValue, "purple");
            }
        } else {
            renderer += this.getPlayerTagDividerNicked();
        }
        renderer += `</div>`;
        return renderer;
    };

    public renderKeathizTags = (player: Player) => {
        let renderer = `<span style='padding-left: 5px;'>`;
        const keathizTagArray: Array<string> = [];
        if (player.sources.keathiz === null || player.sources.keathiz === undefined) {
            keathizTagArray.push(this.getPlayerTagDivider("ERROR", `#${MinecraftColours.DARK_RED.hex}`));
        } else {
            if (player.sources.keathiz.data.success && player.sources.keathiz.status === 200) {
                const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
                const accountType = keathizTags.player.extra.status;
                if (keathizTags.player.exits.last_10_min >= 1) {
                    keathizTagArray.push(this.getPlayerTagDivider("E10", `#${MinecraftColours.GOLD.hex}`));
                }
                if (keathizTags.player.queues.total == 0) {
                    keathizTagArray.push(this.getPlayerTagDivider("ND", `#${MinecraftColours.GOLD.hex}`));
                }
                if (keathizTags.player.queues.last_3_min >= 2) {
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
                if (keathizTags.player.queues.consecutive_queue_checks.last_30_queues["1_min_requeue"] >= 15 || keathizTags.player.queues.consecutive_queue_checks.last_10_queues["1_min_requeue"] >= 5 || keathizTags.player.queues.consecutive_queue_checks.last_10_queues["2_min_requeue"] >= 6 || keathizTags.player.queues.consecutive_queue_checks.last_10_queues["3_min_requeue"] >= 8) {
                    keathizTagArray.push(this.getPlayerTagDivider("C", `#${MinecraftColours.RED.hex}`));
                }
                if ((keathizTags.player.queues.last_3_min >= 2 && accountType === "mojang" && (player?.hypixelPlayer?.achievements?.bedwars_level ?? 0) <= 12 && keathizTagArray.length > 6) || accountType === "mojang") {
                    keathizTagArray.push(this.getPlayerTagDivider("DODGE", `#${MinecraftColours.DARK_RED.hex}`));
                }
            } else {
                keathizTagArray.push(this.getPlayerTagDivider("FAILED", `#${MinecraftColours.DARK_RED.hex}`));
            }
        }
        for (const tag of keathizTagArray) {
            renderer += tag;
        }
        renderer += `</span>`;
        return renderer;
    };

    private renderNameChangeTag = (player: Player) => {
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
                    return 11;
                }
                console.log(player.name + " has no name history or failed the NOT NULL check");
                return 11;
            }
            // TODO Add handling for 500 / too many requests
            return 11;
        } else return 11;
    };

    private getPlayerTagDivider = (tag: string | number | unknown, colour: string, player?: Player) => {
        let htmlResponse = `<span class='playerTagDivider'>`,
            styleString = `color: ${colour};`;
        if (typeof tag === "number" && !Number.isInteger(tag)) tag = tag.toFixed(2);
        if (colour === "white") {
            styleString += `opacity: 75%;`;
        }
        if (player?.sources.runApi?.data.data.blacklist.tagged) {
            styleString += `font: bold;`;
        }
        if (tag) {
            if (typeof tag === "string") {
                if (tag.length <= 4) {
                    styleString += `padding-left: 5px;`;
                } else {
                    styleString += `padding-left: 1px;`;
                }
            } else if (typeof tag === "number") {
                styleString += `justify-content: center;`;
            }
            htmlResponse += `<span style='${styleString}'>${tag}</span>`;
            htmlResponse += `</span>`;
        }
        return htmlResponse;
    };

    private getPlayerTagDividerNicked = () => {
        const styleString = `color: red; padding-left: 1px;`;
        let htmlResponse = `<div>`;
        htmlResponse += `<div style='${styleString}'>?</div>`;
        htmlResponse += `</div>`;
        return htmlResponse;
    };
}

export class PlayerHypixelUtils {}

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
