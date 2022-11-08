// eslint-disable-next-line import/named
import { ColumnState } from "ag-grid-community";
import create from "zustand";
import { AppInformation, BrowserWindowSettings, ClientSetting, ColourSettings, CustomLinkFile, CustomLinkURL, DisplayErrorMessage, FontConfig, GameType, KeybindInterface, KeyboardFocusType, PlayerNickname, SettingsConfig, TableState } from "@common/utils/Schemas";
import { ResultObject } from "@common/zikeji/util/ResultObject";
import { Paths } from "@common/zikeji";
import { RequestType, RunApiKey, RunEndpoints } from "@common/utils/externalapis/RunApi";
import { awaitTimeout } from "@common/helpers";
import { KeathizEndpoints, KeathizOverlayRun } from "@common/utils/externalapis/BoomzaApi";
import { devtools, persist } from "../../../../node_modules/zustand/middleware";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";
import axios from "axios";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";

export type ConfigStore = {
    hypixel: {
        apiKey: string;
        apiKeyValid: boolean;
        apiKeyOwner: string;
    };
    setHypixelApiKey: (arg0: string) => void;
    colours: ColourSettings;
    setColours: (colour: ColourSettings) => void;
    version: string;
    setVersion: () => void;
    logs: ClientSetting;
    setLogs: (clientSetting: ClientSetting) => void;
    error: DisplayErrorMessage;
    setErrorMessage: (error: DisplayErrorMessage) => void;
    keathiz: {
        key: string;
        valid: boolean;
        showNick: boolean;
    };
    setKeathizData: (data: { key: string; valid: boolean; showNick: boolean }) => void;
    setKeathizApiKey: (keathizkey: string) => void;
    run: {
        apiKey: string;
        valid: boolean;
    };
    setRunApiKey: (runkey: string) => void;
    browserWindow: BrowserWindowSettings;
    setBrowserWindow: (browserWindow: BrowserWindowSettings) => void;
    table: TableState;
    setTableState: (tableState: TableState) => void;
    settings: SettingsConfig;
    setSettings: (settingsSettings: SettingsConfig) => void;
    setStore: (store: ConfigStore) => void;
    font: FontConfig;
    keybinds: Array<KeybindInterface>;
    addKeybind: (focus: KeyboardFocusType, keybind: string) => void;
    removeKeybind: (focus: KeyboardFocusType) => void;
    getKeybind: (focus: KeyboardFocusType) => KeybindInterface;
    setFont: (font: FontConfig) => void;
    nicks: Array<PlayerNickname>;
    setNicks: (nicks: Array<PlayerNickname>) => void;
    customFile: CustomLinkFile;
    setCustomFile: (customFile: CustomLinkFile) => void;
    customApi: CustomLinkURL;
    setCustomApi: (customFile: CustomLinkURL) => void;
    game: GameType;
    setGame: (game: GameType) => void;
};

