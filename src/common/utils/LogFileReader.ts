import store from "@renderer/store";
import {getPlayerHypixelData, PlayerStoreThunkObject, removePlayerFromOverlay, resetOverlayTable} from "@renderer/store/PlayerStore";
import {RunEndpoints} from "@common/utils/externalapis/RunApi";
import {Player} from "@common/utils/PlayerUtils";
import IpcRendererEvent = Electron.IpcRendererEvent;

export class LogFileReader {
    public startListening = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
            if (line.includes("Sending you to")) {
                store.dispatch(resetOverlayTable());
            }
        });
    };

    public startJoinHandler = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
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
            const line = data;
            if (line.includes(" ONLINE: ")) {
                const players = line.split(" [CHAT] ONLINE: ")[1].split(", ");
                store.dispatch(resetOverlayTable());
                Promise.all(players.map(async (player) => store.dispatch(getPlayerHypixelData({name: player}))));
            } else if (line.includes("Online Players (")) {
                const players = line.split("Online Players (")[1].split(")");
                players.shift();
                const playerNames = players[0].split(", ");
                store.dispatch(resetOverlayTable());
                Promise.all(
                    playerNames.map(async (name) => {
                        if (name.includes(" ")) name = name.split(" ")[name.split(" ").length - 1].trim();
                        store.dispatch(getPlayerHypixelData({name: name}));
                    }),
                );
            }
        });
    };

    public startSeraphHandler = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
            if (line.includes("FINAL KILL!")) {
                const lineTemp = line.toString().substring(line.indexOf("[CHAT]"), line.length).replace("[CHAT] ", "");
                const final_ign = lineTemp.split(" ")[0];
                const configStore = store.getState().configStore;
                const player: Player | undefined = store.getState().playerStore.players.find((player: Player) => player.name.toLowerCase() === final_ign.toLowerCase());
                if (player !== undefined && !player.nicked && player.hypixelPlayer !== null) {
                    window.ipcRenderer.invoke("seraph", RunEndpoints.SAFELIST, player.hypixelPlayer.uuid, configStore.apiKey, configStore.apiKeyOwner, configStore.runKey, configStore.apiKeyOwner);
                }
            }
        });
    };

    public startCommandListener = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
            if (line.toLowerCase().includes("Can't find a player by the name of ".toLowerCase())) {
                const command = line.split("[CHAT]")[1].split("can't find a player by the name of ")[1].replaceAll("'", "").trim();
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
            const line = data;
        });
    };
}
