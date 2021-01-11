module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					esmodules: true,
				},
				corejs: '3.7.0',
				useBuiltIns: 'usage',
				shippedProposals: true,
			},
		],
	],
};
