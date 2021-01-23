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
        use: {
          loader: 'ts-loader',
          // transpileOnly in prod more reduces build time from 155s to 133s
          ...(process.env.NODE_ENV === 'development' && {
            options: {
              // Faster build
              transpileOnly: true,
            },
          }),
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
  ],
  output: {
    filename: 'latest/[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'latest/[name].js',
  },
};
