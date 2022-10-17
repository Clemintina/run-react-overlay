import React, { useState } from "react";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { Box } from "@mui/material";
import { InputTextBox } from "@components/user/InputTextBox";
import { SettingCard } from "@components/user/settings/components/SettingCard";
import { KeybindInterface } from "@common/utils/Schemas";

const KeybindEditorView = () => {
    const { columnState } = useConfigStore((state) => ({ columnState: state.table.columnState }));
    const [controlBind, setControlBind] = useState<KeybindInterface>({ keybind: "", focus: "none" });
    const shortcutSet = new Set<string>();

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <Box>
                    <SettingCard className={"border-2 border-cyan-500"}>
                        <span className={" "}>Open Overlay</span>
                        <span className={" "}>
                            <InputTextBox
                                onKeyDown={(event) => {
                                    console.log(event.key);
                                    let keybind = controlBind.keybind;
                                    keybind = keybind.length != 0 ? keybind + "+" + event.key : event.key;
                                    setControlBind({ ...controlBind, keybind, focus: "open_overlay" });
                                }}
                                onBlur={async () => {
                                    shortcutSet.add(controlBind.keybind);
                                    console.log(shortcutSet);
                                    const setKeybinds = [...useConfigStore.getState().keybinds];
                                    setKeybinds.push(controlBind);
                                    useConfigStore.getState().setKeybinds(setKeybinds);
                                    await window.ipcRenderer.invoke("registerGlobalKeybinds", shortcutSet);
                                }}
                                onFocus={() => {
                                    setControlBind({ ...controlBind, keybind: "" });
                                }}
                                options={{ placeholder: "Open Overlay", value: controlBind.keybind }}
                            />
                        </span>
                    </SettingCard>
                </Box>
            </NavigationBar>
        </div>
    );
};

export default KeybindEditorView;
