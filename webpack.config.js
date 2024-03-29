const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

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
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv()
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        mangle: true,
        output: {
          comments: false
        }
      }
    })]
  },
};
module.exports = config;
