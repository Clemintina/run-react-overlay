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
import {ConfigStore, setErrorMessage} from "@renderer/store/ConfigStore";
import {ContactStaff} from "@components/user/settings/dev/ContactStaff";

const TitleBar = () => {
    const currentRoute = useLocation();
    const localStore: ConfigStore = useSelector(() => store.getState().configStore);
    const errorMessageCode = localStore.error.code;

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
            <nav className='bg-grey-500 shadow-lg drag' style={{backgroundColor: localStore.colours.backgroundColour, color: localStore.colours.primaryColour, opacity: 10}}>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='flex justify-between'>
                        <div className='flex space-x-7'>
                            <div>
                                <Link to={titlePath} className='nodrag'>
                                    <span className={'pr-2'}>
                                        {renderCaret}
                                    </span>
                                    <UnderlinedTitle text={"Seraph"} options={{text: {size: 25}}} />
                                </Link>
                            </div>
                            <div className='md:flex items-center space-x-1'>
                                <span className={'nodrag'}><ContactStaff/></span>
                            </div>
                        </div>
                        <div className='md:flex items-center space-x-3 nodrag'>
                            <span className='flex'>
                                <InputTextBox
                                    options={{placeholder: "Username..."}}
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
                            </span>
                            <div>
                                <button
                                    className='hover:text-cyan-500'
                                    onClick={() => {
                                        window.ipcRenderer.send("windowMinimise");
                                    }}
                                >
                                    <FontAwesomeIcon icon={faWindowMinimize} />
                                </button>
                            </div>
                            <div>
                                <button
                                    className='hover:text-cyan-500'
                                    onClick={() => {
                                        window.ipcRenderer.send("windowClose");
                                    }}
                                >
                                    <FontAwesomeIcon icon={faWindowClose} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className='flex w-full'>
                {errorMessageCode != 200 ? (
                    <div className='w-full'>
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
