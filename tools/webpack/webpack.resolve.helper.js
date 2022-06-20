const alias = require('./webpack.aliases')

module.exports={
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: alias,
        fallback:{
            zlib: require.resolve('browserify-zlib')
        },
    },
}
