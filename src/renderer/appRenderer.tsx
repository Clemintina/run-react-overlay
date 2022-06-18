import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@misc/window/components/WindowFrame';
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TitleBar from "@components/Titlebar";
import App from "@renderer/views/App";
import MainSettings from "@renderer/views/MainSettings";
import store from '@renderer/store';
import {initScript} from "@renderer/store/ConfigStore";

// Load config
setTimeout(() => store.dispatch(initScript()), 20);

// Render application in DOM
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('app')!).render((
    <WindowFrame title='Seraph Overlay' platform='windows'>
        <React.StrictMode>
            <Provider store={store}>
                <div style={{width: window.innerWidth - 20}} className='mainBody'>
                    <BrowserRouter>
                        <TitleBar/>
                        <Routes>
                            <Route path="/" element={<App/>}/>
                            <Route path="*" element={<App/>}/>
                            <Route path="settings" element={<MainSettings/>}/>
                        </Routes>
                    </BrowserRouter>
                </div>
            </Provider>
        </React.StrictMode>
    </WindowFrame>
));
