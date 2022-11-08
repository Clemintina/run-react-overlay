import React, {useState} from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {ToggleButton} from "@components/user/ToggleButton";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {Autocomplete, Box, Button, FormControl, FormGroup, InputLabel, Select, SelectChangeEvent, Slider, SxProps, TextField} from "@mui/material";
import useConfigStore, {ConfigStore} from "@renderer/store/zustand/ConfigStore";
import MenuItem from "@mui/material/MenuItem";

const Appearance = () => {
    const localConfigStore = useConfigStore<ConfigStore>((state) => state);
    const {settings, browserWindow, font, table} = useConfigStore((state) => ({
        settings: state.settings,
        browserWindow: state.browserWindow,
        font: state.font,
        table: state.table,
    }));
    const [opacityValue, setOpacityValue] = useState(localConfigStore.browserWindow.opacity ?? 20);
    const styledProps: SxProps = {
        width: 0.86,
    };


    const [textAlignment, setTextAlignment] = useState(table.settings.textAlign);

    const handleChange = (event: SelectChangeEvent) => {
        if (event.target.value == "left" || event.target.value == "right" || event.target.value == "center") {
            setTextAlignment(event.target.value);
            useConfigStore.getState().setTableState({
                ...useConfigStore.getState().table,
                settings: {textAlign: event.target.value},
            });
        }
    };

    // TODO make it look nicer and cleaner
    return <div>
        <NavigationBar>
            <Box className="p-2 space-y-2">
                <SettingCard>
                    <span>Auto Hide</span>
                    <span />
                    <ToggleButton
                        onChange={async () => {
                            useConfigStore.getState().setSettings({...settings, preferences: {...settings.preferences, autoHide: !settings.preferences.autoHide}});
                        }}
                        options={{enabled: settings.preferences.autoHide}}
                    />
                </SettingCard>
                <SettingCard>
                    <span>Opacity</span>
                    <span />
                    <span>
                        <Slider
                            value={opacityValue}
                            onChange={(event, value) => {
                                const opacityValue: number = typeof value == "number" ? value : value[0];
                                setOpacityValue(opacityValue);
                                useConfigStore.getState().setBrowserWindow({...useConfigStore.getState().browserWindow, opacity: opacityValue});
                            }}
                            onBlur={() => {
                                useConfigStore.getState().setBrowserWindow({height: browserWindow.height, opacity: opacityValue, width: browserWindow.width});
                            }}
                            getAriaValueText={(value) => `${value}`}
                            valueLabelDisplay={"auto"}
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
                    <Autocomplete
                        freeSolo
                        disablePortal
                        options={font.isGoogleFont ? [...font.availableFonts] : []}
                        onChange={(event) => {
                            if (event.currentTarget.innerHTML == null || event.currentTarget.innerHTML.length == 0) return;
                            if (font.availableFonts.includes(event.currentTarget.innerHTML) && font.isGoogleFont) {
                                useConfigStore.getState().setFont({...font, family: event.currentTarget.innerHTML});
                            } else {
                                useConfigStore.getState().setFont({...font, family: event.currentTarget.innerHTML});
                            }
                        }}
                        renderInput={(params) => <>
                            <FormGroup>
                                <TextField
                                    {...params}
                                    label={"Font"}
                                    variant={"outlined"}
                                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (event.key === "Enter") {
                                            if (font.availableFonts.includes(event.currentTarget.value)) useConfigStore.getState().setFont({...font, family: event.currentTarget.value});
                                        }
                                    }}
                                    onBlur={(event) => {
                                        if (event.currentTarget.value == null || event.currentTarget.value.length == 0) return;
                                        if (font.availableFonts.includes(event.currentTarget.value) && font.isGoogleFont) {
                                            useConfigStore.getState().setFont({...font, family: event.currentTarget.value});
                                        } else {
                                            useConfigStore.getState().setFont({...font, family: event.currentTarget.value});
                                        }
                                    }}
                                    sx={styledProps}
                                    placeholder={font.family}
                                    helperText={(font.isGoogleFont ? "Google" : "System") + " Font you want to use."}
                                />
                                <Button sx={styledProps} onClick={() => {
                                    useConfigStore.getState().setFont({...font, isGoogleFont: !font.isGoogleFont});
                                }}>{!font.isGoogleFont ? "Use Google Fonts" : "Use System Fonts"}</Button>
                            </FormGroup>
                        </>}
                    />
                </SettingCard>
                <SettingCard>
                    <span>Show Rank</span>
                    <span />
                    <span>
                        <ToggleButton
                            onChange={async () => {
                                useConfigStore.getState().setSettings({
                                    ...settings,
                                    appearance: {displayRank: !settings.appearance.displayRank},
                                });
                            }}
                            options={{enabled: settings.appearance.displayRank}}
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
    </div>;
};

export default Appearance;
