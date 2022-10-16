// eslint-disable-next-line import/named
import { ColDef, ColumnApi, ColumnMovedEvent, ColumnResizedEvent, GetRowIdParams, GridColumnsChangedEvent, GridOptions, GridReadyEvent, RowDataUpdatedEvent, RowNode, SortChangedEvent } from "ag-grid-community";
import "@assets/scss/app.scss";
import "@assets/index.css";
import React, { useEffect } from "react";
import { Player } from "@common/utils/PlayerUtils";
import { AgGridReact } from "ag-grid-react";
import { assertDefaultError } from "@common/helpers";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import PlayerName from "@common/utils/player/PlayerName";
import PlayerStar from "@common/utils/player/PlayerStar";
import PlayerTags from "@common/utils/player/PlayerTags";
import PlayerWinstreak from "@common/utils/player/PlayerWinstreak";
import RenderRatioColour from "@common/utils/player/RenderRatioColour";
import RenderCoreStatsColour from "@common/utils/player/RenderCoreStatsColour";
import { TableState } from "@common/utils/Schemas";
import PlayerHead from "@common/utils/player/PlayerHead";
import PlayerSession from "@common/utils/player/PlayerSession";
import { Box } from "@mui/material";
import PlayerGuild from "@common/utils/player/PlayerGuild";

let columnApi: ColumnApi;

const tinyColumnSize = 30;

export const defaultColDef: ColDef = {
    resizable: true,
    sortingOrder: ["desc", "asc"],
    sortable: true,
    flex: 1,
    minWidth: tinyColumnSize,
};

export const columnDefs: ColDef[] = [
    {
        field: "head",
        sortable: false,
        cellRenderer: ({ data }) => <PlayerHead player={data} />,
    },
    {
        field: "star",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "star"),
        cellRenderer: ({ data }) => <PlayerStar player={data} />,
    },
    {
        field: "name",
        type: "string",
        minWidth: 150,
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "name"),
        cellRenderer: ({ data }) => <PlayerName player={data} isOverlayStats={false} />,
    },
    {
        field: "tags",
        cellRenderer: ({ data }) => <PlayerTags player={data} />,
        sortable: false,
    },
    {
        field: "WS",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "winstreak"),
        cellRenderer: ({ data }) => <PlayerWinstreak player={data} />,
    },
    {
        field: "FKDR",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "fkdr"),
        cellRenderer: ({data}) => <RenderRatioColour player={data} ratio={"fkdr"} />,
    },
    {
        field: "WLR",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wlr"),
        cellRenderer: ({data}) => <RenderRatioColour player={data} ratio={"wlr"} />,
    },
    {
        field: "BBLR",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "bblr"),
        cellRenderer: ({data}) => <RenderRatioColour player={data} ratio={"bblr"} />,
    },
    {
        field: "wins",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wins"),
        cellRenderer: ({data}) => <RenderCoreStatsColour player={data} stat={"wins"} />,
    },
    {
        field: "losses",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "losses"),
        cellRenderer: ({data}) => <RenderCoreStatsColour player={data} stat={"losses"} />,
    },
    {
        field: "final_kills",
        headerName: "Final Kills",
        hide: true,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "finalkills"),
        cellRenderer: ({data}) => <RenderCoreStatsColour player={data} stat={"finalKills"} />,
    },
    {
        field: "session",
        type: "number",
        sortable: false,
        cellRenderer: ({data}) => <PlayerSession player={data} />,
    },
    {
        field: "guild",
        type: "string",
        sortable: false,
        cellRenderer: ({data}) => <PlayerGuild player={data} />,
    },
];

