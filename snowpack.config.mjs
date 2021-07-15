/** @type {import("snowpack").SnowpackUserConfig } */
export default {
	mount: {
		// directory name: 'build directory'
		public: '/',
		src: '/dist',
	},
	plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-dotenv'],
	routes: [
		/* Enable an SPA Fallback in development: */
		// {"match": "routes", "src": ".*", "dest": "/index.html"},
	],
	optimize: {
		bundle: true,
		minify: true,
		splitting: true,
		manifest: true,
		sourcemap: false,
		treeshake: true,
		target: 'es2018',
	},
	packageOptions: {
		/* ... */
	},
	devOptions: {
		port: 3001
	},
	buildOptions: {
		/* ... */
	},
};
