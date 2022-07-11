import React, { PropsWithChildren } from "react";
import { Player } from "@common/utils/PlayerUtils";
import { getPlayerRank, getBedwarsLevelInfo } from "@common/zikeji";
import { OverlayTooltip } from "@components/tooltips/OverlayTooltip";

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
                                <span style={{ color: `#${getPlayerRank(player.hypixelPlayer).colourHex}` }}>{player.hypixelPlayer?.displayname}</span>
                                <div>
                                    <span style={{ color: "white" }}>Games Played: {player.hypixelPlayer?.stats.Bedwars?.games_played_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>Wins: {player.hypixelPlayer?.stats.Bedwars?.wins_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>Losses: {player.hypixelPlayer?.stats.Bedwars?.losses_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>WLR: {((player.hypixelPlayer?.stats.Bedwars?.wins_bedwars || 0) / (player.hypixelPlayer?.stats.Bedwars?.losses_bedwars || 0)).toFixed(2)}</span>
                                </div>
                                <br/>
                                <div>
                                    <span style={{ color: "white" }}>Final Kills: {player.hypixelPlayer?.stats.Bedwars?.final_kills_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>Final Deaths: {player.hypixelPlayer?.stats.Bedwars?.final_deaths_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>FKDR: {((player.hypixelPlayer?.stats.Bedwars?.final_kills_bedwars || 0) / (player.hypixelPlayer?.stats.Bedwars?.final_deaths_bedwars || 0)).toFixed(2)}</span>
                                </div>
                                <br/>
                                <div>
                                    <span style={{ color: "white" }}>Beds Broken: {player.hypixelPlayer?.stats.Bedwars?.beds_broken_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>Beds Lost: {player.hypixelPlayer?.stats.Bedwars?.beds_lost_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>BBLR: {((player.hypixelPlayer?.stats.Bedwars?.beds_broken_bedwars || 0) / (player.hypixelPlayer?.stats.Bedwars?.beds_lost_bedwars || 0)).toFixed(2)}</span>
                                </div>
                                <br/>
                                <div>
                                    <span style={{ color: "white" }}>Kills: {player.hypixelPlayer?.stats.Bedwars?.kills_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>Deaths: {player.hypixelPlayer?.stats.Bedwars?.deaths_bedwars || 0}</span>
                                </div>
                                <div>
                                    <span style={{ color: "white" }}>KDR: {((player.hypixelPlayer?.stats.Bedwars?.kills_bedwars || 0) / (player.hypixelPlayer?.stats.Bedwars?.deaths_bedwars || 0)).toFixed(2)}</span>
                                </div>
                                <br/>
                                <div>
                                    <span style={{ color: "white" }}>First Login: {player.hypixelPlayer?.firstLogin || 0}</span>
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
