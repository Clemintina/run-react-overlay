import React from "react";
import {ConfigStore} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import {Link} from "react-router-dom";
import {InputBoxButton} from "@components/user/InputBoxButton";

const NavigationBar = (props: {children}) => {
    const localConfigStore: ConfigStore = useSelector(() => store.getState().configStore);
    const colours = localConfigStore.colours;
    const menuOptions = localConfigStore.menuOptions;

    const menuLinks = menuOptions.map((menuOption) => (
        <div key={menuOption.menuName}>
            <div className=''>
                <div className='flex'>
                    <div className='flex hover:text-white-500 hover:border-cyan-500 hover:border-2'>
                        <Link to={menuOption.menuLink}>{<InputBoxButton text={menuOption.menuName}></InputBoxButton>}</Link>
                    </div>
                </div>
            </div>
        </div>
    ));

    return (
        <div style={{color: colours.primaryColour, backgroundColor: colours.backgroundColour}} className='w-full h-full p-2 flex flex-col space-y-2'>
            <div className='flex w-full'>
                <div className='h-screen'>
                    <div className='w-20'>
                        {menuLinks}
                    </div>
                </div>
                <div className='pl-3 w-full h-full p-2 flex flex-col space-y-2'>{props.children}</div>
            </div>
        </div>
    );
};

export default NavigationBar;
