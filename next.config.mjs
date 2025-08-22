// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              base-uri 'self';
              frame-ancestors 'self';
              object-src 'none';
              script-src 'self' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://cdn.tldraw.com https://*.tldraw.com;
              font-src 'self' https://cdn.tldraw.com data:;
              connect-src 'self' blob: https://cdn.tldraw.com https://polygon-mainnet.g.alchemy.com https://*.walletconnect.com https://*.reown.com;
              worker-src 'self' blob:;
              frame-src 'self' https://*.walletconnect.com https://cdn.tldraw.com;
              child-src 'self' https://*.walletconnect.com https://cdn.tldraw.com;
              manifest-src 'self' https://cdn.tldraw.com;
            `.replace(/\\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
}

export default nextConfig
