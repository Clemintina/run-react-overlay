import React from "react";
import { SettingCard } from "@components/user/settings/components/SettingCard";
import { InputTextBox } from "@components/user/InputTextBox";
import { ValidationIcon } from "@components/user/settings/components/ValidationIcon";
import { LogSelectorModal } from "@components/user/settings/LogSelectorModal";
import { SettingHeader } from "@components/user/settings/components/SettingHeader";
import { ToggleButton } from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import { Box, SxProps } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import useConfigStore, { ConfigStore } from "@renderer/store/zustand/ConfigStore";
import Tooltip from "@mui/material/Tooltip";

const Essentials = () => {
    const localConfigStore = useConfigStore<ConfigStore>((state) => state);
    const { hypixel, logs, settings, run } = useConfigStore((state) => ({ hypixel: state.hypixel, logs: state.logs, settings: state.settings, run: state.run }));

    useConfigStore.getState().setVersion();

    const styledProps: SxProps = {
        width: 0.86,
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <Box className={"p-2 space-y-2"}>
                    <SettingCard>
                        <span>Hypixel API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
                                    if (event.key === "Enter") {
                                        useConfigStore.getState().setHypixelApiKey(text.replaceAll(" ", ""));
                                    }
                                }}
                                onBlur={(event, text) => {
                                    useConfigStore.getState().setHypixelApiKey(text.replaceAll(" ", ""));
                                }}
                                options={{ placeholder: hypixel.apiKeyValid ? hypixel.apiKey : "Hypixel API Key" }}
                                sx={styledProps}
                                error={() => !hypixel.apiKeyValid}
                                helperText={!hypixel.apiKeyValid ? "Enter a valid Hypixel API Key" : ""}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Seraph API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
                                    if (event.key === "Enter") {
                                        useConfigStore.getState().setRunApiKey(text.replaceAll(" ", ""));
                                    }
                                }}
                                onBlur={(event, text) => {
                                    useConfigStore.getState().setRunApiKey(text.replaceAll(" ", ""));
                                }}
                                options={{ placeholder: run.valid ? run.apiKey : "Seraph API Key" }}
                                sx={styledProps}
                                error={() => !run.valid}
                                helperText={!run.valid ? "Enter a valid Seraph API Key" : ""}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard options={{ shown: settings.keathiz }}>
                        <span>Antisniper API Key</span>
                        <span />
                        <span>
                            <InputTextBox
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
                                    if (event.key === "Enter") {
                                        useConfigStore.getState().setKeathizApiKey(text.replaceAll(" ", ""));
                                    }
                                }}
                                onBlur={(event, text) => {
                                    useConfigStore.getState().setKeathizApiKey(text.replaceAll(" ", ""));
                                }}
                                options={{ placeholder: localConfigStore.keathiz.valid ? localConfigStore.keathiz.key : "Antisniper API Key" }}
                                sx={styledProps}
                                error={() => !localConfigStore.keathiz.valid}
                                helperText={!localConfigStore.keathiz.valid ? "Enter a valid Antisniper API Key" : ""}
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
                                useConfigStore.getState().setSettings({ ...settings, boomza: !settings.boomza });
                            }}
                            options={{ enabled: settings.boomza }}
                        >
                            <span>
                                <Tooltip title="This API is proxied to protect your IP.">
                                    <FontAwesomeIcon icon={faMapLocation} />
                                </Tooltip>
                            </span>
                        </ToggleButton>
                    </SettingCard>
                    <SettingCard>
                        <span>Lunar Tags</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({ ...settings, lunar: !settings.lunar });
                            }}
                            options={{ enabled: settings.lunar }}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Friends</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({ ...settings, run: { friends: !settings.run.friends } });
                            }}
                            options={{ enabled: settings.run.friends }}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Guilds</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({ ...settings, hypixel: { guilds: !settings.hypixel.guilds } });
                            }}
                            options={{ enabled: settings.hypixel.guilds }}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Keathiz/Antisniper</span>
                        <span />
                        <span>
                            <ToggleButton
                                onChange={async () => {
                                    useConfigStore.getState().setSettings({ ...settings, keathiz: !settings.keathiz });
                                }}
                                options={{ enabled: settings.keathiz }}
                            >
                                <span>
                                    <Tooltip title="This API is proxied to protect your IP.">
                                        <FontAwesomeIcon icon={faMapLocation} />
                                    </Tooltip>
                                </span>
                            </ToggleButton>
                        </span>
                    </SettingCard>
                    <SettingHeader>
                        <span />
                        <span>Other</span>
                        <span />
                    </SettingHeader>
                    <SettingCard>
                        <span>Astolfo Chat Bridge</span>
                        <span />
                        <span>
                            <ToggleButton
                                onChange={async () => {
                                    useConfigStore.getState().setSettings({ ...settings, astolfo: !settings.astolfo });
                                    await window.ipcRenderer.invoke("astolfo");
                                }}
                                options={{ enabled: settings.astolfo }}
                            ></ToggleButton>
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Automatic Updates</span>
                        <span />
                        <span>
                            <ToggleButton
                                onChange={async () => {
                                    await window.config.set("settings.updater", !(await window.config.get("settings.updater")));
                                    useConfigStore.getState().setSettings({ ...settings, updater: !settings.updater });

                                }}
                                options={{ enabled: settings.updater }}
                            ></ToggleButton>
                        </span>
                    </SettingCard>
                </Box>
            </NavigationBar>
        </div>
    );
};

export default Essentials;