const useConfigStore = create<ConfigStore>()(
    devtools(
        persist(
            (set, get) => ({
                hypixel: {
                    apiKey: "",
                    apiKeyValid: false,
                    apiKeyOwner: "",
                },
                setHypixelApiKey: async (hypixelApiKey) => {
                    if (hypixelApiKey.length === 0 || (get().hypixel.apiKey.toLowerCase() == hypixelApiKey.toLowerCase() && get().hypixel.apiKeyValid)) {
                        const oldHypixel = get().hypixel;
                        if (oldHypixel.apiKeyValid) return;
                        set(() => ({
                            hypixel: {
                                ...oldHypixel,
                                apiKeyValid: false,
                            },
                        }));
                        return;
                    }
                    const apiResponse = await window.ipcRenderer.invoke<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>>(IpcValidInvokeChannels.HYPIXEL, [RequestType.KEY, hypixelApiKey]);
                    if (apiResponse?.status === 200 && apiResponse?.data?.key !== undefined) {
                        get().setErrorMessage({
                            title: "Hypixel Key Set",
                            cause: "Successfully set your Hypixel API key!",
                            code: 200,
                        });
                        set(() => ({
                            hypixel: {
                                apiKey: hypixelApiKey,
                                apiKeyValid: true,
                                apiKeyOwner: apiResponse.data.owner,
                            },
                        }));
                    } else {
                        get().setErrorMessage({
                            title: "Invalid Hypixel Key",
                            cause: "The Hypixel API key provided is not valid! Generate one with /api new.",
                            code: 400,
                        });
                        set(() => ({
                            hypixel: {
                                apiKey: get().hypixel.apiKey,
                                apiKeyValid: false,
                                apiKeyOwner: apiResponse.data.owner,
                            },
                        }));
                    }
                },
                colours: {
                    backgroundColour: "#242424",
                    primaryColour: "#808080",
                    secondaryColour: "#00FFFF",
                },
                setColours: (colourObject) => {
                    set(() => ({
                        colours: colourObject,
                    }));
                },
                version: "",
                setVersion: async () => {
                    const appInfo = await window.ipcRenderer.invoke<AppInformation>(IpcValidInvokeChannels.GET_APP_INFO);
                    const version = appInfo.data.version;
                    set(() => ({ version }));
                    const googleFontArray = await axios.get("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw");
                    if (googleFontArray.status == 200) {
                        const fontsAvailable: Array<string> = [];
                        googleFontArray.data.items.forEach((item) => {
                            fontsAvailable.push(item.family);
                        });
                        set({
                            font: {
                                ...get().font,
                                availableFonts: fontsAvailable,
                            },
                        });
                    }
                },
                logs: {
                    logPath: "",
                    readable: false,
                    clientName: "Unknown",
                },
                setLogs: async (client) => {
                    await window.config.set("overlay.logPath", client.logPath);
                    await window.config.set("overlay.clientName", client.clientName);
                    await window.config.set("overlay.readable", client.readable);
                    set({
                        logs: client,
                    });
                },
                error: {
                    code: 201,
                    title: "",
                    cause: "",
                    detail: "",
                },
                setErrorMessage: async (structuredError) => {
                    set({
                        error: {
                            ...structuredError,
                            code: structuredError?.code ?? 200,
                        },
                    });
                    await awaitTimeout(5 * 1000);
                    set({
                        error: {
                            code: 201,
                            title: "",
                            cause: "",
                            detail: "",
                        },
                    });
                },
                keathiz: {
                    key: "",
                    valid: false,
                    showNick: true,
                },
                setKeathizData: (keathizstore) => {
                    set({
                        keathiz: keathizstore,
                    });
                },
                setKeathizApiKey: async (keathizApiKey) => {
                    const apiKey = await window.ipcRenderer.invoke<KeathizOverlayRun>(IpcValidInvokeChannels.KEATHIZ, [KeathizEndpoints.OVERLAY_RUN, "308d0104f67b4bfb841058be9cadadb5", keathizApiKey]);
                    if (keathizApiKey.length == 0) return;
                    if (apiKey.status == 200) {
                        set({
                            keathiz: {
                                key: keathizApiKey,
                                valid: true,
                                showNick: useConfigStore.getState().keathiz.showNick,
                            },
                        });
                        for (const player of usePlayerStore.getState().players) {
                            if (player.hypixelPlayer?.uuid && !player.nicked) {
                                const keathiz = await window.ipcRenderer.invoke<KeathizOverlayRun>(IpcValidInvokeChannels.KEATHIZ, [KeathizEndpoints.OVERLAY_RUN, player.hypixelPlayer.uuid, keathizApiKey]);
                                if (keathiz.status == 200) {
                                    console.log(keathiz.status);
                                    player.sources.keathiz = keathiz;
                                }
                            }
                        }
                    } else {
                        get().setErrorMessage({
                            title: "Invalid Antisniper Key",
                            cause: "The Antisniper API key provided is not valid!",
                            code: 400,
                        });
                    }
                },
                run: {
                    apiKey: "public",
                    valid: true,
                },
                setRunApiKey: async (runkey) => {
                    if (runkey.length == 0 || get()?.run?.apiKey.toLowerCase() == runkey) return;
                    const getHypixel = get().hypixel;
                    const apiKey = await window.ipcRenderer.invoke<RunApiKey>(IpcValidInvokeChannels.SERAPH, [RunEndpoints.KEY, "a", getHypixel.apiKey, getHypixel.apiKeyOwner, runkey, getHypixel.apiKeyOwner]);
                    if (runkey.length == 0) return;
                    if (apiKey.status == 200) {
                        get().setErrorMessage({
                            title: "Seraph Key Set",
                            cause: "Successfully set your Seraph API key!",
                            code: 200,
                        });
                        set({
                            run: {
                                apiKey: runkey,
                                valid: true,
                            },
                        });
                    } else {
                        get().setErrorMessage({
                            title: "Invalid Seraph Key",
                            cause: "The Seraph API key provided is invalid or locked!",
                            code: 400,
                        });
                        await window.ipcRenderer.invoke(IpcValidInvokeChannels.NOTIFICATIONS, ["Your Seraph Key has been locked!"]);
                    }
                },
                browserWindow: {
                    width: 600,
                    height: 800,
                    opacity: 100,
                },
                setBrowserWindow: (browserWindow) => {
                    set({ browserWindow });
                },
                table: {
                    columnState: Array<ColumnState>(
                        {
                            colId: "id",
                            width: 200,
                            hide: true,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: null,
                        },
                        {
                            colId: "head",
                            width: 30,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "star",
                            width: 60,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "name",
                            width: 200,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "tags",
                            width: 130,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "WS",
                            width: 60,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "FKDR",
                            width: 60,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "WLR",
                            width: 60,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "BBLR",
                            width: 60,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "wins",
                            width: 60,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "losses",
                            width: 60,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "session",
                            width: 60,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                        {
                            colId: "extra",
                            width: 30,
                            hide: false,
                            pinned: null,
                            sort: null,
                            sortIndex: null,
                            aggFunc: null,
                            rowGroup: false,
                            rowGroupIndex: null,
                            pivot: false,
                            pivotIndex: null,
                            flex: 1,
                        },
                    ),
                    settings: {
                        textAlign: "center",
                    },
                },
                setTableState: async (table) => {
                    await window.config.set("overlay.table.columnState", table);
                    set({ table });
                },
                settings: {
                    lunar: true,
                    keathiz: false,
                    updater: true,
                    astolfo: false,
                    boomza: true,
                    hypixel: {
                        guilds: false,
                    },
                    run: {
                        friends: false,
                    },
                    preferences: {
                        autoHide: true,
                        customFile: false,
                        customUrl: false,
                    },
                    appearance: {
                        displayRank: true,
                    },
                },
                setSettings: async (settings) => {
                    set({ settings });
                    usePlayerStore.getState().updatePlayers();
                },
                customFile: {
                    path: "",
                    readable: false,
                    data: null,
                },
                setCustomFile: (customFile) => {
                    set({
                        customFile,
                    });
                },
                customApi: {
                    url: "",
                },
                setCustomApi: (customApi) => {
                    set({
                        customApi,
                    });
                },
                keybinds: [],
                addKeybind: async (focus, keybind) => {
                    if (get().keybinds.filter((arr) => arr.focus == focus).length == 0) {
                        get().keybinds.push({ keybind, focus });
                    } else {
                        get().removeKeybind(focus);
                        get().keybinds.push({ keybind, focus });
                    }
                },
                removeKeybind: (focus: KeyboardFocusType) => {
                    set({
                        keybinds: get().keybinds.filter((arr) => arr.focus !== focus),
                    });
                },
                getKeybind: (focus: KeyboardFocusType) => {
                    return get().keybinds.filter((arr) => arr.focus == focus)[0];
                },
                font: {
                    family: "Nunito",
                    availableFonts: [],
                    isGoogleFont: false,
                },
                setFont: async (font) => {
                    set({ font });
                },
                nicks: Array<PlayerNickname>(),
                setNicks: (nicks) => {
                    set({ nicks });
                },
                setStore: (store) => set(store),
                appInformation: {
                    version: "",
                    update: {
                        release: "",
                        updateAvailable: false,
                        ready: false,
                        releaseDate: new Date(),
                    },
                },
                game: {
                    last_server: "",
                },
                setGame: (game) => {
                    set({ game });
                },
            }),
            {
                name: "user_settings",
                version: 8,
                migrate: (persistedState: any, version) => {
                    const updatedState = persistedState;
                    if (version == 4) {
                        updatedState.settings.hypixel.guilds = false;
                        updatedState.settings.run.friends = false;
                        updatedState.settings.updater = true;
                        updatedState.font.family = "Nunito";
                        updatedState.settings.error.code = 201;
                    } else if (version == 5) {
                        updatedState.keybinds = [];
                        updatedState.settings.appearance.displayRank = true;
                        updatedState.table.settings.textAlign = "left";
                    } else if (version == 6) {
                        updatedState.appInformation.version = "";
                        updatedState.appInformation.update.release = "";
                        updatedState.appInformation.update.ready = false;
                        updatedState.appInformation.update.updateAvailable = false;
                        updatedState.appInformation.update.releaseDate = new Date();
                    } else if (version == 7) {
                        updatedState.settings.customFile = false;
                        updatedState.settings.customUrl = false;
                        updatedState.customFile.path = "";
                        updatedState.customFile.readable = false;
                        updatedState.game.last_server = "";
                    } else if (version == 8) {
                        updatedState.customUrl.url = "";
                        updatedState.font.isGoogleFont = true;
                    }
                    return updatedState;
                },
            },
        ),
    ),
);

export default useConfigStore;
