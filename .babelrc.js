module.exports = {
  "plugins": [
		["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
		'babel-plugin-styled-components',
		["@babel/plugin-proposal-decorators", {legacy: true}]
  ]
}
