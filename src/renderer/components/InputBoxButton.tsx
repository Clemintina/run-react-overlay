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
        <button onClick={props.onClick} style={{backgroundColor: "#242424ff", color: `${store.getState().configStore.colours.primaryColour}`}}>
            {props.text}
        </button>
    );
};
