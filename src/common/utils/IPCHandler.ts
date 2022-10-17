/**
 * Adds intellisense to each IpcRenderer
 */
const IPCValidInvokeArray = ["hypixel",'registerGlobalKeybinds', "seraph", "isAdmin", "autoLog", "mcutils", "selectLogFile", "isFileReadable", "boomza", "keathiz", "observer", "lunar", "playerdb", "tagsGet", "getWholeStore", "getFilePath", "notifications", "registerGlobalKeybinds", "getAppInfo", "astolfo", "openlink"] as const;
export type IPCValidInvokeChannels = typeof IPCValidInvokeArray[number];

const IPCValidOnArray = ["logFileLine",'globalShortcutPressed'] as const;
export type IPCValidOnChannels = typeof IPCValidOnArray[number];

const IPCValidSendArray = ["logFileSet","windowMinimise", "windowMaximise", "windowClose", "tagsSet", "opacity", "ContactStaff", "openExternal"] as const;
export type IPCValidSendChannels = typeof IPCValidSendArray[number];
