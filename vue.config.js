module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
     devServer: {
        proxy: {
             '/api':{
                 target:'https://suggest.taobao.com/sug',
                changeOrigin:true,
                pathRewrite:{
                     '/api':''
                 }
             }
        }
     }
}