module.exports = {
	entry: './src/index.js',
	output: {
		assetModuleFilename: 'images/[contenthash][ext]',
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-transform-runtime'],
						cacheDirectory: true,
					},
				},
			},
			{
				test: /\.html$/,
				use: 'html-loader',
			},
			{
				test: /\.(png|jpe?g|gif|svg|webp)$/i,
				type: 'asset/resource',
			},
		],
	},
};
