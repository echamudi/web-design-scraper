// @ts-check

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @type import('webpack').Configuration
 */
const chromeExt = {
  entry: {
    content: './chrome-ext/content/content.ts',
    background: './chrome-ext/background/background.ts',
    popup: './chrome-ext/popup/popup.tsx',
    preferences: './chrome-ext/preferences/preferences.tsx',
    report: './chrome-ext/report/report.tsx',
    style: './chrome-ext/style/style.scss'
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
              implementation: require('sass'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin({}),
    // new CleanWebpackPlugin(), // doesn't work well with HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './chrome-ext/popup/popup.html',
      chunks: ['popup','style']
    }),
    new HtmlWebpackPlugin({
      filename: 'preferences.html',
      template: './chrome-ext/preferences/preferences.html',
      chunks: ['preferences', 'style']
    }),
    new HtmlWebpackPlugin({
      filename: 'report.html',
      template: './chrome-ext/report/report.html',
      chunks: ['report', 'style']
    }),
    // @ts-ignore
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      // chunkFilename: '[id].css',
    }),
    // @ts-ignore
    new CopyWebpackPlugin({
      patterns: [
        { from: './chrome-ext/manifest.json', to: './manifest.json' },
        { from: './assets/**/*.*', to: './' },
      ]})
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      "Core": path.resolve(__dirname, './core'),
      "ChromeExt": path.resolve(__dirname, './chrome-ext/lib'),
      "Executor": path.resolve(__dirname, './executor'),
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname , './chrome-ext-dist'),
  },
};

module.exports = (env, argv) => {

  if (argv.mode === 'development') {
    chromeExt.mode = 'development';
    chromeExt.devtool = 'inline-source-map';
  } else {
    chromeExt.mode = 'production';
  }

  return [chromeExt];
};
