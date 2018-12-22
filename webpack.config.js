"use strict";
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		app: [
			'./src/app.js',
			'./src/app.scss',
		],
		vendor: [
			'angular',
			'rpg-awesome/css/rpg-awesome.min.css'
		]
	},
	output: {
		path: __dirname + '/public/assets/',
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract('style-loader', 'css')
		}, {
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract('style-loader', 'css!sass')
		}, {
			test: /\.js$/,
			exclude: /(node_modules)/,
			loader: 'babel',
			query: { cacheDirectory: './node_modules/.cache', presets: ['es2015'] }
		}, {
			test: /\.html$/,
			loader: 'html?interpolate'
		}, {
			test: /\.(png|jpg|gif)$/,
			loader: 'file'
		}, {
			test: /\.(eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file'
		}]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: '[name].js',
		}),
		new ExtractTextPlugin('[name].css', {
			allChunks: true
		}),
	],
	watchOptions: {
		poll: 5000
	}
};
