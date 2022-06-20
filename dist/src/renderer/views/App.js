import "@assets/scss/app.scss";
import React, { useEffect } from "react";
import store from "@renderer/store";
import { getPlayerHypixelData } from "@renderer/store/PlayerStore";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { FormatPlayer } from "@common/utils/PlayerUtils";
import { Interweave } from "interweave";
import { createTheme, ThemeProvider } from "@mui/material";
import { v4 } from "uuid";
import { LogFileReader } from "@common/utils/LogFileReader";
const playerFormatter = new FormatPlayer();
const columns = [
    {
        field: "id",
        headerName: "ID",
        hide: true,
        valueGetter: (params) => params.id,
    },
    {
        field: "star",
        headerName: "Star",
        flex: 1,
        description: `Player's Bedwars Level`,
        renderCell: (params) => React.createElement(Interweave, { content: playerFormatter.renderStar(params.row) }),
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : params.row.hypixelPlayer?.achievements.bedwars_level;
        },
    },
    {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 200,
        description: `Name of the Player`,
        renderCell: (params) => React.createElement(Interweave, { content: playerFormatter.renderName(params.row) }),
        valueGetter: (params) => {
            return !params.row.nicked ? params.row.hypixelPlayer?.displayname : params.row.name;
        },
    },
    {
        field: "tags",
        headerName: "Tag",
        flex: 1,
        minWidth: 100,
        description: `Tags for the Overlay`,
        renderCell: (params) => React.createElement(Interweave, { content: playerFormatter.renderTags(params.row) }),
        sortable: false,
    },
    {
        field: "winstreak",
        headerName: "WS",
        flex: 1,
        description: `Player's Winstreak`,
        renderCell: (params) => React.createElement(Interweave, { content: playerFormatter.renderWinstreak(params.row) }),
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : params.row.hypixelPlayer?.stats.Bedwars?.winstreak;
        },
    },
    {
        field: "fkdr",
        headerName: "FKDR",
        flex: 1,
        description: `Player's Final Kill to Death Ratio`,
        renderCell: (params) => React.createElement(Interweave, { content: playerFormatter.renderFKDRColour(params.row) }),
        valueFormatter: ({ value }) => value.toFixed(2),
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : (params.row.hypixelPlayer?.stats.Bedwars?.final_kills_bedwars || 0) / (params.row.hypixelPlayer?.stats.Bedwars?.final_deaths_bedwars || 0) || 0;
        },
    },
    {
        field: "wlr",
        headerName: "WLR",
        flex: 1,
        description: `Player's Win to Loss Ratio`,
        renderCell: (params) => React.createElement(Interweave, { content: playerFormatter.renderRatioColour(params.row, "wlr") }),
        valueFormatter: ({ value }) => value.toFixed(2),
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : (params.row.hypixelPlayer?.stats.Bedwars?.wins_bedwars || 0) / (params.row.hypixelPlayer?.stats.Bedwars?.losses_bedwars || 0) || 0;
        },
    },
    {
        field: "bblr",
        headerName: "BBLR",
        flex: 1,
        description: `Player's Beds Broken to Beds Lost Ratio`,
        renderCell: (params) => React.createElement(Interweave, { content: playerFormatter.renderRatioColour(params.row, "bblr") }),
        valueFormatter: ({ value }) => value.toFixed(2),
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : (params.row.hypixelPlayer?.stats.Bedwars?.beds_broken_bedwars || 0) / (params.row.hypixelPlayer?.stats.Bedwars?.beds_lost_bedwars || 0) || 0;
        },
    },
    {
        field: "wins",
        headerName: "Wins",
        flex: 1,
        description: `Player's Wins`,
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : params.row.hypixelPlayer?.stats.Bedwars?.wins_bedwars || 0;
        },
    },
    {
        field: "losses",
        headerName: "Losses",
        flex: 1,
        description: `Player's Losses`,
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : params.row.hypixelPlayer?.stats.Bedwars?.losses_bedwars || 0;
        },
    },
];
const getNickedPlayerSortingResponse = (params) => {
    return 0;
};
const showPlayers = () => console.log(store.getState().playerStore.players.length);
const showPlayerData = () => store.getState().playerStore.players.forEach((player) => console.log(player.name, player.nicked));
const AppTable = () => {
    const players = useSelector(() => store.getState().playerStore.players);
    const theme = createTheme({
        palette: {
            mode: "dark",
        },
        components: {
            MuiTableCell: {
                defaultProps: {},
                styleOverrides: {
                    root: {
                        spacing: 4,
                        padding: 0,
                        border: "none",
                    },
                },
            },
        },
    });
    useEffect(() => {
        window.ipcRenderer.on("logFileLine", async (event, data) => {
            LogFileReader(data);
        });
    });
    return (React.createElement("div", null,
        React.createElement("div", { style: { height: "85vh", width: "100%" } },
            React.createElement(ThemeProvider, { theme: theme },
                React.createElement(DataGrid, { className: 'mainTable', getRowId: (row) => v4(), rows: players, columns: columns, pageSize: 16, rowsPerPageOptions: [16], hideFooter: true, rowHeight: 35, disableSelectionOnClick: true, sx: {
                        padding: 0,
                        border: "none",
                        flex: 1,
                    } })),
            React.createElement("div", null,
                React.createElement("div", { style: { color: "white" } },
                    "Add to Table: ",
                    React.createElement("button", { onClick: addToTable, style: { height: 20, width: 20 } }))))));
};
const addToTable = async () => {
    const players = ["somie", "ohdevil", "andorite", "clemintina", "xpinkk", "ice4cherry", "kekca", "kelnis", "akiaura", "waelle", "lcya", "helne"];
    for (const name of players) {
        store.dispatch(getPlayerHypixelData({ name }));
    }
};
export default AppTable;
//# sourceMappingURL=App.js.map