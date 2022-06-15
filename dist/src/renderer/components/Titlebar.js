import "@assets/scss/titlebar.scss";
import store from '@common/store';
import { getPlayerHypixelData } from "@common/store/PlayerStore";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars as headerIcon } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
const TitleBar = () => {
    const currentRoute = useLocation();
    let renderCaret;
    let titlePath;
    if (currentRoute.pathname.includes('settings')) {
        renderCaret = React.createElement(FontAwesomeIcon, { icon: headerIcon, fontSize: '30' });
        titlePath = "";
    }
    else {
        renderCaret = React.createElement(FontAwesomeIcon, { icon: headerIcon, fontSize: '30' });
        titlePath = "settings";
    }
    return (React.createElement("div", { className: 'header' },
        React.createElement("div", { className: 'headerBar' },
            React.createElement(Link, { to: titlePath, style: { display: 'flex' } },
                React.createElement("div", { style: { paddingRight: 5 } },
                    React.createElement("div", { className: "settings-icon", style: { display: "flex" } }, renderCaret)),
                React.createElement("div", { className: "title" },
                    React.createElement("header", { style: { fontSize: 30 } }, "Seraph")))),
        React.createElement("div", { className: 'headerSearchBox' },
            React.createElement("input", { type: 'text', placeholder: 'Username...', className: "headerSearchBox", onKeyDown: event => {
                    if (event.key === 'Enter') {
                        store.dispatch(getPlayerHypixelData({ name: event.currentTarget.value }));
                        event.currentTarget.value = "";
                    }
                } }))));
};
export default TitleBar;
//# sourceMappingURL=Titlebar.js.map