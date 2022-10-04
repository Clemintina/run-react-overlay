export interface Blacklist {
    success: boolean;
    code: number;
    data: {
        uuid: string;
        username: string;
        blacklist: {
            tagged: boolean;
            timestamp: number;
            reason: string;
            report_type: string;
        };
        safelist: {
            tagged: boolean;
            timesKilled: number;
            personal: boolean;
            security_level: number;
        };
        customTag: string | null;
        bot: {tagged: boolean; unidentified: boolean; kay: boolean};
        statistics: {encounters: number; threat_level: number};
        migrated: {tagged: boolean};
        annoylist: {tagged: boolean};
    };
    msTime: number;
}

export interface RunApiKey {
    success: boolean;
    code: number;
    key: {
        key: string;
        valid: boolean;
        code: number;
        isDev: boolean;
    };
    msTime: number;
}

export interface PlayerAPI {
    success: boolean;
    code: number;
    player: {
        uuid: string;
        username: string;
        timeUpdated: number;
    };
    msTime: number;
}

export interface RunFriendList {
    uuids: Array<string>;
    mutuals: Array<string>;
}

export interface DenickerAPI {
    success: boolean,
    code: number,
    data: {
        found: boolean,
        nick: string,
        username: string,
        uuid: string,
        invalid?: boolean
    },
    msTime: number,
}

export enum RunEndpoints {
    BLACKLIST = "blacklist",
    VERSION = "overlay",
    KEY = "key",
    SAFELIST = "safelist",
    KEATHIZ_PROXY = "keathiz/proxy",
    DENICKER = "dev/denick",
}

export enum RequestType {
    KEY = "key",
    UUID = "player.uuid",
    FRIENDS = "player.friends",
    USERNAME = "player.username",
    RECENT_GAMES = "player.games",
    GUILD_PLAYER = "guild.player",
}

export interface LunarCosmetic {
    id: number;
    name: string;
    url: string;
}

export interface LunarAPIResponse {
    success: boolean;
    code: number;
    player: {
        uuid: string;
        online: boolean;
        status: string;
        cosmetics: {count: number; activeCosmetics: LunarCosmetic[]; cachedCosmetics: LunarCosmetic[]};
        lunarPlus: {
            premium: boolean;
            clothCloak: boolean;
            plusColour: number;
        };
        rank: {
            unknownBooleanB: boolean;
            unknownBooleanC: boolean;
        };
        unknown: {
            unknownBooleanA: boolean;
            unknownBooleanB: boolean;
            unknownBooleanC: boolean;
        };
    };
    msTime: number;
}

export interface IPCResponse<T> {
    status: number;
    cause?: string;
    data: T;
}
