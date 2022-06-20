import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Player} from "@common/utils/PlayerUtils";
import {PlayerAPI, RequestType, RunEndpoints} from "@common/utils/externalapis/RunApi";
import {Store} from "./index";
import {PlayerHandler} from "@common/utils/Schemas";
import {Components} from "@common/zikeji";

export interface PlayerStoreThunkObject {
    name: string,
    apiKey?: string | undefined,
    apiKeyOwner?: string | undefined,
    runKey?: string | undefined
}

export interface PlayerStore {
    players: Array<Player>
}

export const getPlayerHypixelData = createAsyncThunk<any,any, { state: Store }>('PlayerStore/getPlayerHypixelData', async (thunkObject: PlayerStoreThunkObject, {getState}) => {
    const playerData: Player = {
        name: thunkObject.name,
        id: null,
        nicked: false,
        bot: false,
        hypixelGuild: null,
        hypixelPlayer: null,
        runApi: null
    }
    let hypixelPlayer: Components.Schemas.Player;

    const state = getState();

    const apiKey = thunkObject.apiKey ?? state.configStore.apiKey;
    const apiKeyOwner = thunkObject.apiKeyOwner ?? state.configStore.apiKeyOwner;
    const runApiKey = thunkObject.runKey ?? state.configStore.runKey;

    if (apiKey.length !== 36) {
        return {status: 403, cause: 'No API Key', data: null};
    }

    try {
        if (playerData.name.length <= 16) {
            hypixelPlayer = await window.ipcRenderer.invoke('hypixel', apiKey, RequestType.USERNAME, playerData.name);
        } else {
            hypixelPlayer = await window.ipcRenderer.invoke('hypixel', apiKey, RequestType.UUID, playerData.name.replace("-", ""));
        }
    } catch (e) {
        const mcUtilsRequest = await window.ipcRenderer.invoke('mcutils', RequestType.USERNAME, playerData.name);
        const mcUtils: PlayerAPI = mcUtilsRequest.data;
        if (mcUtils.player.username === null || mcUtils.player.uuid === null) {
            playerData.nicked = true;
            return playerData;
        } else {
            playerData.id = mcUtils.player.uuid;
            hypixelPlayer = await window.ipcRenderer.invoke('hypixel', apiKey, RequestType.UUID, mcUtils.player.uuid);
        }
    }

    playerData.hypixelPlayer = hypixelPlayer;

    let runApi;
    if (hypixelPlayer.uuid != undefined) {
        runApi = await window.ipcRenderer.invoke('seraph', RunEndpoints.BLACKLIST, hypixelPlayer.uuid, apiKey, apiKeyOwner, runApiKey, apiKeyOwner);
        playerData.runApi = runApi.data;
    } else {
        runApi = {
            code: 400,
            data: {
                annoylist: {tagged: false},
                blacklist: {reason: "", report_type: "", tagged: false, timestamp: 0},
                bot: {kay: false, tagged: false, unidentified: false},
                customTag: undefined,
                migrated: {tagged: false},
                safelist: {personal: false, security_level: 0, tagged: false, timesKilled: 0},
                statistics: {encounters: 0, threat_level: 0},
                username: "",
                uuid: ""
            },
            msTime: Date.now(),
            success: false
        };
    }

    return {status: runApi.status, cause: 'valid request', data: playerData};
});

const PlayerStore = createSlice({
    name: 'PlayerStore',
    initialState: {
        players: Array<Player>(),
        runKey: "public",
    },
    reducers: {
        removePlayer: (state, action) => {
            const {name} = action.payload;
            state.players = state.players.filter((player: Player) => player.name !== name);
        },
        updatePlayer: (state, action) => {
            const payload: PlayerHandler = action.payload;
            if (payload.status === 200 && payload.data !== undefined && !payload.data.nicked) {
                const playerPayload: Player = payload.data;
                const doesPlayerExist = state.players.findIndex((player: Player) => player.name === playerPayload.name);
                if (doesPlayerExist !== -1) {
                    state.players[doesPlayerExist] = payload.data;
                } else {
                    state.players.push(playerPayload);
                }
            } else {
                if (payload.data !== undefined && payload.status === 400) {
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
    },
    extraReducers: builder => {
        builder.addCase(getPlayerHypixelData.fulfilled, (state, action) => {
            PlayerStore.caseReducers.updatePlayer(state, action);
        }).addCase(getPlayerHypixelData.rejected, (state, action) => {
            PlayerStore.caseReducers.updatePlayer(state, action);
        });
    }
});

export default PlayerStore.reducer;
