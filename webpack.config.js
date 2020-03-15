const path = require("path");
const fs = require("fs");
const nodeExternals = require('webpack-node-externals');
var nodeModules = {};

fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = (env, argv) => {
  const jsFiles = ['babel-polyfill', './index.js'];
  return ({
    target: 'node',
    entry: [].concat(jsFiles),
    output: {
      path: path.join(__dirname, "./dist"),
      filename: "index.js",
    },
    mode: argv.mode,
    externals: [nodeExternals()],
    optimization: { sideEffects: false },
    module: {
      rules: [
        {
          use: 'babel-loader',
          test: /\.js$/,
          exclude: /node_modules/
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    },
    plugins: []
  })
};
