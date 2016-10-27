# React-kitty

A NodeJS V6 Universal React Boilerplate with an Amazing Developer Experience.


## TOC

 - [About](https://github.com/seedyee/react-kitty#about)
 - [Features](https://github.com/seedyee/react-kitty#features)
 - [Overview](https://github.com/seedyee/react-kitty#overview)
 - [Project Structure](https://github.com/seedyee/react-kitty#project-structure)
 - [NPM Commands](https://github.com/seedyee/react-kitty#npm-commands)
 - [References](https://github.com/seedyee/react-kitty#references)


## About

This boilerplate contains an absolutely minimal set of dependencies in order to get you up and running with a universal react project as quickly as possible. It provides you with a great development experience that includes hot reloading of everything.



## Features

- Universal / Isomorphic application development.
- Extreme live development - hot reloading of client/server source with high level of error tolerance.
- Express server with a basic security configuration using *hpp* and *helmet*.
- *ReactJS* as the view layer.
- Redux for state manage
- Redux Saga for side effects manage
- React Router v4  Declarative routing for React.
- Immutable-js persistent data collections which increase efficiency and simplicity.
- Ava Futuristic JavaScript test runner
- Enzyme for testing React
- Sinon for test spies, stubs and mocks
- *React Helmet* allowing control of the page title/meta/styles/scripts from within your components. Direct control for your SEO needs.
- CSS Support with CSS modules and additional flexible full PostCSS chain for advanced transformations e.g. autoprefixer
- Fully integrated asset support for referencing files in CSS and JavaScript.
- Full ES2015 support, using *Babel* to transpile where needed.
- Bundling of both client and server using *Webpack* v2. See also: [The Cost of Small Modules](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/)
- Client bundle is automatically split by routes and uses tree-shaking for smallest possible builds.
- Long term caching of the client bundle works out of the box.
- Support for development and optimized production configuration.
- Easy environment configuration via `dotenv` files.
- *Markdown* rendering for Components integrated.


## Work in progress

- *Stylelint* CSS linting
- PostCSS Lost Grid integrated
- Flow Typechecking


## Overview

This boilerplate uses Webpack 2 to produce bundles for both the client and the
server code.

The reasoning for using Webpack to bundle both the client and the server is to bring greater interop and extensibility to the table. This will for instance allowing server bundles to handle React components that introduce things like CSS or Images (as and when you add the respective loaders).

Given that we are bundling our server code I have included the `source-map-support` module to ensure that we get nice stack traces when executing our code via node.

All the source code is written in ES2015, and I have explicitly kept it to the true specification (bar JSX syntax). As we are following this approach it is unnecessary for us to transpile our source code for the server into ES5, as `node` v6 has native support for almost all of the ES2015 syntax. Our client (browser) bundle is however transpiled to ES5 code for maximum browser/device support.

The application configuration is supported by the `dotenv` module and it requires you to create a `.env` file in the project root (you can use the `.env_example` as a base). The `.env` file has been explicitly ignored from git as it will typically contain environment sensitive/specific information. In the usual case your continuous deployment tool of choice should configure the specific `.env` file that is needed for a target environment.



## Project Structure

```
/
|- lib // The target output dir for our library export
|  |- index.es.js // ES2015 module export
|  |- index.js // CommonJS export
|
|- build // The target output dir for our build commands.
|  |- client // The built client module.
|  |- server // The built server module
|
|- src  // All the source code
|  |- common // Common utilities
|  |- config // Central configuration files
|  |- server // The server specific source
|  |- client // The client specific source
|  |- shared // The shared source
|  |- webpack // Build infrastructure
|  |- scripts // Available scripts when installed via npm
|
|- .babelrc // Dummy babel configuration
|- .env_example // An example from which to create your own .env file.
|- rollup.script.cfg // Configuration file for bundling scripts into executable
```

## NPM Commands

### `npm run start`

Starts a development server for both the client and server bundles. We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

### `npm run start:plain`
Same as `npm run start` but without dashboard

### `npm run build`

Builds the client and server bundles, with the output being production optimized and then start the server.

### `npm run just-build`

Builds the client and server bundles, with the output being production optimized.

### `npm run clean`

Deletes any build output that would have originated from the other commands.

### `npm run test`
Run test

### `npm run test:watch`
Run test in watch mode

### `npm run coverage`

Test coverage reporting

## References

  - __Webpack 2__ - https://gist.github.com/sokra/27b24881210b56bbaff7
  - __React Hot Loader v3__ - https://github.com/gaearon/react-hot-boilerplate/pull/61
  - __dotenv__ - https://github.com/bkeepers/dotenv
  - __React Router v4__ - https://github.com/ReactTraining/react-router/tree/v4
  - __Redux Saga__ - https://github.com/yelouafi/redux-saga
  - __ava__ - https://github.com/avajs/ava
  - __Sinon__ - http://sinonjs.org/docs/
  - __Enzyme__ - http://airbnb.io/enzyme/docs/api/ShallowWrapper/findWhere.html

## [License](license)
