# FrotaPrime
Sistema de locação de veículos

# Rodando com Docker

O único requisito é o [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine com Compose 2.22+). Não é preciso instalar Node nem MySQL, nem criar `.env`.

```bash
git clone https://github.com/calebearcilio/FrotaPrime.git
cd FrotaPrime
docker compose up --build --watch
```

| Serviço | Endereço |
| --- | --- |
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| MySQL | `localhost:3307` (usuário `root`, senha `frotaprime`, banco `frotaprime`) |

As migrations são aplicadas ao subir a API. Alterações em `api/src` e `frontend/src` recarregam sozinhas enquanto o `--watch` estiver ativo, e mudanças em `package.json` ou `package-lock.json` reconstroem a imagem.

## Comandos do dia a dia

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

## Porta ocupada

Se alguma porta já estiver em uso na sua máquina, copie `.env.example` para `.env` e troque o valor dela.

# Setup sem Docker

```bash
git clone https://github.com/calebearcilio/FrotaPrime.git
```
```bash
npm run setup
```
```bash
npm run dev:api
```