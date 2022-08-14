// eslint-disable-next-line import/named
import {SxProps, Theme} from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface InputBoxButton {
    onClick: (input) => void;
    text: string;
    sx?: SxProps<Theme>;
}

export const InputBoxButton: React.ElementType = (props: InputBoxButton) => {
    const {colours} = useConfigStore((state) => ({colours: state.colours}))
    return (
        <span className='hover:border-cyan-500 hover:border-2 w-full h-full'>
            <Button variant='contained' sx={props?.sx} onClick={props.onClick} style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}}>
                {props.text}
            </Button>
        </span>
    );
};
