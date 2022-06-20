"use strict";
const path = require('path');
const rootDir = process.cwd();
module.exports = {
    packagerConfig: {
        asar: true,
        executableName: 'Seraph-Overlay',
        appCopyright: 'Copyright (C) 2022 seraph.si',
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'Seraph-Overlay',
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
    plugins: [
        [
            '@electron-forge/plugin-webpack', {
                devContentSecurityPolicy: '',
                port: 3000,
                loggerPort: 9000,
                mainConfig: path.join(rootDir, 'tools/webpack/webpack.main.js'),
                renderer: {
                    config: path.join(rootDir, 'tools/webpack/webpack.renderer.js'),
                    entryPoints: [{
                            name: 'app_window',
                            rhmr: 'react-hot-loader/patch',
                            html: path.join(rootDir, 'src/renderer/app.html'),
                            js: path.join(rootDir, 'src/renderer/appRenderer.tsx'),
                            preload: {
                                js: path.join(rootDir, 'src/renderer/appPreload.tsx'),
                            },
                        },
                    ],
                },
                devServer: {
                    liveReload: false,
                },
            },
        ],
    ],
};
//# sourceMappingURL=forge.config.js.map