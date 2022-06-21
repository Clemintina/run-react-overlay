import "@misc/window/windowPreload";
import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("ipcRenderer", {
    invoke: (channel: string, ...args: never[]) => {
        const validNoArgs: Array<string> = [""];
        const validArgs: Array<string> = ["hypixel", "seraph", "mcutils", "selectLogFile", "isFileReadable"];

        if (validArgs.includes(channel)) {
            return ipcRenderer.invoke(channel, ...args);
        } else if (validNoArgs.includes(channel)) {
            return ipcRenderer.invoke(channel);
        }
    },
    on: (channel: string, method: any) => {
        const validChannels = ["logFileLine"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, method);
        }
    },
    send: (channel: string, data: never) => {
        const validChannels = ["logFileSet"];

        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
});

contextBridge.exposeInMainWorld("config", {
    set: (key: string, data: any) => {
        return ipcRenderer.send("configSet", {key, data});
    },
    get: (key: string) => {
        return ipcRenderer.invoke("configGet", {key});
    },
});

window.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded DOM");
});
