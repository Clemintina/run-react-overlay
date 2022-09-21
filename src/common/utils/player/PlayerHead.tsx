// eslint-disable-next-line import/named
import React from "react";
import { Player } from "@common/utils/PlayerUtils";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface PlayerHead {
    player: Player;
}

const PlayerHead: React.ElementType = ({ player }: PlayerHead) => {
    const { configStore } = useConfigStore((state) => ({ configStore: state }));
    let lunarRenderer: JSX.Element = <span />;

    let srcUrl = `https://crafatar.com/avatars/${player.hypixelPlayer?.uuid}?size=16&overlay=true`;

    if (player?.nicked) {
        srcUrl = `https://crafatar.com/avatars/27b15dca2d5d4a47b36d5e87bb46c2a3?size=16&overlay=true`;
    }

    if (!player?.nicked) {
        if (configStore.settings.lunar) {
            if (player.sources.lunar !== undefined && player.sources.lunar !== null && player.sources.lunar.status == 200) {
                if (player.sources.lunar.data.player.online) {
                    if (player.sources.lunar.data.player.lunarPlus.premium) {
                        lunarRenderer = (
                            <span>
                                <img width='20px' height='20px' src='https://dl.seraph.si/lunarplus.webp' alt='lunar tag' />
                            </span>
                        );
                    }
                    else {
                    lunarRenderer = (
                        <span>
                            <img width='20px' height='20px' src='https://img.icons8.com/nolan/512/ffffff/lunar-client.png' alt='lunar tag' />
                        </span>
                    );
                    }
                }
            }
        }
    }



    return (
        <span className='inline flex'>
            <img src={srcUrl} className='text-center' alt='player-head' />
            {lunarRenderer}
        </span>
    );
};

export default PlayerHead;
