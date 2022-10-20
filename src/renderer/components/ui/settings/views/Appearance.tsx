import React, { useState } from "react";
import { SettingCard } from "@components/user/settings/components/SettingCard";
import { InputTextBox } from "@components/user/InputTextBox";
import { ToggleButton } from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import { Box, FormControl, InputLabel, Select, SelectChangeEvent, Slider, SxProps } from "@mui/material";
import useConfigStore, { ConfigStore } from "@renderer/store/zustand/ConfigStore";
import GoogleFontLoader from "react-google-font-loader";
import MenuItem from "@mui/material/MenuItem";

const Appearance = () => {
    const localConfigStore = useConfigStore<ConfigStore>((state) => state);
    const { settings, browserWindow, font, table } = useConfigStore((state) => ({ settings: state.settings, browserWindow: state.browserWindow, font: state.font, table: state.table }));
    const [opacityValue, setOpacityValue] = useState(localConfigStore.browserWindow.opacity ?? 20);
    const styledProps: SxProps = {
        width: 0.86,
    };

    const [textAlignment, setTextAlignment] = React.useState(table.settings.textAlign);

    const handleChange = (event: SelectChangeEvent) => {
        if (event.target.value == "left" || event.target.value == "right" || event.target.value == "center") {
            setTextAlignment(event.target.value);
            useConfigStore.getState().setTableState({ ...useConfigStore.getState().table, settings: { textAlign: event.target.value } });
        }
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <Box className='p-2 space-y-2'>
                    <SettingCard>
                        <span>Auto Hide</span>
                        <span />
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({ ...settings, preferences: { autoHide: !settings.preferences.autoHide } });
                            }}
                            options={{ enabled: settings.preferences.autoHide }}
                        />
                    </SettingCard>
                    <SettingCard>
                        <span>Opacity</span>
                        <span />
                        <span>
                            <Slider
                                aria-label='Opacity'
                                value={opacityValue}
                                onChange={(event, value) => {
                                    const opacityValue: number = typeof value == "number" ? value : value[0];
                                    setOpacityValue(opacityValue);
                                    useConfigStore.getState().setBrowserWindow({ ...useConfigStore.getState().browserWindow, opacity: opacityValue });
                                }}
                                onBlur={() => {
                                    useConfigStore.getState().setBrowserWindow({ height: browserWindow.height, opacity: opacityValue, width: browserWindow.width });
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
                        <span>Font</span>
                        <span />
                        <InputTextBox
                            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
                                console.log(text, font.family);
                                if (event.key === "Enter") {
                                    useConfigStore.getState().setFont({ family: text });
                                }
                            }}
                            onBlur={(event, text) => {
                                if (text.length != 0) useConfigStore.getState().setFont({ family: text });
                            }}
                            options={{ placeholder: font.family, label: { text: "Font" } }}
                            sx={styledProps}
                            helperText={"Font you want to use."}
                        />
                        <GoogleFontLoader fonts={[{ font: font.family, weights: [400] }]} />
                    </SettingCard>
                    <SettingCard>
                        <span>Show Rank</span>
                        <span />
                        <span>
                            <ToggleButton
                                onChange={async () => {
                                    useConfigStore.getState().setSettings({
                                        ...settings,
                                        appearance: { displayRank: !settings.appearance.displayRank },
                                    });
                                }}
                                options={{ enabled: settings.appearance.displayRank }}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Text Alignment</span>
                        <span />
                        <span>
                            <FormControl sx={styledProps}>
                                <InputLabel id={"text-align-label"}>Text Alignment</InputLabel>
                                <Select labelId={"text-align-label"} value={textAlignment} label={"Text Alignment"} onChange={handleChange}>
                                    <MenuItem value={"left"}>Left</MenuItem>
                                    <MenuItem value={"center"}>Center</MenuItem>
                                    <MenuItem value={"right"}>Right</MenuItem>
                                </Select>
                            </FormControl>
                        </span>
                    </SettingCard>
                </Box>
            </NavigationBar>
        </div>
    );
};

export default Appearance;
