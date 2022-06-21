import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import React from "react";
import store from "@renderer/store";
import { apiKeyValidator } from "@renderer/store/ConfigStore";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
const MainSettings = () => {
    const isHypixelKeySet = useSelector(() => store.getState().configStore.apiKey.length === 36);
    const isLogsSet = useSelector(() => store.getState().configStore.logPath.length !== 0);
    return (React.createElement("div", { className: 'mainSettingsPanel' },
        React.createElement("h1", { className: 'underline hover-underline-animation' }, "Overlay Settings"),
        React.createElement("div", { className: 'mainSettingsOption' },
            React.createElement("div", { className: 'underline' }, "Hypixel API Key:"),
            React.createElement("input", { type: 'text', onKeyDown: (event) => {
                    if (event.key === "Enter") {
                        store.dispatch(apiKeyValidator(event.currentTarget.value));
                    }
                } }),
            React.createElement(FontAwesomeIcon, { style: { color: isHypixelKeySet ? "green" : "red" }, icon: faExclamationCircle })),
        React.createElement("div", { className: 'mainSettingsOption' },
            React.createElement("div", { className: 'underline' }, " Overlay Logs:"),
            React.createElement("button", { onClick: async () => {
                    const path = await window.ipcRenderer.invoke("selectLogFile");
                    if (path.filePaths[0] !== undefined) {
                        const logPath = path.filePaths[0];
                        const readable = await window.ipcRenderer.invoke("isFileReadable", logPath);
                        if (readable) {
                            await window.ipcRenderer.invoke("logFileSet", logPath);
                        }
                    }
                } }, "Set Log File"),
            React.createElement(FontAwesomeIcon, { style: { color: isLogsSet ? "green" : "red" }, icon: faExclamationCircle }))));
};
export default MainSettings;
//# sourceMappingURL=MainSettings.js.map