# About

This repository contains a few examples of how to use the meta-storyboard library [NPM](https://www.npmjs.com/package/meta-storyboard).

## Getting Started

The following environment and packages are required.

- Node.js v20.11.1
- yarn or npm

Clone the repository.

```bash
git clone https://github.com/saifulkhan/meta-storyboard-examples
cd meta-storyboard-examples/react
```

Install the meta-storyboard library from NPM.

```bash
npm install meta-storyboard # or
yarn add meta-storyboard
```

Install all dependent packages and start the development server to view the UI.

```bash
yarn install
yarn dev
```

Open <http://localhost:3000> in your browser. Go to the section [UI](#ui) to see a few examples. These are the following list of UIs:

### Example Stories

- [COVID-19 Case Story](http://localhost:3000/example/story-covid19-single)
- [COVID-19 Case Story (Gaussian)](http://localhost:3000/example/story-covid19-gaussian)
- [Machine Learning Provenance Story](http://localhost:3000/example/story-ml-mirorred-bar)
- [Machine Learning Multivariate Story](http://localhost:3000/example/story-ml-pcp)

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
