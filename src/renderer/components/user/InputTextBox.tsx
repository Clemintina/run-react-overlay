import React, {FC, useEffect, useState} from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import {Box, SxProps, TextField} from "@mui/material";
import {jsx} from "@emotion/react";
import JSX = jsx.JSX;

export interface InputTextBox {
    onKeyDown?: (input, textField) => void;
    onKeyPressed?: (input, textField) => void;
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
        liveUpdate?: boolean;
        label?: {
            text?: string;
        };
        colour?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
        focused?: boolean;
    };
    icon?: JSX.Element;
    size?: "small" | "medium";
    error?: () => boolean;
    helperText?: string;
    initialValue?: string;
    sx?: SxProps;
}

export const InputTextBox: FC<InputTextBox> = (props: InputTextBox) => {
    const [getTextField, setTextField] = useState(props.options?.value ?? "");
    const [getError, setError] = useState(props?.error ?? false);
    const [isFocused, setFocus] = useState(props?.options?.focused ?? false);
    const standardProp: SxProps = {
        width: 1,
        "& label": {
            "&.Mui-focused": {
                backgroundColor: "#242424",
            },
        },
        ...props?.sx,
    };
    let colour = props?.options?.colour ?? "primary";

    useEffect(() => {
        setTextField(props?.options?.value ?? "");
    }, [props?.options?.value]);

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
                onFocus={(event) => {
                    if (props.initialValue != undefined && props?.initialValue?.length != 0) {
                        setTextField(props.initialValue);
                    }
                    if (props?.options?.focused == undefined) {
                        setFocus(true);
                    }
                    if (props.onFocus != undefined) props?.onFocus(event, getTextField);
                }}
                onBlur={(event) => {
                    if (props.onBlur != undefined) props?.onBlur(event, getTextField);
                    if (props?.options?.focused == undefined) {
                        setFocus(false);
                    }
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
                label={props?.options?.label?.text}
                error={getError}
                color={colour}
                helperText={props?.helperText ?? ""}
                onChange={(event) => {
                    setTextField(event.target.value);
                    if (props.onChange != undefined) props?.onChange(event, getTextField);
                }}
                focused={props?.options?.focused ?? isFocused}
            />
        </Box>
    );
};
