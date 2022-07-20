import {Static, Type} from "@sinclair/typebox";

export const RUNElectronStore = Type.Optional(
    Type.Object({
        run: Type.Optional(
            Type.Object({
                overlay: Type.Object({
                    version: Type.String({
                        description: "Overlay Version",
                        default: "Unknown",
                    }),
                    browserWindow: Type.Optional(
                        Type.Object({
                            width: Type.Number({default: 600}),
                            height: Type.Number({default: 800}),
                        }),
                    ),
                }),
                apiKey: Type.String({
                    description: "RUN API Key",
                    default: "public",
                }),
            }),
        ),
        hypixel: Type.Optional(
            Type.Object({
                apiKey: Type.String({
                    description: "Hypixel API Key",
                    default: "",
                }),
                apiKeyOwner: Type.String({
                    description: "Hypixel API Key Owner",
                    default: "",
                }),
            }),
        ),
        overlay: Type.Optional(
            Type.Object({
                logPath: Type.String({
                    description: "The Logs path which the overlay uses to read players",
                    default: "",
                }),
                first_launch: Type.Boolean({default: true}),
                table: Type.Optional(
                    Type.Object({
                        columns: Type.Optional(Type.Array(Type.Any())),
                    }),
                ),
            }),
        ),
        external: Type.Optional(
            Type.Object({
                proxy: Type.Optional(
                    Type.Object({
                        enableProxies: Type.Boolean({
                            default: true,
                        }),
                        hasAuth: Type.Boolean({
                            default: true,
                        }),
                        type: Type.String({
                            default: "HTTP",
                        }),
                        hostname: Type.String({
                            default: "",
                        }),
                        port: Type.String({default: ""}),
                        username: Type.String({
                            default: "",
                        }),
                        password: Type.String({
                            default: "",
                        }),
                    }),
                ),
                keathiz: Type.Optional(
                    Type.Object({
                        apiKey: Type.String({
                            default: "",
                            description: "Keathiz Api Key for https://api.antisniper.net",
                        }),
                        valid: Type.Boolean({default: false}),
                    }),
                ),
            }),
        ),
        settings: Type.Optional(
            Type.Object({
                lunar: Type.Boolean({
                    description: "Enable Lunar Tags",
                    default: true,
                }),
                boomza: Type.Boolean({
                    description: "Enable Boomza API",
                    default: true,
                }),
                keathiz: Type.Boolean({
                    description: "Enable Keathiz API",
                    default: false,
                }),
            }),
        ),
    }),
);

export const getDefaultElectronStore: RUNElectronStoreType = {
    overlay: {
        logPath: "",
        first_launch: true,
    },
    settings: {
        lunar: true,
        boomza: true,
        keathiz: false,
    },
};

export type RUNElectronStoreType = Static<typeof RUNElectronStore>;

