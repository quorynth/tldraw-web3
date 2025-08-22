// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://cdn.tldraw.com;
              font-src 'self' https://cdn.tldraw.com data:;
              connect-src 'self' blob: https://cdn.tldraw.com https://*.alchemy.com https://polygon-mainnet.g.alchemy.com https://*.walletconnect.com https://*.reown.com;
              frame-src 'self' https://*.walletconnect.com;
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ]
  },
}

export default nextConfig
