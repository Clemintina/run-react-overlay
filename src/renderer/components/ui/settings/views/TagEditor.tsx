import {apiKeyValidator, ConfigStore} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {InputTextBox} from "@components/user/InputTextBox";
import {updateCachedState} from "@renderer/store/PlayerStore";
import {ValidationIcon} from "@components/user/settings/components/ValidationIcon";
import NavigationBar from "@components/ui/settings/views/NavigationBar";

const Essentials = () => {
    const localConfigStore: ConfigStore = useSelector(() => store.getState().configStore);
    const isHypixelKeySet: boolean = localConfigStore.hypixel.apiKeyValid;
    const isLogsSet: boolean = localConfigStore.logs.readable;
    const settings = localConfigStore.settings;
    const colours = localConfigStore.colours;

    // TODO make it look nicer and cleaner

    return (
        <div>
            <NavigationBar>
                <p>All colours must be in <span className={'font-bold'}>HEX</span></p>
                <div className='w-full h-full p-2 flex flex-col space-y-2'>
                    <SettingCard>
                        <span>Tag</span>
                        <span>Display</span>
                        <span>Hex</span>
                    </SettingCard>
                    <SettingCard>
                        <span>Blacklisted</span>
                        <span />
                        <span>
                            <InputTextBox
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === "Enter") {
                                        store.dispatch(apiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
                                        setTimeout(() => updateCachedState(), 1000);
                                    }
                                }}
                                options={{placeholder: "Blacklisted hex colour"}}
                            />
                        </span>
                    </SettingCard>
                </div>
            </NavigationBar>
        </div>
    );
};

export default Essentials;
