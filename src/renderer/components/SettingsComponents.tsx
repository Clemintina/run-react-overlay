import useConfigStore, { ConfigStore } from "@renderer/store/ConfigStore";
import { AccordionDetails, Autocomplete, Box, Button, createTheme, FormControl, FormGroup, InputAdornment, InputLabel, ListItemButton, Select, SelectChangeEvent, Slider, SxProps, TextField, ThemeProvider, useTheme } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { CustomFileIpc, CustomLinkFile, KeybindInterface, PlayerNickname } from "@common/utils/Schemas";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";
import usePlayerStore from "@renderer/store/PlayerStore";
import { Player } from "@common/utils/PlayerUtils";
import { Components } from "@common/zikeji";
import { RequestType } from "@common/utils/externalapis/RunApi";
import useTagStore from "@renderer/store/TagStore";
import produce from "immer";
import destr from "destr";
import Typography from "@mui/material/Typography";
import { ColumnMovedEvent, GetRowIdParams, GridColumnsChangedEvent, GridOptions, GridReadyEvent, RowDataUpdatedEvent } from "ag-grid-community";
import { columnDefsBase, defaultColDefBase } from "@renderer/views/Homepage";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import { NavigateNext, RefreshRounded } from "@mui/icons-material";
import GoogleFontLoader from "react-google-font-loader";
import { hexToRgbA } from "@common/helpers";
import { constantPlayerData } from "@common/utils/SettingViewUtils";
import { ColourPicker, ColourPickerArray, LogSelectorModal, SettingCard, SettingHeader, TagEditor, TextSettingCard } from "@components/AppComponents";
import { InputBoxButton, InputTextBox, ToggleButton, UserAccordion } from "@components/BaseComponents";
import { Colour } from "@common/utils/TagSchema";
import { PlayerNicknameViewComponent } from "@components/PlayerComponents";

export const ApiOptions = () => {
	const { hypixel, settings, keathiz } = useConfigStore((state) => ({
		hypixel: state.hypixel,
		settings: state.settings,
		keathiz: state.keathiz,
	}));
	const styledProps: SxProps = {
		width: 0.86,
	};

	// TODO make it look nicer and cleaner
	return (
		<NavigationBar>
			<Box className='p-2 space-y-2'>
				<SettingCard>
					<span>Proxy Hypixel</span>
					<span />
					<ToggleButton
						text={""}
						onChange={async () => {
							useConfigStore.getState().setHypixelState({
								...hypixel,
								proxy: !hypixel.proxy,
							});
						}}
						options={{ enabled: hypixel.proxy }}
					>
						<span className={"pl-2"}>
							<Tooltip title={'Only use this if your API Key keeps getting "Too Many Invalid Api Keys" as this is slower than direct. '}>
								<FontAwesomeIcon icon={faMapLocation} />
							</Tooltip>
						</span>
					</ToggleButton>
				</SettingCard>
				<SettingCard>
					<span>Boomza (BWStats)</span>
					<span />
					<ToggleButton
						text={""}
						onChange={async () => {
							useConfigStore.getState().setSettings({ ...settings, boomza: !settings.boomza });
						}}
						options={{ enabled: settings.boomza }}
					>
						<span className={"pl-2"}>
							<Tooltip title='This API is proxied to protect your IP.'>
								<FontAwesomeIcon icon={faMapLocation} />
							</Tooltip>
						</span>
					</ToggleButton>
				</SettingCard>
				<SettingCard>
					<span>Lunar Tags</span>
					<span />
					<ToggleButton
						onChange={async () => {
							useConfigStore.getState().setSettings({ ...settings, lunar: !settings.lunar });
						}}
						options={{ enabled: settings.lunar }}
					/>
				</SettingCard>
				<SettingCard>
					<span>Friends</span>
					<span />
					<ToggleButton
						onChange={async () => {
							useConfigStore.getState().setSettings({ ...settings, run: { friends: !settings.run.friends } });
						}}
						options={{ enabled: settings.run.friends }}
					/>
				</SettingCard>
				<SettingCard>
					<span>Guilds</span>
					<span />
					<ToggleButton
						onChange={async () => {
							useConfigStore.getState().setSettings({ ...settings, hypixel: { guilds: !settings.hypixel.guilds } });
						}}
						options={{ enabled: settings.hypixel.guilds }}
					/>
				</SettingCard>
				<SettingCard>
					<span>Keathiz/Antisniper</span>
					<span />
					<span>
						<ToggleButton
							onChange={async () => {
								useConfigStore.getState().setSettings({ ...settings, keathiz: !settings.keathiz });
							}}
							options={{ enabled: settings.keathiz }}
						>
							<span className={"pl-2"}>
								<Tooltip title='This API is proxied to protect your IP.'>
									<FontAwesomeIcon icon={faMapLocation} />
								</Tooltip>
							</span>
						</ToggleButton>
					</span>
				</SettingCard>
				<TextSettingCard options={{ shown: settings.keathiz }}>
					<InputTextBox
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
							if (event.key === "Enter") {
								useConfigStore.getState().setKeathizApiKey(text.replaceAll(" ", ""));
							}
						}}
						onBlur={(event, text) => {
							useConfigStore.getState().setKeathizApiKey(text.replaceAll(" ", ""));
						}}
						options={{
							placeholder: keathiz.valid ? keathiz.key : "Antisniper API Key",
							label: { text: "Antisniper API Key" },
							colour: keathiz.valid ? "success" : "error",
							focused: true,
						}}
						sx={styledProps}
						helperText={!keathiz.valid ? "Enter a valid Antisniper API Key" : ""}
						initialValue={keathiz.key}
					/>
				</TextSettingCard>
			</Box>
		</NavigationBar>
	);
};

