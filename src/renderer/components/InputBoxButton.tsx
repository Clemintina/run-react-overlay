import React from "react";

export interface InputBoxButton {
    onClick: (input) => void;
    text: string;
}

export const InputBoxButton: React.ElementType = (props: InputBoxButton) => {
    return (
        <button onClick={props.onClick} style={{backgroundColor: "#242424ff"}} className='underline'>
            {props.text}
        </button>
    );
};
