// eslint-disable-next-line import/named
import React from "react";
import {StatsisticsTooltip} from "@components/tooltips/StatisticsTooltip";
import {getPlayerRank} from "@common/zikeji";
import useTagStore from "@renderer/store/zustand/TagStore";
import {Player} from "@common/utils/PlayerUtils";
import {Interweave} from "interweave";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface PlayerName {
    player: Player;
    isOverlayStats: boolean;
}

const PlayerName: React.ElementType = (props: PlayerName) => {
    const player = props.player;
    const tagStore = useTagStore((state) => state);
    const configStore = useConfigStore((state) => state);
    const denickedTag = <span />;

    const handleDenickEvent = () => {
        const store = configStore;
        configStore.setStore({...store, keathiz: {...store.keathiz,showNick: !store.keathiz.showNick}});
    };

    let rankPlayer: JSX.Element;
    if (player.hypixelPlayer && !player.sources.runApi?.data.data.blacklist.tagged) {
        const rank = getPlayerRank(player?.hypixelPlayer, false);
        let playerName = player?.hypixelPlayer?.displayname;
        if (player.denicked) {
            if (configStore.keathiz.showNick) {
                rankPlayer = (
                    <span>
                        <Interweave content={`${rank.rankHtml}`} /> <span style={{color: `#${rank.colourHex}`}}>{playerName}</span>
                        {" "}
                        <span className={"font-bold"} onClick={handleDenickEvent}>
                            <FontAwesomeIcon icon={faEye} />
                        </span>
                    </span>
                );
            } else {
                playerName = player.name;
                rankPlayer = (
                    <span>
                        <span style={{color: `#${tagStore.run.blacklist.colour}`}}>{playerName}</span>
                        {" "}
                        <span className={"font-bold"} onClick={handleDenickEvent}>
                            <FontAwesomeIcon icon={faEyeSlash} />
                        </span>
                    </span>
                );
            }
        } else {
            rankPlayer = (
                <span>
                    <Interweave content={`${rank.rankHtml}`} /> <span style={{color: `#${rank.colourHex}`}}>{playerName}</span>
                </span>
            );
        }
    } else if (player.sources.runApi?.data.data.blacklist.tagged) {
        rankPlayer = (
            <span>
                <span style={{color: `#${tagStore.run.blacklist.colour}`}}>
                    {" "}
                    {""} {player?.hypixelPlayer?.displayname}
                </span>
            </span>
        );
    } else {
        rankPlayer = <span style={{color: `#${tagStore.run.blacklist.colour}`}}>{player.name}</span>;
    }

    return (
        <StatsisticsTooltip player={player}>
            <div>
                <span className={"justify-content-start"}>
                    <span>
                        <span>{rankPlayer}</span>
                    </span>
                </span>
            </div>
        </StatsisticsTooltip>
    );
};

export default PlayerName;
