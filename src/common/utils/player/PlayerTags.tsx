// eslint-disable-next-line import/named
import React from "react";
import useTagStore from "@renderer/store/zustand/TagStore";
import {MinecraftColours, Player} from "@common/utils/PlayerUtils";
import destr from "destr";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {getTagsFromConfig} from "@common/utils/player/RenderComponent";
import {KeathizOverlayRun} from "@common/utils/externalapis/BoomzaApi";
import {MinecraftColourAsHex} from "@common/zikeji";

export interface PlayerTags {
    player: Player;
}

const parseColour = (text: string) => {
    const splitText = text.split("§");
    const finalText: [string, string][] = [];

    for (const parts of splitText) {
        finalText.push([parts.split("").slice(1).join(""), MinecraftColourAsHex[`§${parts.split("")[0]}`]]);
    }
    return finalText;
};

const PlayerTags: React.ElementType = (props: PlayerTags) => {
    const player = props.player;
    const {run, boomzaTag} = useTagStore((state) => ({run: state.run, boomzaTag: state.boomza}));
    const {settings, hypixel, runConfig, table} = useConfigStore((state) => ({
        settings: state.settings,
        hypixel: state.hypixel,
        runConfig: state.run,
        table: state.table,
    }));

    let tagArray: Array<JSX.Element> = [];
    if (runConfig.valid && player.sources.runApi != null) {
        let singularTag = false;
        const runApi = player.sources.runApi?.data?.data;
        const customData = player?.sources?.customFile;
        const customUrl = player?.sources?.customApi;
        if (runApi?.blacklist?.tagged) {
            tagArray.push(<span style={{color: `#${run.blacklist.colour.toString()}`}}>{run.blacklist.display}</span>);
        } else if (runApi?.bot?.tagged) {
            tagArray.push(<span style={{color: `#${run.bot.colour.toString()}`}}>{run.bot.display}</span>);
        } else if (runApi?.customTag) {
            parseColour(runApi.customTag).forEach((tag: [string, string]) => tagArray.push(<span style={{color: `#${tag[1]}`}}>{tag[0]}</span>));
        } else {
            if (settings.preferences.customFile && customData?.tags != null) {
                for (const tag of customData.tags) {
                    if (tag?.singularTag) {
                        tagArray = [];
                        if (tag.tag.includes("§")) parseColour(tag.tag).forEach((tag: [string, string]) => tagArray.push(<span style={{color: `#${tag[1]}`}}>{tag[0]}</span>));
                        else tagArray.push(<span style={{color: tag.hex}}>{tag.tag}</span>);
                        singularTag = true;
                        break;
                    } else {
                        if (tag.tag.includes("§")) parseColour(tag.tag).forEach((tag: [string, string]) => tagArray.push(<span style={{color: `#${tag[1]}`}}>{tag[0]}</span>));
                        else tagArray.push(<span style={{color: tag.hex}}>{tag.tag}</span>);
                    }
                }
            }
            if (settings.preferences.customUrl && customUrl?.tags) {
                for (const tag of customUrl.tags) {
                    if (tag?.singularTag) {
                        tagArray = [];
                        if (tag.tag.includes("§")) parseColour(tag.tag).forEach((tag: [string, string]) => tagArray.push(<span style={{color: `#${tag[1]}`}}>{tag[0]}</span>));
                        else tagArray.push(<span style={{color: tag.hex}}>{tag.tag}</span>);
                        singularTag = true;
                        break;
                    } else {
                        if (tag.tag.includes("§")) parseColour(tag.tag).forEach((tag: [string, string]) => tagArray.push(<span style={{color: `#${tag[1]}`}}>{tag[0]}</span>));
                        else tagArray.push(<span style={{color: tag.hex}}>{tag.tag}</span>);
                    }
                }
            }
            if (!singularTag) {
                if (player?.sources?.boomza?.status === 200) {
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
                if (runApi?.safelist?.tagged) {
                    tagArray.push(getTagsFromConfig("run.safelist", runApi.safelist.timesKilled));
                }
                if (runApi?.safelist?.personal) {
                    tagArray.push(getTagsFromConfig("run.personal_safelist", runApi.safelist.timesKilled));
                }
                if (settings.run.friends && player.friended) {
                    tagArray.push(getTagsFromConfig("run.friends"));
                }
                if (runApi?.statistics?.encounters != 0 ?? false) {
                    tagArray.push(getTagsFromConfig("run.encounters", runApi?.statistics.encounters));
                }
                if (player?.hypixelPlayer?.channel == "PARTY") {
                    tagArray.push(getTagsFromConfig("hypixel.party"));
                }
                if (settings.keathiz && player?.hypixelPlayer?.uuid != undefined) {
                    tagArray.push(<RenderKeathizTags player={player} />);
                }
            }
        }
    } else {
        if (player.loaded) {
            if (!runConfig.valid) {
                tagArray.push(<span style={{color: "red"}}>Seraph Key Locked</span>);
            } else if (hypixel.apiKeyValid) {
                tagArray.push(<span style={{color: "red"}}>NICKED</span>);
            } else {
                tagArray.push(<span style={{color: "red"}}>Invalid Hypixel API Key</span>);
            }
        }
    }

    return (
        <div style={{textAlign: table.settings.textAlign}}>
            {tagArray.map((value, index) => (
                <span key={index}>{value}</span>
            ))}
        </div>
    );
};

const RenderKeathizTags = (props: PlayerTags) => {
    const keathizTagArray: Array<JSX.Element> = [];
    const player = props.player;
    if (player?.sources?.keathiz == null && player.loaded) {
        keathizTagArray.push(<span style={{color: `#${MinecraftColours.DARK_RED.hex}`}}>ERROR</span>);
    } else {
        if (player?.sources?.keathiz?.status == 200 && player?.sources?.keathiz?.data) {
            const keathizTags: KeathizOverlayRun = player.sources.keathiz.data;
            if (keathizTags?.player?.exits?.last_10_min ?? 0 >= 1) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`E10`}</span>);
            }
            if (keathizTags?.player?.queues?.total ?? 0 == 0) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>ND</span>);
            }
            if (keathizTags?.player?.queues?.last_3_min ?? 0 >= 2) {
                const count = keathizTags?.player.queues.last_3_min;
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Q3-${count}`}</span>);
            }
            if (keathizTags?.player?.queues?.last_10_min ?? 0 >= 2) {
                const count = keathizTags?.player.queues.last_10_min;
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Q10-${count}`}</span>);
            }
            if (keathizTags?.player?.queues?.last_30_min ?? 0 >= 5) {
                const count = keathizTags?.player?.queues?.last_30_min;
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Q30-${count}`}</span>);
            }
            if (keathizTags?.player?.queues?.last_24_hours ?? 0 >= 50) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Q24`}</span>);
            }
            if (keathizTags?.player?.queues?.consecutive_queue_checks?.weighted["1_min_requeue"] ?? 0 >= 50) {
                keathizTagArray.push(<span style={{color: `#${MinecraftColours.GOLD.hex}`}}>{`Z`}</span>);
            }
            if (
                keathizTags?.player?.queues?.consecutive_queue_checks?.last_30_queues["1_min_requeue"] ??
                0 >= 15 ??
                keathizTags?.player?.queues?.consecutive_queue_checks?.last_10_queues["1_min_requeue"] ??
                0 >= 5 ??
                keathizTags?.player?.queues?.consecutive_queue_checks?.last_10_queues["2_min_requeue"] ??
                0 >= 6 ??
                keathizTags?.player?.queues?.consecutive_queue_checks?.last_10_queues["3_min_requeue"] ??
                0 >= 8
            ) {
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
