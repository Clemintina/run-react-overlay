import {ConfigStore} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import React from "react";
import {Box} from "@mui/material";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {Link} from "react-router-dom";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import Essentials from "@components/ui/settings/views/Essentials";

const CommonSettings = () => {
    const localConfigStore: ConfigStore = useSelector(() => store.getState().configStore);
    const colours = localConfigStore.colours;
    // TODO make it look nicer and cleaner

   return (
        <NavigationBar>
            <div>
                <Box>
                    <div className='p-8'>
                        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-3'>

                        </div>
                    </div>
                </Box>
            </div>
        </NavigationBar>
    );
};

export default CommonSettings;