export const RUNElectronStoreTags = Type.Object({
    run: Type.Object({
        annoylist: Type.Object({
            display: Type.String({
                description: "How to display the Annoy List tag",
                default: "A",
            }),
            colour: Type.String({
                description: "The colour for the Annoy List tag",
                default: "red",
            }),
        }),
        blacklist: Type.Object({
            display: Type.String({
                description: "How to display the Blacklist tag",
                default: "BLACKLISTED",
            }),
            colour: Type.String({
                description: "The colour for the Blacklist tag",
                default: "red",
            }),
        }),
        migration: Type.Object({
            display: Type.String({
                description: "How to display the AnnoyList tag",
                default: "M",
            }),
            colour: Type.String({
                description: "The colour for the Migration tag",
                default: "green",
            }),
        }),
        encounters: Type.Object({
            display: Type.String({
                description: "How to display the Encounters tag",
                default: "E",
            }),
            colour: Type.Array(
                Type.Object({
                    requirement: Type.Number({
                        description: "The requirement for the Encounters tag",
                    }),
                    colour: Type.String({
                        description: "The colours for the Encounters tag",
                    }),
                }),
                {
                    description: "Sets the colours for the tags using dynamic values",
                },
            ),
        }),
        safelist: Type.Object({
            display: Type.String({
                description: "How to display the Safelist tag",
                default: "✓",
            }),
            colour: Type.Array(
                Type.Object({
                    requirement: Type.Number({
                        description: "The requirement for the Safelist tag",
                    }),
                    colour: Type.String({
                        description: "The colours for the Safelist tag",
                    }),
                }),
                {
                    description: "Sets the colours for the tags using dynamic values",
                },
            ),
        }),
        personal_safelist: Type.Object({
            display: Type.String({
                description: "How to display the Personal Safelist tag",
                default: "S",
            }),
            colour: Type.String({
                description: "The colour of the Personal Safelist Tag",
                default: "FF5555",
            }),
        }),
        name_change: Type.Object({
            display: Type.String({description: "If the player recently changed their name", default: "NC"}),
            colour: Type.String({description: "The colour of this tag", default: "FF55FF"}),
        }),
    }),
    core: Type.Object({
        fkdr: Type.Object({
            colours: Type.Array(
                Type.Object({
                    requirement: Type.Number({description: "When you'd like this colour to be used."}),
                    colour: Type.String({description: "What colour should this be."}),
                    operator: Type.String({description: "Conditional used for this object"}),
                }),
            ),
        }),
        bblr: Type.Object({
            colours: Type.Array(
                Type.Object({
                    requirement: Type.Number({description: "When you'd like this colour to be used."}),
                    colour: Type.String({description: "What colour should this be."}),
                    operator: Type.String({description: "Conditional used for this object"}),
                }),
            ),
        }),
        wlr: Type.Object({
            colours: Type.Array(
                Type.Object({
                    requirement: Type.Number({description: "When you'd like this colour to be used."}),
                    colour: Type.String({description: "What colour should this be."}),
                    operator: Type.String({description: "Conditional used for this object"}),
                }),
            ),
        }),
        winstreak: Type.Object({
            colours: Type.Array(
                Type.Object({
                    requirement: Type.Number({description: "When you'd like this colour to be used."}),
                    colour: Type.String({description: "What colour should this be."}),
                    operator: Type.String({description: "Conditional used for this object"}),
                }),
            ),
        }),
        kdr: Type.Object({
            colours: Type.Array(
                Type.Object({
                    requirement: Type.Number({description: "When you'd like this colour to be used."}),
                    colour: Type.String({description: "What colour should this be."}),
                    operator: Type.String({description: "Conditional used for this object"}),
                }),
            ),
        }),
    }),
    hypixel: Type.Object({
        party: Type.Object({
            display: Type.String({
                description: "How to display the Party tag",
                default: "P",
            }),
            colour: Type.String({
                description: "The colour for the Party tag",
                default: "5555FF",
            }),
        }),
    }),
});

export type RUNElectronStoreTagsType = Static<typeof RUNElectronStoreTags>;

