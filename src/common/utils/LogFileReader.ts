import { IPCResponse, RunEndpoints } from "@common/utils/externalapis/RunApi";
import { Player } from "@common/utils/PlayerUtils";
import destr from "destr";
import usePlayerStore from "@renderer/store/PlayerStore";
import useConfigStore, { ConfigStore } from "@renderer/store/ConfigStore";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";
import axios from "axios";
import { removeMinecraftFormatting } from "@common/zikeji";
import IpcRendererEvent = Electron.IpcRendererEvent;
import { ConfigState } from "@reduxjs/toolkit/dist/query/core/apiState";

export type LogFileMessage = {
	message: string;
};

export class LogFileReader {
	public startListening = async () => {
		await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
			const line = readLogLine(data);
			if (line.includes("Sending you to")) {
				usePlayerStore.getState().clearPlayers();
			}
			if (line.includes("The game starts in 1 second!") && useConfigStore.getState().settings.preferences.autoHide) {
				window.ipcRenderer.send("windowMinimise");
			}
		});
	};

	public startJoinHandler = async () => {
		await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
			const line = readLogLine(data);
			if (line.includes(" has joined (")) {
				const username = line.split(" [CHAT] ")[1].split(" has joined")[0];
				addPlayer(username);
			} else if (line.includes(" has quit!")) {
				const player = line.split(" [CHAT] ")[1].split(" has quit!")[0];
				await removePlayer(player);
			}
		});
	};

	public startListHandler = async () => {
		await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
			const line = readLogLine(data, true);
			const textOnly = line.split("[CHAT] ")[1];
			if (line.includes("Sending you to") || textOnly.match(/^\s{37}/) || textOnly.match(/^(§a)?You have (§b)?(\d{1,4}) (§a)?unclaimed leveling reward(s)?!$/gi) || textOnly.match(/^(§a)?You have (§6)?(\d{1,4}) (§a)?unclaimed achievement reward(s)?!$/gi)) {
				clearOverlayTable();
			}
			if (line.includes(" ONLINE: ")) {
				const players = line.split(" [CHAT] ONLINE: ")[1].split(", ");
				clearOverlayTable();
				if (useConfigStore.getState().settings.preferences.autoHide) window.ipcRenderer.send("windowMaximise");
				players.map(async (player) => {
					if (player.includes("(") || player.includes("[")) return;
					addPlayer(player);
				});
			}
			if (line.includes("Online Players (")) {
				const players = line.split("Online Players (")[1].split(")");
				players.shift();
				const playerNames = players[0].split(", ");
				clearOverlayTable();
				playerNames.map(async (name) => {
					if (name.includes(" ")) name = name.split(" ")[name.split(" ").length - 1].trim();
					addPlayer(name);
				});
			}
			if (line.includes("Sending you to")) {
				const server_id = line.split("Sending you to")[1].replace("!", "");
				useConfigStore.getState().setGame({ last_server: server_id });
			}
		});
	};

	public startSeraphHandler = async () => {
		let players: Player[], configStore: ConfigStore;
		usePlayerStore.subscribe((state) => {
			players = state.players;
		});
		useConfigStore.subscribe((state) => {
			configStore = state;
		});
		
		await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
			const line = readLogLine(data, true);
			if (line.includes("FINAL KILL!")) {
				const lineTemp = line.toString().substring(line.indexOf("[CHAT]"), line.length).replace("[CHAT] ", "");
				const final_ign = lineTemp.split(" ")[0];
				const player: Player | undefined = players.find((player: Player) => player.name.toLowerCase() === final_ign.toLowerCase());
				if (player && "hypixelPlayer" in player) {
					await window.ipcRenderer.invoke(IpcValidInvokeChannels.SERAPH, [RunEndpoints.SAFELIST, player.hypixelPlayer.uuid, configStore.hypixel.apiKey, configStore.hypixel.apiKeyOwner, configStore.run.apiKey, configStore.hypixel.apiKeyOwner]);
				}
			}
			if (line.includes("Protect your bed and destroy the enemy beds.")) {
				const uuid_array: Array<string> = [];
				players.map((player) => {
					if (player && "hypixelPlayer" in player) uuid_array.push(player.hypixelPlayer.uuid);
				});
				const playerData: PlayerData = {
					data: {
						queue: uuid_array,
						server: useConfigStore.getState().game.last_server,
					},
				};
				if (uuid_array.length >= 1) postData(playerData);
			}
		});
	};

	public startApiKeyHandler = async () => {
		await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
			const line = readLogLine(data);
			if (line.includes("Your new API key is ")) {
				const configStore = useConfigStore.getState();
				configStore.setHypixelApiKey(line.split("Your new API key is ")[1]);
			}
		});
	};

	public startCommandListener = async () => {
		await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
			const line = readLogLine(data);
			if (line.toLowerCase().includes("Can't find a player by the name of ".toLowerCase())) {
				const command = line.split("[CHAT]")[1].split("Can't find a player by the name of ")[1].replaceAll("'", "").trim().toLowerCase();
				const commands = [".c", ".clear", ".h", ".hide", ".s", ".show", ".r"];
				const command_clean = command.replace(".", "").replace("@", "").replace("-", "").replace(",", "").toLowerCase();
				if (command === ".c" || command === ".clear") {
					clearOverlayTable();
					return;
				} else if (command === ".h" || command === ".hide") {
					window.ipcRenderer.send("windowMinimise");
					return;
				} else if (command === ".s" || command === ".show") {
					window.ipcRenderer.send("windowMaximise");
					return;
				} else if ((command_clean.length <= 16 || command_clean.length == 32 || command_clean.length == 36) && !commands.includes(command)) {
					addPlayer(command_clean);
					return;
				}
				return;
			}
		});
	};

	public startPartyListener = async () => {
		await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
			let line = readLogLine(data);
			if (line != null) {
				line = line.toString().substring(line.indexOf("[CHAT]"), line.length).replace("[CHAT] ", "");
				if (line.match(/\S*(?=( to the party! They have 60 seconds to accept.))/)) {
					// Invite (In Party)
					const player = line.match(/\S*(?=( to the party! They have 60 seconds to accept.))/);
					if (player != null) addPlayer(player[0]);
				} else if (line.match(/\S*(?=( party!))/)) {
					// You Joining Party (Out of Party)
					const players = line.match(/\S*(?=('))/);
					if (players != null) addPlayer(players[0]);
				} else if (line.match(/\S*(?=( joined the party.))/)) {
					// Someone Joining Party (Out of Party)
					const players = line.match(/\S*(?=( joined the party.))/);
					if (players != null) addPlayer(players[0]);
				} else if (line.match(/Party Leader: (\S.*)/)) {
					// Party List (Leader)
					const playerRank = line.match(/Party Leader: (\S.*)/);
					if (playerRank?.length === 2) {
						let players: string[] | null = line.match(/(?<=: )(.*?)(?= \?)/);
						if (players) {
							players = players[0].split(" ");
							addPlayer(players[players.length - 1]);
						}
					}
				} else if (line.match(/Party Moderators: (\S.*)/)) {
					// Party List (Moderators)
					const playerRank = line.match(/Party Moderators: (\S.*)/);
					if (playerRank?.length === 2) {
						const players: string[] = line
							.replace("Party Moderators: ", "")
							.replace(/\[(.*?)]/g, "")
							.split(" ?");
						players.pop();
						players.map(async (player) => addPlayer(player.replace(" ", "")));
					}
				} else if (line.match(/Party Members: (\S.*)/)) {
					// Party List (Members)
					const playerRank = line.match(/Party Members: (\S.*)/);
					if (playerRank?.length === 2) {
						const players = line
							.replace("Party Members: ", "")
							.replace(/\[(.*?)]/g, "")
							.split(" ?");
						players.pop();
						players.map(async (player) => addPlayer(player.replace(" ", "")));
					}
				} else if (line.match(/You'll be partying with: (\S.*)/)) {
					// Party Group Join (Out of Party)
					const players: string[] = line
						.replace("You'll be partying with: ", "")
						.replace(/and \d* other players!/, "")
						.replace(/\[(.*?)]/g, "")
						.split(", ");
					players.map(async (player) => addPlayer(player.replace(" ", "")));
				}
			}
		});
	};

	public startLilithListener = async () => {
		await window.ipcRenderer.on("logFileLine", (event, data) => {
			let line = readLogLine(data);
			if (line != null) {
				// [13:56:45] [Client thread/INFO]: [CHAT] ? CJFKQ Lvl: 3.4, W: 3 - non
				// [13:56:18] [Client thread/INFO]: [CHAT] ? [MVP+] Rsty_ Lvl: 116.4, W: 38 - ranked
				line = line.toString().substring(line.indexOf("[CHAT]"), line.length).replace("[CHAT] ", "");
				if (line.includes("Lvl:") && line.includes("W:")) {
					window.ipcRenderer.send("windowMaximise");
					if (line.includes("]") && line.includes("[")) {
						line = line.split("]")[1];
						addPlayer(line.split(" ")[1]);
					} else {
						line = line.split(" ")[1];
						addPlayer(line);
					}
				}
			}
		});
	};
}

const addPlayer = async (username: string) => {
	usePlayerStore.getState().addPlayer(username);
};

const removePlayer = async (username: string) => {
	usePlayerStore.getState().removePlayer(username);
};

type PlayerData = { data: { queue: Array<string>; server: string } };

const clearOverlayTable = async () => {
	const players = usePlayerStore.getState().players;
	const uuid_array: Array<string> = [];

	players.map((player) => {
		if (player && "hypixelPlayer" in player) uuid_array.push(player.hypixelPlayer.uuid);
	});
	usePlayerStore.getState().clearPlayers();

	const playerData: PlayerData = {
		data: {
			queue: uuid_array,
			server: useConfigStore.getState().game.last_server,
		},
	};

	if (uuid_array.length >= 1) postData(playerData);
};

const readLogLine = (data: string, sanitise?: boolean) => {
	const response: IPCResponse<LogFileMessage> = destr(data);
	if (typeof response === "object") {
		if (!response.data.message.includes("[CHAT]")) {
			return `[17:46:23] [Client thread/INFO]: [CHAT] ${response.data.message}`.replaceAll("%20", " ");
		}
		if (sanitise) {
			return removeMinecraftFormatting(response.data.message.replaceAll("�", "§"));
		}
		return response.data.message;
	}
	return "";
};

const postData = async (playerData: PlayerData) => {
	await axios.post("https://queues.seraph.si/v1/queue", playerData);
};

const sanitiseLine = (line: string) => {
	return removeMinecraftFormatting(line);
};
