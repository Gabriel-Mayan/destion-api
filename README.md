# Destion API

API construída com **NestJS**, utilizando **TypeORM**, **Socket.IO**, integração com **Redis**, envio de e-mails, manipulação de PDFs e autenticação via JWT. O projeto segue arquitetura modular, com separação clara entre módulos de domínio, infraestrutura e integrações.

## Estrutura do Projeto

- **src/app/config**: Configurações globais da aplicação (CORS, database, JWT, pipes).  
- **src/app/modules**: Módulos principais da aplicação:  
  - `auth`: autenticação, registro, login social e recuperação de senha.  
  - `user`: gerenciamento de usuários.  
  - `chat` e `message`: funcionalidades de chat em tempo real.  
  - `recovery-password`: controle de tokens de recuperação de senha.  
- **src/app/shared**: Serviços e utilitários compartilhados, como crypto, date-fns, decorators, guards e HTTP client.  
- **src/infrastructure**: Camada de infraestrutura, incluindo middlewares, Redis, compressão de dados, ping e WebSockets.  
- **src/integrations**: Integrações externas, incluindo envio de e-mails, geração de PDFs e monitoramento com Sentry.  
- **src/main.ts**: Arquivo principal para inicialização do NestJS.

## Tecnologias utilizadas

- **NestJS** (framework Node.js)
- **TypeORM** (ORM)
- **PostgreSQL/MySQL** (banco de dados)
- **Socket.IO** (comunicação em tempo real)
- **Redis** (cache e pub/sub)
- **Axios** (requisições HTTP)
- **Nodemailer** (envio de e-mails)
- **PDF Services Adobe** (manipulação de PDFs)
- **Sentry** (monitoramento de erros)
- **JWT** (autenticação)
- **bcrypt** (hash de senhas)
- **class-validator / class-transformer** (validação de DTOs)
- **date-fns** (manipulação de datas)

## Requisitos

- Docker e Docker Compose  
- Node.js >= 20 (para desenvolvimento local)  
- Banco de dados e Redis (opcionais se usar Docker Compose)  

## Configuração do Ambiente

O projeto utiliza variáveis de ambiente definidas em um arquivo `.env`. Um exemplo está disponível em `.env.example`:

> É possível configurar o ambiente para desenvolvimento, teste ou produção ajustando as variáveis conforme necessário.

## Build e Execução com Docker

O projeto já possui um `Dockerfile` e `docker-compose.yml` que sobem a API, o banco de dados e o Redis juntos. Para rodar:

```bash
# Copie o exemplo de .env
cp .env.example .env

# Suba o ambiente com Docker Compose
docker-compose up --build
```

Após alguns segundos, a API estará disponível em `http://localhost:8080` (ou na porta definida no `.env`).

### Comandos Úteis

- Parar o ambiente:

```bash
docker-compose down
```

- Rodar em background:

```bash
docker-compose up -d
```

- Ver logs da API:

```bash
docker-compose logs -f api
```

## Scripts Locais (Node.js)

Se preferir rodar sem Docker:

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run start:dev

# Buildar a aplicação
npm run build
npm run start:prod
```

## Testes

```bash
# Rodar todos os testes
npm run test

# Testes em watch
npm run test:watch

# Cobertura
npm run test:cov

# Testes e2e
npm run test:e2e
```

## Observações

- Arquitetura modular facilita manutenção e expansão.  
- Chat e mensagens utilizam WebSockets com suporte a Redis para pub/sub.  
- Integrações externas incluem e-mails, PDFs e monitoramento Sentry.  
- Variáveis de ambiente permitem configurar a aplicação para diferentes ambientes.

