import React, {useState} from "react";
import {Box, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup} from "@mui/material";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {HexColorPicker} from "react-colorful";
import {TagArray} from "@common/utils/Schemas";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import useTagStore from "@renderer/store/zustand/TagStore";

export interface ColourPickerArray {
    children: React.ReactElement | React.ReactElement[];
    setColour: (colour: TagArray) => void;
    text?: string;
    colourObject: {display: string; colour?: Array<TagArray>, colours?: Array<TagArray>};
}

export const ColourPickerArray: React.ElementType = (props: ColourPickerArray) => {
    const configStore = useConfigStore((state) => state);
    const tagStore = useTagStore((state) => state);
    // @ts-ignore
    let originalColourArray = props.colourObject?.colour != undefined ? "colour" : "colours";

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        if (arrayItem.colour.length == 6 && arrayItem.requirement != 0) {
            props.setColour(arrayItem);
        }
    };

    const [arrayItem, setArrayItem] = useState({colour: "", requirement: 0, operator: "<="});
    const [customColour, setCustomColour] = useState("242424");
    const [defaultValue, setDefaultValue] = useState(props.colourObject[originalColourArray][0].requirement);

    const getArrayDetails = (props: ColourPickerArray) => {
        const resp: Array<JSX.Element> = [];
        const arr = [...props.colourObject[originalColourArray]];
        arr.sort((a, b) => a.requirement - b.requirement);
        for (const obj of arr) {
            resp.push(
                <div key={obj.requirement} className={"grid grid-cols-4 gap-2 text-lg align-middle"}>
                    <FormControlLabel value={obj.requirement} control={<Radio />} label={""} />
                    <span>{obj.requirement}</span>
                    <span>{obj.operator}</span>
                    <span style={{color: "#" + obj.colour}}>{obj.colour}</span>
                    <span></span>
                </div>,
            );
        }
        return resp;
    };

    const handleChange = (event: string) => {
        event = event.replace("#", "");
        setCustomColour(event);
        arrayItem.colour = event;
        if (arrayItem.colour.length == 6 && arrayItem.requirement != 0) {
            props.setColour(arrayItem);
        }
    };

    const handleRadioChange = (event: React.ChangeEvent) => {
        const radioNumber = Number.parseInt((event.target as HTMLInputElement).value);
        if (arrayItem.colour.length == 6 && arrayItem.requirement != 0) {
            props.setColour(arrayItem);
        }
        props.colourObject[originalColourArray].map((arrayItem) => {
            if (arrayItem.requirement == radioNumber) {
                setDefaultValue(arrayItem.requirement);
                setCustomColour(`#${arrayItem.colour}`);
            }
        });
        setArrayItem({requirement: Number.parseInt((event.target as HTMLInputElement).value), colour: "", operator: "<="});
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: configStore.colours.backgroundColour,
        border: `2px solid #${customColour}`,
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
                    <FormControl>
                        <FormLabel id="colour-array">Select which item you'd like to edit</FormLabel>
                        <RadioGroup defaultValue={defaultValue} onChange={handleRadioChange}>
                            {colourArrayData}
                        </RadioGroup>
                    </FormControl>
                    <div className={"grid place-items-center"}>
                        <HexColorPicker onChange={handleChange} color={`#${customColour}`} />
                    </div>
                </Box>
            </Modal>
        </div>
    );
};
