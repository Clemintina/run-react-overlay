import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IPCResponse, RequestType, RunApiKey} from "@common/utils/externalapis/RunApi";
import {DisplayErrorMessage} from "@common//utils/Schemas";
import {ResultObject} from "@common/zikeji/util/ResultObject";
import {Paths} from "@common/zikeji";
import {KeathizEndpoints, KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";

export interface ConfigStore {
    hypixel: {
        apiKey: string;
        apiKeyValid: boolean;
        apiKeyOwner: string;
    };
    runKey: string;
    version: string;
    logs: ClientSetting;
    colours: {
        backgroundColour: string;
        primaryColour: string;
        secondaryColour: string;
    };
    keathiz: {
        key: string;
        valid: boolean;
    };
    run: {
        apiKey: string;
        valid: boolean;
    };
    browserWindow: {
        width: number;
        height: number;
    };
    error: DisplayErrorMessage;
    settings: SettingsConfig;
}

export interface SettingsConfig {
    lunar: boolean;
    keathiz: boolean;
    boomza: boolean;
}

export interface ClientSetting {
    clientName: string;
    logPath: string;
    readable: boolean;
}

interface InitScript {
    status: number;
    data: {
        hypixel: {
            key: string;
            owner: string;
            valid: boolean;
        };
        overlay: {
            logPath: string;
            readable: boolean;
            clientName: string;
        };
        run: {
            apiKey: string;
            valid: boolean;
        };
        external: {
            keathiz: {
                apiKey: string;
                valid: boolean;
            };
        };
        browserWindow: {
            width: number;
            height: number;
        };
        settings: SettingsConfig;
        version: string;
    };
}

/**
 * The main slice, Used to store API-keys, logs and anything else used by the Overlay which isn't calling players.
 */
const ConfigStore = createSlice({
    name: "ConfigStore",
    initialState: {
        hypixel: {
            apiKey: "",
            apiKeyValid: false,
            apiKeyOwner: "",
        },
        colours: {
            backgroundColour: "#242424FF",
            primaryColour: "#808080",
            secondaryColour: "#00FFFF",
        },
        runKey: "public",
        version: "",
        logs: {
            logPath: "",
            readable: false,
            clientName: "",
        },
        error: {
            code: 200,
            title: "",
            cause: "",
            detail: "",
        },
        keathiz: {
            key: "",
            valid: false,
        },
        run: {
            apiKey: "",
            valid: false,
        },
        browserWindow: {
            width: 600,
            height: 800,
        },
        settings: {
            lunar: true,
            keathiz: false,
            boomza: true,
        },
    },
    reducers: {
        setHypixelApiKey: (state, action: { payload: IPCResponse<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>> }) => {
            const payload: IPCResponse<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>> = action.payload;
            state.hypixel.apiKeyValid = true;
            state.hypixel.apiKey = payload.data.key;
            state.hypixel.apiKeyOwner = payload.data.owner;
            window.config.set("hypixel.apiKey", payload.data.key);
            window.config.set("hypixel.apiKeyOwner", payload.data.owner);
        },
        setRunApiKey: (state, action: { payload: RunApiKey }) => {
            const payload: RunApiKey = action.payload;
            state.runKey = payload.key.key;
        },
        setDataFromConfig: (state, action: { payload: InitScript }) => {
            const payload: InitScript = action.payload;
            state.version = payload.data.version;
            if (payload.data.hypixel.key !== undefined) {
                state.hypixel.apiKeyValid = payload.data.hypixel.valid;
                state.hypixel.apiKey = payload.data.hypixel.key;
                state.hypixel.apiKeyOwner = payload.data.hypixel.owner;
            }
            if (payload.data.run.apiKey !== undefined) {
                state.runKey = payload.data.run.apiKey;
                state.run.apiKey = payload.data.run.apiKey;
                state.run.valid = payload.data.run.valid;
            }
            if (payload.data.overlay.logPath !== undefined) {
                state.logs.logPath = payload.data.overlay.logPath;
                state.logs.readable = payload.data.overlay.readable;
                state.logs.clientName = payload.data.overlay.clientName;
                window.ipcRenderer.send("logFileSet", state.logs.logPath);
            }
            state.browserWindow = payload.data.browserWindow;
        },
        updateErrorMessage: (state, action: { payload: DisplayErrorMessage }) => {
            state.error.code = action.payload.code;
            state.error.title = action.payload.title;
            state.error.cause = action.payload.cause;
            state.error.detail = action.payload.detail ?? "";
        },
        setSettings: (state, action: { payload: SettingsConfig }) => {
            const payload = action.payload;
            state.settings.lunar = payload.lunar;
            state.settings.keathiz = payload.keathiz;
            state.settings.boomza = payload.boomza;
        },
        setKeathizApi: (state, action: { payload: IPCResponse<{ apiKey: string; valid: boolean }> }) => {
            const payload = action.payload.data;
            state.keathiz.key = payload.apiKey;
            state.keathiz.valid = payload.valid;
        },
        setClient: (state, action: { payload: ClientSetting }) => {
            const payload = action.payload;
            if (payload.readable) {
                state.logs = action.payload;
            } else {
                state.error.code = 400;
                state.error.title = "Bad Log File";
                state.error.cause = "This log file is unable to be read, Please ensure this is the correct client, or the overlay has sufficient privileges to read this file.";
            }
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
                            cause: "The API Key provided was invalid",
                            detail: "The Hypixel API key inputted was invalid, try a new key.",
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
                        cause: "The API Key provided was invalid.",
                        detail: "The Hypixel API key inputted was invalid, try a new key.",
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
            })
            .addCase(setSettingsValue.fulfilled, (state, action) => {
                state.settings = action.payload.data;
            })
            .addCase(setErrorMessage.fulfilled, (state, action: { payload: DisplayErrorMessage }) => {
                ConfigStore.caseReducers.updateErrorMessage(state, action);
            })
            .addCase(keathizApiKeyValidator.fulfilled, (state, action) => {
                ConfigStore.caseReducers.setKeathizApi(state, action);
            })
            .addCase(setClient.fulfilled, (state, action) => {
                ConfigStore.caseReducers.setClient(state, action);
            });
    },
});
/**
 * Validates the Hypixel API Key
 */
