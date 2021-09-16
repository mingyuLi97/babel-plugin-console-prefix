const consolePrefix = require('../lib/babel-plugin-console-prefix')
const path = require('path')

module.exports = {
  mode: 'development',
  optimization: {
    minimize: false
  },
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                // consolePrefix
                [
                  consolePrefix,
                  {
                    exclude: ['sncLog'],
                    showLocation: true
                    // customPrefix: 'prefix'
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
}

const a = {
  plugins: [
    [
      consolePrefix,
      {
        exclude: ['sncLog'],
        showLocation: false
        // customPrefix: 'prefix'
      }
    ]
  ]
}
