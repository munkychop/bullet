const gulp = require('gulp');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');

gulp.task('compile', (cb) => {
  pump([
    gulp.src('src/bullet.js'),
    babel({presets: ['es2015']}),
    gulp.dest('dist'),
    gulp.dest('example/js/libs'),
    rename('bullet.min.js'),
    uglify({
      compress : {
        drop_console: true
      },
      mangle : true,
    }),
    gulp.dest('dist'),
  ], cb);
});

gulp.task('default', ['watch']);

gulp.task('watch', ['compile'], () => {
  gulp.watch('src/bullet.js', ['compile']);
});
