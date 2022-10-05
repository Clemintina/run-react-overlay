import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import { InputBoxButton } from "@components/user/InputBoxButton";
import { HexColorPicker } from "react-colorful";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export interface ColourPicker {
    children: React.ReactElement | React.ReactElement[];
    setColour: (colour: string) => void;
    text?: string;
    colourObject?: string;
}

export const ColourPicker: React.ElementType = (props: ColourPicker) => {
    const { colours } = useConfigStore((state) => ({ colours: state.colours }));

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [colour, setColour] = useState("#" + props.colourObject ?? "242424");

    const handleChange = (event) => {
        setColour(event);
        props.setColour(event.replace("#", ""));
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: colours.backgroundColour,
        border: `2px solid ${colour}`,
        boxShadow: 24,
        p: 4,
        color: colours.primaryColour,
    };

    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={props?.text ?? "Pick!"} />
            <Modal open={open} onClose={handleClose} style={{ color: colours.primaryColour }}>
                <Box sx={style}>
                    <HexColorPicker color={colour} onChange={handleChange} />
                </Box>
            </Modal>
        </div>
    );
};
