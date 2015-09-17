module.exports = function (grunt) {

    'use strict';

    var jsSrcFile = 'src/bullet.js';
    var jsDistDir = 'dist/';
    var jsExampleLibsDir = 'example/js/libs/';
    var testDir = 'test/spec/';

    grunt.initConfig({

        watch : {

            js: {
                files: [
                    jsSrcFile,
                    testDir + '**/*.js'
                ],

                tasks: ['dist']
            }
        },

        simplemocha : {

            options: {
                timeout: 3000,
                ignoreLeaks: false,
            },

            testAll : {
                src: testDir + '**/*.js'
            }
        },

        uglify : {

            options : {
                compress : {
                    drop_console: true
                },
                mangle : true,
                sourceMap : false,
                preserveComments : false,
                report : 'gzip' // TODO : does this report option still work?
            },

            dist : {
                src : jsSrcFile,
                dest : jsDistDir + 'bullet.min.js'
            }
        },

        copy : {

            dist : {
                src : jsSrcFile,
                dest : jsDistDir + 'bullet.js'
            },

            example : {
                src : jsSrcFile,
                dest : jsExampleLibsDir + 'bullet.js'
            }
        }
    });

    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*']});

    grunt.registerTask('default', ['simplemocha', 'uglify', 'copy', 'watch']);
    grunt.registerTask('dist', ['simplemocha', 'uglify', 'copy']);
    grunt.registerTask('test', ['simplemocha']);
};