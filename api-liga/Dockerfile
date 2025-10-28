# Usar imagem oficial do Node.js LTS
FROM node:20-alpine

# Informações do maintainer
LABEL maintainer="Equipa LIGA - Kassissa"
LABEL description="API LIGA - Língua Gestual Angolana"

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar diretório para uploads temporários
RUN mkdir -p uploads/videos

# Expor porta da aplicação
EXPOSE 3000

# Variável de ambiente padrão
ENV NODE_ENV=production

# Comando para iniciar aplicação
CMD ["node", "src/app.js"]
