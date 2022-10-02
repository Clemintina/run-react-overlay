// eslint-disable-next-line import/named
import Tooltip, {tooltipClasses, TooltipProps} from "@mui/material/Tooltip";
import React from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import {Checkbox, styled, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface ToggleButton {
    onClick?: (input) => void;
    onChange?: (input) => void;
    className?: string;
    text?: string;
    children?: JSX.Element;
    onHover?: JSX.Element;
    onHoverTitle?: JSX.Element;
    options: {
        text?: {
            size?: number;
        };
        enabled: boolean;
    };
}

export const ToggleButton: React.ElementType = (props: ToggleButton) => {
    const CustomToolTip = styled(({className, ...props}: TooltipProps) => <Tooltip {...props} classes={{popper: className}} />)(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: colours.backgroundColour,
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
    const {colours} = useConfigStore((state) => ({colours: state.colours}))
    const message = props?.text ?? "";
    let tooltip: JSX.Element;

    const button = (
        <label className={props.className ?? "flex w-full"}>
            {message}
            <Checkbox {...{"aria-label": message}} icon={<VisibilityOff />} checkedIcon={<Visibility />} onClick={props?.onClick ?? undefined} onChange={props?.onChange ?? undefined} checked={props.options.enabled} style={{backgroundColor: colours.backgroundColour, color: colours.primaryColour}} />
            {props.children}
        </label>
    );

    if (props.onHover != undefined) {
        tooltip = (
            <CustomToolTip
                className={"text-red-500"}
                title={
                    <React.Fragment>
                        <Typography>{props.onHoverTitle ?? <span />}</Typography>
                        {props.onHover ?? <span />}
                    </React.Fragment>
                }
            >
                <span>{button}</span>
            </CustomToolTip>
        );
    } else {
        tooltip = <span>{button}</span>;
    }

    return <div className={"flex flex-col w-full"}>{tooltip}</div>;
};
