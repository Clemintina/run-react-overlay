import { app, BrowserWindow, dialog, globalShortcut, ipcMain, IpcMainInvokeEvent, Notification, NotificationConstructorOptions, shell } from "electron";
import { registerTitlebarIpc } from "@misc/window/titlebarIPC";
import path from "path";
import axios, { AxiosRequestConfig } from "axios";
import fs from "fs";
import TailFile from "@logdna/tail-file";
import readline from "readline";
import { caching, MemoryCache } from "cache-manager";
import Store from "electron-store";
import { getDefaultElectronStore, Join, PathsToStringProps, RUNElectronStore, RUNElectronStoreType } from "@renderer/store/ElectronStoreUtils";
import { RequestType, RunEndpoints } from "@common/utils/externalapis/RunApi";
import { HypixelApi } from "./HypixelApi";
import AppUpdater from "./AutoUpdate";
import { BoomzaAntisniper, KeathizEndpoints } from "@common/utils/externalapis/BoomzaApi";
import { AppInformation, CustomFileIpc, CustomFileJsonType, ProxyStore, ProxyType } from "@common/utils/Schemas";
import * as tunnel from "tunnel";
import { handleIPCSend } from "@main/Utils";
import destr from "destr";
import windowStateKeeper from "electron-window-state";
import { LogFileMessage } from "@common/utils/LogFileReader";
import { GenericHTTPError, InvalidKeyError, RateLimitError } from "@common/zikeji";
import log from "electron-log";
import psList from "ps-list";
import express from "express";
import { RequestedTooManyTimes } from "@common/zikeji/errors/RequestedTooManyTimes";
import { Agent } from "https";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import got, { ExtendOptions } from "got";
import { PolsuApi } from "@clemintina/seraph-library";

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
/** Overlay Variables */
const overlayVersion = app.getVersion();
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
	"User-Agent": `application/seraph-overlay-${overlayVersion} Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36`,
} as const;
const registeredGlobalKeybinds = new Set<string>();
const startTimestamp = new Date();
const expressApplication = express();
/**
 * Handle caching using {@link [cacheManager](https://www.npmjs.com/package/cache-manager)}
 */
let playerCache: MemoryCache;
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
const electronStoreSchema = destr(JSON.stringify(RUNElectronStore));
const electronStore = new Store<RUNElectronStoreType>({
	schema: electronStoreSchema.properties,
	defaults: getDefaultElectronStore,
});
/**
 * Generates typings from the **existing** config.json file
 */
export type RUNElectronStoreTyped = Join<PathsToStringProps<typeof electronStore.store>, ".">;

let update = {
	release: app.getVersion(),
	updateAvailable: false,
	ready: false,
	releaseDate: new Date().getUTCMilliseconds(),
};

/**
 * Configures the log reader. See {@link [TailFile](https://www.npmjs.com/package/@logdna/tail-file)} for more information.
 */
let logFileTail: TailFile | null = null;
let logFileReadline: readline.Interface | null = null;
let appWindow: BrowserWindow;

/**
 * Axios HTTP Client
 */
const axiosConfig: AxiosRequestConfig = {
	headers: {
		...headers,
		"Run-API-Version": overlayVersion,
		"Accept-Encoding": "gzip,deflate,compress",
	},
	timeout: 20000,
	timeoutErrorMessage: "Connection Timed Out!",
	responseType: "json",
	validateStatus: () => true,
};
const axiosClient = axios.create(axiosConfig);
axiosClient.defaults.httpsAgent = new Agent({
	maxVersion: "TLSv1.3",
	minVersion: "TLSv1.2",
});

