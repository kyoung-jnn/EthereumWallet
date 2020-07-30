module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-rewrite-require',
      {
        aliases: {
          stream: 'stream-browserify',
          crypto: 'react-native-crypto',
          _stream_transform: 'readable-stream/transform',
          _stream_readable: 'readable-stream/readable',
          _stream_writable: 'readable-stream/writable',
          _stream_duplex: 'readable-stream/duplex',
          _stream_passthrough: 'readable-stream/passthrough',
        },
      },
    ],
  ],
};
