import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IPCResponse, RequestType, RunApiKey} from "@common/utils/externalapis/RunApi";
import {DisplayErrorMessage, HypixelApiKey} from "@common//utils/Schemas";
import {ResultObject} from "@common/zikeji/util/ResultObject";
import {Paths} from "@common/zikeji";

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
        external: {
            keathiz: {apiKey: string};
        };
    };
}

/**
 * The main slice, Used to store API-keys, logs and anything else used by the Overlay which isn't calling players.
 */
const ConfigStore = createSlice({
    name: "ConfigStore",
    initialState: {
        apiKey: "",
        apiKeyValid: false,
        apiKeyOwner: "",
        colours: {
            backgroundColour: "#242424FF",
            primaryColour: "#808080",
            secondaryColour: "#00FFFF",
        },
        runKey: "public",
        logPath: "",
        error: {
            code: 200,
            title: "",
            cause: "",
            detail: "",
        },
    },
    reducers: {
        setHypixelApiKey: (state, action: {payload: IPCResponse<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>>}) => {
            const payload: IPCResponse<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>> = action.payload;
            state.apiKeyValid = true;
            state.apiKey = payload.data.key;
            state.apiKeyOwner = payload.data.owner;
            window.config.set("hypixel.apiKey", payload.data.key);
            window.config.set("hypixel.apiKeyOwner", payload.data.owner);
        },
        setRunApiKey: (state, action: {payload: RunApiKey}) => {
            const payload: RunApiKey = action.payload;
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
            if (payload.data.overlay.logPath !== undefined) {
                state.logPath = payload.data.overlay.logPath;
                window.ipcRenderer.send("logFileSet", state.logPath);
            }
        },
        updateErrorMessage: (state, action: {payload: DisplayErrorMessage}) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(apiKeyValidator.fulfilled, (state, action) => {
                const payload: IPCResponse<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>> = action.payload;
                if (payload?.data?.key !== undefined) {
                    ConfigStore.caseReducers.setHypixelApiKey(state, {
                        payload,
                    });
                } else {
                    ConfigStore.caseReducers.updateErrorMessage(state, {
                        payload: {
                            code: 403,
                            title: "Invalid API Key",
                            cause: "The API Key provided was not valid",
                            detail: "The Hypixel API key inputted was not valid, try a new key.",
                            referenceId: "extra reducer, rejected promise, invalid key?",
                        },
                    });
                }
            })
            .addCase(apiKeyValidator.rejected, (state) => {
                ConfigStore.caseReducers.updateErrorMessage(state, {
                    payload: {
                        code: 403,
                        title: "Invalid API Key",
                        cause: "The API Key provided was not valid",
                        detail: "The Hypixel API key inputted was not valid, try a new key.",
                        referenceId: "extra reducer, rejected promise, invalid key?",
                    },
                });
            })
            .addCase(initScript.fulfilled, (state, action) => {
                const payload: InitScript = action.payload;
                ConfigStore.caseReducers.setDataFromConfig(state, {payload});
            })
            .addCase(initScript.rejected, (state, action) => {
                ConfigStore.caseReducers.updateErrorMessage(state, {
                    payload: {
                        code: 422,
                        title: "Initial Script",
                        cause: "The Initial script failed",
                        detail: action?.error?.message || "Unknown error",
                        referenceId: "init script failed",
                    },
                });
            });
    },
});
/**
 * Validates the Hypixel API Key
 */
export const apiKeyValidator = createAsyncThunk("ConfigStore/apiKeyValidator", async (hypixelApiKey: string) => {
    return await window.ipcRenderer.invoke("hypixel", RequestType.KEY, hypixelApiKey);
});
/**
 * Validates the Keathiz API Key
 */
export const keathizApiKeyValidator = createAsyncThunk("ConfigStore/keathizApiKeyValidator", async (keathizKey: string) => {
    return await window.config.set("external.keathiz.apiKey", keathizKey);
});
/**
 * Called when the Overlay loads, **DO NOT PUT RESOURCE INTENSIVE METHODS IN THIS FUNCTION**
 */
export const initScript = createAsyncThunk("ConfigStore/Init", async () => {
    const hypixel = {key: "", owner: ""};
    const overlay = {logPath: ""};
    const external = {keathiz: {apiKey: ""}};

    const runKey = await window.config.get("run.apiKey");
    hypixel.key = await window.config.get("hypixel.apiKey");
    hypixel.owner = await window.config.get("hypixel.apiKeyOwner");
    overlay.logPath = await window.config.get("overlay.logPath");

    external.keathiz.apiKey = await window.config.get("external.keathiz.apiKey");

    const res: InitScript = {status: 200, data: {runKey, hypixel, overlay, external}};
    return res;
});

export default ConfigStore.reducer;
