import React, {useState} from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import {useSelector} from "react-redux";
import store from "@renderer/store";

export interface InputTextBox {
    onKeyDown: (input: React.KeyboardEvent<HTMLInputElement>) => void;
    options: {
        placeholder: string;
        className: string;
    };
}

export const InputTextBox: React.ElementType = (props: InputTextBox) => {
    const colours = useSelector(() => store.getState().configStore.colours);

    const [isHovering, setIsHovering] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const handleMouseOver = (event) => {
        event.currentTarget.style.border = `${colours.secondaryColour} 1px solid`;
        event.currentTarget.style.color = `white`;
        setIsHovering(true);
    };
    const handleMouseOut = (event) => {
        if (!isFocused) {
            event.currentTarget.style.border = `${colours.secondaryColour} 0px solid`;
            event.currentTarget.style.color = `${colours.primaryColour}`;
        }
        setIsHovering(false);
    };

    return (
        <span className={props?.options?.className}>
            <input
                type='text'
                onKeyDown={props.onKeyDown}
                style={{backgroundColor: `${colours.backgroundColour}`, color: `${colours.primaryColour}`}}
                onFocus={(event) => {
                    event.currentTarget.style.color = `white`;
                    event.currentTarget.style.border = `${colours.secondaryColour} 1px solid`;
                    setIsFocused(true);
                }}
                onBlur={(event) => {
                    event.currentTarget.style.color = `${colours.primaryColour}`;
                    event.currentTarget.style.border = `${colours.secondaryColour} 0px solid`;
                    setIsFocused(false);
                }}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                placeholder={props?.options?.placeholder ?? ""}
                className={props?.options?.className ?? "underline"}
            />
        </span>
    );
};
