'use strict';
module.exports = function(grunt) {

    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            js: {
                src: ['*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        jscs: {
            options: {
                config: '.jscsrc',
                force: true
            },
            lib: {
                src: ['lib/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        mochacli: {
            options: {
                reporter: 'spec',
                bail: true,
                force: true,
                timeout: 16000
            },
            all: ['test/**/*.spec.js']
        },
        mocha_istanbul: {
            coverage: {
                src: ['test/'],
                options: {
                    mask: '*.spec.js',
                    coverage: true,
                    reportFormats: ['lcov', 'text']
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: '<%= jshint.js.src %>',
                tasks: ['lint', 'test']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['lint', 'test']
            }
        },
        documentation: {
            md: {
                files: [{
                    'src': ['index.js']
                }],
                options: {
                    format: 'md',
                    destination: 'doc'
                }
            },
            html: {
                files: [{
                    'src': ['index.js']
                }],
                options: {
                    destination: 'doc'
                }
            }
        },
        release: {
            options: {

            }
        }
    });

    // Default task.
    grunt.registerTask('lint', ['eslint', 'jscs']);
    grunt.registerTask('test', ['mochacli']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
    grunt.registerTask('default', ['lint', 'coverage', 'documentation']);

    grunt.event.on('coverage', function(content, done) {
        done();
    });
};