export const Appearance = () => {
	const localConfigStore = useConfigStore<ConfigStore>((state) => state);
	const { settings, browserWindow, font, table } = useConfigStore((state) => ({
		settings: state.settings,
		browserWindow: state.browserWindow,
		font: state.font,
		table: state.table,
	}));
	const [opacityValue, setOpacityValue] = useState(localConfigStore.browserWindow.opacity ?? 20);
	const styledProps: SxProps = {
		width: 0.86,
	};

	const [textAlignment, setTextAlignment] = useState(table.settings.textAlign);

	const handleChange = (event: SelectChangeEvent) => {
		if (event.target.value == "left" || event.target.value == "right" || event.target.value == "center") {
			setTextAlignment(event.target.value);
			useConfigStore.getState().setTableState({
				...useConfigStore.getState().table,
				settings: { textAlign: event.target.value },
			});
		}
	};

	// TODO make it look nicer and cleaner
	return (
		<NavigationBar>
			<Box className='p-2 space-y-2'>
				<SettingCard>
					<span>Auto Hide</span>
					<span />
					<ToggleButton
						onChange={async () => {
							useConfigStore.getState().setSettings({ ...settings, preferences: { ...settings.preferences, autoHide: !settings.preferences.autoHide } });
						}}
						options={{ enabled: settings.preferences.autoHide }}
					/>
				</SettingCard>
				<SettingCard>
					<span>Opacity</span>
					<span />
					<span>
						<Slider
							value={opacityValue}
							onChange={(event, value) => {
								const opacityValue: number = typeof value == "number" ? value : value[0];
								setOpacityValue(opacityValue);
								useConfigStore.getState().setBrowserWindow({ ...useConfigStore.getState().browserWindow, opacity: opacityValue });
							}}
							onBlur={() => {
								useConfigStore.getState().setBrowserWindow({ height: browserWindow.height, opacity: opacityValue, width: browserWindow.width });
							}}
							getAriaValueText={(value) => `${value}`}
							valueLabelDisplay={"auto"}
							min={1}
							valueLabelFormat={(value: number) => {
								return value;
							}}
						/>
					</span>
				</SettingCard>
				<SettingCard>
					<span>Font</span>
					<span />
					<Autocomplete
						freeSolo
						disablePortal
						options={font.isGoogleFont ? [...font.availableFonts] : []}
						onChange={(event) => {
							if (event.currentTarget.innerHTML == null || event.currentTarget.innerHTML.length == 0) return;
							if (font.availableFonts.includes(event.currentTarget.innerHTML) && font.isGoogleFont) {
								useConfigStore.getState().setFont({ ...font, family: event.currentTarget.innerHTML });
							} else {
								useConfigStore.getState().setFont({ ...font, family: event.currentTarget.innerHTML });
							}
						}}
						renderInput={(params) => (
							<>
								<FormGroup>
									<TextField
										{...params}
										label={"Font"}
										variant={"outlined"}
										onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
											if (event.key === "Enter") {
												if (font.availableFonts.includes(event.currentTarget.value)) useConfigStore.getState().setFont({ ...font, family: event.currentTarget.value });
											}
										}}
										onBlur={(event) => {
											if (event.currentTarget.value == null || event.currentTarget.value.length == 0) return;
											if (font.availableFonts.includes(event.currentTarget.value) && font.isGoogleFont) {
												useConfigStore.getState().setFont({ ...font, family: event.currentTarget.value });
											} else {
												useConfigStore.getState().setFont({ ...font, family: event.currentTarget.value });
											}
										}}
										sx={styledProps}
										placeholder={font.family}
										helperText={(font.isGoogleFont ? "Google" : "System") + " Font you want to use."}
									/>
									<Button
										sx={styledProps}
										onClick={() => {
											useConfigStore.getState().setFont({ ...font, isGoogleFont: !font.isGoogleFont });
										}}
									>
										{!font.isGoogleFont ? "Use Google Fonts" : "Use System Fonts"}
									</Button>
								</FormGroup>
							</>
						)}
					/>
				</SettingCard>
				<SettingCard>
					<span>Show Rank</span>
					<span />
					<span>
						<ToggleButton
							onChange={async () => {
								useConfigStore.getState().setSettings({
									...settings,
									appearance: { displayRank: !settings.appearance.displayRank },
								});
							}}
							options={{ enabled: settings.appearance.displayRank }}
						/>
					</span>
				</SettingCard>
				<SettingCard>
					<span>Text Alignment</span>
					<span />
					<span>
						<FormControl sx={styledProps}>
							<InputLabel id={"text-align-label"}>Text Alignment</InputLabel>
							<Select labelId={"text-align-label"} value={textAlignment} label={"Text Alignment"} onChange={handleChange}>
								<MenuItem value={"left"}>Left</MenuItem>
								<MenuItem value={"center"}>Center</MenuItem>
								<MenuItem value={"right"}>Right</MenuItem>
							</Select>
						</FormControl>
					</span>
				</SettingCard>
			</Box>
		</NavigationBar>
	);
};

