import React from "react";
import { Box } from "@mui/material";

export interface SettingCard {
    children: React.ReactElement | React.ReactElement[];
    options: {
        shown?: boolean;
    };
}

export const SettingCard: React.ElementType = (props: SettingCard) => {
    const showSetting = props?.options?.shown ?? true;

    return (
        <Box style={showSetting ? {} : { display: "none" }}>
            <div className={"text-gray-400 hover:text-white pb-2"}>
                <div className="grid grid-cols-3 gap-3 text-lg align-middle">{props.children}</div>
            </div>
        </Box>
    );
};
