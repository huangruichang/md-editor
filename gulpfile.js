var gulp = require('gulp');
var gulpAtom = require('gulp-atom');

gulp.task('atom', function () {
	return gulpAtom({
		srcPath: './src',
		releasePath: './release',
		cachePath: './cache',
		version: 'v1.0.0',
		rebuild: false,
		platforms: ['win32-ia32', 'darwin-x64']
	});
});

gulp.task('default', ['atom']);