export const KeybindEditorView = () => {
	const { keybinds } = useConfigStore((state) => ({ keybinds: state.keybinds }));
	const [controlBind, setControlBind] = useState<KeybindInterface>({ keybind: "", focus: "none" });
	const [lastKeyPressed, setLastKeyPressed] = useState<string>("");

	// TODO make it look nicer and cleaner
	return (
		<NavigationBar>
			<Box>
				<SettingCard className={"border-2 border-cyan-500"}>
					<span className={" "}>Toggle visibility</span>
					<span className={" "}>
						<InputTextBox
							onKeyPressed={(event) => {
								let inputKey: string;
								if (event.altKey) {
									inputKey = "Alt";
								} else if (event.ctrlKey) {
									inputKey = "Ctrl";
								} else if (event.metaKey) {
									inputKey = "Meta";
								} else if (event.shiftKey) {
									inputKey = "Shift";
								} else {
									inputKey = event.key;
								}
								if (lastKeyPressed == inputKey) {
									console.log("same key pressed! ", event.key);
								} else {
									setLastKeyPressed(inputKey);
									const keybind = controlBind.keybind.length != 0 ? controlBind.keybind + "+" + inputKey : inputKey;
									setControlBind({ keybind, focus: "open_overlay" });
									console.log(keybind, controlBind);
								}
							}}
							onBlur={async () => {
								await useConfigStore.getState().addKeybind(controlBind.focus, controlBind.keybind);
								await window.ipcRenderer.invoke(IpcValidInvokeChannels.GLOBAL_KEYBINDS, keybinds);
							}}
							onFocus={() => {
								useConfigStore.getState().removeKeybind("open_overlay");
								setControlBind({ ...controlBind, keybind: "", focus: "open_overlay" });
							}}
							options={{
								liveUpdate: true,
								placeholder: "Open Overlay",
								value: useConfigStore.getState().getKeybind("open_overlay")?.keybind,
							}}
						/>
					</span>
				</SettingCard>
				<SettingCard className={"border-2 border-cyan-500"}>
					<span className={" "}>Clear players</span>
					<span className={" "}>
						<InputTextBox
							onKeyDown={(event) => {
								const keybind = controlBind.keybind.length != 0 ? controlBind.keybind + "+" + event.key : event.key;
								setControlBind({ ...controlBind, keybind, focus: "clear_players" });
							}}
							onBlur={async () => {
								await useConfigStore.getState().addKeybind(controlBind.focus, controlBind.keybind);
								await window.ipcRenderer.invoke(IpcValidInvokeChannels.GLOBAL_KEYBINDS, keybinds);
							}}
							onFocus={() => {
								useConfigStore.getState().removeKeybind("clear_players");
								setControlBind({ ...controlBind, keybind: "" });
							}}
							options={{
								placeholder: "Clear Players",
								value: useConfigStore.getState().getKeybind("clear_players")?.keybind,
							}}
						/>
					</span>
				</SettingCard>
			</Box>
		</NavigationBar>
	);
};

