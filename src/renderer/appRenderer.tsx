import React from "react";
import {createRoot} from "react-dom/client";
import {HashRouter, Route, Routes} from "react-router-dom";
import App from "@renderer/views/App";
import {LogFileReader} from "@common/utils/LogFileReader";
import "@assets/index.css";
import {alpha, Box, createTheme, hexToRgb, ThemeOptions, ThemeProvider} from "@mui/material";
import Essentials from "@components/ui/settings/views/Essentials";
import TagEditor from "@components/ui/settings/views/TagEditor";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import ColourRenderer from "@components/ui/settings/ColourRenderer";
import NickView from "@components/ui/settings/views/Nicks";
import NewTitlebar from "@components/ui/NewTitlebar";
import ColumnEditorView from "@components/ui/settings/views/ColumnEditor";
import Appearance from "@components/ui/settings/views/Appearance";
import KeybindEditorView from "@components/ui/settings/views/KeybindEditor";
import {KeybindHandlerUtils} from "@common/utils/KeybindHandler";
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";
import {inDev} from "@common/helpers";
import CustomLinks from "@components/ui/settings/views/CustomLinks";

if (!inDev()) {
    Sentry.init({
        dsn: "https://007f83196f744701bdb2854ce0e50fad@o4504048318939136.ingest.sentry.io/4504048320839680",
        integrations: [new BrowserTracing()],
        tracesSampleRate: 1.0,
    });
}

const logs = useConfigStore.getState().logs;
if (logs.readable) {
    window.ipcRenderer.send("logFileSet", useConfigStore.getState().logs.logPath);
}

/**
 * Starts the Log readers
 * We use multiple to make each method cleaner and less ify
 */
const reader = new LogFileReader();
reader.startListening();
reader.startJoinHandler();
reader.startListHandler();
reader.startSeraphHandler();
reader.startCommandListener();
reader.startApiKeyHandler();
reader.startPartyListener();
reader.startLilithListener();

const keys = new KeybindHandlerUtils();
keys.startHandlingApp();

const baseTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: hexToRgb("#02e6ee"),
        },
    },
});

const themeArgs: ThemeOptions = {
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha(useConfigStore.getState().colours.backgroundColour, useConfigStore.getState().browserWindow.opacity / 100),
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha("#242424", 1),
                },
            },
        },
    },
};

const darkTheme = createTheme(baseTheme, themeArgs);

/**
 * Renders the document in the DOM and creates our React application.
 */
createRoot(document.getElementById("app")!).render(
    <ThemeProvider theme={darkTheme}>
        <Box className={"mainBody text-gray-400"} id={"main-body"}>
            <ColourRenderer>
                <HashRouter basename={"/"}>
                    <NewTitlebar>
                        <Routes>
                            <Route path={"/"} element={<App />} />
                            <Route path={"/settings"} element={<Essentials />} />
                            <Route path={"/settings/essentials"} element={<Essentials />} />
                            <Route path={"/settings/tags"} element={<TagEditor />} />
                            <Route path={"/settings/nicks"} element={<NickView />} />
                            <Route path={"/settings/keybinds"} element={<KeybindEditorView />} />
                            <Route path={"/settings/columneditor"} element={<ColumnEditorView />} />
                            <Route path={"/settings/appearance"} element={<Appearance />} />
                            <Route path={"/settings/customlinks"} element={<CustomLinks />} />
                        </Routes>
                    </NewTitlebar>
                </HashRouter>
            </ColourRenderer>
        </Box>
    </ThemeProvider>,
);
