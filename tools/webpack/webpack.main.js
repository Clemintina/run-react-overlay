const resolver = require('./webpack.resolve.helper');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: ['./src/main/app.ts'],
    // Put your normal webpack config below here
    module: {
        rules: require('./webpack.rules'),
    },
    plugins: [  new JavaScriptObfuscator({
        rotateStringArray: true
    }),],
    resolve: resolver.resolve,
    stats: 'minimal',
};