export const NickView = () => {
	const { nicks, hypixelApiKey } = useConfigStore((state) => ({
		nicks: state.nicks,
		hypixelApiKey: state.hypixel.apiKey,
	}));
	const { players } = usePlayerStore((state) => ({ players: state.players }));
	const [playerNickname, setPlayerNickname] = useState({ name: "", nick: "", added: 0, uuid: "" });
	const [clearText, setClearText] = useState(false);
	const [usernameInput, setUsernameInput] = useState("");
	const [nickInput, setNickInput] = useState("");

	useEffect(() => {
		if (clearText) {
			setClearText(false);
		}
	}, [clearText]);

	const playerArray: Array<string> = [];
	const nickArray: Array<string> = [];

	players.map((p: Player) => {
		if (!p.nicked) {
			playerArray.push(p?.hypixelPlayer?.displayname ?? p.name);
		} else {
			nickArray.push(p.name);
		}
	});

	const addPlayer = (nickname: PlayerNickname) => {
		const pNick = nickname;
		pNick.added = Date.now();
		const user = nicks.some((player) => player.name.toLowerCase() == pNick.name.toLowerCase());
		if (!user) {
			const users = nicks;
			users.push(pNick);
			useConfigStore.getState().setNicks(users);
		}
		/*else {
        const knownNick = nicks.filter((player) => player.name.toLowerCase() != playerNickname.name.toLowerCase());
        console.log("Known Nick: ", knownNick);
        knownNick.push(playerNickname);
        console.log(knownNick);
        useConfigStore.getState().setNicks(knownNick);
    }
     */
		console.log(pNick);
		clearPlayer();
	};

	const removePlayer = (pNick: PlayerNickname) => {
		const users = nicks.filter((player) => player.name.toLowerCase() != pNick.name.toLowerCase());
		useConfigStore.getState().setNicks(users);
	};

	const clearPlayer = () => {
		setPlayerNickname({ ...playerNickname, name: "", nick: "", added: 0, uuid: "" });
		setNickInput("");
		setUsernameInput("");
	};

	const commonSx = {
		minHeight: 20,
	};

	// TODO make it look nicer and cleaner
	return (
		<NavigationBar>
			<div className='h-full w-full p-2 text-center'>
				<div>
					<SettingCard>
						<Box>
							{/* <InputTextBox
                                    onBlur={async (event) => {
                                        const userInput = event.currentTarget.value;
                                        if (userInput.length == 0) return;
                                        const hypixelRequest = await window.ipcRenderer.invoke<Components.Schemas.Player>("hypixel", RequestType.USERNAME, userInput, hypixelApiKey);
                                        setPlayerNickname({
                                            ...playerNickname,
                                            uuid: hypixelRequest?.data?.uuid ?? userInput,
                                            name: hypixelRequest?.data?.displayname ?? userInput,
                                        });
                                        const user = nicks.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
                                        if (user) {
                                            const users = nicks.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
                                            useConfigStore.getState().setNicks([...users, playerNickname]);
                                        }
                                    }}
                                    onFocus={() => {
                                        setPlayerNickname({ ...playerNickname, name: "" });
                                    }}
                                    options={{
                                        placeholder: "Username",
                                        value: playerNickname.name,
                                        clear: clearText,
                                        label: { text: "Username" },
                                        colour: "info",
                                    }}
                                />*/}
							<Autocomplete
								freeSolo
								disablePortal
								options={[...playerArray]}
								renderInput={(params) => (
									<TextField
										{...params}
										label={"Username"}
										variant={"outlined"}
										onBlur={async (event) => {
											const userInput = event.currentTarget.value;
											if (userInput.length == 0) return;
											const hypixelRequest = await window.ipcRenderer.invoke<Components.Schemas.Player>(IpcValidInvokeChannels.HYPIXEL, [RequestType.USERNAME, userInput, hypixelApiKey]);
											setPlayerNickname({
												...playerNickname,
												uuid: hypixelRequest?.data?.uuid ?? userInput,
												name: hypixelRequest?.data?.displayname ?? userInput,
											});
											const user = nicks.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
											if (user) {
												const users = nicks.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
												useConfigStore.getState().setNicks([...users, playerNickname]);
											}
										}}
										onFocus={() => {
											setPlayerNickname({ ...playerNickname, name: "" });
										}}
										onChange={(event) => {
											setUsernameInput(event.target.value);
										}}
										value={usernameInput}
									/>
								)}
							/>
						</Box>
						<Box className={" "}>
							<Autocomplete
								freeSolo
								disablePortal
								options={[...nickArray]}
								renderInput={(params) => (
									<TextField
										{...params}
										label={"Nickname"}
										variant={"outlined"}
										onBlur={(event) => {
											setPlayerNickname({ ...playerNickname, nick: event.currentTarget.value });
											const user = nicks.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
											if (user) {
												const users = nicks.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
												useConfigStore.getState().setNicks([...users, playerNickname]);
											}
										}}
										onChange={(event) => {
											setNickInput(event.target.value);
										}}
										value={nickInput}
									/>
								)}
							/>
						</Box>
						<div className={""}>
							<InputBoxButton
								text={"Add"}
								sx={{
									width: "50%",
									height: "100%",
								}}
								onClick={() => {
									addPlayer(playerNickname);
									clearPlayer();
								}}
								options={{
									colour: "success",
								}}
							/>
						</div>
					</SettingCard>
				</div>
				<div>
					{nicks.map((playerNick) => (
						<div key={playerNick.nick} className={"pt-2"}>
							<PlayerNicknameViewComponent key={playerNick.nick} playerNick={playerNick} handleAdd={addPlayer} handleRemove={removePlayer} />
						</div>
					))}
				</div>
			</div>
		</NavigationBar>
	);
};

