import React from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import {Checkbox} from "@mui/material";
import store from "@renderer/store";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export interface ToggleButton {
    onClick?: (input) => void;
    onChange?: (input) => void;
    text: string;
    options: {
        text?: {
            size?: number;
        };
        enabled: boolean;
    };
}

export const ToggleButton: React.ElementType = (props: ToggleButton) => {
    return (
        <label> {props.text}
            <Checkbox {...{"aria-label": props.text}} icon={<VisibilityOff />} checkedIcon={<Visibility />} onClick={props?.onClick ?? undefined} onChange={props?.onChange ?? undefined} checked={props.options.enabled} style={{backgroundColor: "#242424ff", color: `${store.getState().configStore.colours.primaryColour}`}} />
        </label>
    );
};
