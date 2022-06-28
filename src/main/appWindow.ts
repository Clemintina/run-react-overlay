import {app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent, Notification, NotificationConstructorOptions} from "electron";
import {registerTitlebarIpc} from "@misc/window/titlebarIPC";
import path from "path";
import axios from "axios";
import fs from "fs";
import TailFile from "@logdna/tail-file";
import readline from "readline";
import cacheManager from "cache-manager";
import Store from "electron-store";
import {RUNElectronStore, RUNElectronStoreType} from "@renderer/store/ElectronStoreUtils";
import {RequestType, RunEndpoints} from "@common/utils/externalapis/RunApi";
import {HypixelApi} from "./HypixelApi";
import AppUpdater from "./AutoUpdate";
import {BoomzaAntisniper} from "@common/utils/externalapis/BoomzaApi";
import {ProxyStore, ProxyType} from "@common/utils/Schemas";
import * as tunnel from "tunnel";
import {handleIPCSend} from "@main/Utils";

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
/** Overlay Variables */
const overlayVersion = app.getVersion();
const userAgent = `Run-Bedwars-Overlay-React-${overlayVersion}`;
/**
 * Handle caching using {@link [cacheManager](https://www.npmjs.com/package/cache-manager)}
 */
const playerCache = cacheManager.caching({ttl: 60 * 5, store: "memory"});
const mojangCache = cacheManager.caching({ttl: 60000, store: "memory"});
/**
 * Checks if the app is running in Production or Development
 */
const isDevelopment = process.env.NODE_ENV !== "production";
/**
 * Configures the Electron Store
 * To add to the schema, refer to **@renderer/store/ElectronStoreUtils**
 * @see RUNElectronStore
 * @see RUNElectronStoreType
 */
const electronStoreSchema = JSON.parse(JSON.stringify(RUNElectronStore));
const electronStore = new Store<RUNElectronStoreType>({schema: electronStoreSchema.properties});
electronStore.set("run.overlay.version", app.getVersion());
/**
 * Configures the log reader. See {@link [TailFile](https://www.npmjs.com/package/@logdna/tail-file)} for more information.
 */
let logFileTail: TailFile | null = null;
let logFileReadline: readline.Interface | null = null;
let appWindow: BrowserWindow;
/**
 * Axios HTTP Client
 */
const axiosClient = axios.create({
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "Run-Bedwars-Overlay-" + overlayVersion,
        "Run-API-Version": overlayVersion,
    },
    timeout: 5000,
    timeoutErrorMessage: "Unable to communicate with the server",
    validateStatus: () => true,
});

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export const createAppWindow = (): BrowserWindow => {
    appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: "#242424",
        show: false,
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: "hidden",
        icon: path.resolve("assets/images/icon.ico"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    appWindow.setAlwaysOnTop(true, "floating");
    appWindow.setVisibleOnAllWorkspaces(true);

    if (!isDevelopment) {
        if (!require("electron-squirrel-startup") && process.platform === "win32") {
            const autoUpdater = new AppUpdater().getAutoUpdater();
            autoUpdater.checkForUpdates();
        }
    }

    appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY, {userAgent: "SeraphOverlay"});

    appWindow.on("ready-to-show", () => appWindow.show());

    registerMainIPC();

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    return appWindow;
};

/**
 * Register Inter Process Communication
 */
const registerMainIPC = () => {
    registerTitlebarIpc(appWindow);
    registerSeraphIPC();
    registerElectronStore();
    registerExternalApis();
    registerLogCommunications();
    registerMainWindowCommunications();
};

/**
 * Register Seraph Inter Process Communication
 */
