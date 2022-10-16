import React from "react";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";

const ColourRenderer = (props: { children: JSX.Element }) => {
    const { colours, opacity, font } = useConfigStore((state) => ({
        colours: state.colours,
        opacity: state.browserWindow.opacity,
        font: state.font,
    }));
    const useExistingTheme = useTheme();
    const theme = createTheme({
        ...useExistingTheme,
        typography: {
            fontFamily: font.family,
        },
    });

    return (
        <div style={{ fontFamily: font.family, backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100) }}>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
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
