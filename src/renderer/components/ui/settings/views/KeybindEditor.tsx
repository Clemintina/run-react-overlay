import React, { useState } from "react";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { Box } from "@mui/material";
import { InputTextBox } from "@components/user/InputTextBox";
import { SettingCard } from "@components/user/settings/components/SettingCard";

const KeybindEditorView = () => {
    const { columnState } = useConfigStore((state) => ({ columnState: state.table.columnState }));
    const [controlBind, setControlBind] = useState({ keybind: "", focus: "" });

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
                                    setControlBind({ ...controlBind, keybind, focus: "OpenOverlay" });
                                }}
                                onBlur={() => {
                                    console.log(controlBind);
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