const registerSeraphIPC = () => {
    ipcMain.handle("hypixel", async (event: IpcMainInvokeEvent, key: string, resource: RequestType, ...args: unknown[]) => {
        const hypixelClient = new HypixelApi(key, {
            cache: {
                get(key) {
                    return playerCache.get(`hypixel:${key}`);
                },
                set(key: `hypixel:${string}`, value: never) {
                    let ttl = 300;
                    if (key.startsWith("player:")) {
                        ttl = 600;
                    } else if (key.startsWith("key")) {
                        ttl = 30;
                    }
                    return playerCache.set(`hypixel:${key}`, value, {
                        ttl: ttl,
                    });
                },
            },
            userAgent: "Run-Bedwars-React-Overlay-" + overlayVersion,
            retries: 2,
            timeout: 7200,
        });
        const client = hypixelClient.getClient();
        if (resource === RequestType.KEY) {
            return await client.key();
        } else if (resource === RequestType.USERNAME) {
            const [name] = args as [string];
            const uuid: string | undefined = await mojangCache.get(`mojang:${name}`);
            if (uuid !== undefined || name.length == 32) {
                return await hypixelClient.getClient().player.uuid(uuid ?? name);
            } else {
                const res = await hypixelClient.getClient().player.username(name);
                if (res.uuid !== undefined) {
                    await mojangCache.set(`mojang:${name}`, res.uuid);
                }
                return res;
            }
        } else if (resource === RequestType.UUID) {
            const [uuid] = args as [string];
            return await hypixelClient.getClient().player.uuid(uuid);
        }
        return null;
    });

    ipcMain.handle("mcutils", async (event: IpcMainInvokeEvent, resource: RequestType, player: string) => {
        let url: string;
        const playerClean = player.replace("-", "");
        switch (resource) {
            case RequestType.USERNAME:
                url = `https://mc.seraph.si/uuid/${playerClean}`;
                break;
            case RequestType.UUID:
                url = `https://mc.seraph.si/username/${playerClean}`;
                break;
            default:
                url = "https://mc.seraph.si";
                break;
        }
        try {
            const response = await axiosClient(url);
            return {data: response.data, status: response.status};
        } catch (e) {
            return {data: null, status: 400};
        }
    });

    ipcMain.handle("seraph", async (event: IpcMainInvokeEvent, endpoint: RunEndpoints, uuid: string, hypixelApiKey: string, hypixelApiKeyOwner: string, runApiKey: string, overlayUuid: string) => {
        if (endpoint === RunEndpoints.KEY) {
            const response = await axiosClient(`https://antisniper.seraph.si/api/v3/key`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "User-Agent": "Run-Bedwars-Overlay-" + overlayVersion,
                    "Run-API-Version": overlayVersion,
                    "RUN-API-Key": runApiKey,
                    "run-api-uuid": overlayUuid,
                },
            });
            return {data: response.data, status: response.status};
        } else {
            const response = await axiosClient(`https://antisniper.seraph.si/api/v3/${endpoint}?uuid=${uuid}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "User-Agent": "Run-Bedwars-Overlay-" + overlayVersion,
                    "API-Key": hypixelApiKey,
                    "API-Key-Owner": hypixelApiKeyOwner,
                    "Run-API-Key": runApiKey,
                    "Run-API-Version": overlayVersion,
                    "RUN-API-UUID": overlayUuid,
                },
            });
            return {data: response.data, status: response.status};
        }
    });

    ipcMain.handle("lunar", async (event: IpcMainInvokeEvent, uuid: string) => {
        const response = await axiosClient(`https://api.seraph.si/lunar/${uuid}`);
        return {status: response.status, data: response.data};
    });
};

/**
 * Register Store Inter Process Communication
 */
const registerElectronStore = () => {
    ipcMain.on("configSet", async (event: IpcMainInvokeEvent, data: {key: string; data: string | number | boolean}) => {
        electronStore.set(data.key, data.data);
    });

    ipcMain.handle("configGet", async (event: IpcMainInvokeEvent, data: {key: string}) => {
        return electronStore.get(data.key);
    });
};

/**
 * Register Log Inter Process Communication
 */
