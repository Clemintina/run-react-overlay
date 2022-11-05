import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {ToggleButton} from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {Box, SxProps} from "@mui/material";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {IpcValidInvokeChannels} from "@common/utils/IPCHandler";
import {CustomFileIpc, CustomLinkFile} from "@common/utils/Schemas";
import {InputBoxButton} from "@components/user/InputBoxButton";
import destr from "destr";
import Typography from "@mui/material/Typography";
import {UserAccordion} from "@components/user/UserAccordion";
import {InputTextBox} from "@components/user/InputTextBox";

const CustomLinks = () => {
    const {settings, customApi, customFile} = useConfigStore((state) => ({
        settings: state.settings,
        customApi: state.customApi,
        customFile: state.customFile,
    }));
    const styledProps: SxProps = {
        width: 0.98,
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <Box className="p-2 space-y-2">
                    <SettingCard>
                        <span>Custom Blacklist File</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({...settings, preferences: {...settings.preferences, customFile: !settings.preferences.customFile}});
                            }}
                            options={{enabled: settings.preferences.customFile}}
                        />
                        <span />
                        <span />
                        <div style={settings.preferences.customFile ? {} : {display: "none"}} className={"flex inline-block"}>
                            <Box className={"flex inline-block"}>
                                <InputBoxButton
                                    onClick={async () => {
                                        const path: Electron.OpenDialogReturnValue = await window.ipcRenderer.invoke(IpcValidInvokeChannels.SELECT_LOG_FILE, [[{name: "Custom File", extensions: ["txt", "json"]}]]);
                                        if (path.filePaths[0] !== undefined) {
                                            const customFilePath = path.filePaths[0];
                                            const readable = await window.ipcRenderer.invoke<boolean>(IpcValidInvokeChannels.IS_FILE_READABLE, [customFilePath]);
                                            if (readable.data) {
                                                const readFileBuffer = await window.ipcRenderer.invoke<CustomFileIpc>(IpcValidInvokeChannels.READ_FILE, [customFilePath]);
                                                if (readFileBuffer.data != undefined && typeof readFileBuffer.data.contents === "string") {
                                                    if (!readFileBuffer.data.contents.startsWith("{")) {
                                                        const data = readFileBuffer.data.contents.split(/\r?\n/);
                                                        const customLinkFile: CustomLinkFile = {
                                                            readable: true,
                                                            path: customFilePath,
                                                            data,
                                                        };
                                                        useConfigStore.getState().setCustomFile(customLinkFile);
                                                    } else {
                                                        const data = destr(readFileBuffer.data.contents).data;
                                                        const customLinkFile: CustomLinkFile = {
                                                            readable: true,
                                                            path: customFilePath,
                                                            data,
                                                        };
                                                        useConfigStore.getState().setCustomFile(customLinkFile);
                                                    }
                                                } else {
                                                    console.log("File in undefined");
                                                }
                                            } else {
                                                useConfigStore.getState().setErrorMessage({
                                                    code: 400,
                                                    title: "Bad Custom file",
                                                    cause: "The file set is unreadable.",
                                                });
                                            }
                                        }
                                    }}
                                    options={{colour: settings.preferences.customFile ? "success" : "error"}}
                                    text={"Select"}
                                    sx={styledProps}
                                />
                                <InputBoxButton
                                    onClick={async () => {
                                        if (customFile.readable) {
                                            const readFileBuffer = await window.ipcRenderer.invoke<CustomFileIpc>(IpcValidInvokeChannels.READ_FILE, [customFile.path, "text"]);
                                            if (readFileBuffer.data != undefined && typeof readFileBuffer.data.contents === "string") {
                                                if (!readFileBuffer.data.contents.startsWith("{")) {
                                                    const data = readFileBuffer.data.contents.split(/\r?\n/);
                                                    const customLinkFile: CustomLinkFile = {
                                                        readable: true,
                                                        path: customFile.path,
                                                        data,
                                                    };
                                                    useConfigStore.getState().setCustomFile(customLinkFile);
                                                } else {
                                                    const data = destr(readFileBuffer.data.contents).data;
                                                    const customLinkFile: CustomLinkFile = {
                                                        readable: true,
                                                        path: customFile.path,
                                                        data,
                                                    };
                                                    useConfigStore.getState().setCustomFile(customLinkFile);
                                                }
                                            } else {
                                                console.log("File in undefined");
                                            }
                                        }
                                    }}
                                    options={{colour: settings.preferences.customFile ? "success" : "error"}}
                                    text={"Reload"}
                                    sx={styledProps}
                                />
                            </Box>
                        </div>
                    </SettingCard>
                    <SettingCard>
                        <span>Custom Blacklist API</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({...settings, preferences: {...settings.preferences, customUrl: !settings.preferences.customUrl}});
                            }}
                            options={{enabled: settings.preferences.customUrl}}
                        />
                    </SettingCard>
                    <Box style={settings.preferences.customUrl ? {} : {display: "none"}}>
                        <InputTextBox initialValue={customApi.url} options={{placeholder: "https://antisniper.seraph.si/api/", label: {text: "Custom URL"}}} onBlur={(event) => useConfigStore.getState().setCustomApi({url: event.currentTarget.value})} />
                        <UserAccordion name={"Request Parameters"}>
                            <div className={"grid grid-cols-2"}>
                                <div className={"font-bold pb-2"}>URL Parameter</div>
                                <div className={"font-bold pb-2"}>Overlay Equivalent</div>
                                <Typography>{`{uuid}`}</Typography>
                                <Typography>Player Uuid</Typography>
                                <Typography>{`{name}`}</Typography>
                                <Typography>Player Name</Typography>
                                <Typography>{`{hypixelapikey}`}</Typography>
                                <Typography>Include your Hypixel API Key</Typography>
                                <Typography>{`{seraphapikey}`}</Typography>
                                <Typography>Include your Seraph API Key</Typography>
                                <Typography>{`{blacklisted}`}</Typography>
                                <Typography>Include Seraph's Blacklist status</Typography>
                            </div>
                        </UserAccordion>
                    </Box>
                </Box>
            </NavigationBar>
        </div>
    );
};

export default CustomLinks;
