var path = require('path');
var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
// var DeployToWar = require('webpack-deploy2war')

// 用了generate-asset-webpack-plugin 这个插件，
// 在webpack.prod.conf.js中去生成configServer.json文件，让其在build的时候输出：
var GenerateAssetPlugin = require('generate-asset-webpack-plugin');
var createServerConfig = function (compilation) {
  //console.log("info from GenerateAssetPlugin:");
  //console.log(compilation);
  let host_ip = '10.204.39.22';
  let host_port = '10081';
  let cfgJson = {
    //配置logo
    logo: 'logo.png',
    // logo: "wzlogo.png",
    //配置网页标题
    title: 'XXXX平台',
    //项目接口baseURL
    baseURL: 'http://121.31.67.8:13335/'
  };
  return JSON.stringify(cfgJson);
};

var env = config.build.env;

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name].js')
  },
  plugins: [
    new GenerateAssetPlugin({
      filename: 'serverconfig.json',
      fn: (compilation, cb) => {
        cb(null, createServerConfig(compilation));
      },
      extraFiles: []
    }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // new DeployToWar({//此段代码造成本地打包报错并造成docker构建报错，不执行报错后后代码
    //     fileName: "ROOT.war"
    // }),
    // generate dist index.html with correct asset hash for caching.
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        );
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     names: ['web_common', 'web_run'], // 这公共代码的chunk名为'commons'
    //     filename: utils.assetsPath('js/[name].js'), // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
    //     minChunks: 4444, // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。
    // }),
    // new webpack.DllReferencePlugin({
    //     context: __dirname,
    //     manifest: require('./dll/manifest.json')
    // })
    //extract webpack runtime and module manifest to its own file in order to
    //prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets 复制static资源到构建后的static
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
});

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
