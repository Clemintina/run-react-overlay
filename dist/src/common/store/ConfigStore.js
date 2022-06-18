import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RequestType } from "../utils/externalapis/RunApi";
const ConfigStore = createSlice({
    name: 'ConfigStore',
    initialState: {
        apiKey: "",
        apiKeyValid: false,
        apiKeyOwner: "",
        runKey: "public",
    },
    reducers: {
        setHypixelApiKey: (state, action) => {
            const payload = action.payload;
            state.apiKeyValid = true;
            state.apiKey = payload.key;
            state.apiKeyOwner = payload.owner;
            window.config.set('hypixel.apiKey', payload.key);
            window.config.set('hypixel.apiKeyOwner', payload.owner);
        },
        setRunApiKey: (state, action) => {
            const payload = action.payload;
            state.runKey = payload.key.key;
        },
        setDataFromConfig: (state, action) => {
            const payload = action.payload;
            if (payload.data.hypixel.key !== undefined) {
                state.apiKeyValid = true;
                state.apiKey = payload.data.hypixel.key;
                state.apiKeyOwner = payload.data.hypixel.owner;
            }
            if (payload.data.runKey !== undefined)
                state.runKey = payload.data.runKey;
        }
    },
    extraReducers: builder => {
        builder.addCase(apiKeyValidator.fulfilled, (state, action) => {
            const payload = action.payload;
            if (payload.key !== undefined) {
                ConfigStore.caseReducers.setHypixelApiKey(state, { payload: payload });
            }
            else {
                console.log("Error with api key");
            }
        }).addCase(initScript.fulfilled, (state, action) => {
            const payload = action.payload;
            ConfigStore.caseReducers.setDataFromConfig(state, { payload });
            console.log("Run init script");
        });
    }
});
export const apiKeyValidator = createAsyncThunk('ConfigStore/apiKeyValidator', async (hypixelApiKey) => {
    return await window.ipcRenderer.invoke('hypixel', hypixelApiKey, RequestType.KEY);
});
export const initScript = createAsyncThunk('ConfigStore/Init', async () => {
    const hypixel = { key: '', owner: '' };
    const runKey = await window.config.get('run.apiKey');
    hypixel.key = await window.config.get('hypixel.apiKey');
    hypixel.owner = await window.config.get('hypixel.apiKeyOwner');
    const res = { status: 200, data: { runKey, hypixel } };
    return res;
});
export default ConfigStore.reducer;
//# sourceMappingURL=ConfigStore.js.map