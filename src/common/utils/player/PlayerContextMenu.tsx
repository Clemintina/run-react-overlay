// eslint-disable-next-line import/named
import React, { useState } from "react";
import { Player } from "@common/utils/PlayerUtils";

export interface PlayerContextMenu {
    player: Player;
}

const PlayerContextMenu: React.ElementType = ({ player }: PlayerContextMenu) => {
    const [contextPosition, setContextPosition] = useState({ posX: 0, posY: 0 });
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        setContextPosition({ posX: event.pageX, posY: event.pageY });
    });

    return (
        <span style={{ top: contextPosition.posY, left: contextPosition.posX }}>
            <img src={`https://crafatar.com/avatars/${player.hypixelPlayer?.uuid}?size=16&overlay=true`} className='text-center' alt='player-head' />
        </span>
    );
};

export default PlayerContextMenu;
