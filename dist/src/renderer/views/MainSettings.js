import "@assets/scss/titlebar.scss";
import React from "react";
import store from "@renderer/store";
import { apiKeyValidator } from "@renderer/store/ConfigStore";
const MainSettings = () => {
    return (React.createElement("div", null,
        React.createElement("h1", null, "TODO add settings"),
        React.createElement("div", null,
            "Hypixel API Key:",
            React.createElement("input", { onKeyDown: (event) => {
                    if (event.key === "Enter") {
                        store.dispatch(apiKeyValidator(event.currentTarget.value));
                    }
                } })),
        React.createElement("div", null,
            "Overlay Logs:",
            " ",
            React.createElement("input", { onKeyDown: (event) => {
                    if (event.key === "Enter") {
                        window.ipcRenderer.send("logFileSet", event.currentTarget.value);
                    }
                } }))));
};
export default MainSettings;
//# sourceMappingURL=MainSettings.js.map