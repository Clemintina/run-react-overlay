import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {HashRouter, Route, Routes} from "react-router-dom";
import TitleBar from "@components/ui/Titlebar";
import App from "@renderer/views/App";
import MainSettings from "@renderer/views/MainSettings";
import store from "@renderer/store";
import {initScript} from "@renderer/store/ConfigStore";
import {LogFileReader} from "@common/utils/LogFileReader";
import {playerInitScript, updatePlayerStores} from "@renderer/store/PlayerStore";
import "@assets/index.css";
import {createTheme, ThemeProvider} from "@mui/material";
import Essentials from "@components/ui/settings/views/Essentials";
import CommonSettings from "@components/ui/settings/CommonSettings";

/**
 * Loads the **Initial Script**
 * @see store
 */
setTimeout(() => store.dispatch(initScript()), 20);
setTimeout(() => store.dispatch(playerInitScript()), 20);
setInterval(() => store.dispatch(updatePlayerStores()), 60000);

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
        mode: 'dark',
    },
});

/**
 * Renders the document in the DOM and creates our React application.
 */
createRoot(document.getElementById("app")!).render(
    <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
        <div className='mainBody' >
            <HashRouter basename='/'>
                <TitleBar />
                <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='/settings' element={<CommonSettings />} />
                    <Route path='/settings/apis' element={<Essentials/>}/>
                </Routes>
            </HashRouter>
        </div>
        </ThemeProvider>
    </Provider>,
);
