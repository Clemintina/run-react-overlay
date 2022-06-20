"use strict";
const resolver = require('./webpack.resolve.helper');
const JavaScriptObfuscator = require('webpack-obfuscator');
module.exports = {
    entry: ['./src/main/app.ts'],
    module: {
        rules: require('./webpack.rules'),
    },
    plugins: [new JavaScriptObfuscator({
            rotateStringArray: true
        }),],
    resolve: resolver.resolve,
    stats: 'minimal',
};
//# sourceMappingURL=webpack.main.js.map