import React, {PropsWithChildren} from "react";
import {Player, PlayerUtils} from "@common/utils/PlayerUtils";
import {getPlayerRank} from "@common/zikeji";
import {OverlayTooltip} from "@components/tooltips/OverlayTooltip";
import {Interweave} from "interweave";
import RenderCoreStatsColour from "@common/utils/player/RenderCoreStatsColour";
import RenderRatioColour from "@common/utils/player/RenderRatioColour";
import useTagStore from "@renderer/store/zustand/TagStore";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface StatisticsTooltip {
    player: Player;
    children?: React.ReactNode;
}

export const StatsisticsTooltip: React.FC<PropsWithChildren<StatisticsTooltip>> = (props: StatisticsTooltip) => {
    const player = props.player;
    const tagStore = useTagStore((state) => ({}));
    const configStore = useConfigStore((state) => ({}))
    const playerFormatter = new PlayerUtils({tags: tagStore, config: configStore});

    let blacklistedReason = <span/>
    if (player.sources.runApi?.data.data.blacklist.tagged) {
        blacklistedReason = (
            <div>
                <span>Reason:</span><br/>
                <span className={'text-red-500'}>{player.sources.runApi.data.data.blacklist.reason}</span>
            </div>
        )
    }

    return (
        <div>
            <OverlayTooltip
                player={player}
                tooltip={
                    <div>
                        {player.hypixelPlayer !== null && (
                            <div className={"statistics-tooltip text-center"}>
                                <span className={"statistics-tooltip-inline"} style={{color: `#${getPlayerRank(player.hypixelPlayer).colourHex}`}}>
                                    {player.hypixelPlayer.displayname}
                                </span>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Games Played: <RenderCoreStatsColour player={player} stats={'gamesPlayed'}/>{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Wins: <RenderCoreStatsColour player={player} stat={'wins'}/>{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Losses: <RenderCoreStatsColour player={player} stat={'losses'}/>{" "}{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        WLR: <RenderRatioColour player={player} ratio={'wlr'}/>{" "}
                                    </span>
                                </div>
                                <br/>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Final Kills: <RenderCoreStatsColour player={player} stat={'finalKills'}/>{" "}{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Final Deaths: <RenderCoreStatsColour player={player} stat={'finalDeaths'}/>{" "}{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        FKDR: <RenderRatioColour player={player} ratio={'fkdr'}/>{" "}
                                    </span>
                                </div>
                                <br/>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Beds Broken: <RenderCoreStatsColour player={player} stat={'bedsBroken'}/>{" "}{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Beds Lost: <RenderCoreStatsColour player={player} stat={'bedsLost'}/>{" "}{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        BBLR: <RenderRatioColour player={player} ratio={'bblr'}/>{" "}
                                    </span>
                                </div>
                                <br/>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Kills: <RenderCoreStatsColour player={player} stat={'kills'}/>{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Deaths: <RenderCoreStatsColour player={player} stat={'deaths'}/>{" "}
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        KDR: <RenderRatioColour player={player} ratio={'kdr'}/>{" "}
                                    </span>
                                </div>
                                <br/>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        First Login: <Interweave content={playerFormatter.getPlayerHypixelUtils().getDateFormatted(player.hypixelPlayer.firstLogin)}/>{" "}
                                    </span>
                                </div>
                                {blacklistedReason}
                            </div>
                        )}
                    </div>
                }
            >
                {props.children}
            </OverlayTooltip>
        </div>
    );
};
