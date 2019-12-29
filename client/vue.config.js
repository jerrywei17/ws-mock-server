const env = require('./env')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.css'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src')
      }
    },
    plugins: [
      new CleanWebpackPlugin()
    ]
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch-index')

    config.plugin('define').tap(definitions => {
      definitions[0]['process.env'] = JSON.stringify(env)
      return definitions
    })
  }
}
