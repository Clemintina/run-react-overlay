import { IpcRendererEvent } from "electron";
import { IpcChannelMap, IPCValidOnChannels, IPCValidSendChannels } from "@common/utils/IPCHandler";
import { RUNElectronStoreTagsTyped, RUNElectronStoreTyped } from "@main/appWindow";
import { IPCResponse } from "@common/utils/externalapis/RunApi";

declare global {
    interface Window {
        ipcRenderer: SeraphIpcRenderer<IpcChannelMap>;
        config: {
            set(key: RUNElectronStoreTyped | string, data: string | number | object | boolean);
            get(key: RUNElectronStoreTyped | string);
        };
        tags: {
            set(key: RUNElectronStoreTagsTyped | string, data: string | number | object | boolean);
            get(key: RUNElectronStoreTagsTyped | string);
        };
    }

    interface SeraphIpcRenderer<ChannelMap> extends NodeJS.EventEmitter {
        invoke(channel: keyof ChannelMap, ...args: ChannelMap[typeof channel][]): Promise<never>;

        invoke<T>(channel: keyof ChannelMap, ...args: ChannelMap[typeof channel][]): Promise<IPCResponse<T>>;

        on(channel: IPCValidOnChannels | string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;

        once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;

        postMessage(channel: string, message: any, transfer?: MessagePort[]): void;

        removeAllListeners(channel: string): this;

        removeListener(channel: string, listener: (...args: any[]) => void): this;

        send(channel: IPCValidSendChannels | string, ...args: string[] | unknown[]): void;

        sendSync(channel: string, ...args: any[]): any;

        sendTo(webContentsId: number, channel: string, ...args: any[]): void;

        sendToHost(channel: string, ...args: any[]): void;
    }
}
