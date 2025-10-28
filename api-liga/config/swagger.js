const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API LIGA - Língua Gestual Angolana',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento de gestos da Língua Gestual Angolana',
      contact: {
        name: 'Equipa LIGA - Kassissa',
        email: 'contact@liga.ao'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api-liga.ao',
        description: 'Servidor de Produção'
      }
    ],
    tags: [
      {
        name: 'Autenticação',
        description: 'Registro, login e gerenciamento de perfil'
      },
      {
        name: 'Gestos',
        description: 'Operações relacionadas a gestos'
      },
      {
        name: 'Vídeos',
        description: 'Upload e gerenciamento de vídeos'
      },
      {
        name: 'Health',
        description: 'Status do sistema'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no login'
        }
      },
      schemas: {
        Gesture: {
          type: 'object',
          required: ['word', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do gesto',
              example: 1
            },
            word: {
              type: 'string',
              description: 'Palavra ou frase em português',
              example: 'bom dia'
            },
            category: {
              type: 'string',
              description: 'Categoria do gesto',
              example: 'saudacao'
            },
            description: {
              type: 'string',
              description: 'Descrição do gesto',
              example: 'Saudação matinal'
            },
            video_url: {
              type: 'string',
              nullable: true,
              description: 'URL do vídeo demonstrativo',
              example: '/uploads/videos/gesture-1-123456789.mp4'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Mensagem de erro'
            },
            error: {
              type: 'string',
              example: 'Detalhes do erro'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            },
            data: {
              type: 'object'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
