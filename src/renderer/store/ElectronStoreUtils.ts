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
            }),
        ),
        external: Type.Optional(
            Type.Object({
                proxy: Type.Object({
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
            }),
        ),
    }),
);

export type RUNElectronStoreType = Static<typeof RUNElectronStore>;
