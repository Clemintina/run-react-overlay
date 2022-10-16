// eslint-disable-next-line import/named
import React from "react";
import {Player} from "@common/utils/PlayerUtils";
import {getCoreFromConfig, getPlayerTagDividerNicked, getTagsFromConfig} from "@common/utils/player/RenderComponent";

export interface RenderRatioColour {
    player: Player;
    ratio: "wlr" | "bblr" | "kdr" | "fkdr";
}

const RenderRatioColour: React.ElementType = (props: RenderRatioColour) => {
    const player = props.player;

    let renderer: JSX.Element;
    let playerValue;
    if (!player.nicked) {
        switch (props.ratio) {
            case "wlr":
                playerValue = (player.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) / (player.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 1);
                break;
            case "bblr":
                playerValue = (player.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars ?? 0) / (player.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars ?? 1);
                break;
            case "kdr":
                playerValue = (player.hypixelPlayer?.stats?.Bedwars?.kills_bedwars ?? 0) / (player.hypixelPlayer?.stats?.Bedwars?.deaths_bedwars ?? 1);
                break;
            case "fkdr":
                playerValue = (player.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) / (player.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars ?? 1);
                break;
        }

        if (player.sources.runApi?.data.data?.blacklist.tagged && player.loaded) {
            let displayValue = playerValue;
            if (!isFinite(playerValue)) displayValue = ~~Number((((0 - 18) / 0) * 100).toFixed(2));
            if (!Number.isInteger(playerValue)) displayValue = playerValue.toFixed(2);
            renderer = getTagsFromConfig("run.blacklist", displayValue);
        } else {
            renderer = getCoreFromConfig(`core.${props.ratio}`, playerValue);
        }
    } else {
        renderer = getPlayerTagDividerNicked();
    }

    return <span>{renderer}</span>;
};

export default RenderRatioColour;
