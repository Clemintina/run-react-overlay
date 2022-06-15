import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@misc/window/components/WindowFrame';
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TitleBar from "@components/Titlebar";
import App from "@renderer/views/App";
import MainSettings from "@renderer/views/MainSettings";
import store from '@common/store';
import { initScript } from "@common/store/ConfigStore";
// Load config
setTimeout(() => store.dispatch(initScript()), 20);
// Application to Render
const app = (React.createElement(WindowFrame, { title: 'Seraph Overlay', platform: 'windows' },
    React.createElement(React.StrictMode, null,
        React.createElement(Provider, { store: store },
            React.createElement("div", { style: { width: window.innerWidth - 20 }, className: 'mainBody' },
                React.createElement(BrowserRouter, null,
                    React.createElement(TitleBar, null),
                    React.createElement(Routes, null,
                        React.createElement(Route, { path: "/", element: React.createElement(App, null) }),
                        React.createElement(Route, { path: "*", element: React.createElement(App, null) }),
                        React.createElement(Route, { path: "settings", element: React.createElement(MainSettings, null) }))))))));
// Render application in DOM
createRoot(document.getElementById('app')).render(app);
//# sourceMappingURL=appRenderer.js.map