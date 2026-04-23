const withMDX = require('@next/mdx')({
  extension: /\.mdx$/,
  options: { remarkPlugins: ['remark-mdx'], rehypePlugins: [] },
});

module.exports = withMDX({
  // Append the default value with md extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  turbopack: {
    root: __dirname,
    // same object is available under `experimental.turbo` for older Next.js
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
});
