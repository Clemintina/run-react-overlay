import React, { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, FilledInputProps, FormControl, InputLabel, InputProps, ListItemIcon, ListItemText, Menu, MenuItem, Modal, Select, Snackbar, styled, Switch, SwitchProps, SxProps, TextField, Theme, Tooltip, Typography } from "@mui/material";
import useConfigStore from "@renderer/store/ConfigStore";
import { hexToRgbA } from "@common/helpers";
import { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { Player } from "@common/utils/PlayerUtils";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";
import { CheckCircle, ExpandMore, MoreHorizRounded, ReportRounded, ShopRounded } from "@mui/icons-material";
import { SniperBody } from "@common/utils/externalapis/RunApi";
import axios from "axios";
import { PlayerCommonProperties } from "@components/PlayerComponents";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";

type CommonPropertyTypes = PropsWithChildren;

export type AppSnackbar = {
	message: string;
	timeout?: number;
	display?: boolean;
} & CommonPropertyTypes;

export type InputBoxButton = {
	onClick?: (input) => void;
	text: string | ReactNode;
	options?: {
		colour?: "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning";
		variant?: "text" | "outlined" | "contained";
		disabled?: boolean;
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
} & CommonPropertyTypes &
	PlayerMenuStateManager;

type PlayerMenuStateManager = {
	isOpen?: boolean;
	onClose?: (closed: boolean) => void;
};

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
		<Button
			variant={options?.variant ?? "outlined"}
			sx={sx}
			onClick={onClick}
			style={{
				backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100),
				color: colours.primaryColour,
			}}
			color={options?.colour ?? "primary"}
			disabled={options?.disabled ?? false}
		>
			{text}
		</Button>
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
			<div>{icon}</div>
			<TextField
				type="text"
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

	return <div className={"flex flex-col"}>{tooltip}</div>;
};

export const UserAccordion: FC<UserAccordion> = ({ name, children }) => {
	return (
		<Accordion>
			<AccordionSummary sx={{ backgroundColor: "transparent" }} expandIcon={<ExpandMore />} aria-controls={`${name}-content`} id={`${name}-header`}>
				<Typography className={"text-white"}>{name}</Typography>
			</AccordionSummary>
			<AccordionDetails>{children}</AccordionDetails>
		</Accordion>
	);
};

export const PlayerOptionsModal: FC<PlayerOptionsModal> = ({ data, isOpen, onClose, children }) => {
	const { colours, run } = useConfigStore((state) => ({ colours: state.colours, run: state.run }));

	const [open, setOpen] = useState(isOpen ?? false);
	const [reportType, setReportType] = useState("");
	const [reportReason, setReportReason] = useState("");
	const [successful, setSuccessful] = useState<boolean>(false);
	const [axiosError, setError] = useState<boolean>(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		if (onClose) {
			onClose(open);
		}
	};

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

	if (data.nicked) {
		return <span />;
	}

	const playerUsername = data.hypixelPlayer?.displayname ?? "Unknown";

	// TODO Add player options
	return (
		<div>
			{open ? (
				<Modal open={open} onClose={handleClose} style={{ color: colours.primaryColour }}>
					<Box sx={style}>
						<div className={"py-2"}>
							<FormControl fullWidth>
								<InputLabel>Report Type</InputLabel>
								<Select value={reportType} label="Client" onChange={(event) => setReportType(event.target.value)}>
									<MenuItem value={"cheating_blatant"}>Blatant Cheating</MenuItem>
									<MenuItem value={"cheating_closet"}>Closet Cheating</MenuItem>
									<MenuItem value={"sniping"}>Sniping</MenuItem>
									<MenuItem value={"bot"}>Botting</MenuItem>
									<MenuItem value={"sniping_potential"}>Potential Sniper</MenuItem>
								</Select>
								<div className={"pt-4"}>
									<InputTextBox helperText={"Your API Key will be used to identify you and any abuse will result in termination of your key."} options={{ placeholder: "Why are you reporting this player?", label: { text: "Report reason" } }}
									              onBlur={(event) => setReportReason(event.target.value)} />
								</div>
								<div className={"pt-4"}>
									<InputBoxButton
										text={
											<div>
												<ReportRounded /> {`Report ${playerUsername}`}
											</div>
										}
										onClick={async () => {
											if (reportType.length > 2 && "hypixelPlayer" in data && run.apiKey.toLowerCase() != "public" && run.valid && reportReason.length > 2) {
												const report: SniperBody = {
													uuid: data.hypixelPlayer.uuid,
													reason: reportReason,
													report_type: reportType,
													apikey: run.apiKey
												};
												try {
													const response = await axios.post("https://antisniper.seraph.si/v4/addsniper", report, {
														validateStatus: () => true,
														headers: {
															"run-api-key": run.apiKey,
															"Accept-Encoding": "gzip,deflate,compress"
														}
													});
													if (response.status != 200) {
														useConfigStore.getState().setErrorMessage({
															title: "Report error",
															cause: JSON.stringify(response.data),
															type: "ERROR"
														});
														setError(true);
													} else {
														setSuccessful(true);
													}
												} catch (e) {
													useConfigStore.getState().setErrorMessage({
														title: "Report error",
														cause: "Timed out",
														type: "ERROR"
													});
													setError(true);
												}
											}
										}}
										options={{ colour: "error", disabled: run.apiKey.toLowerCase() == "public" }}
									/>
									{successful ? (
										<div className={"text-green-500 pt-3"}>
											Completed <CheckCircle />
										</div>
									) : (
										<span />
									)}
									{axiosError ? <div className={"text-red-500 pt-3"}>Error</div> : <span />}
								</div>
							</FormControl>
						</div>
					</Box>
				</Modal>
			) : (
				<span />
			)}
		</div>
	);
};

