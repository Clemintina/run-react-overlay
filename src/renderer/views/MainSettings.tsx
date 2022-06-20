import "@assets/scss/titlebar.scss";
import React from "react";
import store from "@renderer/store";
import {apiKeyValidator} from "@renderer/store/ConfigStore";

const MainSettings = () => {
    return (
        <div>
            <h1>TODO add settings</h1>
            <div>
                Hypixel API Key:
                <input
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            store.dispatch(apiKeyValidator(event.currentTarget.value));
                        }
                    }}
                />
            </div>
            <div>
                Overlay Logs:{" "}
                <input
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            window.ipcRenderer.send("logFileSet", event.currentTarget.value);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default MainSettings;
