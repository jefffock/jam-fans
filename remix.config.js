// const {
// 	createRoutesFromFolders,
//   } = require("@remix-run/v1-route-convention");
  
  /** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
	serverBuildTarget: "vercel",
//   publicPath: "/build/",
//   serverBuildPath: "api/index.js",
//   serverMainFields: ["main, module"],
//   serverModuleFormat: "cjs",
//   serverPlatform: "node",
//   serverMinify: false,
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: ["**/.*"],
//   future: {
//     v2_dev: true,
// 	v2_errorBoundary: true,
// 	v2_normalizeFormMethod: true,
// 	v2_meta: true,
// 	v2_headers: true,
// 	// v2_routeConvention: true,
//   },
//   routes(defineRoutes) {
//     // uses the v1 convention, works in v1.15+ and v2
//     return createRoutesFromFolders(defineRoutes);
//   },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "api/index.js",
  // publicPath: "/build/",
//   routes(defineRoutes) {
//     // uses the v1 convention, works in v1.15+ and v2
//     return createRoutesFromFolders(defineRoutes);
//   },
};
