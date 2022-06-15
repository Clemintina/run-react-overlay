import '@misc/window/windowPreload';
import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld('ipcRenderer', {
    invoke:  (channel: string, ...args: any[]) => {
        if (channel === 'hypixel') {
            return ipcRenderer.invoke(channel, ...args);
        } else if (channel === 'seraph') {
            return ipcRenderer.invoke(channel, ...args);
        } else if (channel === 'mcutils') {
            return ipcRenderer.invoke(channel, ...args);
        }
    }
})

contextBridge.exposeInMainWorld('config', {
    set: (key: string, data: any) => {
        return ipcRenderer.send('configSet', {key, data});
    },
    get: (key: string) => {
        return ipcRenderer.invoke('configGet', {key});
    }
})

// Get versions
window.addEventListener('DOMContentLoaded', () => {
    console.log("Loaded DOM");
});
