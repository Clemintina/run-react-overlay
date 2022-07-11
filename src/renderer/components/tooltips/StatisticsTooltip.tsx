import React, {PropsWithChildren} from "react";
import {Player, PlayerUtils} from "@common/utils/PlayerUtils";
import {getPlayerRank} from "@common/zikeji";
import {OverlayTooltip} from "@components/tooltips/OverlayTooltip";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import {Interweave} from "interweave";

export interface StatisticsTooltip {
    player: Player;
    children?: React.ReactNode;
}

export const StatsisticsTooltip: React.FC<PropsWithChildren<StatisticsTooltip>> = (props: StatisticsTooltip) => {
    const player = props.player;
    const tagStore = useSelector(() => store.getState().playerStore.tagStore);
    const playerFormatter = new PlayerUtils({tags: tagStore.tags, config: tagStore.config});
    const colours = useSelector(() => store.getState().configStore.colours);

    return (
        <div>
            <OverlayTooltip
                player={player}
                tooltip={
                    <div>
                        {player.hypixelPlayer !== null && (
                            <div className={"statistics-tooltip"}>
                                <span className={"statistics-tooltip-inline"} style={{color: `#${getPlayerRank(player.hypixelPlayer).colourHex}`}}>{player.hypixelPlayer.displayname}</span>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Games Played: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "gamesPlayed")} /></span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Wins: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "wins")} /> </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Losses: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "losses")} /> </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>WLR: <Interweave content={playerFormatter.getFormatPlayerInstance().renderRatioColour(player, "wlr")} /> </span>
                                </div>
                                <br />
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Final Kills: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "finalKills")} /> </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Final Deaths: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "finalDeaths")} /> </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>FKDR: <Interweave content={playerFormatter.getFormatPlayerInstance().renderRatioColour(player, "fkdr")} /> </span>
                                </div>
                                <br />
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Beds Broken: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "bedsBroken")} /> </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Beds Lost: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "bedsLost")} /> </span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>BBLR: <Interweave content={playerFormatter.getFormatPlayerInstance().renderRatioColour(player, "bblr")} /> </span>
                                </div>
                                <br />
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Kills: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "kills")}></Interweave></span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>Deaths: <Interweave content={playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "deaths")} /></span>
                                </div>
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>KDR: <Interweave content={playerFormatter.getFormatPlayerInstance().renderRatioColour(player, "kdr")} /> </span>
                                </div>
                                <br />
                                <div>
                                    <span className={"statistics-tooltip-inline"} style={{color: colours.primaryColour}}>First Login: <Interweave content={playerFormatter.getPlayerHypixelUtils().getDateFormatted(player.hypixelPlayer?.lastLogin) ?? 0} /> </span>
                                </div>
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
