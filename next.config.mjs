/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://cdn.tldraw.com",
              "font-src 'self' data: https://cdn.tldraw.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "connect-src 'self' https://cdn.tldraw.com https://*.alchemy.com https://*.walletconnect.com https://*.reown.com"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

export default nextConfig
