/** @type {import('next').NextConfig} */
const nextConfig = {
  // Дозволяємо віддалені зображення з cdn.tldraw.com (на випадок, якщо Next Image десь використаєш)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.tldraw.com' }
    ],
  },

  // Додаємо CSP, який не блокує tldraw і web3
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // мінімально необхідні директиви
            value: [
              "default-src 'self'",
              // RainbowKit / WalletConnect іноді використовують inline/eval — залишаємо
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.walletconnect.com https://*.reown.com",
              "style-src 'self' 'unsafe-inline'",
              // дозволяємо іконки/шрифти з CDN tldraw + data/blob
              "img-src 'self' data: blob: https://cdn.tldraw.com",
              "font-src 'self' data: https://cdn.tldraw.com",
              // мережеві запити до нашого API, RPC, Alchemy, WalletConnect
              "connect-src 'self' https://*.alchemy.com https://rpc.* https://*.walletconnect.com https://*.reown.com"
            ].join('; ')
          }
        ]
      }
    ]
  },
}

export default nextConfig
