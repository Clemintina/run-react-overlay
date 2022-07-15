import React from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";

export interface InputBoxButton {
    onClick: (input) => void;
    text: string;
}

export const InputBoxButton: React.ElementType = (props: InputBoxButton) => {
    const colours = useSelector(() => store.getState().configStore.colours);
    return (
        <button onClick={props.onClick} style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}}>
            {props.text}
        </button>
    );
};
