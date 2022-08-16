import create from "zustand";
import {Player} from "@common/utils/PlayerUtils";
import {Components} from "@common/zikeji";
import {Blacklist, IPCResponse, LunarAPIResponse, PlayerAPI, RequestType, RunEndpoints} from "@common/utils/externalapis/RunApi";
import {BoomzaAntisniper, KeathizDenick, KeathizEndpoints, KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {PlayerDB} from "@common/utils/externalapis/PlayerDB";
import useConfigStore, {ConfigStore} from "@renderer/store/zustand/ConfigStore";

export type PlayerStore = {
    players: Array<Player>;
    addPlayer: (username) => void;
    removePlayer: (username) => void;
    updatePlayers: () => void;
    clearPlayers: () => void;
    setStore: (store) => void;
    tagStore: {
        config: object;
        tags: object;
    };
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
    players: Array<Player>(),
    addPlayer: async (username: string) => {
        const playerData: Player = {
            name: username.toLowerCase(),
            nick: username,
            id: null,
            nicked: false,
            bot: false,
            hypixelGuild: null,
            hypixelPlayer: null,
            denicked: false,
            sources: {
                runApi: null,
            },
        };
        const playerObject: IPCResponse<Player> = {status: 400, cause: "none", data: playerData};
        const configStore: ConfigStore = useConfigStore.getState();
        const apiKey = configStore.hypixel.apiKey;

        if (apiKey === undefined || apiKey.length !== 36) {
            configStore.setErrorMessage({
                title: "No Hypixel API Key",
                cause: "No Hypixel API Key",
                code: 400,
            });
            return {status: 403, cause: "No API Key", data: null};
        }

        if (configStore.nicks.some(nickname => nickname.nick.toLowerCase() == username.toLowerCase())) {
            playerData.name = configStore.nicks.filter(nickname => nickname.nick.toLowerCase() == username.toLowerCase())[0].uuid;
        }

        try {
            const ipcHypixelPlayer = playerData.name.length <= 17 ? await window.ipcRenderer.invoke<Components.Schemas.Player>("hypixel", RequestType.USERNAME, playerData.name, apiKey) : await window.ipcRenderer.invoke<Components.Schemas.Player>("hypixel", RequestType.UUID, playerData.name.replace("-", ""), apiKey);
            if (ipcHypixelPlayer?.data?.uuid == null && configStore?.settings?.keathiz) {
                const ipcKeathizDenicker = await window.ipcRenderer.invoke<KeathizDenick>("keathiz", KeathizEndpoints.DENICK, playerData.name);
                if (ipcKeathizDenicker.data?.player?.uuid) {
                    const newIpcHypixelPlayer = await window.ipcRenderer.invoke<Components.Schemas.Player>("hypixel", RequestType.UUID, ipcKeathizDenicker.data.player.uuid);
                    if (newIpcHypixelPlayer?.data?.uuid != null) {
                        playerData.hypixelPlayer = newIpcHypixelPlayer.data;
                        playerData.denicked = true;
                    }
                }
            }

            if ((ipcHypixelPlayer?.data?.uuid == null || ipcHypixelPlayer.status != 200) && !playerData.denicked) {
                const data: unknown = ipcHypixelPlayer.data;
                let cause, code;
                if (typeof data === "string") {
                    cause = data;
                    code = ipcHypixelPlayer.status;
                } else {
                    cause = "Player is not valid on Hypixel!";
                    code = 200;
                }
                playerObject.status = code;
                playerData.nicked = true;
                playerObject.cause = cause;
            } else {
                if (!playerData.denicked) {
                    playerData.id = ipcHypixelPlayer.data.uuid;
                    playerData.hypixelPlayer = ipcHypixelPlayer.data;
                    playerData.nicked = false;
                }
            }
        } catch (e) {
            const mcUtilsRequest = await window.ipcRenderer.invoke<PlayerAPI>("mcutils", RequestType.USERNAME, playerData.name);
            const mcUtils = mcUtilsRequest.data;
            playerData.nicked = true;
            if (mcUtilsRequest.status === 200) {
                playerData.nicked = false;
                playerData.id = mcUtils.player.uuid;
                const ipcHypixelPlayer = await window.ipcRenderer.invoke<Components.Schemas.Player>("hypixel", apiKey, RequestType.UUID, mcUtils.player.uuid);
                playerData.hypixelPlayer = ipcHypixelPlayer.data;
            }
            playerObject.status = mcUtilsRequest.status;
            playerData.nicked = true;
            playerObject.cause = "try catch";
        }

        if (!playerData.nicked && playerData.hypixelPlayer != null) {
            const [runApi] = await Promise.all([getRunApi(playerData)]);
            playerData.sources.runApi = runApi;
            if (runApi.status == 200) {
                playerData.bot = runApi?.data?.data?.bot?.tagged ?? false;
                if (!playerData.bot) {
                    const [boomza, keathizApi, lunarApi, playerDatabase] = await Promise.all([getBoomza(playerData), getKeathizData(playerData), getLunarTags(playerData), getPlayerDB(playerData)]);
                    playerData.sources.boomza = boomza;
                    playerData.sources.keathiz = keathizApi;
                    playerData.sources.lunar = lunarApi;
                    playerData.sources.playerDb = playerDatabase;
                }
            } else {
                useConfigStore.getState().setErrorMessage({
                    code: 403,
                    title: "Locked RUN Key",
                    cause: "The RUN Key provided is currently locked, Please contact support.",
                    detail: "This key has been locked for security reasons, please contact support.",
                    referenceId: "RUN_KEY_LOCK",
                });
                const configStore = useConfigStore.getState();
                configStore.run.valid = false;
                useConfigStore.getState().setStore(configStore);
            }
        }

        playerObject.data = playerData;
        const exists = get().players.findIndex((player) => player.name == playerObject.data.name);

        if (exists == -1) {
            set((state) => ({
                players: [...state.players, playerObject.data],
            }));
        } else {
            set((state) => {
                const playerArr = [...state.players];
                playerArr[exists] = playerObject.data;
                return {
                    players: playerArr,
                };
            });
        }
    },
    removePlayer: async (username: string) => {
        set((state) => ({
            players: state.players.filter((player) => player.name !== username.toLowerCase()),
        }));
    },
    clearPlayers: async () => {
        set(() => ({
            players: [],
        }));
    },
    updatePlayers: async () => {
        for (const player of usePlayerStore.getState().players) {
            const config = useConfigStore.getState();
            if (player.hypixelPlayer?.uuid && !player.nicked) {
                if (config.settings.keathiz && player.sources.keathiz == null) {
                    const responseIPCResponse = await window.ipcRenderer.invoke<KeathizOverlayRun>("keathiz", KeathizEndpoints.OVERLAY_RUN, player.hypixelPlayer.uuid);
                    if (responseIPCResponse.status == 200) {
                        player.sources.keathiz = responseIPCResponse;
                    }
                }
                if (config.settings.lunar && player.sources.lunar == null) {
                    const responseIPCResponse = await window.ipcRenderer.invoke<LunarAPIResponse>("lunar", player.hypixelPlayer.uuid);
                    if (responseIPCResponse.status == 200) {
                        player.sources.lunar = responseIPCResponse;
                    }
                }
                if (config.settings.boomza && player.sources.boomza == null) {
                    const responseIPCResponse = await window.ipcRenderer.invoke<BoomzaAntisniper>("boomza", player.hypixelPlayer.displayname);
                    if (responseIPCResponse.status == 200) {
                        player.sources.boomza = responseIPCResponse;
                    }
                }
            }
        }
    },
    setStore: (store) => set(store),
    tagStore: {
        config: {},
        tags: {},
    },
}));

