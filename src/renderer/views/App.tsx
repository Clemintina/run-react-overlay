import "@assets/scss/app.scss";
import "@assets/index.css";
import React from "react";
import store, {Store} from "@renderer/store";
import {useSelector} from "react-redux";
import {Player, PlayerUtils} from "@common/utils/PlayerUtils";
import {Interweave} from "interweave";
import {StatsisticsTooltip} from "@components/tooltips/StatisticsTooltip";
import {AgGridReact} from "ag-grid-react";
import {ColDef, ColumnApi, ColumnMovedEvent, FirstDataRenderedEvent, GridApi, GridColumnsChangedEvent, GridOptions, GridReadyEvent, RowNode} from "ag-grid-community";
import {saveTableColumnState, TableState} from "@renderer/store/ConfigStore";

const playerFormatter = new PlayerUtils().getFormatPlayerInstance();

const smallColumnSize = 60;
const mediumColumnSize = 60;
const largeColumnSize = 130;
const extraLargeColumnSize = 200;

const defaultColDefs: ColDef = {
    resizable: true,
    sortingOrder: ["asc", "desc"],
    sortable: true,
};

const columns: ColDef[] = [
    {
        field: "id",
        hide: true,
        cellRenderer: ({data}) => data.uuid,
    },
    {
        field: "star",
        flex: 1,
        minWidth: smallColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "star"),
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderStar(data)} />,
    },
    {
        field: "name",
        flex: 1,
        minWidth: extraLargeColumnSize,
        type: "string",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "name"),
        cellRenderer: ({data}) => (
            <StatsisticsTooltip player={data}>
                <Interweave content={playerFormatter.renderName(data)} />
            </StatsisticsTooltip>
        ),
    },
    {
        field: "tags",
        flex: 1,
        minWidth: largeColumnSize,
        cellRenderer: ({data}) => {
            return <Interweave content={playerFormatter.renderTags(data)} />;
        },
        sortable: false,
    },
    {
        field: "WS",
        flex: 1,
        minWidth: smallColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "winstreak"),
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderWinstreak(data)} />,
    },
    {
        field: "FKDR",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "fkdr"),
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "fkdr")} />,
    },
    {
        field: "WLR",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wlr"),
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "wlr")} />,
    },
    {
        field: "BBLR",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "bblr"),
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "bblr")} />,
    },
    {
        field: "wins",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wins"),
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderCoreStatsColour(data, "wins")} />,
    },
    {
        field: "losses",
        flex: 1,
        minWidth: mediumColumnSize,
        type: "number",
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "losses"),
        cellRenderer: ({data}) => <Interweave content={playerFormatter.renderCoreStatsColour(data, "losses")} />,
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
    if (sortingData == "star") {
        return (p1?.hypixelPlayer?.achievements?.bedwars_level ?? 0) - (p2?.hypixelPlayer?.achievements?.bedwars_level ?? 0);
    } else if (sortingData == "name") {
        return p1.name.localeCompare(p2.name);
    } else if (sortingData == "winstreak") {
        return (p1?.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0);
    } else if (sortingData == "fkdr") {
        return (p1?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars ?? 0);
    } else if (sortingData == "wlr") {
        return (p1?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0);
    } else if (sortingData == "bblr") {
        return (p1?.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars ?? 0);
    } else if (sortingData == "wins") {
        return (p1?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0);
    } else if (sortingData == "losses") {
        return (p1?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0) - (p2?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0);
    }
    return 0;
};

const getNickedPlayerSortingResponse = (params) => {
    return 0;
};

// a2db40d5-d629-4042-9d1a-6963b2a7e000

const AppTable = () => {
    /**
     * Creates the rendered Homepage
     * All **css** is done in {@link assets/scss/app}
     * All processing is done in {@link store}
     */
    const localStore: Store = useSelector(() => store.getState());
    const players: Array<Player> = localStore.playerStore.players;
    const tagStore = localStore.playerStore.tagStore;
    playerFormatter.setConfig({tags: tagStore.tags, config: tagStore.config});

    const onSaveGridColumnState=(e:ColumnApi) =>{
        const columnState = e.getColumnState();
        const res: TableState = {columnState}
        store.dispatch(saveTableColumnState(res))
    }

    const gridOptions: GridOptions = {
        onGridReady(event: GridReadyEvent) {
            console.log(localStore.configStore.table.columnState);
            event.columnApi.applyColumnState({state: localStore.configStore.table.columnState, applyOrder: true});
        },
        onFirstDataRendered(event: FirstDataRenderedEvent) {
            event.columnApi.applyColumnState({state: localStore.configStore.table.columnState, applyOrder: true});

        },
        onGridColumnsChanged(event: GridColumnsChangedEvent) {
            onSaveGridColumnState(event.columnApi)
        },
        onColumnMoved(event: ColumnMovedEvent) {
            onSaveGridColumnState(event.columnApi)
        },
        columnDefs: columns,
        defaultColDef: defaultColDefs,
        animateRows: true,
        autoSizePadding: 0,
    };

    return (
        <div style={{backgroundColor: localStore.configStore.colours.backgroundColour, color: localStore.configStore.colours.primaryColour, opacity: 10}}>
            <div className='w-full h-full'>
                <div className=' ag-theme-alpine-dark' style={{height: localStore.configStore.browserWindow.height - 38, overflowX: "hidden"}}>
                    <AgGridReact gridOptions={gridOptions} rowData={players} />
                </div>
            </div>
        </div>
    );
};

export default AppTable;
