const path = require('path');

const jsRules = {
    test: /\.(js)$/,
    use: [
        {
            loader: 'babel-loader',
            options: {
                presets: [ 'env' ]
            }
        }
    ]
}

const config = {
    entry: {
        main: './public/js/app.js'
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'public', 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [ jsRules ]
    }
}

module.exports = config;