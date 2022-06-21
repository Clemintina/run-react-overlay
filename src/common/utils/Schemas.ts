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
