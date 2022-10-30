import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {ToggleButton} from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {Box, SxProps} from "@mui/material";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

const CustomLinks = () => {
    const { settings } = useConfigStore((state) => ({ settings: state.settings }));
    const styledProps: SxProps = {
        width: 0.86,
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <Box className='p-2 space-y-2'>
                    <SettingCard>
                        <span>Custom File</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({ ...settings, preferences: { ...settings.preferences, customFile: !settings.preferences.customFile } });
                            }}
                            options={{ enabled: settings.preferences.customFile }}
                        />
                    </SettingCard>
                </Box>
            </NavigationBar>
        </div>
    );
};

export default CustomLinks;
