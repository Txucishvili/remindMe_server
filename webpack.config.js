const path = require("path");
const nodeExternals = require('webpack-node-externals');

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
