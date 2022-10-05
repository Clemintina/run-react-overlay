import React from "react";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { alpha, createTheme, ThemeProvider } from "@mui/material";

const ColourRenderer = (props: { children: JSX.Element }) => {
    const { colours, opacity } = useConfigStore((state) => ({
        colours: state.colours,
        opacity: state.browserWindow.opacity,
    }));
    const theme = createTheme({
        palette: {
            mode: "dark",
        },
        components: {
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: alpha(useConfigStore.getState().colours.backgroundColour, useConfigStore.getState().browserWindow.opacity / 100),
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                                borderColor: "cyan",
                            },
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: alpha(useConfigStore.getState().colours.backgroundColour, useConfigStore.getState().browserWindow.opacity / 100),
                    },
                },
            },
        },
    });

    return (
        <div style={{ backgroundColor: hexToRgbA(colours.backgroundColour, opacity / 100) }}>
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
