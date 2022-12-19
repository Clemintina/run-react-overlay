// eslint-disable-next-line import/named
import { ColumnState } from "ag-grid-community";
import { Player } from "./PlayerUtils";

export type PlayerHandler = {
	status: number;
	cause: string;
	data?: Player;
};

export type DisplayErrorMessage = {
	code?: number;
	title: string;
	cause: string;
	detail?: string;
	referenceId?: string | number;
};

export type ProxyStore = {
	enableProxies: boolean;
	hasAuth: boolean;
	type: ProxyType;
	hostname: string;
	port: string;
	username: string;
	password: string;
};

export enum ProxyType {
	SOCKS5 = "SOCKS5",
	HTTP = "HTTP",
}

export type ConfigStore = {
	hypixel: {
		apiKey: string;
		apiKeyValid: boolean;
		apiKeyOwner: string;
	};
	runKey: string;
	version: string;
	logs: ClientSetting;
	table: TableState;
	colours: ColourSettings;
	keathiz: {
		key: string;
		valid: boolean;
	};
	run: {
		apiKey: string;
		valid: boolean;
	};
	browserWindow: BrowserWindowSettings;
	error: DisplayErrorMessage;
	settings: SettingsConfig;
	menuOptions: Array<MenuOption>;
};

export type SettingsConfig = {
	lunar: boolean;
	keathiz: boolean;
	boomza: boolean;
	updater: boolean;
	astolfo: boolean;
	polsu: {
		enabled: boolean;
		sessions: boolean;
	};
	hypixel: {
		guilds: boolean;
	};
	run: {
		friends: boolean;
	};
	preferences: { autoHide: boolean; customFile: boolean; customUrl: boolean };
	appearance: {
		displayRank: boolean;
	};
};

export type ClientSetting = {
	clientName: string;
	logPath: string;
	readable: boolean;
};

export type HypixelSettings = {
	apiKey: string;
	apiKeyValid: boolean;
	apiKeyOwner: string;
	proxy: boolean;
};

export type ColourSettings = {
	backgroundColour: string;
	primaryColour: string;
	secondaryColour: string;
};

export type BrowserWindowSettings = {
	width: number;
	height: number;
	opacity: number;
};

export type TableState = {
	columnState: Array<ColumnState>;
	settings: {
		textAlign: "left" | "center" | "right";
	};
};

export type MenuOption = {
	menuName: string;
	menuLink: string;
	menuDescription?: string;
};

export type PlayerNickname = {
	uuid: string;
	name: string;
	nick: string;
	added: number;
};

export type FontConfig = {
	family: string;
	availableFonts: Array<string>;
	isGoogleFont: boolean;
};

export type KeyboardFocusType = "none" | "open_overlay" | "clear_players";

export type KeybindInterface = {
	focus: KeyboardFocusType;
	keybind: string;
	enabled?: boolean;
};

export type AppInformation = {
	version: string;
	update: {
		release: string;
		updateAvailable: boolean;
		ready: boolean;
		releaseDate: number;
	};
};

export type CustomLinkFile = {
	path: string;
	readable: boolean;
	data: Array<string> | Array<CustomFileJsonType> | null;
};

export type CustomLinkURL = {
	url: string;
};

export type CustomLinkSchema = { data: CustomFileJsonType };

export type CustomFileIpc = {
	fileType: "text" | "json";
	contents: Array<string> | Array<CustomFileJsonType> | string;
};

export type CustomFileJsonType = { uuid: string; blacklisted: boolean; tags: Array<{ tag: string; hex: string; singularTag?: boolean }> };

export type GameType = {
	last_server: string;
};
