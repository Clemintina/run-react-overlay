import store from "@renderer/store";
import {getPlayerHypixelData, PlayerStoreThunkObject, removePlayerFromOverlay, resetOverlayTable} from "@renderer/store/PlayerStore";
import {IPCResponse, RunEndpoints} from "@common/utils/externalapis/RunApi";
import {Player} from "@common/utils/PlayerUtils";
import destr from "destr";
import IpcRendererEvent = Electron.IpcRendererEvent;

export interface LogFileMessage {
    message: string
}

export class LogFileReader {
    public startListening = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = readLogLine(data);
            if (line.includes("Sending you to")) {
                store.dispatch(resetOverlayTable());
            }
        });
    };

    public startJoinHandler = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = readLogLine(data);
            if (line.includes(" has joined (")) {
                const username = line.split(" [CHAT] ")[1].split(" has joined")[0];
                const obj: PlayerStoreThunkObject = {name: username};
                store.dispatch(getPlayerHypixelData(obj));
            } else if (line.includes(" has quit!")) {
                const player = line.split(" [CHAT] ")[1].split(" has quit!")[0];
                store.dispatch(removePlayerFromOverlay({name: player}));
            }
        });
    };

    public startListHandler = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = readLogLine(data);
            if (line.includes(" ONLINE: ")) {
                const players = line.split(" [CHAT] ONLINE: ")[1].split(", ");
                store.dispatch(resetOverlayTable());
                players.map(async (player) => store.dispatch(getPlayerHypixelData({name: player})));
            } else if (line.includes("Online Players (")) {
                const players = line.split("Online Players (")[1].split(")");
                players.shift();
                const playerNames = players[0].split(", ");
                store.dispatch(resetOverlayTable());
                playerNames.map(async (name) => {
                    if (name.includes(" ")) name = name.split(" ")[name.split(" ").length - 1].trim();
                    store.dispatch(getPlayerHypixelData({name: name}));
                })
            }
        });
    };

    public startSeraphHandler = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = readLogLine(data);
            if (line.includes("FINAL KILL!")) {
                const lineTemp = line.toString().substring(line.indexOf("[CHAT]"), line.length).replace("[CHAT] ", "");
                const final_ign = lineTemp.split(" ")[0];
                const configStore = store.getState().configStore;
                const player: Player | undefined = store.getState().playerStore.players.find((player: Player) => player.name.toLowerCase() === final_ign.toLowerCase());
                if (player !== undefined && !player.nicked && player.hypixelPlayer !== null) {
                    await window.ipcRenderer.invoke("seraph", RunEndpoints.SAFELIST, player.hypixelPlayer.uuid, configStore.hypixel.apiKey, configStore.hypixel.apiKeyOwner, configStore.runKey, configStore.hypixel.apiKeyOwner);
                }
            }
        });
    };

    public startCommandListener = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = readLogLine(data);
            if (line.toLowerCase().includes("Can't find a player by the name of ".toLowerCase())) {
                const command = line.split("[CHAT]")[1].split("Can't find a player by the name of ")[1].replaceAll("'", "").trim();
                const commands = [".c", ".clear", ".h", ".hide", ".s", ".show", ".r"];
                const command_clean = command.replace(".", "").replace("@", "").replace("-", "").replace(",", "").toLowerCase();
                if (command === ".c" || command === ".clear") {
                    store.dispatch(resetOverlayTable());
                    return;
                } else if (command === ".h" || command === ".hide") {
                    window.ipcRenderer.send("windowMinimise");
                    return;
                } else if (command === ".s" || command === ".show") {
                    window.ipcRenderer.send("windowMaximise");
                    return;
                } else if ((command_clean.length <= 16 || command_clean.length == 32 || command_clean.length == 36) && !commands.includes(command)) {
                    store.dispatch(getPlayerHypixelData({name: command_clean}));
                    return;
                }
                return;
            }
        });
    };

    public startPartyListener = async () => {
        // TODO Add party handling
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            let line = readLogLine(data);
            if (line != null) {
                line = line.toString().substring(line.indexOf("[CHAT]"), line.length).replace("[CHAT] ", "");
                if (line.match(/\S*(?=( to the party! They have 60 seconds to accept.))/)) { // Invite (In Party)
                    const player = line.match(/\S*(?=( to the party! They have 60 seconds to accept.))/);
                    if (player != null) store.dispatch(getPlayerHypixelData({name: player[0]}))
                } else if (line.match(/\S*(?=( party!))/)) { // You Joining Party (Out of Party)
                    const players = line.match(/\S*(?=('))/);
                    if (players != null) store.dispatch(getPlayerHypixelData({name: players[0]}))
                } else if (line.match(/\S*(?=( joined the party.))/)) { // Someone Joining Party (Out of Party)
                    const players = line.match(/\S*(?=( joined the party.))/);
                    if (players != null) store.dispatch(getPlayerHypixelData({name: players[0]}))
                } else if (line.match(/Party Leader: (\S.*)/)) { // Party List (Leader)
                    const playerRank = (line.match(/Party Leader: (\S.*)/))
                    if (playerRank?.length === 2) {
                        let players = line.match(/(?<=: )(.*?)(?= \?)/);
                        if (players != null) {
                            players = players[0].split(" ");
                            store.dispatch(getPlayerHypixelData({name: players[players.length - 1]}))
                        }
                    }
                } else if (line.match(/Party Moderators: (\S.*)/)) { // Party List (Moderators)
                    const playerRank = line.match(/Party Moderators: (\S.*)/)
                    if (playerRank?.length === 2) {
                        const players: string[] = line.replace("Party Moderators: ", "").replace(/\[(.*?)]/g, '').split(' ?');
                        players.pop()
                        players.map(async (player) => store.dispatch(getPlayerHypixelData({name: player.replace(' ', "")})));
                    }
                } else if (line.match(/Party Members: (\S.*)/)) { // Party List (Members)
                    const playerRank = line.match(/Party Members: (\S.*)/)
                    if (playerRank?.length === 2) {
                        const players = line.replace("Party Members: ", "").replace(/\[(.*?)]/g, '').split(" ?");
                        players.pop()
                        players.map(async (player) => store.dispatch(getPlayerHypixelData({name: player.replace(' ', "")})));
                    }
                } else if (line.match(/You'll be partying with: (\S.*)/)) { // Party Group Join (Out of Party)
                    const players: string[] = line.replace("You'll be partying with: ", '').replace(/and \d* other players!/, "").replace(/\[(.*?)]/g, '').split(", ");
                    players.map(async (player) => store.dispatch(getPlayerHypixelData({name: player.replace(' ', "")})));
                }
            }
        });
    };
}

const readLogLine = (data: string) => {
    const response: IPCResponse<LogFileMessage> = destr(data);
    if (typeof response === "object") {
        return response.data.message;
    }
    return "";
};
