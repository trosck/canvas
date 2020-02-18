const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader"
      ]
    },{
      test: /\.s[ac]ss$/i,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ]
    }]
  }
}