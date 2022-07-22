import {ConfigStore} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import React from "react";
import {Box} from "@mui/material";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {Link} from "react-router-dom";
import NavigationBar from "@components/ui/settings/views/NavigationBar";

const CommonSettings = () => {
    const localConfigStore: ConfigStore = useSelector(() => store.getState().configStore);
    const colours = localConfigStore.colours;
    // TODO make it look nicer and cleaner

    const menuOptions = localConfigStore.menuOptions;

    const menuLinks = menuOptions.map((menuOption) => (
        <div key={menuOption.menuName}>
            <div className='p-4 rounded-md flex items-center justify-center'>
                <div className='max-w-sm rounded overflow-hidden shadow-lg border-cyan-500 border-2'>
                    <div className='px-6 py-4'>
                        <Link to={menuOption.menuLink}>{<InputBoxButton text={menuOption.menuName}></InputBoxButton>}</Link>
                    </div>
                </div>
            </div>
        </div>
    ));

    return (
        <NavigationBar>
            <div>
                <Box>
                    <div className='p-8'>
                        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-3'>
                            {menuLinks}
                        </div>
                    </div>
                </Box>
            </div>
        </NavigationBar>
    );
};

export default CommonSettings;
