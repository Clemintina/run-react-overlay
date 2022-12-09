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

export type Colour = {
    requirement: number;
    operator: string;
    colour: string;
};

export type TagColour = {
    display: string;
    colour: string | Colour[];
};

export type TagArray = {
    display?: string;
    colours: Colour[];
};

export type Core = {
    fkdr: TagArray;
    bblr: TagArray;
    wlr: TagArray;
    winstreak: TagArray;
    kdr: TagArray;
};

export type Run = {
    annoylist: TagColour;
    friends: TagColour;
    blacklist: TagColour;
    migration: TagColour;
    encounters: TagColour;
    safelist: TagColour;
    personal_safelist: TagColour;
    name_change: TagColour;
    bot: TagColour;
};

export type Boomza = {
    sniper: TagColour;
    cheater: TagColour;
};

export type Hypixel = {
    party: TagColour;
};

export type Keathiz = {
    no_data: TagColour;
    exits: {
        exits_total: TagColour;
    };
    one_minute_requeue: TagColour;
    consecutive: TagColour;
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
};
