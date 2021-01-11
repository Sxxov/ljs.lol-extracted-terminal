/* eslint-disable no-undef */
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy-assets';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import childProcess, { execSync } from 'child_process';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import cssnano from 'cssnano';
import imagemin from 'rollup-plugin-imagemin';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';
import ImageminGM from 'imagemin-gm';
import del from 'rollup-plugin-delete';
// import url from '@rollup/plugin-url';
import mdx from './build/rollup-plugin-mdx';

const imageminGM = new ImageminGM();

const production = !process.env.ROLLUP_WATCH;
const onwarn = (message, warn) => {
	const ignored = {
		EVAL: ['node_modules', 'lottie'],
		CIRCULAR_DEPENDENCY: ['factory', 'node_modules'],
	};
	const ignoredKeys = Object.keys(ignored);
	const ignoredValues = Object.values(ignored);

	for (let i = 0, l = ignoredKeys.length; i < l; ++i) {
		const ignoredKey = ignoredKeys[i];
		const ignoredValue = ignoredValues[i];

		// eslint-disable-next-line no-restricted-syntax
		for (const ignoredValuePart of ignoredValue) {
			if (!(message.code === ignoredKey
				&& message.toString().includes(ignoredValuePart))) {
				continue;
			}

			return;
		}
	}

	warn(message);
};
const watch = {
	clearScreen: false,
};

export default () => [{
	input: 'src/svelte.bootstrap.js',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: 'public',
		// file: 'public/svelte.bootstrap.js',
	},
	onwarn,
	watch,
	inlineDynamicImports: false,
	plugins: [
		// copy({
		// 	targets: [
		// 		{
		// 			src: 'src/index.html',
		// 			dest: 'public',
		// 		},
		// 		{
		// 			src: 'src/raw',
		// 			dest: 'public',
		// 		},
		// 	],
		// 	// hook: 'load',
		// }),

		production && del({
			targets: [
				'public',
			],
			suppressErrors: true,
		}),

		copy({
			assets: [
				'src/index.html',
				'src/raw/pdf',
				'src/raw/img/favicon',
				'src/_redirects',
			],
		}),

		postcss({
			plugins: [
				postcssImport(),
				production && cssnano({
					preset: ['default', {
						cssDeclarationSorter: true,
					}],
				}),
			],
		}),

		json({
			compact: production,
			preferConst: true,
		}),

		mdx(),

		// is cached, so no need to run only on prod
		{
			buildStart() {
				try {
					execSync('"./src/raw/img/collage/seqscale.bat"');
				} catch (err) {
					console.warn('Collage images aren\'t scaled. Probably running on netify, so make sure it\'s scaled locally first!');
				}
			},
		},

		// url({
		// 	include: '**/*.pdf',
		// 	limit: 0,
		// 	fileName: '[dirname][name][hash][extname]',
		// 	sourceDir: 'src',
		// 	destDir: 'public',
		// }),

		imagemin({
			preserveTree: 'src',
			plugins: production
				? {
					jpegRecompress: imageminJpegRecompress,
					GMResize: imageminGM.resize.bind(imageminGM),
				}
				: {
					jpegtran: () => (buffer) => buffer,
				},
			jpegRecompress: {
				accurate: true,
				target: 0.8,
				min: 60,
				max: 95,
			},
			GMResize: {
				width: '>2048',
				height: undefined,
			},
			jpegtran: production
				? {
					progressive: true,
				}
				: {},
		}),

		// ignore([
		// 	'path',
		// 	'fs',
		// 	'worker_threads',
		// 	'crypto',
		// 	'perf_hooks',
		// ]),

		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: (css) => {
				css.write('bundle.css');
			},
			// preprocess: sveltePreprocessor(),
			accessors: true,
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),

		commonjs(),

		production && babel({
			extensions: ['.js', '.mjs', '.html', '.svelte'],
			include: ['src/**', 'node_modules/svelte/**'],
			babelHelpers: 'bundled',
		}),

		// typescript(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
	],
}];

function serve(npmScript = ['serve', '--', '--dev']) {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = childProcess.spawn('npm', ['run', ...npmScript], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true,
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		},
	};
}
