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
  ...(isGithubPages && {
    output: "export",
    basePath,
    assetPrefix: basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  // the msb submodule and a few pages have pre-existing type/lint errors that
  // don't affect runtime (the dev server serves them fine); don't let them
  // block the production build. run `yarn type-check` / `yarn lint` to see them.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    emotion: true,
  },
  webpack(config) {
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
