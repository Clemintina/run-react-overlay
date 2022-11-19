export type TagSchema = {
    run: Run;
    core: Core;
    hypixel: Hypixel;
    boomza: Boomza;
    keathiz: Keathiz;
};

export type TagStoreSchema = {
    setTagStore: (newTagStore: TagSchema) => void;
    setStore: (produce) => void;
} & TagSchema;

export interface Colour {
    requirement: number;
    operator: string;
    colour: string;
}

export interface TagColour {
    display: string;
    colour: string | Colour[];
}

export interface TagArray {
    display?: string;
    colours: Colour[];
}

export interface Core {
    fkdr: TagArray;
    bblr: TagArray;
    wlr: TagArray;
    winstreak: TagArray;
    kdr: TagArray;
}

export interface Run {
    annoylist: TagColour;
    friends: TagColour;
    blacklist: TagColour;
    migration: TagColour;
    encounters: TagColour;
    safelist: TagColour;
    personal_safelist: TagColour;
    name_change: TagColour;
    bot: TagColour;
}

export interface Boomza {
    sniper: TagColour;
    cheater: TagColour;
}

export interface Hypixel {
    party: TagColour;
}

export interface Keathiz {
    no_data: TagColour;
    exits: {
        exits_total: TagColour;
    };
    one_minute_requeue: TagColour,
    consecutive: TagColour,
    queues: {
        queue_count: TagArray;
        queue_total: TagColour;
        consecutive_queue: {
            last_1000: TagArray;
            last_30: TagArray;
            last_10: TagArray;
            weighted: TagArray;
        };
    };
}
