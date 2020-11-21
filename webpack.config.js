const path = require('path');

module.exports = {
  entry: { latest: './src/global.ts', module: './src/index.ts' },
  //   devtool: 'inline-source-map',
  devServer: {
    // contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'public')],
    // contentBasePublicPath: ['/latest', '/'],
    // publicPath: '/dist',
    index: 'index.html',
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
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
  },
};
