const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.ts',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
}