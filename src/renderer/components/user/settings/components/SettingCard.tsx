import React from "react";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {hexToRgbA} from "@components/ui/settings/ColourRenderer";

export interface SettingCard {
    children: React.ReactElement | React.ReactElement[];
    options: {
        shown?: boolean;
    };
}

export const SettingCard: React.ElementType = (props: SettingCard) => {
    const {colours,opacity} = useConfigStore((state) => ({colours: state.colours, opacity: state.browserWindow.opacity}))
    const showSetting = props?.options?.shown ?? true;

    return (
        <div style={showSetting ? {} : {display: "none"}}>
            <div style={{backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100), color: colours.primaryColour}}>
                <div className={" hover:text-white border-transparent border-2"}>
                    <div className='grid grid-cols-3 gap-3 text-lg align-middle'>{props.children}</div>
                </div>
            </div>
        </div>
    );
};
