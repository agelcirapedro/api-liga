# API LIGA - Língua Gestual Angolana

API RESTful para o projeto LIGA (Língua Gestual Angolana), desenvolvida para facilitar o acesso e gerenciamento de conteúdos relacionados à Língua Gestual Angolana.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Contribuição](#-contribuição)

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Firebase** - Storage de arquivos e autenticação
- **Redis** - Cache (opcional)
- **JWT** - Autenticação e autorização

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (v12 ou superior)
- [Redis](https://redis.io/) (opcional, para cache)
- Conta no [Firebase](https://firebase.google.com/)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd api-liga
```

2. Instale as dependências:
```bash
npm install
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

#### Banco de Dados PostgreSQL
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=liga_db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

#### Firebase Admin SDK

**Opção 1 (Recomendada):** Use um arquivo JSON de credenciais:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Vá em **Configurações do Projeto** > **Contas de Serviço**
3. Clique em **Gerar nova chave privada**
4. Salve o arquivo como `config/serviceAccountKey.json`
5. Adicione no `.env`:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
```

**Opção 2:** Use variáveis de ambiente individuais (copie do arquivo JSON baixado):
```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project-id.iam.gserviceaccount.com
# ... outras variáveis
```

⚠️ **Importante:** Nunca compartilhe ou faça commit do arquivo `.env` ou das credenciais do Firebase!

### 2. Configuração do Banco de Dados

Execute as migrações para criar as tabelas:

```bash
npm run migrate
```

## 🏃 Uso

### Desenvolvimento

Execute o servidor em modo de desenvolvimento (com auto-reload):

```bash
npm run dev
```

### Produção

Execute o servidor em modo de produção:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

## 📁 Estrutura do Projeto

```
api-liga/
├── config/
│   ├── database.js       # Configuração PostgreSQL
│   ├── firebase.js       # Configuração Firebase
│   └── migrations.js     # Scripts de migração
├── src/
│   ├── controllers/      # Lógica de controle
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição de rotas
│   └── app.js           # Configuração principal
├── uploads/             # Arquivos temporários
├── .env                 # Variáveis de ambiente (não versionado)
├── .env.example         # Exemplo de variáveis
├── package.json         # Dependências e scripts
└── README.md           # Este arquivo
```

## 🔌 API Endpoints

### Gestos

- `GET /api/v1/gestures` - Lista todos os gestos
- `GET /api/v1/gestures/:id` - Obtém um gesto específico
- `POST /api/v1/gestures` - Cria um novo gesto
- `PUT /api/v1/gestures/:id` - Atualiza um gesto
- `DELETE /api/v1/gestures/:id` - Remove um gesto

### Vídeos

- `GET /api/v1/videos` - Lista todos os vídeos
- `GET /api/v1/videos/:id` - Obtém um vídeo específico
- `POST /api/v1/videos` - Upload de vídeo

## 🛡️ Segurança

- Todas as credenciais devem estar no arquivo `.env` (nunca no código)
- O arquivo `.env` está no `.gitignore` e não deve ser versionado
- Use HTTPS em produção
- Mantenha as dependências atualizadas

### Verificar Vulnerabilidades

Execute regularmente:

```bash
npm audit
npm audit fix
```

## 🧪 Testes

Execute os testes:

```bash
npm test
```

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Equipe

Desenvolvido pela **Equipa LIGA - Kassissa**

---

Para mais informações ou suporte, entre em contato com a equipe de desenvolvimento.
