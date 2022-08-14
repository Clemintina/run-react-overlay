import React, {useState} from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import {useSelector} from "react-redux";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface InputTextBox {
    onKeyDown: (input: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (onExit) => void;
    onFocus?: (onFocus) => void;
    options?: {
        placeholder?: string;
        className?: string;
        value?: string;
    };
}

export const InputTextBox: React.ElementType = (props: InputTextBox) => {
    const {colours} = useConfigStore((state) => ({colours: state.colours}));

    const [isFocused, setIsFocused] = useState(false);
    const handleMouseOver = (event) => {
        event.currentTarget.style.color = `white`;
    };
    const handleMouseOut = (event) => {
        if (!isFocused) {
            event.currentTarget.style.border = `${colours.secondaryColour} 0px solid`;
            event.currentTarget.style.color = `${colours.primaryColour}`;
        }
    };

    return (
        <span className='hover:border-cyan-500 hover:border-2'>
            <input
                type='text'
                onKeyDown={props.onKeyDown}
                style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}}
                onFocus={(event) => {
                    event.currentTarget.style.color = `white`;
                    event.currentTarget.style.border = `${colours.secondaryColour} 1px solid`;
                    setIsFocused(true);
                    if (props.onFocus != undefined) props?.onFocus(event);
                }}
                onBlur={(event) => {
                    event.currentTarget.style.color = `${colours.primaryColour}`;
                    event.currentTarget.style.border = `${colours.secondaryColour} 0px solid`;
                    setIsFocused(false);
                    if (props.onBlur != undefined) props?.onBlur(event);
                }}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                placeholder={props?.options?.placeholder ?? ""}
                className={props?.options?.className ?? "underlineText"}
                defaultValue={props?.options?.value ?? ''}
            />
        </span>
    );
};