export const apiKeyValidator = createAsyncThunk("ConfigStore/apiKeyValidator", async (hypixelApiKey: string) => {
    return await window.ipcRenderer.invoke<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>>("hypixel", RequestType.KEY, hypixelApiKey);
});
/**
 * Validates the Keathiz API Key
 */
export const keathizApiKeyValidator = createAsyncThunk("ConfigStore/keathizApiKeyValidator", async (keathizKey: string) => {
    await window.config.set("external.keathiz.apiKey", keathizKey);
    const validKey = await window.ipcRenderer.invoke<KeathizOverlayRun>("keathiz", KeathizEndpoints.OVERLAY_RUN, "308d0104f67b4bfb841058be9cadadb5");
    await window.config.set("external.keathiz.valid", validKey.status == 200);
    return {data: {apiKey: keathizKey, valid: validKey.status == 200}, status: 200};
});

export const setSettingsValue = createAsyncThunk("ConfigStore/setSettingsValue", async (data: SettingsConfig) => {
    return {data, status: 200};
});

export const setErrorMessage = createAsyncThunk("ConfigStore/setErrorMessage", async (errorObject: DisplayErrorMessage) => {
    return errorObject;
});

export const setClient = createAsyncThunk("ConfigStore/setClient", async (client: ClientSetting) => {
    await window.config.set('overlay.logPath', client.logPath)
    await window.config.set('overlay.clientName', client.clientName)
    await window.config.set('overlay.readable', client.readable)
    return client;
});

/**
 * Called when the Overlay loads, **DO NOT PUT RESOURCE INTENSIVE METHODS IN THIS FUNCTION**
 */
export const initScript = createAsyncThunk("ConfigStore/Init", async () => {
    const hypixel = {key: "", owner: "", valid: false};
    const overlay = {logPath: "", readable: false, clientName: ''};
    const external = {keathiz: {apiKey: "", valid: false}};
    const version = await window.config.get("run.overlay.version");
    const settings = await window.config.get("settings");
    const browserWindow = await window.config.get("run.overlay.browserWindow");

    const run = {apiKey: "", valid: false};
    run.apiKey = await window.config.get("run.apiKey");
    if (run.apiKey == "public") run.valid = true;

    hypixel.key = await window.config.get("hypixel.apiKey");
    hypixel.owner = await window.config.get("hypixel.apiKeyOwner");
    hypixel.valid = await window.ipcRenderer
        .invoke<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>>("hypixel", RequestType.KEY, hypixel.key)
        .then((r) => r.status == 200)
        .catch(() => false);
    overlay.logPath = await window.config.get("overlay.logPath");
    overlay.readable = await window.config.get("overlay.readable");
    overlay.clientName = await window.config.get('overlay.clientName');

    external.keathiz.apiKey = await window.config.get("external.keathiz.apiKey");
    external.keathiz.valid = (await window.config.get("external.keathiz.valid")) ?? false;

    const res: InitScript = {status: 200, data: {run, hypixel, overlay, external, settings, version, browserWindow}};
    return res;
});

export default ConfigStore.reducer;
