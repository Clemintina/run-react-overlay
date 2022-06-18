/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Window Controls - Close, Minimize, Maximize (Component)
 */
import classNames from 'classnames';
import React from 'react';
import context from '../titlebarContextApi';
const WindowControls = (props) => {
    return (React.createElement("section", { className: classNames('window-titlebar-controls', `type-${props.platform}`) },
        React.createElement("div", { className: 'control minimize', onClick: () => context.minimize(), title: props.tooltips ? 'Minimize' : '' }, "\u2500"),
        React.createElement("div", { className: 'control maximize', onClick: () => context.toggle_maximize(), title: props.tooltips ? 'Maximize' : '' }, "\u2610"),
        React.createElement("div", { className: 'control close', onClick: () => context.exit(), title: props.tooltips ? 'Close' : '' }, "X")));
};
export default WindowControls;
//# sourceMappingURL=WindowControls.js.map