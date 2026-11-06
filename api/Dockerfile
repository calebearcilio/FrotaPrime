FROM node:24-slim

# O Prisma precisa do OpenSSL, que não vem na imagem slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate --config prisma7.config.ts && npx prisma migrate deploy --config prisma7.config.ts && npm run dev"]
