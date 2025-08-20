/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Головне: статичний експорт у папку ./out
  output: 'export',
  // Щоб Next не намагався оптимізувати зображення під сервер
  images: { unoptimized: true },
}

module.exports = nextConfig
