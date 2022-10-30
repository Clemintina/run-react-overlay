import {Alert, Snackbar} from "@mui/material";
import React from "react";

export interface AppSnackbar {
    message: string;
    timeout?: number;
    display?: boolean;
}

const AppSnackbar = (props: AppSnackbar) => {
    const [open, setOpen] = React.useState(props?.display ?? false);

    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} onClose={handleClose} autoHideDuration={props?.timeout ?? 6000}>
            <Alert severity={"success"} sx={{width: "100%"}}>
                {props.message}
            </Alert>
        </Snackbar>
    );
};

export default AppSnackbar;
