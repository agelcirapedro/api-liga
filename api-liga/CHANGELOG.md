# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-10-28

### 🎉 Lançamento Inicial

#### ✨ Adicionado

**Funcionalidades Core**
- Sistema completo de CRUD para gestos (Língua Gestual Angolana)
- Upload de vídeos para Firebase Storage
- Autenticação JWT com registro e login
- Sistema de roles (user, admin)
- Documentação interativa Swagger/OpenAPI

**API Endpoints**
- `POST /api/v1/auth/register` - Registro de usuários
- `POST /api/v1/auth/login` - Autenticação
- `GET /api/v1/auth/profile` - Perfil do usuário
- `PUT /api/v1/auth/profile` - Atualizar perfil
- `PUT /api/v1/auth/password` - Alterar senha
- `GET /api/v1/gestures` - Listar gestos
- `GET /api/v1/gestures/:id` - Buscar gesto
- `POST /api/v1/gestures` - Criar gesto (autenticado)
- `PUT /api/v1/gestures/:id` - Atualizar gesto (autenticado)
- `DELETE /api/v1/gestures/:id` - Deletar gesto (admin)
- `POST /api/v1/gestures/:id/video` - Upload de vídeo (autenticado)
- `DELETE /api/v1/gestures/:id/video` - Deletar vídeo (autenticado)
- `GET /api/v1/gestures/with-videos` - Listar gestos com vídeos
- `GET /health` - Health check
- `GET /api-docs` - Documentação Swagger

**Infraestrutura**
- PostgreSQL como banco de dados principal
- Firebase Storage para armazenamento de vídeos
- Redis (opcional) para cache
- Docker e Docker Compose
- CI/CD com GitHub Actions
- Nginx como proxy reverso (produção)

**Segurança**
- Autenticação JWT
- Bcrypt para hash de senhas
- Helmet.js para headers de segurança
- CORS configurável
- Rate limiting (Nginx)
- Proteção de rotas por role
- Variáveis de ambiente para credenciais

**Desenvolvimento**
- ESLint para qualidade de código
- Nodemon para hot reload
- Swagger para documentação
- Docker Compose para ambiente de desenvolvimento
- Migrations para banco de dados

**Documentação**
- README.md completo
- Guia de configuração Firebase (`docs/FIREBASE_SETUP.md`)
- Guia de Docker (`docs/DOCKER.md`)
- Guia de Deploy (`docs/DEPLOY.md`)
- Documentação Swagger interativa
- `.env.example` e `.env.production.example`
- CHANGELOG.md

#### 🔧 Configuração

**Banco de Dados**
- Tabela `gestures` (id, word, category, description, video_url, timestamps)
- Tabela `users` (id, name, email, password, role, timestamps)
- Índices otimizados para performance

**Middleware**
- `authenticate` - Verificação de token JWT
- `isAdmin` - Verificação de permissão admin
- `optionalAuth` - Autenticação opcional
- Express middlewares: helmet, cors, json parser
- Multer para upload de arquivos

**Modelos**
- `Gesture` - CRUD completo de gestos
- `User` - Gerenciamento de usuários com bcrypt

**Controladores**
- `authController` - Autenticação e perfil
- `gestureController` - CRUD de gestos
- `videoController` - Upload e gerenciamento de vídeos

#### 🐳 Docker

**Imagens**
- `Dockerfile` - Imagem otimizada da aplicação
- `docker-compose.yml` - Orquestração completa (produção)
- `docker-compose.dev.yml` - Ambiente de desenvolvimento
- `.dockerignore` - Exclusão de arquivos desnecessários

**Serviços**
- API (Node.js 20 Alpine)
- PostgreSQL 15 Alpine
- Redis 7 Alpine (opcional)

**Features Docker**
- Health checks configurados
- Volumes persistentes
- Networks isoladas
- Auto-restart
- Logs estruturados

#### 🚀 CI/CD

**GitHub Actions**
- Testes automatizados
- Lint de código
- Build de imagem Docker
- Deploy automático para produção
- Security scanning (Trivy, npm audit)
- Notificações de deploy

#### 📊 Monitoramento

- Health check endpoint (`/health`)
- Logs estruturados
- PM2 monitoring (produção)
- Suporte para Sentry (error tracking)
- Suporte para New Relic (APM)

#### 🛡️ Segurança

- GitHub Push Protection configurado
- `.gitignore` atualizado para proteger credenciais
- Firebase credentials protegidas
- JWT secrets seguros
- HTTPS obrigatório em produção
- PostgreSQL não exposto publicamente

### 📝 Notas de Versão

Esta é a versão inicial da API LIGA, desenvolvida para facilitar o acesso e gerenciamento de conteúdos relacionados à Língua Gestual Angolana (LGA).

### 🎯 Próximas Features (Roadmap)

- [ ] Sistema de categorias hierárquicas
- [ ] Pesquisa full-text de gestos
- [ ] Sistema de favoritos por usuário
- [ ] Histórico de aprendizado
- [ ] API de análise de vídeos com MediaPipe
- [ ] Sistema de comentários e avaliações
- [ ] Integração com redes sociais
- [ ] App móvel (React Native)
- [ ] Dashboard administrativo
- [ ] Analytics e relatórios

### 🙏 Créditos

Desenvolvido por **Equipa LIGA - Kassissa**

### 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

## Formato do Changelog

### Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Depreciado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para correções de vulnerabilidades

### Versionamento

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

Exemplo: `1.0.0` = MAJOR.MINOR.PATCH
