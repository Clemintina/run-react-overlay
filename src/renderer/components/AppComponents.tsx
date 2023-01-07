import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import useConfigStore from "@renderer/store/ConfigStore";
import { Box, Fade, FormControlLabel, FormHelperText, FormLabel, Input, InputLabel, Modal, Radio, RadioGroup, SelectChangeEvent, Typography } from "@mui/material";
import { ClientSetting } from "@common/utils/Schemas";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputBoxButton, InputTextBox } from "@components/BaseComponents";
import { HexColorPicker } from "react-colorful";
import { hexToRgbA } from "@common/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Colour, TagArray } from "@common/utils/TagSchema";
import { IHeaderParams } from "ag-grid-community";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type CommonProperties = {
	className?: string;
} & PropsWithChildren;

export type LogSelectorModal = CommonProperties;

export type FeedbackForm = {
	onChange?: (event: any | undefined) => void;
	options?: {
		text?: string;
		formHelper?: string;
	};
} & CommonProperties;

export type ColourPicker = {
	setColour: (colour: string) => void;
	text?: string;
	colourObject?: string | Array<Colour>;
	className?: string;
} & CommonProperties;

export type ColourPickerArray = {
	setColour: (colour: Colour) => void;
	text?: string;
	colourObject: TagArray;
} & CommonProperties;

export type SettingCard = {
	options?: {
		shown?: boolean;
	};
} & CommonProperties;

export type SettingHeader = {
	options?: {
		shown?: boolean;
	};
} & CommonProperties;

export type ValidationIcon = {
	valid: boolean;
} & CommonProperties;

export type TextSettingCard = {
	options?: {
		shown?: boolean;
	};
} & CommonProperties;

export type TagEditor = {
	onKeyDown?: (input: React.KeyboardEvent<HTMLInputElement>) => void;
	onBlur?: (onExit) => void;
	onFocus?: (onFocus) => void;
	options?: {
		placeholder?: string;
		colour?: string | Colour | Array<Colour>;
		className?: string;
		label?: {
			text?: string;
		};
	};
} & CommonProperties;

export type ContactStaff = CommonProperties;

export interface ICustomHeader extends IHeaderParams {}

