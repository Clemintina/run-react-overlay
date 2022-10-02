import * as React from "react";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useConfigStore, {ConfigStore} from "@renderer/store/zustand/ConfigStore";
import {Link} from "react-router-dom";
import {InputTextBox} from "@components/user/InputTextBox";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faUserNinja, faWindowClose, faWindowMinimize} from "@fortawesome/free-solid-svg-icons";
import {Alert, useTheme} from "@mui/material";
import {Home, Sell} from "@mui/icons-material";
import {MenuOption} from "@common/utils/Schemas";

const drawerWidth = 200;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})<AppBarProps>(({theme, open}) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== "open"})<AppBarProps>(({theme, open}) => ({
    // Make the sidebar open correctly
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    // Make it close correctly
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({theme}) => ({
    // How text is displayed
    display: "flex",
    alignItems: "center",
    // Keep the menu options below the title
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const getIconType = (menuObject: MenuOption) => {
    const ime = menuObject.menuName.toLowerCase();
    switch (ime) {
        case "essentials":
            return <FontAwesomeIcon icon={faCheckCircle}/>;
        case "nicks":
            return <FontAwesomeIcon icon={faUserNinja}/>;
        case "tags":
            return <Sell/>;
    }
};

const NewTitlebar = ({children}) => {
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const theme = useTheme();
    const localStore: ConfigStore = useConfigStore((state) => state);
    const errorMessageCode = localStore.error.code;

    return (
        <Box sx={{display: "flex"}} className={"drag"}>
            <CssBaseline/>
            <AppBar position='fixed' open={open} className={"drag"} sx={{opacity: 100}}
                    style={{backgroundColor: "transparent"}}>
                <Toolbar>
                    <IconButton color='inherit' aria-label='open nav bar' onClick={handleDrawerOpen} edge='start'
                                className={'nodrag'}
                                sx={{mr: 2, ...(open && {display: "none"})}}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant='h6' noWrap component='div' className={"text-bold"}>
                        Seraph
                    </Typography>
                    <Typography sx={{marginLeft: "auto"}}>
                        <div className='md:flex items-center space-x-3 nodrag'>
                            <span className='flex'>
                                <InputTextBox
                                    options={{placeholder: "Username...", resetOnEnter: true}}
                                    onKeyDown={(event, textFieldState) => {
                                        if (event.key === "Enter") {
                                            usePlayerStore.getState().addPlayer(textFieldState);
                                        }
                                    }}
                                />
                            </span>
                            <div>
                                <button
                                    className='hover:text-cyan-500'
                                    onClick={() => {
                                        window.ipcRenderer.send("windowMinimise");
                                    }}
                                >
                                    <FontAwesomeIcon icon={faWindowMinimize}/>
                                </button>
                            </div>
                            <div>
                                <button
                                    className='hover:text-cyan-500'
                                    onClick={() => {
                                        window.ipcRenderer.send("windowClose");
                                    }}
                                >
                                    <FontAwesomeIcon icon={faWindowClose}/>
                                </button>
                            </div>
                        </div>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                PaperProps={{
                    sx: {
                        opacity: 100,
                    },
                }}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant='persistent'
                anchor='left'
                open={open}
            >
                <DrawerHeader className={'nodrag'}>
                    <IconButton onClick={handleDrawerClose}>{theme.direction === "ltr" ? <ChevronLeftIcon/> :
                        <ChevronRightIcon/>}</IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    <ListItem disablePadding>
                        <Link to={"/"} onClick={() => setOpen(!open)} className={'nodrag'}>
                            <ListItemButton sx={{width: drawerWidth}}>
                                <ListItemIcon>
                                    <Home/>
                                </ListItemIcon>
                                <ListItemText primary={"Home"}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    {useConfigStore.getState().menuOptions.map((text, index) => (
                        <ListItem key={index} disablePadding>
                            <Link to={text.menuLink} onClick={() => setOpen(!open)} className={'nodrag'}>
                                <ListItemButton sx={{width: drawerWidth}}>
                                    <ListItemIcon>{getIconType(text)}</ListItemIcon>
                                    <ListItemText primary={text.menuName}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader/>
                {errorMessageCode !== 200 ? (
                    <Alert color="error" sx={{opacity: 100}}>
                        <Typography sx={{opacity: 100}}>
                            <span className='font-medium'>
                               Code: <span className='errorMessage'> {localStore.error.code}</span>
                            </span>
                            Cause: <span className='errorMessage'> {localStore.error.cause}</span>
                        </Typography>
                    </Alert>
                ) : (
                    <span/>
                )}
                <span className={"nodrag"}>{children}</span>
            </Main>
        </Box>
    );
};

export default NewTitlebar;
