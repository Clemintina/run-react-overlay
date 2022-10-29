import {IPCResponse, RequestType} from "@common/utils/externalapis/RunApi";
import { KeathizEndpoints } from "./externalapis/BoomzaApi";

/**
 * Adds intellisense to each IpcRenderer
 */
const IPCValidInvokeArray = ["hypixel", "registerGlobalKeybinds", "seraph", "isAdmin", "autoLog", "mcutils", "selectLogFile", "isFileReadable", "boomza", "keathiz", "observer", "lunar", "playerdb", "tagsGet", "getWholeStore", "getFilePath", "notifications", "getAppInfo", "astolfo", "openlink"] as const;
export type IPCValidInvokeChannels = typeof IPCValidInvokeArray[number];

const IPCValidOnArray = ["logFileLine", "globalShortcutPressed", "updater"] as const;
export type IPCValidOnChannels = typeof IPCValidOnArray[number];

const IPCValidSendArray = ["logFileSet", "windowToggle", "windowMinimise", "windowMaximise", "windowClose", "tagsSet", "opacity", "ContactStaff", "openExternal"] as const;
export type IPCValidSendChannels = typeof IPCValidSendArray[number];

enum IpcValidInvokeChannels {
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
    PLAYER_DB = "playerdb",
    GET_FILE_PATH = "getFilePath",
    NOTIFICATIONS = "notifications",
    GET_APP_INFO = "getAppInfo",
    ASTOLFO = "astolfo",
    OPEN_LINK = "openlink"
}

export interface IpcChannelMap {
    [IpcValidInvokeChannels.HYPIXEL]: [
        resource: RequestType,
        apiKey: string,
        name?: string | null
    ],
    [IpcValidInvokeChannels.MCUTILS]: [
        resource: RequestType,
        name: string
    ],
    [IpcValidInvokeChannels.IS_FILE_READABLE]: [
        path: string
    ],
    [IpcValidInvokeChannels.BOOMZA]: [
        username: string
    ],
    [IpcValidInvokeChannels.KEATHIZ]: [
        endpoint: KeathizEndpoints,
        uuid: string,
        apiKey: string
    ],
    [IpcValidInvokeChannels.OBSERVER]: [
        uuid: string
    ],
    [IpcValidInvokeChannels.LUNAR]: [
        uuid: string
    ],
    [IpcValidInvokeChannels.PLAYER_DB]: [
        uuid: string
    ],
    [IpcValidInvokeChannels.GET_FILE_PATH]: [
        request: string
    ],
    [IpcValidInvokeChannels.NOTIFICATIONS]: [
        message: string,
        subtitle: string | undefined
    ],
    [IpcValidInvokeChannels.OPEN_LINK]: [
        link: string
    ];
}

class IpcRendererExtension<IpcInvokeChannelMap> {
    public async invoke<T>(channel: keyof IpcInvokeChannelMap, ...args: IpcInvokeChannelMap[typeof channel][]): Promise<IPCResponse<T>> {
        return window.ipcRenderer.invoke<T>(channel.toString(), ...args);
    }
}

const ipcRendererExtension = new IpcRendererExtension<IpcChannelMap>();

export {ipcRendererExtension, IpcValidInvokeChannels};
