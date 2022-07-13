import "@assets/scss/titlebar.scss";
import store from "@renderer/store";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars as headerIcon, faWindowClose, faWindowMinimize} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {getPlayerHypixelData} from "@renderer/store/PlayerStore";
import {UnderlinedTitle} from "@components/user/UnderlinedTitle";
import {InputTextBox} from "@components/user/InputTextBox";
import {Alert} from "@mui/material";
import {useSelector} from "react-redux";
import {setErrorMessage} from "@renderer/store/ConfigStore";

const TitleBar = () => {
    const currentRoute = useLocation();
    const errorMessageCode = useSelector(() => store.getState().configStore.error.code);

    if (errorMessageCode != 200) {
        setTimeout(() => store.dispatch(setErrorMessage({code: 200, title: "", cause: "", detail: ""})), 5000);
    }

    let renderCaret: JSX.Element;
    let titlePath: string;
    if (currentRoute.pathname.includes("settings")) {
        renderCaret = <FontAwesomeIcon icon={headerIcon} fontSize={"25"} />;
        titlePath = "";
    } else {
        renderCaret = <FontAwesomeIcon icon={headerIcon} fontSize={"25"} />;
        titlePath = "/settings";
    }

    return (
        <div>
            <div className='header drag'>
                <div className='headerBar'>
                    <Link to={titlePath} style={{display: "flex", color: store.getState().configStore.colours.primaryColour}} className='nodrag'>
                        <div style={{paddingRight: 5}}>
                            <div className='settings-icon' style={{display: "flex", paddingLeft: 10}}>
                                {renderCaret}
                            </div>
                        </div>
                        <UnderlinedTitle text={"Seraph"} options={{text: {size: 25}}} />
                    </Link>
                </div>
                <div className='headerSearchBox nodrag'>
                    <InputTextBox
                        options={{placeholder: "Username...", className: "headerSearchBox"}}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                store.dispatch(
                                    getPlayerHypixelData({
                                        name: event.currentTarget.value,
                                    }),
                                );
                                event.currentTarget.value = "";
                            }
                        }}
                    />
                </div>
                <div className='nodrag'>
                    <span>
                        <button
                            className='headerButton'
                            onClick={() => {
                                window.ipcRenderer.send("windowMinimise");
                            }}
                        >
                            <FontAwesomeIcon icon={faWindowMinimize} />
                        </button>
                    </span>
                    <span>
                        <button
                            className='headerButton'
                            onClick={() => {
                                window.ipcRenderer.send("windowClose");
                            }}
                        >
                            <FontAwesomeIcon icon={faWindowClose} />
                        </button>
                    </span>
                </div>
            </div>
            <div className='w-full flex'>
                {errorMessageCode != 200 ? (
                    <div className='w-full flex'>
                        <Alert color='error'>
                            <span>
                                <span className='font-medium'>
                                    Code: <span className='errorMessage'> {store.getState().configStore.error.code}</span>
                                </span>{" "}
                                    Cause: <span className='errorMessage'> {store.getState().configStore.error.cause}</span>
                            </span>
                        </Alert>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

export default TitleBar;
