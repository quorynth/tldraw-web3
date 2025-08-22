// next.config.mjs
const csp = `
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.tldraw.com;
  font-src 'self' https://cdn.tldraw.com data:;
  connect-src 'self' https://cdn.tldraw.com https://*.alchemy.com https://polygon-mainnet.g.alchemy.com https://*.walletconnect.com https://*.reown.com;
  frame-src 'self' https://*.walletconnect.com;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp.replace(/\n/g, ' ').trim() },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ]
  },
};

// головне — експортувати через export default
export default nextConfig;
