import { Player } from "@common/utils/PlayerUtils";
import React, { FC } from "react";
import useConfigStore from "@renderer/store/ConfigStore";
import useTagStore from "@renderer/store/TagStore";
import Tooltip from "@mui/material/Tooltip";
import { TagArray, TagColour } from "@common/utils/TagSchema";
import jsonLogic from "json-logic-js";

export type RenderRatioColour = {
	player: Player;
	ratio: "wlr" | "bblr" | "kdr" | "fkdr";
	isTooltip?: boolean;
};

export type RenderCoreStatsColour = {
	player: Player;
	stat: "wins" | "losses" | "finalKills" | "finalDeaths" | "bedsBroken" | "bedsLost" | "kills" | "deaths" | "gamesPlayed";
	mode?: "overall" | "solos" | "duos" | "threes" | "fours";
	isTooltip?: boolean;
};

export const RenderCoreStatsColour: FC<RenderCoreStatsColour> = (props: RenderCoreStatsColour) => {
	const player = props.player;
	let renderer: JSX.Element;
	let playerValue;
	const { table } = useConfigStore((state) => ({ table: state.table }));

	if (!player.nicked) {
		let modeObj = "";
		if (props.mode != undefined) {
			switch (props.mode) {
				case "solos":
					modeObj = "eight_one_";
					break;
				case "duos":
					modeObj = "eight_two_";
					break;
				case "threes":
					modeObj = "four_three_";
					break;
				case "fours":
					modeObj = "four_four_";
					break;
			}
		}
		switch (props.stat) {
			case "wins":
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "wins_bedwars"] ?? 0;
				break;
			case "losses":
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "losses_bedwars"] ?? 0;
				break;
			case "finalKills":
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "final_kills_bedwars"] ?? 0;
				break;
			case "finalDeaths":
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "final_deaths_bedwars"] ?? 0;
				break;
			case "bedsBroken":
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "beds_broken_bedwars"] ?? 0;
				break;
			case "bedsLost":
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "beds_lost_bedwars"] ?? 0;
				break;
			case "kills":
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "kills_bedwars"] ?? 0;
				break;
			case "deaths":
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "deaths_bedwars"] ?? 0;
				break;
			default:
				playerValue = player.hypixelPlayer?.stats?.Bedwars?.[modeObj + "games_played_bedwars"] ?? 0;
		}
		if (player.loaded) {
			if (!player.sources.runApi?.data?.blacklist.tagged) {
				renderer = getCoreFromConfig("core.statistics", playerValue);
			} else {
				renderer = getTagsFromConfig("run.blacklist", playerValue);
			}
		} else {
			renderer = getCoreFromConfig("core.statistics", playerValue);
		}
	} else {
		renderer = getPlayerTagDividerNicked();
	}
	return <span style={{ textAlign: table.settings.textAlign, display: props?.isTooltip ? "" : "block" }}>{renderer}</span>;
};

export const RenderRatioColour: FC<RenderRatioColour> = (props: RenderRatioColour) => {
	const player = props.player;
	let renderer: JSX.Element;
	let playerValue;
	const { table } = useConfigStore((state) => ({ table: state.table }));

	if (!player.nicked) {
		switch (props.ratio) {
			case "wlr":
				playerValue = (player.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) / (player.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 1);
				break;
			case "bblr":
				playerValue = (player.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars ?? 0) / (player.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars ?? 1);
				break;
			case "kdr":
				playerValue = (player.hypixelPlayer?.stats?.Bedwars?.kills_bedwars ?? 0) / (player.hypixelPlayer?.stats?.Bedwars?.deaths_bedwars ?? 1);
				break;
			case "fkdr":
				playerValue = (player.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) / (player.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars ?? 1);
				break;
		}

		if (player.sources.runApi?.data?.blacklist.tagged && player.loaded) {
			let displayValue = playerValue;
			if (!isFinite(playerValue)) displayValue = ~~Number((((0 - 18) / 0) * 100).toFixed(2));
			if (!Number.isInteger(playerValue)) displayValue = playerValue.toFixed(2);
			renderer = getTagsFromConfig("run.blacklist", displayValue);
		} else {
			renderer = getCoreFromConfig(`core.${props.ratio}`, playerValue);
		}
	} else {
		renderer = getPlayerTagDividerNicked();
	}

	return <span style={{ textAlign: table.settings.textAlign, display: props?.isTooltip ? "" : "block" }}>{renderer}</span>;
};

