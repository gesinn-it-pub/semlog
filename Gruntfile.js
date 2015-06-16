'use strict';
module.exports = function(grunt) {

    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: ['Gruntfile.js']
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
        jsdoc: {
            dist: {
                src: ['index.js', 'README.md'],
                options: {
                    destination: 'doc'
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('lint', ['jshint', 'jscs']);
    grunt.registerTask('test', ['mochacli']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
    grunt.registerTask('default', ['lint', 'coverage', 'jsdoc']);

    grunt.event.on('coverage', function(content, done) {
        done();
    });
};
