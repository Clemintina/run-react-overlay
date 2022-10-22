const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const resolver = require("./webpack.resolve.helper");

module.exports = {
    module: {
        rules,
    },
    plugins: plugins,
    resolve: resolver.resolve,
    stats: "minimal",
};
