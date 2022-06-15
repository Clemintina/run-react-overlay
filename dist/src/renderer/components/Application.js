import React, { useEffect, useState } from 'react';
import logo from '@assets/images/logo.png';
import darkModeIcon from '@assets/images/darkmode.png';
import lightModeIcon from '@assets/images/lightmode.png';
import './Application.scss';
const Application = () => {
    const [counter, setCounter] = useState(0);
    const [darkTheme, setDarkTheme] = useState(true);
    const [versions, setVersions] = useState({});
    /**
     * On component mount
     */
    useEffect(() => {
        const useDarkTheme = parseInt(localStorage.getItem('dark-mode'));
        if (isNaN(useDarkTheme)) {
            setDarkTheme(true);
        }
        else if (useDarkTheme == 1) {
            setDarkTheme(true);
        }
        else if (useDarkTheme == 0) {
            setDarkTheme(false);
        }
        // Apply verisons
        const app = document.getElementById('app');
        const versions = JSON.parse(app.getAttribute('data-versions'));
        setVersions(versions);
    }, []);
    /**
     * On Dark theme change
     */
    useEffect(() => {
        if (darkTheme) {
            localStorage.setItem('dark-mode', '1');
            document.body.classList.add('dark-mode');
        }
        else {
            localStorage.setItem('dark-mode', '0');
            document.body.classList.remove('dark-mode');
        }
    }, [darkTheme]);
    /**
     * Toggle Theme
     */
    function toggleTheme() {
        setDarkTheme(!darkTheme);
    }
    return (React.createElement("div", { id: 'erwt' },
        React.createElement("div", { className: 'header' },
            React.createElement("div", { className: 'main-heading' },
                React.createElement("h1", { className: 'themed' }, "ERWT - Electron Boilerplate")),
            React.createElement("div", { className: 'main-teaser' },
                React.createElement("img", { src: logo, title: 'Codesbiome' }),
                React.createElement("div", null, "Minimal boilerplate for rapid development of Desktop Applications using Electron, React, Typescript and Webpack. For faster development experience, this application will update using Hot Reload without needing to restart.")),
            React.createElement("div", { className: 'versions' },
                React.createElement("span", null,
                    "ERWT ",
                    React.createElement("span", null, versions.erwt)),
                React.createElement("span", null,
                    "Electron ",
                    React.createElement("span", null, versions.electron)),
                React.createElement("span", null,
                    "Chrome ",
                    React.createElement("span", null, versions.chrome)),
                React.createElement("span", null,
                    "Node ",
                    React.createElement("span", null, versions.node)),
                React.createElement("span", null,
                    "React ",
                    React.createElement("span", null, versions.react)),
                React.createElement("span", null,
                    "Webpack ",
                    React.createElement("span", null, versions.webpack)),
                React.createElement("span", null,
                    "Typescript ",
                    React.createElement("span", null, versions.typescript)),
                React.createElement("span", null,
                    "License ",
                    React.createElement("span", null, versions.license)))),
        React.createElement("div", { className: 'footer' },
            React.createElement("div", { className: 'center' },
                React.createElement("button", { onClick: () => {
                        if (counter > 99)
                            return alert('Going too high!!');
                        setCounter(counter + 1);
                    } },
                    "Increment ",
                    React.createElement("span", null, counter)),
                "\u00A0\u00A0 \u00A0\u00A0",
                React.createElement("button", { onClick: () => {
                        if (counter == 0)
                            return alert('Oops.. thats not possible!');
                        setCounter(counter > 0 ? counter - 1 : 0);
                    } },
                    "Decrement ",
                    React.createElement("span", null, counter)),
                "\u00A0\u00A0 \u00A0\u00A0",
                React.createElement("button", { onClick: toggleTheme },
                    darkTheme ? 'Light Mode' : 'Dark Mode',
                    React.createElement("span", null,
                        React.createElement("img", { className: 'rotate', src: darkTheme ? lightModeIcon : darkModeIcon })))))));
};
export default Application;
//# sourceMappingURL=Application.js.map