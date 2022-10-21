// eslint-disable-next-line import/named
import React, { useEffect, useState } from "react";
import { Player } from "@common/utils/PlayerUtils";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface PlayerSession {
    player: Player;
}

const PlayerSession: React.ElementType = ({ player }: PlayerSession) => {
    const values: [string, string][] = [];
    const [timer, setTimer] = useState(0);
    const { table } = useConfigStore((state) => ({ table: state.table }));

    useEffect(() => {
        if (player?.hypixelPlayer?.lastLogout) {
            setTimeout(() => {
                setTimer(new Date().getUTCMilliseconds());
            }, 1000);
        }
    }, [timer]);

    if (player.hypixelPlayer != null) {
        if (player.hypixelPlayer.lastLogin == null || player.hypixelPlayer.lastLogout == null) {
            values.push(["N/A", "ff0000"]);
        } else {
            const lastLoginDate: Date = new Date(0);
            lastLoginDate.setUTCMilliseconds(player.hypixelPlayer.lastLogin);
            const now_timezoned: Date = new Date();
            const now = new Date();
            now.setUTCMilliseconds(now_timezoned.getUTCMilliseconds());

            if (player.hypixelPlayer.lastLogin > player.hypixelPlayer.lastLogout) {
                const timeDiff = new Date(now_timezoned.getTime() - lastLoginDate.getTime());
                if ((timeDiff.getUTCHours() >= 3 && timeDiff.getUTCMinutes() >= 30) || timeDiff.getUTCHours() > 4) {
                    values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "00ff00"]);
                } else if ((timeDiff.getUTCHours() >= 0 && timeDiff.getUTCMinutes() >= 30) || timeDiff.getUTCHours() > 2) {
                    values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "ffff00"]);
                } else {
                    values.push([`${timeDiff.getUTCHours()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCMinutes()}`.padStart(2, "0") + ":" + `${timeDiff.getUTCSeconds()}`.padStart(2, "0"), "ff0000"]);
                }
            } else {
                values.push(["Offline", "ff0000"]);
            }
        }
    }

    return (
        <div style={{textAlign: table.settings.textAlign}}>
            {values.map(([session_timer,hex], index) => (
                <span key={index} style={{color: `#${hex}`}}>
                    {session_timer}
                </span>
            ))}
        </div>
    );
};

export default PlayerSession;
