// eslint-disable-next-line import/named
import React from "react";
import { Player } from "@common/utils/PlayerUtils";
import { Components, MinecraftColourAsHex, MinecraftFormatting } from "@common/zikeji";
import Guild = Components.Schemas.Guild;

export interface PlayerSession {
    player: Player;
}

const PlayerSession: React.ElementType = ({ player }: PlayerSession) => {
    let guildRenderer = <span />;
    if (player.hypixelGuild != null) {
        const guild: Guild = player.hypixelGuild.data;
        guildRenderer = <span
            style={{ color: `#${MinecraftColourAsHex[MinecraftFormatting[guild?.tagColor ?? "§7"]]}` }}>{guild.tag}</span>;
    }

    return <span>{guildRenderer}</span>;
};

export default PlayerSession;
