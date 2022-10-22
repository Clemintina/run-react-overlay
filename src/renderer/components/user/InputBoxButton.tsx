// eslint-disable-next-line import/named
import { SxProps, Theme } from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { hexToRgbA } from "@components/ui/settings/ColourRenderer";

export interface InputBoxButton {
    onClick: (input) => void;
    text: string;
    options?: {
        colour?: "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning" | undefined;
        variant?: "text" | "outlined" | "contained";
    };
    sx?: SxProps<Theme>;
}

export const InputBoxButton: React.ElementType = (props: InputBoxButton) => {
    const { colours, opacity } = useConfigStore((state) => ({
        colours: state.colours,
        opacity: state.browserWindow.opacity,
    }));

    return (
        <span className=' w-full h-full'>
            <Button
                variant={props?.options?.variant ?? "outlined"}
                sx={props?.sx}
                onClick={props.onClick}
                style={{
                    backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100),
                    color: colours.primaryColour,
                }}
                color={props?.options?.colour ?? "primary"}
            >
                {props.text}
            </Button>
        </span>
    );
};
