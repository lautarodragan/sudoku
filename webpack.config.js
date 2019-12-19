const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

console.log('Building with WebPack', process.env.NODE_ENV)

const isDevelopmentMode = process.env.NODE_ENV === 'development'

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'src/index.html'),
  filename: './index.html',
})

const copyWebpackPlugin = new CopyWebpackPlugin([
  {
    from: './_redirects',
    to: './_redirects',
    toType: 'file',
  }
])

module.exports = {
  entry: path.join(__dirname, 'src', 'index.jsx'),

  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ]
      },
      {
        test: [/\.svg$/, /\.jpg$/, /\.png/],
        use: 'file-loader',
      },
    ]
  },
  plugins: [
    htmlWebpackPlugin,
    copyWebpackPlugin,
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules:  [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
  devServer: {
    port: 3001,
    historyApiFallback: {
      index: '/index.html',
      verbose: true,
      disableDotRule: true
    },
  }
}
