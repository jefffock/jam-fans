/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
	// serverBuildTarget: "vercel",
	// publicPath: '/public/',
	// serverBuildPath: 'api/index.js',
	//   serverMainFields: ["main, module"],
	serverModuleFormat: 'cjs',
	// appDirectory: 'app',
	// assetsBuildDirectory: 'public/build',
	// serverPlatform: 'node',
	// publicPath: '/build/',
	// serverBuildPath: 'build/index.js',

	// serverMinify: false,
	// When running locally in development mode, we use the built in remix
	// server. This does not understand the vercel lambda module format,
	// so we default back to the standard build output.
	// server: process.env.NODE_ENV === 'development' ? undefined : './server.js',
	ignoredRouteFiles: ['**/.*'],
	// appDirectory: "app",
	// assetsBuildDirectory: "public/build",
	// serverBuildPath: "api/index.js",
	// publicPath: "/build/",
}
