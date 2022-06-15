import "@assets/scss/titlebar.scss";
import React from 'react';
import store from "@common/store";
import {apiKeyValidator} from "@common/store/ConfigStore";

const MainSettings = () => {
    return (
        <div>
            <h1>TODO add settings</h1>
            <div>Hypixel API Key: <input onKeyDown={event => {
                if (event.key === 'Enter') {
                    store.dispatch(apiKeyValidator(event.currentTarget.value));
                }
            }}/></div>
            <div> Overlay Logs: <input/></div>
        </div>
    );
}

export default MainSettings;
