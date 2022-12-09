export type Arenabrawl = {
    wins: number | 0;
    losses: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Bedwars = {
    level: number | 0;
    experience: number | 0;
    wins: number | 0;
    losses: number | 0;
    final_kills: number | 0;
    final_deaths: number | 0;
    beds_broken: number | 0;
    beds_lost: number | 0;
    kills: number | 0;
    deaths: number | 0;
    "4v4": {
        wins: number | 0;
    };
};

export type Blitzsurvivalgames = {
    wins: number | 0;
    kills: number | 0;
    deaths: number | 0;
    time_played: number | 0;
};

export type Buildbattle = {
    score: number | 0;
    wins: number | 0;
    losses: number | 0;
    votes: number | 0;
};

export type Copsandcrims = {
    wins: number | 0;
    kills: number | 0;
    deaths: number | 0;
    round_wins: number | 0;
    shots_fired: number | 0;
    headshot_kills: number | 0;
    bombs_defused: number | 0;
    bombs_planted: number | 0;
    criminal_kills: number | 0;
    cop_kills: number | 0;
};

export type Duels = {
    wins: number | 0;
    losses: number | 0;
    kills: number | 0;
    deaths: number | 0;
    blocks_placed: number | 0;
    goals: number | 0;
};

export type Megawalls = {
    wins: number | 0;
    losses: number | 0;
    kills: number | 0;
    assists: number | 0;
    deaths: number | 0;
    final_kills: number | 0;
    final_assists: number | 0;
    final_deaths: number | 0;
    wither_damage: number | 0;
    defender_kills: number | 0;
};

export type Murdermystery = {
    wins: number | 0;
    losses: number | 0;
    murderer_wins: number | 0;
    detective_wins: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Paintball = {
    wins: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Quakecraft = {
    wins: number | 0;
    kills: number | 0;
    deaths: number | 0;
    distance_travelled: number | 0;
};

export type Skywars = {
    experience: number | 0;
    souls: number | 0;
    time_played: number | 0;
    wins: number | 0;
    losses: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Smashheroes = {
    wins: number | 0;
    losses: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Speeduhc = {
    wins: number | 0;
    losses: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Tntgames = {
    wins: number | 0;
};

export type Trophies = {
    gold: number | 0;
    silver: number | 0;
    bronze: number | 0;
};

export type Turbokartracers = {
    wins: number | 0;
    laps_completed: number | 0;
    boxes_picked_up: number | 0;
    coins_picked_up: number | 0;
    trophies: Trophies;
};

export type Uhc = {
    wins: number | 0;
    score: number | 0;
    heads_eaten: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Human = {
    wins: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Vampire = {
    wins: number | 0;
    kills: number | 0;
    deaths: number | 0;
};

export type Vampirez = {
    zombie_kills: number | 0;
    human: Human;
    vampire: Vampire;
};

export type Walls = {
    wins: number | 0;
    losses: number | 0;
    kills: number | 0;
    assists: number | 0;
    deaths: number | 0;
};

export type Warlords = {
    wins: number | 0;
    losses: number | 0;
    kills: number | 0;
    assists: number | 0;
    deaths: number | 0;
    damage_dealt: number | 0;
    damage_taken: number | 0;
    damage_prevented: number | 0;
    healed: number | 0;
};

export type ObserverApi = {
    success: boolean;
    daily: {
        timestamp: number | 0;
        wins: number | 0;
        coins: number | 0;
        karma: number | 0;
        achievementPoints: number | 0;
        experience: number | 0;
        quests: number | 0;
        challenges: number | 0;
        stats: {
            arenabrawl: Arenabrawl;
            bedwars: Bedwars;
            blitzsurvivalgames: Blitzsurvivalgames;
            buildbattle: Buildbattle;
            copsandcrims: Copsandcrims;
            duels: Duels;
            megawalls: Megawalls;
            murdermystery: Murdermystery;
            paintball: Paintball;
            quakecraft: Quakecraft;
            skywars: Skywars;
            smashheroes: Smashheroes;
            speeduhc: Speeduhc;
            tntgames: Tntgames;
            turbokartracers: Turbokartracers;
            uhc: Uhc;
            vampirez: Vampirez;
            walls: Walls;
            warlords: Warlords;
        };
        reset: number | 0;
    };
};
