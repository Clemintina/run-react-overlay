import create from "zustand";
import { Player } from "@common/utils/PlayerUtils";
import { Components } from "@common/zikeji";
import { IPCResponse, RequestType, RunEndpoints, RunFriendList } from "@common/utils/externalapis/RunApi";
import { BoomzaAntisniper, KeathizEndpoints, KeathizOverlayRun } from "@common/utils/externalapis/BoomzaApi";
import useConfigStore from "@renderer/store/ConfigStore";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";
import { CustomFileJsonType } from "@common/utils/Schemas";
import { PlayerDB } from "@common/utils/externalapis/PlayerDB";
import { Session } from "@clemintina/seraph-library/lib/PolsuTypes";
import { Blacklist, LunarAPIResponse, SeraphResponse } from "@clemintina/seraph-library/lib/SeraphTypes";

export type PlayerStore = {
	players: Array<Player>;
	addPlayer: (username: string) => void;
	removePlayer: (username: string) => void;
	updatePlayers: () => void;
	updatePlayerState: (player: Player) => void;
	clearPlayers: () => void;
	setStore: (store: PlayerStore) => void;
	party: {
		partyStore: Array<string>;
		addPartyMember: () => void;
		removePartyMember: () => void;
	};
	tagStore: {
		config: object;
		tags: object;
	};
};

