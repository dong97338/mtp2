/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'ko.wikipedia.org',
			port: '',
			pathname: '**',
		  },
		],
	  },
  reactStrictMode: true,
}

module.exports = nextConfig