export const getDefaultElectronStoreObject: RUNElectronStoreTagsType = {
    run: {
        annoylist: {
            display: "A",
            colour: "FF5555",
        },
        blacklist: {
            display: "BLACKLISTED",
            colour: "FF5555",
        },
        migration: {
            display: "M",
            colour: "55FF55",
        },
        encounters: {
            display: "E",
            colour: [
                {
                    requirement: 1,
                    colour: "AA0000",
                },
                {
                    requirement: 2,
                    colour: "FFFF55",
                },
                {
                    requirement: 5,
                    colour: "FF5555",
                },
                {
                    requirement: 10,
                    colour: "AA0000",
                },
            ],
        },
        safelist: {
            display: "✓",
            colour: [
                {
                    requirement: 1,
                    colour: "FF5555",
                },
                {
                    requirement: 10,
                    colour: "FFFF55",
                },
                {
                    requirement: 20,
                    colour: "55FF55",
                },
            ],
        },
        personal_safelist: {
            display: "S",
            colour: "FF5555",
        },
        name_change: {
            display: "NC",
            colour: "FF55FF",
        },
    },
    core: {
        fkdr: {
            colours: [
                {requirement: 1, colour: "AAAAAA", operator: "=="},
                {requirement: 3, colour: "AAAAAA", operator: "<="},
                {requirement: 10, colour: "FFFFFF", operator: "<="},
                {requirement: 20, colour: "FFAA00", operator: "<="},
                {requirement: 30, colour: "00AA00", operator: "<="},
                {requirement: 60, colour: "FF5555", operator: "<="},
                {requirement: 100, colour: "AA0000", operator: "<="},
                {requirement: 500, colour: "FF55FF", operator: "<="},
                {requirement: 700, colour: "AA00AA", operator: "<="},
            ],
        },
        bblr: {
            colours: [
                {requirement: 1, colour: "AAAAAA", operator: "=="},
                {requirement: 2, colour: "AAAAAA", operator: "<="},
                {requirement: 4, colour: "FFFFFF", operator: "<="},
                {requirement: 6, colour: "FFAA00", operator: "<="},
                {requirement: 7, colour: "00AA00", operator: "<="},
                {requirement: 10, colour: "FF5555", operator: "<="},
                {requirement: 15, colour: "AA0000", operator: "<="},
                {requirement: 50, colour: "FF55FF", operator: "<="},
                {requirement: 100, colour: "AA00AA", operator: "<="},
            ],
        },
        wlr: {
            colours: [
                {requirement: 1, colour: "AAAAAA", operator: "=="},
                {requirement: 2, colour: "AAAAAA", operator: "<="},
                {requirement: 4, colour: "FFFFFF", operator: "<="},
                {requirement: 6, colour: "FFAA00", operator: "<="},
                {requirement: 7, colour: "00AA00", operator: "<="},
                {requirement: 10, colour: "FF5555", operator: "<="},
                {requirement: 15, colour: "AA0000", operator: "<="},
                {requirement: 50, colour: "FF55FF", operator: "<="},
                {requirement: 100, colour: "AA00AA", operator: "<="},
            ],
        },
        winstreak: {
            colours: [
                {requirement: 0, colour: "AAAAAA", operator: "=="},
                {requirement: 50, colour: "AAAAAA", operator: "<="},
                {requirement: 200, colour: "FFFFFF", operator: "<="},
                {requirement: 350, colour: "FFAA00", operator: "<="},
                {requirement: 500, colour: "00AA00", operator: "<="},
                {requirement: 650, colour: "FF5555", operator: "<="},
                {requirement: 800, colour: "AA0000", operator: "<="},
                {requirement: 1000, colour: "FF55FF", operator: "<="},
                {requirement: 1500, colour: "AA00AA", operator: "<="},
            ],
        },
        kdr: {
            colours: [
                {requirement: 1, colour: "AAAAAA", operator: "=="},
                {requirement: 2, colour: "AAAAAA", operator: "<="},
                {requirement: 4, colour: "FFFFFF", operator: "<="},
                {requirement: 6, colour: "FFAA00", operator: "<="},
                {requirement: 7, colour: "00AA00", operator: "<="},
                {requirement: 10, colour: "FF5555", operator: "<="},
                {requirement: 15, colour: "AA0000", operator: "<="},
                {requirement: 50, colour: "FF55FF", operator: "<="},
                {requirement: 100, colour: "AA00AA", operator: "<="},
            ],
        },
    },
    hypixel: {
        party: {
            display: "P",
            colour: "darkblue",
        },
    },
};

/**
 * Borrowed from
 * {@link [StackOverflow](https://stackoverflow.com/questions/47057649/typescript-string-dot-notation-of-nested-object)}
 */

export type PathsToStringProps<T> = T extends string ? [] : {[K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]}[Extract<keyof T, string>];

export type Join<T extends string[], D extends string> = T extends [] ? never : T extends [infer F] ? F : T extends [infer F, ...infer R] ? (F extends string ? `${F}${D}${Join<Extract<R, string[]>, D>}` : never) : string;

