import "@assets/scss/app.scss";
import React, {useEffect, useState} from "react";
import store, {Store} from "@renderer/store";
import {useSelector} from "react-redux";
import {Player, PlayerUtils} from "@common/utils/PlayerUtils";
import {Interweave} from "interweave";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import {TypeColumn} from "@inovua/reactdatagrid-community/types/TypeColumn";
import "@inovua/reactdatagrid-community/index.css";
import {StatsisticsTooltip} from "@components/tooltips/StatisticsTooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";

const playerFormatter = new PlayerUtils().getFormatPlayerInstance();

const smallColumnSize = 60;
const mediumColumnSize = 70;
const largeColumnSize = 150;
const extraLargeColumnSize = 200;

const columns: TypeColumn[] = [
    {
        id: "id",
        header: "ID",
        defaultVisible: false,
        showInContextMenu: false,
        render: ({data}) => data.uuid,
    },
    {
        id: "star",
        header: "Star",
        flex: 1,
        sortName: `Player's Bedwars Level`,
        sortable: true,
        minWidth: smallColumnSize,
        type: 'number',
        render: ({data}) => <Interweave content={playerFormatter.renderStar(data)}/>,
    },
    {
        id: "name",
        header: "Name",
        flex: 1,
        minWidth: extraLargeColumnSize,
        sortName: `Name of the Player`,
        type: 'string',
        render: ({data}) => (
            <StatsisticsTooltip player={data}>
                <Interweave content={playerFormatter.renderName(data)}/>
            </StatsisticsTooltip>
        ),
    },
    {
        id: "tags",
        header: "Tag",
        flex: 1,
        minWidth: largeColumnSize,
        sortName: `Tags for the Overlay`,
        render: ({data}) => {
            return <Interweave content={playerFormatter.renderTags(data)}/>;
        },
        sortable: false,
    },
    {
        id: "winstreak",
        header: "WS",
        flex: 1,
        sortName: `Player's Winstreak`,
        minWidth: smallColumnSize,
        type: 'number',
        render: ({data}) => <Interweave content={playerFormatter.renderWinstreak(data)}/>,
    },
    {
        id: "fkdr",
        header: "FKDR",
        flex: 1,
        sortName: `Player's Final Kill to Death Ratio`,
        defaultWidth: mediumColumnSize,
        type: 'number',
        render: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "fkdr")}/>,
    },
    {
        id: "wlr",
        header: "WLR",
        flex: 1,
        sortName: `Player's Win to Loss Ratio`,
        minWidth: mediumColumnSize,
        type: 'number',
        render: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "wlr")}/>,
    },
    {
        id: "bblr",
        header: "BBLR",
        flex: 1,
        sortName: `Player's Beds Broken to Beds Lost Ratio`,
        minWidth: mediumColumnSize,
        type: 'number',
        render: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "bblr")}/>,
    },
    {
        id: "wins",
        header: "Wins",
        flex: 1,
        sortName: `Player's Wins`,
        defaultWidth: mediumColumnSize,
        type: 'number',
        render: ({data}) => <Interweave content={playerFormatter.renderCoreStatsColour(data, "wins")}/>,
    },
    {
        id: "losses",
        header: "Losses",
        flex: 1,
        sortName: `Player's Losses`,
        minWidth: mediumColumnSize,
        type: 'number',
        render: ({data}) => <Interweave content={playerFormatter.renderCoreStatsColour(data, "losses")}/>,
    },
    {
        id: "session",
        header: "Time",
        flex: 1,
        sortName: `Player's Session Time`,
        minWidth: smallColumnSize,
        type: 'number',
        render: ({data}) => <Interweave content={playerFormatter.renderSessionTime(data)}/>,
    }
];

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
    const localStore: Store = useSelector(() => store.getState())
    const players: Array<Player> = localStore.playerStore.players;
    const tagStore = localStore.playerStore.tagStore;
    playerFormatter.setConfig({tags: tagStore.tags, config: tagStore.config});

    const renderSortTool = (direction) => {
        return (<div>
            {direction === -1 ? <FontAwesomeIcon icon={faArrowUp}/> : <FontAwesomeIcon icon={faArrowDown}/>}
        </div>)
    }

    const renderRowContextMenu = (menuProps, {rowProps}) => {
        menuProps.autoDismiss = true;
        menuProps.items = [
            {
                label: "Hi " + rowProps.rowIndex,
            },
        ];
    };

    const renderColumnContextMenu = (menuProps, rowProps) => {
        menuProps.items = [
            {
                label: "Row " + rowProps.rowIndex,
            },
        ];
    };

    const gridStyle = {
        minHeight: localStore.configStore.browserWindow.height - 40,
    };

    return (
        <div>
            <div className='w-full h-full'>
                <span className='overflow-hidden'>
                <ReactDataGrid theme='default-dark' className='overflow-hidden'
                               dataSource={players} columns={columns} rowHeight={33}
                               idProperty='name' emptyText='No Players' style={gridStyle} showColumnMenuTool={true}
                               renderRowContextMenu={renderRowContextMenu} showColumnMenuLockOptions={false} showColumnMenuGroupOptions={false}
                               showColumnMenuToolOnHover={true} enableColumnAutosize={true}
                               renderSortTool={renderSortTool}
                               onColumnOrderChange={(columnOrder) => {
                                   console.log(columnOrder)
                               }}
                               allowUnsort={false}
                               onSortInfoChange={(sortInfo) => {
                                   console.log(sortInfo)
                               }}
                />
                </span>
            </div>
        </div>
    );
};

export default AppTable;
