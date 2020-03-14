const path = require("path");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  console.log('[mode]', argv);
  const jsFiles = ['./index.js'];
  return ({
    target: 'node',
    entry: [].concat(jsFiles),
    output: {
      path: path.join(__dirname, "./dist"),
      filename: "index.js",
    },
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread']
            }
          }
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
