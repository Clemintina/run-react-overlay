import {IpcRendererEvent} from "electron";
import {IPCValidInvokeChannels, IPCValidOnChannels, IPCValidSendChannels} from "@common/utils/IPCHandler";

declare global {
    interface Window {
        ipcRenderer: SeraphIpcRenderer;
        config: {
            set(key: string, data: any);
            get(key: string);
        };
    }

    interface SeraphIpcRenderer extends NodeJS.EventEmitter {
        invoke(channel: IPCValidInvokeChannels, ...args: any[]): Promise<any>;
        on(channel: IPCValidOnChannels, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;
        once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;
        postMessage(channel: string, message: any, transfer?: MessagePort[]): void;
        removeAllListeners(channel: string): this;
        removeListener(channel: string, listener: (...args: any[]) => void): this;
        send(channel: IPCValidSendChannels, ...args: any[]): void;
        sendSync(channel: string, ...args: any[]): any;
        sendTo(webContentsId: number, channel: string, ...args: any[]): void;
        sendToHost(channel: string, ...args: any[]): void;
    }
}
