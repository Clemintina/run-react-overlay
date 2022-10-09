import * as electron from "electron";

export type StrictIpcMain<ChannelMap extends StrictChannelMap> = StrictIpcModule<ChannelMap, electron.IpcMain>;

type StrictIpcModule<ChannelMap extends StrictChannelMap, LooseModule extends NodeJS.EventEmitter> =
    Omit<LooseModule, "on" | "once" | "removeAllListeners" | "removeListener">
    & {
    on: ListenerRegistrarSignatures<ChannelMap>;
    once: ListenerRegistrarSignatures<ChannelMap>;
    removeAllListeners: RemoveAllListenersSignatures<ChannelMap>;
    removeListener: ListenerRegistrarSignatures<ChannelMap>;
};
