const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/user/',
  transpileDependencies: true,
  devServer: {
    proxy: 'https://charmium.ru/',
      
    }
})
