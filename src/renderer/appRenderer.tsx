import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "@renderer/views/App";
import { LogFileReader } from "@common/utils/LogFileReader";
import "@assets/index.css";
import { alpha, Box, createTheme, ThemeProvider } from "@mui/material";
import Essentials from "@components/ui/settings/views/Essentials";
import TagEditor from "@components/ui/settings/views/TagEditor";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import ColourRenderer from "@components/ui/settings/ColourRenderer";
import NickView from "@components/ui/settings/views/Nicks";
import NewTitlebar from "@components/ui/NewTitlebar";
import ColumnEditorView from "@components/ui/settings/views/ColumnEditor";
import Appearance from "@components/ui/settings/views/Appearance";

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

const darkTheme = createTheme({
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

/**
 * Renders the document in the DOM and creates our React application.
 */
createRoot(document.getElementById("app")!).render(
    <ThemeProvider theme={darkTheme}>
        <Box className='mainBody text-gray-400' id={"main-body"}>
            <ColourRenderer>
                <HashRouter basename='/'>
                    <NewTitlebar>
                        <Routes>
                            <Route path='/' element={<App />} />
                            <Route path='/settings' element={<Essentials />} />
                            <Route path='/settings/essentials' element={<Essentials />} />
                            <Route path='/settings/tags' element={<TagEditor />} />
                            <Route path='/settings/nicks' element={<NickView />} />
                            <Route path='/settings/columneditor' element={<ColumnEditorView />} />
                            <Route path={"/settings/appearance"} element={<Appearance />} />
                        </Routes>
                    </NewTitlebar>
                </HashRouter>
            </ColourRenderer>
        </Box>
    </ThemeProvider>,
);
