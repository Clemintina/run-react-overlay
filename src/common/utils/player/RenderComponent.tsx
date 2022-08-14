import {MetricsObject, TagArray, TagObject} from "@common/utils/Schemas";
import tagStore from "@renderer/store/zustand/TagStore";
import jsonLogic from "json-logic-js";
import React from "react";

export const getTagsFromConfig = (tagDisplayPath, value?: number) => {
    const tag: TagObject = tagDisplayPath.split(".").reduce((o, i) => o[i], tagStore.getState());
    const tagDisplayIcon: string | undefined = tag?.display ?? "?";
    const tagArray: string | Array<TagArray> | undefined = tag?.colour ?? "FF5555";

    if (tagDisplayPath == "run.blacklist") {
        return <span style={{color: `#${tagArray}`}}>{value}</span>;
    } else if (Array.isArray(tagArray) && value != undefined) {
        const tempArray = [...tagArray];
        const arr = tempArray.sort((a, b) => b.requirement - a.requirement);
        for (const {colour, requirement} of arr) {
            if (value >= requirement) {
                return (
                    <span>
                        <span style={{color: `#${colour}`}}>{tagDisplayIcon}</span>
                        <span className={"pl-1"} />
                    </span>
                );
            }
        }
    } else {
        return <span style={{color: `#${tagArray?.toString()}`}}>{tagDisplayIcon}</span>;
    }
    return <span style={{color: "red"}}>{tagDisplayIcon}</span>;
};

export const getCoreFromConfig = (tagDisplayPath, value: number) => {
    try {
        const coreMetric: MetricsObject | undefined = tagDisplayPath.split(".").reduce((o, i) => o[i], tagStore.getState()) ?? 0;
        const coreArray = coreMetric?.colours ?? "FF5555";
        let displayValue: string | number = value.toString();

        if (!isFinite(value)) displayValue = ~~Number((((0 - 18) / 0) * 100).toFixed(2));
        if (!Number.isInteger(value)) displayValue = value.toFixed(2);

        if (Array.isArray(coreArray)) {
            const tempArray = [...coreArray];
            const arr = tempArray.sort((a, b) => a.requirement - b.requirement);
            for (const {colour, requirement, operator} of arr) {
                if (jsonLogic.apply({[operator]: [value, requirement]})) {
                    return (
                        <span>
                            <span style={{color: `#${colour}`}}>{displayValue}</span>
                            <span className={"pl-1"} />
                        </span>
                    );
                }
            }
            return <span style={{color: `#ffffff`}}>{displayValue}</span>;
        } else {
            return <span style={{color: `#${coreArray}`}}>{displayValue}</span>;
        }
    } catch (e) {
        return <span style={{color: `#ff5555`}}>{tagDisplayPath}</span>;
    }
};

export const getPlayerTagDividerNicked = () => <span style={{color: "red"}}>?</span>;
