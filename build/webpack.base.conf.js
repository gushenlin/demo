var fs = require("fs");
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

//循环所以页面入口文件main.js
var entryConfig = {};
var HtmlPlugins = [];
var minify = {}


//默认路径为webpack.config.js所在的路径，这里通过npm run 运行方式，引用的根路径为package.json, 开发环境，文件构成至内存中，webpack-dev-middleware根路径指向'/'
var entryArray = fs.readdirSync(path.join(__dirname, '../src/pages'));
entryArray.forEach((page) => {
    entryConfig['web_' + page] = []
    entryConfig['web_' + page][0] = 'babel-polyfill';
    entryConfig['web_' + page][1] = path.join(__dirname, '../src/pages/' + page + '/main.js');

    if (process.env.NODE_ENV === 'production') {
        var Html = new HtmlWebpackPlugin({
            filename: page + '.html',
            template: 'template.html',
            chunks: ['manifest', 'vendor', 'web_' + page],
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        });
    } else {
        var Html = new HtmlWebpackPlugin({
            filename: page + '.html',
            template: 'template.html',
            chunks: ['web_' + page],
            inject: true,
        });
    }
    HtmlPlugins.push(Html);

});



exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}



function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: entryConfig,
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : './',
        chunkFilename: utils.assetsPath('[name].js')
    },
    resolve: {
        extensions: ['.js', '.vue', '.css', '.json'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': resolve('src'),
            'assets': resolve('src/assets'),
            'components': resolve('src/components'),
            'packages': resolve('src/pages/index/packages')
        }
    },
    module: {
        rules: [{
          test: /.(vue|js|jsx)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          enforce: 'pre'
        },{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test')]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    plugins: HtmlPlugins
}
