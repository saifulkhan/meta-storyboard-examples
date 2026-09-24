# About

This repository contains a few examples of how to use the meta-storyboard library [NPM](https://www.npmjs.com/package/meta-storyboard).

## Getting Started

The following environment and packages are required.

- Node.js v20.11.1
- yarn or npm

Clone the repository.

```bash
git clone https://github.com/saifulkhan/meta-storyboard-examples
cd meta-storyboard-examples
git submodule update --init --recursive   
```

Install the meta-storyboard library from NPM.

```bash
cd react

npm install meta-storyboard # or
yarn add meta-storyboard
```

Install all dependent packages and start the development server to view the UI.

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Go to the section [UI](#ui) to see a few examples. These are the following list of UIs:

### Example Stories

- [COVID-19 Case Story](http://localhost:3000/example/story-covid19)
- [COVID-19 Case Story (Gaussian)](http://localhost:3000/example/story-covid19-gaussian)
- [Machine Learning Provenance Story](http://localhost:3000/example/story-ml-mirorred-bar)
- [Machine Learning Multivariate Story](http://localhost:3000/example/story-ml-pcp)
- [Machine Learning Dashboard Story](http://localhost:3000/example/story-ml-dashboard)

### Example Feature-Action Tables

- [Feature-Action Tables](http://localhost:3000/example/feature-action-tables)

### Example Components

The example components are useful for testing and developing various individual components.

**Plots, features, actions, etc.**

- [Test Play/Pause Loop](http://localhost:3000/playground/test-play-pause-loop)
- [Test Actions](http://localhost:3000/playground/test-actions)
- [Test Line Plot](http://localhost:3000/playground/test-line-plot)
- [Test Features](http://localhost:3000/playground/test-features)

**Gaussian**

- [Test Categorical Features to Gaussian](http://localhost:3000/playground/test-categorical-features-to-gaussian)
- [Test Numerical Features to Gaussian](http://localhost:3000/playground/test-numerical-features-to-gaussian)
- [Test Gaussian Combined](http://localhost:3000/playground/test-combined-gaussian)

**Tables (experimental feature)**

- [Test Action Properties Table](http://localhost:3000/playground/test-action-properties-table)
- [Test Feature Properties Table](http://localhost:3000/playground/test-feature-properties-table)
- [Test Action Table](http://localhost:3000/playground/test-action-table)
- [Feature-Action Tables UI (experimental)](http://localhost:3000/example/feature-action-tables)

## Rebuild & Publish (GitHub Pages)

The examples are published at
[https://saifulkhan.github.io/meta-storyboard-examples/](https://saifulkhan.github.io/meta-storyboard-examples/).

Every push to the `main` branch rebuilds and redeploys the site automatically
via the GitHub Actions workflow `.github/workflows/deploy.yml`. You can also
trigger a redeploy without pushing: go to the repository's **Actions** tab,
select **Deploy to GitHub Pages**, and click **Run workflow**.

The example pages import the library from the `react/msb` submodule source,
and the workflow checks out the submodule at the commit recorded in this
repository. So if you changed the library, publish it first and bump the
submodule pointer:

```bash
# 1. publish the library changes
cd react/msb
git add -A && git commit -m "..."
git push origin main

# 2. record the new submodule commit and publish the site
cd ../..
git add react/msb
git commit -m "chore: bump msb submodule"
git push origin main
```

To test the static export locally before publishing:

```bash
cd react
GITHUB_PAGES=true yarn build   # writes the static site to react/out
```

Note that the exported site expects to be served under the
`/meta-storyboard-examples` base path (as on GitHub Pages), so links will not
resolve if you open `out/index.html` directly.
