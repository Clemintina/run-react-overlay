// eslint-disable-next-line import/named
import React from "react";
import { Player } from "@common/utils/PlayerUtils";
import { getCoreFromConfig, getPlayerTagDividerNicked, getTagsFromConfig } from "@common/utils/player/RenderComponent";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface RenderCoreStatsColour {
    player: Player;
    stat: "wins" | "losses" | "finalKills" | "finalDeaths" | "bedsBroken" | "bedsLost" | "kills" | "deaths" | "gamesPlayed";
    mode?: "overall" | "solos" | "duos" | "threes" | "fours";
    isTooltip?: boolean;
}

const RenderCoreStatsColour: React.ElementType = (props: RenderCoreStatsColour) => {
    const player = props.player;
    let renderer: JSX.Element;
    let playerValue;
    const { table } = useConfigStore((state) => ({ table: state.table }));

    if (!player.nicked) {
        let modeObj = "";
        if (props.mode != undefined) {
            switch (props.mode) {
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
        switch (props.stat) {
            case "wins":
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "wins_bedwars"] ?? 0;
                break;
            case "losses":
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "losses_bedwars"] ?? 0;
                break;
            case "finalKills":
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "final_kills_bedwars"] ?? 0;
                break;
            case "finalDeaths":
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "final_deaths_bedwars"] ?? 0;
                break;
            case "bedsBroken":
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "beds_broken_bedwars"] ?? 0;
                break;
            case "bedsLost":
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "beds_lost_bedwars"] ?? 0;
                break;
            case "kills":
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "kills_bedwars"] ?? 0;
                break;
            case "deaths":
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "deaths_bedwars"] ?? 0;
                break;
            default:
                playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "games_played_bedwars"] ?? 0;
        }
        if (player.loaded) {
            if (!player.sources.runApi?.data.data?.blacklist.tagged) renderer = getCoreFromConfig("core.statistics", playerValue);
            else renderer = getTagsFromConfig("run.blacklist", playerValue);
        } else {
            renderer = getCoreFromConfig("core.statistics", playerValue);
        }
    } else {
        renderer = getPlayerTagDividerNicked();
    }
    return <span style={{ textAlign: table.settings.textAlign, display: props?.isTooltip ? "" : "block" }}>{renderer}</span>;
};

export default RenderCoreStatsColour;
