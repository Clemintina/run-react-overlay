import React, { useEffect, useState } from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { hexToRgbA } from "@components/ui/settings/ColourRenderer";
import { Box, SxProps, TextField } from "@mui/material";
import { jsx } from "@emotion/react";
import JSX = jsx.JSX;

export interface InputTextBox {
    onKeyDown?: (input, textField) => void;
    onBlur?: (onExit, textField) => void;
    onFocus?: (onFocus, textField) => void;
    onChange?: (onChange, textField) => void;
    options?: {
        placeholder?: string;
        className?: string;
        value?: string;
        resetOnEnter?: boolean;
        resetOnBlur?: boolean;
        clear?: boolean;
    };
    icon?: JSX.Element;
    size?: "small" | "medium";
    error?: () => boolean;
    helperText?: string;
    sx?: SxProps;
}

export const InputTextBox: React.ElementType = (props: InputTextBox) => {
    const { colours, opacity } = useConfigStore((state) => ({
        colours: state.colours,
        opacity: state.browserWindow.opacity,
    }));
    const [getTextField, setTextField] = useState(props.options?.value ?? "");
    const [getError, setError] = useState(props?.error ?? false);

    useEffect(() => {
        setTextField(props?.options?.value ?? "");
    }, [props?.options?.value]);

    const standardProp = {
        "& .MuiInput-underline:after": {
            borderBottomColor: "cyan",
        },
        width: 1,
        ...props?.sx,
    };

    return (
        <Box className='w-full'>
            <span>{props?.icon}</span>
            <TextField
                type='text'
                onKeyDown={(event) => {
                    if (props.onKeyDown != undefined) {
                        props?.onKeyDown(event, getTextField);
                        if (props?.error) {
                            setError(props.error);
                        }
                    }
                    if (event.key === "Enter" && props?.options?.resetOnEnter) {
                        setTextField("");
                    }
                }}
                style={{
                    backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100),
                    color: colours.primaryColour,
                }}
                onFocus={(event) => {
                    if (props.onFocus != undefined) props?.onFocus(event, getTextField);
                }}
                onBlur={(event) => {
                    if (props.onBlur != undefined) props?.onBlur(event, getTextField);
                    if (props?.options?.resetOnBlur) {
                        setTextField("");
                    }
                }}
                placeholder={props?.options?.placeholder ?? ""}
                className={props?.options?.className ?? ""}
                variant={"outlined"}
                size={props?.size ?? "small"}
                sx={standardProp}
                value={getTextField}
                error={getError}
                helperText={props?.helperText ?? ""}
                onChange={(event) => {
                    setTextField(event.target.value);
                    if (props.onChange != undefined) props?.onChange(event, getTextField);
                }}
            />
        </Box>
    );
};
