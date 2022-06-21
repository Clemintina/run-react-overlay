import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import React from "react";
import store from "@renderer/store";
import {apiKeyValidator} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

const MainSettings = () => {
    const isHypixelKeySet: boolean = useSelector(() => store.getState().configStore.apiKey.length === 36);
    const isLogsSet: boolean = useSelector(() => store.getState().configStore.logPath.length !== 0);

    // TODO make it look nicer and cleaner
    return (
        <div className='mainSettingsPanel'>
            <h1 className='underline hover-underline-animation'>Overlay Settings</h1>
            <div className='mainSettingsOption'>
                <div className='underline'>Hypixel API Key:</div>
                <input
                    type='text'
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            store.dispatch(apiKeyValidator(event.currentTarget.value));
                        }
                    }}
                />
                {<FontAwesomeIcon style={{color: isHypixelKeySet ? "green" : "red"}} icon={faExclamationCircle} />}
            </div>
            <div className='mainSettingsOption'>
                <div className='underline'> Overlay Logs:</div>
                <button
                    onClick={async () => {
                        const path = await window.ipcRenderer.invoke("selectLogFile");
                        if (path.filePaths[0] !== undefined) {
                            const logPath = path.filePaths[0];
                            const readable: boolean = await window.ipcRenderer.invoke("isFileReadable", logPath);
                            if (readable) {
                                window.ipcRenderer.send("logFileSet", logPath);
                            }
                        }
                    }}
                >
                    Set Log File
                </button>
                {<FontAwesomeIcon style={{color: isLogsSet ? "green" : "red"}} icon={faExclamationCircle} />}
            </div>
        </div>
    );
};

export default MainSettings;
