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
    code: number;
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
    astolfo: boolean;
    hypixel: {
        guilds: boolean;
    };
    run: {
        friends: boolean;
    };
    preferences: { autoHide: boolean };
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
