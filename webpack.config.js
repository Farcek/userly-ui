var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var externalApi = nodeExternals({
    modulesDir: path.join(__dirname, './node_modules')
});
var extractSass = new ExtractTextPlugin('/public/app.css', {
    allChunks: true
});


var distDir = path.resolve(__dirname, 'dist');

module.exports = {
    devtool: 'inline-source-map',
    target: "node",
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __dirname: false,
        __filename: false,
    },
    entry: [
        './src/serve.ts',
        './src/styles/app.scss',
    ],
    output: {
        filename: 'bundle.js',
        path: distDir
    },
    externals: [externalApi],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'core': path.resolve(__dirname, 'core'),
        },
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [/node_modules/],
                options: {
                    configFile: "tsconfig.json"
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: "file-loader",
                options: {
                    name: '[name]-[hash].[ext]'
                        //name: '[name].[ext]'
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|ttf|eot|woff|woff2)(?:\?.*|)$/i,
                //use: 'file-loader?name=[name]-[hash].[ext]'
                //use: 'file-loader?name=[name].[ext]'
                loader: "file-loader",
                options: {
                    name: '/public/[name]-[hash].[ext]'
                        //name: '[name].[ext]'
                }
            },
            {
                test: /\.sql$/,
                loader: "raw-loader",
                options: {
                    //name: '[path][name].[ext]?[hash]'
                    name: '[name].[ext]?[hash]'
                }
            },
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                loader: extractSass.extract(['css-loader', 'sass-loader'])
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['**/*'], {
            root: distDir
        }),
        extractSass
    ]
};