const getBoomza = async (player: Player) => {
    let api: IPCResponse<BoomzaAntisniper>;
    if (player.hypixelPlayer?.displayname && useConfigStore.getState().settings.boomza) {
        api = await window.ipcRenderer.invoke<BoomzaAntisniper>("boomza", player.hypixelPlayer.displayname);
    } else {
        api = {data: {sniper: false, report: 0, error: false, username: player.name}, status: useConfigStore.getState().settings.boomza ? 417 : 400};
    }
    return new Promise<IPCResponse<BoomzaAntisniper>>((resolve) => resolve(api));
};

const getRunApi = async (player: Player) => {
    let api;
    if (player.hypixelPlayer?.uuid !== undefined) {
        const state = useConfigStore.getState();
        api = await window.ipcRenderer.invoke<IPCResponse<Blacklist>>("seraph", RunEndpoints.BLACKLIST, player.hypixelPlayer.uuid, state.hypixel.apiKey, state.hypixel.apiKeyOwner, state.run.apiKey, state.hypixel.apiKeyOwner);
    } else {
        api = {
            data: {
                code: 400,
                data: {
                    annoylist: {tagged: false},
                    blacklist: {
                        reason: "",
                        report_type: "",
                        tagged: false,
                        timestamp: 0,
                    },
                    bot: {kay: false, tagged: false, unidentified: false},
                    customTag: null,
                    migrated: {tagged: false},
                    safelist: {
                        personal: false,
                        security_level: 0,
                        tagged: false,
                        timesKilled: 0,
                    },
                    statistics: {encounters: 0, threat_level: 0},
                    username: "",
                    uuid: "",
                },
                msTime: Date.now(),
                success: false,
            },
            status: 400,
        };
    }
    return new Promise<IPCResponse<Blacklist>>((resolve) => resolve(api));
};

