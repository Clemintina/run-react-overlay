// eslint-disable-next-line import/named
import {ColumnState} from "ag-grid-community";
import {Player} from "./PlayerUtils";

export interface PlayerHandler {
    status: number;
    cause: string;
    data?: Player;
}

export interface HypixelApiKey {
    key: string;
    owner: string;
    limit: number;
    queriesInPastMin: number;
    totalQueries: number;
}

export interface DisplayErrorMessage {
    code?: number;
    title: string;
    cause: string;
    detail?: string;
    referenceId?: string | number;
}

export interface ProxyStore {
    enableProxies: boolean;
    hasAuth: boolean;
    type: ProxyType;
    hostname: string;
    port: string;
    username: string;
    password: string;
}

export enum ProxyType {
    SOCKS5 = "SOCKS5",
    HTTP = "HTTP",
}

export interface TagArray {
    requirement: number;
    colour: string;
    operator?: string;
}

export interface TagObject {
    display: string;
    colour: Array<TagArray> | string;
}

export interface TagModifier {
    display: string;
    changedObjectId: number;
}

export interface MetricsObject {
    colours: Array<MetricsArray>;
}

export interface MetricsArray {
    requirement: number;
    colour: string;
    operator: string;
}

export interface ConfigStore {
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
}

export interface SettingsConfig {
    lunar: boolean;
    keathiz: boolean;
    boomza: boolean;
    updater: boolean;
    astolfo: boolean;
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
}

export interface ClientSetting {
    clientName: string;
    logPath: string;
    readable: boolean;
}

export interface ColourSettings {
    backgroundColour: string;
    primaryColour: string;
    secondaryColour: string;
}

export interface BrowserWindowSettings {
    width: number;
    height: number;
    opacity: number;
}

export interface TableState {
    columnState: Array<ColumnState>;
    settings: {
        textAlign: "left" | "center" | "right";
    };
}

export interface ValidateRun {
    runApiKey: string;
    state: ConfigStore;
}

export interface MenuOption {
    menuName: string;
    menuLink: string;
    menuDescription?: string;
}

export interface PlayerNickname {
    uuid: string;
    name: string;
    nick: string;
    added: number;
}

export interface FontConfig {
    family: string;
    availableFonts: Array<string>;
}

export type KeyboardFocusType = "none" | "open_overlay" | "clear_players";

export interface KeybindInterface {
    focus: KeyboardFocusType;
    keybind: string;
    enabled?: boolean;
}

export interface AppInformation {
    version: string;
    update: {
        release: string;
        updateAvailable: boolean;
        ready: boolean;
        releaseDate: number;
    };
}

export interface CustomLinkFile {
    path: string;
    readable: boolean;
    data: Array<string> | Array<CustomFileJsonType> | null;
}

export interface CustomFileIpc {
    fileType: "text" | "json";
    contents: Array<string> | Array<CustomFileJsonType> | string;
}

export type CustomFileJsonType = { uuid: string; blacklisted: boolean; tags: Array<{ tag: string; hex: string; singularTag?: boolean }> };
