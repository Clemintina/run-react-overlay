import React, {PropsWithChildren} from "react";
import {Player} from "@common/utils/PlayerUtils";
import Tooltip, {tooltipClasses, TooltipProps} from "@mui/material/Tooltip";
import {styled} from "@mui/material";
import store from "@renderer/store";

export interface OverlayTooltip {
    player: Player;
    tooltip: React.ReactNode;
    children?: React.ReactNode;
}

export const OverlayTooltip: React.FC<PropsWithChildren<OverlayTooltip>> = (props: OverlayTooltip) => {
    const player = props.player;
    const colours = store.getState().configStore.colours;
    const isPlayerNicked = player.nicked;

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
    let renderTooltip;

    if (isPlayerNicked || player.sources.runApi?.data.data.bot.tagged) {
        renderTooltip = props.children;
    } else {
        renderTooltip = (
            <CustomToolTip title={<React.Fragment>{props.tooltip}</React.Fragment>}>
                <div>{props.children}</div>
            </CustomToolTip>
        );
    }

    return (
        <div>
            <div>{renderTooltip}</div>
        </div>
    );
};
