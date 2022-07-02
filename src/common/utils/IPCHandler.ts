/**
 * Adds intellisense to each IpcRenderer
 */
const IPCValidInvokeArray = ["hypixel", "seraph", "mcutils", "selectLogFile", "isFileReadable", "boomza", "keathiz", "observer", "lunar", "playerdb", "tagsGet"] as const;
export type IPCValidInvokeChannels = typeof IPCValidInvokeArray[number];

const IPCValidOnArray = ["logFileLine"] as const;
export type IPCValidOnChannels = typeof IPCValidOnArray[number];

const IPCValidSendArray = ["logFileSet", "windowMinimise", "windowMaximise", "windowClose", "tagsSet"] as const;
export type IPCValidSendChannels = typeof IPCValidSendArray[number];
