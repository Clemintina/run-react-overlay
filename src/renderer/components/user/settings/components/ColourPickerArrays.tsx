import React, {useState} from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";
import {ConfigStore} from "@renderer/store/ConfigStore";
import {Box, Modal} from "@mui/material";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {Interweave} from "interweave";

export interface ColourPickerArray {
    children: React.ReactElement | React.ReactElement[];
    setColour: (colour: string) => void;
    text?: string;
    colourObject: Array<{colour: string; requirement: number; operator: string}>;
}

export const ColourPickerArray: React.ElementType = (props: ColourPickerArray) => {
    const configStore: ConfigStore = useSelector(() => store.getState().configStore);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [colour, setColour] = useState("#" + props.colourObject ?? "242424");

    const getArrayDetails = (props) => {
        let data = "";
        data += `<div class="flex grid grid-col-3">`;
        console.log(props);
        for (const obj of props.colourObject) {
            data += `<div>
                <span>${obj.requirement}</span>
                <span>${obj.operator}</span>
                <span>${obj.colour}</span>
                <span><HexColorPicker color={obj.colour} /></span>
            </div>`;
        }
        data += `</div>`;
        return data;
    };

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

    const colourArrayData = getArrayDetails(props);

    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={props?.text ?? "Pick!"} />
            <Modal open={open} onClose={handleClose} style={{color: configStore.colours.primaryColour}}>
                <Box sx={style}>
                    <Interweave content={colourArrayData} />
                </Box>
            </Modal>
        </div>
    );
};
