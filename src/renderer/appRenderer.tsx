import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import TitleBar from "@components/Titlebar";
import App from "@renderer/views/App";
import MainSettings from "@renderer/views/MainSettings";
import store from "@renderer/store";
import {initScript} from "@renderer/store/ConfigStore";
import {LogFileReader} from "@common/utils/LogFileReader";
import {playerInitScript} from "@renderer/store/PlayerStore";

/**
 * Loads the **Initial Script**
 * @see store
 */
setTimeout(() => store.dispatch(initScript()), 20);
setTimeout(() => store.dispatch(playerInitScript()), 20);

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

/**
 * Renders the document in the DOM and creates our React application.
 */
createRoot(document.getElementById("app")!).render(
    <Provider store={store}>
        <div className='mainBody'>
            <HashRouter basename='/'>
                <TitleBar />
                <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='/settings' element={<MainSettings />} />
                </Routes>
            </HashRouter>
        </div>
    </Provider>,
);