const getLunarTags = async (player: Player) => {
    let api: IPCResponse<LunarAPIResponse>;
    if (player.hypixelPlayer?.uuid !== undefined && useConfigStore.getState().settings.lunar) {
        api = await window.ipcRenderer.invoke<LunarAPIResponse>("lunar", player.hypixelPlayer.uuid);
    } else {
        api = {
            status: useConfigStore.getState().settings.lunar ? 417 : 400,
            data: {
                code: 400,
                msTime: Date.now(),
                player: {
                    uuid: "unknown",
                    online: false,
                    status: "Error connecting to the server",
                    cosmetics: {activeCosmetics: [], cachedCosmetics: [], count: 0},
                    lunarPlus: {clothCloak: false, plusColour: 0, premium: false},
                    rank: {unknownBooleanB: false, unknownBooleanC: false},
                    unknown: {unknownBooleanA: false, unknownBooleanB: false, unknownBooleanC: false},
                },
                success: false,
            },
        };
    }
    return new Promise<IPCResponse<LunarAPIResponse>>((resolve) => resolve(api));
};

const getKeathizData = async (player: Player) => {
    let api;
    if (player?.hypixelPlayer?.uuid !== undefined && useConfigStore.getState().keathiz.valid && useConfigStore.getState().settings.keathiz) {
        const state = useConfigStore.getState();
        api = await window.ipcRenderer.invoke<KeathizOverlayRun>("seraph", RunEndpoints.KEATHIZ_PROXY, player.hypixelPlayer.uuid, state.keathiz.key, state.hypixel.apiKeyOwner, state.hypixel.apiKey, state.hypixel.apiKeyOwner);
    } else {
        api = {
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
    }
    return new Promise<IPCResponse<KeathizOverlayRun>>((resolve) => resolve({status: 200, data: api.data.data}));
};

const getPlayerDB = async (player: Player) => {
    let api: IPCResponse<PlayerDB>;
    if (player.hypixelPlayer?.uuid) api = await window.ipcRenderer.invoke<PlayerDB>("playerdb", player.hypixelPlayer?.uuid);
    else {
        api = {
            data: {
                code: "400",
                message: "invalid",
                data: {
                    player: {
                        meta: {
                            name_history: [],
                        },
                        username: "",
                        id: "",
                        raw_id: "",
                        avatar: "",
                    },
                },
                success: false,
            },
            status: 0,
        };
    }
    return new Promise<IPCResponse<PlayerDB>>((resolve) => resolve(api));
};

export default usePlayerStore;
