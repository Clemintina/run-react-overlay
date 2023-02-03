// Forge Configuration
const path = require("path");
const rootDir = process.cwd();

module.exports = {
  // Packager Config
  packagerConfig: {
    // Create asar archive for main, renderer process files
    asar: true,
    // Set executable name
    executableName: "seraph-overlay",
    // Set application copyright
    appCopyright: "Copyright (C) 2022 seraph.si",
    icon: "assets/images/icon.ico"
  },
  // Forge Makers
  makers: [
    {
      // Squirrel.Windows is a no-prompt, no-hassle, no-admin method of installing
      // Windows applications and is therefore the most user-friendly you can get.
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "Seraph-Overlay"
      }
    },
    {
      // The Zip target builds basic .zip files containing your packaged application.
      // There are no platform specific dependencies for using this maker, and it will run on any platform.
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {
        name: "Seraph-Overlay"
      }
    },
    {
      // The deb target builds .deb packages, which are the standard package format for Debian-based
      // Linux distributions such as Ubuntu.
      name: "@electron-forge/maker-deb",
      config: {
        name: "Seraph-Overlay"
      }
    },
    {
      // The RPM target builds .rpm files, which is the standard package format for
      // RedHat-based Linux distributions such as Fedora.
      name: "@electron-forge/maker-rpm",
      config: {
        name: "Seraph-Overlay"
      }
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "Kay & Arman",
          homepage: "https://seraph.si/"
        }
      }
    },
    {
      name: "@electron-forge/maker-dmg"
    }
  ],
  // Forge Plugins
  plugins: [
      {
        name :"@electron-forge/plugin-webpack",
        config: {
      // fix content-security-policy error when image or video src isn't same origin
      devContentSecurityPolicy: "",
      // Ports
      port: 3000, // Webpack Dev Server port
      loggerPort: 9000, // Logger port
      // Main process webpack configuration
      mainConfig: path.join(rootDir, "tools/webpack/webpack.main.js"),
      // Renderer process webpack configuration
      renderer: {
        // Configuration file path
        config: path.join(rootDir, "tools/webpack/webpack.renderer.js"),
        // Entrypoints of the application
        entryPoints: [
          {
            // Window process name
            name: "app_window",
            // React Hot Module Replacement (HMR)
            rhmr: "react-hot-loader/patch",
            // HTML index file template
            html: path.join(rootDir, "src/renderer/app.html"),
            // Renderer
            js: path.join(rootDir, "src/renderer/appRenderer.tsx"),
            // Main Window
            // Preload
            preload: {
              js: path.join(rootDir, "src/renderer/appPreload.tsx")
            }
          }
        ]
      },
      devServer: {
        liveReload: false
      }
    }
  },
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ]
};
