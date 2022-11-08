import React, { useEffect, useState } from "react";
import { IHeaderParams } from "ag-grid-community";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface ICustomHeader extends IHeaderParams {
}

export default (props: ICustomHeader) => {
    const [ascSort, setAscSort] = useState("inactive");
    const [descSort, setDescSort] = useState("inactive");
    const [noSort, setNoSort] = useState("inactive");
    const { textAlign } = useConfigStore((state) => ({ textAlign: state.table.settings.textAlign }));

    const onSortChanged = () => {
        setAscSort(props.column.isSortAscending() ? "active" : "inactive");
        setDescSort(props.column.isSortDescending() ? "active" : "inactive");
        setNoSort(!props.column.isSortAscending() && !props.column.isSortDescending() ? "active" : "inactive");
    };

    const onSortRequested = (order: "asc" | "desc" | null, event: any) => {
        if (props.enableSorting) props.setSort(order, event.shiftKey);
    };

    useEffect(() => {
        props.column.addEventListener("sortChanged", onSortChanged);
        onSortChanged();
    }, []);

    let sort: JSX.Element | null = null;
    if (props.enableSorting && noSort == "inactive") {
        if (ascSort == "inactive") {
            sort = (
                <span onClick={(event) => onSortRequested("desc", event)} onTouchEnd={(event) => onSortRequested("desc", event)} className={`customSortUpLabel ${descSort}`}>
                    <ArrowDropUpIcon />
                </span>
            );
        } else if (descSort == "inactive") {
            sort = (
                <span onClick={(event) => onSortRequested("asc", event)} onTouchEnd={(event) => onSortRequested("asc", event)} className={`customSortDownLabel ${ascSort}`}>
                    <ArrowDropDownIcon />
                </span>
            );
        }
    }

    return (
        <div style={{ textAlign }} className={"w-full"}>
            <div onClick={(event) => onSortRequested(ascSort == "active" ? "desc" : "asc", event)}>
                <span>{props.displayName}</span>
                {sort}
            </div>
        </div>
    );
};
