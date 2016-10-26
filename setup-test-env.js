/* eslint-disable */

/**
 * This is used to set up the environment that's needed for most
 * of the unit tests for the project which includes babel transpilation
 * with babel-register, polyfilling, and initializing the DOM with jsdom
 */

require('babel-register')
require('babel-polyfill')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

// handle css modules
// https://www.npmjs.com/package/mock-css-modules
global.mockCssModules = require("mock-css-modules")
global.mockCssModules.register(['.sass', '.scss'])

// mock alert
global.alert = function() {}

