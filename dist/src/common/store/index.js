import { configureStore } from '@reduxjs/toolkit';
import PlayerStore from "./PlayerStore";
import ConfigStore from "./ConfigStore";
const store = configureStore({
    reducer: {
        playerStore: PlayerStore,
        configStore: ConfigStore
    },
});
export default store;
//# sourceMappingURL=index.js.map