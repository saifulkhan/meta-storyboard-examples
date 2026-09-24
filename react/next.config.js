const withTM = require("next-transpile-modules")([
  "@babel/preset-react",
]);

// set GITHUB_PAGES=true (as in the deploy workflow) to build a static export
// served from https://saifulkhan.github.io/meta-storyboard-examples/
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = "/meta-storyboard-examples";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // allow building/serving from a separate dist dir, e.g., while a dev server
  // is using .next (NEXT_DIST_DIR=.next-prod yarn build && ... yarn start)
  distDir: process.env.NEXT_DIST_DIR || '.next',
  ...(isGithubPages && {
    output: "export",
    basePath,
    assetPrefix: basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    emotion: true,
  },
  webpack(config) {
    // the msb submodule has its own node_modules (dev dependencies); force a
    // single react and d3 instance resolved from this app to avoid duplicate
    // react copies breaking hooks
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      d3: path.resolve(__dirname, 'node_modules/d3'),
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: [{
              name: "removeViewBox",
              active: false,
            }],
          },
        },
      }],
    });

    return config;
  },
  // this ensures that next.js can find your pages in the src directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = withTM(nextConfig);
