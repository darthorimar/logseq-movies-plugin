const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    target: 'web',
    entry: ['./src/main.ts'],
    output: {
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        })
    ],
    resolve: {
        extensions: ['.js', '.ts']
    },
}