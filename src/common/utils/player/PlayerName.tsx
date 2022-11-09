// eslint-disable-next-line import/named
import React, { FC } from "react";
import { StatsisticsTooltip } from "@components/tooltips/StatisticsTooltip";
import { getPlayerRank } from "@common/zikeji";
import useTagStore from "@renderer/store/zustand/TagStore";
import { Player } from "@common/utils/PlayerUtils";
import { Interweave } from "interweave";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";

export interface PlayerName {
    player: Player;
    isOverlayStats: boolean;
}

const PlayerName: FC<PlayerName> = (props: PlayerName) => {
    const player = props.player;
    const { run } = useTagStore((state) => ({ run: state.run }));
    const { settings, table, keathiz } = useConfigStore((state) => ({ settings: state.settings, table: state.table, keathiz: state.keathiz }));
    const { players } = usePlayerStore((state) => ({ players: state.players }));

    const handleDenickEvent = () => {
        useConfigStore.getState().setKeathizData({ ...keathiz, showNick: !keathiz.showNick });
    };

    let rankPlayer: JSX.Element;
    if (player.hypixelPlayer && !player.sources.runApi?.data?.data?.blacklist?.tagged) {
        const rank = getPlayerRank(player?.hypixelPlayer, false);
        let playerName = player?.hypixelPlayer?.displayname;
        if (player.denicked) {
            if (keathiz.showNick) {
                rankPlayer = (
                    <span>
                        {settings.appearance.displayRank ? <Interweave content={`${rank.rankHtml}`} /> : <span />} <span style={{ color: `#${rank.colourHex}` }}>{playerName}</span>{" "}
                        <span className={"font-bold"} onClick={handleDenickEvent}>
                            <FontAwesomeIcon icon={faEye} />
                        </span>
                    </span>
                );
            } else {
                playerName = player.name;
                rankPlayer = (
                    <span>
                        <span style={{ color: `#${run.blacklist.colour}` }}>{playerName}</span>{" "}
                        <span className={"font-bold"} onClick={handleDenickEvent}>
                            <FontAwesomeIcon icon={faEyeSlash} />
                        </span>
                    </span>
                );
            }
        } else {
            rankPlayer = (
                <span>
                    {settings.appearance.displayRank ? <Interweave content={`${rank.rankHtml}`} /> : <span />} <span style={{ color: `#${rank.colourHex}` }}>{playerName}</span>
                </span>
            );
        }
    } else if (player.sources.runApi?.data.data.blacklist.tagged) {
        rankPlayer = (
            <span>
                <span style={{ color: `#${run.blacklist.colour}` }}>{player?.hypixelPlayer?.displayname}</span>
            </span>
        );
    } else {
        rankPlayer = <span style={{ color: `#${run.blacklist.colour}` }}>{player.name}</span>;
    }

    return (
        <div style={{ textAlign: table.settings.textAlign }}>
            <StatsisticsTooltip player={player}>{rankPlayer}</StatsisticsTooltip>
        </div>
    );
};

export default PlayerName;