const usePlayerStore = create<PlayerStore>((set, get) => ({
	players: Array<Player>(),
	friendLists: Array<RunFriendList>(),
	addPlayer: async (username: string) => {
		if (username == undefined || username == "") return;
		const defaultPlayer: Player = {
			name: username.toLowerCase(),
			nicked: false,
			id: null,
			bot: false,
			friended: false,
			loaded: false,
			hypixelGuild: null,
			hypixelPlayer: {
				_id: "",
				uuid: "",
				playername: "",
				displayname: "",
				knownAliases: [],
				knownAliasesLower: [],
				achievementPoints: 0,
				achievements: {},
				stats: {},
				achievementsOneTime: [],
				achievementTracking: []
			},
			hypixelFriends: null,
			hypixelFriendsMutuals: null,
			denicked: false,
			last_updated: new Date().getTime(),
			sources: {
				runApi: null
			}
		};
		let playerData: Player = defaultPlayer;
		const playerObject: IPCResponse<Player> = { status: 400, cause: "none", data: playerData };
		const { hypixel, settings, customFile, run } = useConfigStore.getState();

		if (hypixel.apiKey === undefined || hypixel.apiKey.length !== 36 || !hypixel.apiKeyValid) {
			useConfigStore.getState().setErrorMessage({
				title: "No Hypixel API Key",
				cause: "No Hypixel API Key",
				code: 400,
				type: "WARNING",
			});
			return { status: 403, cause: "No API Key", data: null };
		}

		let apiKey;
		if (hypixel.apiKeyValid_2) {
			apiKey = get().players.length % 2 ? hypixel.apiKey : hypixel.apiKey_2;
		} else {
			apiKey = hypixel.apiKey;
		}

		if (useConfigStore.getState().nicks.filter((nickname) => nickname.nick.toLowerCase() == username.toLowerCase()).length != 0) {
			playerData.name = useConfigStore.getState().nicks.filter((nickname) => nickname.nick.toLowerCase() == username.toLowerCase())[0].uuid;
		}

		try {
			const ipcHypixelPlayer =
				playerData.name.length <= 16
					? await window.ipcRenderer.invoke<Components.Schemas.Player>(IpcValidInvokeChannels.HYPIXEL, [RequestType.USERNAME, apiKey, playerData.name, useConfigStore.getState().hypixel.proxy ? "sdad" : undefined])
					: await window.ipcRenderer.invoke<Components.Schemas.Player>(IpcValidInvokeChannels.HYPIXEL, [RequestType.UUID, apiKey, playerData.name.replaceAll("-", ""), useConfigStore.getState().hypixel.proxy ? "dsadas" : undefined]);
			if (!ipcHypixelPlayer?.data?.uuid || ipcHypixelPlayer.status != 200) {
				const data: unknown = ipcHypixelPlayer.data;
				let cause, code;
				if (typeof data === "string") {
					cause = data;
					code = ipcHypixelPlayer.status;
				} else {
					cause = "Player is not valid on Hypixel!";
					code = 200;
				}
				if (ipcHypixelPlayer.status == 403 && cause != "Too many invalid API keys") {
					useConfigStore.getState().setErrorMessage({
						code: 403,
						title: "Invalid Hypixel Key",
						cause: "Invalid Hypixel API key. Generate a new one with /api new.",
						detail: "This key has been suspended by Hypixel, Please enter a new one.",
						referenceId: "HYPIXEL_KEY_LOCK",
						type: "WARNING",
					});
					useConfigStore.getState().setStore({
						...useConfigStore.getState(),
						hypixel: {
							...useConfigStore.getState().hypixel,
							apiKeyValid: false,
						},
					});
				} else if (cause == "Too many invalid API keys") {
					useConfigStore.getState().setErrorMessage({
						code: 403,
						title: "Too many invalid API keys",
						cause: "Too many invalid API keys",
						detail: "Too many invalid API keys. This is an unknown error.",
						referenceId: "HYPIXEL_KEY_INVALID_KEYS",
						type: "WARNING",
					});
				}

				playerObject.status = code;
				playerObject.cause = cause;
				playerData = { nicked: true, name: username, last_nick_encountered: Date.now() };
			} else {
				if ("hypixelPlayer" in playerData && !playerData.denicked) {
					playerData.id = ipcHypixelPlayer.data.uuid;
					playerData.hypixelPlayer = ipcHypixelPlayer.data;
					if (ipcHypixelPlayer.limit && ipcHypixelPlayer.limit?.remaining < 20) {
						useConfigStore.getState().setErrorMessage({
							title: "Approaching rate limit",
							cause: `Slow down! ${ipcHypixelPlayer.limit.limit - ipcHypixelPlayer.limit.remaining} / ${ipcHypixelPlayer.limit.limit} (${ipcHypixelPlayer.limit.reset} seconds remaining)`,
							type: "WARNING",
							code: 429
						});
					}
				}
			}

			playerObject.data = playerData;
			const exists = get().players.findIndex((player) => player.name.toLowerCase() == playerData.name.toLowerCase());
			if (exists == -1) {
				set((state) => ({
					players: [...state.players, playerData],
				}));
			} else {
				set((state) => {
					const playerArr = [...state.players];
					playerArr[exists] = playerData;
					return {
						players: playerArr,
					};
				});
			}
		} catch (e) {
			const mcUtilsRequest = await window.ipcRenderer.invoke<PlayerDB>(IpcValidInvokeChannels.PLAYER_DB, [RequestType.USERNAME, playerData.name.replaceAll("-", "")]);
			const mcUtils = mcUtilsRequest.data;
			playerData = mcUtilsRequest.status == 200 ? { ...defaultPlayer, nicked: false } : { name: username, nicked: true, last_nick_encountered: Date.now() };
			if (mcUtilsRequest.status === 200 && "hypixelPlayer" in playerData) {
				playerData.id = mcUtils.data.player.id;
				playerData.name = mcUtils.data.player.username;
				const ipcHypixelPlayer = await window.ipcRenderer.invoke<Components.Schemas.Player>(IpcValidInvokeChannels.HYPIXEL, [RequestType.UUID, hypixel.apiKey, mcUtils.data.player.id]);
				playerData.hypixelPlayer = ipcHypixelPlayer.data;
			} else {
				playerObject.status = mcUtilsRequest.status;
				playerData = { nicked: true, name: username, last_nick_encountered: Date.now() };
				get().updatePlayerState(playerData);
				playerObject.cause = "try catch";
			}
		}

		if ("hypixelPlayer" in playerData) {
			const [runApi] = await Promise.all([getRunApi(playerData)]);
			if (runApi.data && runApi.data.code == 200) {
				playerData.sources.runApi = runApi.data;
				playerObject.data = playerData;
				get().updatePlayerState(playerData);
				playerData.bot = playerData.sources.runApi.data.bot.tagged;
				if (!playerData.bot && !playerData.sources.runApi.data.blacklist.tagged) {
					get().updatePlayerState(playerData);

					if (settings.preferences.customFile) {
						if (customFile.data != null) {
							if (typeof customFile?.data[0] === "string") {
								const datum = customFile.data as string[];
								datum.map(async (player) => {
									if (player.toLowerCase() == playerData.name.toLowerCase() && "hypixelPlayer" in playerData) {
										if (playerData.sources.runApi != null) {
											playerData.sources.runApi.data.blacklist.tagged = true;
											playerData.sources.runApi.data.blacklist.reason = "Blacklist File";
										}
									}
								});
							} else {
								const datum = customFile.data as Array<CustomFileJsonType>;
								datum.map(async (player) => {
									if ("hypixelPlayer" in playerData) {
										if (player.uuid == playerData.hypixelPlayer?.uuid) {
											playerData.sources.customFile = player;
											if (playerData.sources.runApi != null) {
												playerData.sources.runApi.data.blacklist.tagged = player.blacklisted;
												playerData.sources.runApi.data.blacklist.reason = "Blacklist File";
											}
										}
									}
								});
							}
						}
					}

					if (settings.preferences.customUrl) {
						const [custom_api] = await Promise.all([getCustomApi(playerData)]);
						if (custom_api.data != null) {
							const data = custom_api.data;
							if (data.blacklisted) {
								playerData.sources.runApi.data.blacklist.tagged = true;
							}
							playerData.sources.customApi = data;
						}
					}

					const [boomza, lunarApi, hypixelFriends, hypixelGuild] = await Promise.all([getBoomza(playerData), getLunarTags(playerData), getHypixelFriends(playerData), getGuildData(playerData)]);
					playerData.sources.boomza = boomza;
					playerData.hypixelFriends = hypixelFriends;
					playerData.hypixelGuild = hypixelGuild;
					if (lunarApi?.data?.code == 200) {
						playerData.sources.lunar = lunarApi.data;
					}
					get().updatePlayerState(playerData);

					const [keathizApi] = await Promise.all([getKeathizData(playerData)]);
					playerData.sources.keathiz = keathizApi;
					get().updatePlayerState(playerData);

					const [polsuSession] = await Promise.all([getPolsuSession(playerData)]);
					playerData.sources.polsu = {
						sessions: polsuSession,
					};
					get().updatePlayerState(playerData);
				}
			} else {
				if (runApi.data) {
					// @ts-ignore
					if (runApi.data.code == 403) {
						useConfigStore.getState().setErrorMessage({
							code: 403,
							title: "Locked RUN Key",
							cause: "The RUN Key provided is currently locked, Please contact support.",
							detail: "This key has been locked for security reasons, please contact support.",
							referenceId: "RUN_KEY_LOCK",
							type: "WARNING",
						});
					} else {
						useConfigStore.getState().setRunApiKey(run.apiKey);
					}
				}
			}
		}

		if ("hypixelPlayer" in playerData) {
			playerData.loaded = true;
			const player = playerData.hypixelPlayer;
			const polsuPost = {
				player: {
					achievements: {
						bedwars_level: player.achievements.bedwars_level
					},
					uuid: player.uuid,
					displayname: player.displayname,
					newPackageRank: player.newPackageRank,
					rankPlusColor: player.rankPlusColor,
					monthlyPackageRank: player.monthlyPackageRank,
					stats: {
						Bedwars: {
							gold_resources_collected_bedwars: player.stats.Bedwars?.gold_resources_collected_bedwars ?? 0,
							iron_resources_collected_bedwars: player.stats.Bedwars?.iron_resources_collected_bedwars ?? 0,
							emerald_resources_collected_bedwars: player.stats.Bedwars?.emerald_resources_collected_bedwars ?? 0,
							diamond_resources_collected_bedwars: player.stats.Bedwars?.diamond_resources_collected_bedwars ?? 0,
							_items_purchased_bedwars: player.stats.Bedwars?._items_purchased_bedwars ?? 0,
							permanent_items_purchased_bedwars: player.stats.Bedwars?.permanent_items_purchased_bedwars ?? 0,
							favourites_2: player.stats.Bedwars?.favourites_2 ?? "",
							favorite_slots: player.stats.Bedwars?.["favorite_slots"] ?? ""
						}
					}
				}
			};
			window.ipcRenderer.invoke(IpcValidInvokeChannels.POLSU, ["quickbuy", useConfigStore.getState().polsu.apiKey, playerData.hypixelPlayer.uuid, JSON.stringify(polsuPost)]);
		}

		playerObject.data = playerData;
		get().updatePlayerState(playerData);
		await get().updatePlayers();
	},
	removePlayer: async (username: string) => {
		set((state) => ({
			players: state.players.filter((player) => player.name.toLowerCase() !== username.toLowerCase())
		}));
	},
	clearPlayers: async () => {
		set(() => ({
			players: [],
		}));
	},
	updatePlayers: async () => {
		const storedPlayers = get().players;
		for (const player of storedPlayers) {
			const config = useConfigStore.getState();
			if ("hypixelPlayer" in player) {
				if (config.settings.keathiz && player.sources?.keathiz == null) {
					const responseIPCResponse = await window.ipcRenderer.invoke<KeathizOverlayRun>(IpcValidInvokeChannels.KEATHIZ, [KeathizEndpoints.OVERLAY_RUN, player.hypixelPlayer.uuid]);
					if (responseIPCResponse.status == 200) {
						player.sources.keathiz = responseIPCResponse;
					}
				}
				if (config.settings.lunar && player.sources?.lunar == null) {
					const responseIPCResponse = await getLunarTags(player);
					if (responseIPCResponse?.data?.code == 200) {
						player.sources.lunar = responseIPCResponse.data;
					}
				}
				if (config.settings.boomza && player.sources?.boomza == null) {
					const responseIPCResponse = await getBoomza(player);
					if (responseIPCResponse.status == 200) {
						player.sources.boomza = responseIPCResponse;
					}
				}
				if (config.settings.run.friends && player?.hypixelFriends?.data != undefined) {
					const p1Friends = player?.hypixelFriends?.data;
					const now = Date.now();
					if (p1Friends !== undefined) {
						for (const friendUuid of p1Friends) {
							for (const statePlayers of storedPlayers) {
								if (!player.friended) {
									const started = friendUuid?.started ?? Date.now();
									const twoWeeks = 86400000 * 14;
									if (now - twoWeeks > started && !player.friended) {
										if (friendUuid?.uuidReceiver === player?.hypixelPlayer?.uuid) {
											if ("hypixelPlayer" in statePlayers && friendUuid?.uuidSender?.includes(statePlayers?.hypixelPlayer?.uuid ?? "")) {
												player.friended = true;
												statePlayers.friended = true;
											}
										} else {
											if ("hypixelPlayer" in statePlayers && friendUuid?.uuidReceiver?.includes(statePlayers?.hypixelPlayer?.uuid ?? "")) {
												player.friended = true;
												statePlayers.friended = true;
											}
										}
									}
									set({
										players: storedPlayers,
									});
								}
							}
						}
					}
				}
			}
		}
	},
	updatePlayerState: async (playerObject) => {
		const exists = get().players.findIndex((player) => player.name == playerObject.name);
		if (exists != -1) {
			set((state) => {
				const playerArr = [...state.players];
				playerArr[exists] = playerObject;
				return {
					players: playerArr
				};
			});
		}
	},
	setStore: (store) => set(store),
	party: {
		partyStore: Array<string>(),
		addPartyMember: () => {},
		removePartyMember: () => {},
	},
	tagStore: {
		config: {},
		tags: {},
	},
}));

