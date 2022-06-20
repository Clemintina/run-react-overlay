const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const {inDev} = require('./webpack.helpers');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = [
    new ForkTsCheckerWebpackPlugin(),
    new NodePolyfillPlugin(),
    inDev() && new webpack.HotModuleReplacementPlugin(),
    inDev() && new ReactRefreshWebpackPlugin(),
    new JavaScriptObfuscator({
        rotateStringArray: true
    }),
].filter(Boolean);
