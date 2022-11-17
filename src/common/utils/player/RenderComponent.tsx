import { MetricsObject, TagArray, TagObject } from "@common/utils/Schemas";
import jsonLogic from "json-logic-js";
import React from "react";
import useTagStore from "@renderer/store/zustand/TagStore";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

export const getTagsFromConfig = (tagDisplayPath: string, value?: number) => {
    const tag: TagObject = tagDisplayPath.split(".").reduce((o, i) => o[i], useTagStore.getState()) as unknown as TagObject;
    const tagDisplayIcon: string | undefined = tag?.display ?? "?";
    const tagArray: string | Array<TagArray> | undefined = tag?.colour ?? "FF5555";

    if (tagDisplayPath == "run.blacklist") {
        return (
            <Tooltip title={<span className={"normal-case"}>{"This player is blacklisted, leave the queue."}</span>} arrow>
                <span style={{ color: `#${tagArray}` }}>{value != undefined ? value : tagDisplayIcon}</span>
            </Tooltip>
        );
    } else if (Array.isArray(tagArray) && value != undefined) {
        const tempArray = [...tagArray];
        const arr = tempArray.sort((a, b) => b.requirement - a.requirement);
        for (const { colour, requirement } of arr) {
            if (value >= requirement) {
                return (
                    <span>
                        <IconButton size={"small"} value={tagDisplayIcon}>
                            <Tooltip title={<span className={"capitalize"}>{tagDisplayPath.split(".")[tagDisplayPath.split(".").length - 1]}</span>} arrow>
                                <span>
                                    <span style={{ color: `#${colour}` }}>{tagDisplayIcon}</span>
                                </span>
                            </Tooltip>
                        </IconButton>
                    </span>
                );
            }
        }
    } else {
        return (
            <span>
                <IconButton size={"small"}>
                    <Tooltip title={<span className={"capitalize"}>{tagDisplayPath.split(".")[tagDisplayPath.split(".").length - 1].replaceAll("-", " ")}</span>} arrow>
                        <span>
                            <span style={{ color: `#${tagArray?.toString()}` }}>{tagDisplayIcon}</span>
                        </span>
                    </Tooltip>
                </IconButton>
            </span>
        );
    }
    return <span style={{ color: "red" }}>{tagDisplayIcon}</span>;
};

export const getCoreFromConfig = (tagDisplayPath, value: number) => {
    try {
        const coreMetric: MetricsObject | undefined = tagDisplayPath.split(".").reduce((o, i) => o[i], useTagStore.getState()) ?? 0;
        const coreArray = coreMetric?.colours ?? "FF5555";
        let displayValue: string | number = value.toString();

        if (!isFinite(value)) displayValue = ~~Number((((0 - 18) / 0) * 100).toFixed(2));
        if (!Number.isInteger(value)) displayValue = value.toFixed(2);

        if (Array.isArray(coreArray)) {
            const tempArray = [...coreArray];
            const arr = tempArray.sort((a, b) => a.requirement - b.requirement);
            for (const { colour, requirement, operator } of arr) {
                if (jsonLogic.apply({ [operator]: [value, requirement] })) {
                    return (
                        <span>
                            <span style={{ color: `#${colour}` }}>{displayValue}</span>
                            <span className={"pl-1"} />
                        </span>
                    );
                }
            }
            return <span style={{ color: `#ffffff` }}>{displayValue}</span>;
        } else {
            return <span style={{ color: `#${coreArray}` }}>{displayValue}</span>;
        }
    } catch (e) {
        return <span style={{ color: `#ff5555` }}>{tagDisplayPath}</span>;
    }
};

export const getPlayerTagDividerNicked = () => <span style={{ color: "red" }}>?</span>;
