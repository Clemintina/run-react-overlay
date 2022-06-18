/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Window Frame (Component)
 */
import React, { useEffect, useRef } from 'react';
export const WindowContext = React.createContext({
    platform: 'windows',
});
const WindowFrame = (props) => {
    const itsRef = useRef(null);
    useEffect(() => {
        if (itsRef.current !== null) {
            const { parentElement } = itsRef.current;
            if (parentElement !== null) {
                parentElement.classList.add('has-electron-window');
                parentElement.classList.add('has-border');
                // Apply border color if prop given
                if (props.borderColor) {
                    parentElement.style.borderColor = props.borderColor;
                }
            }
        }
    }, []);
    return (React.createElement(WindowContext.Provider, { value: { platform: props.platform } },
        React.createElement("div", { className: 'start-electron-window', ref: itsRef }),
        React.createElement("div", { className: 'window-content' }, props.children)));
};
export default WindowFrame;
//# sourceMappingURL=WindowFrame.js.map