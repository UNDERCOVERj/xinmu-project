const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const common = require('./webpack.base.js');
const outputLib = path.resolve(__dirname, '../dist');

module.exports = merge(common, {
    mode: 'development', // 开发环境
    devtool: 'cheap-module-eval-source-map', // 没有生成列映射(column mapping)，只是映射行数
    watch: true, // 监听，有webpack-dev-server默认是开启的
    watchOptions: {
        // 不监听node_modules
        ignored: /node_modules/ 
    },
    devServer: {
        hot: true,
        contentBase: false,
        // historyApiFallback: true, // history api，暂时没用
        open: true, // 用系统默认的浏览器去打开网页
        port: 8888,
        compress: true,
        proxy: {
            "/v1":{
                target: "http://xinmu-dev-elb-0951bf7cbc3bf987.elb.cn-northwest-1.amazonaws.com.cn:8990"
            },
            "/trail": {
                'target': 'https://dev-source-video.s3.cn-northwest-1.amazonaws.com.cn'
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    performance: {
        hints: false
    }
})