/**
 * Adds intellisense to each IpcRenderer
 */
const IPCValidInvokeArray = ["hypixel", "seraph", "mcutils", "selectLogFile", "isFileReadable", "boomza", "keathiz", "observer", "lunar", "playerdb", "tagsGet", "getWholeStore", "getFilePath", "notifications", "registerGlobalKeybinds"] as const;
export type IPCValidInvokeChannels = typeof IPCValidInvokeArray[number];

const IPCValidOnArray = ["logFileLine"] as const;
export type IPCValidOnChannels = typeof IPCValidOnArray[number];

const IPCValidSendArray = ["logFileSet", "windowMinimise", "windowMaximise", "windowClose", "tagsSet", "opacity", "ContactStaff", "openExternal"] as const;
export type IPCValidSendChannels = typeof IPCValidSendArray[number];
