import React from "react";
import {useSelector} from "react-redux";
import store from "@renderer/store";
// eslint-disable-next-line import/named
import {Box, FormHelperText, InputLabel, Modal, SelectChangeEvent, Typography} from "@mui/material";
import {ClientSetting, ConfigStore, setClient, setErrorMessage} from "@renderer/store/ConfigStore";
import {InputBoxButton} from "@components/user/InputBoxButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export interface LogSelectorModal {
    children: React.ReactElement | React.ReactElement[];
}

export const LogSelectorModal: React.ElementType = (props: LogSelectorModal) => {
    const configStore: ConfigStore = useSelector(() => store.getState().configStore);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [clientLocal, setClientLocal] = React.useState(configStore.logs.clientName);

    const handleChange = async (event: SelectChangeEvent) => {
        const clientSettings: ClientSetting = {
            clientName: event.target.value,
            readable: false,
            logPath: "",
        };
        setClientLocal(clientSettings.clientName);

        const appData = (await window.ipcRenderer.invoke<string>("getFilePath", "appData")).data;
        const userHome = (await window.ipcRenderer.invoke<string>("getFilePath", "home")).data;

        // /Users/kk/.lunarclient/offline/1.8/logs
        // /Users/kk/Library/Application Support/minecraft/logs

        const isMacOs = appData.includes("Application Support");

        if (clientSettings.clientName != "custom") {
            let path = "";
            switch (clientSettings.clientName) {
                case "vanilla":
                    path += isMacOs ? appData + "/minecraft/logs/" : appData + "/.minecraft/logs/";
                    break;
                case "badlion":
                    path += isMacOs ? appData + "/minecraft/logs/blclient/minecraft/" : appData + "/.minecraft/logs/blclient/minecraft/";
                    break;
                case "lunar_old":
                    path += userHome + "/.lunarclient/offline/1.8/logs/";
                    break;
                case "lunar_mlv":
                    path += appData + "/.lunarclient/offline/1.8.9/multiver/logs/";
                    break;
            }
            path += "latest.log";
            clientSettings.logPath = path;
            const readable = await window.ipcRenderer.invoke<boolean>("isFileReadable", clientSettings.logPath);
            if (readable.data) {
                clientSettings.readable = readable.data;
                window.ipcRenderer.send("logFileSet", clientSettings.logPath);
                store.dispatch(setClient(clientSettings));
            } else {
                store.dispatch(
                    setErrorMessage({
                        code: 400,
                        title: "Bad Log file",
                        cause: "The file set is invalid.",
                        detail: "Please try and set the client again if you're on a Mac, Ensure the Overlay has sufficient privileges to read the file.",
                        referenceId: "Unable to read log file.",
                    }),
                );
            }
        }
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
            <InputBoxButton onClick={handleOpen} text={"Select Log File"}>
                Select Logs
            </InputBoxButton>
            <Modal open={open} onClose={handleClose} style={{color: configStore.colours.primaryColour}}>
                <Box sx={style}>
                    <Typography sx={{mt: 0}}>
                        Please select the client you use
                    </Typography>

                    <Typography sx={{mt: 2}}>
                        <FormControl fullWidth>
                            <InputLabel>Client</InputLabel>
                            <Select value={clientLocal} label='Client' onChange={handleChange}>
                                <MenuItem value={"vanilla"}>Vanilla / Forge</MenuItem>
                                <MenuItem value={"badlion"}>Badlion</MenuItem>
                                <MenuItem value={"lunar_old"}>Lunar</MenuItem>
                                <MenuItem value={"lunar-mlv"}>Lunar Multi-version</MenuItem>
                                <MenuItem value={"custom"}>Custom</MenuItem>
                            </Select>
                            <FormHelperText className={"text-red-500 font-bold"} style={configStore.error.code != 200 ? {} : {display: "none"}}>
                                Un-readable log file
                            </FormHelperText>
                        </FormControl>
                    </Typography>

                    <Typography sx={{mt: 2}} style={clientLocal == "custom" ? {} : {display: "none"}}>
                        <InputBoxButton
                            onClick={async () => {
                                const path: Electron.OpenDialogReturnValue = await window.ipcRenderer.invoke("selectLogFile");
                                if (path.filePaths[0] !== undefined) {
                                    const logPath = path.filePaths[0];
                                    const readable = await window.ipcRenderer.invoke<boolean>("isFileReadable", logPath);
                                    if (readable.data) {
                                        window.ipcRenderer.send("logFileSet", logPath);
                                        const clientSettings: ClientSetting = {
                                            clientName: "custom",
                                            readable: true,
                                            logPath: logPath,
                                        };
                                        store.dispatch(setClient(clientSettings));
                                    } else {
                                        store.dispatch(
                                            setErrorMessage({
                                                code: 400,
                                                title: "Bad Log file",
                                                cause: "The file set is invalid.",
                                                detail: "Please try and set the client again if you're on a Mac, Ensure the Overlay has sufficient privileges to read the file.",
                                                referenceId: "Unable to read log file.",
                                            }),
                                        );
                                    }
                                }
                            }}
                            text={"Select Log File"}
                        />
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};
