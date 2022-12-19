// eslint-disable-next-line import/named
import { ColumnState } from "ag-grid-community";
import create from "zustand";
import { AppInformation, BrowserWindowSettings, ClientSetting, ColourSettings, CustomLinkFile, CustomLinkURL, DisplayErrorMessage, FontConfig, GameType, HypixelSettings, KeybindInterface, KeyboardFocusType, PlayerNickname, SettingsConfig, TableState } from "@common/utils/Schemas";
import { RequestType, RunApiKey, RunEndpoints } from "@common/utils/externalapis/RunApi";
import { awaitTimeout } from "@common/helpers";
import { KeathizEndpoints, KeathizOverlayRun } from "@common/utils/externalapis/BoomzaApi";
import { devtools, persist } from "zustand/middleware";
import usePlayerStore from "@renderer/store/PlayerStore";
import axios from "axios";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";
import { ResultObject } from "@common/zikeji/util/ResultObject";
import { Paths } from "@common/zikeji";
import { ApiKey } from "@clemintina/seraph-library/lib/PolsuTypes";

export type ConfigStore = {
	hypixel: HypixelSettings;
	setHypixelState: (hypixel: HypixelSettings) => void;
	setHypixelApiKey: (arg0: string) => void;
	colours: ColourSettings;
	setColours: (colour: ColourSettings) => void;
	version: string;
	setVersion: () => void;
	logs: ClientSetting;
	setLogs: (clientSetting: ClientSetting) => void;
	error: DisplayErrorMessage;
	setErrorMessage: (error: DisplayErrorMessage) => void;
	keathiz: {
		key: string;
		valid: boolean;
		showNick: boolean;
	};
	setKeathizData: (data: { key: string; valid: boolean; showNick: boolean }) => void;
	setKeathizApiKey: (keathizkey: string) => void;
	run: {
		apiKey: string;
		valid: boolean;
	};
	validateRunKey: () => void;
	setRunApiKey: (runkey: string, source?: "USER_INPUT" | "SYSTEM") => void;
	polsu: {
		apiKey: string;
		valid: boolean;
	};
	setPolsuApiKey: (apiKey: string, source?: "USER_INPUT" | "SYSTEM") => void;
	browserWindow: BrowserWindowSettings;
	setBrowserWindow: (browserWindow: BrowserWindowSettings) => void;
	table: TableState;
	setTableState: (tableState: TableState) => void;
	settings: SettingsConfig;
	setSettings: (settingsSettings: SettingsConfig) => void;
	setStore: (store: ConfigStore) => void;
	font: FontConfig;
	keybinds: Array<KeybindInterface>;
	addKeybind: (focus: KeyboardFocusType, keybind: string) => void;
	removeKeybind: (focus: KeyboardFocusType) => void;
	getKeybind: (focus: KeyboardFocusType) => KeybindInterface;
	setFont: (font: FontConfig) => void;
	nicks: Array<PlayerNickname>;
	setNicks: (nicks: Array<PlayerNickname>) => void;
	customFile: CustomLinkFile;
	setCustomFile: (customFile: CustomLinkFile) => void;
	customApi: CustomLinkURL;
	setCustomApi: (customFile: CustomLinkURL) => void;
	game: GameType;
	setGame: (game: GameType) => void;
};

