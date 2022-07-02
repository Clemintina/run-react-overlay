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
    detail: string;
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
}

export interface TagObject {
    display: string;
    colour: Array<TagArray> | string;
}
