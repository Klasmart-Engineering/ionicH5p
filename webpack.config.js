const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/index.tsx",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
            {
                test: /\.(scss|css)$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
    optimization: {
        splitChunks: { chunks: "all" },
    },
    resolve: {
        modules: ["node_modules"],
        extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
        }),
        new InjectManifest({
            swSrc: path.resolve(__dirname, "src", "sw.ts"),
            maximumFileSizeToCacheInBytes: 15 * 1024 * 1024
        }),
    ],
    devtool: "inline-source-map",
    devServer: {
        hot: true,
    },
};
