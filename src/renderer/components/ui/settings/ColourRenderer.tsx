import React from "react";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

const ColourRenderer = (props: {children: JSX.Element}) => {
    const {colours, opacity} = useConfigStore((state) => ({colours: state.colours, opacity: state.browserWindow.opacity}));
    return (
        <div style={{backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100)}}>
            {props.children}
        </div>
    );
};

export const hexToRgbA = (hex, opacity) => {
    let c;
    if (/^#([A-Fa-f\d]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = `0x${c.join("")}`;
        return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${opacity})`;
    }
};

export default ColourRenderer;
