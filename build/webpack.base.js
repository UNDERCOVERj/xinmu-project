const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = path.basename(require.main.filename) === 'webpack-dev-server.js';
const tsImportPluginFactory = require('ts-import-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const srcPath = resolve('../src');
const outputPath = resolve('../dist');
function resolve(uri) {
    return path.resolve(__dirname, uri);
}

module.exports = {
    entry: {
        index: srcPath + '/index.tsx'
    },
    output: {
        path: outputPath,
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name]/[chunkhash:8].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.(tsx?|js)$/,
                loader: 'ts-loader?cacheDirectory',
                exclude: /node_modules/,
                include: [srcPath],
                options: {
                    transpileOnly: true,
                    happyPackMode: true,
                    getCustomTransformers: () => ({
                        before: [ tsImportPluginFactory({
                            style: 'css'
                        }) ]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
                
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // css热更新问题
                    },
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            }
        ]
        // noParse: [/heatmap\.min\.js$/]
    },
    resolveLoader: {
        modules: [resolve('../node_modules')] // 去node_modules下面寻找loader
    },
    resolve: {
        alias: {
            '@src': srcPath // 引入时别名
        },
        mainFields: ['main'], // 第三方模块入口文件
        modules: [resolve('../node_modules')], // 第三方模块路径
        extensions: ['.ts', '.tsx', '.js', '.scss'] // 自动补全
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'xinmu',
            template: srcPath + '/index.html',
            filename: 'index.html',
            chunks: ['index', 'vendor', 'commons'],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css'
        }),
        new CleanWebpackPlugin(['dist'], { root: resolve('..') })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor:{ // 抽离第三插件，本来打算搞成多页想想没必要，单页应该就不用抽了
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                },
                commons:{
                    test: /utils\/|components\//,
                    chunks: 'initial',
                    name: 'commons',
                    priority: 10,
                    enforce: true
                }
            }
        },
        minimizer: [
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css\.*(?!.*map)/g,
                cssProcessor: require('cssnano'), // 压缩css
                cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
                canPrint: true
            })
        ]
    }
}