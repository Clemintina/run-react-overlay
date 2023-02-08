import useConfigStore from "@renderer/store/ConfigStore";
import { KeyboardFocusType } from "@common/utils/Schemas";
import usePlayerStore from "@renderer/store/PlayerStore";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";

export class KeybindHandlerUtils {
	public startHandlingApp = async () => {
		await window.ipcRenderer.on("globalShortcutPressed", async (event, shortcut) => {
			const shortcutObject = useConfigStore.getState().keybinds;
			const focusType: KeyboardFocusType = shortcutObject.filter((key) => key.keybind == shortcut)[0]?.focus ?? "none";
			switch (focusType) {
				case "open_overlay":
					window.ipcRenderer.send("windowToggle");
					break;
				case "clear_players":
					usePlayerStore.getState().clearPlayers();
					break;
				case "none":
				default:
					break;
			}
		});
	};
}
