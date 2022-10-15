// eslint-disable-next-line import/named
import React from "react";
import { Player } from "@common/utils/PlayerUtils";
import { KeathizOverlayRun } from "@common/utils/externalapis/BoomzaApi";
import { getCoreFromConfig, getPlayerTagDividerNicked, getTagsFromConfig } from "@common/utils/player/RenderComponent";
import useConfigStore, { ConfigStore } from "@renderer/store/zustand/ConfigStore";

export interface PlayerWinstreak {
    player: Player;
}

const PlayerWinstreak: React.ElementType = (props: PlayerWinstreak) => {
    const player = props.player;
    const localConfigStore = useConfigStore<ConfigStore>((state) => state);

    let renderer: JSX.Element;
    if (!player.nicked) {
        let playerValue = player.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0;
        if (player.sources.keathiz != null && localConfigStore.settings.keathiz) {
            const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
            if (keathizTags?.player?.winstreak != null && keathizTags.player?.winstreak?.accurate == false) {
                playerValue = keathizTags.player.winstreak.estimates.overall_winstreak;
            }
        }
        if (player.sources.runApi?.data.data.blacklist.tagged && player.loaded) {
            renderer = getTagsFromConfig("run.blacklist", playerValue);
        } else {
            renderer = getCoreFromConfig(`core.winstreak`, playerValue);
        }
    } else {
        renderer = getPlayerTagDividerNicked();
    }

    return <span>{renderer}</span>;
};

export default PlayerWinstreak;