const registerLogCommunications = () => {
    ipcMain.handle("isFileReadable", async (event: IpcMainInvokeEvent, path: string) => {
        return await fs.promises
            .access(path, fs.constants.R_OK)
            .then(() => true)
            .catch(() => false);
    });

    ipcMain.handle("selectLogFile", async (event: IpcMainInvokeEvent, args: never[]) => {
        return await dialog.showOpenDialog(appWindow, {
            defaultPath: app.getPath("appData"),
            filters: [{name: "Logs", extensions: ["log"]}],
            properties: ["openFile"],
        });
    });

    ipcMain.on("logFileSet", async (event: IpcMainInvokeEvent, path: string) => {
        electronStore.set("overlay.logPath", path);
        logFileReadline?.close();
        logFileReadline = null;

        await logFileTail?.quit();
        logFileTail = null;

        if (path !== null) {
            logFileTail = new TailFile(path.replace("\\", "/"));
            await logFileTail.start();

            logFileReadline = readline.createInterface({
                input: logFileTail,
            });

            logFileReadline.on("line", async (line) => {
                if (!line.includes("[Client thread/INFO]: [CHAT]") && !line.includes("[main/INFO]: [CHAT] ")) return;
                appWindow?.webContents.send("logFileLine", handleIPCSend({data: {message: line}, code: 200}));
            });
        }
    });
};

/**
 * Register Main Window Inter Process Communication
 */
const registerMainWindowCommunications = () => {
    ipcMain.on("windowClose", async () => {
        app.quit();
    });

    ipcMain.on("windowMinimise", () => {
        appWindow?.minimize();
    });

    ipcMain.on("windowMaximise", () => {
        appWindow?.showInactive();
    });
};

/**
 * Register External Inter Process Communications
 */
const registerExternalApis = () => {
    ipcMain.handle("boomza", async (event: IpcMainInvokeEvent, username: string) => {
        const response = await axiosClient(`http://db.dfg87dcbvse44.xyz:8080/?playerv5=${username}`, {
            headers: {
                Accept: "application/json",
            },
            httpsAgent: getProxyChannel(),
            proxy: false,
        });
        const json_response = JSON.parse(response.data.replaceAll("'", '"').toLowerCase());
        let json: BoomzaAntisniper;
        try {
            json = {sniper: json_response.sniper, report: json_response.report, error: false, username: username};
        } catch (e) {
            json = {sniper: false, report: 0, error: true, username: username};
        }
        return {data: json, status: response.status};
    });

    ipcMain.handle("keathiz", async (event: IpcMainInvokeEvent, uuid: string) => {
        const apikey = electronStore.get("external.keathiz.apiKey");
        const response = await axiosClient(`https://api.antisniper.net/overlay/run?uuid=${uuid}&key=${apikey}`, {
            headers: {
                Accept: "application/json",
            },
            httpsAgent: getProxyChannel(),
            proxy: false,
        });
        return {data: response.data, status: response.status};
    });

    ipcMain.handle("observer", async (event: IpcMainInvokeEvent, uuid: string) => {
        const apikey = electronStore.get("external.observer.apiKey");
        const response = await axiosClient(`https://api.invite.observer/v1/daily?uuid=${uuid}&key=${apikey}`, {
            headers: {
                Accept: "application/json",
            },
        });
        return {data: response.data, status: response.status};
    });

    ipcMain.handle("playerdb", async (event: IpcMainInvokeEvent, uuid: string) => {
        const response = await axiosClient(`https://playerdb.co/api/player/minecraft/${uuid}`, {
            headers: {
                Accept: "application/json",
            },
        });
        return {data: response.data, status: response.status};
    });
};

const registerOverlayFeatures = () => {
    ipcMain.handle("notifications", async (event: IpcMainInvokeEvent, message: string, subtitle: string | undefined) => {
        const options: NotificationConstructorOptions = {
            title: "Run Overlay",
            subtitle: subtitle,
            body: message,
            silent: false,
            hasReply: false,
            timeoutType: "default",
            urgency: "critical",
            closeButtonText: "Close notification",
        };
        const notif: Notification = new Notification(options);
        notif.show();
        setTimeout(() => {
            notif.close();
        }, 60000);
    });
};

const getProxyChannel = () => {
    let proxyStore: ProxyStore = electronStore.get("external.proxy");
    if (proxyStore == undefined) {
        proxyStore = {enableProxies: true, hasAuth: true, hostname: "p.webshare.io", port: "80", username: "twtmuzmg-rotate", password: "8nhzubu4xg33", type: ProxyType.HTTP};
    }
    return tunnel.httpsOverHttp({
        proxy: {
            host: proxyStore.hostname,
            port: Number(proxyStore.port),
            proxyAuth: proxyStore.username + ":" + proxyStore.password,
        },
    });
};
