// eslint-disable-next-line import/named
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import React, { FC } from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import { styled, Switch, SwitchProps, Typography } from "@mui/material";
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

const AppleStyledSwitch = styled((props: SwitchProps) => <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />)(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: "#2ECA45",
                opacity: 1,
                border: 0,
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
            },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
            color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
        },
        "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.3,
        },
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 500,
        }),
    },
}));

export const ToggleButton: FC<ToggleButton> = (props: ToggleButton) => {
    const CustomToolTip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
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
    const { colours } = useConfigStore((state) => ({ colours: state.colours }));
    const message = props?.text ?? "";
    let tooltip: JSX.Element;

    const button = (
        <label className={props.className ?? "flex w-full"}>
            {message}
            <AppleStyledSwitch {...{ "aria-label": message }} onClick={props?.onClick ?? undefined} onChange={props?.onChange ?? undefined} checked={props.options.enabled} style={{ backgroundColor: colours.backgroundColour, color: colours.primaryColour }} />
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
