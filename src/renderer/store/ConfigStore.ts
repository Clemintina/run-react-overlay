import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Key, RequestType} from "@common/utils/externalapis/RunApi";
import {HypixelApiKey} from "@common/utils/Schemas";

export interface ConfigStore {
    apiKey: string,
    apiKeyValid: boolean,
    apiKeyOwner: string,
    runKey: string,
}

interface InitScript {
    status: number,
    data: {
        hypixel: {
            key: string,
            owner: string
        },
        runKey: string
    }
}

const ConfigStore = createSlice({
    name: 'ConfigStore',
    initialState: {
        apiKey: "",
        apiKeyValid: false,
        apiKeyOwner: "",
        runKey: "public",
    },
    reducers: {
        setHypixelApiKey: (state, action: { payload: HypixelApiKey }) => {
            const payload: HypixelApiKey = action.payload;
            state.apiKeyValid = true;
            state.apiKey = payload.key;
            state.apiKeyOwner = payload.owner;
            window.config.set('hypixel.apiKey', payload.key);
            window.config.set('hypixel.apiKeyOwner', payload.owner);
        },
        setRunApiKey: (state, action: { payload: Key }) => {
            const payload: Key = action.payload;
            state.runKey = payload.key.key;
        },
        setDataFromConfig: (state, action: { payload: InitScript }) => {
            const payload: InitScript = action.payload;
            if (payload.data.hypixel.key !== undefined) {
                state.apiKeyValid = true;
                state.apiKey = payload.data.hypixel.key;
                state.apiKeyOwner = payload.data.hypixel.owner;
            }
            if (payload.data.runKey !== undefined) state.runKey = payload.data.runKey;
        }
    },
    extraReducers: builder => {
        builder.addCase(apiKeyValidator.fulfilled, (state, action) => {
            const payload: HypixelApiKey = action.payload;
            if (payload.key !== undefined) {
                ConfigStore.caseReducers.setHypixelApiKey(state, {payload: payload});
            } else {
                console.log("Error with api key");
            }
        }).addCase(initScript.fulfilled, (state, action) => {
            const payload: InitScript = action.payload;
            ConfigStore.caseReducers.setDataFromConfig(state, {payload});
            console.log("Run init script");
        });
    }
});

export const apiKeyValidator = createAsyncThunk('ConfigStore/apiKeyValidator', async (hypixelApiKey: string) => {
    return await window.ipcRenderer.invoke('hypixel', hypixelApiKey, RequestType.KEY);
});

export const initScript = createAsyncThunk('ConfigStore/Init', async () => {
    const hypixel = {key: '', owner: ''};

    const runKey = await window.config.get('run.apiKey');
    hypixel.key = await window.config.get('hypixel.apiKey');
    hypixel.owner = await window.config.get('hypixel.apiKeyOwner');

    const res: InitScript = {status: 200, data: {runKey, hypixel}};
    return res;
})

export default ConfigStore.reducer;
