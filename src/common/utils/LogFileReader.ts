import store from "@renderer/store";
import {getPlayerHypixelData, PlayerStoreThunkObject, removePlayerFromOverlay, resetOverlayTable} from "@renderer/store/PlayerStore";

export class LogFileReader {
    public startListening = async () => {
        await window.ipcRenderer.on("logFileLine", async (event, data) => {
            const logLine = data;
            const line = logLine;
            console.log(logLine);
            if (!line.includes("[Client thread/INFO]: [CHAT]") && !line.includes("[main/INFO]: [CHAT] ")) return;
            if (line.includes("Sending you to")) {
                console.log(logLine);
            } else if (line.includes(" has joined (")) {
                const username = line.split(" [CHAT] ")[1].split(" has joined")[0];
                const obj: PlayerStoreThunkObject = {name: username};
                await store.dispatch(getPlayerHypixelData(obj));
            } else if (line.includes(" has quit!")) {
                const player = line.split(" [CHAT] ")[1].split(" has quit!")[0];
                await store.dispatch(removePlayerFromOverlay({name: player}));
            } else if (line.includes(" ONLINE: ")) {
                await store.dispatch(resetOverlayTable());
                const players = line.split(" [CHAT] ONLINE: ")[1].split(", ");
                await Promise.all(players.map(async (player) => await store.dispatch(getPlayerHypixelData({name: player}))));
            } else if (line.includes("Online Players (")) {
                await store.dispatch(resetOverlayTable());
                let players = line.split(" [CHAT] Online Players (")[1];
                players = players.split(", ");
                for (const playerTemp of players) {
                    let player: string = playerTemp;
                    if (player.includes(" ")) player = player.split(" ")[player.split(" ").length - 1];
                    const obj: PlayerStoreThunkObject = {name: player};
                    await store.dispatch(getPlayerHypixelData(obj));
                }
            } else if (line.includes("FINAL KILL!")) {
                const lineTemp = line.toString().substring(line.indexOf("[CHAT]"), line.length).replace("[CHAT] ", "");
                const final_ign = lineTemp.split(" ")[0];
                console.log("Safelisted " + final_ign);
            }
        });
    };
}
