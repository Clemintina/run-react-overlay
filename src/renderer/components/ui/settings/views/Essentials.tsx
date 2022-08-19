import React, {useState} from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {InputTextBox} from "@components/user/InputTextBox";
import {ValidationIcon} from "@components/user/settings/components/ValidationIcon";
import {LogSelectorModal} from "@components/user/settings/LogSelectorModal";
import {SettingHeader} from "@components/user/settings/components/SettingHeader";
import {ToggleButton} from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {Slider, SxProps} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocation} from "@fortawesome/free-solid-svg-icons";
import useConfigStore, {ConfigStore} from "@renderer/store/zustand/ConfigStore";
import {SettingsConfig} from "@common/utils/Schemas";

const Essentials = () => {
    const localConfigStore = useConfigStore<ConfigStore>((state) => state);
    const {hypixel, logs, settings, run, browserWindow} = useConfigStore((state) => ({hypixel: state.hypixel, logs: state.logs, settings: state.settings, run: state.run, browserWindow: state.browserWindow}));
    const [opacityValue, setOpacityValue] = useState(localConfigStore.browserWindow.opacity ?? 20);

    const styledProps: SxProps = {
        width: 0.86,
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <div className="w-full h-full p-2 flex flex-col space-y-2">
                    <SettingCard>
                        <span>Hypixel API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                icon={<ValidationIcon valid={hypixel.apiKeyValid} />}
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
                                    if (event.key === "Enter") {
                                        useConfigStore.getState().setHypixelApiKey(text.replaceAll(" ", ""));
                                    }
                                }}
                                onBlur={(event, text) => {
                                    useConfigStore.getState().setHypixelApiKey(text.replaceAll(" ", ""));
                                }}
                                options={{placeholder: hypixel.apiKeyValid ? hypixel.apiKey : "Hypixel API Key"}}
                                sx={styledProps}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>RUN API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                icon={<ValidationIcon valid={run.valid} />}
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
                                    if (event.key === "Enter") {
                                        useConfigStore.getState().setRunApiKey(text.replaceAll(" ", ""));
                                    }
                                }}
                                onBlur={(event, text) => {
                                    useConfigStore.getState().setRunApiKey(text.replaceAll(" ", ""));
                                }}
                                options={{placeholder: run.valid ? run.apiKey : "Run API Key"}}
                                sx={styledProps}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard options={{shown: settings.keathiz}}>
                        <span>Keathiz API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                icon={<ValidationIcon valid={localConfigStore.keathiz.valid} />}
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
                                    if (event.key === "Enter") {
                                        useConfigStore.getState().setKeathizApiKey(text.replaceAll(" ", ""));
                                    }
                                }}
                                onBlur={(event, text) => {
                                    useConfigStore.getState().setKeathizApiKey(text.replaceAll(" ", ""));
                                }}
                                options={{placeholder: localConfigStore.keathiz.valid ? localConfigStore.keathiz.key : "Keathiz API Key"}}
                                sx={styledProps}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Overlay Logs</span>
                        <span />
                        <span>
                            <span className={"inline-flex flex"}>
                                {<ValidationIcon valid={logs.readable} />}
                                <LogSelectorModal />
                            </span>
                        </span>
                    </SettingCard>
                    <SettingHeader>
                        <span />
                        <span>APIs</span>
                        <span />
                    </SettingHeader>
                    <SettingCard>
                        <span>Boomza (BWStats)</span>
                        <span />
                        <ToggleButton
                            text={""}
                            onChange={async () => {
                                const payload: SettingsConfig = {...settings};
                                payload.boomza = !payload.boomza;
                                useConfigStore.getState().setSettings(payload);
                            }}
                            onHover={<span className={"text-red-500"}>This API is proxied to protect your IP.</span>}
                            options={{enabled: settings.boomza}}
                        >
                            <span>
                                <FontAwesomeIcon icon={faMapLocation} />
                            </span>
                        </ToggleButton>
                    </SettingCard>
                    <SettingCard>
                        <span>Lunar Tags</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                const payload: SettingsConfig = {...settings};
                                payload.lunar = !payload.lunar;
                                useConfigStore.getState().setSettings(payload);
                            }}
                            options={{enabled: settings.lunar}}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Keathiz/Antisniper</span>
                        <span />
                        <span>
                            <ToggleButton
                                onChange={async () => {
                                    const payload: SettingsConfig = {...settings};
                                    payload.keathiz = !payload.keathiz;
                                    useConfigStore.getState().setSettings(payload);
                                }}
                                options={{enabled: settings.keathiz}}
                                onHover={<span className={"text-red-500"}>This API is proxied to protect your IP.</span>}
                            >
                                <span>
                                    <FontAwesomeIcon icon={faMapLocation} />
                                </span>
                            </ToggleButton>
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Auto Hide</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                const payload: SettingsConfig = {...settings};
                                payload.preferences.autoHide = !payload.preferences.autoHide;
                                useConfigStore.getState().setSettings(payload);
                            }}
                            options={{enabled: settings.preferences.autoHide}}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Opacity</span>
                        <span />
                        <span>
                            <Slider
                                aria-label="Opacity"
                                value={opacityValue}
                                onChange={(event, value) => {
                                    const opacityValue: number = typeof value == "number" ? value : value[0];
                                    setOpacityValue(opacityValue);
                                    useConfigStore.getState().setBrowserWindow({...useConfigStore.getState().browserWindow, opacity: opacityValue});
                                }}
                                onBlur={() => {
                                    if (opacityValue < 20) setOpacityValue(20);
                                    useConfigStore.getState().setBrowserWindow({height: browserWindow.height, opacity: opacityValue, width: browserWindow.width});
                                }}
                                getAriaValueText={(value) => `${value}`}
                                valueLabelDisplay='auto'
                                min={1}
                                valueLabelFormat={(value: number) => {
                                    return value;
                                }}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Sorting</span>
                        <span />
                        <span>To sort players in order of stats, click the label of the column whose stats you'd like to sort by.</span>
                    </SettingCard>
                </div>
            </NavigationBar>
        </div>
    );
};

export default Essentials;
