import "@misc/window/windowPreload";
import { contextBridge, ipcRenderer } from "electron";
import { RUNElectronStoreTyped } from "@main/appWindow";
import { IpcValidInvokeChannels, IPCValidInvokeChannels, IPCValidOnChannels, IPCValidSendChannels } from "@common/utils/IPCHandler";
import { AppInformation } from "@common/utils/Schemas";
import useConfigStore from "@renderer/store/ConfigStore";

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
	invoke: (channel: IPCValidInvokeChannels, ...args: string[]) => {
		return ipcRenderer.invoke(channel, ...args);
	},
	/**
	 * Register **listening** data so the **appWindow** file can be used to send it
	 * @see @main/appWindow
	 * @param channel
	 * @param method
	 */
	on: (channel: IPCValidOnChannels, method) => {
		return ipcRenderer.on(channel, method);
	},
	/**
	 * Register **sending** data so the **appWindow** file can be used to receive it
	 * @see @main/appWindow
	 * @param channel
	 * @param data
	 */
	send: (channel: IPCValidSendChannels, data: string) => {
		ipcRenderer.send(channel, data);
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
	set: (key: RUNElectronStoreTyped | string, data: object | string | number) => {
		return ipcRenderer.send("configSet", { key, data });
	},
	/**
	 * Get data from the **config.json** file.
	 * Register the schema in the **ElectronStoreUtil** file
	 * @see @renderer/store/ElectronStoreUtils
	 * @param key
	 */
	get: (key: RUNElectronStoreTyped | string) => {
		return ipcRenderer.invoke("configGet", { key });
	},
});

/**
 * Prints when the DOM has loaded
 * @see (https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event)
 */
window.addEventListener("DOMContentLoaded", () => {
	console.log("Loaded DOM")
});

window?.ipcRenderer?.on("updater", async ( _, args) => {
	console.log(args);
	const appUpdater = JSON.parse(args).data as AppInformation;
	if (appUpdater.update.ready) {
		useConfigStore.getState().setErrorMessage({
			title: "Overlay Update",
			cause: "The overlay is ready to update, Restarting in 5 seconds",
			type: "SUCCESS",
		});
	} else if (appUpdater.update.updateAvailable) {
		useConfigStore.getState().setErrorMessage({
			title: "Overlay Update",
			cause: "An update is currently being downloaded!",
			type: "SUCCESS",
		});
	}
});

window?.ipcRenderer?.on("ready", async () => {
	if (window?.ipcRenderer) {
		useConfigStore.getState().setVersion();
		const logs = useConfigStore.getState().logs;
		if (logs.readable) {
			window.ipcRenderer.send("logFileSet", useConfigStore.getState().logs.logPath);
		}

		const keybinds = useConfigStore.getState().keybinds;
		await window.ipcRenderer.invoke(IpcValidInvokeChannels.GLOBAL_KEYBINDS, keybinds);
	}
});
