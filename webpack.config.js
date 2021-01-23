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
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'ts-loader',
          // transpileOnly in prod more reduces build time from 67s to 54s
          ...(process.env.NODE_ENV === 'development' && {
            options: {
              // Faster build
              transpileOnly: true,
            },
          }),
        },
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
