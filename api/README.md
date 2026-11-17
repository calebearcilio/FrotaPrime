<div align="center">

# 🚗 FrotaPrime — API

**API REST do sistema de locação de veículos FrotaPrime**

![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

</div>

---

## 📑 Sumário

- [Sobre](#-sobre)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Modelo de dados](#-modelo-de-dados)
- [Regras de negócio](#-regras-de-negócio)
- [Autenticação](#-autenticação)
- [Endpoints](#-endpoints)
- [Tratamento de erros](#-tratamento-de-erros)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Como executar](#-como-executar)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Banco de dados e migrations](#-banco-de-dados-e-migrations)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 📖 Sobre

A **API FrotaPrime** é o backend do sistema de locação de veículos. Ela é responsável por:

- **Cadastro e autenticação de usuários** com senha criptografada e token JWT;
- **Gestão da frota**: cadastro de veículos e listagem com filtro por disponibilidade;
- **Gestão de locações**: criação de locações com cálculo automático do valor total, listagem das locações do usuário e finalização (devolução) do veículo.

Todas as entradas são validadas com **Zod**, os dados são persistidos em **PostgreSQL** via **Prisma ORM** e as operações críticas (reserva e devolução de veículos) são executadas dentro de **transações** para garantir consistência.

---

## 🛠 Tecnologias

| Categoria | Tecnologia | Versão |
| --- | --- | --- |
| Runtime | [Node.js](https://nodejs.org/) | 24 |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) | ^6.0 |
| Framework HTTP | [Express](https://expressjs.com/) | ^5.3 |
| ORM | [Prisma](https://www.prisma.io/) + `@prisma/adapter-pg` | ^7.10 |
| Banco de dados | [PostgreSQL](https://www.postgresql.org/) | 16 |
| Validação | [Zod](https://zod.dev/) | ^4.6 |
| Autenticação | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | ^9.0 |
| Hash de senha | [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | ^6.0 |
| CORS | [cors](https://github.com/expressjs/cors) | 2.8 |
| Dev server | [tsx](https://tsx.is/) (watch mode) | ^4.23 |
| Containerização | Docker / Docker Compose | — |

---

## 🏛 Arquitetura

A API segue uma **arquitetura em camadas**, onde cada camada tem uma única responsabilidade:

```
Requisição HTTP
      │
      ▼
┌─────────────┐   Define os endpoints e encadeia os middlewares
│   Routes    │
└─────────────┘
      │
      ▼
┌─────────────┐   authValidate  → valida o token JWT
│ Middlewares │   bodyValidate  → valida o body com Zod
└─────────────┘   queryValidate → valida a query string com Zod
      │
      ▼
┌─────────────┐   Extrai dados da requisição e devolve a resposta HTTP
│ Controllers │
└─────────────┘
      │
      ▼
┌─────────────┐   Regras de negócio, transações e mapeamento de respostas
│  Services   │
└─────────────┘
      │
      ▼
┌─────────────┐   Prisma Client (adapter pg) → PostgreSQL
│ Repository  │
└─────────────┘
```

Erros lançados em qualquer camada que estendam `ApiError` são capturados pelo **`globalErrorHandler`**, que os converte em uma resposta JSON padronizada com o status HTTP adequado. Erros inesperados retornam `500`.

---

## 📂 Estrutura de pastas

```
api/
├── prisma/
│   ├── migrations/            # Histórico de migrations SQL
│   └── schema.prisma          # Modelagem do banco de dados
├── src/
│   ├── controllers/           # Camada HTTP (req/res)
│   │   ├── authController.ts
│   │   ├── rentalController.ts
│   │   └── vehicleController.ts
│   ├── errors/                # Erros de domínio (estendem ApiError)
│   │   ├── ApiError.ts
│   │   ├── auth/
│   │   ├── rentals/
│   │   └── vehicles/
│   ├── generated/prisma/      # Prisma Client gerado (não versionado)
│   ├── middlewares/
│   │   ├── authValidation.ts      # Validação do token JWT
│   │   ├── globalErrorHandler.ts  # Tratamento centralizado de erros
│   │   └── schemaValidation.ts    # Validação de body/query com Zod
│   ├── repository/
│   │   └── prisma.ts          # Instância única do PrismaClient
│   ├── routes/                # Definição das rotas por domínio
│   ├── schemas/               # Schemas Zod de entrada
│   ├── services/              # Regras de negócio
│   ├── types/                 # Tipagens (payload do token, Request.user)
│   └── server.ts              # Ponto de entrada da aplicação
├── Dockerfile
├── prisma7.config.ts          # Configuração do Prisma 7 (schema, migrations, datasource)
├── package.json
└── tsconfig.json
```

---

## 🗄 Modelo de dados

```mermaid
erDiagram
    USERS ||--o{ RENTALS : "realiza"
    VEHICLES ||--o{ RENTALS : "é locado em"

    USERS {
        int id PK
        string name
        string email UK
        string password
        datetime createdAt
    }

    VEHICLES {
        int id PK
        string brand
        string model
        string licensePlate UK
        int year
        decimal dailyRate
        boolean available
    }

    RENTALS {
        int id PK
        int userId FK
        int vehicleId FK
        datetime startDate
        datetime expectedReturnDate
        datetime returnDate
        decimal totalAmount
        enum status
    }
```

### `users`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `Int` (PK, autoincremento) | Identificador do usuário |
| `name` | `String` | Nome completo |
| `email` | `String` (único) | E-mail de acesso |
| `password` | `String` | Hash bcrypt da senha |
| `createdAt` | `DateTime` | Data de criação (padrão: `now()`) |

### `vehicles`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `Int` (PK, autoincremento) | Identificador do veículo |
| `brand` | `String` | Marca |
| `model` | `String` | Modelo |
| `licensePlate` | `String` (único) | Placa |
| `year` | `Int` | Ano de fabricação |
| `dailyRate` | `Decimal(10,2)` | Valor da diária |
| `available` | `Boolean` | Disponibilidade para locação (padrão: `true`) |

### `rentals`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `Int` (PK, autoincremento) | Identificador da locação |
| `userId` | `Int` (FK → `users`) | Usuário que realizou a locação |
| `vehicleId` | `Int` (FK → `vehicles`) | Veículo locado |
| `startDate` | `DateTime` | Data de início |
| `expectedReturnDate` | `DateTime` | Data prevista de devolução |
| `returnDate` | `DateTime?` | Data efetiva da devolução (preenchida ao finalizar) |
| `totalAmount` | `Decimal(10,2)` | Valor total calculado |
| `status` | `RentalStatus` | `ACTIVE` ou `COMPLETED` (padrão: `ACTIVE`) |

> As chaves estrangeiras usam `onDelete: Restrict`: não é possível excluir usuários ou veículos que possuam locações.

---

## 📐 Regras de negócio

### Usuários
- O e-mail deve ser **único** (`409 Conflict` caso já exista).
- `password` e `confirmPassword` precisam ser iguais (`422 Unprocessable Entity`).
- Senhas são armazenadas com **bcrypt** (10 salt rounds) e **nunca** são retornadas nas respostas.
- Login e cadastro retornam um **token JWT válido por 1 dia**.

### Veículos
- A placa (`licensePlate`) é **única** — tentativas de duplicação retornam `409 Conflict`.
- Todo veículo é criado como **disponível** (`available: true`).
- A listagem pode ser filtrada por disponibilidade via `?disponivel=true|false`.

### Locações
- **Cálculo do valor total**: `totalAmount = dailyRate × dias`, onde
  `dias = max(1, ceil((expectedReturnDate − startDate) / 24h))`.
  Ou seja, frações de dia são arredondadas para cima e a cobrança mínima é de 1 diária.
- `expectedReturnDate` deve ser **posterior** a `startDate`.
- **Reserva atômica**: dentro de uma transação, o veículo só é marcado como indisponível se ainda estiver disponível (`updateMany where available = true`). Isso evita que duas requisições simultâneas loquem o mesmo veículo — a segunda recebe `409 Veículo indisponível para locação`.
- O usuário lista **apenas as próprias** locações.
- **Finalização** (devolução), também executada em transação:
  - somente o **dono** da locação pode finalizá-la (`403`);
  - a locação deve estar `ACTIVE` (`409` se já finalizada);
  - grava `returnDate` com a data/hora atual, muda o status para `COMPLETED` e **libera o veículo** (`available: true`).

---

## 🔐 Autenticação

As rotas protegidas exigem o header:

```http
Authorization: Bearer <token>
```

O token é obtido em `POST /auth/login` ou `POST /auth/cadastro`, assinado com `JWT_SECRET` e contém o payload:

```json
{ "id": 1, "email": "joao@exemplo.com" }
```

O middleware `authValidate` decodifica o token e disponibiliza os dados em `req.user`. Token ausente, malformado, inválido ou expirado resulta em `401 Unauthorized`.

---

## 🌐 Endpoints

**URL base (desenvolvimento):** `http://localhost:3000`

| Método | Rota | Autenticação | Descrição |
| --- | --- | :---: | --- |
| `POST` | `/auth/cadastro` | ❌ | Cria um novo usuário |
| `POST` | `/auth/login` | ❌ | Autentica um usuário |
| `GET` | `/veiculos` | ✅ | Lista veículos (filtro opcional por disponibilidade) |
| `POST` | `/veiculos` | ✅ | Cadastra um veículo |
| `GET` | `/locacoes` | ✅ | Lista as locações do usuário autenticado |
| `POST` | `/locacoes` | ✅ | Cria uma locação |
| `PATCH` | `/locacoes/:id/finalizar` | ✅ | Finaliza (devolve) uma locação |

---

### `POST /auth/cadastro`

Cria um usuário e já retorna o token de acesso.

**Body**

| Campo | Tipo | Regras |
| --- | --- | --- |
| `name` | `string` | mínimo 2 caracteres |
| `email` | `string` | e-mail válido |
| `password` | `string` | mínimo 6 caracteres |
| `confirmPassword` | `string` | mínimo 6 caracteres, igual a `password` |

```json
{
  "name": "João da Silva",
  "email": "joao@exemplo.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

**Resposta `201 Created`**

```json
{
  "data": {
    "id": 1,
    "name": "João da Silva",
    "email": "joao@exemplo.com",
    "createdAt": "2026-11-16T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Cadastro realizado com sucesso"
}
```

**Erros:** `400` dados inválidos · `409` e-mail já cadastrado · `422` senhas não coincidem

---

### `POST /auth/login`

**Body**

```json
{
  "email": "joao@exemplo.com",
  "password": "123456"
}
```

**Resposta `200 OK`** — mesmo formato do cadastro, com `"message": "Login realizado com sucesso"`.

**Erros:** `400` dados inválidos · `401` e-mail ou senha inválidos

---

### `GET /veiculos`

Lista os veículos ordenados por `id`.

**Query params (opcional)**

| Parâmetro | Valores | Descrição |
| --- | --- | --- |
| `disponivel` | `true` \| `false` | Filtra pela disponibilidade. Se omitido, retorna todos. |

```http
GET /veiculos?disponivel=true
```

**Resposta `200 OK`**

```json
[
  {
    "id": 1,
    "brand": "Fiat",
    "model": "Argo",
    "licensePlate": "ABC1D23",
    "year": 2024,
    "dailyRate": 150,
    "available": true
  }
]
```

**Erros:** `400` parâmetro inválido · `401` não autenticado

---

### `POST /veiculos`

**Body**

| Campo | Tipo | Regras |
| --- | --- | --- |
| `brand` | `string` | obrigatório (espaços removidos) |
| `model` | `string` | obrigatório (espaços removidos) |
| `licensePlate` | `string` | obrigatório, único |
| `year` | `number` | inteiro |
| `dailyRate` | `number` | positivo |

```json
{
  "brand": "Fiat",
  "model": "Argo",
  "licensePlate": "ABC1D23",
  "year": 2024,
  "dailyRate": 150.0
}
```

**Resposta `201 Created`** — o veículo criado (mesmo formato da listagem).

**Erros:** `400` dados inválidos · `401` não autenticado · `409` veículo já cadastrado

---

### `GET /locacoes`

Lista as locações do usuário autenticado, ordenadas por `id`, com os dados do veículo.

**Resposta `200 OK`**

```json
[
  {
    "id": 1,
    "userId": 1,
    "vehicleId": 1,
    "startDate": "2026-11-20T00:00:00.000Z",
    "expectedReturnDate": "2026-11-23T00:00:00.000Z",
    "returnDate": null,
    "totalAmount": 450,
    "status": "ACTIVE",
    "vehicle": {
      "id": 1,
      "brand": "Fiat",
      "model": "Argo",
      "licensePlate": "ABC1D23",
      "year": 2024,
      "dailyRate": 150,
      "available": false
    }
  }
]
```

**Erros:** `401` não autenticado

---

### `POST /locacoes`

**Body**

| Campo | Tipo | Regras |
| --- | --- | --- |
| `vehicleId` | `number` | inteiro positivo |
| `startDate` | `string` (data ISO) | data válida |
| `expectedReturnDate` | `string` (data ISO) | data válida, posterior a `startDate` |

```json
{
  "vehicleId": 1,
  "startDate": "2026-11-20",
  "expectedReturnDate": "2026-11-23"
}
```

**Resposta `201 Created`** — a locação criada (mesmo formato da listagem), com `totalAmount` calculado pela API.

**Erros:** `400` dados inválidos · `401` não autenticado · `404` veículo não encontrado · `409` veículo indisponível

---

### `PATCH /locacoes/:id/finalizar`

Finaliza uma locação ativa do usuário autenticado e libera o veículo.

```http
PATCH /locacoes/1/finalizar
```

**Resposta `200 OK`** — a locação atualizada, com `status: "COMPLETED"`, `returnDate` preenchido e `vehicle.available: true`.

**Erros:** `401` não autenticado · `403` locação pertence a outro usuário · `404` locação não encontrada · `409` locação já finalizada

---

### Exemplos com `curl`

```bash
# Cadastro
curl -X POST http://localhost:3000/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@exemplo.com","password":"123456","confirmPassword":"123456"}'

# Login (guarde o token retornado)
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@exemplo.com","password":"123456"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')

# Cadastrar veículo
curl -X POST http://localhost:3000/veiculos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"brand":"Fiat","model":"Argo","licensePlate":"ABC1D23","year":2024,"dailyRate":150}'

# Listar veículos disponíveis
curl "http://localhost:3000/veiculos?disponivel=true" -H "Authorization: Bearer $TOKEN"

# Criar locação
curl -X POST http://localhost:3000/locacoes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"vehicleId":1,"startDate":"2026-11-20","expectedReturnDate":"2026-11-23"}'

# Finalizar locação
curl -X PATCH http://localhost:3000/locacoes/1/finalizar -H "Authorization: Bearer $TOKEN"
```

---

## ⚠️ Tratamento de erros

Todas as respostas de erro são JSON e seguem um destes formatos:

**Erro de domínio** (classes que estendem `ApiError`):

```json
{ "message": "Veículo indisponível para locação" }
```

**Erro de validação** (Zod — `400 Bad Request`):

```json
{
  "message": "Dados do body inválidos",
  "errors": [
    { "field": "email", "description": "E-mail inválido" }
  ]
}
```

> Para query string, a mensagem é `"Parâmetros de consulta inválidos"`.

### Catálogo de erros

| Classe | Status | Mensagem |
| --- | :---: | --- |
| `UnauthorizedError` | `401` | Operação não autorizada / Token inválido ou expirado |
| `InvalidCredentialsError` | `401` | E-mail ou senha inválidos |
| `EmailAlreadyExistsError` | `409` | E-mail já está cadastrado |
| `PasswordsNotMatchError` | `422` | Senhas não coincidem |
| `VehicleNotFoundError` | `404` | Veículo não encontrado |
| `VehicleAlreadyExistsError` | `409` | Veículo já cadastrado |
| `VehicleUnavailableError` | `409` | Veículo indisponível para locação |
| `RentalNotFoundError` | `404` | Locação não encontrada |
| `RentalForbiddenError` | `403` | Você não tem permissão para finalizar esta locação |
| `RentalAlreadyFinalizedError` | `409` | Locação já finalizada |
| *(erro inesperado)* | `500` | Erro interno do servidor |

Para criar um novo erro de domínio, estenda `ApiError` em `src/errors/<domínio>/`:

```ts
import { ApiError } from "../ApiError";

export class MeuErro extends ApiError {
  constructor() {
    super(400, "Descrição do erro");
  }
}
```

---

## 🔧 Variáveis de ambiente

As variáveis ficam no arquivo `.env` na **raiz do repositório** (use o [`.env.example`](../.env.example) como base). Ao rodar a API fora do Docker, crie também um `.env` dentro de `api/` (ou exporte as variáveis no terminal).

| Variável | Obrigatória | Padrão | Descrição |
| --- | :---: | --- | --- |
| `DATABASE_URL` | ✅ | — | String de conexão do PostgreSQL |
| `JWT_SECRET` | ✅ | — | Segredo usado para assinar e validar os tokens |
| `API_PORT` | ❌ | `3000` | Porta HTTP da API |
| `POSTGRES_USER` | ❌ | `postgres` | Usuário do banco (Docker Compose) |
| `POSTGRES_PASSWORD` | ❌ | `frotaprime` | Senha do banco (Docker Compose) |
| `POSTGRES_DB` | ❌ | `frotaprime` | Nome do banco (Docker Compose) |
| `DB_PORT` | ❌ | `5434` | Porta exposta do PostgreSQL (Docker Compose) |

Exemplo:

```env
DATABASE_URL="postgresql://postgres:frotaprime@localhost:5434/frotaprime?schema=public"
JWT_SECRET=troque-este-valor
API_PORT=3000
```

Para gerar um `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

> ⚠️ O valor padrão de `JWT_SECRET` no Docker Compose serve **apenas para desenvolvimento**. Nunca o utilize em produção.

---

## 🚀 Como executar

### Opção 1 — Docker (recomendado)

Pré-requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine com Compose 2.22+).

Na **raiz do repositório**:

```bash
docker compose up --build --watch
```

Isso sobe o PostgreSQL, a API e o frontend. Ao iniciar, o container da API executa automaticamente:

1. `prisma generate` — gera o Prisma Client;
2. `prisma migrate deploy` — aplica as migrations pendentes;
3. `npm run dev` — inicia o servidor em modo watch.

Com `--watch`, alterações em `api/src` são sincronizadas e recarregadas automaticamente; mudanças em `package.json`/`package-lock.json` reconstroem a imagem.

API disponível em **http://localhost:3000**.

### Opção 2 — Localmente

Pré-requisitos: **Node.js 24+** e um **PostgreSQL 16** em execução (pode ser só o serviço do banco via `docker compose up db`).

```bash
cd api

# 1. Instalar dependências e gerar o Prisma Client
npm run setup

# 2. Configurar o .env (DATABASE_URL e JWT_SECRET)
cp ../.env.example .env

# 3. Aplicar as migrations
npx prisma migrate deploy --config prisma7.config.ts

# 4. Iniciar em modo desenvolvimento
npm run dev
```

Para build de produção:

```bash
npm run build
npm start
```

---

## 📜 Scripts disponíveis

| Script | Comando | Descrição |
| --- | --- | --- |
| `dev` | `tsx watch src/server.ts` | Inicia o servidor com recarregamento automático |
| `build` | `tsc` | Compila o TypeScript para `dist/` |
| `start` | `node dist/server.js` | Executa a versão compilada |
| `setup` | `npm install && npx prisma generate` | Instala dependências e gera o Prisma Client |
| `prisma:generate` | `npx prisma generate` | Regenera o Prisma Client |
| `prisma:migrate` | `npx prisma migrate dev` | Cria/aplica migrations em desenvolvimento |
| `prisma:studio` | `npx prisma studio` | Abre o Prisma Studio para inspecionar os dados |

Na raiz do repositório também existem os atalhos `npm run setup` e `npm run dev:api`.

---

## 🧬 Banco de dados e migrations

O projeto usa **Prisma 7** com configuração em [`prisma7.config.ts`](./prisma7.config.ts), que define o caminho do schema, das migrations e lê a `DATABASE_URL` do ambiente. O Prisma Client é gerado em `src/generated/prisma` (pasta ignorada pelo Git) e a conexão é feita através do driver adapter `@prisma/adapter-pg`.

```bash
# Criar uma nova migration após alterar o schema.prisma
npx prisma migrate dev --config prisma7.config.ts --name nome_da_migration

# Aplicar migrations pendentes (ex.: após um git pull)
npx prisma migrate deploy --config prisma7.config.ts

# Inspecionar o banco visualmente
npx prisma studio --config prisma7.config.ts
```

Com Docker:

```bash
# Criar migration dentro do container
docker compose exec api npx prisma migrate dev --config prisma7.config.ts --name nome_da_migration

# Aplicar migrations novas (o container aplica ao reiniciar)
docker compose restart api
```

---

## 👥 Autores

| [calebearcilio](https://github.com/calebearcilio) | [luispaivaa](https://github.com/luispaivaa) | [matheushromao](https://github.com/matheushromao) |
| :---: | :---: | :---: |

---

## 📄 Licença

Distribuído sob a licença **ISC**.

<div align="center">

[⬅ Voltar para o README principal](../README.md) · [Ver README do Frontend ➡](../frontend/README.md)

</div>
