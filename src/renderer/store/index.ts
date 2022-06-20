import {configureStore} from "@reduxjs/toolkit";
import PlayerStore, {PlayerStore as PlayerStoreInterface} from "./PlayerStore";
import ConfigStore, {ConfigStore as ConfigStoreInterface} from "./ConfigStore";

export interface Store {
    playerStore: PlayerStoreInterface;
    configStore: ConfigStoreInterface;
}

const store = configureStore({
    reducer: {
        playerStore: PlayerStore,
        configStore: ConfigStore,
    },
});

export default store;
