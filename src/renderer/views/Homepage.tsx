// eslint-disable-next-line import/named
import { ColDef, ColumnApi, ColumnMovedEvent, ColumnResizedEvent, GetRowIdParams, GridColumnsChangedEvent, GridOptions, GridReadyEvent, RowNode, RowDataUpdatedEvent, SortChangedEvent, IRowNode } from "ag-grid-community";
import "@assets/scss/app.scss";
import "@assets/index.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import React, { useEffect } from "react";
import { Player, PlayerUtils } from "@common/utils/PlayerUtils";
import { AgGridReact } from "ag-grid-react";
import { assertDefaultError } from "@common/helpers";
import usePlayerStore from "@renderer/store/PlayerStore";
import useConfigStore from "@renderer/store/ConfigStore";
import { alpha, Box } from "@mui/material";
import { Interweave } from "interweave";
import { AppInformation } from "@common/utils/Schemas";
import { PlayerGuildComponent, PlayerHeadComponent, PlayerNameComponent, PlayerNetworkLevel, PlayerRankedBedwarsRating, PlayerSessionComponent, PlayerStarComponent, PlayerTagsComponent, PlayerWinstreakComponent } from "@components/PlayerComponents";
import { RenderCoreStatsColour, RenderRatioColour } from "@components/TagComponents";
import { CustomHeader } from "@components/AppComponents";
import { PlayerMenuOption } from "@components/BaseComponents";
import { getPlayerRank } from "@common/zikeji";
import { OverlayTooltip } from "@components/TooltipComponents";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";

let columnApi: ColumnApi;
const tinyColumnSize = 30;

export const defaultColDefBase: ColDef<Player> = {
	resizable: true,
	sortingOrder: ["desc", "asc"],
	sortable: true,
	flex: 1,
	minWidth: tinyColumnSize,
	headerComponent: "agColumnHeader"
};