const getBoomza = async (player: Player) => {
	let api: IPCResponse<BoomzaAntisniper>;
	if ("hypixelPlayer" in player && player?.hypixelPlayer?.displayname && useConfigStore.getState().settings.boomza) {
		api = await window.ipcRenderer.invoke<BoomzaAntisniper>(IpcValidInvokeChannels.BOOMZA, [player.hypixelPlayer.displayname]);
	} else {
		api = {
			data: { sniper: false, report: 0, error: false, username: player.name },
			status: useConfigStore.getState().settings.boomza ? 417 : 400,
		};
	}
	return new Promise<IPCResponse<BoomzaAntisniper>>((resolve) => resolve(api));
};

const getCustomApi = async (player: Player) => {
	let api: IPCResponse<CustomFileJsonType>;
	if ("hypixelPlayer" in player && player?.hypixelPlayer?.displayname && useConfigStore.getState().settings.preferences.customUrl) {
		const { hypixelPlayer } = player;
		let url = useConfigStore.getState().customApi.url.toLowerCase() + "&requesttype=seraphoverlay";

		if (url.match(/({uuid})/gi)) {
			url = url.replaceAll(/({uuid})/gi, hypixelPlayer.uuid);
		}
		if (url.match(/({name})/gi)) {
			url = url.replaceAll(/({name})/gi, hypixelPlayer.displayname);
		}
		if (url.match(/({hypixelapikey})/gi)) {
			url = url.replaceAll(/({hypixelapikey})/gi, useConfigStore.getState().hypixel.apiKey);
		}
		if (url.match(/({seraphapikey})/gi)) {
			url = url.replaceAll(/({seraphapikey})/gi, useConfigStore.getState().run.apiKey);
		}

		url = url.trim();
		api = await window.ipcRenderer.invoke<CustomFileJsonType>(IpcValidInvokeChannels.CUSTOM_URL, [url]);
	} else {
		api = {
			data: {
				uuid: "",
				blacklisted: false,
				tags: [],
			},
			status: 200,
		};
	}
	return new Promise<IPCResponse<CustomFileJsonType>>((resolve) => resolve(api));
};

