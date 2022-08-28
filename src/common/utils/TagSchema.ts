export interface TagSchema {
    run: Run;
    core: Core;
    hypixel: Hypixel;
    boomza: Boomza;
}

export interface TagStoreSchema extends TagSchema {
    setTagStore: (newTagStore: TagSchema) => void;
    setStore: (produce) => void
}

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
    hacker: TagColour;
}

export interface Hypixel {
    party: TagColour;
}
