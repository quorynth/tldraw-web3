# TLDraw NFT-Gated (Next.js + middleware)

Справжній серверний захист: сторінка `/board` віддається **лише** власникам NFT.
Перевірка робиться на сервері: SIWE-підпис, on-chain `balanceOf`, HttpOnly cookie, middleware блокує доступ.

## Швидкий старт (локально)
```bash
pnpm i
cp .env.example .env.local
# Заповни:
# - RPC_URL (Alchemy/Infura)
# - SIWE_DOMAIN (localhost:3000 при локальному запуску, або твій домен на проді)
# - SIWE_JWT_SECRET (довгий випадковий рядок)
# - NEXT_PUBLIC_* (мережа та NFT)
pnpm dev
```

## Деплой на Vercel
- Імпортуй репозиторій з GitHub у Vercel.
- Додай Environment Variables з `.env.example` (особливо SERVER-SIDE `RPC_URL`, `SIWE_*`).
- Розгорни. Middleware працює на Edge, `/board` захищений.

## Нотатки
- Цей шаблон **не зберігає** tldraw у IPFS — додається легко як окрема API-функція з Pinata/JWT.
- Якщо потрібен додатковий рівень (ролі, allowlist кількох контрактів) — додай логіку в `/api/check-holder`.
