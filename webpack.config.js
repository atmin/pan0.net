const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: {
    main: './src/bundles/main.ts',
    // common: './src/bundles/common.ts',
    // canvas: './src/bundles/canvas.ts',
    // boxBuilder: './src/bundles/boxBuilder.ts',
    // groundBuilder: './src/bundles/groundBuilder.ts',
    // planeBuilder: './src/bundles/planeBuilder.ts',
    // sphereBuilder: './src/bundles/sphereBuilder.ts',
    // gltfLoader: './src/bundles/gltfLoader.ts',
    // universalCamera: './src/bundles/universalCamera.ts',
    // directionalLight: './src/bundles/directionalLight.ts',
    // hemisphericLight: './src/bundles/hemisphericLight.ts',
    // actions: './src/bundles/actions.ts',
    // inspector: './src/bundles/inspector.ts',
  },
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
          ...(process.env.NODE_ENV !== 'impossible____development' && {
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
  optimization: {
    runtimeChunk: 'single',
  },
};
