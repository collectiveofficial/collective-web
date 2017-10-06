const webpack = require('webpack');
const path = require('path');

const SRC_DIR = path.join(__dirname, '/src/client');
const DIST_DIR = path.join(__dirname, '/src/client/public/dist');

module.exports = {
  entry: ['babel-polyfill', `${SRC_DIR}/index.js`],
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      // JS
      {
        test: /\.js?/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      // CSS
      // {
      //   test: /\.css$/,
      //   include: SRC_DIR,
      //   loader: 'style-loader!css-loader!less-loader!sass-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      // },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      }
    ]
  },
  devtool: 'source-map'
};
