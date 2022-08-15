import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {TagSchema} from "@common/utils/TagSchema";
import useTagStore from "@renderer/store/zustand/TagStore";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {Link} from "react-router-dom";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {SettingHeader} from "@components/user/settings/components/SettingHeader";

const NickView = () => {
    const {nicks} = useConfigStore((state) => ({nicks: state.nicks}));

    const savedNicks = nicks.map((playerNick) => (
        <div key={playerNick.nick}>
            <div className=''>
                <SettingCard>
                    <span>{playerNick.nick}</span>
                    <span>{playerNick.name}</span>
                    <span>{playerNick.uuid}</span>
                </SettingCard>
            </div>
        </div>
    ));

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <div className='h-full w-full p-2 flex flex-col'>
                    <SettingHeader>
                        <span className={"w-80"}>Nick</span>
                        <span className={"w-80"}>Real Username</span>
                        <span className={"w-80"}>Action</span>
                    </SettingHeader>
                    {savedNicks}
                </div>
            </NavigationBar>
        </div>
    );
};

export default NickView;
