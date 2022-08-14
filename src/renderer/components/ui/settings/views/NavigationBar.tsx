import React from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {InputBoxButton} from "@components/user/InputBoxButton";
import useConfigStore, {getMenuItems} from "@renderer/store/zustand/ConfigStore";

const NavigationBar = (props: { children }) => {
    const {colours, menuOptions} = useConfigStore((state) => ({colours: state.colours, menuOptions: state.menuOptions}))

    if (menuOptions.length == 0) {
        useConfigStore.getState().setMenuOptions(getMenuItems());
    }

    const menuLinks = menuOptions.map((menuOption) => (
        <div key={menuOption.menuName}>
            <div className=''>
                <div className='flex'>
                    <div className='flex w-full hover:text-white-500 hover:border-cyan-500 hover:border-2'>
                        <Link to={menuOption.menuLink} className={"w-full"}>
                            {<InputBoxButton sx={{width: "100%"}} text={menuOption.menuName}></InputBoxButton>}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    ));

    return (
        <div className='flex'>
            <div className='flex'>
                <div className='flex '>
                    <div className='flex justify-between'>
                        <div className='flex border-r-2 border-gray-500'>
                            <div>{menuLinks}</div>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className={"grid grid-col-3"}>{props.children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;
