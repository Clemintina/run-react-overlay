import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {ToggleButton} from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {Box, SxProps} from "@mui/material";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {IpcValidInvokeChannels} from "@common/utils/IPCHandler";
import {CustomLinkFile} from "@common/utils/Schemas";
import {InputBoxButton} from "@components/user/InputBoxButton";

const CustomLinks = () => {
    const {settings} = useConfigStore((state) => ({settings: state.settings}));
    const styledProps: SxProps = {
        width: 0.86,
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <Box className="p-2 space-y-2">
                    <SettingCard>
                        <span>Custom File</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({...settings, preferences: {...settings.preferences, customFile: !settings.preferences.customFile}});
                            }}
                            options={{enabled: settings.preferences.customFile}}
                        />
                        <span />
                        <span />
                        <div style={settings.preferences.customFile ? {} : {display: "none"}}><InputBoxButton
                            onClick={async () => {
                                const path: Electron.OpenDialogReturnValue = await window.ipcRenderer.invoke(IpcValidInvokeChannels.SELECT_LOG_FILE, [[{name: "Custom File", extensions: ["txt"]}]]);
                                if (path.filePaths[0] !== undefined) {
                                    const customFilePath = path.filePaths[0];
                                    const readable = await window.ipcRenderer.invoke<boolean>(IpcValidInvokeChannels.IS_FILE_READABLE, [customFilePath]);
                                    if (readable.data) {
                                        const readFileBuffer = await window.ipcRenderer.invoke<string>(IpcValidInvokeChannels.READ_FILE, [customFilePath]);
                                        if (readFileBuffer.data != undefined) {
                                            const data = readFileBuffer.data.split(/\r?\n/);
                                            const customLinkFile: CustomLinkFile = {
                                                readable: true,
                                                path: customFilePath,
                                                data,
                                            };
                                            useConfigStore.getState().setCustomFile(customLinkFile);
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
                            text={"Select Text File"}
                        /></div>
                    </SettingCard>
                </Box>
            </NavigationBar>
        </div>
    );
};

export default CustomLinks;
