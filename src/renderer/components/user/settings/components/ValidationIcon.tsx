import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

export interface ValidationIcon {
    valid: boolean;
}

export const ValidationIcon: React.ElementType = (props: ValidationIcon) => {
    let html;
    if (props.valid) {
        html = <FontAwesomeIcon style={{color: "green"}} icon={faCheckCircle} />;
    } else {
        html = <FontAwesomeIcon style={{ color: "red" }} icon={faExclamationCircle} />;
    }
    return <span className={"p-1"}>{html}</span>;
};