const useConfigStore = create<ConfigStore>()(
	devtools(
		persist(
			(set, get) => ({
				hypixel: {
					apiKey: "",
					apiKeyValid: false,
					apiKeyOwner: "",
					proxy: false,
				},
				setHypixelState: (hypixel) => {
					set({ hypixel });
				},
				setHypixelApiKey: async (hypixelApiKey) => {
					if (hypixelApiKey.length === 0 || (get().hypixel.apiKey.toLowerCase() == hypixelApiKey.toLowerCase() && get().hypixel.apiKeyValid)) {
						const oldHypixel = get().hypixel;
						if (oldHypixel.apiKeyValid) return;
						set(() => ({
							hypixel: {
								...oldHypixel,
								apiKeyValid: false,
							},
						}));
						return;
					}
					const apiResponse = await window.ipcRenderer.invoke<ResultObject<Paths.Key.Get.Responses.$200, ["record"]>>(IpcValidInvokeChannels.HYPIXEL, [RequestType.KEY, hypixelApiKey]);
					if (apiResponse?.status === 200 && apiResponse?.data?.key !== undefined) {
						get().setErrorMessage({
							title: "Hypixel Key Set",
							cause: "Successfully set your Hypixel API key!",
							code: 200,
						});
						set(() => ({
							hypixel: {
								apiKey: hypixelApiKey,
								apiKeyValid: true,
								apiKeyOwner: apiResponse.data.owner,
								proxy: get().hypixel.proxy,
							},
						}));
					} else {
						get().setErrorMessage({
							title: "Invalid Hypixel Key",
							cause: "The Hypixel API key provided is not valid! Generate one with /api new.",
							code: 400,
						});
						set(() => ({
							hypixel: {
								apiKey: get().hypixel.apiKey,
								apiKeyValid: false,
								apiKeyOwner: apiResponse.data.owner,
								proxy: get().hypixel.proxy,
							},
						}));
					}
				},
				colours: {
					backgroundColour: "#242424",
					primaryColour: "#808080",
					secondaryColour: "#00FFFF",
				},
				setColours: (colourObject) => {
					set(() => ({
						colours: colourObject,
					}));
				},
				version: "",
				setVersion: async () => {
					const appInfo = await window.ipcRenderer.invoke<AppInformation>(IpcValidInvokeChannels.GET_APP_INFO);
					const version = appInfo.data.version;
					set(() => ({ version }));
					const googleFontArray = await axios.get("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw");
					if (googleFontArray.status == 200) {
						const fontsAvailable: Array<string> = [];
						googleFontArray.data.items.forEach((item) => {
							fontsAvailable.push(item.family);
						});
						set({
							font: {
								...get().font,
								availableFonts: fontsAvailable,
							},
						});
					}
				},
				logs: {
					logPath: "",
					readable: false,
					clientName: "Unknown",
				},
				setLogs: async (client) => {
					await window.config.set("overlay.logPath", client.logPath);
					await window.config.set("overlay.clientName", client.clientName);
					await window.config.set("overlay.readable", client.readable);
					set({
						logs: client,
					});
				},
				error: {
					code: 201,
					title: "",
					cause: "",
					detail: "",
				},
				setErrorMessage: async (structuredError) => {
					set({
						error: {
							...structuredError,
							code: structuredError?.code ?? 200,
						},
					});
					await awaitTimeout(5 * 1000);
					set({
						error: {
							code: 201,
							title: "",
							cause: "",
							detail: "",
						},
					});
				},
				keathiz: {
					key: "",
					valid: false,
					showNick: true,
				},
				setKeathizData: (keathizstore) => {
					set({
						keathiz: keathizstore,
					});
				},
				setKeathizApiKey: async (keathizApiKey) => {
					const apiKey = await window.ipcRenderer.invoke<KeathizOverlayRun>(IpcValidInvokeChannels.KEATHIZ, [KeathizEndpoints.OVERLAY_RUN, "308d0104f67b4bfb841058be9cadadb5", keathizApiKey]);
					if (keathizApiKey.length == 0) return;
					if (apiKey.status == 200) {
						set({
							keathiz: {
								key: keathizApiKey,
								valid: true,
								showNick: useConfigStore.getState().keathiz.showNick,
							},
						});
						for (const player of usePlayerStore.getState().players) {
							if ( !player.nicked && player.hypixelPlayer?.uuid ) {
								const keathiz = await window.ipcRenderer.invoke<KeathizOverlayRun>(IpcValidInvokeChannels.KEATHIZ, [KeathizEndpoints.OVERLAY_RUN, player.hypixelPlayer.uuid, keathizApiKey]);
								if (keathiz.status == 200) {
									player.sources.keathiz = keathiz;
								}
							}
						}
					} else {
						get().setErrorMessage({
							title: "Invalid Antisniper Key",
							cause: "The Antisniper API key provided is not valid!",
							code: 400,
						});
					}
				},
				run: {
					apiKey: "public",
					valid: true,
				},
				validateRunKey: async () => {
					get().setRunApiKey(get().run.apiKey, "SYSTEM");
				},
				setRunApiKey: async (runkey, source) => {
					if (runkey.length == 0 || (get()?.run?.apiKey.toLowerCase() == runkey && source != "SYSTEM")) return;
					const getHypixel = get().hypixel;
					const apiKey = await window.ipcRenderer.invoke<RunApiKey>(IpcValidInvokeChannels.SERAPH, [RunEndpoints.KEY, "a", getHypixel.apiKey, getHypixel.apiKeyOwner, runkey, getHypixel.apiKeyOwner]);
					if (apiKey.status == 200) {
						get().setErrorMessage({
							title: "Seraph Key Set",
							cause: "Successfully set your Seraph API key!",
							code: 200,
						});
						set({
							run: {
								apiKey: runkey,
								valid: true,
							},
						});
					} else {
						get().setErrorMessage({
							title: "Invalid Seraph Key",
							cause: "The Seraph API key provided is invalid or locked!",
							code: 400,
						});
						await window.ipcRenderer.invoke(IpcValidInvokeChannels.NOTIFICATIONS, ["Your Seraph Key has been locked!"]);
					}
				},
				polsu: {
					apiKey: "",
					valid: false,
				},
				setPolsuApiKey: async (apiKey, source) => {
					if (source && source == "USER_INPUT") {
						if (get().polsu.apiKey?.toLowerCase() == apiKey.toLowerCase()) {
							return;
						}
					}
					if (apiKey == "") return;
					const response = await window.ipcRenderer.invoke<ApiKey>(IpcValidInvokeChannels.POLSU, ["apikey", apiKey]);
					set({
						polsu: {
							apiKey,
							valid: response.status == 200,
						},
					});
				},
				browserWindow: {
					width: 600,
					height: 800,
					opacity: 100,
				},
				setBrowserWindow: (browserWindow) => {
					set({ browserWindow });
				},
				table: {
					columnState: Array<ColumnState>(
						{
							colId: "id",
							width: 200,
							hide: true,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: null,
						},
						{
							colId: "head",
							width: 30,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "star",
							width: 60,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "name",
							width: 200,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "tags",
							width: 130,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "WS",
							width: 60,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "FKDR",
							width: 60,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "WLR",
							width: 60,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "BBLR",
							width: 60,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "wins",
							width: 60,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "losses",
							width: 60,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "session",
							width: 60,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
						{
							colId: "extra",
							width: 30,
							hide: false,
							pinned: null,
							sort: null,
							sortIndex: null,
							aggFunc: null,
							rowGroup: false,
							rowGroupIndex: null,
							pivot: false,
							pivotIndex: null,
							flex: 1,
						},
					),
					settings: {
						textAlign: "center",
					},
				},
				setTableState: async (table) => {
					await window.config.set("overlay.table.columnState", table);
					set({ table });
				},
				settings: {
					lunar: true,
					keathiz: false,
					updater: true,
					astolfo: false,
					boomza: true,
					polsu: {
						enabled: false,
						sessions: false,
					},
					hypixel: {
						guilds: false,
					},
					run: {
						friends: false,
					},
					preferences: {
						autoHide: true,
						customFile: false,
						customUrl: false,
					},
					appearance: {
						displayRank: true,
					},
				},
				setSettings: async (settings) => {
					set({ settings });
					usePlayerStore.getState().updatePlayers();
				},
				customFile: {
					path: "",
					readable: false,
					data: null,
				},
				setCustomFile: (customFile) => {
					set({
						customFile,
					});
				},
				customApi: {
					url: "",
				},
				setCustomApi: (customApi) => {
					set({
						customApi,
					});
				},
				keybinds: [],
				addKeybind: async (focus, keybind) => {
					if (get().keybinds.filter((arr) => arr.focus == focus).length == 0) {
						get().keybinds.push({ keybind, focus });
					} else {
						get().removeKeybind(focus);
						get().keybinds.push({ keybind, focus });
					}
				},
				removeKeybind: (focus: KeyboardFocusType) => {
					set({
						keybinds: get().keybinds.filter((arr) => arr.focus !== focus),
					});
				},
				getKeybind: (focus: KeyboardFocusType) => {
					return get().keybinds.filter((arr) => arr.focus == focus)[0];
				},
				font: {
					family: "Nunito",
					availableFonts: [],
					isGoogleFont: true,
				},
				setFont: async (font) => {
					set({ font });
				},
				nicks: Array<PlayerNickname>(),
				setNicks: (nicks) => {
					set({ nicks });
				},
				setStore: (store) => set(store),
				appInformation: {
					version: "",
					update: {
						release: "",
						updateAvailable: false,
						ready: false,
						releaseDate: new Date(),
					},
				},
				game: {
					last_server: "",
				},
				setGame: (game) => {
					set({ game });
				},
			}),
			{
				name: "user_settings",
				version: 10,
				migrate: (persistedState: any, version) => {
					const updatedState = persistedState as ConfigStore;
					if (version == 4) {
						updatedState.settings.hypixel.guilds = false;
						updatedState.settings.run.friends = false;
						updatedState.settings.updater = true;
						updatedState.font.family = "Nunito";
						updatedState.error.code = 201;
					} else if (version == 5) {
						updatedState.keybinds = [];
						updatedState.settings.appearance.displayRank = true;
						updatedState.table.settings.textAlign = "left";
					} else if (version == 7) {
						updatedState.settings.preferences.customFile = false;
						updatedState.settings.preferences.customUrl = false;
						updatedState.customFile.path = "";
						updatedState.customFile.readable = false;
						updatedState.game.last_server = "";
					} else if (version == 8) {
						updatedState.customApi.url = "";
						updatedState.font.isGoogleFont = true;
					} else if (version == 9) {
						updatedState.hypixel.proxy = false;
						updatedState.polsu.apiKey = "";
						updatedState.polsu.valid = false;
						updatedState.settings.polsu.sessions = false;
						updatedState.settings.polsu.enabled = false;
					}
					return updatedState;
				},
			},
		),
	),
);

export default useConfigStore;
