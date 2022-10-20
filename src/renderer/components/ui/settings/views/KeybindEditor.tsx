import React, { useState } from "react";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { Box } from "@mui/material";
import { InputTextBox } from "@components/user/InputTextBox";
import { SettingCard } from "@components/user/settings/components/SettingCard";
import { KeybindInterface } from "@common/utils/Schemas";

const KeybindEditorView = () => {
    const { keybinds } = useConfigStore((state) => ({ keybinds: state.keybinds }));
    const [controlBind, setControlBind] = useState<KeybindInterface>({ keybind: "", focus: "none" });

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <Box>
                    <SettingCard className={"border-2 border-cyan-500"}>
                        <span className={" "}>Toggle visibility</span>
                        <span className={" "}>
                            <InputTextBox
                                onKeyDown={(event) => {
                                    const keybind = controlBind.keybind.length != 0 ? controlBind.keybind + "+" + event.key : event.key;
                                    setControlBind({ ...controlBind, keybind, focus: "open_overlay" });
                                }}
                                onBlur={async () => {
                                    await useConfigStore.getState().addKeybind(controlBind.focus, controlBind.keybind);
                                    await window.ipcRenderer.invoke("registerGlobalKeybinds", keybinds);
                                }}
                                onFocus={() => {
                                    useConfigStore.getState().removeKeybind("open_overlay");
                                    setControlBind({ ...controlBind, keybind: "" });
                                }}
                                options={{ liveUpdate: true, placeholder: "Open Overlay", value: useConfigStore.getState().getKeybind("open_overlay")?.keybind }}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard className={"border-2 border-cyan-500"}>
                        <span className={" "}>Clear players</span>
                        <span className={" "}>
                            <InputTextBox
                                onKeyDown={(event) => {
                                    const keybind = controlBind.keybind.length != 0 ? controlBind.keybind + "+" + event.key : event.key;
                                    setControlBind({ ...controlBind, keybind, focus: "clear_players" });
                                }}
                                onBlur={async () => {
                                    await useConfigStore.getState().addKeybind(controlBind.focus, controlBind.keybind);
                                    await window.ipcRenderer.invoke("registerGlobalKeybinds", keybinds);
                                }}
                                onFocus={() => {
                                    useConfigStore.getState().removeKeybind("clear_players");
                                    setControlBind({...controlBind, keybind: ""});
                                }}
                                options={{
                                    placeholder: "Clear Players",
                                    value: useConfigStore.getState().getKeybind("clear_players")?.keybind
                                }}
                            />
                        </span>
                    </SettingCard>
                </Box>
            </NavigationBar>
        </div>
    );
};

export default KeybindEditorView;
