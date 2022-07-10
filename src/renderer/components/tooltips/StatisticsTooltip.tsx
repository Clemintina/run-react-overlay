import React, {PropsWithChildren} from "react";
import {Player} from "@common/utils/PlayerUtils";
import {getPlayerRank} from "@common/zikeji";
import {OverlayTooltip} from "@components/tooltips/OverlayTooltip";

export interface StatisticsTooltip {
    player: Player;
    children?: React.ReactNode;
}

export const StatsisticsTooltip: React.FC<PropsWithChildren<StatisticsTooltip>> = (props: StatisticsTooltip) => {
    const player = props.player;

    return (
        <div>
            <OverlayTooltip
                player={player}
                tooltip={
                    <div>
                        {player.hypixelPlayer !== null && (
                            <span>
                                <span style={{color: `#${getPlayerRank(player.hypixelPlayer).colourHex}`}}>{player.hypixelPlayer?.displayname}</span>
                                <div>
                                    <span>Data: ....</span>
                                </div>
                            </span>
                        )}
                    </div>
                }
            >
                {props.children}
            </OverlayTooltip>
        </div>
    );
};
