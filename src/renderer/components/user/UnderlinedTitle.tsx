import React from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import {useSelector} from "react-redux";
import store from "@renderer/store";

export interface UnderlinedTitle {
    text: string;
    options: {
        text: {
            size: number;
        };
    };
}

export const UnderlinedTitle: React.ElementType = (props: UnderlinedTitle) => {
    const colours = useSelector(() => store.getState().configStore.colours);
    return (
        <div className='underlineText' style={{fontSize: props.options?.text?.size ?? 16, backgroundColor: colours.backgroundColour, color: colours.primaryColour}}>
            {props.text}
        </div>
    );
};
