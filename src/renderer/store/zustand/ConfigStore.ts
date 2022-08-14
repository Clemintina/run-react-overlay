// eslint-disable-next-line import/named
import {ColumnState} from "ag-grid-community";
import create from "zustand";
import {BrowserWindowSettings, ClientSetting, ColourSettings, DisplayErrorMessage, MenuOption, SettingsConfig, TableState} from "@common/utils/Schemas";
import {ResultObject} from "@common/zikeji/util/ResultObject";
import {Paths} from "@common/zikeji";
import {RequestType, RunApiKey, RunEndpoints} from "@common/utils/externalapis/RunApi";
import {awaitTimeout} from "@common/helpers";
import {KeathizEndpoints, KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {devtools, persist} from "../../../../node_modules/zustand/middleware";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";

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
    setVersion: (version: string) => void;
    logs: ClientSetting;
    setLogs: (clientSetting: ClientSetting) => void;
    error: DisplayErrorMessage;
    setErrorMessage: (error: DisplayErrorMessage) => void;
    keathiz: {
        key: string;
        valid: boolean;
        showNick: boolean;
    };
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
    menuOptions: Array<MenuOption>;
    setMenuOptions: (menuOptions: Array<MenuOption>) => void;
    setStore: (store: ConfigStore) => void;
};

const useConfigStore = create<ConfigStore>()(devtools(persist((set, get) => ({
    hypixel: {
        apiKey: "",
        apiKeyValid: false,
        apiKeyOwner: "",
    },
    setHypixelApiKey: async (hypixelApiKey) => {
        if (hypixelApiKey.length == 0) return;
        const apiResponse = await window.ipcRenderer.invoke<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>>("hypixel", RequestType.KEY, hypixelApiKey);
        if (apiResponse.status === 200 && apiResponse?.data?.key != undefined) {
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
                cause: "The Hypixel API key provided is not valid!",
                code: 401,
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
    setVersion: (version: string) => {
        set(() => ({version}));
    },
    logs: {
        logPath: "",
        readable: false,
        clientName: "",
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
        code: 200,
        title: "",
        cause: "",
        detail: "",
    },
    setErrorMessage: async (structuredError) => {
        set({error: structuredError});
        await awaitTimeout(5 * 1000);
        set({
            error: {
                code: 200,
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
    setKeathizApiKey: async (keathizApiKey) => {
        const apiKey = await window.ipcRenderer.invoke<KeathizOverlayRun>("keathiz", KeathizEndpoints.OVERLAY_RUN, "308d0104f67b4bfb841058be9cadadb5");
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
                    const keathiz = await window.ipcRenderer.invoke<KeathizOverlayRun>("keathiz", KeathizEndpoints.OVERLAY_RUN, player.hypixelPlayer.uuid);
                    if (keathiz.status == 200) {
                        console.log(keathiz.status);
                        player.sources.keathiz = keathiz;
                    }
                }
            }
        } else {
            get().setErrorMessage({
                title: "Invalid Keathiz Key",
                cause: "The API key provided is not valid!",
                code: 401,
            });
        }
    },
    run: {
        apiKey: "public",
        valid: true,
    },
    setRunApiKey: async (runkey) => {
        const getHypixel = get().hypixel;
        const apiKey = await window.ipcRenderer.invoke<RunApiKey>("seraph", RunEndpoints.KEY, "a", getHypixel.apiKey, getHypixel.apiKeyOwner, runkey, getHypixel.apiKeyOwner);
        if (apiKey.status == 200) {
            set({
                run: {
                    apiKey: runkey,
                    valid: true,
                },
            });
        } else
            get().setErrorMessage({
                title: "Invalid RUN Key",
                cause: "The RUN API key provided is not valid!",
                code: 401,
            });
    },
    browserWindow: {
        width: 600,
        height: 800,
        opacity: 100,
    },
    setBrowserWindow: (browserWindow) => {
        set({browserWindow});
    },
    table: {
        columnState: Array<ColumnState>(),
    },
    setTableState: async (table) => {
        await window.config.set("overlay.table.columnState", table);
        set({table});
    },
    settings: {
        lunar: true,
        keathiz: false,
        boomza: true,
        preferences: {
            autoHide: true,
        },
    },
    setSettings: async (settings) => {
        set({settings});
        usePlayerStore.getState().updatePlayers();
    },
    menuOptions: Array<MenuOption>(),
    setMenuOptions: (menuOptions) => {
        set({menuOptions});
    },
    setStore: (store) => set(store),
}), {name: 'user_settings'})))

export const getMenuItems = () => {
    const items = Array<MenuOption>();
    items.push({menuName: "Essentials", menuLink: "/settings/essentials"});
    items.push({menuName: "Tags", menuLink: "/settings/tags"});
    return items;
};

export default useConfigStore;