export const getTagsFromConfig = (tagDisplayPath: string, value?: number) => {
	const tag = isTagValid(tagDisplayPath.split(".").reduce((o, i) => o[i], useTagStore.getState()));

	const tagDisplayIcon: string | undefined = tag?.display ?? "?";
	const tagArray = tag?.colour ?? "FF5555";

	if (tagDisplayPath == "run.blacklist") {
		return (
			<Tooltip title={<span className={"normal-case"}>{`This player is blacklisted. It is advised to requeue!`}</span>} arrow>
				<span style={{ color: `#${tagArray}` }}>{value != undefined ? value : tagDisplayIcon}</span>
			</Tooltip>
		);
	} else if (Array.isArray(tagArray) && value != undefined) {
		const tempArray = [...tagArray];
		const arr = tempArray.sort((a, b) => b.requirement - a.requirement);
		for (const { colour, requirement } of arr) {
			if (value >= requirement) {
				return (
					<Tooltip title={<span className={"capitalize"}>{tagDisplayPath.split(".")[tagDisplayPath.split(".").length - 1].replaceAll("_", " ")}</span>} arrow>
						<span>
							<span style={{ color: `#${colour}` }}>{tagDisplayIcon}</span>
						</span>
					</Tooltip>
				);
			}
		}
	} else {
		return (
			<Tooltip title={<span className={"capitalize"}>{tagDisplayPath.split(".")[tagDisplayPath.split(".").length - 1].replaceAll("_", " ")}</span>} arrow>
				<span>
					<span style={{ color: `#${tagArray?.toString()}` }}>{tagDisplayIcon}</span>
				</span>
			</Tooltip>
		);
	}
	return <span style={{ color: "red" }}>{tagDisplayIcon}</span>;
};

const isTagValid = (inputTagSchema) => {
	if (Array.isArray(inputTagSchema.colour)) return inputTagSchema as TagArray;
	return inputTagSchema as TagColour;
};

export const getCoreFromConfig = (tagDisplayPath, value: number) => {
	try {
		const coreMetric: TagArray | undefined = tagDisplayPath.split(".").reduce((o, i) => o[i], useTagStore.getState()) ?? 0;
		const coreArray = coreMetric?.colour ?? "FF5555";
		let displayValue: string | number = value.toString();

		if (!isFinite(value)) displayValue = ~~Number((((0 - 18) / 0) * 100).toFixed(2));
		if (!Number.isInteger(value)) displayValue = value.toFixed(2);

		if (Array.isArray(coreArray)) {
			const tempArray = [...coreArray];
			const arr = tempArray.sort((a, b) => a.requirement - b.requirement);
			for (const { colour, requirement, operator } of arr) {
				if (jsonLogic.apply({ [operator]: [value, requirement] })) {
					return (
						<span>
							<span style={{ color: `#${colour}` }}>{displayValue}</span>
							<span className={"pl-1"} />
						</span>
					);
				}
			}
			return <span style={{ color: `#ffffff` }}>{displayValue}</span>;
		} else {
			return <span style={{ color: `#${coreArray}` }}>{displayValue}</span>;
		}
	} catch (e) {
		return <span style={{ color: `#ff5555` }}>{tagDisplayPath}</span>;
	}
};

export const getPlayerTagDividerNicked = () => <span style={{ color: "red" }}>?</span>;
