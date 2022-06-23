import "@assets/scss/app.scss";
import React from "react";
import store from "@renderer/store";
import {getPlayerHypixelData} from "@renderer/store/PlayerStore";
// eslint-disable-next-line import/named
import {DataGrid, GridCellParams, GridColDef} from "@mui/x-data-grid";
import {useSelector} from "react-redux";
import {FormatPlayer, Player} from "@common/utils/PlayerUtils";
import {Interweave} from "interweave";
import {createTheme, ThemeProvider} from "@mui/material";

const playerFormatter = new FormatPlayer();

const columns: GridColDef<Player>[] = [
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
        renderCell: (params) => <Interweave content={playerFormatter.renderStar(params.row)} />,
        valueGetter: (params) => {
            if (params.row.nicked) {
                return getNickedPlayerSortingResponse(params);
            } else {
                return params.row.hypixelPlayer?.achievements?.bedwars_level || 0;
            }
        },
    },
    {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 200,
        description: `Name of the Player`,
        renderCell: (params) => <Interweave content={playerFormatter.renderName(params.row)} />,
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
        renderCell: (params) => <Interweave content={playerFormatter.renderTags(params.row)} />,
        sortable: false,
    },
    {
        field: "winstreak",
        headerName: "WS",
        flex: 1,
        description: `Player's Winstreak`,
        renderCell: (params) => <Interweave content={playerFormatter.renderWinstreak(params.row)} />,
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : params.row.hypixelPlayer?.stats?.Bedwars?.winstreak || 0;
        },
    },
    {
        field: "fkdr",
        headerName: "FKDR",
        flex: 1,
        description: `Player's Final Kill to Death Ratio`,
        renderCell: (params) => <Interweave content={playerFormatter.renderFKDRColour(params.row)} />,
        valueFormatter: ({value}) => value.toFixed(2),
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : (params.row.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars || 0) / (params.row.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars || 0) || 0;
        },
    },
    {
        field: "wlr",
        headerName: "WLR",
        flex: 1,
        description: `Player's Win to Loss Ratio`,
        renderCell: (params) => <Interweave content={playerFormatter.renderRatioColour(params.row, "wlr")} />,
        valueFormatter: ({value}) => value.toFixed(2),
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : (params.row.hypixelPlayer?.stats?.Bedwars?.wins_bedwars || 0) / (params.row.hypixelPlayer?.stats?.Bedwars?.losses_bedwars || 0) || 0;
        },
    },
    {
        field: "bblr",
        headerName: "BBLR",
        flex: 1,
        description: `Player's Beds Broken to Beds Lost Ratio`,
        renderCell: (params) => <Interweave content={playerFormatter.renderRatioColour(params.row, "bblr")} />,
        valueFormatter: ({value}) => value.toFixed(2),
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : (params.row.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars || 0) / (params.row.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars || 0) || 0;
        },
    },
    {
        field: "wins",
        headerName: "Wins",
        flex: 1,
        description: `Player's Wins`,
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : params.row.hypixelPlayer?.stats?.Bedwars?.wins_bedwars || 0;
        },
    },
    {
        field: "losses",
        headerName: "Losses",
        flex: 1,
        description: `Player's Losses`,
        valueGetter: (params) => {
            return params.row.nicked ? getNickedPlayerSortingResponse(params) : params.row.hypixelPlayer?.stats?.Bedwars?.losses_bedwars || 0;
        },
    },
];

const getNickedPlayerSortingResponse = (params: GridCellParams) => {
    return 0;
};

// a2db40d5-d629-4042-9d1a-6963b2a7e000

const AppTable = () => {
    /**
     * Creates the rendered Homepage
     * All **css** is done in {@link assets/scss/app}
     * All processing is done in {@link store}
     */
    const players: Array<Player> = useSelector(() => store.getState().playerStore.players);
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

    return (
        <div>
            <div style={{height: "92vh", width: "100%"}}>
                <ThemeProvider theme={theme}>
                    <DataGrid
                        className='mainTable'
                        getRowId={(row: Player) => row.name}
                        rows={players}
                        columns={columns}
                        hideFooter={true}
                        rowHeight={33}
                        disableSelectionOnClick
                        sx={{
                            padding: 0,
                            border: "none",
                            flex: 1,
                        }}
                    />
                </ThemeProvider>
            </div>
        </div>
    );
};

export default AppTable;
