import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
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
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { Link } from "react-router-dom";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { Alert, useTheme } from "@mui/material";
import { Api, Home, Sell, ViewColumn } from "@mui/icons-material";
import { MenuOption } from "@common/utils/Schemas";
import BrushIcon from "@mui/icons-material/Brush";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import { IpcValidInvokeChannels } from "@common/utils/IPCHandler";
import { hexToRgbA } from "@common/helpers";
import { InputTextBox } from "@components/BaseComponents";

const drawerWidth = 200;
const menuOptions = Array<MenuOption>(
	{ menuName: "Appearance", menuLink: "/settings/appearance" },
	{ menuName: "APIs", menuLink: "/settings/apis" },
	{ menuName: "Essentials", menuLink: "/settings/essentials" },
	{ menuName: "Tags", menuLink: "/settings/tags" },
	{ menuName: "Nicks", menuLink: "/settings/nicks" },
	{ menuName: "Custom", menuLink: "/settings/customlinks" },
	{ menuName: "Table Editor", menuLink: "/settings/columneditor" },
);

menuOptions.sort((a, b) => a.menuName.localeCompare(b.menuName));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<AppBarProps>(({ theme, open }) => ({
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

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open" })<AppBarProps>(({ theme, open }) => ({
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

const DrawerHeader = styled("div")(({ theme }) => ({
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
		case "apis":
			return <Api />;
		case "essentials":
			return <FontAwesomeIcon icon={faCheckCircle} />;
		case "nicks":
			return <FontAwesomeIcon icon={faUserNinja} />;
		case "tags":
			return <Sell />;
		case "table editor":
			return <ViewColumn />;
		case "appearance":
			return <BrushIcon />;
		case "keybinds":
			return <KeyboardIcon />;
		case "custom":
			return <DashboardCustomizeIcon />;
		default:
			return <span />;
	}
};

export const Titlebar = ({ children }) => {
	const [open, setOpen] = React.useState(false);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const theme = useTheme();
	const { error, browserWindow, colours } = useConfigStore((state) => ({ error: state.error, browserWindow: state.browserWindow, colours: state.colours }));
	const errorMessageCode = error.code;

	return (
		<Box sx={{ display: "flex" }} className={"drag"}>
			<CssBaseline />
			<AppBar position={"fixed"} open={open} className={"drag"} sx={{ opacity: 100, backgroundColor: hexToRgbA(colours.backgroundColour, browserWindow.opacity / 100) }}>
				<Toolbar>
					<IconButton color={"inherit"} onClick={handleDrawerOpen} edge='start' className={"nodrag"} sx={{ mr: 2, ...(open && { display: "none" }) }}>
						<MenuIcon />
					</IconButton>
					<Typography variant={"h6"} noWrap component={"div"} className={"text-bold"}>
						Seraph
					</Typography>
					<Typography sx={{ marginLeft: "auto" }}>
						<div className={"flex items-center space-x-3 p-1 nodrag"}>
							<span className={"flex"}>
								<InputTextBox
									options={{ placeholder: "", resetOnEnter: true, label: { text: "Usernames" } }}
									onKeyDown={(event, textFieldState) => {
										if (event.key === "Enter") {
											if (textFieldState.includes(" ")) {
												textFieldState.split(" ").map(async (player) => {
													usePlayerStore.getState().addPlayer(player);
												});
											} else {
												usePlayerStore.getState().addPlayer(textFieldState);
											}
										}
									}}
								/>
							</span>
							<div>
								<IconButton
									className={"hover:text-cyan-500"}
									onClick={() => {
										window.ipcRenderer.send("windowMinimise");
									}}
								>
									<MinimizeIcon />
								</IconButton>
							</div>
							<div>
								<IconButton
									className={"hover:text-cyan-500"}
									onClick={() => {
										window.ipcRenderer.send("windowClose");
									}}
									sx={{ color: "red" }}
								>
									<CloseIcon />
								</IconButton>
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
				variant={"persistent"}
				anchor={"left"}
				open={open}
			>
				<DrawerHeader className={"nodrag"}>
					<IconButton onClick={handleDrawerClose}>{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
				</DrawerHeader>
				<Divider />
				<List className={"nodrag"}>
					<ListItem disablePadding>
						<Link to={"/"} onClick={() => setOpen(!open)} className={"nodrag"}>
							<ListItemButton sx={{ width: drawerWidth }}>
								<ListItemIcon>
									<Home />
								</ListItemIcon>
								<ListItemText primary={"Home"} />
							</ListItemButton>
						</Link>
					</ListItem>
					{menuOptions.map((text, index) => (
						<ListItem key={index} disablePadding>
							<Link to={text.menuLink} onClick={() => setOpen(!open)} className={"nodrag"}>
								<ListItemButton sx={{ width: drawerWidth }}>
									<ListItemIcon>{getIconType(text)}</ListItemIcon>
									<ListItemText primary={text.menuName} />
								</ListItemButton>
							</Link>
						</ListItem>
					))}
				</List>
				<Divider />
				<List className={"nodrag"}>
					<ListItem disablePadding>
						<ListItemButton onClick={() => window.ipcRenderer.invoke(IpcValidInvokeChannels.OPEN_LINK, ["https://seraph.si/discord"])}>
							<ListItemIcon>
								<FontAwesomeIcon icon={faDiscord} />
							</ListItemIcon>
							<ListItemText>Discord</ListItemText>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton onClick={() => window.ipcRenderer.invoke(IpcValidInvokeChannels.OPEN_LINK, ["https://seraph.si"])}>
							<ListItemText className={"text-center"} primary={useConfigStore.getState().version} />
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
			<Main open={open}>
				<DrawerHeader />
				{errorMessageCode === 200 ? (
					<Alert color={"success"} sx={{ opacity: 100 }}>
						<Typography sx={{ opacity: 100 }}>
							<span className={"p-1"}>
								<span className={"errorMessage"}> {error.cause}</span>
							</span>
						</Typography>
					</Alert>
				) : errorMessageCode === 400 ? (
					<Alert color={"error"} sx={{ opacity: 100 }}>
						<Typography sx={{ opacity: 100 }}>
							<span className={"font-medium"}>
								Code: <span className={"errorMessage"}> {error.code}</span>
							</span>
							<span className={"p-1"}>
								Cause: <span className={"errorMessage"}> {error.cause}</span>
							</span>
						</Typography>
					</Alert>
				) : (
					<span />
				)}
				<div className={"nodrag"}>
					<Box height={"100vh"} display={"flex"} flexDirection={"column"}>
						{children}
					</Box>
				</div>
			</Main>
		</Box>
	);
};
