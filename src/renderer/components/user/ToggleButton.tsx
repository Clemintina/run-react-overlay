import React from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import {Checkbox} from "@mui/material";
import store from "@renderer/store";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useSelector} from "react-redux";

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
    const colours = useSelector(() => store.getState().configStore.colours);
    return (
        <label>
            {props.text}
            <Checkbox {...{"aria-label": props.text}} icon={<VisibilityOff />} checkedIcon={<Visibility />} onClick={props?.onClick ?? undefined} onChange={props?.onChange ?? undefined} checked={props.options.enabled} style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}} />
        </label>
    );
};
