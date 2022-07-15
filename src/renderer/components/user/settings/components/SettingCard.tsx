import React from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";

export interface SettingCard {
    children: React.ReactElement | React.ReactElement[];
    options: {
        shown?: boolean;
    };
}

export const SettingCard: React.ElementType = (props: SettingCard) => {
    const colours = useSelector(() => store.getState().configStore.colours);
    const showSetting = props?.options?.shown ?? true;

    return (
        <div style={showSetting ? {} : {display: "none"}}>
            <div style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}}>
                <div className={"hover:border-cyan-500 hover:text-white border-transparent border-2"}>
                    <div className='grid grid-cols-3 gap-3 text-lg'>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
};
