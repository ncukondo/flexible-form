/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/e/:id*',
        destination: '/edit?id_for_edit=:id*',
      },
      {
        source: '/l/:id*',
        destination: '/edit?parent_id=:id*',
      },
      {
        source: '/v/:id*',
        destination: '/view?id_for_view=:id*',
      },
    ]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      {
        test: /\.toml$/,
        type: 'asset/source',
      }
    )
    return config
  },
}

module.exports = nextConfig
