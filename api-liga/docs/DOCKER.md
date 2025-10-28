# 🐳 Guia Docker - API LIGA

Este guia explica como usar Docker para desenvolvimento e deploy da API LIGA.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (v2.0+)

## 🚀 Início Rápido

### 1. Desenvolvimento Local (apenas banco de dados)

Para rodar apenas PostgreSQL e Redis em containers:

```bash
# Iniciar serviços de desenvolvimento
npm run docker:dev

# Verificar status
docker-compose -f docker-compose.dev.yml ps

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar serviços
npm run docker:dev:down
```

Depois rode a API localmente:
```bash
npm run dev
```

### 2. Produção Completa (todos os serviços)

Para rodar tudo em containers:

```bash
# Construir imagem
npm run docker:build

# Iniciar todos os serviços
npm run docker:up

# Ver logs da API
npm run docker:logs

# Parar todos os serviços
npm run docker:down
```

## 📦 Estrutura dos Containers

### Serviços

1. **postgres** - Banco de dados PostgreSQL
   - Porta: `5432`
   - Dados persistentes em volume `liga-postgres-data`
   - Auto-executa migrations em `config/migrations/`

2. **api** - Aplicação Node.js
   - Porta: `3000`
   - Conecta automaticamente ao PostgreSQL
   - Monta credenciais Firebase (somente leitura)
   - Volume para uploads temporários

3. **redis** - Cache Redis (opcional)
   - Porta: `6379`
   - Dados persistentes em volume `liga-redis-data`
   - Persistência AOF habilitada

### Volumes

- `liga-postgres-data` - Dados do PostgreSQL
- `liga-redis-data` - Dados do Redis
- `liga-uploads-data` - Uploads temporários

### Network

- `liga-network` - Rede bridge para comunicação entre containers

## 🔧 Comandos Úteis

### Build e Execução

```bash
# Construir imagem
docker build -t api-liga:latest .

# Construir sem cache
docker build --no-cache -t api-liga:latest .

# Executar container standalone
docker run -p 3000:3000 --env-file .env api-liga:latest

# Executar com compose
docker-compose up -d

# Reconstruir e iniciar
docker-compose up -d --build
```

### Gerenciamento

```bash
# Ver containers rodando
docker-compose ps

# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs apenas da API
docker-compose logs -f api

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Parar containers
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar, remover e limpar volumes
docker-compose down -v
```

### Manutenção

```bash
# Acessar shell do container da API
docker exec -it liga-api sh

# Acessar PostgreSQL
docker exec -it liga-postgres psql -U postgres -d liga_db

# Executar migrations manualmente
docker exec -it liga-api node config/migrations.js

# Ver uso de recursos
docker stats

# Limpar recursos não utilizados
docker system prune -a
```

### Debugging

```bash
# Verificar saúde dos containers
docker-compose ps
docker inspect liga-api

# Ver variáveis de ambiente do container
docker exec liga-api env

# Verificar conectividade entre containers
docker exec liga-api ping postgres
docker exec liga-api nc -zv postgres 5432

# Reiniciar apenas um serviço
docker-compose restart api
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` com:

```env
# Aplicação
PORT=3000
NODE_ENV=production

# Banco de Dados
DB_NAME=liga_db
DB_USER=postgres
DB_PASSWORD=sua_senha_segura

# JWT
JWT_SECRET=sua_chave_jwt_super_secreta
JWT_EXPIRES_IN=7d

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_STORAGE_BUCKET=seu-bucket.appspot.com
```

### Credenciais Firebase

O arquivo de credenciais Firebase deve estar em:
```
config/firebase-service-account.json
```

O Docker monta este arquivo como **somente leitura** no container por segurança.

## 🏗️ Customização

### Alterar Portas

Edite o arquivo `.env`:
```env
PORT=8080
DB_PORT=5433
REDIS_PORT=6380
```

### Adicionar Mais Memória

Edite `docker-compose.yml`:
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### Multi-stage Build (otimizado)

Crie `Dockerfile.production`:
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]
```

Build:
```bash
docker build -f Dockerfile.production -t api-liga:prod .
```

## 🚢 Deploy em Produção

### Docker Swarm

```bash
# Inicializar swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml liga

# Ver serviços
docker service ls

# Escalar API
docker service scale liga_api=3

# Remover stack
docker stack rm liga
```

### Kubernetes

Converter compose para Kubernetes:
```bash
# Instalar kompose
curl -L https://github.com/kubernetes/kompose/releases/download/v1.28.0/kompose-linux-amd64 -o kompose
chmod +x kompose
sudo mv kompose /usr/local/bin/

# Converter
kompose convert -f docker-compose.yml

# Aplicar
kubectl apply -f .
```

## 📊 Monitoramento

### Logs Centralizados

Adicione ao `docker-compose.yml`:
```yaml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Health Checks

Os containers já têm health checks configurados:
- **API**: `GET /health`
- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`

Ver status:
```bash
docker inspect --format='{{json .State.Health}}' liga-api | jq
```

## 🔒 Segurança

### Boas Práticas

1. ✅ **Não incluir secrets na imagem**
   - Use volumes para credenciais
   - Use variáveis de ambiente

2. ✅ **Usar imagens oficiais**
   - `node:20-alpine`
   - `postgres:15-alpine`
   - `redis:7-alpine`

3. ✅ **Princípio do menor privilégio**
   - Não executar como root
   - Usar `USER` no Dockerfile

4. ✅ **Scan de vulnerabilidades**
```bash
docker scan api-liga:latest
```

5. ✅ **Updates regulares**
```bash
docker pull node:20-alpine
docker pull postgres:15-alpine
docker build --pull -t api-liga:latest .
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs api

# Verificar se as portas estão livres
netstat -tulpn | grep 3000

# Testar conectividade com PostgreSQL
docker exec liga-api nc -zv postgres 5432
```

### Banco de dados não conecta

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Ver logs do PostgreSQL
docker-compose logs postgres

# Testar conexão manualmente
docker exec -it liga-postgres psql -U postgres -d liga_db
```

### Problemas de permissão

```bash
# Ajustar permissões de volumes
sudo chown -R $USER:$USER uploads/

# Recriar volumes
docker-compose down -v
docker-compose up -d
```

### Rebuild completo

```bash
# Parar tudo
docker-compose down -v

# Remover imagens
docker rmi api-liga:latest

# Limpar cache
docker system prune -a

# Rebuild
docker-compose up -d --build
```

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)

## 💡 Dicas

1. **Use .dockerignore** para excluir arquivos desnecessários
2. **Multi-stage builds** para imagens menores
3. **Cache layers** apropriadamente no Dockerfile
4. **Health checks** para garantir disponibilidade
5. **Volumes nomeados** para persistência de dados
6. **Networks** para isolar serviços
7. **Resource limits** para prevenir overconsumption
