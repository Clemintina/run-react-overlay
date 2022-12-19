import React, { FC, useEffect, useState } from "react";
import { Components, getBedwarsLevelInfo, getHighLevelPrestigeColour, getPlayerRank, MinecraftColourAsHex, MinecraftFormatting } from "@common/zikeji";
import useConfigStore from "@renderer/store/ConfigStore";
import { KeathizOverlayRun } from "@common/utils/externalapis/BoomzaApi";
import useTagStore from "@renderer/store/TagStore";
import { Interweave } from "interweave";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { MinecraftColours, Player, PlayerUtils } from "@common/utils/PlayerUtils";
import { PlayerNickname } from "@common/utils/Schemas";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";
import { RequestType } from "@common/utils/externalapis/RunApi";
import destr from "destr";
import { InputBoxButton, InputTextBox } from "@components/BaseComponents";
import { SettingCard } from "@components/AppComponents";
import { getCoreFromConfig, getPlayerTagDividerNicked, getTagsFromConfig } from "@components/TagComponents";
import { OverlayTooltip, StatsisticsTooltip } from "@components/TooltipComponents";

export type PlayerCommonProperties = {
	player: Player;
};

export type PlayerNickNameView = { key: string; playerNick: PlayerNickname; handleAdd: (player) => void; handleRemove: (player) => void };

export const PlayerGuildComponent: FC<PlayerCommonProperties> = ({ player }) => {
	let guildRenderer = <span />;
	if (player.hypixelGuild != null) {
		const guild: Components.Schemas.Guild = player.hypixelGuild.data;
		guildRenderer = <span style={{ color: `#${MinecraftColourAsHex[MinecraftFormatting[guild?.tagColor ?? "§7"]]}` }}>{guild.tag}</span>;
	}
	return <span>{guildRenderer}</span>;
};

export const PlayerHeadComponent: FC<PlayerCommonProperties> = ({ player }) => {
	const { configStore, table } = useConfigStore((state) => ({ configStore: state, table: state.table }));
	let lunarRenderer: JSX.Element = <span />;

	let srcUrl = `https://crafatar.com/avatars/${player.hypixelPlayer?.uuid}?size=16&overlay=true`;

	if (!player?.nicked) {
		if (configStore.settings.lunar) {
			if (player.sources.lunar !== undefined && player.sources.lunar !== null && player.sources.lunar.status == 200) {
				if (player.sources?.lunar?.data?.player?.online) {
					if (player.sources?.lunar?.data?.player?.lunarPlus?.premium) {
						lunarRenderer = (
							<span>
								<img width='20px' height='20px' src='https://dl.seraph.si/lunarplus.webp' alt='lunar tag' />
							</span>
						);
					} else {
						lunarRenderer = (
							<span>
								<img width='20px' height='20px' src='https://img.icons8.com/nolan/512/ffffff/lunar-client.png' alt='lunar tag' />
							</span>
						);
					}
				}
			}
		}
	} else {
		srcUrl = `https://crafatar.com/avatars/27b15dca2d5d4a47b36d5e87bb46c2a3?size=16&overlay=true`;
	}

	return (
		<div className='inline flex' style={{ textAlign: table.settings.textAlign }}>
			<img src={srcUrl} className='text-center' alt='player-head' />
			{lunarRenderer}
		</div>
	);
};

export const PlayerWinstreakComponent: FC<PlayerCommonProperties> = ({ player }) => {
	const { table, settings } = useConfigStore((state) => ({ table: state.table, settings: state.settings }));

	let renderer: JSX.Element;
	if (!player.nicked) {
		let playerValue = player.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0;
		if (player.sources.keathiz != null && settings.keathiz) {
			const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
			if (keathizTags?.player?.winstreak != null && keathizTags.player?.winstreak?.accurate == false) {
				playerValue = keathizTags.player.winstreak.estimates.overall_winstreak;
			}
		}
		if (player.sources.runApi?.data.data?.blacklist.tagged && player.loaded) {
			renderer = getTagsFromConfig("run.blacklist", playerValue);
		} else {
			renderer = getCoreFromConfig(`core.winstreak`, playerValue);
		}
	} else {
		renderer = getPlayerTagDividerNicked();
	}

	return <div style={{ textAlign: table.settings.textAlign }}>{renderer}</div>;
};

