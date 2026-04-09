FROM node:20-alpine

WORKDIR /usr/src/app

# Copia apenas os arquivos de dependências primeiro (cache)
COPY package*.json ./

RUN npm install

# Copia o resto dos arquivos
COPY . .

# Regenera os binários do Prisma para Linux Alpine (essencial!)
RUN npx prisma generate --schema=prisma/schema.prisma

EXPOSE 3333

# Rodando em modo desenvolvimento (ajuste conforme seu script no package.json)
CMD ["npm", "run", "dev"]