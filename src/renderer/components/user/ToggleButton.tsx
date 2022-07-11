import React from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import {Checkbox} from "@mui/material";
import store from "@renderer/store";
import {ApiRounded, FavoriteBorder, PhoneDisabled, PhoneEnabled, Visibility, VisibilityOff} from "@mui/icons-material";

export interface ToggleButton {
    onClick?: (input) => void;
    onChange?: (input) => void;
    text: string;
    options: {
        text: {
            size: number;
        };
    };
}

export const ToggleButton: React.ElementType = (props: ToggleButton) => {
    return (
        <label> {props.text}
        <Checkbox {...{"aria-label": props.text}} icon={<VisibilityOff/>} checkedIcon={<Visibility/>} onClick={props.onClick} onChange={props.onChange} style={{backgroundColor: "#242424ff", color: `${store.getState().configStore.colours.primaryColour}`}} />
        </label>
            );
};
