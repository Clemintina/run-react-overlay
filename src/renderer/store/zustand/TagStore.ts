import create from "zustand";
import {persist} from "../../../../node_modules/zustand/middleware";
import {TagSchema, TagStoreSchema} from "@common/utils/TagSchema";

const useTagStore = create<TagStoreSchema>()(
    persist(
        (set, get) => ({
            run: {
                annoylist: {
                    display: "A",
                    colour: "FF5555",
                },
                blacklist: {
                    display: "BLACKLISTED",
                    colour: "FF5555",
                },
                friends: {
                    display: "F",
                    colour: "FF55FF",
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
                            operator: "<=",
                            colour: "AA0000",
                        },
                        {
                            requirement: 2,
                            operator: "<=",
                            colour: "FFFF55",
                        },
                        {
                            requirement: 5,
                            operator: "<=",
                            colour: "FF5555",
                        },
                        {
                            requirement: 10,
                            operator: "<=",
                            colour: "AA0000",
                        },
                    ],
                },
                safelist: {
                    display: "✓",
                    colour: [
                        {
                            requirement: 1,
                            operator: "<=",
                            colour: "FF5555",
                        },
                        {
                            requirement: 10,
                            operator: "<=",
                            colour: "FFFF55",
                        },
                        {
                            requirement: 20,
                            operator: "<=",
                            colour: "55FF55",
                        },
                    ],
                },
                personal_safelist: {
                    display: "(✓)",
                    colour: "FF5555",
                },
                name_change: {
                    display: "NC",
                    colour: "FF55FF",
                },
                bot: {
                    display: "BOT",
                    colour: "55FF55",
                },
            },
            boomza: {
                sniper: {
                    display: "S",
                    colour: "FF0000",
                },
                hacker: {
                    display: "H",
                    colour: "FF0000",
                },
            },
            core: {
                fkdr: {
                    colours: [
                        {
                            requirement: 1,
                            colour: "AAAAAA",
                            operator: "==",
                        },
                        {
                            requirement: 3,
                            colour: "AAAAAA",
                            operator: "<=",
                        },
                        {
                            requirement: 10,
                            colour: "FFFFFF",
                            operator: "<=",
                        },
                        {
                            requirement: 20,
                            colour: "FFAA00",
                            operator: "<=",
                        },
                        {
                            requirement: 30,
                            colour: "00AA00",
                            operator: "<=",
                        },
                        {
                            requirement: 60,
                            colour: "FF5555",
                            operator: "<=",
                        },
                        {
                            requirement: 100,
                            colour: "AA0000",
                            operator: "<=",
                        },
                        {
                            requirement: 500,
                            colour: "FF55FF",
                            operator: "<=",
                        },
                        {
                            requirement: 700,
                            colour: "AA00AA",
                            operator: "<=",
                        },
                    ],
                },
                bblr: {
                    colours: [
                        {
                            requirement: 1,
                            colour: "AAAAAA",
                            operator: "==",
                        },
                        {
                            requirement: 2,
                            colour: "AAAAAA",
                            operator: "<=",
                        },
                        {
                            requirement: 4,
                            colour: "FFFFFF",
                            operator: "<=",
                        },
                        {
                            requirement: 6,
                            colour: "FFAA00",
                            operator: "<=",
                        },
                        {
                            requirement: 7,
                            colour: "00AA00",
                            operator: "<=",
                        },
                        {
                            requirement: 10,
                            colour: "FF5555",
                            operator: "<=",
                        },
                        {
                            requirement: 15,
                            colour: "AA0000",
                            operator: "<=",
                        },
                        {
                            requirement: 50,
                            colour: "FF55FF",
                            operator: "<=",
                        },
                        {
                            requirement: 100,
                            colour: "AA00AA",
                            operator: "<=",
                        },
                    ],
                },
                wlr: {
                    colours: [
                        {
                            requirement: 1,
                            colour: "AAAAAA",
                            operator: "==",
                        },
                        {
                            requirement: 2,
                            colour: "AAAAAA",
                            operator: "<=",
                        },
                        {
                            requirement: 4,
                            colour: "FFFFFF",
                            operator: "<=",
                        },
                        {
                            requirement: 6,
                            colour: "FFAA00",
                            operator: "<=",
                        },
                        {
                            requirement: 7,
                            colour: "00AA00",
                            operator: "<=",
                        },
                        {
                            requirement: 10,
                            colour: "FF5555",
                            operator: "<=",
                        },
                        {
                            requirement: 15,
                            colour: "AA0000",
                            operator: "<=",
                        },
                        {
                            requirement: 50,
                            colour: "FF55FF",
                            operator: "<=",
                        },
                        {
                            requirement: 100,
                            colour: "AA00AA",
                            operator: "<=",
                        },
                    ],
                },
                winstreak: {
                    colours: [
                        {
                            requirement: 0,
                            colour: "AAAAAA",
                            operator: "==",
                        },
                        {
                            requirement: 50,
                            colour: "AAAAAA",
                            operator: "<=",
                        },
                        {
                            requirement: 200,
                            colour: "FFFFFF",
                            operator: "<=",
                        },
                        {
                            requirement: 350,
                            colour: "FFAA00",
                            operator: "<=",
                        },
                        {
                            requirement: 500,
                            colour: "00AA00",
                            operator: "<=",
                        },
                        {
                            requirement: 650,
                            colour: "FF5555",
                            operator: "<=",
                        },
                        {
                            requirement: 800,
                            colour: "AA0000",
                            operator: "<=",
                        },
                        {
                            requirement: 1000,
                            colour: "FF55FF",
                            operator: "<=",
                        },
                        {
                            requirement: 1500,
                            colour: "AA00AA",
                            operator: "<=",
                        },
                    ],
                },
                kdr: {
                    colours: [
                        {
                            requirement: 1,
                            colour: "AAAAAA",
                            operator: "==",
                        },
                        {
                            requirement: 2,
                            colour: "AAAAAA",
                            operator: "<=",
                        },
                        {
                            requirement: 4,
                            colour: "FFFFFF",
                            operator: "<=",
                        },
                        {
                            requirement: 6,
                            colour: "FFAA00",
                            operator: "<=",
                        },
                        {
                            requirement: 7,
                            colour: "00AA00",
                            operator: "<=",
                        },
                        {
                            requirement: 10,
                            colour: "FF5555",
                            operator: "<=",
                        },
                        {
                            requirement: 15,
                            colour: "AA0000",
                            operator: "<=",
                        },
                        {
                            requirement: 50,
                            colour: "FF55FF",
                            operator: "<=",
                        },
                        {
                            requirement: 100,
                            colour: "AA00AA",
                            operator: "<=",
                        },
                    ],
                },
                statistics: {
                    colours: [
                        {
                            requirement: 1000,
                            colour: "AAAAAA",
                            operator: "==",
                        },
                        {
                            requirement: 2000,
                            colour: "AAAAAA",
                            operator: "<=",
                        },
                        {
                            requirement: 4000,
                            colour: "FFFFFF",
                            operator: "<=",
                        },
                        {
                            requirement: 6000,
                            colour: "FFAA00",
                            operator: "<=",
                        },
                        {
                            requirement: 7000,
                            colour: "00AA00",
                            operator: "<=",
                        },
                        {
                            requirement: 10000,
                            colour: "FF5555",
                            operator: "<=",
                        },
                        {
                            requirement: 15000,
                            colour: "AA0000",
                            operator: "<=",
                        },
                        {
                            requirement: 50000,
                            colour: "FF55FF",
                            operator: "<=",
                        },
                        {
                            requirement: 50001,
                            colour: "AA00AA",
                            operator: ">=",
                        },
                    ],
                },
            },
            hypixel: {
                party: {
                    display: "P",
                    colour: "0000AA",
                },
            },
            keathiz: {
                no_data: {
                    display: "ND",
                    colour: "FFD700",
                },
                queues: {
                    queue_count: {
                        display: "Q-",
                        colours: [{ requirement: 10, colour: "FFD700", operator: "<=" }],
                    },
                    queue_total: {
                        display: "QT-",
                        colour: "FFD700",
                    },
                    consecutive_queue: {
                        last_1000: {
                            display: "Q-",
                            colours: [{ requirement: 2, colour: "FFD700", operator: "<=" }],
                        },
                        last_30: { display: "Q-", colours: [{ requirement: 3, colour: "FFD700", operator: "<=" }] },
                        last_10: { display: "Q-", colours: [{ requirement: 2, colour: "FFD700", operator: "<=" }] },
                        weighted: { display: "Q-", colours: [{ requirement: 50, colour: "FFD700", operator: "<=" }] },
                    },
                },
                exits: {
                    exits_total: {
                        display: "ET",
                        colour: "FFD700",
                    },
                },
            },
            setTagStore: (newTagStore: TagSchema) => {
                set({
                    run: newTagStore.run,
                    core: newTagStore.core,
                    hypixel: newTagStore.hypixel,
                });
            },
            setStore: (callback) => {
                set(callback);
            },
        }),
        {
            name: "tags",
            version: 3,
            migrate: (persistedStateCore, version) => {
                const persistedState = persistedStateCore as TagStoreSchema;
                if (version === 1 || version === 0) {
                    persistedState.run.friends = {
                        display: "F",
                        colour: "FF55FF",
                    };
                    return persistedState;
                } else if (version == 2) {
                    persistedState.keathiz = {
                        no_data: {
                            display: "ND",
                            colour: "FFD700",
                        },
                        queues: {
                            queue_count: {
                                display: "Q-",
                                colours: [{ requirement: 10, colour: "FFD700", operator: "<=" }],
                            },
                            queue_total: {
                                display: "QT-",
                                colour: "FFD700",
                            },
                            consecutive_queue: {
                                last_1000: {
                                    display: "Q-",
                                    colours: [{ requirement: 2, colour: "FFD700", operator: "<=" }],
                                },
                                last_30: { display: "Q-", colours: [{ requirement: 3, colour: "FFD700", operator: "<=" }] },
                                last_10: { display: "Q-", colours: [{ requirement: 2, colour: "FFD700", operator: "<=" }] },
                                weighted: {
                                    display: "Q-",
                                    colours: [{ requirement: 50, colour: "FFD700", operator: "<=" }],
                                },
                            },
                        },
                        exits: {
                            exits_total: {
                                display: "ET",
                                colour: "FFD700",
                            },
                        },
                    };
                    return persistedState;
                }
                return persistedState;
            },
        },
    ),
);

export default useTagStore;
