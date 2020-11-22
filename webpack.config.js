const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: { main: './src/index.ts' },
  devtool: 'source-map',
  devServer: {
    contentBase: './public',
    contentBasePublicPath: '/',
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre' },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [new BundleAnalyzerPlugin({ analyzerMode: 'static' })],
  output: {
    filename: 'latest/[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'latest/[name].js',
  },
};
