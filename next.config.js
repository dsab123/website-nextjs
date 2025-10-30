const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: { remarkPlugins: ['remark-mdx'], rehypePlugins: [] },
});

module.exports = withMDX({
  // Append the default value with md extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  turbopack: {
    // same object is available under `experimental.turbo` for older Next.js
    rules: {
      'data/blogposts/**/*.md': {
        loaders: ['builtin:raw'],
      },
      'data/blogpost.json': {
        loaders: ['builtin:raw'],
      },
    },
  },
});
