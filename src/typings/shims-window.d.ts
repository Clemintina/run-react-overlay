import {IpcRenderer} from "electron";

declare global {
    interface Window {
        ipcRenderer: IpcRenderer;
        config: {
            set(key: string, data: any);
            get(key: string);
        };
    }
}
