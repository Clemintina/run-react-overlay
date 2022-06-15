import {Static, Type} from "@sinclair/typebox";

export const RUNElectronStore = Type.Optional(Type.Object({
    run: Type.Optional(Type.Object({
        overlay: Type.Object({
            version: Type.String({description: 'Overlay Version', default: 'Unknown'})
        }),
        apiKey: Type.String({description: 'RUN API Key', default: 'public'})
    })),
    hypixel: Type.Optional(Type.Object({
        apiKey: Type.String({description: 'Hypixel API Key', format: "uuid", default: null}),
        apiKeyOwner: Type.String({description: 'Hypixel API Key Owner', format: "uuid", default: null})
    }))
}));

export type RUNElectronStoreType = Static<typeof RUNElectronStore>;
