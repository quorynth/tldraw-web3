/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',           // ← головне, щоб Next зібрав статичний сайт у /out
  images: { unoptimized: true }
}
module.exports = nextConfig
