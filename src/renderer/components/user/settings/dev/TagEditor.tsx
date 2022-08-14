import React from "react";
import {useSelector} from "react-redux";
// eslint-disable-next-line import/named
import {Box, Modal} from "@mui/material";
import {InputBoxButton} from "@components/user/InputBoxButton";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface TagEditor {
    children: React.ReactElement | React.ReactElement[];
}

export const TagEditor: React.ElementType = (props: TagEditor) => {
    const {colours} = useConfigStore((state) => ({colours: state.colours}))

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: window.innerWidth,
        bgcolor: colours.backgroundColour,
        border: `2px solid ${colours.primaryColour}`,
        boxShadow: 24,
        p: 4,
        color: colours.primaryColour,
    };

    // TODO Add custom tag editor

    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={"Tag Editor"} />
            <Modal open={open} onClose={handleClose} style={{color: colours.primaryColour}}>
                <Box sx={style}>
                    <div className='p-8'>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-2'>
                            <span>In Progress</span>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};
