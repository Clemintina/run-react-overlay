import React, {PropsWithChildren, useState} from "react";
import {Player} from "@common/utils/PlayerUtils";
import Tooltip, {tooltipClasses, TooltipProps} from "@mui/material/Tooltip";
import {styled} from "@mui/material";
import store from "@renderer/store";

export interface StatisticsTooltip {
    player: Player;
    children?: React.ReactNode;
}

export const StatsisticsTooltip: React.FC<PropsWithChildren<StatisticsTooltip>> = (props: StatisticsTooltip) => {
    const player = props.player;
    const colours = store.getState().configStore.colours;

    const CustomToolTip = styled(({className, ...props}: TooltipProps) => <Tooltip {...props} classes={{popper: className}} />)(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: colours.backgroundColour,
            color: colours.primaryColour,
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
        },
    }));

    return (
        <div>
            <div>
                <CustomToolTip
                    title={
                        <React.Fragment>
                            <div>{player.name}</div>
                        </React.Fragment>
                    }
                >
                    <div>{props.children}</div>
                </CustomToolTip>
            </div>
        </div>
    );
};
