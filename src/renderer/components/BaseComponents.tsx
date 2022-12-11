import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, FilledInputProps, InputLabel, InputLabelProps, InputProps, Modal, Snackbar, styled, Switch, SwitchProps, SxProps, TextField, Theme, Typography } from "@mui/material";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import Button from "@mui/material/Button";
import { hexToRgbA } from "@common/helpers";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Player } from "@common/utils/PlayerUtils";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputProps as StandardInputProps } from "@mui/material/Input/Input";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";

type CommonPropertyTypes = PropsWithChildren;

export type AppSnackbar = {
	message: string;
	timeout?: number;
	display?: boolean;
} & CommonPropertyTypes;

export type InputBoxButton = {
	onClick?: (input) => void;
	text: string;
	options?: {
		colour?: "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning" | undefined;
		variant?: "text" | "outlined" | "contained";
	};
	sx?: SxProps<Theme>;
} & CommonPropertyTypes;

export type InputTextBox = {
	onKeyDown?: (input, textField) => void;
	onKeyPressed?: (input, textField) => void;
	onBlur?: (onExit, textField) => void;
	onFocus?: (onFocus, textField) => void;
	onChange?: (onChange, textField) => void;
	options?: {
		placeholder?: string;
		className?: string;
		value?: string;
		resetOnEnter?: boolean;
		resetOnBlur?: boolean;
		clear?: boolean;
		liveUpdate?: boolean;
		label?: {
			text?: string;
		};
		colour?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
		focused?: boolean;
	};
	icon?: JSX.Element;
	size?: "small" | "medium";
	error?: () => boolean;
	helperText?: string;
	initialValue?: string;
	sx?: SxProps;
	inputProps?: Partial<OutlinedInputProps> | Partial<FilledInputProps> | Partial<InputProps>;
} & CommonPropertyTypes;

export type ToggleButton = {
	onClick?: (input) => void;
	onChange?: (input) => void;
	className?: string;
	text?: string;
	onHover?: JSX.Element;
	onHoverTitle?: JSX.Element;
	options: {
		text?: {
			size?: number;
		};
		enabled: boolean;
	};
} & CommonPropertyTypes;

export type UserAccordion = {
	name: string;
} & CommonPropertyTypes;

export type PlayerOptionsModal = {
	data: Player;
} & CommonPropertyTypes;

