import "@assets/scss/app.scss";
import React from "react";
import store from "@renderer/store";
import {useSelector} from "react-redux";
import {FormatPlayer, Player} from "@common/utils/PlayerUtils";
import {Interweave} from "interweave";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import {TypeColumn} from "@inovua/reactdatagrid-community/types/TypeColumn";

import "@inovua/reactdatagrid-community/index.css";

const playerFormatter = new FormatPlayer();

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
        render: ({data}) => <Interweave content={playerFormatter.renderStar(data)} />,
    },
    {
        id: "name",
        header: "Name",
        flex: 1,
        minWidth: 200,
        sortName: `Name of the Player`,
        render: ({data}) => <Interweave content={playerFormatter.renderName(data)} />,
    },
    {
        id: "tags",
        header: "Tag",
        flex: 1,
        minWidth: 100,
        sortName: `Tags for the Overlay`,
        render: ({data}) => <Interweave content={playerFormatter.renderTags(data)} />,
        sortable: false,
    },
    {
        id: "winstreak",
        header: "WS",
        flex: 1,
        sortName: `Player's Winstreak`,
        render: ({data}) => <Interweave content={playerFormatter.renderWinstreak(data)} />,
    },
    {
        id: "fkdr",
        header: "FKDR",
        flex: 1,
        sortName: `Player's Final Kill to Death Ratio`,
        render: ({data}) => <Interweave content={playerFormatter.renderFKDRColour(data)} />,
    },
    {
        id: "wlr",
        header: "WLR",
        flex: 1,
        sortName: `Player's Win to Loss Ratio`,
        render: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "wlr")} />,
    },
    {
        id: "bblr",
        header: "BBLR",
        flex: 1,
        sortName: `Player's Beds Broken to Beds Lost Ratio`,
        render: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "bblr")} />,
    },
    {
        id: "wins",
        header: "Wins",
        flex: 1,
        sortName: `Player's Wins`,
        render: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "bblr")} />,
    },
    {
        id: "losses",
        header: "Losses",
        flex: 1,
        sortName: `Player's Losses`,
        render: ({data}) => <Interweave content={playerFormatter.renderRatioColour(data, "bblr")} />,
    },
];

const gridStyle = {
    minHeight: 550,
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
    const players: Array<Player> = useSelector(() => store.getState().playerStore.players);

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

    return (
        <div>
            <div style={{height: "92vh", width: "100%", color: "grey"}}>
                <ReactDataGrid theme='default-dark' dataSource={players} columns={columns} rowHeight={33} idProperty='name' style={gridStyle} showColumnMenuTool={false} renderRowContextMenu={renderRowContextMenu} showColumnMenuLockOptions={false} showColumnMenuGroupOptions={false} showColumnMenuToolOnHover={true} />
            </div>
        </div>
    );
};

export default AppTable;
