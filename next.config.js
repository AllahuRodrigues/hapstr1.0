/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1) let styled-components work server-side
  compiler: {
    styledComponents: true,
  },

  // 2) suppress the Supabase realtime-JS “critical dependency” warning
  webpack: (config) => {
    config.ignoreWarnings ??= []
    config.ignoreWarnings.push(
      /Critical dependency: the request of a dependency is an expression/
    )
    return config
  },

  // 3) allow Unsplash (or any other remote host) images if you need them
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

module.exports = nextConfig
