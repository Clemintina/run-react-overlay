import React, {FC} from "react";
// eslint-disable-next-line import/named
import {Box, InputLabel, Modal} from "@mui/material";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {Player} from "@common/utils/PlayerUtils";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useConfigStore from "@renderer/store/zustand/ConfigStore";

export type PlayerOptionsModal = {
    children: React.ReactElement | React.ReactElement[];
    data: Player;
};

export const PlayerOptionsModal: FC<PlayerOptionsModal> = (props: PlayerOptionsModal) => {
    const { colours } = useConfigStore((state) => ({ colours: state.colours }));

    const [open, setOpen] = React.useState(false);
    const [reportType, setReportType] = React.useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: window.innerWidth / 1.2,
        bgcolor: colours.backgroundColour,
        border: `2px solid ${colours.primaryColour}`,
        boxShadow: 24,
        p: 4,
        color: colours.primaryColour,
    };

    // TODO Add player options
    return (
        <div>
            <InputBoxButton onClick={handleOpen} text={"..."} sx={{ height: 20, width: 10, padding: 2 }} />
            <Modal open={open} onClose={handleClose} style={{ color: colours.primaryColour }}>
                <Box sx={style}>
                    <div className='p-8'>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-2'>
                            <span>
                                <FormControl fullWidth>
                                    <InputLabel>Report Type</InputLabel>
                                    <Select value={reportType} label='Client' onChange={(event) => setReportType(event.target.value)}>
                                        <MenuItem value={"cheating_blatant"}>Blatant Cheating</MenuItem>
                                        <MenuItem value={"cheating_closet"}>Closet Cheating</MenuItem>
                                        <MenuItem value={"sniping"}>Sniping</MenuItem>
                                        <MenuItem value={"bot"}>Botting</MenuItem>
                                        <MenuItem value={"sniping_potential"}>Potential Sniper</MenuItem>
                                    </Select>
                                </FormControl>
                            </span>
                            <InputBoxButton text={"Report this player"} />
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};
