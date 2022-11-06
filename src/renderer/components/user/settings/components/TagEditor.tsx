import React from "react";
import {InputTextBox} from "@components/user/InputTextBox";

export interface TagEditor {
    onKeyDown?: (input: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (onExit) => void;
    onFocus?: (onFocus) => void;
    options?: {
        placeholder?: string;
        colour?: string;
        className?: string;
        label?: {
            text?: string;
        };
    };
}

export const TagEditor: React.ElementType = (props: TagEditor) => {
    return (
        <span className='bg-transparent'>
            <InputTextBox initialValue={props?.options?.placeholder} options={{placeholder: props?.options?.placeholder, value: props?.options?.placeholder, label: {text: props?.options?.label?.text ?? ""}}} onBlur={props.onBlur} onKeyDown={props.onKeyDown}
                          sx={{input: {color: `#${props?.options?.colour ?? "FFFFFF"}`}}} />
        </span>
    );
};
