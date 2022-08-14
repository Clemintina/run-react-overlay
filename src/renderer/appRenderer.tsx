import React from "react";
import {createRoot} from "react-dom/client";
import {HashRouter, Route, Routes} from "react-router-dom";
import TitleBar from "@components/ui/Titlebar";
import App from "@renderer/views/App";
import {LogFileReader} from "@common/utils/LogFileReader";
import "@assets/index.css";
import {createTheme, ThemeProvider} from "@mui/material";
import Essentials from "@components/ui/settings/views/Essentials";
import TagEditor from "@components/ui/settings/views/TagEditor";

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
                <div className='mainBody text-gray-500' id={'main-body'}>
                    <HashRouter basename='/'>
                        <TitleBar/>
                        <Routes>
                            <Route path='/' element={<App/>}/>
                            <Route path='/settings' element={<Essentials/>}/>
                            <Route path='/settings/essentials' element={<Essentials/>}/>
                            <Route path='/settings/tags' element={<TagEditor/>}/>
                        </Routes>
                    </HashRouter>
                </div>
            </ThemeProvider>
        </>
    </div>,
);
