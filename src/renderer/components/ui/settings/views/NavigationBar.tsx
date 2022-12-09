import React from "react";
import { Box } from "@mui/material";

const NavigationBar = (props: { children }) => {
	return <Box className={"grid grid-col-3 w-full"}>{props.children}</Box>;
};

export default NavigationBar;