export const PlayerQuickBuyModal: FC<PlayerOptionsModal> = ({ data, isOpen, onClose, children }) => {
	if (data.nicked) {
		return <span />;
	}

	const { colours } = useConfigStore((state) => ({
		colours: state.colours
	}));

	const [open, setOpen] = useState(isOpen ?? false);

	const handleClose = () => {
		setOpen(false);
		if (onClose) {
			onClose(open);
		}
	};

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
		color: colours.primaryColour
	};

	// TODO Add player options
	return (
		<div>
			{open ? (
				<Modal open={open} onClose={handleClose} style={{ color: colours.primaryColour }}>
					<Box sx={style}>
						<img src={`https://api.polsu.xyz/assets/bedwars/quickbuy/${data.hypixelPlayer.uuid}.png`} alt={"Polsu Quickbuy"} />
					</Box>
				</Modal>
			) : (
				<span />
			)}
		</div>
	);
};

export const PlayerMenuOption: FC<PlayerCommonProperties> = ({ player }) => {
	const ITEM_HEIGHT = 48;
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [isPlayerReportModalOpen, setPlayerReportModalOpen] = useState<boolean>(false);
	const [isPlayerQuickbuyModalOpen, setPlayerQuickbuyModalOpen] = useState<boolean>(false);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (optionSelected?: "report" | "quickbuy") => {
		setAnchorEl(null);
		if (optionSelected == "report") setPlayerReportModalOpen(true);
		else if (optionSelected == "quickbuy") setPlayerQuickbuyModalOpen(true);
	};

	return (
		<>
			<div className={"text-center text-white"}>
				<MoreHorizRounded onClick={handleClick} />
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={() => handleClose()}
					PaperProps={{
						style: {
							maxHeight: ITEM_HEIGHT * 4.5,
							width: "20ch"
						},
					}}
				>
					<MenuItem onClick={() => handleClose("report")}>
						<ListItemIcon>
							<ReportRounded />
						</ListItemIcon>
						<ListItemText>Report</ListItemText>
					</MenuItem>
					<MenuItem onClick={() => handleClose("quickbuy")}>
						<ListItemIcon>
							<ShopRounded />
						</ListItemIcon>
						<ListItemText>Quickbuy</ListItemText>
					</MenuItem>
				</Menu>
			</div>
			{isPlayerReportModalOpen ? <PlayerOptionsModal data={player} isOpen={isPlayerReportModalOpen} onClose={() => setPlayerReportModalOpen(false)} /> : <span />}
			{isPlayerQuickbuyModalOpen ? <PlayerQuickBuyModal data={player} isOpen={isPlayerQuickbuyModalOpen} onClose={() => setPlayerQuickbuyModalOpen(false)} /> : <span />}
		</>
	);
};
