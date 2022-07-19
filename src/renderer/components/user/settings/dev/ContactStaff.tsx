import React from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";
// eslint-disable-next-line import/named
import {Box, FormHelperText, FormLabel, InputLabel, Modal, SelectChangeEvent, Typography} from "@mui/material";
import {ClientSetting, ConfigStore, setClient, setErrorMessage} from "@renderer/store/ConfigStore";
import {InputBoxButton} from "@components/user/InputBoxButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {FeedbackForm} from "@components/user/settings/FeedbackForm";
import {Label} from "@mui/icons-material";

export interface ContactStaff {
    children: React.ReactElement | React.ReactElement[];
}

export const ContactStaff: React.ElementType = (props: ContactStaff) => {
    const configStore: ConfigStore = useSelector(() => store.getState().configStore);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [feedbackType, setFeedbackType] = React.useState('');
    const [feedbackTypeMessage, setFeedbackTypeMessage] = React.useState('');

    const handleChange = async (event: SelectChangeEvent) => {
        setFeedbackType(event.target.value);
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: configStore.colours.backgroundColour,
        border: `2px solid ${configStore.colours.primaryColour}`,
        boxShadow: 24,
        p: 4,
        color: configStore.colours.primaryColour,
    };

    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={"Contact Us"}/>
            <Modal open={open} onClose={handleClose} style={{color: configStore.colours.primaryColour}}>
                <Box sx={style}>
                    <Typography sx={{mt: 0}}><FormLabel>Feedback Form</FormLabel></Typography>

                    <Typography sx={{mt: 2}}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select value={feedbackType} label='Feedback' onChange={handleChange}>
                                <MenuItem value={"Bug"}>Bug</MenuItem>
                                <MenuItem value={"Suggestion"}>Suggestion</MenuItem>
                            </Select>
                            <FormHelperText className={"text-red-500 font-bold"}>
                                {"The type of report you'd like to submit!"}
                            </FormHelperText>
                            <FeedbackForm options={{text: feedbackType}} onChange={(event)=>setFeedbackTypeMessage(event.target.value)} />
                        </FormControl>
                        <InputBoxButton onClick={async ()=>{
                            const body = {
                                overlay:{
                                    version: configStore.version,
                                    owner: configStore.hypixel.apiKeyOwner,
                                    run: configStore.runKey,
                                    settings: configStore.settings
                                },
                                user:{
                                    type: feedbackType,
                                    message: feedbackTypeMessage
                                }
                            }
                            const strinyBody = JSON.stringify(body)
                            await window.ipcRenderer.send('ContactStaff', strinyBody);
                        }} text={'Submit'}/>
                    </Typography>

                </Box>
            </Modal>
        </div>
    );
};
