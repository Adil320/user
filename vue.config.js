const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/user/'
    : '/',
  transpileDependencies: true,
  devServer: {
    proxy: 'https://charmium.ru/',
      
    }
})