export const TagEditorView = () => {
	const { run, boomza, keathiz, hypixel } = useTagStore((state) => ({ run: state.run, boomza: state.boomza, keathiz: state.keathiz, hypixel: state.hypixel }));
	const theme = {};

	// TODO make it look nicer and cleaner
	return (
		<NavigationBar>
			<div className='h-fu"l p-2 flex flex-col space-y-2'>
				<SettingCard>
					<span className={"w-80"}>Tag</span>
					<span className={"w-80"}>Display</span>
					<span className={"w-80"}>Colour</span>
				</SettingCard>
				<UserAccordion name={"Seraph"}>
					<SettingCard>
						<span>Annoy List</span>
						<span>
							<TagEditor
								options={{
									colour: run.annoylist.colour,
									placeholder: run.annoylist.display,
									label: { text: "Annoy list" },
								}}
								onBlur={(event) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.annoylist.display = event.currentTarget.value;
										}),
									);
								}}
							/>
						</span>
						<span>
							<ColourPicker
								setColour={async (colour: string) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.annoylist.colour = colour;
										}),
									);
								}}
								colourObject={run.annoylist.colour}
							/>
						</span>
					</SettingCard>
					<SettingCard>
						<span>Blacklisted</span>
						<span>
							<TagEditor
								options={{
									colour: run.blacklist.colour,
									placeholder: run.blacklist.display,
									label: { text: "Blacklist" },
								}}
								onBlur={(event) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.blacklist.display = event.currentTarget.value;
										}),
									);
								}}
							/>
						</span>
						<span>
							<ColourPicker
								setColour={async (colour: string) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.blacklist.colour = colour;
										}),
									);
								}}
								colourObject={run.blacklist.colour}
							/>
						</span>
					</SettingCard>
					<SettingCard>
						<span>Encounters</span>
						<span>
							<TagEditor
								options={{
									colour: run.encounters.colour[0],
									placeholder: run.encounters.display,
									label: { text: "Encounters" },
								}}
								onBlur={(event) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.encounters.display = event.currentTarget.value;
										}),
									);
								}}
							/>
						</span>
						<span>
							<ColourPickerArray
								setColour={async (newTagArray) => {
									const newColourObject = { ...run.encounters };
									const newItem = {
										colour: newTagArray.colour,
										requirement: newTagArray.requirement,
										operator: "<=",
									};
									if (Array.isArray(newColourObject.colour)) {
										const newColourArray: Array<Colour> = [...newColourObject.colour];
										newColourArray.filter((item, index) => {
											if (item.requirement == newItem.requirement) newColourArray.splice(index, 1);
										});
										newColourArray.push(newItem);
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.run.encounters.colour = newColourArray;
											}),
										);
									}
								}}
								colourObject={run.encounters}
							/>
						</span>
					</SettingCard>
					<SettingCard>
						<span>Friends</span>
						<span>
							<TagEditor
								options={{
									colour: run.friends.colour,
									placeholder: run.friends.display,
									label: { text: "Friends" },
								}}
								onBlur={(event) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.friends.display = event.currentTarget.value;
										}),
									);
								}}
							/>
						</span>
						<span>
							<ColourPicker
								setColour={async (colour: string) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.friends.colour = colour;
										}),
									);
								}}
								colourObject={run.friends.colour}
							/>
						</span>
					</SettingCard>
					<SettingCard>
						<span>Safelist</span>
						<span>
							<TagEditor
								options={{
									colour: run.safelist.colour,
									placeholder: run.safelist.display,
									label: { text: "Safelist" },
								}}
								onBlur={(event) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.safelist.display = event.currentTarget.value;
										}),
									);
								}}
							/>
						</span>
						<span>
							<ColourPickerArray
								setColour={async (newTagArray) => {
									const newColourObject = { ...run.safelist };
									const newItem = {
										colour: newTagArray.colour,
										requirement: newTagArray.requirement,
										operator: "<=",
									};
									if (Array.isArray(newColourObject.colour)) {
										const newColourArray: Array<Colour> = [...newColourObject.colour];
										newColourArray.filter((item, index) => {
											if (item.requirement == newItem.requirement) newColourArray.splice(index, 1);
										});
										newColourArray.push(newItem);
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.run.safelist.colour = newColourArray;
											}),
										);
									}
								}}
								colourObject={run.safelist}
							/>
						</span>
					</SettingCard>
					<SettingCard>
						<span>Personal Safelist</span>
						<span>
							<TagEditor
								options={{
									colour: run.personal_safelist.colour,
									placeholder: run.personal_safelist.display,
									label: { text: "Personal Safelist" },
								}}
								onBlur={(event) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.personal_safelist.display = event.currentTarget.value;
										}),
									);
								}}
							/>
						</span>
						<span>
							<ColourPicker
								setColour={async (colour: string) => {
									useTagStore.getState().setStore(
										produce((state: any) => {
											state.run.personal_safelist.colour = colour;
										}),
									);
								}}
								colourObject={run.personal_safelist.colour}
							/>
						</span>
					</SettingCard>
				</UserAccordion>
				<UserAccordion name={"Boomza"}>
					<AccordionDetails>
						<SettingCard>
							<span>Cheater</span>
							<span>
								<TagEditor
									options={{
										colour: boomza.cheater.colour,
										placeholder: boomza.cheater.display,
										label: { text: "Boomza Cheater" },
									}}
									onBlur={(event) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.boomza.cheater.display = event.currentTarget.value;
											}),
										);
									}}
								/>
							</span>
							<span>
								<ColourPicker
									setColour={async (colour: string) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.boomza.cheater.colour = colour;
											}),
										);
									}}
									colourObject={boomza.cheater.colour}
								/>
							</span>
						</SettingCard>
						<SettingCard>
							<span>Sniper</span>
							<span>
								<TagEditor
									options={{
										colour: boomza.sniper.colour,
										placeholder: boomza.sniper.display,
										label: { text: "Boomza Sniper" },
									}}
									onBlur={(event) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.boomza.sniper.display = event.currentTarget.value;
											}),
										);
									}}
								/>
							</span>
							<span>
								<ColourPicker
									setColour={async (colour: string) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.boomza.sniper.colour = colour;
											}),
										);
									}}
									colourObject={boomza.sniper.colour}
								/>
							</span>
						</SettingCard>
					</AccordionDetails>
				</UserAccordion>
				<UserAccordion name={"Hypixel"}>
					<AccordionDetails>
						<SettingCard>
							<span>Party</span>
							<span>
								<TagEditor
									options={{
										colour: hypixel.party.colour,
										placeholder: hypixel.party.display,
										label: { text: "Party" },
									}}
									onBlur={(event) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.hypixel.party.display = event.currentTarget.value;
											}),
										);
									}}
								/>
							</span>
							<span>
								<ColourPicker
									setColour={async (colour: string) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.hypixel.party.colour = colour;
											}),
										);
									}}
									colourObject={hypixel.party.colour}
								/>
							</span>
						</SettingCard>
					</AccordionDetails>
				</UserAccordion>
				<UserAccordion name={"Antisniper"}>
					<AccordionDetails>
						<SettingCard>
							<span>No Data</span>
							<span>
								<TagEditor
									options={{
										colour: keathiz.no_data.colour,
										placeholder: keathiz.no_data.display,
										label: { text: "Keathiz No Data" },
									}}
									onBlur={(event) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.no_data.display = event.currentTarget.value;
											}),
										);
									}}
								/>
							</span>
							<span>
								<ColourPicker
									setColour={async (colour: string) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.no_data.colour = colour;
											}),
										);
									}}
									colourObject={keathiz.no_data.colour}
								/>
							</span>
						</SettingCard>
						<SettingCard>
							<span>Queue Total</span>
							<span>
								<TagEditor
									options={{
										colour: keathiz.queues.queue_total.colour,
										placeholder: keathiz.queues.queue_total.display,
										label: { text: "Keathiz Queue Total" },
									}}
									onBlur={(event) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.queues.queue_total.display = event.currentTarget.value;
											}),
										);
									}}
								/>
							</span>
							<span>
								<ColourPicker
									setColour={async (colour: string) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.queues.queue_total.colour = colour;
											}),
										);
									}}
									colourObject={keathiz.queues.queue_total.colour}
								/>
							</span>
						</SettingCard>
						<SettingCard>
							<span>Queue Count</span>
							<span>
								<TagEditor
									options={{
										colour: keathiz.queues.queue_count.colour[0],
										placeholder: keathiz.queues.queue_count.display,
										label: { text: "Keathiz Queue Count" },
									}}
									onBlur={(event) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.queues.queue_count.display = event.currentTarget.value;
											}),
										);
									}}
								/>
							</span>
							<span>
								<ColourPickerArray
									setColour={async (newTagArray) => {
										const newColourObject = { ...keathiz.queues.queue_count };
										const newItem = {
											colour: newTagArray.colour,
											requirement: newTagArray.requirement,
											operator: "<=",
										};
										if (Array.isArray(newColourObject.colour)) {
											const newColourArray: Array<Colour> = [...newColourObject.colour];
											newColourArray.filter((item, index) => {
												if (item.requirement == newItem.requirement) newColourArray.splice(index, 1);
											});
											newColourArray.push(newItem);
											useTagStore.getState().setStore(
												produce((state: any) => {
													state.keathiz.queues.queue_count.colour = newColourArray;
												}),
											);
										}
									}}
									colourObject={keathiz.queues.queue_count}
								/>
							</span>
						</SettingCard>
						<SettingCard>
							<span>Consecutive</span>
							<span>
								<TagEditor
									options={{
										colour: keathiz.consecutive.colour,
										placeholder: keathiz.consecutive.display,
										label: { text: "Keathiz Consecutive Tag ( C )" },
									}}
									onBlur={(event) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.no_data.display = event.currentTarget.value;
											}),
										);
									}}
								/>
							</span>
							<span>
								<ColourPicker
									setColour={async (colour: string) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.consecutive.colour = colour;
											}),
										);
									}}
									colourObject={keathiz.consecutive.colour}
								/>
							</span>
						</SettingCard>
						<SettingCard>
							<span>One Minute Requeue</span>
							<span>
								<TagEditor
									options={{
										colour: keathiz.one_minute_requeue.colour,
										placeholder: keathiz.one_minute_requeue.display,
										label: { text: "Keathiz One Minute Queue ( Z )" },
									}}
									onBlur={(event) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.no_data.display = event.currentTarget.value;
											}),
										);
									}}
								/>
							</span>
							<span>
								<ColourPicker
									setColour={async (colour: string) => {
										useTagStore.getState().setStore(
											produce((state: any) => {
												state.keathiz.one_minute_requeue.colour = colour;
											}),
										);
									}}
									colourObject={keathiz.one_minute_requeue.colour}
								/>
							</span>
						</SettingCard>
					</AccordionDetails>
				</UserAccordion>
			</div>
		</NavigationBar>
	);
};