const getRunApi = async (player: Player) => {
	if ("hypixelPlayer" in player && player.hypixelPlayer) {
		const { hypixelPlayer } = player;
		const state = useConfigStore.getState();
		const { data, status } = await window.ipcRenderer.invoke<Awaited<SeraphResponse<Blacklist>>>(IpcValidInvokeChannels.SERAPH, [RunEndpoints.BLACKLIST, hypixelPlayer.uuid, state.hypixel.apiKey, state.hypixel.apiKeyOwner, state.run.apiKey, state.hypixel.apiKeyOwner]);
		return { data };
	}
	return { data: null };
};

const getLunarTags = async (player: Player) => {
	if ("hypixelPlayer" in player && player.hypixelPlayer?.uuid !== undefined && useConfigStore.getState().settings.lunar) {
		const { data } = await window.ipcRenderer.invoke<Awaited<SeraphResponse<LunarAPIResponse>>>(IpcValidInvokeChannels.LUNAR, [player.hypixelPlayer.uuid]);
		return { data };
	}
	return { data: null };
};

const getKeathizData = async (player: Player) => {
	let api = {
		status: useConfigStore.getState().settings.keathiz ? 417 : 400,
		data: {
			success: false,
			player: {
				ign_lower: player.name,
				queues: {
					last_3_min: 0,
					last_10_min: 0,
					last_30_min: 0,
					last_24_hours: 0,
					last_48_hours: 0,
					total: 0,
					consecutive_queue_checks: {
						last_1000_queues: {
							"1_min_requeue": 0,
							"2_min_requeue": 0,
							"3_min_requeue": 0,
						},
						last_30_queues: {
							"1_min_requeue": 0,
							"2_min_requeue": 0,
							"3_min_requeue": 0,
						},
						last_10_queues: {
							"1_min_requeue": 0,
							"2_min_requeue": 0,
							"3_min_requeue": 0,
						},
						weighted: {
							"1_min_requeue": 0,
							"2_min_requeue": 0,
							"3_min_requeue": 0,
						},
					},
				},
				exits: {
					last_3_min: 0,
					last_10_min: 0,
					last_30_min: 0,
					last_24_hours: 0,
					last_48_hours: 0,
					total: 0,
					short_exits: 0,
				},
				winstreak: {
					accurate: false,
					date: 0,
					estimates: {
						overall_winstreak: 0,
						eight_one_winstreak: 0,
						eight_two_winstreak: 0,
						four_three_winstreak: 0,
						four_four_winstreak: 0,
						two_four_winstreak: 0,
						castle_winstreak: 0,
						eight_one_rush_winstreak: 0,
						eight_two_rush_winstreak: 0,
						four_four_rush_winstreak: 0,
						eight_one_ultimate_winstreak: 0,
						eight_two_ultimate_winstreak: 0,
						four_four_ultimate_winstreak: 0,
						eight_two_armed_winstreak: 0,
						four_four_armed_winstreak: 0,
						eight_two_lucky_winstreak: 0,
						four_four_lucky_winstreak: 0,
						eight_two_voidless_winstreak: 0,
						four_four_voidless_winstreak: 0,
						tourney_bedwars_two_four_0_winstreak: 0,
						tourney_bedwars4s_0_winstreak: 0,
						tourney_bedwars4s_1_winstreak: 0,
						eight_two_underworld_winstreak: 0,
						four_four_underworld_winstreak: 0,
						eight_two_swap_winstreak: 0,
						four_four_swap_winstreak: 0,
					},
				},
				extra: {
					last_seen_lobby: "",
					blacklisted: false,
					status: "",
				},
			},
		},
	};
	if ("hypixelPlayer" in player && player.hypixelPlayer?.uuid !== undefined && useConfigStore.getState().keathiz.valid && useConfigStore.getState().settings.keathiz) {
		const state = useConfigStore.getState();
		if (state != undefined) {
			let ipcKeathiz;
			try {
				ipcKeathiz = await window.ipcRenderer.invoke<KeathizOverlayRun>(IpcValidInvokeChannels.KEATHIZ, [KeathizEndpoints.OVERLAY_RUN, player.hypixelPlayer.uuid, state.keathiz.key]);
			} catch (e) {
				ipcKeathiz = api;
			}
			api = ipcKeathiz;
		}
	}
	return api;
};

