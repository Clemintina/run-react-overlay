import React, {useState} from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import {ConfigStore} from "@renderer/store/ConfigStore";
import {Box, Modal} from "@mui/material";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {HexColorPicker} from "react-colorful";

export interface ColourPicker {
    children: React.ReactElement | React.ReactElement[];
    setColour: (colour:string) => void;
    text?: string;
    colourObject?: string;
    colourArray?: Array<{colour: string, requirement: number, operator: string}>
}

export const ColourPicker: React.ElementType = (props: ColourPicker) => {
    const configStore: ConfigStore = useSelector(() => store.getState().configStore);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [colour, setColour] = useState("#"+props.colourObject ?? '242424');

    const handleChange = (event) => {
        setColour(event);
        props.setColour(event);
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: configStore.colours.backgroundColour,
        border: `2px solid ${colour}`,
        boxShadow: 24,
        p: 4,
        color: configStore.colours.primaryColour,
    };

    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={props?.text??'Pick!'} />
            <Modal open={open} onClose={handleClose} style={{color: configStore.colours.primaryColour}}>
                <Box sx={style}>
                    <HexColorPicker color={colour} onChange={handleChange} />
                </Box>
            </Modal>
        </div>
    );
};
