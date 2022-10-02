import React from "react";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

const NavigationBar = (props: { children }) => {
    return (
        <div className='flex' style={{height: useConfigStore.getState().browserWindow.height}}>
            <div className='flex'>
                <div className='flex '>
                    <div className='flex'>
                        <div className={"grid grid-col-3"}>{props.children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;
