module.exports = {
  exclude: ['home.svg', 'volume-down.svg', 'volume-mute.svg', 'volume-up.svg'],
  plugins: [
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill|fill-rule)',
      },
    },
  ],
}
