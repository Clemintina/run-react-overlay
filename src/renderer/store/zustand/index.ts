import create from "zustand";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

const useStore = create( (set, get) => ({
    ...usePlayerStore,
    ...useConfigStore
}))

export default useStore;
