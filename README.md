<div align="center">

# 🚗 FrotaPrime

**Sistema de locação de veículos**

![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

</div>

---

## 📖 Sobre

O **FrotaPrime** é uma aplicação full stack para gestão de locação de veículos. Usuários criam uma conta, cadastram veículos na frota, registram locações com cálculo automático do valor e finalizam a devolução, liberando o veículo para novas locações.

| Módulo | Descrição | Documentação |
| --- | --- | --- |
| **API** (`api/`) | REST API em Node.js + Express + Prisma + PostgreSQL | [📘 README da API](./api/README.md) |
| **Frontend** (`frontend/`) | SPA em React + Vite + TypeScript | [📗 README do Frontend](./frontend/README.md) |

```
┌──────────────┐   HTTP/JSON + JWT   ┌──────────────┐   Prisma   ┌──────────────┐
│   Frontend   │ ──────────────────► │     API      │ ─────────► │  PostgreSQL  │
│ React + Vite │ ◄────────────────── │   Express    │ ◄───────── │      16      │
│    :5173     │                     │    :3000     │            │    :5432     │
└──────────────┘                     └──────────────┘            └──────────────┘
```

---

## 🚀 Rodando com Docker

O único requisito é o [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine com Compose 2.22+). Não é preciso instalar Node nem PostgreSQL, nem criar `.env`.

```bash
git clone https://github.com/calebearcilio/FrotaPrime.git
cd FrotaPrime
docker compose up --build --watch
```

| Serviço | Endereço |
| --- | --- |
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| PostgreSQL | `localhost:5432` (usuário `postgres`, senha `frotaprime`, banco `frotaprime`) |

As migrations são aplicadas ao subir a API. Alterações em `api/src` e `frontend/src` recarregam sozinhas enquanto o `--watch` estiver ativo, e mudanças em `package.json` ou `package-lock.json` reconstroem a imagem.

### Comandos do dia a dia

```bash
# Parar tudo (mantém os dados do banco)
docker compose down

# Apagar também os dados do banco
docker compose down -v

# Ver os logs de um serviço
docker compose logs -f api

# Criar uma migration depois de alterar o schema.prisma
docker compose exec api npx prisma migrate dev --config prisma7.config.ts --name nome_da_migration

# Aplicar migrations novas depois de um git pull
docker compose restart api
```

### Porta ocupada

Se alguma porta já estiver em uso na sua máquina, copie `.env.example` para `.env` e altere `API_PORT`, `FRONTEND_PORT` ou `DB_PORT`.

---

## 💻 Rodando sem Docker

Requer **Node.js 24+** e um **PostgreSQL 16** acessível. Os passos detalhados estão em cada módulo:

- [Executar a API localmente](./api/README.md#-como-executar)
- [Executar o frontend localmente](./frontend/README.md#-como-executar)

Resumo:

```bash
git clone https://github.com/calebearcilio/FrotaPrime.git
cd FrotaPrime

# API
npm run setup        # instala dependências da API e gera o Prisma Client
npm run dev:api      # inicia a API em modo watch

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

---

## 👥 Autores

| [calebearcilio](https://github.com/calebearcilio) | [luispaivaa](https://github.com/luispaivaa) | [matheushromao](https://github.com/matheushromao) |
| :---: | :---: | :---: |

## 📄 Licença

Distribuído sob a licença **ISC**.