export const CustomLinks = () => {
	const { settings, customApi, customFile } = useConfigStore((state) => ({
		settings: state.settings,
		customApi: state.customApi,
		customFile: state.customFile,
	}));
	const styledProps: SxProps = {
		width: 0.98,
	};

	// TODO make it look nicer and cleaner
	return (
		<div>
			<NavigationBar>
				<Box className='p-2 space-y-2'>
					<SettingCard>
						<span>Custom Blacklist File</span>
						<span />
						<ToggleButton
							onChange={async () => {
								useConfigStore.getState().setSettings({ ...settings, preferences: { ...settings.preferences, customFile: !settings.preferences.customFile } });
							}}
							options={{ enabled: settings.preferences.customFile }}
						/>
						<span />
						<span />
						<div style={settings.preferences.customFile ? {} : { display: "none" }} className={"flex inline-block"}>
							<Box className={"flex inline-block"}>
								<InputBoxButton
									onClick={async () => {
										const path: Electron.OpenDialogReturnValue = await window.ipcRenderer.invoke(IpcValidInvokeChannels.SELECT_LOG_FILE, [[{ name: "Custom File", extensions: ["txt", "json"] }]]);
										if (path.filePaths[0] !== undefined) {
											const customFilePath = path.filePaths[0];
											const readable = await window.ipcRenderer.invoke<boolean>(IpcValidInvokeChannels.IS_FILE_READABLE, [customFilePath]);
											if (readable.data) {
												const readFileBuffer = await window.ipcRenderer.invoke<CustomFileIpc>(IpcValidInvokeChannels.READ_FILE, [customFilePath]);
												if (readFileBuffer.data != undefined && typeof readFileBuffer.data.contents === "string") {
													if (!readFileBuffer.data.contents.startsWith("{")) {
														const data = readFileBuffer.data.contents.split(/\r?\n/);
														const customLinkFile: CustomLinkFile = {
															readable: true,
															path: customFilePath,
															data,
														};
														useConfigStore.getState().setCustomFile(customLinkFile);
													} else {
														const data = destr(readFileBuffer.data.contents).data;
														const customLinkFile: CustomLinkFile = {
															readable: true,
															path: customFilePath,
															data,
														};
														useConfigStore.getState().setCustomFile(customLinkFile);
													}
												} else {
													console.log("File in undefined");
												}
											} else {
												useConfigStore.getState().setErrorMessage({
													code: 400,
													title: "Bad Custom file",
													cause: "The file set is unreadable.",
												});
											}
										}
									}}
									options={{ colour: settings.preferences.customFile ? "success" : "error" }}
									text={"Select"}
									sx={styledProps}
								/>
								<InputBoxButton
									onClick={async () => {
										if (customFile.readable) {
											const readFileBuffer = await window.ipcRenderer.invoke<CustomFileIpc>(IpcValidInvokeChannels.READ_FILE, [customFile.path, "text"]);
											if (readFileBuffer.data != undefined && typeof readFileBuffer.data.contents === "string") {
												if (!readFileBuffer.data.contents.startsWith("{")) {
													const data = readFileBuffer.data.contents.split(/\r?\n/);
													const customLinkFile: CustomLinkFile = {
														readable: true,
														path: customFile.path,
														data,
													};
													useConfigStore.getState().setCustomFile(customLinkFile);
												} else {
													const data = destr(readFileBuffer.data.contents).data;
													const customLinkFile: CustomLinkFile = {
														readable: true,
														path: customFile.path,
														data,
													};
													useConfigStore.getState().setCustomFile(customLinkFile);
												}
											} else {
												console.log("File in undefined");
											}
										}
									}}
									options={{ colour: settings.preferences.customFile ? "success" : "error" }}
									text={"Reload"}
									sx={styledProps}
								/>
							</Box>
						</div>
					</SettingCard>
					<SettingCard>
						<span>Custom Blacklist API</span>
						<span />
						<ToggleButton
							onChange={async () => {
								useConfigStore.getState().setSettings({ ...settings, preferences: { ...settings.preferences, customUrl: !settings.preferences.customUrl } });
							}}
							options={{ enabled: settings.preferences.customUrl }}
						/>
					</SettingCard>
					<Box style={settings.preferences.customUrl ? {} : { display: "none" }}>
						<InputTextBox initialValue={customApi.url} options={{ placeholder: "https://antisniper.seraph.si/api/v4/overlay/blacklist", label: { text: "Custom URL" } }} onBlur={(event) => useConfigStore.getState().setCustomApi({ url: event.currentTarget.value })} />
						<UserAccordion name={"Request Parameters"}>
							<div className={"grid grid-cols-2"}>
								<div className={"font-bold pb-2"}>URL Parameter</div>
								<div className={"font-bold pb-2"}>Overlay Equivalent</div>
								<Typography>{`{uuid}`}</Typography>
								<Typography>Player Uuid</Typography>
								<Typography>{`{name}`}</Typography>
								<Typography>Player Name</Typography>
								<Typography>{`{hypixelapikey}`}</Typography>
								<Typography>Include your Hypixel API Key</Typography>
								<Typography>{`{seraphapikey}`}</Typography>
								<Typography>Include your Seraph API Key</Typography>
							</div>
						</UserAccordion>
					</Box>
				</Box>
			</NavigationBar>
		</div>
	);
};

