import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import React from "react";
import store from "@renderer/store";
import {apiKeyValidator, keathizApiKeyValidator, setSettingsValue, SettingsConfig} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {UnderlinedTitle} from "@components/user/UnderlinedTitle";
import {InputTextBox} from "@components/user/InputTextBox";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {ToggleButton} from "@components/user/ToggleButton";
import {Sidebar} from "flowbite-react/lib/esm/components";
import {Alert} from "@mui/material";

const MainSettings = () => {
    const isHypixelKeySet: boolean = useSelector(() => store.getState().configStore.hypixel.apiKey.length === 36);
    const isLogsSet: boolean = useSelector(() => store.getState().configStore.logPath.length !== 0);
    const settings = useSelector(() => store.getState().configStore.settings);
    const version = useSelector(()=>store.getState().configStore.version);

    // TODO make it look nicer and cleaner
    return (
        <div className="mainSettingsPanel">
            <UnderlinedTitle text={"Overlay Settings"} options={{text: {size: 30}}} />
            <div className="mainSettingsOption ">
                <UnderlinedTitle text={"Hypixel API Key: "}></UnderlinedTitle>
                <InputTextBox
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Enter") {
                            store.dispatch(apiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
                        }
                    }}
                />
                {<FontAwesomeIcon style={{color: isHypixelKeySet ? "green" : "red"}} icon={faExclamationCircle} />}
            </div>
            <div className="mainSettingsOption" style={settings.keathiz ? {} : { display: 'none' }}>
                <UnderlinedTitle text={"Keathiz Key: "}> </UnderlinedTitle>
                <InputTextBox
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Enter") {
                            store.dispatch(keathizApiKeyValidator(event.currentTarget.value.replaceAll(" ", "")));
                        }
                    }}
                />
                {<FontAwesomeIcon style={{color: isHypixelKeySet ? "green" : "red"}} icon={faExclamationCircle} />}
            </div>
            <div className="mainSettingsOption">
                <UnderlinedTitle text={"Overlay Logs: "}></UnderlinedTitle>
                <InputBoxButton
                    onClick={async () => {
                        const path: Electron.OpenDialogReturnValue = await window.ipcRenderer.invoke("selectLogFile");
                        if (path.filePaths[0] !== undefined) {
                            const logPath = path.filePaths[0];
                            const readable = await window.ipcRenderer.invoke<boolean>("isFileReadable", logPath);
                            if (readable.data) {
                                window.ipcRenderer.send("logFileSet", logPath);
                            }
                        }
                    }}
                    text={"Select Log File"}
                />
                {<FontAwesomeIcon style={{color: isLogsSet ? "green" : "red"}} icon={faExclamationCircle} />}
            </div>
            <div>
                <ToggleButton text={"Keathiz"} onChange={async (event) => {
                    const payload: SettingsConfig = {boomza: settings.boomza, keathiz: !settings.keathiz, lunar: settings.lunar};
                    store.dispatch(setSettingsValue(payload));
                }} options={{enabled: settings.keathiz}} />
            </div>
            <div>
                <ToggleButton text={"Lunar"} onChange={async (event) => {
                    const payload: SettingsConfig = {boomza: settings.boomza, keathiz: settings.keathiz, lunar: !settings.lunar};
                    store.dispatch(setSettingsValue(payload));
                }} options={{enabled: settings.lunar}} />
            </div>
            <div>
                <ToggleButton text={"Boomza"} onChange={async (event) => {
                    const payload: SettingsConfig = {boomza: !settings.boomza, keathiz: settings.keathiz, lunar: settings.lunar};
                    store.dispatch(setSettingsValue(payload));
                }} options={{enabled: settings.boomza}} />
            </div>
            <div className="w-fit bg-gray-50">

            </div>
            <div>
                <span>Version: {version}</span>
            </div>
        </div>
    );
};

export default MainSettings;
