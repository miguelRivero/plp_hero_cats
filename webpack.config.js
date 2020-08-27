var webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;
//const isDevelopment = process.env.NODE_ENV === "development";
const bundle = false;
const splitConfig = {
  chunks: "all",
  minSize: 15000,
  maxSize: 19480,
  cacheGroups: {
    // Merge all the CSS into one file
    styles: {
      name: "styles",
      test: /\.s?css$/,
      chunks: "all",
      minChunks: 1,
      reuseExistingChunk: true,
      enforce: true,
    },
  },
};

var config = {
  context: __dirname + "/src", // `__dirname` is root of project and `/src` is source
  entry: {
    app: ["./main.js"],
  },
  output: {
    path: __dirname + "/dist", // `/dist` is the destination
    filename: "[name].min.js", // bundle created by webpack it will contain all our app logic. we will link to this .js file from our html page.
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
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          bundle ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader", // post process the compiled CSS
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            },
          },
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
    //new BundleAnalyzerPlugin(),
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
          compress: {
            drop_console: !bundle,
          },
          output: {
            beautify: false,
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          zindex: false,
        },
      }),
    ],
    splitChunks: !bundle ? splitConfig : {},
  },
};

if (!bundle) {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    })
  );
}
module.exports = config;
