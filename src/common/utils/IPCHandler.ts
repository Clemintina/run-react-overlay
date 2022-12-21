import { RequestType, RunEndpoints } from "@common/utils/externalapis/RunApi";
import { KeathizEndpoints } from "./externalapis/BoomzaApi";
import { KeybindInterface } from "@common/utils/Schemas";

/**
 * Adds intellisense to each IpcRenderer
 */
const IPCValidInvokeArray = ["hypixel", "registerGlobalKeybinds", "seraph", "isAdmin", "autoLog", "mcutils", "selectLogFile", "isFileReadable", "boomza", "keathiz", "observer", "lunar", "playerdb", "getFilePath", "notifications", "getAppInfo", "astolfo", "openlink"] as const;
export type IPCValidInvokeChannels = typeof IPCValidInvokeArray[number];

const IPCValidOnArray = ["logFileLine", "globalShortcutPressed", "updater"] as const;
export type IPCValidOnChannels = typeof IPCValidOnArray[number];

const IPCValidSendArray = ["logFileSet", "windowToggle", "windowMinimise", "windowMaximise", "windowClose", "openExternal"] as const;
export type IPCValidSendChannels = typeof IPCValidSendArray[number];

export enum IpcValidInvokeChannels {
	HYPIXEL = "hypixel",
	GLOBAL_KEYBINDS = "registerGlobalKeybinds",
	SERAPH = "seraph",
	IS_ADMIN = "isAdmin",
	AUTOLOG = "autoLog",
	MCUTILS = "mcutils",
	SELECT_LOG_FILE = "selectLogFile",
	IS_FILE_READABLE = "isFileReadable",
	BOOMZA = "boomza",
	KEATHIZ = "keathiz",
	OBSERVER = "observer",
	LUNAR = "lunar",
	POLSU = "polsu",
	PLAYER_DB = "playerdb",
	GET_FILE_PATH = "getFilePath",
	NOTIFICATIONS = "notifications",
	GET_APP_INFO = "getAppInfo",
	ASTOLFO = "astolfo",
	OPEN_LINK = "openlink",
	READ_FILE = "readFile",
	CUSTOM_URL = "customUrl",
}

export enum IpcValidSendChannels {
	LOG_FILE_SET = "logFileSet",
	WINDOW_TOGGLE = "windowToggle",
	WINDOW_MINIMISE = "windowMinimise",
	WINDOW_MAXIMISE = "windowMaximise",
	WINDOW_CLOSE = "windowClose",
	WINDOW_RELOAD = "windowReload",
	OPEN_EXTERNAL = "openExternal",
}

export type IpcChannelMap = {
	[IpcValidInvokeChannels.HYPIXEL]: [resource: RequestType, apiKey: string, name?: string | null, proxy?: string | undefined];
	[IpcValidInvokeChannels.MCUTILS]: [resource: RequestType, name: string];
	[IpcValidInvokeChannels.SERAPH]: [endpoint: RunEndpoints, uuid: string, hypixelApiKey: string, hypixelApiKeyOwner: string, runApiKey: string, overlayUuid: string];
	[IpcValidInvokeChannels.IS_FILE_READABLE]: [path: string];
	[IpcValidInvokeChannels.BOOMZA]: [username: string];
	[IpcValidInvokeChannels.KEATHIZ]: [endpoint: KeathizEndpoints, uuid: string, apiKey: string];
	[IpcValidInvokeChannels.OBSERVER]: [uuid: string];
	[IpcValidInvokeChannels.LUNAR]: [uuid: string];
	[IpcValidInvokeChannels.POLSU]: [endpoint: "session" | "apikey", apiKey: string, uuid?: string];
	[IpcValidInvokeChannels.PLAYER_DB]: [uuid: string];
	[IpcValidInvokeChannels.GET_FILE_PATH]: [request: string];
	[IpcValidInvokeChannels.NOTIFICATIONS]: [message: string, subtitle: string | undefined];
	[IpcValidInvokeChannels.OPEN_LINK]: [link: string];
	[IpcValidInvokeChannels.GLOBAL_KEYBINDS]: KeybindInterface[];
	[IpcValidInvokeChannels.ASTOLFO]: [];
	[IpcValidInvokeChannels.IS_ADMIN]: [];
	[IpcValidInvokeChannels.AUTOLOG]: [];
	[IpcValidInvokeChannels.SELECT_LOG_FILE]: [filters: Array<{ name: string; extensions: Array<string> }>, cwd?: string];
	[IpcValidInvokeChannels.GET_APP_INFO]: [];
	[IpcValidInvokeChannels.READ_FILE]: [path: string];
	[IpcValidInvokeChannels.CUSTOM_URL]: [url: string];

	[IpcValidSendChannels.LOG_FILE_SET]: [path: string];
	[IpcValidSendChannels.WINDOW_TOGGLE]: [];
	[IpcValidSendChannels.WINDOW_MINIMISE]: [];
	[IpcValidSendChannels.WINDOW_MAXIMISE]: [];
	[IpcValidSendChannels.WINDOW_CLOSE]: [];
	[IpcValidSendChannels.WINDOW_RELOAD]: [];
	[IpcValidSendChannels.OPEN_EXTERNAL]: [filePath: "config_file" | "tag_file"];
};
