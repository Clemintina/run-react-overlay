import React from "react";
import "@assets/scss/titlebar.scss";
import "@assets/scss/settings.scss";

export interface UnderlinedTitle {
    text: string;
    options: {
        text: {
            size: number;
        };
    };
}

export const UnderlinedTitle: React.ElementType = (props: UnderlinedTitle) => {
    return (
        <div className='underline' style={{fontSize: props.options?.text?.size ?? 16}}>
            {props.text}
        </div>
    );
};
