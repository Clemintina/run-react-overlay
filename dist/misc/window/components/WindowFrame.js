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