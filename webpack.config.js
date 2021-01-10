const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    content: './lib/content/content.ts',
    background: './lib/background/background.ts',
    popup: './lib/popup/popup.tsx',
    preferences: './lib/preferences/preferences.tsx',
    report: './lib/report/report.tsx',
    style: './lib/style/style.scss'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('node-sass'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // new CleanWebpackPlugin(), // doesn't work well with HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'lib/popup/popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      filename: 'preferences.html',
      template: 'lib/preferences/preferences.html',
      chunks: ['preferences']
    }),
    new HtmlWebpackPlugin({
      filename: 'report.html',
      template: 'lib/report/report.html',
      chunks: ['report']
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      // filename: '[name].css',
      // chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
      { from: './lib/manifest.json', to: './manifest.json' },
      // { from: './lib/background/background.js', to: './background.js' }
    ]})
  ],
  devtool: "", // fastest! doc: https://webpack.js.org/configuration/devtool/
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      "Shared": path.resolve(__dirname, '../shared'),
      "ChromeExt": path.resolve(__dirname, '../chrome-ext/lib'),
      "Angular": path.resolve(__dirname, '../client/src'),
      "Express": path.resolve(__dirname, '../server/src'),
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname , './dist'),
  },
};
