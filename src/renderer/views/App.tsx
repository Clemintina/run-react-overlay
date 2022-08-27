// eslint-disable-next-line import/named
import {ColDef, ColumnApi, ColumnMovedEvent, GetRowIdParams, GridApi, GridColumnsChangedEvent, GridOptions, GridReadyEvent, RowNode, SortChangedEvent} from "ag-grid-community";
import "@assets/scss/app.scss";
import "@assets/index.css";
import React from "react";
import {Player, PlayerUtils} from "@common/utils/PlayerUtils";
import {Interweave} from "interweave";
import {AgGridReact} from "ag-grid-react";
import {assertDefaultError} from "@common/helpers";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import PlayerName from "@common/utils/player/PlayerName";
import PlayerStar from "@common/utils/player/PlayerStar";
import PlayerTags from "@common/utils/player/PlayerTags";
import PlayerWinstreak from "@common/utils/player/PlayerWinstreak";
import RenderRatioColour from "@common/utils/player/RenderRatioColour";
import RenderCoreStatsColour from "@common/utils/player/RenderCoreStatsColour";
import {TableState} from "@common/utils/Schemas";

const playerFormatter = new PlayerUtils().getFormatPlayerInstance();
let gridApi: GridApi;
let columnApi: ColumnApi;

const tinyColumnSize = 30;
const smallColumnSize = 60;
const mediumColumnSize = 60;
const largeColumnSize = 130;
const extraLargeColumnSize = 200;

const defaultColDefs: ColDef = {
    resizable: true,
    sortingOrder: ["desc", "asc"],
    sortable: true,
};

const columns: ColDef[] = [
    {
        field: "id",
        hide: true,
        cellRenderer: ({data}) => data.uuid,
    },
    {
        field: "head",
        flex: 1,
        minWidth: tinyColumnSize,
        sortable: false,
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderPlayerHead(data)} />,
    },
    {
        field: "star",
        flex: 1,
        minWidth: smallColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "star"),
        cellRenderer: ({data}) => <PlayerStar player={data} />,
    },
    {
        field: "name",
        flex: 1,
        minWidth: extraLargeColumnSize,
        type: "string",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "name"),
        cellRenderer: ({data}) => <PlayerName player={data} isOverlayStats={false} />,
    },
    {
        field: "tags",
        flex: 1,
        minWidth: largeColumnSize,
        cellRenderer: ({data}) => <PlayerTags player={data} />,
        sortable: false,
    },
    {
        field: "WS",
        flex: 1,
        minWidth: smallColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "winstreak"),
        cellRenderer: ({data}) => <PlayerWinstreak player={data} />,
    },
    {
        field: "FKDR",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "fkdr"),
        cellRenderer: ({data}) => <RenderRatioColour player={data} ratio={"fkdr"} />,
    },
    {
        field: "WLR",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wlr"),
        cellRenderer: ({data}) => <RenderRatioColour player={data} ratio={"wlr"} />,
    },
    {
        field: "BBLR",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "bblr"),
        cellRenderer: ({data}) => <RenderRatioColour player={data} ratio={"bblr"} />,
    },
    {
        field: "wins",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wins"),
        cellRenderer: ({data}) => <RenderCoreStatsColour player={data} stat={"wins"} />,
    },
    {
        field: "losses",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "losses"),
        cellRenderer: ({data}) => <RenderCoreStatsColour player={data} stat={"losses"} />,
    },
    {
        field: "session",
        flex: 1,
        minWidth: smallColumnSize,
        type: "number",
        sortable: false,
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderSessionTime(data)} />,
    },
];

const sortData = (valueA, valueB, nodeA: RowNode, nodeB: RowNode, isDescending, sortingData: "star" | "name" | "winstreak" | "fkdr" | "wlr" | "bblr" | "wins" | "losses") => {
    const p1: Player = nodeA.data,
        p2: Player = nodeB.data;
    if (p1.sources.runApi?.data.data.blacklist.tagged || p1.nicked) {
        return isDescending ? 1 : -1;
    } else if (p2.sources.runApi?.data.data.blacklist.tagged || p2.nicked) {
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
    const {columnState, browserWindow} = useConfigStore((state) => ({columnState: state.table.columnState, browserWindow: state.browserWindow}));
    const players: Array<Player> = usePlayerStore((state) => state.players) ?? [];
    let onGridReady = false;

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
            gridApi = event.api;
            columnApi.applyColumnState({state: columnState, applyOrder: true});
            event.api.setRowData(players);
            onGridReady = true;
        },
        onGridColumnsChanged(event: GridColumnsChangedEvent) {
            onSaveGridColumnState(event.columnApi);
        },
        onSortChanged(event: SortChangedEvent<Player>) {
            onSortingOrderChange(event);
        },
        onColumnMoved(event: ColumnMovedEvent) {
            onSaveGridColumnState(event.columnApi);
        },
        columnDefs: columns,
        defaultColDef: defaultColDefs,
        animateRows: true,
        autoSizePadding: 0,
        rowData: players,
        rowHeight: 25,
        overlayNoRowsTemplate: "No Players",
        getRowId: (params: GetRowIdParams<Player>) => params.data.name,
    };

    const backgroundStyle = {
        height: browserWindow.height - 38,
        OverflowX: "hidden",
    };

    return (
        <div>
            <div style={backgroundStyle}>
                <div className="w-full h-full">
                    <div className="ag-theme-alpine-dark" style={backgroundStyle}>
                        <AgGridReact gridOptions={gridOptions} rowData={players} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppTable;
