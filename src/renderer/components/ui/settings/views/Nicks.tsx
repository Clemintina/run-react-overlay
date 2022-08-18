import React from "react";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {SettingHeader} from "@components/user/settings/components/SettingHeader";
import {InputBoxButton} from "@components/user/InputBoxButton";
import PlayerNicknameView from "@common/utils/player/PlayerNickname";

const NickView = () => {
    const {nicks} = useConfigStore((state) => ({nicks: state.nicks}));
    const savedNicks = nicks.map((playerNick) => (
        <div key={playerNick.nick}>
            <PlayerNicknameView key={playerNick.nick} playerNick={playerNick} />
        </div>
    ));

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <div className='h-full w-full p-2 text-center'>
                    <div>
                        <SettingHeader>
                            <span className={""}>
                                <InputBoxButton
                                    text={"Add Player"}
                                    onClick={async (event) => {
                                        const nicksLocal = useConfigStore.getState().nicks;
                                        const newNick = {name: "", nick: "", uuid: "", added: Date.now()};
                                        if (nicksLocal.filter((player) => player.name.toLowerCase() === newNick.name.toLowerCase()).length > 0) {
                                            await window.ipcRenderer.invoke("notifications", "You have already got an empty slot!");
                                        } else {
                                            nicksLocal.push(newNick);
                                            useConfigStore.getState().setNicks(nicksLocal);
                                        }
                                    }}
                                />
                            </span>
                        </SettingHeader>
                        {savedNicks}
                    </div>
                </div>
            </NavigationBar>
        </div>
    );
};

export default NickView;
