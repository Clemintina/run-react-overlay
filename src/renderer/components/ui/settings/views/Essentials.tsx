import {apiKeyValidator, ConfigStore, keathizApiKeyValidator, runApiKeyValidator, setBrowserWindow, setSettingsValue, SettingsConfig} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {InputTextBox} from "@components/user/InputTextBox";
import {updateCachedState} from "@renderer/store/PlayerStore";
import {ValidationIcon} from "@components/user/settings/components/ValidationIcon";
import {LogSelectorModal} from "@components/user/settings/LogSelectorModal";
import {SettingHeader} from "@components/user/settings/components/SettingHeader";
import {ToggleButton} from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {Slider} from "@mui/material";

const Essentials = () => {
    const localConfigStore: ConfigStore = useSelector(() => store.getState().configStore);
    const isHypixelKeySet: boolean = localConfigStore.hypixel.apiKeyValid;
    const isLogsSet: boolean = localConfigStore.logs.readable;
    const settings = localConfigStore.settings;
    const colours = localConfigStore.colours;

    const [opacityValue, setOpacityValue] = React.useState(localConfigStore.browserWindow.opacity ?? 20);


    // TODO make it look nicer and cleaner

    return (
        <div>
            <NavigationBar>
                <div style={{color: colours.primaryColour, backgroundColor: colours.backgroundColour}} className='w-full h-full p-2 flex flex-col space-y-2'>
                    <SettingCard>
                        <span>Hypixel API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === "Enter") {
                                        store.dispatch(apiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
                                        setTimeout(() => updateCachedState(), 1000);
                                    }
                                }}
                                options={{placeholder: localConfigStore.hypixel.apiKeyValid ? localConfigStore.hypixel.apiKey : "Hypixel API Key"}}
                            />
                            {<ValidationIcon valid={isHypixelKeySet} />}
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>RUN API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === "Enter") {
                                        store.dispatch(runApiKeyValidator({runApiKey: event.currentTarget.value.replaceAll(" ", ""), state: localConfigStore}));
                                    }
                                }}
                                options={{placeholder: localConfigStore.hypixel.apiKeyValid ? localConfigStore.runKey : "RUN API Key"}}
                            />
                            {<ValidationIcon valid={isHypixelKeySet} />}
                        </span>
                    </SettingCard>
                    <SettingCard options={{shown: settings.keathiz}}>
                        <span>Keathiz API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === "Enter") {
                                        store.dispatch(keathizApiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
                                    }
                                }}
                                options={{placeholder: localConfigStore.keathiz.valid ? localConfigStore.keathiz.key : "Keathiz API Key"}}
                            />
                            {<ValidationIcon valid={localConfigStore.keathiz.valid} />}
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Overlay Logs</span>
                        <span />
                        <span>
                            <span className={"inline-flex flex"}>
                                <LogSelectorModal />
                                {<ValidationIcon valid={isLogsSet} />}
                            </span>
                        </span>
                    </SettingCard>
                    <SettingHeader>
                        <span />
                        <span>Apis</span>
                        <span />
                    </SettingHeader>
                    <SettingCard>
                        <span>Boomza</span>
                        <span />
                        <ToggleButton
                            text={""}
                            onChange={async (event) => {
                                const payload: SettingsConfig = {boomza: !settings.boomza, keathiz: settings.keathiz, lunar: settings.lunar};
                                store.dispatch(setSettingsValue(payload));
                            }}
                            options={{enabled: settings.boomza}}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Lunar</span>
                        <span />
                        <ToggleButton
                            onChange={async (event) => {
                                const payload: SettingsConfig = {boomza: settings.boomza, keathiz: settings.keathiz, lunar: !settings.lunar};
                                store.dispatch(setSettingsValue(payload));
                            }}
                            options={{enabled: settings.lunar}}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Keathiz</span>
                        <span />
                        <ToggleButton
                            onChange={async (event) => {
                                const payload: SettingsConfig = {boomza: settings.boomza, keathiz: !settings.keathiz, lunar: settings.lunar};
                                store.dispatch(setSettingsValue(payload));
                            }}
                            options={{enabled: settings.keathiz}}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Opacity</span>
                        <span/>
                        <span>
                    <Slider
                        aria-label='Opacity'
                        value={opacityValue}
                        onChange={(event, value) => {
                            const opacityValue: number = typeof value == 'number' ? value : value[0];
                            setOpacityValue(opacityValue);
                           // window.ipcRenderer.send('opacity', opacityValue / 100);
                        }}
                        onBlur={() => {
                            if (opacityValue < 20) setOpacityValue(20);
                            store.dispatch(setBrowserWindow({height: localConfigStore.browserWindow.height, opacity: opacityValue, width: localConfigStore.browserWindow.width}));
                        }}
                        getAriaValueText={(value) => `${value}`}
                        valueLabelDisplay="auto"
                        min={20}
                        valueLabelFormat={(value: number) => {
                            return value;
                        }}
                    />
                </span>
                    </SettingCard>
                </div>
            </NavigationBar>
        </div>
    );
};

export default Essentials;
