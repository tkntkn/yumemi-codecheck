const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  mode: "development",
  entry: "./src/main.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      RESAS_API_KEY: JSON.stringify(process.env.RESAS_API_KEY),
    }),
  ],
};
