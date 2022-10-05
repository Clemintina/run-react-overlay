import React from "react";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface SettingCard {
    children: React.ReactElement | React.ReactElement[];
    options: {
        shown?: boolean;
    };
}

export const SettingCard: React.ElementType = (props: SettingCard) => {
    const { colours, opacity } = useConfigStore((state) => ({ colours: state.colours, opacity: state.browserWindow.opacity }));
    const showSetting = props?.options?.shown ?? true;

    return (
        <div style={showSetting ? {} : {display: "none"}}>
            <div>
                <div className={"text-gray-400 hover:text-white"}>
                    <div className="grid grid-cols-3 gap-3 text-lg align-middle">{props.children}</div>
                </div>
            </div>
        </div>
    );
};
