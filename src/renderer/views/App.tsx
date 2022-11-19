// eslint-disable-next-line import/named
import { ColDef, ColumnApi, ColumnMovedEvent, ColumnResizedEvent, GetRowIdParams, GridColumnsChangedEvent, GridOptions, GridReadyEvent, RowDataUpdatedEvent, RowNode, SortChangedEvent } from "ag-grid-community";
import "@assets/scss/app.scss";
import "@assets/index.css";
import React, { useEffect } from "react";
import { Player, PlayerUtils } from "@common/utils/PlayerUtils";
import { AgGridReact } from "ag-grid-react";
import { assertDefaultError } from "@common/helpers";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import RenderRatioColour from "@common/utils/player/RenderRatioColour";
import RenderCoreStatsColour from "@common/utils/player/RenderCoreStatsColour";
import { Box } from "@mui/material";
import CustomHeader from "@components/ui/table/CustomHeader";
import { Interweave } from "interweave";
import { AppInformation } from "@common/utils/Schemas";
import { PlayerGuildComponent, PlayerHeadComponent, PlayerNameComponent, PlayerSessionComponent, PlayerStarComponent, PlayerTagsComponent, PlayerWinstreakComponent } from "@common/utils/player/PlayerComponents";

let columnApi: ColumnApi;
const tinyColumnSize = 30;

export const defaultColDefBase: ColDef<Player> = {
    resizable: true,
    sortingOrder: ["desc", "asc"],
    sortable: true,
    flex: 1,
    minWidth: tinyColumnSize,
    headerComponent: "agColumnHeader",
};

export const columnDefsBase: ColDef<Player>[] = [
    {
        field: "head",
        sortable: false,
        cellRenderer: ({ data }) => <PlayerHeadComponent player={data} />,
    },
    {
        field: "star",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "star"),
        cellRenderer: ({ data }) => <PlayerStarComponent player={data} />,
    },
    {
        field: "name",
        type: "string",
        minWidth: 150,
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "name"),
        cellRenderer: ({ data }) => <PlayerNameComponent player={data} />,
    },
    {
        field: "tags",
        cellRenderer: ({ data }) => <PlayerTagsComponent player={data} />,
        sortable: false,
    },
    {
        field: "WS",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "winstreak"),
        cellRenderer: ({ data }) => <PlayerWinstreakComponent player={data} />,
    },
    {
        field: "FKDR",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "fkdr"),
        cellRenderer: ({ data }) => <RenderRatioColour player={data} ratio={"fkdr"} />,
    },
    {
        field: "WLR",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wlr"),
        cellRenderer: ({ data }) => <RenderRatioColour player={data} ratio={"wlr"} />,
    },
    {
        field: "KDR",
        type: "number",
        hide: true,
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "KDR"),
        cellRenderer: ({ data }) => <RenderRatioColour player={data} ratio={"kdr"} />,
    },
    {
        field: "BBLR",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "bblr"),
        cellRenderer: ({ data }) => <RenderRatioColour player={data} ratio={"bblr"} />,
    },
    {
        field: "wins",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wins"),
        cellRenderer: ({ data }) => <RenderCoreStatsColour player={data} stat={"wins"} />,
    },
    {
        field: "losses",
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "losses"),
        cellRenderer: ({ data }) => <RenderCoreStatsColour player={data} stat={"losses"} />,
    },
    {
        field: "final_kills",
        headerName: "Final Kills",
        hide: true,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "finalkills"),
        cellRenderer: ({ data }) => <RenderCoreStatsColour player={data} stat={"finalKills"} />,
    },
    {
        field: "session",
        type: "number",
        sortable: false,
        cellRenderer: ({ data }) => <PlayerSessionComponent player={data} />,
    },
    {
        field: "guild",
        type: "string",
        sortable: false,
        hide: true,
        cellRenderer: ({ data }) => <PlayerGuildComponent player={data} />,
    },
    {
        field: "first_login",
        headerName: "First Login",
        sortable: false,
        hide: true,
        cellRenderer: ({ data }) => {
            const playerFormatter = new PlayerUtils();
            return (
                <div style={{ textAlign: useConfigStore.getState().table.settings.textAlign }}>
                    <Interweave content={playerFormatter.getPlayerHypixelUtils().getDateFormatted(data?.hypixelPlayer?.firstLogin ?? 0)} isTooltip={false} />
                </div>
            );
        },
    },
];

const sortData = (valueA, valueB, nodeA: RowNode, nodeB: RowNode, isDescending, sortingData: "star" | "name" | "winstreak" | "fkdr" | "wlr" | "KDR" | "bblr" | "wins" | "losses" | "finalkills") => {
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
        case "KDR":
            return (p1?.hypixelPlayer?.stats?.Bedwars?.kills_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.deaths_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.kills_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.deaths_bedwars ?? 0);
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

window.ipcRenderer.on("updater", async (event, args) => {
    const appUpdater = JSON.parse(args).data as AppInformation;
    if (appUpdater.update.ready) {
        useConfigStore.getState().setErrorMessage({
            title: "Overlay Update",
            cause: "The overlay is ready to update, Restarting in 5 seconds",
        });
    } else if (appUpdater.update.updateAvailable) {
        useConfigStore.getState().setErrorMessage({
            title: "Overlay Update",
            cause: "An update is currently being downloaded!",
        });
    }
});

export default () => {
    const { columnState, table } = useConfigStore((state) => ({
        columnState: state.table.columnState,
        table: state.table,
    }));
    const { players } = usePlayerStore((state) => ({ players: state.players }));

    let onGridReady = false;

    useEffect(() => {
        window.scrollTo(0, 0);
        useConfigStore.getState().setVersion();
    }, []);

    const defaultColDef = { ...defaultColDefBase };

    const columnDefs = [...columnDefsBase];

    const frameworkComponents = {
        agColumnHeader: CustomHeader,
    };

    const onSaveGridColumnState = (e: ColumnApi) => {
        const columnState = e.getColumnState();
        if (onGridReady) useConfigStore.getState().setTableState({ ...table, columnState });
    };

    const onSortingOrderChange = (e: SortChangedEvent<Player>) => {
        const columnState = e.columnApi.getColumnState();
        useConfigStore.getState().setTableState({ ...table, columnState });
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
        animateRows: false,
        autoSizePadding: 0,
        rowData: players,
        rowHeight: 25,
        suppressCellFocus: true,
        suppressChangeDetection: false,
        overlayNoRowsTemplate: "No Players",
        components: frameworkComponents,
        getRowId: (params: GetRowIdParams<Player>) => params.data.name,
    };

    return (
        <Box height={"100vh"}>
            <div className='pl-1 pr-1 w-full h-full'>
                <div className='ag-theme-alpine-dark' style={{ height: "89vh" }}>
                    <AgGridReact gridOptions={gridOptions} rowData={players} defaultColDef={defaultColDef} columnDefs={columnDefs} components={frameworkComponents} />
                </div>
            </div>
        </Box>
    );
};
