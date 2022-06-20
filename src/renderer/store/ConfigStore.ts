import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Key, RequestType} from "@common/utils/externalapis/RunApi";
import {HypixelApiKey} from "@common/utils/Schemas";

export interface ConfigStore {
    apiKey: string;
    apiKeyValid: boolean;
    apiKeyOwner: string;
    runKey: string;
}

interface InitScript {
    status: number;
    data: {
        hypixel: {
            key: string;
            owner: string;
        };
        overlay: {
            logPath: string;
        };
        runKey: string;
    };
}

const ConfigStore = createSlice({
    name: "ConfigStore",
    initialState: {
        apiKey: "",
        apiKeyValid: false,
        apiKeyOwner: "",
        runKey: "public",
        logPath: "",
    },
    reducers: {
        setHypixelApiKey: (state, action: {payload: HypixelApiKey}) => {
            const payload: HypixelApiKey = action.payload;
            state.apiKeyValid = true;
            state.apiKey = payload.key;
            state.apiKeyOwner = payload.owner;
            window.config.set("hypixel.apiKey", payload.key);
            window.config.set("hypixel.apiKeyOwner", payload.owner);
        },
        setRunApiKey: (state, action: {payload: Key}) => {
            const payload: Key = action.payload;
            state.runKey = payload.key.key;
        },
        setDataFromConfig: (state, action: {payload: InitScript}) => {
            const payload: InitScript = action.payload;
            if (payload.data.hypixel.key !== undefined) {
                state.apiKeyValid = true;
                state.apiKey = payload.data.hypixel.key;
                state.apiKeyOwner = payload.data.hypixel.owner;
            }
            if (payload.data.runKey !== undefined) state.runKey = payload.data.runKey;
            if (payload.data.overlay.logPath !== undefined) state.logPath = payload.data.overlay.logPath;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(apiKeyValidator.fulfilled, (state, action) => {
                const payload: HypixelApiKey = action.payload;
                if (payload.key !== undefined) {
                    ConfigStore.caseReducers.setHypixelApiKey(state, {
                        payload,
                    });
                } else {
                    console.log("Error with api-key");
                }
            })
            .addCase(initScript.fulfilled, (state, action) => {
                const payload: InitScript = action.payload;
                ConfigStore.caseReducers.setDataFromConfig(state, {payload});
            });
    },
});

export const apiKeyValidator = createAsyncThunk("ConfigStore/apiKeyValidator", async (hypixelApiKey: string) => {
    return await window.ipcRenderer.invoke("hypixel", hypixelApiKey, RequestType.KEY);
});

export const initScript = createAsyncThunk("ConfigStore/Init", async () => {
    const hypixel = {key: "", owner: ""};
    const overlay = {logPath: ""};

    const runKey = await window.config.get("run.apiKey");
    hypixel.key = await window.config.get("hypixel.apiKey");
    hypixel.owner = await window.config.get("hypixel.apiKeyOwner");
    overlay.logPath = await window.config.get("overlay.logPath");

    const res: InitScript = {status: 200, data: {runKey, hypixel, overlay}};
    return res;
});

export default ConfigStore.reducer;
