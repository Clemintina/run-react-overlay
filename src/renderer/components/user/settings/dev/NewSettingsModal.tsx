import React from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";
// eslint-disable-next-line import/named
import {Box, Modal} from "@mui/material";
import {ConfigStore} from "@renderer/store/ConfigStore";
import {InputBoxButton} from "@components/user/InputBoxButton";

export interface NewSettingsModal {
    children: React.ReactElement | React.ReactElement[];
}

export const NewSettingsModal: React.ElementType = (props: NewSettingsModal) => {
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

    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={"Beta Settings"} />
            <Modal open={open} onClose={handleClose} style={{color: configStore.colours.primaryColour}}>
                <Box sx={style}>
                    <div className='p-8'>
                        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-3'>
                            <div className='p-4 rounded-md flex items-center justify-center'>
                                <div className='bg-cyan-500 max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                        <p className='text-cyan-700 text-base'>Configure the APIs the Overlay uses.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 rounded-md flex items-center justify-center'>
                                <div className='bg-cyan-500 max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                        <p className='text-cyan-700 text-base'>Configure the APIs the Overlay uses.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 rounded-md flex items-center justify-center'>
                                <div className='bg-cyan-500 max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                        <p className='text-cyan-700 text-base'>Configure the APIs the Overlay uses.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 rounded-md flex items-center justify-center'>
                                <div className='bg-cyan-500 max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 rounded-md flex items-center justify-center'>
                                <div className='bg-cyan-500 max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 rounded-md flex items-center justify-center'>
                                <div className='bg-cyan-500 max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 bg-cyan-400 rounded-md flex items-center justify-center'>
                                <div className='max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                        <p className='text-cyan-700 text-base'>Configure the APIs the Overlay uses.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 bg-cyan-400 rounded-md flex items-center justify-center'>
                                <div className='max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                        <p className='text-cyan-700 text-base'>Configure the APIs the Overlay uses.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 bg-cyan-400 rounded-md flex items-center justify-center'>
                                <div className='max-w-sm rounded overflow-hidden shadow-lg '>
                                    <div className='px-6 py-4'>
                                        <div className='font-bold text-xl mb-2'>APIs</div>
                                        <p className='text-cyan-700 text-base'>Configure the APIs the Overlay uses.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};
