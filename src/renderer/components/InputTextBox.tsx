import React from "react";

export interface InputTextBox {
    onKeyDown: (input: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputTextBox: React.ElementType = (props: InputTextBox) => {
    return (
        <input
            type='text'
            onKeyDown={props.onKeyDown}
            style={{backgroundColor: "#242424ff", color: "grey"}}
            onFocus={(event) => {
                event.currentTarget.style.color = "white";
            }}
        />
    );
};