export const LogSelectorModal: FC<LogSelectorModal> = ({ children }) => {
	const { logs, colours, error } = useConfigStore((state) => ({
		logs: state.logs,
		colours: state.colours,
		error: state.error,
	}));
	const [open, setOpen] = React.useState<boolean>(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [clientLocal, setClientLocal] = useState<string>(logs.clientName);

	const handleChange = async (event: SelectChangeEvent) => {
		const clientSettings: ClientSetting = {
			clientName: event.target.value,
			readable: false,
			logPath: "",
		};
		setClientLocal(clientSettings.clientName);

		const appData = (await window.ipcRenderer.invoke<string>(IpcValidInvokeChannels.GET_FILE_PATH, ["appData"])).data;
		const userHome = (await window.ipcRenderer.invoke<string>(IpcValidInvokeChannels.GET_FILE_PATH, ["home"])).data;

		const isMacOs = appData.includes("Application Support");

		if (clientSettings.clientName != "custom") {
			let path = "";
			switch (clientSettings.clientName) {
				case "vanilla":
					path += isMacOs ? appData + "/minecraft/logs/" : appData + "/.minecraft/logs/";
					break;
				case "badlion":
					path += isMacOs ? appData + "/minecraft/logs/blclient/minecraft/" : appData + "/.minecraft/logs/blclient/minecraft/";
					break;
				case "lunar_mlv":
					path += userHome + "/.lunarclient/offline/multiver/logs/";
					break;
			}
			path += "latest.log";
			clientSettings.logPath = path;
			const readable = await window.ipcRenderer.invoke<boolean>(IpcValidInvokeChannels.IS_FILE_READABLE, [clientSettings.logPath]);
			if (readable.data) {
				clientSettings.readable = readable.data;
				window.ipcRenderer.send("logFileSet", clientSettings.logPath);
				useConfigStore.getState().setLogs(clientSettings);
			} else {
				useConfigStore.getState().setErrorMessage({
					code: 400,
					title: "Bad Log file",
					cause: "The file set is invalid.",
					detail: "Please try and set the client again if you're on a Mac, Ensure the Overlay has sufficient privileges to read the file.",
					referenceId: "Unable to read log file.",
					type: "ERROR",
				});
			}
		}
	};

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: colours.backgroundColour,
		border: `2px solid ${colours.primaryColour}`,
		boxShadow: 24,
		p: 4,
		color: colours.primaryColour,
	};

	return (
		<div>
			<InputBoxButton onClick={handleOpen} text={clientLocal} options={{ colour: logs.readable ? "success" : "error" }} />
			<Modal
				className={"rounded"}
				open={open}
				onClose={handleClose}
				style={{ color: colours.primaryColour }}
				sx={{
					borderRadius: "25px",
				}}
			>
				<Fade in={open}>
					<Box sx={style}>
						<Typography sx={{ mt: 0 }}>Please select the client you use</Typography>
						<Typography sx={{ mt: 2 }}>
							<FormControl fullWidth color={logs.readable ? "success" : "error"}>
								<InputLabel>Client</InputLabel>
								<Select value={clientLocal} label='Client' onChange={handleChange}>
									<MenuItem value={"vanilla"}>Vanilla / Forge</MenuItem>
									<MenuItem value={"badlion"}>Badlion</MenuItem>
									<MenuItem value={"lunar_mlv"}>Lunar</MenuItem>
									<MenuItem value={"custom"}>Custom</MenuItem>
								</Select>
								<FormHelperText className={"text-red-500 font-bold"} style={error.code !== 201 ? {} : { display: "none" }}>
									Un-readable log file
								</FormHelperText>
							</FormControl>
						</Typography>

						<Typography sx={{ mt: 2 }} style={clientLocal == "custom" ? {} : { display: "none" }}>
							<InputBoxButton
								onClick={async () => {
									const path: Electron.OpenDialogReturnValue = await window.ipcRenderer.invoke(IpcValidInvokeChannels.SELECT_LOG_FILE, [[{ name: "Logs", extensions: ["log"] }]]);
									if (path.filePaths[0] !== undefined) {
										const logPath = path.filePaths[0];
										const readable = await window.ipcRenderer.invoke<boolean>(IpcValidInvokeChannels.IS_FILE_READABLE, [logPath]);
										if (readable.data) {
											window.ipcRenderer.send("logFileSet", logPath);
											const clientSettings: ClientSetting = {
												clientName: "custom",
												readable: true,
												logPath: logPath,
											};
											useConfigStore.getState().setLogs(clientSettings);
										} else {
											useConfigStore.getState().setErrorMessage({
												code: 400,
												title: "Bad Log file",
												cause: "The file set is invalid.",
												detail: "Please try and set the client again if you're on a Mac and ensure the Overlay has sufficient privileges to read the file.",
												referenceId: "Unable to read log file.",
												type: "ERROR",
											});
										}
									}
								}}
								options={{ colour: logs.readable ? "success" : "error" }}
								text={"Select Log File"}
							/>
						</Typography>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
};

export const FeedbackForm: FC<FeedbackForm> = ({ options, children, onChange }) => {
	return (
		<FormControl>
			<InputLabel htmlFor='overlay-feedback'>{options?.text ?? ""}</InputLabel>
			<Input id='overlay-feedback' aria-describedby='overlay-feedback-text' onChange={onChange} />
			<FormHelperText id='overlay-feedback-text'>{options?.formHelper ?? ""}</FormHelperText>
		</FormControl>
	);
};

export const ColourPicker: FC<ColourPicker> = ({ setColour, text, colourObject, className, children }) => {
	const { colours } = useConfigStore((state) => ({ colours: state.colours }));

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [colour, setStateColour] = useState("#" + colourObject ?? "242424");

	const handleChange = (event) => {
		setStateColour(event);
		setColour(event.replace("#", ""));
	};

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		bgcolor: colours.backgroundColour,
		border: `2px solid ${colour}`,
		boxShadow: 24,
		p: 4,
		color: colours.primaryColour,
	};

	return (
		<div className={className ?? ""}>
			<InputBoxButton onClick={handleOpen} text={text ?? "Pick!"} />
			<Modal open={open} onClose={handleClose} style={{ color: colours.primaryColour }}>
				<Box sx={style}>
					<HexColorPicker color={colour} onChange={handleChange} />
				</Box>
			</Modal>
		</div>
	);
};