const gotCacheMap = new Map();
export const gotOptions: ExtendOptions = {
	headers: {
		"Run-API-Version": overlayVersion,
	},
	responseType: "json",
	cache: gotCacheMap,
	cacheOptions: {
		immutableMinTimeToLive: 60000,
	},
	retry: {
		maxRetryAfter: 100,
	},
	throwHttpErrors: false,
	http2: false,
} as const;

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export const createAppWindow = (): BrowserWindow => {
	const mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600,
	});
	const options: BrowserWindowConstructorOptions = {
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		show: false,
		autoHideMenuBar: true,
		frame: false,
		transparent: true,
		titleBarStyle: "hidden",
		useContentSize: true,
		icon: path.join("assets", "images", "icon.ico"),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			nodeIntegrationInWorker: false,
			nodeIntegrationInSubFrames: false,
			preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	};
	if (process.platform === "darwin") {
		options.type = "panel";
	}

	appWindow = new BrowserWindow(options);

	appWindow.setAlwaysOnTop(true, "screen-saver");
	appWindow.setVisibleOnAllWorkspaces(true);
	mainWindowState.manage(appWindow);
	const updates = electronStore.get("settings.updater");

	appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY, { userAgent: "SeraphOverlay" });

	let isPortOpen = false;

	if (process.platform === "win32" && !isDevelopment) {
		expressApplication.post("/mc_chat", async (req, res) => {
			const line = req.query.msg;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const newLine = line.replaceAll(/\u00A7[\dA-FK-OR]/gi, "");
			appWindow?.webContents.send(
				"logFileLine",
				handleIPCSend<LogFileMessage>({
					data: { message: newLine },
					status: 200,
				}),
			);
			res.status(200).send({ success: true, code: 200 });
		});
		const portfinder = require("portfinder");
		portfinder.setBasePort(5000);
		portfinder.setHighestPort(5000);
		portfinder
			.getPortPromise({ port: 5000, host: "localhost" })
			.then(() => {
				isPortOpen = true;
			})
			.catch(() => {
				console.log("Port closed");
			});
	}

	appWindow.on("ready-to-show", async () => {
		if (!isDevelopment && updates) {
			if (!require("electron-squirrel-startup") && process.platform === "win32") {
				const autoUpdater = new AppUpdater().getAutoUpdater();
				log.info("Running updater");
				autoUpdater.checkForUpdates();
				setInterval(() => autoUpdater.checkForUpdates(), 60 * 20 * 1000);
				autoUpdater.on("checking-for-update", async () => {
					log.info("Checking for updates...");
				});
				autoUpdater.on("error", async (error) => log.error(error));
				autoUpdater.on("update-available", async (event, releaseNotes, releaseName, releaseDate, updateURL) => {
					log.info("Update available");
					update = {
						...update,
						updateAvailable: true,
						release: releaseName,
						releaseDate,
					};
					appWindow?.webContents.send("updater", JSON.stringify({ data: { version: app.getVersion(), update: { ...update, ready: false } }, status: 200 }));
				});
				autoUpdater.on("update-downloaded", async (event, releaseNotes, releaseName, releaseDate, updateURL) => {
					log.info("Updating Overlay to " + releaseName);
					appWindow?.webContents.send("updater", JSON.stringify({ data: { version: app.getVersion(), update: { ...update, ready: true } }, status: 200 }));
					setTimeout(() => {
						autoUpdater.quitAndInstall();
					}, 5000);
				});
			}
		}
		appWindow.show();
		if (isPortOpen && process.platform === "win32") {
			expressApplication.listen(5000, () => {
				console.log("Express started");
			});
		}
		playerCache = await caching("memory", { ttl: 120 * 5, max: 1000 });
	});

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
	registerExternalApis();
	registerLogCommunications();
	registerMainWindowCommunications();
	registerOverlayFeatures();
	registeredGlobalKeybindsForApp();
};

/**
 * Register Seraph Inter Process Communication
 */
