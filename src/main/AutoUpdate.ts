import { autoUpdater } from "electron";
import AutoUpdater = Electron.AutoUpdater;

export default class AppUpdater {
	private readonly appUpdater;
	private readonly constants = {
		url: "https://dl.seraph.si/overlay/stable/",
	};

	constructor() {
		this.appUpdater = autoUpdater;
		this.appUpdater.setFeedURL({
			url: this.constants.url,
		});
	}

	getAutoUpdater(): AutoUpdater {
		return this.appUpdater;
	}
}
