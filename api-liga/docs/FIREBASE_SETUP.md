# Configuração do Firebase Storage

Este documento descreve como configurar o Firebase Storage para upload de vídeos na API LIGA.

## 📋 Pré-requisitos

- Conta no [Firebase Console](https://console.firebase.google.com/)
- Projeto Firebase criado
- Node.js instalado

## 🔧 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Nomeie o projeto: `api-liga` (ou nome de sua preferência)
4. Siga os passos de criação

### 2. Ativar Firebase Storage

1. No menu lateral, vá em **"Storage"**
2. Clique em **"Começar"**
3. Escolha o modo de segurança:
   - **Modo teste** (desenvolvimento): permite leitura/escrita pública temporariamente
   - **Modo produção**: requer autenticação
4. Escolha a localização: `europe-west` (mais próximo de Angola)
5. Clique em **"Concluído"**

### 3. Obter Credenciais

#### Opção 1: Arquivo JSON (Recomendado)

1. Vá em **Configurações do Projeto** ⚙️ > **Contas de Serviço**
2. Clique em **"Gerar nova chave privada"**
3. Salve o arquivo como `config/firebase-service-account.json`
4. Adicione ao `.env`:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
```

#### Opção 2: Variáveis de Ambiente

1. Abra o arquivo JSON baixado
2. Copie os valores para o `.env`:
```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=seu-project-id.appspot.com
```

### 4. Configurar Regras de Segurança

No Firebase Console > Storage > **Regras**, use:

#### Desenvolvimento (público):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Produção (com autenticação):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gestures/{gestureId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

### 5. Testar Configuração

Execute o servidor e teste o upload:

```bash
# Iniciar servidor
npm start

# Fazer login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@liga.ao", "password": "admin123"}'

# Upload de vídeo (usar token obtido)
curl -X POST http://localhost:3000/api/v1/gestures/1/video \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "video=@caminho/para/video.mp4"
```

## 📁 Estrutura de Arquivos no Firebase

```
firebase-storage-bucket/
└── gestures/
    ├── 1/
    │   └── video_1234567890.mp4
    ├── 2/
    │   └── video_1234567891.mp4
    └── 3/
        └── video_1234567892.mp4
```

## 🔒 Segurança

### Importante

- ⚠️ **NUNCA** commite `firebase-service-account.json`
- ⚠️ **NUNCA** exponha `FIREBASE_PRIVATE_KEY` publicamente
- ✅ Sempre use `.gitignore` para proteger credenciais
- ✅ Use variáveis de ambiente em produção
- ✅ Rotacione chaves regularmente

### .gitignore

Certifique-se de que o `.gitignore` contém:
```
firebase-service-account.json
*service-account*.json
.env
.env.local
.env.production
```

## 🌍 URLs Públicas

Após upload, os vídeos ficam disponíveis em:
```
https://storage.googleapis.com/SEU-BUCKET/gestures/1/video_123.mp4
```

## 🔗 Links Úteis

- [Documentação Firebase Storage](https://firebase.google.com/docs/storage)
- [Regras de Segurança](https://firebase.google.com/docs/storage/security)
- [Admin SDK Node.js](https://firebase.google.com/docs/admin/setup)

## 🐛 Troubleshooting

### Erro: "The specified bucket does not exist"
- Verifique se `FIREBASE_STORAGE_BUCKET` está correto
- Formato: `project-id.appspot.com`

### Erro: "Invalid PEM formatted message"
- Verifique se `FIREBASE_PRIVATE_KEY` tem `\n` escapados corretamente
- Use aspas duplas no `.env`

### Erro: "Permission denied"
- Verifique as regras de segurança no Firebase Console
- Certifique-se de que o arquivo está público ou autenticado

### Upload lento
- Considere reduzir tamanho/qualidade do vídeo
- Verifique conexão de internet
- Firebase Storage usa CDN global automaticamente

## 💰 Custos

Firebase Storage oferece:
- **Gratuito**: 5GB armazenamento + 1GB/dia transferência
- **Pago**: $0.026/GB armazenamento + $0.12/GB transferência

Monitore uso em: Firebase Console > Usage and billing
