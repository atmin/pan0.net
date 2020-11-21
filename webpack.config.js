const path = require('path');

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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'latest/[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'latest/[name].js',
  },
};
