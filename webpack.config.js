'use strict';

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node',
  entry: './src/extension.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode',
    request: 'commonjs request'
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        mangle: true
      }
    })]
  }
};
module.exports = config;
