// next.config.mjs
/** @type {import('next').NextConfig} */
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
              upgrade-insecure-requests;
              /* JS */
              script-src 'self' 'unsafe-inline';
              script-src-elem 'self' 'unsafe-inline';
              script-src-attr 'self' 'unsafe-inline';
              /* CSS */
              style-src 'self' 'unsafe-inline';
              style-src-elem 'self' 'unsafe-inline';
              style-src-attr 'unsafe-inline' 'unsafe-hashes';
              /* Media / Fonts */
              img-src 'self' data: blob: https://cdn.tldraw.com https://*.tldraw.com;
              font-src 'self' https://cdn.tldraw.com data:;
              /* XHR / WS */
              connect-src 'self' blob: https://cdn.tldraw.com https://polygon-mainnet.g.alchemy.com https://*.walletconnect.com https://*.reown.com;
              /* Workers / Frames / Manifest */
              worker-src 'self' blob:;
              frame-src 'self' https://*.walletconnect.com https://cdn.tldraw.com;
              child-src 'self' https://*.walletconnect.com https://cdn.tldraw.com;
              manifest-src 'self' https://cdn.tldraw.com;
            `.replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '').replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
}

export default nextConfig
