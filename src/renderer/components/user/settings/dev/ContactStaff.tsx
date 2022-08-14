// eslint-disable-next-line import/named
import {Box, FormHelperText, FormLabel, InputLabel, Modal, SelectChangeEvent, Typography} from "@mui/material";
import {InputBoxButton} from "@components/user/InputBoxButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {FeedbackForm} from "@components/user/settings/FeedbackForm";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import React from "react";

export interface ContactStaff {
    children: React.ReactElement | React.ReactElement[];
}

export const ContactStaff: React.ElementType = (props: ContactStaff) => {
    const {colours, hypixel, settings, run, version} = useConfigStore((state) => ({colours: state.colours, hypixel: state.hypixel, settings: state.settings, run: state.run, version: state.version}))

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFeedbackResponse(false);
    };
    const [feedbackType, setFeedbackType] = React.useState("");
    const [feedbackTypeMessage, setFeedbackTypeMessage] = React.useState("");
    const [feedbackResponse, setFeedbackResponse] = React.useState(false);

    const handleChange = async (event: SelectChangeEvent) => {
        setFeedbackType(event.target.value);
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: colours.backgroundColour,
        border: `2px solid ${colours.primaryColour}`,
        boxShadow: 24,
        p: 4,
        color: colours.primaryColour,
    };

    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={"Tester Feedback"}/>
            <Modal open={open} onClose={handleClose} style={{color: colours.primaryColour}}>
                <Box sx={style}>
                    <Typography sx={{mt: 0}}>
                        <FormLabel title={"Tester Feedback"}>Feedback Form</FormLabel>
                    </Typography>

                    <Typography sx={{mt: 2}}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select value={feedbackType} label='Feedback' onChange={handleChange}>
                                <MenuItem value={"Bug"}>Bug</MenuItem>
                                <MenuItem value={"Suggestion"}>Suggestion</MenuItem>
                            </Select>
                            <FormHelperText className={"text-red-500 font-bold"}>{"The type of report you'd like to submit!"}</FormHelperText>
                            <FeedbackForm options={{text: feedbackType, formHelper: "Please write as descriptively as possible"}} onChange={(event) => setFeedbackTypeMessage(event.target.value)}/>
                        </FormControl>
                        <span>
                            <InputBoxButton
                                onClick={async () => {
                                    const body = {
                                        overlay: {
                                            version: version,
                                            owner: hypixel.apiKeyOwner,
                                            run: run.apiKey,
                                            settings: settings,
                                        },
                                        user: {
                                            type: feedbackType,
                                            message: feedbackTypeMessage,
                                        },
                                    };
                                    const strinyBody = JSON.stringify(body);
                                    await window.ipcRenderer.send("ContactStaff", strinyBody);
                                    setTimeout(() => setFeedbackResponse(true), 2000);
                                }}
                                text={"Submit"}
                            />
                            <span style={feedbackResponse ? {} : {display: "none"}} className='pl-2 text-green-500'>
                                ✓
                            </span>
                        </span>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};
