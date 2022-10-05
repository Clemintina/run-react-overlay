import React from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface UnderlinedTitle {
    text: string;
    options: {
        text: {
            size: number;
        };
    };
}

export const UnderlinedTitle: React.ElementType = (props: UnderlinedTitle) => {
    const { colours } = useConfigStore((state) => ({ colours: state.colours }));
    return (
        <div classN"me='underline"ext' style={{fontSize: props.options?.text?.size ?? 16, color: colours.primaryColour}}>
            {props.text}
        </div>
    );
};
