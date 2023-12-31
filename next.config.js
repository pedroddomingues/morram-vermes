/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
	...nextConfig,
	webpack: (
		config,
		{ buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
	) => {
		// Important: return the modified config
		if (isServer) {
			config.externals.push({
				bufferutil: "bufferutil",
				"utf-8-validate": "utf-8-validate",
			});
		}
		return config;
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
};