export const columnDefsBase: ColDef<Player>[] = [
	{
		field: "head",
		sortable: false,
		cellRenderer: ({ data }) => <PlayerHeadComponent player={data} />
	},
	{
		field: "star",
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "star"),
		cellRenderer: ({ data }) => <PlayerStarComponent player={data} />
	},
	{
		field: "name",
		minWidth: 150,
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "name"),
		cellRenderer: ({ data }) => <PlayerNameComponent player={data} />
	},
	{
		field: "tags",
		cellRenderer: ({ data }) => <PlayerTagsComponent player={data} />,
		sortable: false
	},
	{
		field: "WS",
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "winstreak"),
		cellRenderer: ({ data }) => <PlayerWinstreakComponent player={data} />
	},
	{
		field: "FKDR",
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "fkdr"),
		cellRenderer: ({ data }) => <RenderRatioColour player={data} ratio={"fkdr"} />
	},
	{
		field: "WLR",
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wlr"),
		cellRenderer: ({ data }) => <RenderRatioColour player={data} ratio={"wlr"} />
	},
	{
		field: "KDR",
		hide: true,
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "KDR"),
		cellRenderer: ({ data }) => <RenderRatioColour player={data} ratio={"kdr"} />
	},
	{
		field: "BBLR",
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "bblr"),
		cellRenderer: ({ data }) => <RenderRatioColour player={data} ratio={"bblr"} />
	},
	{
		field: "wins",
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "wins"),
		cellRenderer: ({ data }) => <RenderCoreStatsColour player={data} stat={"wins"} />
	},
	{
		field: "losses",
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "losses"),
		cellRenderer: ({ data }) => <RenderCoreStatsColour player={data} stat={"losses"} />
	},
	{
		field: "final_kills",
		headerName: "Final Kills",
		hide: true,
		comparator: (valueA, valueB, nodeA, nodeB, isInverted) => sortData(valueA, valueB, nodeA, nodeB, isInverted, "finalkills"),
		cellRenderer: ({ data }) => <RenderCoreStatsColour player={data} stat={"finalKills"} />
	},
	{
		field: "session",
		sortable: false,
		cellRenderer: ({ data }) => {
			const player = data;
			const playerStats = player.hypixelPlayer?.stats?.Bedwars;
			const polsuSession = player?.sources?.polsu?.sessions ? player.sources.polsu.sessions.data : undefined;
			
			const playerFormatter = new PlayerUtils();
			
			return (
				<OverlayTooltip
					player={player}
					tooltip={
						<div>
							{polsuSession && player.hypixelPlayer && player.hypixelPlayer?.stats?.Bedwars && (
								<div className={"statistics-tooltip text-center"}>
									<span className={"statistics-tooltip-inline"} style={{ color: `#${getPlayerRank(player.hypixelPlayer).colourHex}` }}>
										{player.hypixelPlayer.displayname}
									</span>
									<div>
										<div className={"statistics-tooltip-inline"}>Games Played: {(playerStats?.games_played_bedwars ?? 1) - (polsuSession?.games?.total ?? 1)}</div>
										<div className={"statistics-tooltip-inline"}>Wins: {(playerStats?.wins_bedwars ?? 1) - (polsuSession?.stats.wins ?? 1)}</div>
										<div className={"statistics-tooltip-inline"}>Losses: {(playerStats?.losses_bedwars ?? 1) - (polsuSession?.stats.losses ?? 1)}</div>
										<br />
										<div className={"statistics-tooltip-inline"}>Final Kills: {(playerStats?.final_kills_bedwars ?? 1) - (polsuSession?.stats.fkills ?? 1)}</div>
										<div className={"statistics-tooltip-inline"}>Final Deaths: {(playerStats?.final_deaths_bedwars ?? 1) - (polsuSession?.stats.fdeaths ?? 1)}</div>
										<br />
										<div className={"statistics-tooltip-inline"}>Beds Broken: {(playerStats?.beds_broken_bedwars ?? 1) - (polsuSession?.stats.bbroken ?? 1)}</div>
										<div className={"statistics-tooltip-inline"}>Beds Lost: {(playerStats?.beds_lost_bedwars ?? 1) - (polsuSession?.stats.blost ?? 1)}</div>
										<br />
										<div className={"statistics-tooltip-inline"}>Kills: {(playerStats?.kills_bedwars ?? 1) - (polsuSession?.stats.kills ?? 1)}</div>
										<div className={"statistics-tooltip-inline"}>Deaths: {(playerStats?.deaths_bedwars ?? 1) - (polsuSession?.stats.deaths ?? 1)}</div>
										<br />
										<div className={"statistics-tooltip-inline"}>Session started: {playerFormatter.getPlayerHypixelUtils().getDateFormatted(polsuSession?.started ? polsuSession.started * 1000 : 0, undefined, { hour12: false, dateStyle: "full" })}</div>
									</div>
								</div>
							)}
						</div>
					}
				>
					<PlayerSessionComponent player={data} />
				</OverlayTooltip>
			);
		}
	},
	{
		field: "guild",
		sortable: false,
		hide: true,
		cellRenderer: ({ data }) => <PlayerGuildComponent player={data} />
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
		}
	},
	{
		field: "report",
		headerName: "Extra",
		sortable: false,
		cellRenderer: ({ data }) => {
			return <PlayerMenuOption player={data} />;
		}
	},
	{
		field: "NWL",
		sortable: false,
		hide: true,
		cellRenderer: ({ data }) => {
			return <PlayerNetworkLevel player={data} />;
		}
	},
	{
		field: "RBW",
		sortable: false,
		hide: true,
		cellRenderer: ({ data }) => {
			return <PlayerRankedBedwarsRating player={data} />;
		}
	}
];

const checkIfNich = (num1: number | undefined, num2: number | undefined, isDescending) => {
	if (num1 == undefined || isNaN(num1)) {
		return isDescending ? -1 : 1;
	} else if (num2 == undefined || isNaN(num2)) {
		return isDescending ? 1 : -1;
	} else if (num1 == 0 && num2 != 0) {
		return isDescending ? 1 : -1;
	} else if (num2 == 0 && num1 != 0) {
		return isDescending ? -1 : 1;
	} else {
		return num1 - num2;
	}
};

