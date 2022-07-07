import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Player} from "@common/utils/PlayerUtils";
import {Blacklist, IPCResponse, LunarAPIResponse, PlayerAPI, RequestType, RunEndpoints} from "@common/utils/externalapis/RunApi";
import store, {Store} from "./index";
import {PlayerHandler, StoreObject} from "@common/utils/Schemas";
import {Components} from "@common/zikeji";
import {BoomzaAntisniper, KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {PlayerDB} from "@common/utils/externalapis/PlayerDB";

export interface PlayerStoreThunkObject {
    name: string;
    apiKey?: string | undefined;
    apiKeyOwner?: string | undefined;
    runKey?: string | undefined;
}

export interface PlayerStore {
    players: Array<Player>;
}

const cacheState: PlayerStoreThunkObject = {
    name: "",
    apiKey: "",
    apiKeyOwner: "",
    runKey: "",
};

/**
 * Adds players to the Overlay Table.
 */
export const getPlayerHypixelData = createAsyncThunk<any, any, {state: Store}>("PlayerStore/getPlayerHypixelData", async (thunkObject: PlayerStoreThunkObject) => {
    const playerData: Player = {
        name: thunkObject.name,
        id: null,
        nicked: false,
        bot: false,
        hypixelGuild: null,
        hypixelPlayer: null,
        sources: {
            runApi: null,
        },
        overlay: {
            tags: "",
        },
    };
    const apiKey = cacheState.apiKey;

    if (apiKey === undefined || apiKey.length !== 36) {
        return {status: 403, cause: "No API Key", data: null};
    }

    try {
        const ipcHypixelPlayer = playerData.name.length <= 16 ? await window.ipcRenderer.invoke<IPCResponse<Components.Schemas.Player>>("hypixel", RequestType.USERNAME, playerData.name) : await window.ipcRenderer.invoke<IPCResponse<Components.Schemas.Player>>("hypixel", RequestType.UUID, playerData.name.replace("-", ""));
        if (ipcHypixelPlayer.data?.uuid === undefined) {
            playerData.nicked = true;
            return {status: 400, cause: "Player is not valid on Hypixel!", data: playerData};
        } else {
            playerData.id = ipcHypixelPlayer.data.uuid;
        }
        playerData.hypixelPlayer = ipcHypixelPlayer.data;
    } catch (e) {
        const mcUtilsRequest = await window.ipcRenderer.invoke<IPCResponse<PlayerAPI>>("mcutils", RequestType.USERNAME, playerData.name);
        const mcUtils = mcUtilsRequest.data;
        playerData.nicked = true;
        if (mcUtilsRequest.status === 200) {
            playerData.nicked = false;
            playerData.id = mcUtils.player.uuid;
            const ipcHypixelPlayer = await window.ipcRenderer.invoke<IPCResponse<Components.Schemas.Player>>("hypixel", apiKey, RequestType.UUID, mcUtils.player.uuid);
            playerData.hypixelPlayer = ipcHypixelPlayer.data;
        } else if (mcUtilsRequest.status === 400) {
            return {status: 400, cause: "Player is not valid for Mojang!", data: playerData};
        } else if (mcUtils.player.username === null || mcUtils.player.uuid === null) {
            playerData.nicked = true;
            return {status: 400, cause: "Player is not valid for Mojang!", data: playerData};
        }
    }

    if (!playerData.nicked && playerData.hypixelPlayer != null) {
        const [runApi] = await Promise.all([getRunApi(playerData)]);
        playerData.sources.runApi = runApi;
        playerData.bot = runApi.data.data.bot.tagged;
        if (!playerData.bot) {
            const [boomza, keathizApi, lunarApi, playerDatabase] = await Promise.all([getBoomza(playerData), getKeathizData(playerData), getLunarTags(playerData), getPlayerDB(playerData)]);
            playerData.sources.boomza = boomza;
            playerData.sources.keathiz = keathizApi;
            playerData.sources.lunar = lunarApi;
            playerData.sources.playerDb = playerDatabase;
        }
    }

    return {
        status: 200,
        cause: "valid request",
        data: playerData,
    };
});

/**
 * Removes a player from the Overlay Table
 */
export const removePlayerFromOverlay = createAsyncThunk("PlayerStore/removePlayerFromOverlay", async (thunkObject: PlayerStoreThunkObject) => {
    return thunkObject;
});
/**
 * Resets the Overlay Table
 */
export const resetOverlayTable = createAsyncThunk("PlayerStore/resetOverlayTable", async () => {
    return true;
});

export const updatePlayerStores = createAsyncThunk("PlayerStore/updateStore", async () => {
    return await window.ipcRenderer.invoke<IPCResponse<StoreObject>>("getWholeStore");
});

export const playerInitScript = createAsyncThunk("PlayerStore/Init", async () => {
    [cacheState.apiKey, cacheState.apiKeyOwner, cacheState.runKey] = await Promise.all([window.config.get("hypixel.apiKey"), window.config.get("hypixel.apiKeyOwner"), window.config.get("run.apiKey")]);
    store.dispatch(updatePlayerStores());
    return true;
});

const getBoomza = async (player: Player) => {
    const api: IPCResponse<BoomzaAntisniper> = await window.ipcRenderer.invoke("boomza", player.name);
    return new Promise<IPCResponse<BoomzaAntisniper>>((resolve) => resolve(api));
};

const getRunApi = async (player: Player) => {
    let api;
    if (player.hypixelPlayer?.uuid !== undefined) {
        const state = cacheState;
        api = await window.ipcRenderer.invoke<IPCResponse<Blacklist>>("seraph", RunEndpoints.BLACKLIST, player.hypixelPlayer.uuid, state.apiKey, state.apiKeyOwner, state.runKey, state.apiKeyOwner);
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
    if (player.hypixelPlayer?.uuid !== undefined) {
        api = await window.ipcRenderer.invoke<IPCResponse<LunarAPIResponse>>("lunar", player.hypixelPlayer.uuid);
    } else {
        api = {
            status: 400,
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
    let api: IPCResponse<KeathizOverlayRun>;
    if (player.hypixelPlayer?.uuid !== undefined) {
        api = await window.ipcRenderer.invoke("keathiz", player.hypixelPlayer.uuid);
    } else {
        api = {
            status: 400,
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
    return new Promise<IPCResponse<KeathizOverlayRun>>((resolve) => resolve(api));
};

const getPlayerDB = async (player: Player) => {
    const api: IPCResponse<PlayerDB> = await window.ipcRenderer.invoke("playerdb", player.hypixelPlayer?.uuid);
    return new Promise<IPCResponse<PlayerDB>>((resolve) => resolve(api));
};

/**
 * Creates a **slice** which, is specific to storing player data within the overlay.
 */
const PlayerStore = createSlice({
    name: "PlayerStore",
    initialState: {
        players: Array<Player>(),
        tagStore: {
            config: {},
            tags: {},
        },
    },
    reducers: {
        removePlayer: (state, action: {payload: PlayerStoreThunkObject}) => {
            const {name} = action.payload;
            state.players = state.players.filter((player: Player) => player.name !== name);
        },
        updatePlayer: (state, action: {payload: PlayerHandler}) => {
            const payload: PlayerHandler = action.payload;
            if (payload !== undefined && payload.status === 200 && payload.data !== undefined && !payload.data.nicked) {
                const playerPayload: Player = payload.data;
                const doesPlayerExist = state.players.findIndex((player: Player) => player.name === playerPayload.name);
                if (doesPlayerExist !== -1) {
                    state.players[doesPlayerExist] = payload.data;
                } else {
                    state.players.push(playerPayload);
                }
            } else {
                if (payload !== undefined && payload.status === 400 && payload.data !== undefined) {
                    const playerPayload: Player = payload.data;
                    const doesPlayerExist = state.players.findIndex((player: Player) => player.name === playerPayload.name);
                    if (doesPlayerExist !== -1) {
                        state.players[doesPlayerExist] = playerPayload;
                    } else {
                        state.players.push(playerPayload);
                    }
                }
            }
        },
        resetTable: (state) => {
            state.players = [];
        },
        updateStore: (state, action: {payload: IPCResponse<StoreObject>}) => {
            const payload: IPCResponse<StoreObject> = action.payload;
            if (payload.status === 200) {
                state.tagStore = payload.data;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPlayerHypixelData.fulfilled, (state, action: {payload: PlayerHandler}) => {
                PlayerStore.caseReducers.updatePlayer(state, action);
            })
            .addCase(getPlayerHypixelData.rejected, (state, action: {payload}) => {
                PlayerStore.caseReducers.updatePlayer(state, action);
            })
            .addCase(removePlayerFromOverlay.fulfilled, (state, action) => {
                const payload: PlayerStoreThunkObject = action.payload;
                PlayerStore.caseReducers.removePlayer(state, {payload});
            })
            .addCase(resetOverlayTable.fulfilled, (state) => {
                PlayerStore.caseReducers.resetTable(state);
            })
            .addCase(updatePlayerStores.fulfilled, (state, action: {payload: IPCResponse<StoreObject>}) => {
                PlayerStore.caseReducers.updateStore(state, action);
            });
    },
});

export default PlayerStore.reducer;
