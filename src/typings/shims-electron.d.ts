import {IpcMainInvokeEvent} from "electron";
import {IPCValidInvokeChannels} from "@common/utils/IPCHandler";

interface SeraphIpcMain extends NodeJS.EventEmitter {
    handle(channel: IPCValidInvokeChannels, listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any): void;
}

declare global {
    namespace Electron {
        interface IpcMain extends SeraphIpcMain {
            handle(channel: IPCValidInvokeChannels, listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any): void;
        }
    }
}
