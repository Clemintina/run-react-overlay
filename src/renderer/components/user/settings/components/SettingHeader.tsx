import React from "react";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface SettingHeader {
    children: React.ReactElement | React.ReactElement[];
    options: {
        shown?: boolean;
    };
}

export const SettingHeader: React.ElementType = (props: SettingHeader) => {
    const {colours} = useConfigStore((state) => ({colours: state.colours}))
    const showSetting = props?.options?.shown ?? true;

    return (
        <div style={showSetting ? {} : {display: "none"}}>
            <div style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}}>
                <div className={"hover:border-cyan-500 hover:text-white border-transparent border-2"}>
                    <div className='grid grid-cols-3 gap-3 text-lg text-center'>{props.children}</div>
                </div>
            </div>
        </div>
    );
};
