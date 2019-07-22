module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
     devServer: {
        proxy: {
             '/api':{
                 target:'http://localhost',
                changeOrigin:true,
                pathRewrite:{
                     '/api':''
                 }
             }
        }
     }
}