const getHypixelFriends = async (player: Player) => {
	let api: IPCResponse<{ _id: string; uuidSender: string; uuidReceiver: string; started: number }[]>;
	if ("hypixelPlayer" in player && player.hypixelPlayer?.uuid !== undefined && useConfigStore.getState().settings.run.friends) {
		const state = useConfigStore.getState();
		api = await window.ipcRenderer.invoke(IpcValidInvokeChannels.HYPIXEL, [RequestType.FRIENDS, state.hypixel.apiKey, player.hypixelPlayer.uuid]);
	} else {
		api = {
			data: [],
			status: 400,
		};
	}
	return api;
};

const getGuildData = async (player: Player) => {
	let api: IPCResponse<Components.Schemas.Guild> | null;
	if ("hypixelPlayer" in player && player.hypixelPlayer?.uuid !== undefined && useConfigStore.getState().settings.hypixel.guilds) {
		const state = useConfigStore.getState();
		api = await window.ipcRenderer.invoke<Components.Schemas.Guild>(IpcValidInvokeChannels.HYPIXEL, [RequestType.GUILD_PLAYER, state.hypixel.apiKey, player.hypixelPlayer.uuid]);
	} else {
		api = null;
	}
	return api;
};

const getPolsuSession = async (player: Player) => {
	let api: IPCResponse<Session> | undefined;
	if ("hypixelPlayer" in player && player.hypixelPlayer?.uuid !== undefined && useConfigStore.getState().settings.polsu.enabled && useConfigStore.getState().settings.polsu.sessions) {
		const { polsu } = useConfigStore.getState();
		const { data } = await window.ipcRenderer.invoke<IPCResponse<Session>>(IpcValidInvokeChannels.POLSU, ["session", polsu.apiKey, player.hypixelPlayer.uuid]);
		api = data;
	} else {
		api = {
			data: {
				player: {
					uuid: "",
					username: "",
					last_changed: 0,
				},
				uuid: "",
				session: 0,
				started: 0,
				stars: 768,
				experience: 0,
				games: {
					total: 0,
					solos: 0,
					doubles: 0,
					threes: 0,
					fours: 0,
					fvf: 0,
				},
				resources: {
					iron: 0,
					gold: 0,
					emeralds: 0,
					diamonds: 0,
				},
				purchased: {
					permanent: 0,
					nonpermanent: 0,
				},
				stats: {
					wins: 0,
					losses: 0,
					kills: 0,
					deaths: 0,
					fkills: 0,
					fdeaths: 0,
					bbroken: 0,
					blost: 0,
				},
				last_checked: {
					timestamp: 0,
					xp: 0,
				},
				new: true,
			},
			status: 400,
		};
	}
	return api;
};

export default usePlayerStore;
