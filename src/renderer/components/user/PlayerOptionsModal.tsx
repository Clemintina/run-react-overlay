import React from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";
// eslint-disable-next-line import/named
import {Box, Modal} from "@mui/material";
import {ConfigStore} from "@renderer/store/ConfigStore";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {Player} from "@common/utils/PlayerUtils";

export interface PlayerOptionsModal {
    children: React.ReactElement | React.ReactElement[];
    data: Player
}

export const PlayerOptionsModal: React.ElementType = (props: PlayerOptionsModal) => {
    const configStore: ConfigStore = useSelector(() => store.getState().configStore);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: window.innerWidth,
        bgcolor: configStore.colours.backgroundColour,
        border: `2px solid ${configStore.colours.primaryColour}`,
        boxShadow: 24,
        p: 4,
        color: configStore.colours.primaryColour,
    };

    // TODO Add player options
    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={"..."} />
            <Modal open={open} onClose={handleClose} style={{color: configStore.colours.primaryColour}}>
                <Box sx={style}>
                    <div className='p-8'>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-2'>

                            <InputBoxButton text={'Report this player'}/>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};
