import "@assets/scss/titlebar.scss";
import store from '@renderer/store';
import {getPlayerHypixelData} from "@renderer/store/PlayerStore";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars as headerIcon} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

const TitleBar = () => {

    const currentRoute = useLocation();

    let renderCaret: JSX.Element;
    let titlePath: string;
    if (currentRoute.pathname.includes('settings')) {
        renderCaret = <FontAwesomeIcon icon={headerIcon} fontSize={'30'}/>;
        titlePath = "";
    } else {
        renderCaret = <FontAwesomeIcon icon={headerIcon} fontSize={'30'}/>;
        titlePath = "settings";
    }

    return (
        <div className='header'>
            <div className='headerBar'>
                <Link to={titlePath} style={{display: 'flex'}}>
                    <div style={{paddingRight: 5}}>
                        <div className="settings-icon" style={{display: "flex"}}>
                            {renderCaret}
                        </div>
                    </div>
                   <div className="title">
                       <header style={{fontSize: 30}}>Seraph</header>
                   </div>
                </Link>
            </div>
            <div className='headerSearchBox'>
                <input type='text' placeholder='Username...' className="headerSearchBox" onKeyDown={event => {
                    if (event.key === 'Enter') {
                        store.dispatch(getPlayerHypixelData({name: event.currentTarget.value}));
                        event.currentTarget.value = "";
                    }
                }}/>
            </div>
        </div>
    );
}

export default TitleBar;