const sortData = (valueA, valueB, nodeA: RowNode, nodeB: RowNode, isDescending, sortingData: "star" | "name" | "winstreak" | "fkdr" | "wlr" | "bblr" | "wins" | "losses" | "finalkills") => {
    const p1: Player = nodeA.data,
        p2: Player = nodeB.data;
    if (p1.sources.runApi?.data.data?.blacklist?.tagged || p1.nicked) {
        return isDescending ? 1 : -1;
    } else if (p2.sources.runApi?.data.data?.blacklist?.tagged || p2.nicked) {
        return isDescending ? -1 : 1;
    }

    let player1, player2;
    switch (sortingData) {
        case "star":
            return (p1?.hypixelPlayer?.achievements?.bedwars_level ?? 0) - (p2?.hypixelPlayer?.achievements?.bedwars_level ?? 0);
        case "name":
            return p1.name.localeCompare(p2.name);
        case "winstreak":
            player1 = p1?.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0;
            player2 = p2?.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0;
            if (p1.sources.keathiz != undefined && player1 == 0) player1 = p1?.sources?.keathiz?.data?.player?.winstreak?.estimates?.overall_winstreak ?? 0;
            if (p2.sources.keathiz != undefined && player2 == 0) player2 = p2?.sources?.keathiz?.data?.player?.winstreak?.estimates?.overall_winstreak ?? 0;
            return player1 - player2;
        case "fkdr":
            return (p1?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars ?? 0);
        case "wlr":
            return (p1?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0);
        case "bblr":
            return (p1?.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars ?? 0);
        case "wins":
            return (p1?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0);
        case "losses":
            return (p1?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0);
        case "finalkills":
            return (p1?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0);
        default:
            assertDefaultError(sortingData);
    }
    return 0;
};

// a2db40d5-d629-4042-9d1a-6963b2a7e000
const AppTable = () => {
    /**
     * Creates the rendered Homepage
     * All **css** is done in {@link assets/scss/app}
     * All processing is done in {@link store}
     */
    const {columnState} = useConfigStore((state) => ({columnState: state.table.columnState}));
    const {players} = usePlayerStore((state) => ({players: state.players}))
    let onGridReady = false;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onSaveGridColumnState = (e: ColumnApi) => {
        const columnState = e.getColumnState();
        const res: TableState = {columnState};
        if (onGridReady) useConfigStore.getState().setTableState(res);
    };

    const onSortingOrderChange = (e: SortChangedEvent<Player>) => {
        const columnState = e.columnApi.getColumnState();
        useConfigStore.getState().setTableState({columnState});
    };

    const gridOptions: GridOptions<Player> = {
        onGridReady(event: GridReadyEvent) {
            columnApi = event.columnApi;
            columnApi.applyColumnState({ state: columnState, applyOrder: true });
            event.api.setRowData(players);
            onGridReady = true;
            this.suppressDragLeaveHidesColumns = true;
        },
        onGridColumnsChanged(event: GridColumnsChangedEvent) {
            onSaveGridColumnState(event.columnApi);
        },
        onColumnResized(event: ColumnResizedEvent<Player>) {
            onSaveGridColumnState(event.columnApi);
        },
        onSortChanged(event: SortChangedEvent<Player>) {
            onSortingOrderChange(event);
        },
        onColumnMoved(event: ColumnMovedEvent) {
            onSaveGridColumnState(event.columnApi);
        },
        onRowDataUpdated(event: RowDataUpdatedEvent<Player>) {
            event.api.redrawRows();
        },
        columnDefs,
        defaultColDef,
        animateRows: true,
        autoSizePadding: 0,
        rowData: players,
        rowHeight: 25,
        suppressCellFocus: true,
        suppressChangeDetection: false,
        overlayNoRowsTemplate: "No Players",
        getRowId: (params: GetRowIdParams<Player>) => params.data.name,
    };

    return (
        <Box height={"100vh"}>
            <div className="pl-1 pr-1 w-full h-full">
                <div className="ag-theme-alpine-dark" style={{ height: "89vh" }}>
                    <AgGridReact gridOptions={gridOptions} rowData={players} />
                </div>
            </div>
        </Box>
    );
};

export default AppTable;
