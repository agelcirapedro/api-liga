# 🚀 Guia de Deploy - API LIGA

Este guia cobre o processo completo de deploy da API LIGA em produção.

## 📋 Sumário

- [Opções de Deploy](#-opções-de-deploy)
- [Preparação](#-preparação)
- [Deploy em VPS/Cloud](#-deploy-em-vpscloud)
- [Deploy com Docker](#-deploy-com-docker)
- [Deploy em Plataformas Cloud](#-deploy-em-plataformas-cloud)
- [Configuração Pós-Deploy](#-configuração-pós-deploy)
- [Monitoramento](#-monitoramento)
- [Manutenção](#-manutenção)

## 🎯 Opções de Deploy

### Recomendações por Cenário

| Cenário | Plataforma Recomendada | Custo Estimado |
|---------|----------------------|----------------|
| Desenvolvimento/Teste | Render (Free), Railway | Grátis - $5/mês |
| Pequeno/Médio Porte | DigitalOcean, Linode | $12-25/mês |
| Produção Angola | Servidor Local + Cloud Backup | Variável |
| Alta Disponibilidade | AWS, Google Cloud, Azure | $50+/mês |

## 🔧 Preparação

### 1. Checklist Pré-Deploy

- [ ] Código testado e funcionando localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Credenciais Firebase obtidas
- [ ] Banco de dados PostgreSQL disponível
- [ ] Domínio registrado (opcional)
- [ ] Certificado SSL configurado (Let's Encrypt gratuito)
- [ ] Backup do banco de dados configurado

### 2. Configurar Variáveis de Ambiente

Copie `.env.production.example` para `.env.production`:

```bash
cp .env.production.example .env.production
```

Edite com valores reais de produção:
- `JWT_SECRET` - Gere uma chave segura de 32+ caracteres
- `DB_PASSWORD` - Senha forte do PostgreSQL
- `FIREBASE_STORAGE_BUCKET` - Bucket do Firebase
- Outros conforme necessário

### 3. Gerar JWT Secret Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Python
python3 -c "import secrets; print(secrets.token_hex(64))"
```

## 🖥️ Deploy em VPS/Cloud

### Digital Ocean, Linode, Vultr, etc.

#### Passo 1: Criar Droplet/VPS

1. Sistema: **Ubuntu 22.04 LTS**
2. Especificações mínimas:
   - CPU: 1 vCore
   - RAM: 2GB
   - Storage: 50GB SSD
   - Preço: ~$12/mês

#### Passo 2: Configurar Servidor

```bash
# Conectar via SSH
ssh root@seu-servidor-ip

# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y curl git build-essential

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# Instalar Nginx (proxy reverso)
apt install -y nginx

# Instalar PM2 (gerenciador de processos)
npm install -g pm2

# Configurar firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

#### Passo 3: Configurar PostgreSQL

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar banco e usuário
CREATE DATABASE liga_db_prod;
CREATE USER liga_admin WITH ENCRYPTED PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE liga_db_prod TO liga_admin;
\q
```

#### Passo 4: Clonar Projeto

```bash
# Criar diretório
mkdir -p /var/www
cd /var/www

# Clonar repositório
git clone https://github.com/seu-usuario/api-liga.git
cd api-liga

# Instalar dependências
npm ci --only=production
```

#### Passo 5: Configurar Variáveis

```bash
# Copiar exemplo
cp .env.production.example .env

# Editar com nano ou vim
nano .env

# Adicionar credenciais Firebase
# Copiar firebase-service-account.json para config/
```

#### Passo 6: Executar Migrations

```bash
npm run migrate
```

#### Passo 7: Iniciar com PM2

```bash
# Iniciar aplicação
pm2 start src/app.js --name api-liga

# Configurar auto-start no boot
pm2 startup
pm2 save

# Ver logs
pm2 logs api-liga

# Ver status
pm2 status
```

#### Passo 8: Configurar Nginx

```bash
# Criar configuração
nano /etc/nginx/sites-available/api-liga
```

Adicionar:
```nginx
server {
    listen 80;
    server_name api.liga.ao;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar:
```bash
# Link simbólico
ln -s /etc/nginx/sites-available/api-liga /etc/nginx/sites-enabled/

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

#### Passo 9: Configurar SSL (Let's Encrypt)

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obter certificado
certbot --nginx -d api.liga.ao

# Auto-renovação está configurada automaticamente
# Testar renovação
certbot renew --dry-run
```

## 🐳 Deploy com Docker

### Usando Docker Compose

```bash
# Clonar projeto
git clone https://github.com/seu-usuario/api-liga.git
cd api-liga

# Configurar .env
cp .env.production.example .env
nano .env

# Adicionar credenciais Firebase
cp firebase-key.json config/firebase-service-account.json

# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Executar migrations
docker exec -it liga-api npm run migrate
```

### Nginx como Proxy (com Docker)

Criar `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - liga-network

  api:
    # ... configuração existente
```

## ☁️ Deploy em Plataformas Cloud

### Render.com (Simples)

1. Criar conta em [render.com](https://render.com)
2. **New** → **Web Service**
3. Conectar repositório GitHub
4. Configurações:
   - **Name**: api-liga
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Starter ($7/mês)
5. Adicionar variáveis de ambiente
6. Criar PostgreSQL Database (separado)
7. Deploy automático!

### Railway.app

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar
railway init

# Adicionar variáveis
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=...

# Deploy
railway up

# Ver logs
railway logs
```

### Heroku (Clássico)

```bash
# Criar Procfile
echo "web: node src/app.js" > Procfile

# Login
heroku login

# Criar app
heroku create api-liga-angola

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis
heroku config:set JWT_SECRET=...
heroku config:set FIREBASE_STORAGE_BUCKET=...

# Deploy
git push heroku main

# Ver logs
heroku logs --tail

# Executar migrations
heroku run npm run migrate
```

### Google Cloud Run

```bash
# Build imagem
gcloud builds submit --tag gcr.io/PROJECT-ID/api-liga

# Deploy
gcloud run deploy api-liga \
  --image gcr.io/PROJECT-ID/api-liga \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

## ⚙️ Configuração Pós-Deploy

### 1. Testar API

```bash
# Health check
curl https://api.liga.ao/health

# Documentação
curl https://api.liga.ao/api-docs.json

# Login
curl -X POST https://api.liga.ao/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@liga.ao","password":"admin123"}'
```

### 2. Configurar Backup Automático

```bash
# Criar script de backup
cat > /root/backup-liga.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
pg_dump -U liga_admin liga_db_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /root/backup-liga.sh

# Adicionar ao cron (diariamente às 2h)
crontab -e
# Adicionar: 0 2 * * * /root/backup-liga.sh
```

### 3. Configurar Logs

```bash
# PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 4. Segurança Adicional

```bash
# Fail2ban (proteção contra brute force)
apt install -y fail2ban

# Configurar limite de requisições no Nginx
# Adicionar em /etc/nginx/nginx.conf
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
```

## 📊 Monitoramento

### PM2 Monitoring

```bash
# Ver métricas
pm2 monit

# Dashboard web (opcional)
pm2 link YOUR_SECRET_KEY YOUR_PUBLIC_KEY
```

### UptimeRobot (Grátis)

1. Criar conta em [uptimerobot.com](https://uptimerobot.com)
2. Adicionar monitor:
   - Type: HTTP(S)
   - URL: https://api.liga.ao/health
   - Interval: 5 minutos
3. Configurar alertas por email/SMS

### Sentry (Error Tracking)

```bash
npm install @sentry/node

# Adicionar ao src/app.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## 🔄 Manutenção

### Atualizar Código

```bash
# Com PM2
cd /var/www/api-liga
git pull origin main
npm ci --only=production
pm2 reload api-liga

# Com Docker
docker-compose pull
docker-compose up -d --build
```

### Ver Logs

```bash
# PM2
pm2 logs api-liga --lines 100

# Docker
docker-compose logs -f --tail=100 api

# Sistema (Nginx)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Troubleshooting

```bash
# Verificar status
pm2 status
systemctl status nginx
systemctl status postgresql

# Testar conectividade DB
psql -h localhost -U liga_admin -d liga_db_prod

# Reiniciar serviços
pm2 restart api-liga
systemctl restart nginx
systemctl restart postgresql
```

## 📈 Scaling

### Vertical (Mais Recursos)

- Aumentar RAM/CPU do servidor
- Otimizar queries do banco
- Adicionar índices no PostgreSQL

### Horizontal (Mais Instâncias)

```bash
# PM2 Cluster Mode
pm2 start src/app.js -i max --name api-liga

# Load Balancer no Nginx
upstream api_backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}
```

## 🛡️ Checklist de Segurança

- [ ] HTTPS configurado (SSL/TLS)
- [ ] Firewall ativo (ufw/iptables)
- [ ] PostgreSQL não exposto publicamente
- [ ] Senhas fortes (20+ caracteres)
- [ ] JWT_SECRET aleatório e longo
- [ ] Credenciais Firebase seguras
- [ ] Rate limiting configurado
- [ ] Logs monitorados
- [ ] Backups automáticos
- [ ] Atualizações de segurança aplicadas

## 📚 Recursos

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Sucesso no deploy! 🎉**

Para suporte: contact@liga.ao
