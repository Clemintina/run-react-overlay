import {Player} from "./PlayerUtils";

export interface PlayerHandler {
    status: number;
    cause: string;
    data?: Player;
}

export interface HypixelApiKeyRaw {
    success: boolean,
    record: HypixelApiKey
}

export interface HypixelApiKey {
    key: string,
    owner: string,
    limit: number,
    queriesInPastMin: number,
    totalQueries: number
}