export const ColourPickerArray: FC<ColourPickerArray> = ({ colourObject, setColour, children, text }) => {
	// @ts-ignore
	let originalColourArray = colourObject?.colour != undefined ? "colour" : "colours";
	const { colours } = useConfigStore((state) => ({ colours: state.colours }));

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		if (arrayItem.colour.length == 6 && arrayItem.requirement != 0) {
			setColour(arrayItem);
		}
	};

	const [arrayItem, setArrayItem] = useState({ colour: "", requirement: 0, operator: "<=" });
	const [customColour, setCustomColour] = useState("242424");
	const [defaultValue, setDefaultValue] = useState(colourObject[originalColourArray][0].requirement);

	const getArrayDetails = () => {
		const resp: Array<JSX.Element> = [];
		const arr = [...colourObject[originalColourArray]];
		arr.sort((a, b) => a.requirement - b.requirement);
		for (const obj of arr) {
			resp.push(
				<div key={obj.requirement} className={"grid grid-cols-4 gap-2 text-lg align-middle"}>
					<FormControlLabel value={obj.requirement} control={<Radio />} label={""} />
					<span>{obj.requirement}</span>
					<span>{obj.operator}</span>
					<span style={{ color: "#" + obj.colour }}>{obj.colour}</span>
					<span></span>
				</div>,
			);
		}
		return resp;
	};

	const handleChange = (event: string) => {
		event = event.replace("#", "");
		setCustomColour(event);
		arrayItem.colour = event;
		if (arrayItem.colour.length == 6 && arrayItem.requirement != 0) {
			setColour(arrayItem);
		}
	};

	const handleRadioChange = (event: React.ChangeEvent) => {
		const radioNumber = Number.parseInt((event.target as HTMLInputElement).value);
		if (arrayItem.colour.length == 6 && arrayItem.requirement != 0) {
			setColour(arrayItem);
		}
		colourObject[originalColourArray].map((arrayItem) => {
			if (arrayItem.requirement == radioNumber) {
				setDefaultValue(arrayItem.requirement);
				setCustomColour(`#${arrayItem.colour}`);
			}
		});
		setArrayItem({
			requirement: Number.parseInt((event.target as HTMLInputElement).value),
			colour: "",
			operator: "<=",
		});
	};

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		bgcolor: colours.backgroundColour,
		border: `2px solid #${customColour}`,
		boxShadow: 24,
		p: 4,
		color: colours.primaryColour,
	};

	const colourArrayData = getArrayDetails();

	return (
		<div>
			<InputBoxButton onClick={handleOpen} text={text ?? "Pick!"} />
			<Modal open={open} onClose={handleClose} style={{ color: colours.primaryColour }}>
				<Box sx={style}>
					<FormControl>
						<FormLabel id={"colour-array"}>Select which item you'd like to edit</FormLabel>
						<RadioGroup defaultValue={defaultValue} onChange={handleRadioChange}>
							{colourArrayData}
						</RadioGroup>
					</FormControl>
					<div className={"grid place-items-center"}>
						<HexColorPicker onChange={handleChange} color={`#${customColour}`} />
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export const SettingCard: FC<SettingCard> = ({ options, children, className }) => {
	const showSetting = options?.shown ?? true;

	return (
		<Box style={showSetting ? {} : { display: "none" }}>
			<div className={`text-gray-400 hover:text-white pb-3 ${className}`}>
				<div className='grid grid-cols-3 gap-3 text-lg align-middle'>{children}</div>
			</div>
		</Box>
	);
};

export const SettingHeader: FC<SettingHeader> = ({ options, children, className }) => {
	const { colours, opacity } = useConfigStore((state) => ({
		colours: state.colours,
		opacity: state.browserWindow.opacity,
	}));
	const showSetting = options?.shown ?? true;

	return (
		<div style={showSetting ? {} : { display: "none" }}>
			<div
				style={{
					backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100),
					color: colours.primaryColour,
				}}
			>
				<div className={`hover:text-white border-transparent border-2 ${className}`}>
					<div className='grid grid-cols-3 gap-3 text-lg text-ce"ter'>{children}</div>
				</div>
			</div>
		</div>
	);
};

export const TextSettingCard: FC<TextSettingCard> = ({ children, options }) => {
	const showSetting = options?.shown ?? true;

	return (
		<Box style={showSetting ? {} : { display: "none" }}>
			<div className={"text-gray-400 hover:text-white pb-3"}>
				<div className='grid grid-cols-2 gap-3'>{children}</div>
			</div>
		</Box>
	);
};

export const TagEditor: FC<TagEditor> = ({ children, options, onFocus, onKeyDown, onBlur }) => {
	return (
		<span className='bg-transparent'>
			<InputTextBox initialValue={options?.placeholder} options={{ placeholder: options?.placeholder, value: options?.placeholder, label: { text: options?.label?.text ?? "" } }} onBlur={onBlur} onKeyDown={onKeyDown} sx={{ input: { color: `#${options?.colour ?? "FFFFFF"}` } }} />
		</span>
	);
};

export const ValidationIcon: FC<ValidationIcon> = ({ children, valid }) => {
	let html;
	if (valid) {
		html = <FontAwesomeIcon style={{ color: "green" }} icon={faCheckCircle} />;
	} else {
		html = <FontAwesomeIcon style={{ color: "red" }} icon={faExclamationCircle} />;
	}
	return <span className={"p-1"}>{html}</span>;
};

