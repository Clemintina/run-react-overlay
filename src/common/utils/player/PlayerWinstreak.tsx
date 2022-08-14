// eslint-disable-next-line import/named
import React from "react";
import {getBedwarsLevelInfo, getHighLevelPrestigeColour} from "@common/zikeji";
import useTagStore from "@renderer/store/zustand/TagStore";
import {Player} from "@common/utils/PlayerUtils";
import {Interweave} from "interweave";
import {KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {getCoreFromConfig, getPlayerTagDividerNicked, getTagsFromConfig} from "@common/utils/player/RenderComponent";

export interface PlayerWinstreak {
    player: Player;
}

const PlayerWinstreak: React.ElementType = (props: PlayerWinstreak) => {
    const player = props.player;

    let renderer:JSX.Element;
    if (!player.nicked) {
        let playerValue = player.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0;
        if (player.sources.keathiz != null) {
            const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
            if (keathizTags?.player?.winstreak != null && keathizTags.player?.winstreak?.accurate == false) {
                playerValue = keathizTags.player.winstreak.estimates.overall_winstreak;
            }
        }
        if (player.sources.runApi?.data.data.blacklist.tagged) {
            renderer = getTagsFromConfig("run.blacklist", playerValue);
        } else {
            renderer = getCoreFromConfig(`core.winstreak`, playerValue);
        }
    } else {
        renderer = getPlayerTagDividerNicked();
    }

    return (
        <span>{renderer}</span>
    );
};

export default PlayerWinstreak;