export const ColumnEditorView = () => {
	const { columnState } = useConfigStore((state) => ({ columnState: state.table.columnState }));
	const [playerData, setPlayerData] = useState<Array<Player>>([]);

	const toggleColumn = (columnId: string) => {
		const table = useConfigStore.getState().table;
		table.columnState.map((column) => {
			if (column.colId == columnId) {
				column.hide = !column.hide;
			}
		});

		useConfigStore.getState().setTableState(table);
		setPlayerData([...constantPlayerData()]);
	};

	const onGridUpdate = (event) => {
		event.columnApi.applyColumnState({ state: columnState, applyOrder: true });
		event.api.refreshCells({ force: true });
	};

	const gridOptions: GridOptions<Player> = {
		onGridReady(event: GridReadyEvent) {
			event.columnApi.applyColumnState({ state: columnState, applyOrder: true });
			event.api.setRowData(playerData);
		},
		onRowDataUpdated(event: RowDataUpdatedEvent<Player>) {
			onGridUpdate(event);
		},
		onGridColumnsChanged(event: GridColumnsChangedEvent) {
			onGridUpdate(event);
		},
		onColumnMoved(event: ColumnMovedEvent) {
			onGridUpdate(event);
		},
		defaultColDef: defaultColDefBase,
		columnDefs: columnDefsBase,
		autoSizePadding: 0,
		rowHeight: 25,
		overlayNoRowsTemplate: "Welcome to the Table Editor! In order to continue, Please click a button and I will display a preview here! ",
		getRowId: (params: GetRowIdParams<Player>) => params.data.name,
	};

	// TODO make it look nicer and cleaner
	return (
		<NavigationBar>
			<Box className={"pl-2"}>
				<div className='ag-theme-alpine-dark' style={{ height: "15vh" }}>
					<AgGridReact rowData={playerData} gridOptions={gridOptions} />
				</div>
				<div className={"grid grid-cols-6 justify-center"}>
					{columnState.map((column) => (
						<div key={column.colId}>
							<span className={"capitalize"}>{column.colId.replace("_", " ")}</span>
							<span className={""}>
								<ToggleButton onClick={() => toggleColumn(column.colId)} options={{ enabled: !column.hide }}></ToggleButton>
							</span>
						</div>
					))}
				</div>
			</Box>
		</NavigationBar>
	);
};