export const ContactStaff: FC<ContactStaff> = ({ children }) => {
	const { colours, hypixel, settings, run, version } = useConfigStore((state) => ({
		colours: state.colours,
		hypixel: state.hypixel,
		settings: state.settings,
		run: state.run,
		version: state.version,
	}));

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setFeedbackResponse(false);
	};
	const [feedbackType, setFeedbackType] = React.useState("");
	const [feedbackTypeMessage, setFeedbackTypeMessage] = React.useState("");
	const [feedbackResponse, setFeedbackResponse] = React.useState(false);

	const handleChange = async (event: SelectChangeEvent) => {
		setFeedbackType(event.target.value);
	};

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: colours.backgroundColour,
		border: `2px solid ${colours.primaryColour}`,
		boxShadow: 24,
		p: 4,
		color: colours.primaryColour,
	};

	return (
		<div>
			<InputBoxButton onClick={handleOpen} text={"Tester Feedback"} />
			<Modal open={open} onClose={handleClose} style={{ color: colours.primaryColour }}>
				<Box sx={style}>
					<Typography sx={{ mt: 0 }}>
						<FormLabel title={"Tester Feedback"}>Feedback Form</FormLabel>
					</Typography>

					<Typography sx={{ mt: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Type</InputLabel>
							<Select value={feedbackType} onChange={handleChange}>
								<MenuItem value={"Bug"}>Bug</MenuItem>
								<MenuItem value={"Suggestion"}>Suggestion</MenuItem>
							</Select>
							<FormHelperText className={"text-red-500 font-bold"}>{"The type of report you'd like to submit!"}</FormHelperText>
							<FeedbackForm options={{ text: feedbackType, formHelper: "Please write as descriptively as possible" }} onChange={(event) => setFeedbackTypeMessage(event.target.value)} />
						</FormControl>
						<span>
							<InputBoxButton
								onClick={async () => {
									const body = {
										overlay: {
											version: version,
											owner: hypixel.apiKeyOwner,
											run: run.apiKey,
											settings: settings,
										},
										user: {
											type: feedbackType,
											message: feedbackTypeMessage,
										},
									};
									const strinyBody = JSON.stringify(body);
									await window.ipcRenderer.send("ContactStaff", strinyBody);
									setTimeout(() => setFeedbackResponse(true), 2000);
								}}
								text={"Submit"}
							/>
							<span style={feedbackResponse ? {} : { display: "none" }} className='pl-2 text-green-500'>
								✓
							</span>
						</span>
					</Typography>
				</Box>
			</Modal>
		</div>
	);
};

export const CustomHeader: FC<ICustomHeader> = (props: ICustomHeader) => {
	const [ascSort, setAscSort] = useState("inactive");
	const [descSort, setDescSort] = useState("inactive");
	const [noSort, setNoSort] = useState("inactive");
	const { textAlign } = useConfigStore((state) => ({ textAlign: state.table.settings.textAlign }));

	const onSortChanged = () => {
		setAscSort(props.column.isSortAscending() ? "active" : "inactive");
		setDescSort(props.column.isSortDescending() ? "active" : "inactive");
		setNoSort(!props.column.isSortAscending() && !props.column.isSortDescending() ? "active" : "inactive");
	};

	const onSortRequested = (order: "asc" | "desc" | null, event: any) => {
		if (props.enableSorting) props.setSort(order, event.shiftKey);
	};

	useEffect(() => {
		props.column.addEventListener("sortChanged", onSortChanged);
		onSortChanged();
	}, []);

	let sort: JSX.Element | null = null;
	if (props.enableSorting && noSort == "inactive") {
		if (ascSort == "inactive") {
			sort = (
				<span onClick={(event) => onSortRequested("desc", event)} onTouchEnd={(event) => onSortRequested("desc", event)} className={`customSortUpLabel ${descSort}`}>
					<ArrowDropUpIcon />
				</span>
			);
		} else if (descSort == "inactive") {
			sort = (
				<span onClick={(event) => onSortRequested("asc", event)} onTouchEnd={(event) => onSortRequested("asc", event)} className={`customSortDownLabel ${ascSort}`}>
					<ArrowDropDownIcon />
				</span>
			);
		}
	}

	return (
		<div style={{ textAlign }} className={"w-full"}>
			<div onClick={(event) => onSortRequested(ascSort == "active" ? "desc" : "asc", event)}>
				<span>{props.displayName}</span>
				{sort}
			</div>
		</div>
	);
};
