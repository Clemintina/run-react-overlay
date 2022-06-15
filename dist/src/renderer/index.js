import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/index';
import App from './views/App';
import { Provider } from "react-redux";
import TitleBar from "./components/Titlebar";
import "assets/scss/app.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { initScript } from "./store/ConfigStore";
import MainSettings from "./views/MainSettings";
const container = document.getElementById('main');
const root = ReactDOM.createRoot(container);
setTimeout(() => store.dispatch(initScript()), 20);
root.render(React.createElement(React.StrictMode, null,
    React.createElement(Provider, { store: store },
        React.createElement("div", { style: { width: window.innerWidth - 20 }, className: 'mainBody' },
            React.createElement(BrowserRouter, null,
                React.createElement(TitleBar, null),
                React.createElement(Routes, null,
                    React.createElement(Route, { path: "/", element: React.createElement(App, null) }),
                    React.createElement(Route, { path: "*", element: React.createElement(App, null) }),
                    React.createElement(Route, { path: "settings", element: React.createElement(MainSettings, null) })))))));
//# sourceMappingURL=index.js.map