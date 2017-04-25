var wallabyWebpack = require('wallaby-webpack');

module.exports = function(wallaby) {
	var webpackPostprocessor = wallabyWebpack({
		externals: {
			'react': 'React'
		},
		module: {
			loaders: [
				{
					test: /.js?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					query: {
						presets: ['es2015']
					}
				}
			]
		}
	});

	return {
		files: [
			{pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false},
			{pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false},
			{pattern: 'node_modules/phantomjs-polyfill/bind-polyfill.js', instrument: false},
			{pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},

			{pattern: 'node_modules/chai/chai.js', instrument: false},

			{pattern: 'src/**/*.js', load: false},
			{pattern: '!src/**/*-spec.js', load: false},
			{pattern: 'test/**/*.js', load: false},
			{pattern: '!test/**/*-specs.js', load: false}
		],

		tests: [
			{pattern: 'src/**/*-spec.js', load: false},
			{pattern: 'test/**/*-specs.js', load: false}
		],

		compilers: {
			'**/*.js*': wallaby.compilers.babel({
				presets: ['es2015', 'react', 'stage-0'],
				babel: require('babel-core')
			})
		},

		postprocessor: webpackPostprocessor,

		testFramework: 'mocha',

		setup: function() {
			window.expect = chai.expect;

			var should = chai.should();

			window.__moduleBundler.loadTests();
		}
	};
};