export const Essentials = () => {
	const { hypixel, settings, run } = useConfigStore((state) => ({
		hypixel: state.hypixel,
		logs: state.logs,
		settings: state.settings,
		run: state.run,
		keathiz: state.keathiz,
	}));
	const styledProps: SxProps = {
		width: 0.86,
	};

	// TODO make it look nicer and cleaner
	return (
		<NavigationBar>
			<Box className={"pl-2 pt-2"}>
				<TextSettingCard>
					<span>Hypixel API Key</span>
					<span />
					<InputTextBox
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
							if (event.key === "Enter") {
								useConfigStore.getState().setHypixelApiKey(text.replaceAll(" ", ""));
							}
						}}
						onBlur={(event, text) => {
							useConfigStore.getState().setHypixelApiKey(text.replaceAll(" ", ""));
						}}
						options={{
							placeholder: hypixel.apiKeyValid ? hypixel.apiKey : "Hypixel API Key",
							label: { text: "Hypixel API Key" },
							colour: hypixel.apiKeyValid ? "success" : "error",
							focused: true,
						}}
						sx={styledProps}
						helperText={!hypixel.apiKeyValid ? "Enter a valid Hypixel API Key" : ""}
						initialValue={hypixel.apiKey}
						inputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<Button onClick={() => useConfigStore.getState().setHypixelApiKey(hypixel.apiKey)}>
										<RefreshRounded />
									</Button>
								</InputAdornment>
							),
						}}
					/>
				</TextSettingCard>
				<TextSettingCard>
					<span>Seraph API Key</span>
					<span />
					<div className={"flex justify-center"}>
						<InputTextBox
							onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>, text) => {
								if (event.key === "Enter") {
									useConfigStore.getState().setRunApiKey(text.replaceAll(" ", ""));
								}
							}}
							onBlur={(event, text) => {
								useConfigStore.getState().setRunApiKey(text.replaceAll(" ", ""));
							}}
							options={{
								placeholder: run.valid ? run.apiKey : "Seraph API Key",
								label: { text: "Seraph API Key" },
								colour: run.valid ? "success" : "error",
								focused: true,
							}}
							sx={styledProps}
							helperText={!run.valid ? "Enter a valid Seraph API Key" : ""}
							initialValue={run.apiKey}
							inputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<Button onClick={() => useConfigStore.getState().validateRunKey()}>
											<RefreshRounded />
										</Button>
									</InputAdornment>
								),
							}}
						/>
					</div>
				</TextSettingCard>
				<SettingCard>
					<span>Overlay Logs</span>
					<span />
					<span>
						<span className={"inline-flex flex"}>
							<LogSelectorModal />
						</span>
					</span>
				</SettingCard>
				<SettingHeader>
					<span />
					<span>Other</span>
					<span />
				</SettingHeader>
				<SettingCard>
					<span>Astolfo Chat Bridge</span>
					<span />
					<span>
						<ToggleButton
							onChange={async () => {
								useConfigStore.getState().setSettings({ ...settings, astolfo: !settings.astolfo });
								await window.ipcRenderer.invoke(IpcValidInvokeChannels.ASTOLFO);
							}}
							options={{ enabled: settings.astolfo }}
						></ToggleButton>
					</span>
				</SettingCard>
				<SettingCard>
					<span>Automatic Updates</span>
					<span />
					<span>
						<ToggleButton
							onChange={async () => {
								await window.config.set("settings.updater", !(await window.config.get("settings.updater")));
								useConfigStore.getState().setSettings({ ...settings, updater: !settings.updater });
							}}
							options={{ enabled: settings.updater }}
						></ToggleButton>
					</span>
				</SettingCard>
				<SettingCard>
					<div className={"flex hover:border-2 hover:border-green-500 rounded"}>
						<Link to={"/settings/apis"} className={"flex w-full"}>
							<ListItemButton>
								<div className={"flex w-full justify-between font-bold"}>
									<div>APIs</div>
									<div>
										<NavigateNext />
									</div>
								</div>
							</ListItemButton>
						</Link>
					</div>
				</SettingCard>
			</Box>
		</NavigationBar>
	);
};

export const ColourRenderer: FC<PropsWithChildren> = ({ children }) => {
	const { colours, opacity, font } = useConfigStore((state) => ({
		colours: state.colours,
		opacity: state.browserWindow.opacity,
		font: state.font,
	}));
	const useExistingTheme = useTheme();
	const theme = createTheme({
		...useExistingTheme,
		typography: {
			fontFamily: `"${font.family}"`,
		},
	});

	return (
		<div style={{ backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100) }}>
			<ThemeProvider theme={theme}>
				{font.isGoogleFont ? (
					<>
						<GoogleFontLoader fonts={[{ font: font.family, weights: [400] }]} />
						{children}
					</>
				) : (
					<div style={{ fontFamily: font.family ?? "caption" }}>{children}</div>
				)}
			</ThemeProvider>
		</div>
	);
};

const NavigationBar = (props: { children }) => {
	return <Box className={"grid grid-col-3 w-full"}>{props.children}</Box>;
};
