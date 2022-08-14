// eslint-disable-next-line import/named
import React from "react";
import {getBedwarsLevelInfo, getHighLevelPrestigeColour} from "@common/zikeji";
import useTagStore from "@renderer/store/zustand/TagStore";
import {Player} from "@common/utils/PlayerUtils";
import {Interweave} from "interweave";

export interface PlayerStar {
    player: Player;
}

const PlayerStar: React.ElementType = (props: PlayerStar) => {
    const player = props.player;
    const tagStore = useTagStore((state) => state);

    let starRenderer: JSX.Element;
    if (!player.nicked && player.hypixelPlayer !== null) {
        const bwLevel = getBedwarsLevelInfo(player.hypixelPlayer);
        if (!player.sources.runApi?.data.data.blacklist.tagged) {
            if (bwLevel.level < 1000) {
                starRenderer = <span style={{color: `#${bwLevel.prestigeColourHex}`}}>{`[${bwLevel.level}✫]`}</span>;
            } else {
                starRenderer = <Interweave content={getHighLevelPrestigeColour(bwLevel)} />;
            }
        } else {
            starRenderer = <span style={{color: `#${tagStore.run.blacklist.colour}`}}>{bwLevel.level ?? 0}</span>;
        }
    } else {
        starRenderer = <span style={{color: `#${tagStore.run.blacklist.colour}`}}>?</span>;
    }

    return (
        <span>{starRenderer}</span>
    );
};

export default PlayerStar;