export const PlayerStarComponent: FC<PlayerCommonProperties> = ({ player }) => {
	const { table } = useConfigStore((state) => ({ table: state.table }));
	const { run } = useTagStore((state) => ({ run: state.run }));

	let starRenderer: JSX.Element;
	if (!player.nicked && player.hypixelPlayer !== null) {
		const bwLevel = getBedwarsLevelInfo(player.hypixelPlayer);
		if (!player.sources.runApi?.data.data?.blacklist?.tagged) {
			if (bwLevel.level < 1000) {
				starRenderer = <span style={{ color: `#${bwLevel.prestigeColourHex}` }}>{`[${bwLevel.level}✫]`}</span>;
			} else {
				starRenderer = <Interweave content={getHighLevelPrestigeColour(bwLevel)} />;
			}
		} else {
			starRenderer = <span style={{ color: `#${run.blacklist.colour}` }}>{bwLevel.level ?? 0}</span>;
		}
	} else {
		starRenderer = <span style={{ color: `#${run.blacklist.colour}` }}>?</span>;
	}

	return <div style={{ textAlign: table.settings.textAlign }}>{starRenderer}</div>;
};

export const PlayerSessionComponent: FC<PlayerCommonProperties> = ({ player }) => {
	const values: [string, string][] = [];
	const [timer, setTimer] = useState(0);
	const { table } = useConfigStore((state) => ({ table: state.table }));

	useEffect(() => {
		if (player?.hypixelPlayer?.lastLogout) {
			setTimeout(() => {
				setTimer(new Date().getUTCMilliseconds());
			}, 1000);
		}
	}, [timer]);

	if (player.hypixelPlayer != null) {
		if (player.hypixelPlayer.lastLogin == null || player.hypixelPlayer.lastLogout == null) {
			values.push(["N/A", "ff0000"]);
		} else {
			const lastLoginDate: Date = new Date(0);
			lastLoginDate.setUTCMilliseconds(player.hypixelPlayer.lastLogin);
			const now_timezoned: Date = new Date();
			const now = new Date();
			now.setUTCMilliseconds(now_timezoned.getUTCMilliseconds());

			if (player.hypixelPlayer.lastLogin > player.hypixelPlayer.lastLogout) {
				const timeDiff = new Date(now_timezoned.getTime() - lastLoginDate.getTime());
				if ((timeDiff.getUTCHours() >= 3 && timeDiff.getUTCMinutes() >= 30) || timeDiff.getUTCHours() > 4) {
					values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "00ff00"]);
				} else if ((timeDiff.getUTCHours() >= 0 && timeDiff.getUTCMinutes() >= 30) || timeDiff.getUTCHours() > 2) {
					values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "ffff00"]);
				} else {
					values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "ff0000"]);
				}
			} else {
				values.push(["Offline", "ff0000"]);
			}
		}
	}

	const playerStats = player.hypixelPlayer?.stats.Bedwars;
	const polsuSession = player.sources.polsu?.sessions ? player.sources.polsu.sessions.data : undefined;

	const playerFormatter = new PlayerUtils();

	return (
		<div style={{ textAlign: table.settings.textAlign }}>
			<OverlayTooltip
				player={player}
				tooltip={
					<div>
						{player.sources.polsu?.sessions && player.hypixelPlayer && (
							<div className={"statistics-tooltip text-center"}>
								<span className={"statistics-tooltip-inline"} style={{ color: `#${getPlayerRank(player.hypixelPlayer).colourHex}` }}>
									{player.hypixelPlayer.displayname}
								</span>
								<div>
									<div className={"statistics-tooltip-inline"}>Games Played: {(playerStats?.games_played_bedwars ?? 0) - (polsuSession?.games?.total ?? 0)}</div>
									<div className={"statistics-tooltip-inline"}>Wins: {(playerStats?.wins_bedwars ?? 0) - (polsuSession?.stats.wins ?? 0)}</div>
									<div className={"statistics-tooltip-inline"}>Losses: {(playerStats?.losses_bedwars ?? 0) - (polsuSession?.stats.losses ?? 0)}</div>
									<br /><div className={"statistics-tooltip-inline"}>Final Kills: {(playerStats?.final_kills_bedwars ?? 0) - (polsuSession?.stats.fkills ?? 0)}</div>
									<div className={"statistics-tooltip-inline"}>Final Deaths: {(playerStats?.final_deaths_bedwars ?? 0) - (polsuSession?.stats.fdeaths ?? 0)}</div>
									<br /><div className={"statistics-tooltip-inline"}>Beds Broken: {(playerStats?.beds_broken_bedwars ?? 0) - (polsuSession?.stats.bbroken ?? 0)}</div>
									<div className={"statistics-tooltip-inline"}>Beds Lost: {(playerStats?.beds_lost_bedwars ?? 0) - (polsuSession?.stats.blost ?? 0)}</div>
									<br /><div className={"statistics-tooltip-inline"}>Kills: {(playerStats?.kills_bedwars ?? 0) - (polsuSession?.stats.kills ?? 0)}</div>
									<div className={"statistics-tooltip-inline"}>Deaths: {(playerStats?.deaths_bedwars ?? 0) - (polsuSession?.stats.deaths ?? 0)}</div>
									<br /><div className={"statistics-tooltip-inline"}>Session started: {playerFormatter.getPlayerHypixelUtils().getDateFormatted(polsuSession?.started ? polsuSession.started * 1000 : 0, undefined, { hour12: false, dateStyle: "full" })}</div>
								</div>
							</div>
						)}
					</div>
				}
			>
				{values.map(([session_timer, hex], index) => (
					<span key={index} style={{ color: `#${hex}` }}>
						{session_timer}
					</span>
				))}
			</OverlayTooltip>
		</div>
	);
};

