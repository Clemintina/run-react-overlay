import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import React from "react";
import store from "@renderer/store";
import {apiKeyValidator, ConfigStore, keathizApiKeyValidator, setSettingsValue, SettingsConfig} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {InputTextBox} from "@components/user/InputTextBox";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {ToggleButton} from "@components/user/ToggleButton";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {ValidationIcon} from "@components/user/settings/components/ValidationIcon";
import {SettingHeader} from "@components/user/settings/components/SettingHeader";

const MainSettings = () => {
    const localConfigStore: ConfigStore = useSelector(() => store.getState().configStore);
    const isHypixelKeySet: boolean = localConfigStore.hypixel.apiKeyValid;
    const isLogsSet: boolean = useSelector(() => store.getState().configStore.logs.logPath.length !== 0);
    const settings = localConfigStore.settings;
    const version = localConfigStore.version;
    const colours = localConfigStore.colours;

    // TODO make it look nicer and cleaner
    //  <UnderlinedTitle text={"Overlay Settings"} options={{text: {size: 30}}} />

    return (
        <div style={{color: colours.primaryColour, fontSize: "x-large"}} className='w-full h-full p-2 flex flex-col space-y-2'>
            <div className='text-3xl font-bold underlineText'>Overlay Settings</div>
            <SettingCard>
                <span>Hypixel API Key</span>
                <span />
                <span>
                    <InputTextBox
                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === "Enter") {
                                store.dispatch(apiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
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
                                store.dispatch(apiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
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
                    <InputBoxButton
                        onClick={async () => {
                            const path: Electron.OpenDialogReturnValue = await window.ipcRenderer.invoke("selectLogFile");
                            if (path.filePaths[0] !== undefined) {
                                const logPath = path.filePaths[0];
                                const readable = await window.ipcRenderer.invoke<boolean>("isFileReadable", logPath);
                                if (readable.data) {
                                    window.ipcRenderer.send("logFileSet", logPath);
                                }
                            }
                        }}
                        text={"Select Log File"}
                    />
                    {<ValidationIcon valid={isLogsSet} />}
                </span>
            </SettingCard>
            <SettingHeader>
                <span/>
                <span>Apis</span>
                <span/>
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
                <span>Version:</span>
                <span />
                <span>{version}</span>
            </SettingCard>
        </div>
    );
};

export default MainSettings;
