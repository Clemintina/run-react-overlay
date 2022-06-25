import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Player} from "@common/utils/PlayerUtils";
import {Blacklist, BlacklistIPC, PlayerAPI, RequestType, RunEndpoints} from "@common/utils/externalapis/RunApi";
import store, {Store} from "./index";
import {PlayerHandler} from "@common/utils/Schemas";
import {Components} from "@common/zikeji";
import {useDispatch} from "react-redux";
import {BoomzaAntisniper} from "@common/utils/externalapis/BoomzaApi";

export interface PlayerStoreThunkObject {
    name: string;
    apiKey?: string | undefined;
    apiKeyOwner?: string | undefined;
    runKey?: string | undefined;
}

export interface PlayerStore {
    players: Array<Player>;
}

interface PlayerTransfer {
    player: Player;
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
export const getPlayerHypixelData = createAsyncThunk<any, any, {state: Store}>("PlayerStore/getPlayerHypixelData", async (thunkObject: PlayerStoreThunkObject, thunkAPI) => {
    console.time(thunkObject.name);
    const playerData: Player = {
        name: thunkObject.name,
        id: null,
        nicked: false,
        bot: false,
        hypixelGuild: null,
        hypixelPlayer: null,
        runApi: null,
        boomza: null,
    };
    let hypixelPlayer: Components.Schemas.Player;

    const state = cacheState;

    const apiKey = state.apiKey;
    const apiKeyOwner = state.apiKeyOwner;
    const runApiKey = state.runKey;

    if (apiKey === undefined || apiKey.length !== 36) {
        return {status: 403, cause: "No API Key", data: null};
    }

    try {
        hypixelPlayer = playerData.name.length <= 16 ? await window.ipcRenderer.invoke("hypixel", apiKey, RequestType.USERNAME, playerData.name) : await window.ipcRenderer.invoke("hypixel", apiKey, RequestType.UUID, playerData.name.replace("-", ""));
        playerData.hypixelPlayer = hypixelPlayer;
        if (playerData.hypixelPlayer?.uuid === undefined) {
            playerData.nicked = true;
            return {status: 400, cause: "Player is not valid on Hypixel!", data: playerData};
        } else {
            playerData.id = hypixelPlayer.uuid;
        }
    } catch (e) {
        const mcUtilsRequest = await window.ipcRenderer.invoke("mcutils", RequestType.USERNAME, playerData.name);
        const mcUtils: PlayerAPI = mcUtilsRequest.data;
        playerData.nicked = true;
        if (mcUtilsRequest.status === 400) {
            return {status: 400, cause: "Player is not valid for Mojang!", data: playerData};
        } else if (mcUtils.player.username === null || mcUtils.player.uuid === null) {
            playerData.nicked = true;
            return {status: 400, cause: "Player is not valid for Mojang!", data: playerData};
        } else {
            playerData.nicked = false;
            playerData.id = mcUtils.player.uuid;
            hypixelPlayer = await window.ipcRenderer.invoke("hypixel", apiKey, RequestType.UUID, mcUtils.player.uuid);
        }
    }

    playerData.hypixelPlayer = hypixelPlayer;

    if (!playerData.nicked) {
        const [boomza, runApi] = await Promise.all([getBoomza(playerData), getRunApi(playerData)]);
        playerData.boomza = boomza;
        playerData.runApi = runApi.data;
    }

    console.timeEnd(thunkObject.name);
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

export const playerInitScript = createAsyncThunk("PlayerStore/Init", async () => {
    cacheState.apiKey = await window.config.get("hypixel.apiKey");
    cacheState.apiKeyOwner = await window.config.get("hypixel.apiKeyOwner");
    cacheState.runKey = await window.config.get("run.apiKey");
    return true;
});

const getBoomza = async (player: Player) => {
    const boomzaApi: BoomzaAntisniper = await window.ipcRenderer.invoke("boomza", player.name);
    return new Promise<BoomzaAntisniper>((resolve) => resolve(boomzaApi));
};

const getRunApi = async (player: Player) => {
    let runApi: BlacklistIPC;
    if (player.hypixelPlayer?.uuid !== undefined) {
        const state = cacheState;
        runApi = await window.ipcRenderer.invoke("seraph", RunEndpoints.BLACKLIST, player.hypixelPlayer.uuid, state.apiKey, state.apiKeyOwner, state.runKey, state.apiKeyOwner);
    } else {
        runApi = {
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
    return new Promise<BlacklistIPC>((resolve) => resolve(runApi));
};

/**
 * Creates a **slice** which, is specific to storing player data within the overlay.
 */
const PlayerStore = createSlice({
    name: "PlayerStore",
    initialState: {
        players: Array<Player>(),
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
            });
    },
});

export default PlayerStore.reducer;