export const PlayerNameComponent: FC<PlayerCommonProperties> = ({ player }) => {
	const { run } = useTagStore((state) => ({ run: state.run }));
	const { settings, table, keathiz } = useConfigStore((state) => ({ settings: state.settings, table: state.table, keathiz: state.keathiz }));

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

export const PlayerNicknameViewComponent: FC<PlayerNickNameView> = ({ key, playerNick, handleAdd, handleRemove }) => {
	const { nicksLocal, hypixelApiKey } = useConfigStore((state) => ({
		nicksLocal: state.nicks,
		hypixelApiKey: state.hypixel.apiKey,
	}));
	const [playerNickname, setPlayerNickname] = useState<PlayerNickname>(nicksLocal.filter((player) => player.nick.toLowerCase() == playerNick.nick.toLowerCase())[0]);

	return (
		<SettingCard>
			<span>
				<InputTextBox
					onBlur={async (event) => {
						const userInput = event.currentTarget.value;
						if (userInput.length == 0) return;
						const hypixelRequest = await window.ipcRenderer.invoke<Components.Schemas.Player>(IpcValidInvokeChannels.HYPIXEL, [RequestType.USERNAME, hypixelApiKey, userInput]);
						const user = nicksLocal.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
						if (user) {
							const users = nicksLocal.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
							const newState = {
								uuid: hypixelRequest?.data?.uuid,
								name: hypixelRequest?.data?.displayname,
								nick: playerNickname.nick,
								added: Date.now(),
							};
							useConfigStore.getState().setNicks([...users, newState]);
							setPlayerNickname(newState);
						}
					}}
					options={{ placeholder: "Username", value: playerNickname.name, label: { text: "Username" } }}
				/>
			</span>
			<span>
				<InputTextBox
					onBlur={async (event) => {
						const userInput = event.currentTarget.value;
						if (userInput.length == 0) return;
						setPlayerNickname({ ...playerNickname, nick: userInput });
						const user = nicksLocal.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
						if (user) {
							const users = nicksLocal.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
							useConfigStore.getState().setNicks([...users, playerNickname]);
						}
					}}
					onChange={async (event) => {
						const userInput = event.currentTarget.value;
						if (userInput.length == 0 || userInput.toLowerCase() == playerNickname.nick.toLowerCase()) return;
						setPlayerNickname({ ...playerNickname, nick: userInput });
					}}
					options={{ placeholder: "Nickname", value: playerNickname.nick, label: { text: "Nickname" } }}
				/>
			</span>
			<span>
				<InputBoxButton
					text={"Remove"}
					onClick={() => {
						handleRemove(playerNickname);
					}}
					options={{ colour: "error" }}
				/>
			</span>
		</SettingCard>
	);
};

export const PlayerTagsComponent: FC<PlayerCommonProperties> = ({ player }) => {
	const { settings, hypixel, runConfig, table } = useConfigStore((state) => ({
		settings: state.settings,
		hypixel: state.hypixel,
		runConfig: state.run,
		table: state.table,
	}));

	let tagArray: Array<JSX.Element> = [];
	if (runConfig.valid && player.sources.runApi != null) {
		let singularTag = false;
		const runApi = player.sources.runApi?.data?.data;
		const customData = player?.sources?.customFile;
		const customUrl = player?.sources?.customApi;
		if (runApi?.blacklist?.tagged) {
			tagArray.push(getTagsFromConfig("run.blacklist"));
		} else if (runApi?.bot?.tagged) {
			tagArray.push(getTagsFromConfig("run.bot"));
		} else if (runApi?.customTag) {
			parseColour(runApi.customTag).forEach((tag: [string, string]) => tagArray.push(<span style={{ color: `#${tag[1]}` }}>{tag[0]}</span>));
		} else {
			if (settings.preferences.customFile && customData?.tags != null) {
				for (const tag of customData.tags) {
					if (tag?.singularTag) {
						tagArray = [];
						if (tag.tag.includes("§")) {
							parseColour(tag.tag).forEach((tag: [string, string]) => tagArray.push(<span style={{ color: `#${tag[1]}` }}>{tag[0]}</span>));
						} else {
							tagArray.push(<span style={{ color: tag.hex }}>{tag.tag}</span>);
						}
						singularTag = true;
						break;
					} else {
						if (tag.tag.includes("§")) {
							parseColour(tag.tag).forEach((tag: [string, string]) => tagArray.push(<span style={{ color: `#${tag[1]}` }}>{tag[0]}</span>));
						} else {
							tagArray.push(<span style={{ color: tag.hex }}>{tag.tag}</span>);
						}
					}
				}
			}
			if (settings.preferences.customUrl && customUrl?.tags) {
				for (const tag of customUrl.tags) {
					if (tag?.singularTag) {
						tagArray = [];
						if (tag.tag.includes("§")) {
							parseColour(tag.tag).forEach((tag: [string, string]) => tagArray.push(<span style={{ color: `#${tag[1]}` }}>{tag[0]}</span>));
						} else {
							tagArray.push(<span style={{ color: tag.hex }}>{tag.tag}</span>);
						}
						singularTag = true;
						break;
					} else {
						if (tag.tag.includes("§")) {
							parseColour(tag.tag).forEach((tag: [string, string]) => tagArray.push(<span style={{ color: `#${tag[1]}` }}>{tag[0]}</span>));
						} else {
							tagArray.push(<span style={{ color: tag.hex }}>{tag.tag}</span>);
						}
					}
				}
			}
			if (!singularTag) {
				if (player?.sources?.boomza?.status === 200) {
					const boomza = destr(player.sources.boomza.data);
					if (boomza?.sniper) {
						tagArray.push(getTagsFromConfig("boomza.sniper"));
					}
					if (boomza?.report) {
						tagArray.push(getTagsFromConfig("boomza.cheater"));
					}
				}
				if (runApi?.safelist?.tagged) {
					tagArray.push(getTagsFromConfig("run.safelist", runApi.safelist.timesKilled));
				}
				if (runApi?.safelist?.personal) {
					tagArray.push(getTagsFromConfig("run.personal_safelist", runApi.safelist.timesKilled));
				}
				if (settings.run.friends && player?.friended) {
					tagArray.push(getTagsFromConfig("run.friends"));
				}
				if (runApi?.statistics?.encounters != 0 ?? false) {
					tagArray.push(getTagsFromConfig("run.encounters", runApi?.statistics.encounters));
				}
				if (player?.hypixelPlayer?.channel == "PARTY") {
					tagArray.push(getTagsFromConfig("hypixel.party"));
				}
				if ( player.sources.polsu?.sessions ) {
					const polsuSession = player.sources.polsu.sessions.data;
					// @ts-ignore
					if ( polsuSession.new || polsuSession.started == polsuSession.player.last_changed ){
						tagArray.push(<span className={'text-red-500'}>N</span>)
					}
					// @ts-ignore
					if ( polsuSession.player.last_changed != null){
						const timeNow = Date.now();
						// @ts-ignore
						const nameBefore = new Date(polsuSession.player.last_changed*1000);
						const diffInMs = Math.abs(timeNow - nameBefore.getTime());
						const result = (diffInMs / (1000 * 60 * 60 * 24)) <= 10;
						if ( result ) {
							tagArray.push(getTagsFromConfig("run.name_change"));
						}
					}
				}
				if (settings.keathiz && player?.hypixelPlayer?.uuid != undefined) {
					if (player?.sources?.keathiz == null && player.loaded) {
						tagArray.push(<span style={{ color: `#${MinecraftColours.DARK_RED.hex}` }}>ERROR</span>);
					} else {
						if (player?.sources?.keathiz?.status == 200 && player?.sources?.keathiz?.data) {
							const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
							if (keathizTags?.player?.exits?.last_10_min ?? 0 >= 1) {
								tagArray.push(<span style={{ color: `#${MinecraftColours.GOLD.hex}` }}>{`E10`}</span>);
							}
							if (keathizTags?.player?.queues?.total ?? 0 == 0) {
								tagArray.push(getTagsFromConfig("keathiz.queues.queue_total"));
							}
							if (keathizTags?.player?.queues?.last_3_min ?? 0 >= 2) {
								const count = keathizTags?.player.queues.last_3_min;
								tagArray.push(<span style={{ color: `#${MinecraftColours.GOLD.hex}` }}>{`Q3-${count}`}</span>);
							}
							if (keathizTags?.player?.queues?.last_10_min ?? 0 >= 2) {
								const count = keathizTags?.player.queues.last_10_min;
								tagArray.push(<span style={{ color: `#${MinecraftColours.GOLD.hex}` }}>{`Q10-${count}`}</span>);
							}
							if (keathizTags?.player?.queues?.last_30_min ?? 0 >= 5) {
								const count = keathizTags?.player?.queues?.last_30_min;
								tagArray.push(<span style={{ color: `#${MinecraftColours.GOLD.hex}` }}>{`Q30-${count}`}</span>);
							}
							if (keathizTags?.player?.queues?.last_24_hours ?? 0 >= 50) {
								tagArray.push(<span style={{ color: `#${MinecraftColours.GOLD.hex}` }}>{`Q24`}</span>);
							}
							if (keathizTags?.player?.queues?.consecutive_queue_checks?.weighted["1_min_requeue"] ?? 0 >= 50) {
								tagArray.push(getTagsFromConfig("keathiz.one_minute_requeue"));
							}
							if (
								keathizTags?.player?.queues?.consecutive_queue_checks?.last_30_queues["1_min_requeue"] ??
								0 >= 15 ??
								keathizTags?.player?.queues?.consecutive_queue_checks?.last_10_queues["1_min_requeue"] ??
								0 >= 5 ??
								keathizTags?.player?.queues?.consecutive_queue_checks?.last_10_queues["2_min_requeue"] ??
								0 >= 6 ??
								keathizTags?.player?.queues?.consecutive_queue_checks?.last_10_queues["3_min_requeue"] ??
								0 >= 8
							) {
								tagArray.push(getTagsFromConfig("keathiz.consecutive"));
							}
						} else {
							if (useConfigStore.getState().settings.keathiz) tagArray.push(<span style={{ color: `#${MinecraftColours.DARK_RED.hex}` }}>{`FAILED`}</span>);
						}
					}
				}
			}
		}
	} else {
		if (player.loaded) {
			if (!runConfig.valid) {
				tagArray.push(<span style={{ color: "red" }}>Seraph Key Locked</span>);
			} else if (hypixel.apiKeyValid) {
				tagArray.push(<span style={{ color: "red" }}>NICKED</span>);
			} else {
				tagArray.push(<span style={{ color: "red" }}>Invalid Hypixel API Key</span>);
			}
		}
	}

	return (
		<div style={{ textAlign: table.settings.textAlign }}>
			{tagArray.map((value, index) => (
				<span key={index} className={index!=0 ? 'pl-1' : ''}>{value}</span>
			))}
		</div>
	);
};

// Utils
const parseColour = (text: string) => {
	const splitText = text.split("§");
	const finalText: [string, string][] = [];

	for (const letter of splitText) {
		if (letter != undefined) {
			finalText.push([letter.slice(1), MinecraftColourAsHex[`§${letter[0]}`]]);
		}
	}
	return finalText;
};
