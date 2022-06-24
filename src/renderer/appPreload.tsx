import "@misc/window/windowPreload";
import {contextBridge, ipcRenderer} from "electron";

/**
 * Allows access to the **ipcRenderer**
 */
contextBridge.exposeInMainWorld("ipcRenderer", {
    /**
     * Register **invoking** data so the **appWindow** file can be used to handle it
     * @see @main/appWindow
     * @param channel
     * @param args
     */
    invoke: (channel: string, ...args: any[]) => {
        const validNoArgs: Array<string> = [""];
        const validArgs: Array<string> = ["hypixel", "seraph", "mcutils", "selectLogFile", "isFileReadable"];
        if (validArgs.includes(channel)) {
            return ipcRenderer.invoke(channel, ...args);
        } else if (validNoArgs.includes(channel)) {
            return ipcRenderer.invoke(channel);
        }
    },
    /**
     * Register **listening** data so the **appWindow** file can be used to send it
     * @see @main/appWindow
     * @param channel
     * @param method
     */
    on: (channel: string, method: any) => {
        const validChannels = ["logFileLine"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, method);
        }
    },
    /**
     * Register **sending** data so the **appWindow** file can be used to receive it
     * @see @main/appWindow
     * @param channel
     * @param data
     */
    send: (channel: string, data: any) => {
        const validChannels = ["logFileSet", "windowMinimise", "windowMaximise", "windowClose"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
});

/**
 * Allow access to **window.config**
 */
contextBridge.exposeInMainWorld("config", {
    /**
     * Set data in the **config.json** file.
     * Register the schema in the **ElectronStoreUtil** file
     * @see @renderer/store/ElectronStoreUtils
     * @param key
     * @param data
     */
    set: (key: string, data: any) => {
        return ipcRenderer.send("configSet", {key, data});
    },
    /**
     * Get data from the **config.json** file.
     * Register the schema in the **ElectronStoreUtil** file
     * @see @renderer/store/ElectronStoreUtils
     * @param key
     */
    get: (key: string) => {
        return ipcRenderer.invoke("configGet", {key});
    },
});

/**
 * Prints when the DOM has loaded
 * @see (https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event)
 */
window.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded DOM");
});
