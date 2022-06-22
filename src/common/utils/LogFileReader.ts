import store from "@renderer/store";
import {getPlayerHypixelData, PlayerStoreThunkObject, removePlayerFromOverlay, resetOverlayTable} from "@renderer/store/PlayerStore";
import {RunEndpoints} from "@common/utils/externalapis/RunApi";
import {Player} from "@common/utils/PlayerUtils";
import IpcRendererEvent = Electron.IpcRendererEvent;

export class LogFileReader {
    public startListening = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
            if (!line.includes("[Client thread/INFO]: [CHAT]") && !line.includes("[main/INFO]: [CHAT] ")) return;
            if (line.includes("Sending you to")) {
                await store.dispatch(resetOverlayTable());
            }
        });
    };

    public startJoinHandler = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
            if (!line.includes("[Client thread/INFO]: [CHAT]") && !line.includes("[main/INFO]: [CHAT] ")) return;
            if (line.includes(" has joined (")) {
                const username = line.split(" [CHAT] ")[1].split(" has joined")[0];
                const obj: PlayerStoreThunkObject = {name: username};
                await store.dispatch(getPlayerHypixelData(obj));
            } else if (line.includes(" has quit!")) {
                const player = line.split(" [CHAT] ")[1].split(" has quit!")[0];
                await store.dispatch(removePlayerFromOverlay({name: player}));
            }
        });
    };

    public startListHandler = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
            if (!line.includes("[Client thread/INFO]: [CHAT]") && !line.includes("[main/INFO]: [CHAT] ")) return;
            if (line.includes(" ONLINE: ")) {
                const players = line.split(" [CHAT] ONLINE: ")[1].split(", ");
                await Promise.all(players.map(async (player) => await store.dispatch(getPlayerHypixelData({name: player}))));
            } else if (line.includes("Online Players (")) {
                const players = line.split("Online Players (")[1].split(")");
                players.shift();
                const playerNames = players[0].split(", ");
                await Promise.all(
                    playerNames.map(async (name) => {
                        if (name.includes(" ")) name = name.split(" ")[name.split(" ").length - 1].trim();
                        await store.dispatch(getPlayerHypixelData({name: name}));
                    }),
                );
            }
        });
    };

    public startSeraphHandler = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
            if (!line.includes("[Client thread/INFO]: [CHAT]") && !line.includes("[main/INFO]: [CHAT] ")) return;
            if (line.includes("FINAL KILL!")) {
                const lineTemp = line.toString().substring(line.indexOf("[CHAT]"), line.length).replace("[CHAT] ", "");
                const final_ign = lineTemp.split(" ")[0];
                const configStore = store.getState().configStore;
                const player: Player | undefined = store.getState().playerStore.players.find((player: Player) => player.name.toLowerCase() === final_ign.toLowerCase());
                if (player !== undefined && !player.nicked && player.hypixelPlayer !== null) {
                    await window.ipcRenderer.invoke("seraph", RunEndpoints.SAFELIST, player.hypixelPlayer.uuid, configStore.apiKey, configStore.apiKeyOwner, configStore.runKey, configStore.apiKeyOwner);
                }
            }
        });
    };

    public startCommandListener = async () => {
        await window.ipcRenderer.on("logFileLine", async (event: IpcRendererEvent, data) => {
            const line = data;
            if (!line.includes("[Client thread/INFO]: [CHAT]") && !line.includes("[main/INFO]: [CHAT] ")) return;
            if (line.toLowerCase().includes("can't find a player by the name of ")) {
                console.log(line);
                const command = line.replace("can't find a player by the name of ", "").replaceAll("'", "").replace("[CHAT]").trim();
                console.log(command);
                if (command === ".c") {
                    await store.dispatch(resetOverlayTable());
                }
            }
        });
    };
}
