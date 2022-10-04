import React from "react";
import {createRoot} from "react-dom/client";
import {HashRouter, Route, Routes} from "react-router-dom";
import App from "@renderer/views/App";
import {LogFileReader} from "@common/utils/LogFileReader";
import "@assets/index.css";
import {createTheme, ThemeProvider} from "@mui/material";
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
    <div>
        <>
            <ThemeProvider theme={darkTheme}>
                <div className='mainBody text-gray-400' id={"main-body"}>
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
                                </Routes>
                            </NewTitlebar>
                        </HashRouter>
                    </ColourRenderer>
                </div>
            </ThemeProvider>
        </>
    </div>,
);
