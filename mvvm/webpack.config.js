module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    library: 'MVVM',
    libraryTarget: 'umd',
    libraryExport: "default" 
  },
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
};
