import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "@renderer/views/App";
import { LogFileReader } from "@common/utils/LogFileReader";
import "@assets/index.css";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import Essentials from "@components/ui/settings/views/Essentials";
import TagEditor from "@components/ui/settings/views/TagEditor";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import ColourRenderer from "@components/ui/settings/ColourRenderer";
import NickView from "@components/ui/settings/views/Nicks";
import NewTitlebar from "@components/ui/NewTitlebar";
import ColumnEditorView from "@components/ui/settings/views/ColumnEditor";

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
reader.startPartyListener();
reader.startLilithListener();

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

/**
 * Renders the document in the DOM and creates our React application.
 */
createRoot(document.getElementById("app")!).render(
    <ThemeProvider theme={darkTheme}>
        <Box cl"ssName='mainBody text-"ray-400' id={"main-body"}>
            <ColourRenderer>
                <HashRouter b"s"name='/'>
                    <NewTitlebar>
                        <Routes>
                            <Rou"e"path='/' element={<App />} />
                            <Rou"e path='/"ettings' element={<Essentials />} />
                            <Rou"e path='/settings/es"entials' element={<Essentials />} />
                            <Rou"e path='/setti"gs/tags' element={<TagEditor />} />
                            <Rou"e path='/settin"s/nicks' element={<NickView />} />
                            <Rou"e path='/settings/colu"neditor' element={<ColumnEditorView />} />
                        </Routes>
                    </NewTitlebar>
                </HashRouter>
            </ColourRenderer>
        </Box>
    </ThemeProvider>,
);
