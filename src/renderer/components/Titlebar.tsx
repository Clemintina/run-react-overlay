import "@assets/scss/titlebar.scss";
import store from "@renderer/store";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars as headerIcon} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {getPlayerHypixelData} from "@renderer/store/PlayerStore";

const TitleBar = () => {
    const currentRoute = useLocation();
    const errorMessageCode = store.getState().configStore.error.code;

    let renderCaret: JSX.Element;
    let titlePath: string;
    if (currentRoute.pathname.includes("settings")) {
        renderCaret = <FontAwesomeIcon icon={headerIcon} fontSize={"30"} />;
        titlePath = "";
    } else {
        renderCaret = <FontAwesomeIcon icon={headerIcon} fontSize={"30"} />;
        titlePath = "settings";
    }

    return (
        <div>
            <div className='header'>
                <div className='headerBar drag'>
                    <Link to={titlePath} style={{display: "flex"}}>
                        <div style={{paddingRight: 5}}>
                            <div className='settings-icon' style={{display: "flex"}}>
                                {renderCaret}
                            </div>
                        </div>
                        <div className='underline'>
                            <header style={{fontSize: 30}}>Seraph</header>
                        </div>
                    </Link>
                </div>
                <div className='headerSearchBox'>
                    <input
                        type='text'
                        placeholder='Username...'
                        className='headerSearchBox'
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
            </div>
            <div className='error'>
                {errorMessageCode != 200 ? (
                    <div className='errorBox'>
                        <div className='underline'>
                            Code: <span className='errorMessage'> {store.getState().configStore.error.code}</span>
                        </div>
                        <div className='underline'>
                            Description: <span className='errorMessage'> {store.getState().configStore.error.title}</span>
                        </div>
                        <div className='underline'>
                            Detail: <span className='errorMessage'> {store.getState().configStore.error.detail}</span>
                        </div>
                        <br />
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

export default TitleBar;
