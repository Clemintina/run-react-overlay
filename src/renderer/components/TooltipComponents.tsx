import { Player, PlayerUtils } from "@common/utils/PlayerUtils";
import React, { FC, PropsWithChildren } from "react";
import { styled } from "@mui/material";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { getPlayerRank } from "@common/../../main/zikeji";
import { RenderCoreStatsColour, RenderRatioColour } from "@components/TagComponents";
import { Interweave } from "interweave";

export type OverlayTooltip = {
	player?: Player;
	tooltip: React.ReactNode;
	children?: React.ReactNode;
} & PropsWithChildren;

export type StatisticsTooltip = {
	player: Player;
} & PropsWithChildren;

export const StatsisticsTooltip: FC<StatisticsTooltip> = ({ children, player }) => {
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
										Games Played: <RenderCoreStatsColour player={player} stat={"gamesPlayed"} isTooltip={true} />
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
				{children}
			</OverlayTooltip>
		</div>
	);
};

export const OverlayTooltip: FC<OverlayTooltip> = ({ player, tooltip, children }) => {
	const CustomToolTip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			// backgroundColor: colours.backgroundColour,
			backgroundColor: "#120211",
			padding: "5px",
			paddingBottom: "3px",
			borderRadius: "5px",
			border: "1px solid #25015b",
			lineHeight: "17px",
			left: "350px",
			paddingRight: "12px",
			maxWidth: 220,
			fontSize: theme.typography.pxToRem(16),
		},
	}));
	let renderTooltip;

	if (player != undefined && (player.nicked || player.sources.runApi?.data.data?.bot?.tagged)) {
		renderTooltip = children;
	} else {
		renderTooltip = (
			<CustomToolTip title={<React.Fragment>{tooltip}</React.Fragment>}>
				<div>{children}</div>
			</CustomToolTip>
		);
	}

	return (
		<div>
			<div>{renderTooltip}</div>
		</div>
	);
};
