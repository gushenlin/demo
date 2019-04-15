// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var webpack = require('webpack')
module.exports = {
  build: {
    env: require('./prod.env'),
    //index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../docker/html/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',//编译发布的根目录，资源等编译后前面所加前缀，如编译成static/img/a.png,static/js/manifest.js,如果用的'/'，则前缀直接是根目录，
                           //这样的话，构建后直接本地打开是访问不到资源的，因为去找根路径了，用'./'相对于当前路径就可以找到；
    //部署到服务器建议用'/'根路径，这样编译的资源前缀都接根路径就可以正确访问了
    // 可配置为资源服务器域名或 CDN 域名   //assetsPublicPath: 'http://10.204.39.22:10087/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    //host:'0.0.0.0',
    port: 8022,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // // proxy middleware options
      //   target: 'http://www.example.org', // target host
      //   changeOrigin: true,               // needed for virtual hosted sites,对于部署在虚拟机上面的服务必须配置true
      //   ws: true,                         // proxy websockets
      //   pathRewrite: {
      //     '^/api/old-path' : '/api/new-path',     // rewrite path
      //     '^/api/remove/path' : '/path'           // remove base path
      //   },
      //   router: {
      //     // when request.headers.host == 'dev.localhost:3000',
      //     // override target 'http://www.example.org' to 'http://localhost:8000'
      //     'dev.localhost:3000' : 'http://localhost:8000'
      //   }
      // '/serviceProxy': {
      //    target: 'http://10.204.39.63:38085/',
      //   // target: 'http://10.204.39.89:28085/',
      //   changeOrigin: false,
      //   //secure: false,
      //   pathRewrite: {
      //     '^/serviceProxy': '/serviceProxy'
      //   }
      // },
      '/peps': {
        target: 'http://10.204.39.92:8910/',
        changeOrigin: false,
        //secure: false,
        pathRewrite: {
          '^/peps': '/peps'
        }
      },
    },
    cssSourceMap: true
  }
}