const sortData = (valueA, valueB, nodeA: IRowNode, nodeB: IRowNode, isDescending, sortingData: "star" | "name" | "winstreak" | "fkdr" | "wlr" | "KDR" | "bblr" | "wins" | "losses" | "finalkills") => {
	const p1 = nodeA.data,
		p2 = nodeB.data;
	
	if (p1 == undefined) {
		return isDescending ? 1 : -1;
	} else if (p2 == undefined) {
		return isDescending ? -1 : 1;
	} else if (p1.nicked) {
		return isDescending ? 1 : -1;
	} else if (p2.nicked) {
		return isDescending ? -1 : 1;
	} else if ("hypixelPlayer" in p1 && p1.sources.runApi?.data.blacklist?.tagged) {
		return isDescending ? 1 : -1;
	} else if ("hypixelPlayer" in p2 && p2.sources.runApi?.data.blacklist?.tagged) {
		return isDescending ? -1 : 1;
	} else {
		let player1, player2;
		switch (sortingData) {
			case "star":
				return checkIfNich(p1?.hypixelPlayer?.achievements?.bedwars_level ?? 0, p2?.hypixelPlayer?.achievements?.bedwars_level ?? 0, isDescending);
			case "name":
				return p1.name.localeCompare(p2.name);
			case "winstreak":
				player1 = p1?.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0;
				player2 = p2?.hypixelPlayer?.stats?.Bedwars?.winstreak ?? 0;
				if (p1.sources.keathiz != undefined && player1 == 0) player1 = p1?.sources?.keathiz?.data?.player?.winstreak?.estimates?.overall_winstreak ?? 0;
				if (p2.sources.keathiz != undefined && player2 == 0) player2 = p2?.sources?.keathiz?.data?.player?.winstreak?.estimates?.overall_winstreak ?? 0;
				return checkIfNich(player1, player2, isDescending);
			case "fkdr":
				return checkIfNich((p1?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars ?? 0), (p2?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.final_deaths_bedwars ?? 0), isDescending);
			case "wlr":
				return checkIfNich((p1?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0), (p2?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0), isDescending);
			case "KDR":
				return checkIfNich((p1?.hypixelPlayer?.stats?.Bedwars?.kills_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.deaths_bedwars ?? 0), (p2?.hypixelPlayer?.stats?.Bedwars?.kills_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.deaths_bedwars ?? 0), isDescending);
			case "bblr":
				return checkIfNich((p1?.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars ?? 0) / (p1?.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars ?? 0), (p2?.hypixelPlayer?.stats?.Bedwars?.beds_broken_bedwars ?? 0) / (p2?.hypixelPlayer?.stats?.Bedwars?.beds_lost_bedwars ?? 0), isDescending);
			case "wins":
				return checkIfNich(p1?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0, p2?.hypixelPlayer?.stats?.Bedwars?.wins_bedwars ?? 0, isDescending);
			case "losses":
				return checkIfNich(p1?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0, p2?.hypixelPlayer?.stats?.Bedwars?.losses_bedwars ?? 0, isDescending);
			case "finalkills":
				return checkIfNich(p1?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0, p2?.hypixelPlayer?.stats?.Bedwars?.final_kills_bedwars ?? 0, isDescending);
			default:
				assertDefaultError(sortingData);
		}
		return isDescending ? -1 : 1;
	}
};

window.ipcRenderer.on("updater", async (event, args) => {
	const appUpdater = JSON.parse(args).data as AppInformation;
	if (appUpdater.update.ready) {
		useConfigStore.getState().setErrorMessage({
			title: "Overlay Update",
			cause: "The overlay is ready to update, Restarting in 5 seconds",
			type: "SUCCESS"
		});
	} else if (appUpdater.update.updateAvailable) {
		useConfigStore.getState().setErrorMessage({
			title: "Overlay Update",
			cause: "An update is currently being downloaded!",
			type: "SUCCESS"
		});
	}
});

window.ipcRenderer.on("ready", async () => {
	if (window?.ipcRenderer) {
		const logs = useConfigStore.getState().logs;
		if (logs.readable) {
			window.ipcRenderer.send("logFileSet", useConfigStore.getState().logs.logPath);
		}
		
		const keybinds = useConfigStore.getState().keybinds;
		await window.ipcRenderer.invoke(IpcValidInvokeChannels.GLOBAL_KEYBINDS, keybinds);
	}
});

export default () => {
	const { columnState, table } = useConfigStore((state) => ({
		columnState: state.table.columnState,
		table: state.table
	}));
	const { players } = usePlayerStore((state) => ({ players: state.players }));
	
	let onGridReady = false;
	
	useEffect(() => {
		window.scrollTo(0, 0);
		useConfigStore.getState().setVersion();
	}, [players]);
	
	const defaultColDef = { ...defaultColDefBase };
	
	const columnDefs = [...columnDefsBase];
	
	const components = {
		agColumnHeader: CustomHeader
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
		onSortChanged(event: SortChangedEvent<Player>) {
			onSortingOrderChange(event);
		},
		onRowDataUpdated(event: RowDataUpdatedEvent<Player>) {
			event.api.redrawRows();
			useConfigStore.getState().setTableState({ ...table, columnState });
		},
		animateRows: false,
		autoSizePadding: 0,
		rowData: players,
		rowHeight: 25,
		suppressCellFocus: true,
		suppressChangeDetection: false,
		overlayNoRowsTemplate: "No Players",
		components,
		getRowId: (params: GetRowIdParams<Player>) => params.data.name
	};
	
	return (
		<Box height={"100vh"}>
			<div className="pl-1 pr-1 w-full h-full">
				<div className="" style={{ height: "89vh" }}>
					<AgGridReact gridOptions={gridOptions} rowData={players} defaultColDef={defaultColDef} columnDefs={columnDefs} components={components} />
				</div>
			</div>
		</Box>
	);
};
