import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { registerTitlebarIpc } from "@misc/window/titlebarIPC";
import path from "path";
import axios from "axios";
import fs from "fs";
import TailFile from "@logdna/tail-file";
import readline from "readline";
import cacheManager from "cache-manager";
import Store from "electron-store";
import { RUNElectronStore } from "@renderer/store/ElectronStoreUtils";
import { RequestType, RunEndpoints } from "@common/utils/externalapis/RunApi";
import { HypixelApi } from "./HypixelApi";
import AppUpdater from "./AutoUpdate";
const overlayVersion = app.getVersion();
const playerCache = cacheManager.caching({ ttl: 60 * 5, store: "memory" });
const mojangCache = cacheManager.caching({ ttl: 600 * 5, store: "memory" });
const isDevelopment = process.env.NODE_ENV !== "production";
const electronStoreSchema = JSON.parse(JSON.stringify(RUNElectronStore));
const electronStore = new Store({ schema: electronStoreSchema.properties });
electronStore.set("run.overlay.version", app.getVersion());
let logFileTail = null;
let logFileReadline = null;
let appWindow;
export const createAppWindow = () => {
    appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: "#1f252c",
        show: false,
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: "hidden",
        icon: path.resolve("assets/images/appIcon.ico"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });
    if (!isDevelopment) {
        if (!require("electron-squirrel-startup") && process.platform === "win32") {
            const autoUpdater = new AppUpdater().getAutoUpdater();
            autoUpdater.checkForUpdates();
        }
    }
    appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);
    appWindow.on("ready-to-show", () => appWindow.show());
    registerMainIPC();
    appWindow.on("close", () => {
        appWindow.close();
        app.quit();
    });
    return appWindow;
};
const registerMainIPC = () => {
    registerTitlebarIpc(appWindow);
    registerSeraphIPC();
    registerElectronStore();
    registerLogCommunications();
};
const registerSeraphIPC = () => {
    ipcMain.handle("hypixel", async (event, key, resource, ...args) => {
        const hypixelClient = new HypixelApi(key, {
            cache: {
                get(key) {
                    return playerCache.get(`hypixel:${key}`);
                },
                set(key, value) {
                    let ttl = 300;
                    if (key.startsWith("player:")) {
                        ttl = 600;
                    }
                    else if (key.startsWith("key")) {
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
        }
        else if (resource === RequestType.USERNAME) {
            const [name] = args;
            const uuid = await mojangCache.get(`mojang:${name}`);
            if (uuid !== undefined) {
                return await hypixelClient.getClient().player.uuid(uuid);
            }
            else {
                const res = await hypixelClient.getClient().player.username(name);
                if (res.uuid !== undefined) {
                    await mojangCache.set(`mojang:${name}`, res.uuid);
                }
                return res;
            }
        }
        else if (resource === RequestType.UUID) {
            const [uuid] = args;
            return await hypixelClient.getClient().player.uuid(uuid);
        }
        return null;
    });
    ipcMain.handle("mcutils", async (event, resource, player) => {
        let url;
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
            const response = await axios(url, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "User-Agent": "Run-Bedwars-Overlay-" + overlayVersion,
                    "Run-API-Version": overlayVersion,
                },
            });
            return { data: response.data, status: response.status };
        }
        catch (e) {
            return { data: null, status: 400 };
        }
    });
    ipcMain.handle("seraph", async (event, endpoint, uuid, hypixelApiKey, hypixelApiKeyOwner, runApiKey, overlayUuid) => {
        if (endpoint === RunEndpoints.KEY) {
            const response = await axios(`https://antisniper.seraph.si/api/v3/key`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "User-Agent": "Run-Bedwars-Overlay-" + overlayVersion,
                    "Run-API-Version": overlayVersion,
                    "RUN-API-Key": runApiKey,
                    "run-api-uuid": overlayUuid,
                },
            });
            return { data: response.data, status: response.status };
        }
        else {
            const response = await axios(`https://antisniper.seraph.si/api/v3/${endpoint}?uuid=${uuid}`, {
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
            return { data: response.data, status: response.status };
        }
    });
};
const registerElectronStore = () => {
    ipcMain.on("configSet", async (event, data) => {
        electronStore.set(data.key, data.data);
    });
    ipcMain.handle("configGet", async (event, data) => {
        return electronStore.get(data.key);
    });
};
const registerLogCommunications = () => {
    ipcMain.handle("isFileReadable", async (event, path) => {
        return await fs.promises
            .access(path, fs.constants.R_OK)
            .then(() => true)
            .catch(() => false);
    });
    ipcMain.handle("selectLogFile", async (event, args) => {
        return await dialog.showOpenDialog(appWindow, {
            defaultPath: app.getPath("appData"),
            filters: [
                {
                    name: "Logs",
                    extensions: ["log"],
                },
            ],
            properties: ["openFile"],
        });
    });
    ipcMain.on("logFileSet", async (event, path) => {
        electronStore.set("overlay.logPath", path);
        logFileReadline?.close();
        logFileReadline = null;
        await logFileTail?.quit();
        logFileTail = null;
        if (path !== null) {
            logFileTail = new TailFile(path);
            await logFileTail.start();
            logFileReadline = readline.createInterface({
                input: logFileTail,
            });
            logFileReadline.on("line", (line) => {
                appWindow?.webContents.send("logFileLine", line);
            });
        }
    });
};
//# sourceMappingURL=appWindow.js.map