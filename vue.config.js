const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: "/https://charmium.ru/",
  transpileDependencies: true,
  devServer: {
    proxy: 'https://charmium.ru/',
      
    }
})
