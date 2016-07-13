var wallabyWebpack = require('wallaby-webpack');

module.exports = function (wallaby) {
    var webpackPostprocessor = wallabyWebpack({
        externals: {
            "react": "React"
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
            {pattern: 'node_modules/chai/chai.js', instrument: false},

            {pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false},
            {pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false},
            {pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false},
            {pattern: 'node_modules/es6-promise/dist/es6-promise.js', instrument: false},
            {pattern: 'node_modules/phantomjs-polyfill/bind-polyfill.js', instrument: false},
            {pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},

            {pattern: 'src/**/*.js', load: false},
            {pattern: 'test/**/*.js', load: false},
            {pattern: '!test/**/*-specs.js', load: false}
        ],

        tests: [
            {pattern: 'test/**/*-specs.js', load: false}
        ],

        compilers: {
            '**/*.js*': wallaby.compilers.babel({
                presets: ['es2015', 'react'],
                babel: require('babel-core')
            })
        },

        postprocessor: webpackPostprocessor,

        testFramework: "mocha",

        setup: function (wallaby) {
            require('sinon-chai');
        },

        bootstrap: function () {
            window.expect = chai.expect;
            var should = chai.should();

            window.__moduleBundler.loadTests();
        },

        workers: {
            initial: 6,
            regular: 6
        }
    };
};
