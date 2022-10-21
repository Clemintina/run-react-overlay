/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Titlebar IPC (Main Process)
 */

import { BrowserWindow, ipcMain } from "electron";

export const registerTitlebarIpc = (mainWindow: BrowserWindow) => {
    ipcMain.handle("web-reload", () => {
        mainWindow.webContents.reload();
    });

    ipcMain.handle("web-force-reload", () => {
        mainWindow.webContents.reloadIgnoringCache();
    });

    ipcMain.handle("web-toggle-devtools", () => {
        mainWindow.webContents.toggleDevTools();
    });
};
