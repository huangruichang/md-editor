var gulp = require('gulp');
var electron = require('gulp-electron');
var gulpAtom = require('gulp-atom');

gulp.task('atom', function () {
	return gulpAtom({
		srcPath: './src',
		releasePath: './release',
		cachePath: './cache',
		version: 'v0.30.4',
		rebuild: false,
		platforms: ['win32-ia32', 'darwin-x64']
	});
});

gulp.task('default', ['atom']);