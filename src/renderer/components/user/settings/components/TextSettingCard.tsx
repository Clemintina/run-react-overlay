import React from "react";
import { Box } from "@mui/material";

export interface TextSettingCard {
    children: React.ReactElement | React.ReactElement[];
    options: {
        shown?: boolean;
    };
}

export const TextSettingCard: React.ElementType = (props: TextSettingCard) => {
    const showSetting = props?.options?.shown ?? true;

    return (
        <Box style={showSetting ? {} : { display: "none" }}>
            <div className={"text-gray-400 hover:text-white pb-3"}>
                <div className='grid grid-cols-2 gap-3'>{props.children}</div>
            </div>
        </Box>
    );
};
