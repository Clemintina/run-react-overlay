import React from "react";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface SettingCard {
    children: React.ReactElement | React.ReactElement[];
    options: {
        shown?: boolean;
    };
}

export const SettingCard: React.ElementType = (props: SettingCard) => {
    const {colours} = useConfigStore((state) => ({colours: state.colours}))
    const showSetting = props?.options?.shown ?? true;

    return (
        <div style={showSetting ? {} : {display: "none"}}>
            <div style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}}>
                <div className={"hover:border-cyan-500 hover:text-white border-transparent border-2"}>
                    <div className='grid grid-cols-3 gap-3 text-lg align-middle'>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
};
