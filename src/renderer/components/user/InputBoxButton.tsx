import React from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import Button from "@mui/material/Button";
// eslint-disable-next-line import/named
import {SxProps, Theme} from "@mui/material";

export interface InputBoxButton {
    onClick: (input) => void;
    text: string;
    sx?: SxProps<Theme>;
}

export const InputBoxButton: React.ElementType = (props: InputBoxButton) => {
    const colours = useSelector(() => store.getState().configStore.colours);
    return (
        <span className='hover:border-cyan-500 hover:border-2'>
            <Button variant='contained' sx={props?.sx} onClick={props.onClick} style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}}>
                {props.text}
            </Button>
        </span>
    );
};
