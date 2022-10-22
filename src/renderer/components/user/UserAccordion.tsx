import React from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface UserAccordion {
    name: string;
    children: JSX.Element | JSX.Element[];
}

export const UserAccordion = (props: UserAccordion) => {
    return (
        <div>
            <Accordion>
                <AccordionSummary sx={{ backgroundColor: "transparent" }} expandIcon={<ExpandMoreIcon />} aria-controls={`${props.name}-content`} id={`${props.name}-header`}>
                    <Typography className={"text-gray-400"}>{props.name}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "transparent" }}>{props.children}</AccordionDetails>
            </Accordion>
        </div>
    );
};
