const webpack = require('webpack');
module.exports = {
  entry: ['./src/browser.js'],
  devtool: 'source-map',
  plugins: [
    new webpack.IgnorePlugin(/^(ws|assert|crypto)$/)
  ],
  output: {
    libraryTarget: 'umd',
    filename: 'dist/p2pweb.js'
  }
}
