import {Blacklist} from "./externalapis/RunApi";
import {Components, getBedwarsLevelInfo, getPlayerRank} from "@common/zikeji";
import {BoomzaAntisniper} from "@common/utils/externalapis/BoomzaApi";

export interface Player {
    name: string;
    id: string | null;
    nicked: boolean | null;
    bot: boolean | null;
    hypixelPlayer: Components.Schemas.Player | null;
    hypixelGuild: Components.Schemas.Guild | null;
    runApi: Blacklist | null;
    boomza: BoomzaAntisniper | null;
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
    private starterDivider = `<div style='margin: 0 auto; justify-content: center; display: flex;'>`;
    private utils = new PlayerHypixelUtils();

    public renderTags = (player: Player) => {
        let tagRenderer: string = this.starterDivider;
        if (player.runApi != null) {
            const runApi = player.runApi.data;
            if (runApi.blacklist.tagged) {
                tagRenderer += this.getPlayerTagDivider("BLACKLISTED", "red", player);
            } else {
                if (runApi.migrated.tagged) {
                    tagRenderer += this.getPlayerTagDivider("M", "green");
                }
                if (runApi.safelist.tagged) {
                    tagRenderer += this.getPlayerTagDivider("S", "green");
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
            if (!player.runApi?.data.blacklist.tagged) {
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
            if (!player.runApi?.data.blacklist.tagged) {
                if (player.hypixelPlayer !== null) {
                    const rank = getPlayerRank(player.hypixelPlayer, false);
                    nameRenderer += `${rank.rankHtml}&nbsp <span style='color: #${rank.colourHex}'>${player.hypixelPlayer.displayname}</span>`;
                } else {
                    nameRenderer += ``;
                }
            } else {
                nameRenderer = this.getPlayerTagDivider(player.hypixelPlayer?.displayname, "red", player);
            }
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
            if (player.runApi?.data.blacklist.tagged) {
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
            if (player.runApi?.data.blacklist.tagged) {
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

    public renderFKDRColour = (player: Player) => {
        let renderer = this.starterDivider;
        if (!player.nicked) {
            const playerValue = (player.hypixelPlayer?.stats.Bedwars?.final_kills_bedwars || 0) / (player.hypixelPlayer?.stats.Bedwars?.final_deaths_bedwars || 0);
            if (player.runApi?.data.blacklist.tagged) {
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

    private getPlayerTagDivider = (tag: string | number | undefined, colour: string, player?: Player) => {
        let htmlResponse = `<div>`,
            styleString = `color: ${colour}; padding-left: 1px;`;
        if (typeof tag == "number" && !Number.isInteger(tag)) tag = tag.toFixed(2);
        if (colour == "white") {
            styleString += `opacity: 75%;`;
        }
        if (player?.runApi?.data.blacklist.tagged) {
            styleString += `font: bold;`;
        }
        htmlResponse += `<div style='${styleString}'>${tag}</div>`;
        htmlResponse += `</div>`;
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

export class PlayerHypixelUtils {
    public getPlayerRank: ({player, formatting}: {player: Player; formatting?: boolean}) => {
        colourHex: string;
        rankFormatted: string;
        rankClean: string;
        htmlCode: string;
        rankColourHex: MinecraftColoursImpl;
    } = ({player, formatting = false}: {player: Player; formatting?: boolean}) => {
        const hypixelPlayer = player.hypixelPlayer;
        let rank, htmlCode, plusColour, rankColourHex;
        if (hypixelPlayer !== null) {
            if (hypixelPlayer.rank && hypixelPlayer.rank !== "NORMAL") {
                switch (hypixelPlayer.rank) {
                    case "MODERATOR":
                        rank = "MOD";
                        break;
                    case "YOUTUBER":
                        rank = "Youtuber";
                        break;
                    case "HELPER":
                        rank = "Helper";
                        break;
                    case "ADMIN":
                        rank = "Admin";
                        break;
                }
            } else
                switch (hypixelPlayer.newPackageRank) {
                    case "MVP_PLUS":
                        rank = hypixelPlayer.monthlyPackageRank && hypixelPlayer.monthlyPackageRank === "SUPERSTAR" ? "MVP++" : "MVP+";
                        break;
                    case "MVP":
                        rank = "MVP";
                        rankColourHex = MinecraftColours.AQUA;
                        break;
                    case "VIP_PLUS":
                        rank = "VIP+";
                        rankColourHex = MinecraftColours.GREEN;
                        break;
                    case "VIP":
                        rank = "VIP";
                        rankColourHex = MinecraftColours.GREEN;
                        break;
                    default:
                        rank = "";
                        rankColourHex = MinecraftColours.GREY;
                        break;
                }

            if (hypixelPlayer.rankPlusColor !== undefined) plusColour = hypixelPlayer.rankPlusColor;

            if (plusColour !== undefined) {
                if (hypixelPlayer.monthlyPackageRank === "SUPERSTAR") {
                    // language=HTML
                    htmlCode = `
                        <div style='color: #${MinecraftColours.GOLD.hex}'>[MVP<span style='color: #${MinecraftColours[plusColour].hex}'>++</span><span style='color: #${MinecraftColours.GOLD.hex}'>]</span></div>`;
                    rankColourHex = MinecraftColours.GOLD;
                } else if (hypixelPlayer.newPackageRank === "MVP_PLUS") {
                    // language=HTML
                    htmlCode = `
                        <div style='color: #${MinecraftColours.AQUA.hex}'>[MVP<span style='color: #${MinecraftColours[plusColour].hex}'>+</span><span style='color: #${MinecraftColours.AQUA.hex};'>]</span></div>`;
                    rankColourHex = MinecraftColours.AQUA;
                }
            }

            return {
                rankClean: rank,
                rankFormatted: `[${rank}]`,
                colourHex: "",
                htmlCode: htmlCode,
                rankColourHex: rankColourHex,
            };
        } else {
            return {
                rankClean: "",
                rankFormatted: ``,
                colourHex: "",
                htmlCode: "",
                rankColourHex: "",
            };
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
