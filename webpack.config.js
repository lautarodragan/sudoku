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
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDevelopmentMode ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64]',
              },
              importLoaders: 2,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.join(__dirname, 'src', 'styles'),
                ],
              },
              sourceMap: true,
            }
          },
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
