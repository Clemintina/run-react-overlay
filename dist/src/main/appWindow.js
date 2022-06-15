import { app, BrowserWindow, ipcMain } from 'electron';
import { registerTitlebarIpc } from '@misc/window/titlebarIPC';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import TailFile from '@logdna/tail-file';
import readline from 'readline';
import cacheManager from 'cache-manager';
import { Client } from "@zikeji/hypixel";
import Store from "electron-store";
import { RequestType, RunEndpoints } from "@common/utils/externalapis/RunApi";
import { HypixelApi } from "@common/utils/HypixelApi";
const overlayVersion = app.getVersion();
const playerCache = cacheManager.caching({ ttl: 60 * 5, store: 'memory' });
const isDevelopment = process.env.NODE_ENV !== 'production';
const electronStore = new Store({ schema: {} });
electronStore.set('run.overlay.version', app.getVersion());
let logFileTail = null;
let logFileReadline = null;
let appWindow;
/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export const createAppWindow = () => {
    appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#1f252c',
        show: false,
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: 'hidden',
        icon: path.resolve('assets/images/appIcon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });
    appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);
    appWindow.on('ready-to-show', () => appWindow.show());
    registerMainIPC();
    appWindow.on('close', () => {
        appWindow = null;
        app.quit();
    });
    return appWindow;
};
/**
 * Register Inter Process Communication
 */
const registerMainIPC = () => {
    registerTitlebarIpc(appWindow);
    registerSeraphIPC();
};
/**
 * Register Seraph Inter Process Communication
 */
const registerSeraphIPC = () => {
    ipcMain.handle('isFileReadable', async (event, path) => {
        return await fs.promises.access(path, fs.constants.R_OK).then(() => true).catch(() => false);
    });
    ipcMain.on('logFileSet', async (event, path) => {
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
            logFileReadline.on('line', (line) => {
                appWindow?.webContents.send('logFileLine', line);
            });
        }
    });
    ipcMain.handle('hypixel', async (event, key, resource, ...args) => {
        const client = new Client(key, {
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
                    return playerCache.set(`hypixel:${key}`, value, { ttl: ttl });
                }
            }, userAgent: 'Run-Bedwars-Overlay-' + overlayVersion, retries: 2, timeout: 7200
        });
        const hypixelClient = new HypixelApi(client);
        if (resource === RequestType.KEY) {
            return await client.key();
        }
        else if (resource === RequestType.USERNAME) {
            const [name] = args;
            return await hypixelClient.username(name);
        }
        else if (resource === RequestType.UUID) {
            const [uuid] = args;
            return await hypixelClient.uuid(uuid);
        }
        else if (resource === RequestType.GUILD_PLAYER) {
            const [player] = args;
            return await client.guild.player(player);
        }
        else if (resource === RequestType.FRIENDS) {
            const [player] = args;
            return await client.friends.uuid(player);
        }
        else if (resource === RequestType.RECENT_GAMES) {
            const [player] = args;
            return await client.recentGames.uuid(player);
        }
    });
    ipcMain.handle('mcutils', async (event, resource, player) => {
        let url;
        const playerClean = player.replace("-", "");
        if (resource === RequestType.USERNAME)
            url = `https://mc.seraph.si/uuid/${playerClean}`;
        else if (resource === RequestType.UUID)
            url = `https://mc.seraph.si/username/${playerClean}`;
        else
            url = 'https://mc.seraph.si';
        const response = await axios(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Run-Bedwars-Overlay-' + overlayVersion,
                'Run-API-Version': overlayVersion
            }
        });
        return { data: response.data, status: response.status };
    });
    ipcMain.handle('seraph', async (event, endpoint, uuid, hypixelApiKey, hypixelApiKeyOwner, runApiKey, overlayUuid) => {
        if (endpoint === RunEndpoints.KEY) {
            const response = await axios(`https://antisniper.seraph.si/api/v3/key`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'Run-Bedwars-Overlay-' + overlayVersion,
                    'Run-API-Version': overlayVersion,
                    'RUN-API-Key': runApiKey,
                    'run-api-uuid': overlayUuid
                }
            });
            return { data: response.data, status: response.status };
        }
        else {
            const response = await axios(`https://antisniper.seraph.si/api/v3/${endpoint}?uuid=${uuid}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'Run-Bedwars-Overlay-' + overlayVersion,
                    'API-Key': hypixelApiKey,
                    'API-Key-Owner': hypixelApiKeyOwner,
                    'Run-API-Key': runApiKey,
                    'Run-API-Version': overlayVersion,
                    'RUN-API-UUID': overlayUuid
                }
            });
            return { data: response.data, status: response.status };
        }
    });
    ipcMain.on('configSet', async (event, data) => {
        electronStore.set(data.key, data.data);
    });
    ipcMain.handle('configGet', async (event, data) => {
        return electronStore.get(data.key);
    });
};
//# sourceMappingURL=appWindow.js.map