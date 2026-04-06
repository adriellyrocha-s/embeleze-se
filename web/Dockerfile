# Usamos a versão LTS do Node (leve e estável)
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código (importante para o primeiro build)
COPY . .

# O Vite roda por padrão na porta 5173
EXPOSE 5173

# Comando para rodar o ambiente de dev
# O flag --host é OBRIGATÓRIO no Docker para o Vite aceitar conexões externas
CMD ["npm", "run", "dev", "--", "--host"]