export const AppSnackbar: FC<AppSnackbar> = ({ display, timeout, message }) => {
	const [open, setOpen] = useState(display ?? false);

	const handleClick = () => {
		setOpen(true);
	};
	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	return (
		<Snackbar open={open} onClose={handleClose} autoHideDuration={timeout ?? 6000}>
			<Alert severity={"success"} sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export const InputBoxButton: FC<InputBoxButton> = ({ sx, text, options, onClick }) => {
	const { colours, opacity } = useConfigStore((state) => ({
		colours: state.colours,
		opacity: state.browserWindow.opacity,
	}));

	return (
		<span className=' w-full h-full'>
			<Button
				variant={options?.variant ?? "outlined"}
				sx={sx}
				onClick={onClick}
				style={{
					backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100),
					color: colours.primaryColour,
				}}
				color={options?.colour ?? "primary"}
			>
				{text}
			</Button>
		</span>
	);
};

export const InputTextBox: FC<InputTextBox> = ({ options, inputProps, helperText, icon, onBlur, sx, initialValue, error, onFocus, size, onKeyDown, onKeyPressed, onChange }) => {
	const [getTextField, setTextField] = useState(options?.value ?? "");
	const [getError, setError] = useState(error ?? false);
	const [isFocused, setFocus] = useState(options?.focused ?? false);
	const standardProp: SxProps = {
		width: 1,
		"& label": {
			"&.Mui-focused": {
				backgroundColor: "#242424",
			},
		},
		...sx,
	};
	let colour = options?.colour ?? "primary";

	useEffect(() => {
		setTextField(options?.value ?? "");
	}, [options?.value]);

	return (
		<Box className='w-full'>
			<span>{icon}</span>
			<TextField
				type='text'
				onKeyDown={(event) => {
					if (onKeyDown) {
						onKeyDown(event, getTextField);
						if (error) {
							setError(error);
						}
					}
					if (event.key === "Enter" && options?.resetOnEnter) {
						setTextField("");
					}
				}}
				onFocus={(event) => {
					if (initialValue != undefined && initialValue?.length != 0) {
						setTextField(initialValue);
					}
					if (options?.focused == undefined) {
						setFocus(true);
					}
					if (onFocus) onFocus(event, getTextField);
				}}
				onBlur={(event) => {
					if (onBlur) onBlur(event, getTextField);
					if (options?.focused == undefined) {
						setFocus(false);
					}
					if (options?.resetOnBlur) {
						setTextField("");
					}
				}}
				placeholder={options?.placeholder ?? ""}
				className={options?.className ?? ""}
				variant={"outlined"}
				size={size ?? "small"}
				sx={standardProp}
				value={getTextField}
				label={options?.label?.text}
				error={getError}
				color={colour}
				helperText={helperText ?? ""}
				onChange={(event) => {
					setTextField(event.target.value);
					if (onChange) onChange(event, getTextField);
				}}
				focused={options?.focused ?? isFocused}
				InputProps={inputProps}
			/>
		</Box>
	);
};

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

export const ToggleButton: FC<ToggleButton> = ({ text, options, onClick, onChange, onHover, onHoverTitle, className, children }) => {
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
	const message = text ?? "";
	let tooltip: JSX.Element;

	const button = (
		<label className={className ?? "flex w-full"}>
			{message}
			<AppleStyledSwitch {...{ "aria-label": message }} onClick={onClick ?? undefined} onChange={onChange ?? undefined} checked={options.enabled} style={{ backgroundColor: colours.backgroundColour, color: colours.primaryColour }} />
			{children}
		</label>
	);

	if (onHover != undefined) {
		tooltip = (
			<CustomToolTip
				className={"text-red-500"}
				title={
					<React.Fragment>
						<Typography>{onHoverTitle ?? <span />}</Typography>
						{onHover ?? <span />}
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

export const UserAccordion: FC<UserAccordion> = ({ name, children }) => {
	return (
		<div>
			<Accordion>
				<AccordionSummary sx={{ backgroundColor: "transparent" }} expandIcon={<ExpandMoreIcon />} aria-controls={`${name}-content`} id={`${name}-header`}>
					<Typography className={"text-gray-400"}>{name}</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ backgroundColor: "transparent" }}>{children}</AccordionDetails>
			</Accordion>
		</div>
	);
};

export const PlayerOptionsModal: FC<PlayerOptionsModal> = ({ data, children }) => {
	const { colours } = useConfigStore((state) => ({ colours: state.colours }));

	const [open, setOpen] = useState(false);
	const [reportType, setReportType] = useState("");
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: window.innerWidth / 1.2,
		bgcolor: colours.backgroundColour,
		border: `2px solid ${colours.primaryColour}`,
		boxShadow: 24,
		p: 4,
		color: colours.primaryColour,
	};

	// TODO Add player options
	return (
		<div>
			<InputBoxButton onClick={handleOpen} text={"..."} sx={{ height: 20, width: 10, padding: 2 }} />
			<Modal open={open} onClose={handleClose} style={{ color: colours.primaryColour }}>
				<Box sx={style}>
					<div className='p-8'>
						<div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-2'>
							<span>
								<FormControl fullWidth>
									<InputLabel>Report Type</InputLabel>
									<Select value={reportType} label='Client' onChange={(event) => setReportType(event.target.value)}>
										<MenuItem value={"cheating_blatant"}>Blatant Cheating</MenuItem>
										<MenuItem value={"cheating_closet"}>Closet Cheating</MenuItem>
										<MenuItem value={"sniping"}>Sniping</MenuItem>
										<MenuItem value={"bot"}>Botting</MenuItem>
										<MenuItem value={"sniping_potential"}>Potential Sniper</MenuItem>
									</Select>
								</FormControl>
							</span>
							<InputBoxButton text={"Report this player"} />
						</div>
					</div>
				</Box>
			</Modal>
		</div>
	);
};
