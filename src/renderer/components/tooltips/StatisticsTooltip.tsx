import React, {PropsWithChildren} from "react";
import {Player, PlayerUtils} from "@common/utils/PlayerUtils";
import {getPlayerRank} from "@common/zikeji";
import {OverlayTooltip} from "@components/tooltips/OverlayTooltip";
import {useSelector} from "react-redux";
import store from "@renderer/store";

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
                            <span>
                                <span style={{color: `#${getPlayerRank(player.hypixelPlayer).colourHex}`}}>{player.hypixelPlayer.displayname}</span>
                                <div>
                                    <span style={{color: colours.primaryColour}}>Games Played: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "gamesPlayed")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>Wins: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "wins")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>Losses: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "losses")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>WLR: {playerFormatter.getFormatPlayerInstance().renderRatioColour(player, "wlr")}</span>
                                </div>
                                <br />
                                <div>
                                    <span style={{color: colours.primaryColour}}>Final Kills: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "finalKills")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>Final Deaths: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "finalDeaths")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>FKDR: {playerFormatter.getFormatPlayerInstance().renderRatioColour(player, "fkdr")}</span>
                                </div>
                                <br />
                                <div>
                                    <span style={{color: colours.primaryColour}}>Beds Broken: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "bedsBroken")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>Beds Lost: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "bedsLost")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>BBLR: {playerFormatter.getFormatPlayerInstance().renderRatioColour(player, "bblr")}</span>
                                </div>
                                <br />
                                <div>
                                    <span style={{color: colours.primaryColour}}>Kills: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "kills")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>Deaths: {playerFormatter.getFormatPlayerInstance().renderCoreStatsColour(player, "deaths")}</span>
                                </div>
                                <div>
                                    <span style={{color: colours.primaryColour}}>KDR: {playerFormatter.getFormatPlayerInstance().renderRatioColour(player, "kdr")}</span>
                                </div>
                                <br />
                                <div>
                                    <span style={{color: colours.primaryColour}}>First Login: {playerFormatter.getPlayerHypixelUtils().getDateFormatted(player.hypixelPlayer?.lastLogin) ?? 0}</span>
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
