/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    mode: 'development',
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      symlinks: false,
      alias: {
        '@decorators': path.resolve('./src/common/decorators/'),
        '@pipes': path.resolve('./src/common/pipes/'),
        '@exceptions': path.resolve('./src/common/exceptions/'),
        '@common': path.resolve('./src/common/'),
        '@s3': path.resolve('./src/s3/'),
        '@src': path.resolve('./src'),
        '@filters': path.resolve('./src/common/filters/'),
        '@guards': path.resolve('./src/common/guards/'),
        '@graphql': path.resolve('./src/common/graphql/'),
        '@validators': path.resolve('./src/common/validators/'),
        '@users': path.resolve('./src/users/'),
        '@requests': path.resolve('./src/requests/'),
        '@posts': path.resolve('./src/posts/'),
        '@notifications': path.resolve('./src/notifications/'),
        '@likes': path.resolve('./src/likes/'),
        '@comments': path.resolve('./src/comments/'),
        '@friends': path.resolve('./src/friends/'),
        '@messages': path.resolve('./src/messages/'),
        '@relationships': path.resolve('./src/relationships/'),
        '@core': path.resolve('./src/core/'),
        '@profiles': path.resolve('./src/profiles/'),
      },
    },
  };
};
