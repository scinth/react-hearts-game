const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
	mode: 'production',
	output: {
		filename: 'index-[contenthash].bundle.min.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	optimization: {
		minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/template.html',
			minify: {
				removeAttributeQuotes: true,
				removeComments: true,
				collapseWhitespace: true,
			},
		}),
		new MiniCssExtractPlugin({
			filename: 'style-[contenthash].min.css',
		}),
		new CleanWebpackPlugin(),
	],
});
