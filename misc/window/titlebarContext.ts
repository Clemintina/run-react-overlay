/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Titlebar IPC (Renderer Process)
 */

import { ipcRenderer } from "electron";

const titlebarContext = {
    reload() {
        ipcRenderer.invoke("web-reload");
    },
    force_reload() {
        ipcRenderer.invoke("web-force-reload");
    },
    toggle_devtools() {
        ipcRenderer.invoke("web-toggle-devtools");
    },
};

export type TitlebarContextApi = typeof titlebarContext;

export default titlebarContext;
