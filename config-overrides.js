/* eslint unicorn/prefer-module: off */
const {
	override,
	useBabelRc,
	disableEsLint,
} = require('customize-cra');

module.exports = override(
	disableEsLint(),
	useBabelRc(),
);
