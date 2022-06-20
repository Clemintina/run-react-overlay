import "@misc/window/windowPreload";
import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("ipcRenderer", {
    invoke: (channel, ...args) => {
        if (channel === "hypixel") {
            return ipcRenderer.invoke(channel, ...args);
        }
        else if (channel === "seraph") {
            return ipcRenderer.invoke(channel, ...args);
        }
        else if (channel === "mcutils") {
            return ipcRenderer.invoke(channel, ...args);
        }
    },
    on: (channel, method) => {
        const validChannels = ["logFileLine"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, method);
        }
    },
    send: (channel, data) => {
        const validChannels = ["logFileSet"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
});
contextBridge.exposeInMainWorld("config", {
    set: (key, data) => {
        return ipcRenderer.send("configSet", { key, data });
    },
    get: (key) => {
        return ipcRenderer.invoke("configGet", { key });
    },
});
window.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded DOM");
});
//# sourceMappingURL=appPreload.js.map