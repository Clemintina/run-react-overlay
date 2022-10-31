import React from "react";
import { SettingCard } from "@components/user/settings/components/SettingCard";
import { InputTextBox } from "@components/user/InputTextBox";
import { LogSelectorModal } from "@components/user/settings/LogSelectorModal";
import { SettingHeader } from "@components/user/settings/components/SettingHeader";
import { ToggleButton } from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import { Box, SxProps } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import Tooltip from "@mui/material/Tooltip";
import { TextSettingCard } from "@components/user/settings/components/TextSettingCard";

const Essentials = () => {
  const { hypixel, logs, settings, run, keathiz } = useConfigStore((state) => ({
    hypixel: state.hypixel,
    logs: state.logs,
    settings: state.settings,
    run: state.run,
        keathiz: state.keathiz,
    }));
    const styledProps: SxProps = {
        width: 0.86,
    };

    // TODO make it look nicer and cleaner
    return (
        <NavigationBar>
            <Box className={"pl-2 pt-2"}>
                <TextSettingCard>
                    <span>Hypixel API Key</span>
                    <span />
                    <InputTextBox
                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
                            if (event.key === "Enter") {
                                useConfigStore.getState().setHypixelApiKey(text.replaceAll(" ", ""));
                            }
                        }}
                        onBlur={(event, text) => {
                            useConfigStore.getState().setHypixelApiKey(text.replaceAll(" ", ""));
                        }}
                        options={{
                            placeholder: hypixel.apiKeyValid ? hypixel.apiKey : "Hypixel API Key",
                            label: { text: "Hypixel API Key" },
                            colour: hypixel.apiKeyValid ? "success" : "error",
                            focused: true,
                        }}
                        sx={styledProps}
                        helperText={!hypixel.apiKeyValid ? "Enter a valid Hypixel API Key" : ""}
                        initialValue={hypixel.apiKey}
                    />
                </TextSettingCard>
                <TextSettingCard>
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
                            options={{
                                placeholder: run.valid ? run.apiKey : "Seraph API Key",
                                label: { text: "Seraph API Key" },
                                colour: run.valid ? "success" : "error",
                                focused: true,
                            }}
                            sx={styledProps}
                            helperText={!run.valid ? "Enter a valid Seraph API Key" : ""}
                            initialValue={run.apiKey}
                        />
                    </span>
                </TextSettingCard>
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
                            options={{
                                placeholder: keathiz.valid ? keathiz.key : "Antisniper API Key",
                                label: { text: "Antisniper API Key" },
                                colour: keathiz.valid ? "success" : "error",
                                focused: true,
                            }}
                            sx={styledProps}
                            helperText={!keathiz.valid ? "Enter a valid Antisniper API Key" : ""}
                            initialValue={keathiz.key}
                        />
                    </span>
                </SettingCard>
                <SettingCard>
                    <span>Overlay Logs</span>
                    <span />
                    <span>
                        <span className={"inline-flex flex"}>
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
                        <span className={"pl-2"}>
                            <Tooltip title='This API is proxied to protect your IP.'>
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
                            <span className={"pl-2"}>
                                <Tooltip title='This API is proxied to protect your IP.'>
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
    );
};

export default Essentials;