const registerSeraphIPC = () => {
	ipcMain.handle("hypixel", async (event: IpcMainInvokeEvent, args: string[]) => {
		const resource = args[0] as string;
		const apiKey = args[1] as string;
		let playerName: string = "" as string;
		let proxyHypixel: { proxy: Agent } | {} =
			args[3] != undefined && args[3]?.length > 2
				? {
						proxy: getProxyChannel(),
				  }
				: {};
		if (args[2] != undefined) playerName = args[2].toLowerCase() as string;
		const hypixelClient = new HypixelApi(apiKey, {
			...proxyHypixel,
			cache: playerCache,
			retries: resource === RequestType.KEY ? 0 : 2,
			timeout: 7200,
		});
		const client = hypixelClient.getClient();
		if (resource === RequestType.KEY) {
			try {
				return await client.key();
			} catch (e) {
				return getErrorHandler(e);
			}
		} else if (resource === RequestType.USERNAME) {
			const uuid: string | undefined = await playerCache.get(`mojang:${playerName}`);
			if (playerName.length == 32 || uuid?.length == 32) {
				try {
					return await hypixelClient.getClient().player.uuid(uuid ?? playerName);
				} catch (e) {
					return getErrorHandler(e);
				}
			} else {
				try {
					const res = await hypixelClient.getClient().player.username(uuid ?? playerName);
					if (res?.data?.uuid) {
						await playerCache.set(`mojang:${playerName}`, res.data.uuid);
					}
					return res;
				} catch (e) {
					if (e instanceof RequestedTooManyTimes) {
						try {
							const response = await axiosClient(`https://playerdb.co/api/player/minecraft/${playerName}`, {
								headers: {
									Accept: "application/json",
								},
							});
							if (response.data.code != "player.found") {
								return { data: null, status: response.status };
							}
							try {
								const res = await hypixelClient.getClient().player.uuid(response.data.data.player.raw_id);
								if (res.data.displayname.toLowerCase() != playerName) {
									return { data: null, status: 400 };
								}
								if (res?.data?.uuid) {
									await playerCache.set(`mojang:${playerName}`, res.data.uuid);
								}
								return res;
							} catch (e) {
								return getErrorHandler(e);
							}
						} catch (e) {
							return { data: null, status: 400 };
						}
					} else {
						return getErrorHandler(e);
					}
				}
			}
		} else if (resource === RequestType.UUID) {
			try {
				return await hypixelClient.getClient().player.uuid(playerName);
			} catch (e) {
				return getErrorHandler(e);
			}
		} else if (resource === RequestType.FRIENDS) {
			try {
				return await hypixelClient.getClient().friends.uuid(playerName);
			} catch (e) {
				return getErrorHandler(e);
			}
		} else if (resource === RequestType.GUILD_PLAYER) {
			try {
				return await hypixelClient.getClient().guild.player(playerName);
			} catch (e) {
				return getErrorHandler(e);
			}
		}
		return null;
	});

	ipcMain.handle("mcutils", async (event: IpcMainInvokeEvent, args: string[]) => {
		let url: string;
		const playerClean = args[0] as string;
		const resource = args[1] as string;
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
			const response = await axiosClient(url, { headers });
			return { data: response.data, status: response.status };
		} catch (e) {
			return { data: null, status: 400 };
		}
	});

	ipcMain.handle("seraph", async (event: IpcMainInvokeEvent, args: string[]) => {
		const endpoint = args[0],
			uuid = args[1],
			hypixelApiKey = args[2],
			hypixelApiKeyOwner = args[3],
			runApiKey = args[4],
			overlayUuid = args[5];

		const gotClient = got.extend(gotOptions);
		const seraphHeaders = {
			...headers,
			"Run-API-Version": overlayVersion,
			//"seraph-api-key": runApiKey,
			"run-api-key": runApiKey,
			"run-api-uuid": overlayUuid,
			"API-Key": hypixelApiKey,
			"API-Key-Owner": hypixelApiKeyOwner,
		};

		if (endpoint === RunEndpoints.KEY) {
			const { body, statusCode } = await gotClient.get(`https://api.seraph.si/key`, {
				headers: {
					...headers,
					...seraphHeaders,
				},
			});
			return { data: body, status: statusCode };
		} else if (endpoint == RunEndpoints.BLACKLIST) {
			const { body, statusCode } = await gotClient.get(`https://beta.seraph.si/blacklist/${uuid}`, {
				headers: {
					...seraphHeaders,
				},
			});
			return { data: body, status: statusCode };
		} else {
			const { body, statusCode } = await gotClient.get(`https://antisniper.seraph.si/v4/${endpoint}?uuid=${uuid}`, {
				headers: {
					...seraphHeaders,
				},
			});
			return { data: body, status: statusCode };
		}
	});

	ipcMain.handle("lunar", async (event: IpcMainInvokeEvent, args: string[]) => {
		const uuid = args[0];
		const response = await axiosClient(`https://lunar.seraph.si/${uuid}`, { headers });
		return { status: response.status, data: response.data };
	});
};

