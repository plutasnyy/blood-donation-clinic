const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        path.resolve('src/index.js'),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                // Don't use .babelrc in `yarn link`-ed dependency's directory and use in current direction instead
                loader: 'babel-loader?babelrc=false&extends=' + path.resolve(__dirname, '.babelrc'),
                options: { babelrcRoots: ['.', '../'] }, // <-- this line fixed it!

            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                    },
                },
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader'
                }]
            }
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolveLoader: {
        modules: [
            'node_modules',
        ],
    },
}
