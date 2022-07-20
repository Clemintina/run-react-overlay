import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import React from "react";
import store from "@renderer/store";
import {apiKeyValidator, ColourSettings, ConfigStore, keathizApiKeyValidator, setBrowserWindow, setColours, setSettingsValue, SettingsConfig} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import {InputTextBox} from "@components/user/InputTextBox";
import {ToggleButton} from "@components/user/ToggleButton";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {ValidationIcon} from "@components/user/settings/components/ValidationIcon";
import {SettingHeader} from "@components/user/settings/components/SettingHeader";
import {LogSelectorModal} from "@components/user/settings/LogSelectorModal";
import {Slider} from "@mui/material";
import {isArray} from "util";
import {FeedbackForm} from "@components/user/settings/FeedbackForm";
import {ContactStaff} from "@components/user/settings/dev/ContactStaff";
import {updateCachedState} from "@renderer/store/PlayerStore";
import {NewSettingsModal} from "@components/user/settings/dev/NewSettingsModal";
import {InputBoxButton} from "@components/user/InputBoxButton";

const MainSettings = () => {
    const localConfigStore: ConfigStore = useSelector(() => store.getState().configStore);
    const isHypixelKeySet: boolean = localConfigStore.hypixel.apiKeyValid;
    const isLogsSet: boolean = localConfigStore.logs.readable;
    const settings = localConfigStore.settings;
    const version = localConfigStore.version;
    const colours = localConfigStore.colours;

    const [opacityValue, setOpacityValue] = React.useState(localConfigStore.browserWindow.opacity ?? 20);

    // TODO make it look nicer and cleaner

    return (
        <div style={{color: colours.primaryColour, backgroundColor: colours.backgroundColour}} className='w-full h-full p-2 flex flex-col space-y-2'>
            <div className='text-3xl font-bold underlineText'>Overlay Settings</div>
            <SettingCard>
                <span>Hypixel API Key</span>
                <span/>
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
                    {<ValidationIcon valid={isHypixelKeySet}/>}
                </span>
            </SettingCard>
            <SettingCard>
                <span>RUN API Key</span>
                <span/>
                <span>
                    <InputTextBox
                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === "Enter") {
                                store.dispatch(apiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
                            }
                        }}
                        options={{placeholder: localConfigStore.hypixel.apiKeyValid ? localConfigStore.runKey : "RUN API Key"}}
                    />
                    {<ValidationIcon valid={isHypixelKeySet}/>}
                </span>
            </SettingCard>
            <SettingCard options={{shown: settings.keathiz}}>
                <span>Keathiz API Key</span>
                <span/>
                <span>
                    <InputTextBox
                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === "Enter") {
                                store.dispatch(keathizApiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
                            }
                        }}
                        options={{placeholder: localConfigStore.keathiz.valid ? localConfigStore.keathiz.key : "Keathiz API Key"}}
                    />
                    {<ValidationIcon valid={localConfigStore.keathiz.valid}/>}
                </span>
            </SettingCard>
            <SettingCard>
                <span>Overlay Logs</span>
                <span/>
                <span>
                    <span className={"inline-flex flex"}>
                        <LogSelectorModal/>
                        {<ValidationIcon valid={isLogsSet}/>}
                    </span>
                </span>
            </SettingCard>
            <SettingHeader>
                <span/>
                <span>Apis</span>
                <span/>
            </SettingHeader>
            <SettingCard>
                <span>Boomza</span>
                <span/>
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
                <span/>
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
                <span/>
                <ToggleButton
                    onChange={async (event) => {
                        const payload: SettingsConfig = {boomza: settings.boomza, keathiz: !settings.keathiz, lunar: settings.lunar};
                        store.dispatch(setSettingsValue(payload));
                    }}
                    options={{enabled: settings.keathiz}}
                />
            </SettingCard>
            <SettingHeader>
                <span/>
                <span>Customise the Overlay</span>
                <span/>
            </SettingHeader>
            <SettingCard>
                <span>New Settings</span>
                <span/>
                <span><NewSettingsModal/></span>
            </SettingCard>
            <SettingCard>
                <span>Background Colour</span>
                <span/>
                <span>
                    <InputTextBox
                        options={{placeholder: "Background Colour"}}
                        onKeyDown={(event) => {
                            const payload: ColourSettings = {
                                backgroundColour: event.target.value,
                                primaryColour: localConfigStore.colours.primaryColour,
                                secondaryColour: localConfigStore.colours.secondaryColour,
                            };
                            store.dispatch(setColours(payload));
                        }}
                    />
                </span>
            </SettingCard>
            <SettingCard>
                <span>Primary Colour</span>
                <span/>
                <span>
                    <InputTextBox
                        options={{placeholder: "Text Colour"}}
                        onKeyDown={(event) => {
                            const payload: ColourSettings = {
                                backgroundColour: localConfigStore.colours.backgroundColour,
                                primaryColour: event.target.value,
                                secondaryColour: localConfigStore.colours.secondaryColour,
                            };
                            store.dispatch(setColours(payload));
                        }}
                    />
                </span>
            </SettingCard>
            <SettingCard>
                <span>Secondary Colour</span>
                <span/>
                <span>
                    <InputTextBox
                        options={{placeholder: "Secondary Colour"}}
                        onKeyDown={(event) => {
                            const payload: ColourSettings = {
                                backgroundColour: localConfigStore.colours.backgroundColour,
                                primaryColour: localConfigStore.colours.primaryColour,
                                secondaryColour: event.target.value,
                            };
                            store.dispatch(setColours(payload));
                        }}
                    />
                </span>
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
                            window.ipcRenderer.send('opacity', opacityValue / 100);
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
            <SettingHeader>
                <span/>
                <span>Misc</span>
                <span/>
            </SettingHeader>
            <SettingCard>
                <span>Version</span>
                <span/>
                <span>{version}</span>
            </SettingCard>
            <SettingCard>
                <span>Open Config</span>
                <span/>
                <span><InputBoxButton text={'Open'} onClick={() => window.ipcRenderer.send('openExternal', 'config_file')}/></span>
            </SettingCard>
            <SettingCard>
                <span>Open Tags</span>
                <span/>
                <span><InputBoxButton text={'Open'} onClick={() => window.ipcRenderer.send('openExternal', 'tag_file')}/></span>
            </SettingCard>
        </div>
    );
};

export default MainSettings;
