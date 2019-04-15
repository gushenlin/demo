var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (page) {
  baseWebpackConfig.entry[page] = ['./build/dev-client'].concat(baseWebpackConfig.entry[page])
})

//getIPAdress
function getIPAdress(){
  var interfaces = require('os').networkInterfaces();
  for(var devName in interfaces){
    var iface = interfaces[devName];
    for(var i=0;i<iface.length;i++){
      var alias = iface[i];
      if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
        return alias.address;
      }
    }
  }
}

// 用了generate-asset-webpack-plugin 这个插件，
// 在webpack.prod.conf.js中去生成configServer.json文件，让其在build的时候输出：
var GenerateAssetPlugin=require('generate-asset-webpack-plugin');
var createServerConfig=function(compilation){
  let host_ip = getIPAdress();
  let host_port = "8018";
  let cfgJson = {
    //配置logo
    logo: "logo.png",
    // logo: "wzlogo.png",
    //配置网页标题
    title:'XXXX平台',
    //项目接口baseURL
    baseURL: "http://121.31.67.8:13335/"
  };
  return JSON.stringify(cfgJson);
}

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new GenerateAssetPlugin({
      filename: 'serverconfig.json',
      fn: (compilation, cb) => {
        cb(null, createServerConfig(compilation));
      },
      extraFiles: []
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
})
