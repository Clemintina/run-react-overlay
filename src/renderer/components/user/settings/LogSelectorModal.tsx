// eslint-disable-next-line import/named
import {Box, Fade, FormHelperText, InputLabel, Modal, SelectChangeEvent, Typography} from "@mui/material";
import React, {useState} from "react";
import {InputBoxButton} from "@components/user/InputBoxButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {ClientSetting} from "@common/utils/Schemas";
import {IpcValidInvokeChannels} from "@common/utils/IPCHandler";

export interface LogSelectorModal {
    children: React.ReactElement | React.ReactElement[];
}

let label = "Select Log File";

export const LogSelectorModal: React.ElementType = (props: LogSelectorModal) => {
    const {logs, colours, error} = useConfigStore((state) => ({logs: state.logs, colours: state.colours, error: state.error}));
    if (logs.clientName !== null && logs.clientName !== undefined) label = logs.clientName;
    const [open, setOpen] = React.useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [clientLocal, setClientLocal] = useState<string>(logs.clientName);

    const handleChange = async (event: SelectChangeEvent) => {
        const clientSettings: ClientSetting = {
            clientName: event.target.value,
            readable: false,
            logPath: "",
        };
        setClientLocal(clientSettings.clientName);

        const appData = (await window.ipcRenderer.invoke<string>(IpcValidInvokeChannels.GET_FILE_PATH, ["appData"])).data;
        const userHome = (await window.ipcRenderer.invoke<string>(IpcValidInvokeChannels.GET_FILE_PATH, ["home"])).data;

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
                case "lunar_mlv":
                    path += userHome + "/.lunarclient/offline/multiver/logs/";
                    break;
            }
            path += "latest.log";
            clientSettings.logPath = path;
            const readable = await window.ipcRenderer.invoke<boolean>(IpcValidInvokeChannels.IS_FILE_READABLE, [clientSettings.logPath]);
            if (readable.data) {
                clientSettings.readable = readable.data;
                window.ipcRenderer.send("logFileSet", clientSettings.logPath);
                useConfigStore.getState().setLogs(clientSettings);
            } else {
                useConfigStore.getState().setErrorMessage({
                    code: 400,
                    title: "Bad Log file",
                    cause: "The file set is invalid.",
                    detail: "Please try and set the client again if you're on a Mac, Ensure the Overlay has sufficient privileges to read the file.",
                    referenceId: "Unable to read log file.",
                });
            }
        }
        if (clientSettings.clientName.length != 0) {
            label = clientSettings.clientName;
        }
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
            <InputBoxButton onClick={handleOpen} text={label} options={{ colour: logs.readable ? "success" : "error" }} />
            <Modal
                className={"rounded"}
                open={open}
                onClose={handleClose}
                style={{ color: colours.primaryColour }}
                sx={{
                    borderRadius: "25px",
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography sx={{ mt: 0 }}>Please select the client you use</Typography>
                        <Typography sx={{ mt: 2 }}>
                            <FormControl fullWidth color={logs.readable ? "success" : "error"}>
                                <InputLabel>Client</InputLabel>
                                <Select value={clientLocal} label='Client' onChange={handleChange}>
                                    <MenuItem value={"vanilla"}>Vanilla / Forge</MenuItem>
                                    <MenuItem value={"badlion"}>Badlion</MenuItem>
                                    <MenuItem value={"lunar_mlv"}>Lunar</MenuItem>
                                    <MenuItem value={"custom"}>Custom</MenuItem>
                                </Select>
                                <FormHelperText className={"text-red-500 font-bold"} style={error.code !== 201 ? {} : { display: "none" }}>
                                    Un-readable log file
                                </FormHelperText>
                            </FormControl>
                        </Typography>

                        <Typography sx={{ mt: 2 }} style={clientLocal == "custom" ? {} : { display: "none" }}>
                            <InputBoxButton
                                onClick={async () => {
                                    const path: Electron.OpenDialogReturnValue = await window.ipcRenderer.invoke("selectLogFile");
                                    if (path.filePaths[0] !== undefined) {
                                        const logPath = path.filePaths[0];
                                        const readable = await window.ipcRenderer.invoke<boolean>(IpcValidInvokeChannels.IS_FILE_READABLE, [logPath]);
                                        if (readable.data) {
                                            window.ipcRenderer.send("logFileSet", logPath);
                                            const clientSettings: ClientSetting = {
                                                clientName: "custom",
                                                readable: true,
                                                logPath: logPath,
                                            };
                                            useConfigStore.getState().setLogs(clientSettings);
                                        } else {
                                            useConfigStore.getState().setErrorMessage({
                                                code: 400,
                                                title: "Bad Log file",
                                                cause: "The file set is invalid.",
                                                detail: "Please try and set the client again if you're on a Mac and ensure the Overlay has sufficient privileges to read the file.",
                                                referenceId: "Unable to read log file.",
                                            });
                                        }
                                    }
                                }}
                                options={{ colour: logs.readable ? "success" : "error" }}
                                text={"Select Log File"}
                            />
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};
