module.exports = function (grunt) {

	"use strict";

	grunt.initConfig({

		/**
		 * Watch
		 * https://github.com/gruntjs/grunt-contrib-watch
		 * Watches your scss, js etc for changes and compiles them
		 */
		watch : {

			js: {
				files: [
					"src/js/libs/bullet.js"
				],

				tasks: ["uglify:dist"]
			}
		},

		uglify : {

			dist : {
				options : {
					compress : true,
					mangle : true,
					sourceMap : true,
					preserveComments : false,
					report : "gzip"
				},

				src : ["src/js/libs/bullet.js"],
				dest : "dist/bullet.min.js"
			}
		}
	});


	// Load all the grunt task modules.
	require("load-grunt-tasks")(grunt, {pattern: ["grunt-*"]});

	// =============
	// === Tasks ===
	// =============

	// Register the default task for building the project.
	grunt.registerTask("default", ["uglify:dist"]);
};