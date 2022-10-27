import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {ToggleButton} from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {Box, SxProps} from "@mui/material";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

const CustomLinks = () => {
    const {settings, browserWindow, font, table} = useConfigStore((state) => ({settings: state.settings, browserWindow: state.browserWindow, font: state.font, table: state.table}));
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
                                useConfigStore.getState().setSettings({...settings, preferences: {autoHide: !settings.preferences.autoHide}});
                            }}
                            options={{enabled: settings.preferences.autoHide}}
                        />
                    </SettingCard>
                </Box>
            </NavigationBar>
        </div>
    );
};

export default CustomLinks;
