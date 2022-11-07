import React, {PropsWithChildren} from "react";
import {Player, PlayerUtils} from "@common/utils/PlayerUtils";
import {getPlayerRank} from "@common/zikeji";
import {OverlayTooltip} from "@components/tooltips/OverlayTooltip";
import {Interweave} from "interweave";
import RenderCoreStatsColour from "@common/utils/player/RenderCoreStatsColour";
import RenderRatioColour from "@common/utils/player/RenderRatioColour";

export interface StatisticsTooltip {
    player: Player;
    children?: React.ReactNode;
}

export const StatsisticsTooltip: React.FC<PropsWithChildren<StatisticsTooltip>> = (props: StatisticsTooltip) => {
    const player = props.player;
    const playerFormatter = new PlayerUtils();

    let blacklistedReason = <span />;
    if (player.sources.runApi?.data.data?.blacklist?.tagged) {
        blacklistedReason = (
            <div>
                <span>Reason:</span>
                <br />
                <span className={"text-red-500"}>{player.sources.runApi.data.data.blacklist.reason}</span>
            </div>
        );
    }

    return (
        <div>
            <OverlayTooltip
                player={player}
                tooltip={
                    <div>
                        {player.hypixelPlayer !== null && (
                            <div className={"statistics-tooltip text-center"}>
                                <span className={"statistics-tooltip-inline"} style={{ color: `#${getPlayerRank(player.hypixelPlayer).colourHex}` }}>
                                    {player.hypixelPlayer.displayname}
                                </span>
                                <div style={player?.denicked ? { display: "" } : { display: "none" }}>
                                    <span>{player.name}</span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Games Played: <RenderCoreStatsColour player={player} stats={"gamesPlayed"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Wins: <RenderCoreStatsColour player={player} stat={"wins"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Losses: <RenderCoreStatsColour player={player} stat={"losses"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        WLR: <RenderRatioColour player={player} ratio={"wlr"} isTooltip={true} />
                                    </span>
                                </div>
                                <br />
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Final Kills: <RenderCoreStatsColour player={player} stat={"finalKills"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Final Deaths: <RenderCoreStatsColour player={player} stat={"finalDeaths"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        FKDR: <RenderRatioColour player={player} ratio={"fkdr"} isTooltip={true} />
                                    </span>
                                </div>
                                <br />
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Beds Broken: <RenderCoreStatsColour player={player} stat={"bedsBroken"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Beds Lost: <RenderCoreStatsColour player={player} stat={"bedsLost"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        BBLR: <RenderRatioColour player={player} ratio={"bblr"} isTooltip={true} />
                                    </span>
                                </div>
                                <br />
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Kills: <RenderCoreStatsColour player={player} stat={"kills"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Deaths: <RenderCoreStatsColour player={player} stat={"deaths"} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        KDR: <RenderRatioColour player={player} ratio={"kdr"} isTooltip={true} />
                                    </span>
                                </div>
                                <br />
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        First Login: <Interweave content={playerFormatter.getPlayerHypixelUtils().getDateFormatted(player.hypixelPlayer.firstLogin)} isTooltip={true} />
                                    </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"}>
                                        Last Login: <Interweave content={playerFormatter.getPlayerHypixelUtils().getDateFormatted(player.hypixelPlayer.lastLogin)} isTooltip={true} />
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
