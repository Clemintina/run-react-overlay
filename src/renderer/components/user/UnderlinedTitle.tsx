import React, { FC } from "react";
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

export const UnderlinedTitle: FC<UnderlinedTitle> = (props: UnderlinedTitle) => {
    const { colours } = useConfigStore((state) => ({ colours: state.colours }));
    return (
        <div className="underline" style={{ fontSize: props.options?.text?.size ?? 16, color: colours.primaryColour }}>
            {props.text}
        </div>
    );
};