/**
 * Register Log Inter Process Communication
 */
const registerLogCommunications = () => {
	ipcMain.handle("isFileReadable", async (event: IpcMainInvokeEvent, args: string[]) => {
		return {
			data: await fs.promises
				.access(args[0], fs.constants.R_OK)
				.then(() => true)
				.catch(() => false),
			status: 200,
		};
	});

	ipcMain.handle("selectLogFile", async (event, args) => {
		return await dialog.showOpenDialog(appWindow, {
			defaultPath: args[1] ?? app.getPath("appData"),
			filters: args[0],
			properties: ["openFile"],
		});
	});

	ipcMain.handle("readFile", (event, args) => {
		const data: CustomFileIpc = {
			fileType: "text",
			contents: fs.readFileSync(args[0], {
				encoding: "utf-8",
			}),
		};
		return {
			data,
			status: 200,
		};
	});

	ipcMain.on("logFileSet", async (event: IpcMainInvokeEvent, ...args) => {
		const path = args[0];
		logFileReadline?.close();
		logFileReadline = null;

		await logFileTail?.quit();
		logFileTail = null;

		if (path !== null) {
			logFileTail = new TailFile(path.replace("\\", "/"), {
				pollFileIntervalMs: 20,
				encoding: "utf-8",
			});
			await logFileTail.start();

			logFileReadline = readline.createInterface({
				input: logFileTail,
			});

			logFileReadline.on("line", async (line) => {
				if (line.includes("[Client thread/INFO]: [CHAT]") || line.includes("[main/INFO]: [CHAT] ")) {
					appWindow?.webContents.send(
						"logFileLine",
						handleIPCSend<LogFileMessage>({
							data: { message: line },
							status: 200,
						}),
					);
				} else if (line.includes("[Astolfo HTTP Bridge]: [CHAT]")) {
					const newLine = line.replaceAll(/\u00A7[0-9A-FK-OR]/gi, ""); // clean
					appWindow?.webContents.send(
						"logFileLine",
						handleIPCSend<LogFileMessage>({
							data: { message: newLine },
							status: 200,
						}),
					);
				} else {
					return;
				}
			});
		}
	});

	ipcMain.handle("getFilePath", async (event: IpcMainInvokeEvent, args: string[]) => {
		const request = args[0];
		let appPath;
		switch (request) {
			case "home":
				appPath = app.getPath("home").replace(/\\/g, "/");
				break;
			case "userData":
				appPath = app.getPath("userData").replace(/\\/g, "/");
				break;
			case "appData":
				appPath = app.getPath("appData").replace(/\\/g, "/");
				break;
			default:
				appPath = null;
				break;
		}
		return { data: appPath, status: 200 };
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

	ipcMain.on("windowToggle", () => {
		appWindow?.isVisible() ? appWindow?.minimize() : appWindow?.showInactive();
	});

	ipcMain.on("windowReload", async () => {
		appWindow?.reload();
	});

	ipcMain.on("opacity", async (event, args: string[]) => {
		appWindow.setOpacity(Number.parseInt(args[0]));
	});

	ipcMain.handle("getAppInfo", async () => {
		appWindow?.webContents.send("updater", handleIPCSend<AppInformation>({ data: { version: app.getVersion(), update: { ...update } }, status: 200 }));
		return { data: { version: app.getVersion(), update }, status: 200 };
	});
};

/**
 * Register External Inter Process Communications
 */
const registerExternalApis = () => {
	ipcMain.handle("boomza", async (event: IpcMainInvokeEvent, args: string[]) => {
		const username = args[0];
		const response = await axiosClient(`http://db.dfg87dcbvse44.xyz:8080/?playerv5=${username}`, {
			headers,
			httpsAgent: getProxyChannel(),
			proxy: false,
		});
		const json_response = destr(response.data.toString().replaceAll("'", '"').toLowerCase());
		let json: BoomzaAntisniper;
		try {
			json = { sniper: json_response.sniper, report: json_response.report, error: false, username: username };
		} catch (e) {
			json = { sniper: false, report: 0, error: true, username: username };
		}
		return { data: json, status: response.status };
	});

	ipcMain.handle("keathiz", async (event: IpcMainInvokeEvent, args: string[]) => {
		const endpoint = args[0],
			uuid = args[1],
			apikey = args[2];
		let params;
		if (endpoint == KeathizEndpoints.OVERLAY_RUN) {
			params = `&uuid=${uuid}`;
		} else if (endpoint == KeathizEndpoints.DENICK) {
			params = `&nick=${uuid}`;
		}
		const response = await axiosClient(`https://api.antisniper.net/${endpoint}?key=${apikey}${params}`, {
			headers,
			httpsAgent: getProxyChannel(),
			proxy: false,
		});
		return { data: response.data, status: response.status };
	});

	ipcMain.handle("observer", async (event: IpcMainInvokeEvent, args: string[]) => {
		const uuid = args[0];
		const apikey = args[1];
		const response = await axiosClient(`https://api.invite.observer/v1/daily?uuid=${uuid}&key=${apikey}`, { headers });
		return { data: response.data, status: response.status };
	});

	ipcMain.handle("playerdb", async (event: IpcMainInvokeEvent, args: string[]) => {
		const uuid = args[0];
		const response = await axiosClient(`https://playerdb.co/api/player/minecraft/${uuid}`, { headers });
		return { data: response.data, status: response.status };
	});

	ipcMain.handle("polsu", async (event: IpcMainInvokeEvent, args: string[]) => {
		const endpoint = args[0],
			apiKey = args[1],
			uuid = args[2] ? args[2] : undefined;
		const polsuApi = new PolsuApi({ apiKey, timeout: 10000 });

		if (endpoint == "session") {
			if (uuid) {
				const response = await polsuApi.getBedwarsSession(uuid);
				return { data: response, status: response.code };
			}
		} else if (endpoint == "apikey") {
			const response = await polsuApi.getKeyInformation();
			return { data: response, status: response.code };
		}
	});

	ipcMain.handle("customUrl", async (event: IpcMainInvokeEvent, args: string[]) => {
		try {
			const response = await axiosClient.get<{ data: CustomFileJsonType }>(args[0], { headers });
			return { data: response.data.data, status: response.status };
		} catch (e) {
			return { data: null, response: 400 };
		}
	});
};

const registerOverlayFeatures = () => {
	ipcMain.handle("notifications", async (event: IpcMainInvokeEvent, message: string, subtitle: string | undefined) => {
		const options: NotificationConstructorOptions = {
			title: "Seraph Overlay",
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

	ipcMain.handle("isAdmin", async () => {
		const isAdmin = false;
		return { data: isAdmin, status: 200 };
	});

	ipcMain.handle("autoLog", async () => {
		const processNames: string[] = [];
		const appData = app.getPath("appData").replace(/\\/g, "/");
		const home = app.getPath("home").replace(/\\/g, "/");
		const isMacOs = appData.includes("Application Support");
		let path = isMacOs ? appData + "/minecraft/logs/" : appData + "/.minecraft/logs/";
		psList().then((data) => {
			for (const process of data) {
				processNames.push(process.name);
			}
			if (processNames.includes("Badlion Client.exe")) {
				path = isMacOs ? appData + "/minecraft/logs/blclient/minecraft/" : appData + "/.minecraft/logs/blclient/minecraft/";
			} else if (processNames.includes("Lunar Client.exe")) {
				path = home + "/.lunarclient/offline/multiver/logs/";
			} else if (processNames.includes("MinecraftLauncher.exe")) {
				path = isMacOs ? appData + "/minecraft/logs/" : appData + "/.minecraft/logs/";
			}
		});
		path += "latest.log";
	});

	ipcMain.handle("openlink", async (event: IpcMainInvokeEvent, args: string[]) => {
		await shell.openExternal(args[0]);
	});

	ipcMain.handle("astolfo", async (event: IpcMainInvokeEvent, args: string[]) => {
		const content = `local char_to_hex = function(c)
        return string.format("%%%02X", string.byte(c))
      end
      
      local function urlencode(url)
        if url == nil then
          return
        end
        url = url:gsub("\n", "\r\n")
        url = string.gsub(url, "([^%w _ %- . ~])", char_to_hex)
        url = url:gsub(" ", "+")
        return url
      end
      
      local chat_bridge = {
        on_receive_packet = function(e)
          if e.packet_id == 2 then
            local chat_msg = urlencode(e.message)
            http.post_async("http://127.0.0.1:5000/mc_chat?msg=" .. chat_msg, {
                run = function(text)
                end
            })
          end
        end
      }
      
      
      module_manager.register("chat_bridge", chat_bridge)`;

		const appData = app.getPath("appData").replace(/\\/g, "/");
		const path = appData + "/astolfo/scripts/chat_bridge.lua";
		try {
			fs.writeFileSync(path, content);
		} catch (err) {
			console.error(err);
		}
	});
};

const getProxyChannel = () => {
	let proxyStore: ProxyStore = {
		enableProxies: true,
		hasAuth: true,
		hostname: "p.webshare.io",
		port: "80",
		username: "twtmuzmg-rotate",
		password: "8nhzubu4xg33",
		type: ProxyType.HTTP,
	};
	return tunnel.httpsOverHttp({
		proxy: {
			host: proxyStore.hostname,
			port: Number(proxyStore.port),
			proxyAuth: proxyStore.username + ":" + proxyStore.password,
		},
	});
};

const getErrorHandler = (e) => {
	if (e instanceof RateLimitError) return e.getJson();
	else if (e instanceof InvalidKeyError) return e.getJson();
	else if (e instanceof GenericHTTPError) return e.getJson();
	else if (e instanceof RequestedTooManyTimes) return e.getJson();
	else return { data: undefined, status: 400 };
};

const registeredGlobalKeybindsForApp = () => {
	ipcMain.handle("registerGlobalKeybinds", async (event, keybinds) => {
		for (const shortcut of registeredGlobalKeybinds) {
			globalShortcut.unregister(shortcut);
			registeredGlobalKeybinds.delete(shortcut);
		}

		for (const { keybind } of keybinds) {
			try {
				globalShortcut.register(keybind, () => appWindow?.webContents.send("globalShortcutPressed", keybind));
				registeredGlobalKeybinds.add(keybind);
			} catch (err) {
				console.log(err);
			}
		}
	});
};

app.on("will-quit", () => {
	for (const shortcut of registeredGlobalKeybinds) {
		globalShortcut.unregister(shortcut);
		registeredGlobalKeybinds.delete(shortcut);
	}
});
