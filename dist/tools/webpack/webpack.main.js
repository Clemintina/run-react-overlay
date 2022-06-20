"use strict";
const resolver = require('./webpack.resolve.helper');
module.exports = {
    entry: ['./src/main/app.ts'],
    module: {
        rules: require('./webpack.rules'),
    },
    resolve: resolver.resolve,
    stats: 'minimal',
};
//# sourceMappingURL=webpack.main.js.map