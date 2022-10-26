import {IpcRendererEvent} from "electron";
import {IPCValidInvokeChannels, IPCValidOnChannels, IPCValidSendChannels} from "@common/utils/IPCHandler";
import {RUNElectronStoreTagsTyped, RUNElectronStoreTyped} from "@main/appWindow";
import {IPCResponse} from "@common/utils/externalapis/RunApi";

declare global {
    interface Window {
        ipcRenderer: SeraphIpcRenderer;
        config: {
            set(key: RUNElectronStoreTyped | string, data: string | number | object | boolean);
            get(key: RUNElectronStoreTyped | string);
        };
        tags: {
            set(key: RUNElectronStoreTagsTyped | string, data: string | number | object | boolean);
            get(key: RUNElectronStoreTagsTyped | string);
        };
    }

    interface SeraphIpcRenderer extends NodeJS.EventEmitter {
        invoke(channel: IPCValidInvokeChannels, ...args: string[] | unknown[]): Promise<never>;

        invoke<T>(channel: IPCValidInvokeChannels, ...args: string[] | unknown[]): Promise<IPCResponse<T>>;

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
