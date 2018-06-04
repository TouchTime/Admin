const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		historyApiFallback: true,
		host: '0.0.0.0',  //为了让本机ip和localhost都能打开
		noInfo: true,
		open: true,
		port: 4003,
		proxy:{
			"/api": {
				// target: "https://cartmall.net",
				target: "http://192.168.2.223",
		    pathRewrite: {"^/api" : ""},
				secure: false
		  }
		}
	}
});
