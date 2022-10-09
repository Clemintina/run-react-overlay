import React from "react";
import { TextField } from "@mui/material";

export interface TagEditor {
    onKeyDown?: (input: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (onExit) => void;
    onFocus?: (onFocus) => void;
    options?: {
        placeholder?: string;
        colour?: string;
        className?: string;
    };
}

export const TagEditor: React.ElementType = (props: TagEditor) => {
    return (
        <span className="bg-transparent">
            <TextField variant={"outlined"} sx={{ input: { color: `#${props?.options?.colour ?? "FFFFFF"}` } }}
                       onKeyDown={props.onKeyDown} placeholder={props?.options?.placeholder ?? ""}
                       className={props?.options?.className ?? ""} defaultValue={props?.options?.placeholder ?? ""}
                       onBlur={props.onBlur} size={"small"} />
        </span>
    );
};
