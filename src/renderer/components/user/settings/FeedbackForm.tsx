import React from "react";
import { FormHelperText, Input, InputLabel } from "@mui/material";
import FormControl from "@mui/material/FormControl";

export interface FeedbackForm {
    children: React.ReactElement | React.ReactElement[];
    onChange?: () => void;
    options?: {
        text?: string;
        formHelper?: string;
    };
}

export const FeedbackForm: React.ElementType = (props: FeedbackForm) => {
    return (
        <FormControl>
            <InputLabel htmlFor='overlay-feedback'>{props?.options?.text ?? ""}</InputLabel>
            <Input id='overlay-feedback' aria-describedby='overlay-feedback-text' onChange={props.onChange} />
            <FormHelperText id='overlay-feedback-text'>{props?.options?.formHelper ?? ""}</FormHelperText>
        </FormControl>
    );
};
