module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'dist/directive.js',
            'dist/directive.css',
            'test/**/*.spec.js'
        ],
        exclude: [],
        port: 9876,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
        singleRun: false
    });
};