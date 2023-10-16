/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: '/e/:id*',
        destination: '/edit?id_for_edit=:id*',
        permanent: true,
      },
      {
        source: '/l/:id*',
        destination: '/edit?parent_id=:id*',
        permanent: true,
      },
      {
        source: '/v/:id*',
        destination: '/view?id_for_view=:id*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
