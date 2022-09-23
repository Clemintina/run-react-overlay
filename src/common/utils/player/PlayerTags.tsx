// eslint-disable-next-line import/named
import React from "react";
import useTagStore from "@renderer/store/zustand/TagStore";
import {MinecraftColours, Player} from "@common/utils/PlayerUtils";
import destr from "destr";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {getTagsFromConfig} from "@common/utils/player/RenderComponent";
import {KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";

export interface PlayerTags {
    player: Player;
}

const PlayerTags: React.ElementType = (props: PlayerTags) => {
    const player = props.player;
    const {run, boomzaTag} = useTagStore((state) => ({run: state.run, boomzaTag: state.boomza}));
    const {settings} = useConfigStore((state) => ({settings: state.settings}));
    const tagArray: Array<JSX.Element> = [];

    if (player.sources.runApi != null) {
        const runApi = player.sources.runApi.data.data;
        if (runApi.blacklist.tagged) {
            tagArray.push(<span style={{color: `#${run.blacklist.colour.toString()}`}}>{run.blacklist.display}</span>);
        } else if (runApi.bot.tagged) {
            tagArray.push(<span style={{color: `#${run.bot.colour.toString()}`}}>{run.bot.display}</span>);
        } else {
            if (player.sources.boomza?.status === 200) {
                const boomza = destr(player.sources.boomza.data);
                if (boomza.sniper) {
                    tagArray.push(<span style={{color: `#${boomzaTag.sniper.colour.toString()}`}}>{boomzaTag.sniper.display}</span>);
                    tagArray.push(<span className={"pl-1"} />);
                }
                if (boomza.report) {
                    tagArray.push(<span style={{color: `#${boomzaTag.hacker.colour.toString()}`}}>{boomzaTag.hacker.display}</span>);
                    tagArray.push(<span className={"pl-1"} />);
                }
            }
            if (runApi.safelist.tagged || runApi.safelist.personal) {
                tagArray.push(getTagsFromConfig("run.safelist", runApi.safelist.timesKilled));
            }
            if (runApi.statistics.encounters != 0) {
                tagArray.push(getTagsFromConfig("run.encounters", runApi.statistics.encounters));
            }
            if (player.hypixelPlayer?.channel == "PARTY") {
                tagArray.push(getTagsFromConfig("hypixel.party"));
            }
            if (settings.keathiz && player?.hypixelPlayer?.uuid != undefined) {
                tagArray.push(<RenderKeathizTags player={player} />);
            }
        }
    } else {
        tagArray.push(<span style={{color: "red"}}>NICKED</span>);
    }

    return (
        <span>
            {tagArray.map((value, index) => (
                <span key={index}>{value}</span>
            ))}
        </span>
    );
};

const RenderKeathizTags = (props: PlayerTags) => {
    const keathizTagArray: Array<JSX.Element> = [];
    const player = props.player;
    if (player.sources.keathiz == null) {
        keathizTagArray.push(<span style={{color: `#${MinecraftColours.DARK_RED.hex}`}}>ERROR</span>);
    } else {
        if (player?.sources?.keathiz?.status == 200) {
            const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
            if (keathizTags.player.exits.last_10_min >= 1) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`E10`}</span>);
            }
            if (keathizTags.player.queues.total == 0) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>ND</span>);
            }
            if (keathizTags.player.queues.last_3_min >= 2) {
                const count = keathizTags.player.queues.last_3_min;
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Q3-${count}`}</span>);
            }
            if (keathizTags.player.queues.last_10_min >= 2) {
                const count = keathizTags.player.queues.last_10_min;
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Q10-${count}`}</span>);
            }
            if (keathizTags.player.queues.last_30_min >= 5) {
                const count = keathizTags.player.queues.last_30_min;
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Q30-${count}`}</span>);
            }
            if (keathizTags.player.queues.last_24_hours >= 50) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Q24`}</span>);
            }
            if (keathizTags.player.queues.consecutive_queue_checks.weighted["1_min_requeue"] >= 50) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Z`}</span>);
            }
            if (keathizTags.player.queues.consecutive_queue_checks.last_30_queues["1_min_requeue"] >= 15 ?? keathizTags.player.queues.consecutive_queue_checks.last_10_queues["1_min_requeue"] >= 5 ?? keathizTags.player.queues.consecutive_queue_checks.last_10_queues["2_min_requeue"] >= 6 ?? keathizTags.player.queues.consecutive_queue_checks.last_10_queues["3_min_requeue"] >= 8) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`C`}</span>);
            }
        } else {
            if (useConfigStore.getState().settings.keathiz) keathizTagArray.push(<span style={{color: `#${MinecraftColours.DARK_RED.hex}`}}>{`FAILED`}</span>);
        }
    }

    return (
        <span>
            {keathizTagArray.map((value, index) => (
                <span key={index} className={"pl-1"}>
                    {value}
                </span>
            ))}
        </span>
    );
};

export default PlayerTags;
