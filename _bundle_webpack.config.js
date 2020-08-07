var webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

var config = {
  context: __dirname + "/src", // `__dirname` is root of project and `/src` is source
  entry: {
    app: ["./main.js", "./scss/slider.scss"],
  },
  output: {
    path: __dirname + "/dist", // `/dist` is the destination
    filename: "[name].js", // bundle created by webpack it will contain all our app logic. we will link to this .js file from our html page.
  },
  module: {
    rules: [
      {
        test: /\.js$/, // rule for .js files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", // the order is important. it executes in reverse order !
          "css-loader", // this will load first !
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader", // post process the compiled CSS
          "sass-loader", // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: "images/[hash]-[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: "images", to: "images" }]),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: true,
        uglifyOptions: {
          mangle: {
            toplevel: true,
          },
          output: {
            beautify: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          zindex: false,
        },
      }),
    ],
  },
};

module.exports = config;
