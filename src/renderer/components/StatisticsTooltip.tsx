import React, {PropsWithChildren} from "react";
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
            // backgroundColor: colours.backgroundColour,
            backgroundColor: "#120211",
            color: colours.primaryColour,
            padding: "5px",
            paddingBottom: "3px",
            borderRadius: "5px",
            border: "1px solid #25015b",
            lineHeight: "17px",
            left: "350px",
            paddingRight: "12px",
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(16),
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
